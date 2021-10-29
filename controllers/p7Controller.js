import Tesseract from 'tesseract.js';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import Utils from '../utils/utils.js';

const fsP = fs.promises;
const jobs = {};

const deleteTrainedData = async () => {
  const files = await fsP.readdir('./');

  files.forEach((file) => {
    if (file.includes('traineddata')) fsP.unlink(file);
  });
};

const createJobWorkers = async (jobId, req) => {
  await deleteTrainedData();

  jobs[jobId] = {};

  req.files.forEach((file) => {
    const { filename } = file;
    const job = jobs[jobId];

    job[filename] = { text: 'Processing the file', error: false, done: false };
    const jobFile = job[filename];

    Tesseract.recognize(Utils.filePath(`images/${filename}`), 'eng')
      .then((d) => {
        jobFile.text = d.data.text;
        jobFile.done = true;
      })
      .catch(() => {
        jobFile.error = true;
        jobFile.done = true;
      });
  });
};

const isJobDone = (job) => jobs[job] && Object.values(jobs[job]).every(({ done }) => done);
const jobPath = (req, path, jobId) => `https://${req.headers.host}${path}${jobId}`;

const renderJob = (job) => Object.entries(job).reduce(
  (acc, [imageName, jobState]) => `
  ${acc}
  <div class="jobContainer">
  <img class="jobImage" src="/images/${imageName}" alt="${imageName}"/>
  <p>${jobState.error ? 'Error occured' : jobState.text}</p>
  </div>`,
  '',
);

export const handleImageUpload = async (req, res) => {
  try {
    const jobId = uuid();

    createJobWorkers(jobId, req);

    return res.status(201).send({
      jobUrl: jobPath(req, '/p7/imageAnalysis/jobs/', jobId),
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: { message: "Couldn't create job workers" } });
  }
};

export const handleJob = (req, res) => {
  const { jobId } = req.params;
  let html = "<h1>Job doesn't exist</h1>";

  if (jobs[jobId]) {
    html = `
    <style>
      * {
        box-sizing: border-box;
      }
      
      .jobContainer {
        display: flex; 
        column-gap: 40px; 
        max-width: 600px; 
        margin: 30px auto;
      }

      .jobImage {
        max-width: 400
      }
    </style>
    <h1>Job process: ${jobId}</h1>
    <div>
    ${renderJob(jobs[jobId])}
    </div>
    <script>
    const timeouts = [];
    const getProcessUpdates = async () => {
      const job = await fetch("${jobPath(
    req,
    '/p7/imageAnalysis/jobs/',
    jobId,
  )}")

      const jobHtml = await job.text()
      document.body.innerHTML = jobHtml

      const jobDone = await fetch("${jobPath(
    req,
    '/p7/imageAnalysis/jobs/state/',
    jobId,
  )}")

      const isJobDone = await jobDone.text();
      if (isJobDone === "true") return timeouts.forEach((id) => clearTimeout(id))

      timeouts.push(setTimeout(() => getProcessUpdates(), 2000))
    }
    
    getProcessUpdates()
    </script>
    `;
  }

  res.send(html);
};

export const handleJobDone = (req, res) => res.send(isJobDone(req.params.jobId));
