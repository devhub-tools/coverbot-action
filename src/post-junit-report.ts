import * as core from "@actions/core"
import axios, { AxiosResponse } from "axios"
import fs from "fs"

export const postJUnitReport = async (
  domain: String,
  repoOwner: String,
  repo: String,
  sha: String
): Promise<AxiosResponse> => {
  const filePath = core.getInput("junit_file")

  // check if the file exists
  fs.access(filePath, fs.constants.F_OK)
    .then(() => {
      const headers = {
        "x-api-key": core.getInput("devhub_api_key"),
        "content-type": "multipart/form-data",
      }

      const res = await axios.post(
        `https://${domain}/api/v1/coverbot/junit/${repoOwner}/${repo}/${sha}`,
        {
          junit_xml: fs.createReadStream(filePath),
        },
        {
          headers,
        }
      )

      return res
    })
    .catch(() => {
      console.error("File does not exist:", filePath)
    })
}
