import { combineReducers } from "redux";
import testTypeReducer from "./testTypeReducer";

const rootReducer = combineReducers({
  testType: testTypeReducer,
});

export default rootReducer;
