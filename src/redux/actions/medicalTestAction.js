import {
  fetchMedicalTests,
  getTestById,
  getTestsByPatientId,
  createMedicalTest,
  updateMedicalTest,
  deleteMedicalTest,
  downloadTestFile,
} from "../../api/medicalTestApi";

// Action Types
export const GET_MEDICAL_TESTS = "GET_MEDICAL_TESTS";
export const GET_TEST_BY_ID = "GET_TEST_BY_ID";
export const GET_TESTS_BY_PATIENT_ID = "GET_TESTS_BY_PATIENT_ID";
export const CREATE_MEDICAL_TEST = "CREATE_MEDICAL_TEST";
export const UPDATE_MEDICAL_TEST = "UPDATE_MEDICAL_TEST";
export const DELETE_MEDICAL_TEST = "DELETE_MEDICAL_TEST";
export const DOWNLOAD_TEST_FILE = "DOWNLOAD_TEST_FILE";
export const MEDICAL_TEST_ERROR = "MEDICAL_TEST_ERROR";

// Отримання всіх медичних тестів
export const getAllMedicalTests = () => async (dispatch) => {
  try {
    const data = await fetchMedicalTests();
    dispatch({ type: GET_MEDICAL_TESTS, payload: data });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};

// Отримання тесту за ID
export const getMedicalTestById = (id) => async (dispatch) => {
  try {
    const data = await getTestById(id);
    dispatch({ type: GET_TEST_BY_ID, payload: data });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};

// Отримання тестів за ID пацієнта
export const getMedicalTestsByPatientId = (patientId) => async (dispatch) => {
  try {
    const data = await getTestsByPatientId(patientId);
    dispatch({ type: GET_TESTS_BY_PATIENT_ID, payload: data });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};

// Створення нового медичного тесту
export const createNewMedicalTest = (testData) => async (dispatch) => {
  try {
    const data = await createMedicalTest(testData);
    dispatch({ type: CREATE_MEDICAL_TEST, payload: data });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};

// Оновлення медичного тесту
export const updateMedicalTestAction = (id, updateData) => async (dispatch) => {
  try {
    /*console.log("action updateData:", updateData);
    console.log("action updateData entries:");
    for (let pair of updateData.entries()) {
      console.log(pair[0], pair[1]);
    }*/

    // Якщо є файл, передаємо як FormData
    const data = await updateMedicalTest(id, updateData);

    dispatch({ type: UPDATE_MEDICAL_TEST, payload: data });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};

// Видалення медичного тесту
export const deleteMedicalTestAction = (id) => async (dispatch) => {
  try {
    await deleteMedicalTest(id);
    dispatch({ type: DELETE_MEDICAL_TEST, payload: id });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};

// Завантаження файлу результату тесту
export const downloadMedicalTestFile = (id) => async (dispatch) => {
  try {
    const data = await downloadTestFile(id);
    dispatch({ type: DOWNLOAD_TEST_FILE, payload: { id, data } });
  } catch (error) {
    dispatch({ type: MEDICAL_TEST_ERROR, payload: error.message });
  }
};
