import * as core from '@actions/core'
import * as github from '@actions/github'
import makeStatus, { StatusRequest } from './makeStatusRequest'
import makeStatusRequest from './makeStatusRequest';
import { RequestParameters } from '@octokit/types';

async function run(): Promise<void> {
  const authToken: string = core.getInput('authToken');
  let octokit: any | null = null;

  try {
    octokit = github.getOctokit(authToken);
  } catch (error: any) {
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
  catch (error: any) {
    core.setFailed(`Error creating status request object: ${error.message}`);
    return;
  }

  try {   
    await octokit.repos.createStatus(statusRequest);
  } catch (error: any) {
    core.setFailed(`Error setting status:\n${error.message}\nRequest object:\n${JSON.stringify(statusRequest, null, 2)}`);
  }
}

run();
