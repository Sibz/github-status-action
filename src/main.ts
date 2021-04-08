import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'
import makeStatus, { StatusRequest } from './makeStatusRequest'
import makeStatusRequest from './makeStatusRequest';
import { RequestParameters } from '@octokit/types';

async function run(): Promise<void> {
  const authToken: string = core.getInput('authToken');
  let octokit: Octokit | null = null;

  try {
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
    core.setFailed(`Error creating status request object: ${error.message}`);
    return;
  }

  try {
    await octokit.repos.createStatus(statusRequest);
  } catch (error) {
    core.setFailed(`Github returned error \"${error.message}\" when setting status on commit: ${statusRequest.sha}\n` +
      ` Request object:\n` +
      ` ${JSON.stringify(statusRequest, null, 2)}` +
      ` Possible issues could be that the token used does not have access to the repository containing the commit or the commit/repository does not exist.`
    );
  }
}

run();
