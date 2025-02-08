import { combineReducers } from "redux";
import testTypeReducer from "./testTypeReducer";
import patientReducer from "./patientReducer";

const rootReducer = combineReducers({
  testType: testTypeReducer,
  patients: patientReducer,
});

export default rootReducer;
