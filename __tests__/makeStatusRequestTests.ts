import test from 'ava';
import makeStatusRequest, { CoreActionsForTesting, CommitState, ERR_INVALID_OWNER, ERR_INVALID_STATE} from '../src/makeStatusRequest'
import inputNames from '../src/inputNames'

const INPUT_CONTEXT = "test context";
const INPUT_OWNER = "TestOwner";
const INPUT_OWNER_INVALID = "-TestOwner";
const INPUT_REPOSITORY = "Test.Repository-1";
const INPUT_REPOSITORY_WITH_OWNER = INPUT_OWNER + "/Test.Repository-1";
const INPUT_STATE: CommitState = "success";
const INPUT_STATE_INVALID: CommitState = "failed" as CommitState;
const INPUT_DESC = "Test Description";
const INPUT_SHA = "TestSHA";
const INPUT_TARGET_URL = "test/uri";

const actionsCore: CoreActionsForTesting = {
    getInput: (arg:string) => {
        switch(arg) {
            case inputNames.context:
                return INPUT_CONTEXT;
            case inputNames.owner:
                return INPUT_OWNER;
            case inputNames.repo:
                return INPUT_REPOSITORY;
            case inputNames.state:
                return INPUT_STATE;
            case inputNames.desc:
                return INPUT_DESC;
            case inputNames.sha:
                return INPUT_SHA;
            case inputNames.target_url:
               return INPUT_TARGET_URL;
            default:
                return "input not in test mock";
        }
    }
}
const actionsCoreAlt1: CoreActionsForTesting = {
    getInput: (arg:string) => {
        switch(arg) {
            case inputNames.repo:
                return INPUT_REPOSITORY_WITH_OWNER;
            default:
                return actionsCore.getInput(arg);
        }
    }
}

const actionsCoreAlt2: CoreActionsForTesting = {
    getInput: (arg:string) => {
        switch(arg) {
            case inputNames.owner:
                return INPUT_OWNER_INVALID;
            default:
                return actionsCore.getInput(arg);
        }
    }
}

const actionsCoreAlt3: CoreActionsForTesting = {
    getInput: (arg:string) => {
        switch(arg) {
            case inputNames.state:
                return INPUT_STATE_INVALID;
            default:
                return actionsCore.getInput(arg);
        }
    }
}


test("should getInput context", t=> {
    t.is(makeStatusRequest(actionsCore).context, INPUT_CONTEXT);
});
test("should getInput owner", t=> {
    t.is(makeStatusRequest(actionsCore).owner, INPUT_OWNER);
});
test("should getInput repo", t=> {
    t.is(makeStatusRequest(actionsCore).repo, INPUT_REPOSITORY);
});
test("should getInput state", t=> {
    t.is(makeStatusRequest(actionsCore).state, INPUT_STATE);
});
test("should getInput description", t=> {
    t.is(makeStatusRequest(actionsCore).description, INPUT_DESC);
});
test("should getInput sha", t=> {
    t.is(makeStatusRequest(actionsCore).sha, INPUT_SHA);
});
test("should getInput target_url", t=> {
   t.is(makeStatusRequest(actionsCore).target_url, INPUT_TARGET_URL);
});

test("should getInput repo and remove leading owner name", t=> {
    t.is(makeStatusRequest(actionsCoreAlt1).repo, INPUT_REPOSITORY);
});

test("when owner is not a valid GitHub username, should throw", t=> {
    let err = t.throws(()=> makeStatusRequest(actionsCoreAlt2));
    t.is(err.message, ERR_INVALID_OWNER)
});

test("should validate state", t=> {
    let err = t.throws(()=> makeStatusRequest(actionsCoreAlt3));
    t.is(err.message, ERR_INVALID_STATE)
});