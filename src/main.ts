import * as core from "@actions/core";
import * as github from '@actions/github';
import makeStatusRequest, { StatusRequest } from "./makeStatusRequest";

async function run(): Promise<void> {
  const authToken: string = core.getInput("authToken");
  let octokit: any | null = null;

  try {
    octokit = github.getOctokit(authToken);
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

  let statusRequest: StatusRequest;
  try {
    statusRequest = makeStatusRequest();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating status request object: ${error.message}`);
    }
    return;
  }

  try {
    await octokit.rest.repos.createCommitStatus(statusRequest);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(
        `Github returned error "${error.message}" when setting status on commit: ${statusRequest.sha}\n` +
          ` Request object:\n` +
          ` ${JSON.stringify(statusRequest, null, 2)}` +
          ` Possible issues could be that the token used does not have access to the repository containing the commit or the commit/repository does not exist.`
      );
    }
  }
}

run();
