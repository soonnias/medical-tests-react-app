import { combineReducers } from "redux";
import testTypeReducer from "./testTypeReducer";
import patientReducer from "./patientReducer";
import diagnosisReducer from "./diagnosisReducer";
import medicalTestReducer from "./medicalTestReducer";

const rootReducer = combineReducers({
  testType: testTypeReducer,
  patients: patientReducer,
  diagnosis: diagnosisReducer,
  medicalTests: medicalTestReducer,
});

export default rootReducer;
