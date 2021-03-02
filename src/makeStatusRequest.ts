import * as actionsCore from '@actions/core'
import inputNames from './inputNames';
import { RequestParameters } from '@octokit/types';

export type CommitState = "success" | "error" | "failure" | "pending";
export type StatusRequest = RequestParameters & Pick<any, "owner" | "repo" | "state" | "sha" | "description" | "context" | "target_url">;
export const ERR_INVALID_OWNER = "Input 'owner' must be a valid GitHub username";
export const ERR_INVALID_STATE = "Input 'state' must be one of success | error | failure | pending";

const regExUsername = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export default function makeStatusRequest(testCore: any | null = null): StatusRequest {
    let core: CoreActionsForTesting =
        testCore as CoreActionsForTesting ?? actionsCore as CoreActionsForTesting;

    let request: StatusRequest = {} as StatusRequest;

    request.context = core.getInput(inputNames.context);
    request.description = core.getInput(inputNames.desc);
    request.state = core.getInput(inputNames.state) as CommitState;
    request.owner = core.getInput(inputNames.owner);
    request.repo = core.getInput(inputNames.repo);
    request.sha = core.getInput(inputNames.sha);
    request.target_url = core.getInput(inputNames.target_url);

    if (!regExUsername.test(request.owner)) {
        throw new Error(ERR_INVALID_OWNER);
    }

    if (!validateState(request.state)) {
        throw new Error(ERR_INVALID_STATE);
    }

    if (request.repo.startsWith(`${request.owner}/`)) {
        request.repo = request.repo.replace(`${request.owner}/`, '');
    }

    return request;
}

function validateState(state: any): boolean {
    return (state == "success"
        || state == "error"
        || state == "failure"
        || state == "pending");
}
export interface CoreActionsForTesting {
    getInput: (arg: string) => string
}
