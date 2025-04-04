import * as core from "@actions/core"
import * as github from "@actions/github"
import { getChangedFiles } from "./changed-files"
import { parse } from "./parse"
import { postCoverage } from "./post-coverage"
import { postJUnitReport } from "./post-junit-report"

async function run(): Promise<void> {
  try {
    const token = core.getInput("github_token")
    const format = core.getInput("format")
    const file = core.getInput("file")
    const domain = core.getInput("domain")
    const subdirectory = core.getInput("subdirectory") || ""
    const repoOwner = github.context.repo.owner
    const repo = github.context.repo.repo
    const sha = github.context.sha

    const octokit = github.getOctokit(token)

    // changedFiles only currently supported for PRs
    const changedFiles = github.context.eventName === "pull_request" ? await getChangedFiles(octokit) : {}

    const { covered, coveredForPatch, relevant, relevantForPatch, percentage, patchPercentage, annotations, files } =
      await parse(format, file, changedFiles, subdirectory)

    core.setOutput("covered", covered)
    core.setOutput("relevant", relevant)
    core.setOutput("percentage", percentage)

    const payload = {
      covered,
      relevant,
      percentage,
      files,
      owner: repoOwner,
      repo,
      default_branch: github.context.payload.repository?.default_branch,
      context: {
        ref: github.context.ref,
        sha,
        payload: {
          pull_request: {
            head: {
              sha: github.context.payload.pull_request?.head.sha,
            },
          },
        },
      },
    }

    const res = await postCoverage(domain, payload)

    if (!res.result) return core.setFailed("Failed to report coverage")

    if (core.getInput("junit_file") != '') {
      const junitRes = await postJUnitReport(domain, repoOwner, repo, res.result.sha)

      if (junitRes.status !== 200) return core.setFailed("Failed to report junit")
    }

    octokit.rest.repos.createCommitStatus({
      ...github.context.repo,
      sha: res.result.sha,
      state: res.result.state,
      context: "coverbot",
      description: res.result.message,
    })

    if (annotations.length > 0 || (relevantForPatch && relevantForPatch > 0)) {
      const { data: checkRun } = await octokit.rest.checks.create({
        ...github.context.repo,
        status: "in_progress",
        name: "coverbot",
        head_sha: res.result.sha,
      })

      const chunkSize = 50

      const annotationChunks = Array.from(new Array(Math.ceil(annotations.length / chunkSize)), (_, i) =>
        annotations.slice(i * chunkSize, i * chunkSize + chunkSize)
      )

      for (const chunk of annotationChunks) {
        octokit.rest.checks.update({
          ...github.context.repo,
          check_run_id: checkRun.id,
          output: {
            title: "coverbot coverage report",
            summary: `Overall: ${res.result.message}`,
            annotations: chunk,
          },
        })
      }

      octokit.rest.checks.update({
        ...github.context.repo,
        check_run_id: checkRun.id,
        conclusion: res.result.state,
      })

      if (relevantForPatch && relevantForPatch > 0) {
        octokit.rest.repos.createCommitStatus({
          ...github.context.repo,
          sha: res.result.sha,
          state: Number(patchPercentage) >= Number(percentage) ? "success" : "failure",
          context: "coverbot (patch)",
          description: `${coveredForPatch} lines covered out of ${relevantForPatch} (${patchPercentage}%)`,
          target_url: `https://${domain}/coverbot/coverage/${res.result.id}`,
        })
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
