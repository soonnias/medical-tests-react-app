import {
  CREATE_PATIENT,
  GET_PATIENT_BY_ID,
  GET_PATIENTS,
  GET_PATIENTS_BY_PHONE,
} from "../actions/patientActions";

const initialState = {
  patients: [],
  patient: null, // Один пацієнт для пошуку за ID
  filteredPatients: [], // Пацієнти, знайдені за номером телефону
  error: null,
};

const patientReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENTS:
      return { ...state, patients: action.payload };

    case CREATE_PATIENT:
      return {
        ...state,
        patients: [...state.patients, action.payload.patient],
      };

    case GET_PATIENT_BY_ID:
      return { ...state, patient: action.payload };

    case GET_PATIENTS_BY_PHONE:
      return { ...state, filteredPatients: action.payload };

    default:
      return state;
  }
};

export default patientReducer;
