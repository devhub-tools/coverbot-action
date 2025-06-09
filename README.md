# Coverbot

Fast tool to track code coverage, get your API key at https://devhub.tools

## Usage

```yaml
# ...

on:
  # pull_request trigger is required for annotations and patch coverage
  pull_request:
  # you should also run the coverage check on your default branch so
  # PR runs can compare against it
  push:
    branches:
      - main

# these are the minimum permissions needed
permissions:
  checks: write
  contents: read
  pull-requests: read
  statuses: write

jobs:
  tests:
    # ...

    steps:
    # ...

    - name: Check Code Coverage
      uses: devhub-tools/coverbot-action@v1
      with:
        format: elixir
        file: cover/excoveralls.json
        junit_folder: junit
        devhub_api_key: ${{ secrets.DEVHUB_API_KEY}}
        github_token: ${{ secrets.GITHUB_TOKEN}}
```

## Inputs

-  `domain`: (Required) The domain of your Devhub instance.

-   `format`: (Required) file format (currently only `elixir`, `go`, `lcov`, and `ruby` are supported, reach out to support@devhub.tools for expanded language support).

-   `file`: (Required) A json file containing code coverage results.

-   `junit_folder`: (Optional) A folder containing JUnit XML files. Make sure the name of each file reflects the name of the test suite, so different test suite runs can be grouped under the same test suite.

-   `devhub_api_key`: (Required) You will need to create an API key in the settings of your installed app and save it as a secret in GitHub
    Actions settings.

-   `github_token`: (Required) Access from `${{ secrets.GITHUB_TOKEN }}`

## Outputs

-   `covered`: Number of lines covered.

-   `relevant`: Number of lines considered relevant.

-   `percentage`: The coverage percentage.

## Add the coverage badge to your README.md

```markdown
![coverbot](https://img.shields.io/endpoint?url=https://${DOMAIN}/coverbot/v1/${OWNER}/${REPO}/${BRANCH}/badge.json)
```
