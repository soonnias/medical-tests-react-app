import {
  CREATE_DIAGNOSIS,
  GET_DIAGNOSIS_BY_PATIENT_ID,
  GET_DIAGNOSIS,
  UPDATE_DESCRIPTION_DIAGNOSIS,
  DIAGNOSIS_ERROR,
} from "../actions/diagnosisAction";

const initialState = {
  diagnosis: [], // Список всіх діагнозів
  diagnosis_by_patient: [], // Діагнози по конкретному пацієнту
  error: null, // Помилка при виконанні запитів
};

const diagnosisReducer = (state = initialState, action) => {
  switch (action.type) {
    // Отримання всіх діагнозів
    case GET_DIAGNOSIS:
      return { ...state, diagnosis: action.payload, error: null };

    // Створення нового діагнозу
    case CREATE_DIAGNOSIS:
      return {
        ...state,
        diagnosis: [...state.diagnosis, action.payload],
        diagnosis_by_patient: [...state.diagnosis_by_patient, action.payload],
        error: null,
      };

    // Отримання діагнозів по пацієнту
    case GET_DIAGNOSIS_BY_PATIENT_ID:
      return { ...state, diagnosis_by_patient: action.payload, error: null };

    // Оновлення опису діагнозу
    case UPDATE_DESCRIPTION_DIAGNOSIS:
      // Оновлення діагнозу в списку
      return {
        ...state,
        diagnosis: state.diagnosis.map((diag) =>
          diag._id === action.payload._id
            ? { ...diag, description: action.payload.description }
            : diag
        ),
        diagnosis_by_patient: state.diagnosis_by_patient.map((diag) =>
          diag._id === action.payload._id
            ? { ...diag, description: action.payload.description }
            : diag
        ),
        error: null,
      };

    case DIAGNOSIS_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default diagnosisReducer;
