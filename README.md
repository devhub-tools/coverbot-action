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
        devhub_api_key: ${{ secrets.DEVHUB_API_KEY}}
        github_token: ${{ secrets.GITHUB_TOKEN}}
```

## Inputs

-   `format`: (Required) file format (currently only `elixir` and `go` are supported).

-   `file`: (Required) A json file containing code coverage results.

-   `devhub_api_key`: (Required) You will need to create an API key on
    https://app.coverbot.io/api-keys and save it as a secret in GitHub
    Actions settings.

-   `github_token`: (Required) Access from `${{ secrets.GITHUB_TOKEN }}`

## Outputs

-   `covered`: Number of lines covered.

-   `relevant`: Number of lines considered relevant.

-   `percentage`: The coverage percentage.

## Add the coverage badge to your README.md

```markdown
![coverbot](https://api.coverbot.io/OWNER/REPO/DEFAULT_BRANCH/badge.svg)
```