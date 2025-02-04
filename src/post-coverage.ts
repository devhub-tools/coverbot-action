import * as core from "@actions/core"
import { HttpClient } from "@actions/http-client"
import { TypedResponse } from "@actions/http-client/lib/interfaces"

type CoverageResponse = {
  id: string
  sha: string
  state: "failure" | "success"
  message: string
}

export const postCoverage = async (
  domain: String,
  payload = {},
  retries = 3,
  backoff = 300
): Promise<TypedResponse<CoverageResponse>> => {
  const http = new HttpClient("devhub-tools/coverage-action")
  const retryCodes = [400, 408, 500, 502, 503, 504, 522, 524]

  const res: TypedResponse<CoverageResponse> = await http.postJson(`https://${domain}/coverbot/v1/coverage`, payload, {
    "x-api-key": core.getInput("devhub_api_key"),
  })

  if (res.statusCode === 200) return res

  if (retries > 0 && retryCodes.includes(res.statusCode)) {
    await new Promise(resolve => setTimeout(resolve, backoff))
    return postCoverage(domain, payload, retries - 1, backoff * 2)
  } else {
    return res
  }
}
