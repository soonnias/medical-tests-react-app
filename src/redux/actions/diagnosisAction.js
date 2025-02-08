import {
  createDiagnosis,
  getAllDiagnosisByPatient,
  updateDescriptionDiagnosis,
  fetchDiagnosis,
} from "../../api/diagnosisApi";

// Action Types
export const GET_DIAGNOSIS = "GET_DIAGNOSIS";
export const CREATE_DIAGNOSIS = "CREATE_DIAGNOSIS";
export const GET_DIAGNOSIS_BY_PATIENT_ID = "GET_DIAGNOSIS_BY_PATIENT_ID";
export const UPDATE_DESCRIPTION_DIAGNOSIS = "UPDATE_DESCRIPTION_DIAGNOSIS";
export const DIAGNOSIS_ERROR = "DIAGNOSIS_ERROR";

// Отримання всі діагнози
export const getAllDiagnosis = () => async (dispatch) => {
  try {
    const data = await fetchDiagnosis();
    dispatch({ type: GET_DIAGNOSIS, payload: data });
  } catch (error) {
    dispatch({ type: DIAGNOSIS_ERROR, payload: error.message });
  }
};

// Створення нового діагнозу
export const createDiagnosisAction = (diagnosisData) => async (dispatch) => {
  try {
    const data = await createDiagnosis(diagnosisData);
    dispatch({ type: CREATE_DIAGNOSIS, payload: data });
  } catch (error) {
    dispatch({ type: DIAGNOSIS_ERROR, payload: error.message });
  }
};

// Отримання всвіх діагнозів пацієнта
export const getAllDiagnosisByPatientIdAction =
  (patientId) => async (dispatch) => {
    try {
      const data = await getAllDiagnosisByPatient(patientId);
      dispatch({ type: GET_DIAGNOSIS_BY_PATIENT_ID, payload: data });
    } catch (error) {
      dispatch({ type: DIAGNOSIS_ERROR, payload: error.message });
    }
  };

// Оновлення діагнозу
export const updateDiagnosis = (id, description) => async (dispatch) => {
  try {
    const data = await updateDescriptionDiagnosis(id, description);
    dispatch({ type: UPDATE_DESCRIPTION_DIAGNOSIS, payload: data });
  } catch (error) {
    dispatch({ type: DIAGNOSIS_ERROR, payload: error.message });
  }
};
