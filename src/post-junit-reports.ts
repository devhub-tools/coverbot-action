import * as core from "@actions/core"
import axios, { AxiosResponse } from "axios"
import fs from "fs"
import path from "path"

export const postJUnitReports = async (domain: String, repoOwner: String, repo: String, sha: String): Promise<void> => {
  const folderPath = core.getInput("junit_folder")
  const files = fs.readdirSync(folderPath)
  const headers = {
    "x-api-key": core.getInput("devhub_api_key"),
    "content-type": "multipart/form-data",
  }

  let uploadedFilesNumber = 0

  if (files.length === 0) {
    core.info(`No files found in folder ${folderPath}`)
    return
  }

  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isFile() && path.extname(file) === ".xml") {
      core.info(`Uploading file ${file}`)

      try {
        const res = axios.post(
          `https://${domain}/api/v1/coverbot/junit/${repoOwner}/${repo}/${sha}`,
          {
            junit_xml: fs.createReadStream(filePath),
          },
          {
            headers,
          }
        )

        uploadedFilesNumber++

        core.info(`File ${file} uploaded successfully`)
      } catch (error) {
        core.error(`Error uploading file ${file}`)
      }
    }
  }

  core.info(`Uploaded ${uploadedFilesNumber} JUnit files`)
}
