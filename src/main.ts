import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'

async function run(): Promise<void> {
  let authToken: string = '';
  let context: string = '';
  let description: string = '';
  let state: any = '';
  let owner: string = '';
  let repository: string = '';
  let sha: string = '';

  let octokit: Octokit | null = null;

  try {
    authToken = core.getInput('authToken');
    context = core.getInput('context');
    description = core.getInput('description');
    state = core.getInput('state');
    owner = core.getInput('owner');
    repository = core.getInput('repository');
    sha = core.getInput('sha');

  } catch (error) {
    core.setFailed("Error getting inputs:\n" + error.message);
  }

  try {


    if (repository.startsWith(`${owner}/`)) {
      repository = repository.replace(`${owner}/`, '');
    }

    octokit = new Octokit({
      auth: authToken,
      userAgent: "github-status-action",
      baseUrl: 'https://api.github.com',
      log: {
        debug: () => { },
        info: () => { },
        warn: console.warn,
        error: console.error
      },
      request: {
        agent: undefined,
        fetch: undefined,
        timeout: 0
      }
    });
  } catch (error) {
    core.setFailed("Error creating octokit:\n" + error.message);
  }
  if (octokit == null) {
    return;
  }
  try {
    console.log(repository);
    await octokit.repos.createStatus({
      owner: owner,
      repo: repository,
      context: context,
      sha: sha,
      state: state,
      description: description
    });
  } catch (error) {
    core.setFailed(`Error setting status:\n${error.message}\nDetails:\nowner:${owner}\nrepo:${repository}\nsha:${sha}`);
  }
}

run();
