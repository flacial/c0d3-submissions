import { promises } from "fs";
import path from "path";

const fs = promises
class AssetCreation {
    static #UNLINK_DELAY = 300000 // 5 minutes * 60,000 ms = 300000 ms
    static #FOLDER_ENTRY = './public/'

    static #normalizePath = (name) => path.normalize(this.#FOLDER_ENTRY + name)
    static #isNameValid = (name) => ((name[0] + name[1] === './') && !name.includes('/', 2)) || !name.includes('/')

    static #unLinkFile = (name) => fs.unlink(name)
    static #createFile = (name, content) => fs.writeFile(name, content)
    static #getAllFiles = () => fs.readdir(this.#FOLDER_ENTRY)
    static #getFileContent = (name) => fs.readFile(this.#FOLDER_ENTRY + name, 'utf-8')

    static #handleError = (error, code, res) => res.status(code).json({ error })

    static handleFileCreation = (req, res) => {
        const { name, content } = req.body;

        if (!name) return this.#handleError("File name is required.", 400, res)
        if (!this.#isNameValid(name)) return this.#handleError("Name is invalid. Please type a proper name.", 400, res)

        const normalizedName = this.#normalizePath(name)

        this.#createFile(normalizedName, content)
            .then(() => {
                setTimeout(() => this.#unLinkFile(normalizedName), this.#UNLINK_DELAY)

                return res.status(201).json({ message: `Created ${normalizedName}` })
            })
            .catch(() => this.#handleError("File not created.", 500, res))
    }

    static handleFilesList = (_req, res) => {
        this.#getAllFiles()
            .then(data => res.send(data))
            .catch(() => this.#handleError("Couldn't get the files.", 500, res))
    }

    static handleFileContent = (req, res) => {
        this.#getFileContent(req.params.name)
            .then(content => res.send(content))
            .catch(() => this.#handleError("Couldn't get file content.", 500, res))
    }
}

export default AssetCreation