<p align="center">
  <a href="https://github.com/Sibz/github-status-action"><img alt="github-status-action status" 
  src="https://github.com/Sibz/github-status-action/workflows/test/badge.svg"></a>
  <a href="https://github.com/Sibz/github-status-action"><img alt="github-status-action status" src="https://github.com/Sibz/github-status-action/workflows/build/badge.svg"></a>
</p>

# GitHub Status Action

Adds a status update to a commit. GitHub will always show the latest state of a context.

## Usage

### Inputs

 * `authToken` (required)  
 Use secrets.GITHUB_TOKEN or your own token if you need to trigger other workflows that use "on: status"'
 * `state` (required)  
 The status of the check should only be `success`, `error`, `failure` or `pending`
 * `context`  
 The context, this is displayed as the name of the check
 * `description`  
 Short text explaining the status of the check
 * `owner`  
 Repostory onwer, defaults to context github.repository_owner if omited
 * `repository`  
 Repository, default to context github.repository if omited
 * `sha`  
 SHA of commit to update status on, defaults to context github.sha  
 *If using `on: pull_request` use `github.event.pull_request.head.sha`*
 * `target_url`  
 Url to use for the details link. If omited no link is shown.
  
  ### Outputs
  None.

  ## Example
  ```yml
name: "test"
on: # run on any PRs and main branch changes
  pull_request:
  push:
    branches:
      - master

  jobs:
  test: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run the action # You would run your tests before this using the output to set state/desc
      uses: Sibz/github-status-action@v1
      with: 
        authToken: ${{secrets.GITHUB_TOKEN}}
        context: 'Test run'
        description: 'Passed'
        state: 'success'
        sha: ${{github.event.pull_request.head.sha || github.sha}}
```
