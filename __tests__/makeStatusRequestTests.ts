import test from 'ava';
import makeStatusRequest, { CoreActionsForTesting, CommitState} from '../src/makeStatusRequest'
import inputNames from '../src/inputNames'

const INPUT_CONTEXT = "test context";
const INPUT_OWNER = "TestOwner";
const INPUT_REPOSITORY = "Test.Repository-1";
const INPUT_REPOSITORY_WITHOWNER = INPUT_OWNER + "/Test.Repository-1";
const INPUT_STATE: CommitState = "success";
const INPUT_DESC = "Test Description";
const INPUT_SHA = "TestSHA";
//const INPUT_TARGETURL = "test/uri";

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
            //case inputNames.target_url:
              //  return INPUT_TARGETURL;
            default:
                return "input not in test mock";
        }
    }
}
const actionsCoreAlt1: CoreActionsForTesting = {
    getInput: (arg:string) => {
        switch(arg) {
            case inputNames.repo:
                return INPUT_REPOSITORY_WITHOWNER;
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
// test("should getInput target_url", t=> {
//    t.is(makeStatusRequest(actionsCore).target_url, INPUT_TARGETURL);
// });

test("should getInput repo and remove leading owner name", t=> {
    t.is(makeStatusRequest(actionsCoreAlt1).repo, INPUT_REPOSITORY);
});