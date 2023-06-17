import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'
import makeStatusRequest, { StatusRequest } from './makeStatusRequest'

async function run(): Promise<void> {
  const authToken: string = core.getInput('authToken');
  let octokit: Octokit | null = null;

  try {
    octokit = new Octokit({
      auth: authToken,
      userAgent: "github-status-action-v2",
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
    if (error instanceof Error) {
      core.setFailed("Error creating octokit:\n" + error.message);
    }
    return;
  }

  if (octokit == null) {
    core.setFailed("Error creating octokit:\noctokit was null");
    return;
  }

  let statusRequest: StatusRequest
  try {
    statusRequest = makeStatusRequest();
  }
  catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating status request object: ${error.message}`);
    }
    return;
  }

  try {   
    await octokit.repos.createCommitStatus(statusRequest);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error setting status:\n${error.message}\nRequest object:\n${JSON.stringify(statusRequest, null, 2)}`);
    }
  }
}

run();
