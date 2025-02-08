import {
  createPatients,
  fetchPatients,
  getPatientById,
  getPatientsByPhoneNumber,
} from "../../api/patientApi";

// Action Types
export const GET_PATIENTS = "GET_PATIENTS";
export const CREATE_PATIENT = "CREATE_PATIENT";
export const GET_PATIENT_BY_ID = "GET_PATIENT_BY_ID";
export const GET_PATIENTS_BY_PHONE = "GET_PATIENTS_BY_PHONE";
export const PATIENT_ERROR = "PATIENT_ERROR";

// Отримання всіх пацієнтів
export const getAllPatients = () => async (dispatch) => {
  try {
    const data = await fetchPatients();
    dispatch({ type: GET_PATIENTS, payload: data });
  } catch (error) {
    dispatch({ type: PATIENT_ERROR, payload: error.message });
  }
};

// Створення нового пацієнту
export const createPatientAction = (patientData) => async (dispatch) => {
  try {
    const data = await createPatients(patientData);
    dispatch({ type: CREATE_PATIENT, payload: data });
  } catch (error) {
    dispatch({ type: PATIENT_ERROR, payload: error.message });
  }
};

// Отримання пацієнта за ID
export const getPatientByIdAction = (id) => async (dispatch) => {
  try {
    const data = await getPatientById(id);
    dispatch({ type: GET_PATIENT_BY_ID, payload: data });
  } catch (error) {
    dispatch({ type: PATIENT_ERROR, payload: error.message });
  }
};

// Отримання пацієнтів за номером
export const getPatientsByNumberAction = (phoneNumber) => async (dispatch) => {
  try {
    const data = await getPatientsByPhoneNumber(phoneNumber);
    dispatch({ type: GET_PATIENTS_BY_PHONE, payload: data });
  } catch (error) {
    dispatch({ type: PATIENT_ERROR, payload: error.message });
  }
};
