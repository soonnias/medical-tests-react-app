import { updateTestType } from "../../api/testTypeApi";
import { deleteTestType } from "../../api/testTypeApi";
import { createTestType } from "../../api/testTypeApi";
import { fetchTestTypes } from "../../api/testTypeApi";

// Action Types
export const GET_TEST_TYPES = "GET_TEST_TYPES";
export const CREATE_TEST_TYPE = "CREATE_TEST_TYPE";
export const UPDATE_TEST_TYPE = "UPDATE_TEST_TYPE";
export const DELETE_TEST_TYPE = "DELETE_TEST_TYPE";
export const TEST_TYPE_ERROR = "TEST_TYPE_ERROR";

// Отримання всіх типів тестів
export const getTestTypes = () => async (dispatch) => {
  try {
    const data = await fetchTestTypes();
    dispatch({ type: GET_TEST_TYPES, payload: data });
  } catch (error) {
    dispatch({ type: TEST_TYPE_ERROR, payload: error.message });
  }
};

// Створення нового типу тесту
export const createTestTypeAction = (repairTypeData) => async (dispatch) => {
  try {
    const data = await createTestType(repairTypeData);
    dispatch({ type: CREATE_TEST_TYPE, payload: data.testType });
  } catch (error) {
    dispatch({ type: TEST_TYPE_ERROR, payload: error.message });
  }
};

// Оновлення типу тесту
export const updateTestTypeAction =
  (id, repairTypeData) => async (dispatch) => {
    console.log("Update action");
    try {
      const data = await updateTestType(id, { name: repairTypeData.name });
      dispatch({ type: UPDATE_TEST_TYPE, payload: data.testType });
    } catch (error) {
      dispatch({ type: TEST_TYPE_ERROR, payload: error.message });
    }
  };

// Видалення типу тесту
export const deleteTestTypeAction = (id) => async (dispatch) => {
  try {
    await deleteTestType(id);
    dispatch({ type: DELETE_TEST_TYPE, payload: id });
  } catch (error) {
    dispatch({ type: TEST_TYPE_ERROR, payload: error.message });
  }
};
