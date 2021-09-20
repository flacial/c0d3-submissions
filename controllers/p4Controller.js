import fs, { promises } from "fs";
import path from "path";

const fsAsync = promises;
const fsSync = fs;
class AssetCreation {
    #UNLINK_DELAY;
    #FOLDER_ENTRY;

    constructor(UNLINK_DELAY, FOLDER_ENTRY) {
        this.#UNLINK_DELAY = UNLINK_DELAY
        this.#FOLDER_ENTRY = FOLDER_ENTRY

        this.#createFolder(this.#FOLDER_ENTRY)
            .then(folderExist => folderExist && this.#unLinkOnStartUp())
            .catch((err) => { throw new Error("Failed to create folder: " + err) })
    }

    #createFolder = async (path) => {
        const folderExist = fsSync.existsSync(path);
        if (!folderExist) return fsAsync.mkdir(path)

        return true
    }

    #unLinkOnStartUp = () => {
        const currentTime = new Date().getTime()

        this.#getAllFiles().then(files => {
            files.forEach(async file => {
                const sanitizeName = this.#sanitizeName(file)
                const fileTime = await fsAsync.stat(sanitizeName);

                const didPassUnlinkDelay = currentTime - fileTime.mtimeMs > this.#UNLINK_DELAY;
                if (didPassUnlinkDelay) this.#unLinkFile(sanitizeName)
            })
        })
    }

    #getAllFiles = () => fsAsync.readdir(this.#FOLDER_ENTRY)
    #getFileContent = (name) => fsAsync.readFile(this.#FOLDER_ENTRY + name, 'utf-8')
    #unLinkFile = (name) => fsAsync.unlink(name)
    #createFile = (name, content) => fsAsync.writeFile(name, content)

    #handleError = (error, code, res) => res.status(code).json({ error })

    #sanitizeName = (name) => {
        const normalizedName = path.normalize(this.#FOLDER_ENTRY + name);
        const isNameValid = (name.startsWith("./") && !name.includes('/', 2)) || !name.includes('/');

        return isNameValid ? normalizedName : null
    }

    handleFileCreation = (req, res) => {
        const { name, content } = req.body;

        const sanitizedName = this.#sanitizeName(name)

        if (!name) return this.#handleError("File name is required.", 400, res)
        if (!sanitizedName) return this.#handleError("Name is invalid. Please type a proper name.", 400, res)


        this.#createFile(sanitizedName, content)
            .then(() => {
                setTimeout(() => {
                    this.#unLinkFile(sanitizedName)
                }, this.#UNLINK_DELAY)

                return res.status(201).json({ message: `Created ${sanitizedName}` })
            })
            .catch(() => this.#handleError("File not created.", 500, res))
    }

    handleFilesList = (_req, res) => {
        this.#getAllFiles()
            .then(data => res.send(data))
            .catch(() => this.#handleError("Couldn't get the files.", 500, res))
    }

    handleFileContent = (req, res) => {
        const sanitizedName = this.#sanitizeName(req.params.name)
        if (!sanitizedName) return this.#handleError("Name is invalid. Please type a proper name.", 400, res)

        this.#getFileContent(req.params.name)
            .then(content => res.send(content))
            .catch(() => this.#handleError("Couldn't get the requested file content.", 500, res))
    }
}

export default AssetCreation