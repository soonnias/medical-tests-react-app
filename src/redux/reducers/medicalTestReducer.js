import {
  GET_MEDICAL_TESTS,
  GET_TEST_BY_ID,
  GET_TESTS_BY_PATIENT_ID,
  CREATE_MEDICAL_TEST,
  UPDATE_MEDICAL_TEST,
  DELETE_MEDICAL_TEST,
  DOWNLOAD_TEST_FILE,
  MEDICAL_TEST_ERROR,
} from "../actions/medicalTestAction";

const initialState = {
  tests: [], // Всі медичні тести
  currentTest: null, // Поточний вибраний тест
  patientTests: [], // Тести конкретного пацієнта
  error: null, // Помилки при виконанні запитів
};

const medicalTestReducer = (state = initialState, action) => {
  switch (action.type) {
    // Отримання всіх тестів
    case GET_MEDICAL_TESTS:
      return {
        ...state,
        tests: action.payload,
        error: null,
      };

    // Отримання тесту за ID
    case GET_TEST_BY_ID:
      return {
        ...state,
        currentTest: action.payload,
        error: null,
      };

    // Отримання тестів пацієнта
    case GET_TESTS_BY_PATIENT_ID:
      return {
        ...state,
        patientTests: action.payload,
        error: null,
      };

    // Створення нового тесту
    case CREATE_MEDICAL_TEST:
      return {
        ...state,
        tests: [...state.tests, action.payload],
        patientTests:
          state.patientTests.length > 0
            ? [...state.patientTests, action.payload]
            : state.patientTests,
        error: null,
      };

    // Оновлення тесту
    case UPDATE_MEDICAL_TEST:
      return {
        ...state,
        tests: state.tests.map((test) =>
          test._id === action.payload._id ? action.payload : test
        ),
        patientTests: state.patientTests.map((test) =>
          test._id === action.payload._id ? action.payload : test
        ),
        currentTest:
          state.currentTest?._id === action.payload._id
            ? action.payload
            : state.currentTest,
        error: null,
      };

    // Видалення тесту
    case DELETE_MEDICAL_TEST:
      return {
        ...state,
        tests: state.tests.filter((test) => test._id !== action.payload),
        patientTests: state.patientTests.filter(
          (test) => test._id !== action.payload
        ),
        currentTest:
          state.currentTest?._id === action.payload ? null : state.currentTest,
        error: null,
      };

    // Завантаження файлу
    case DOWNLOAD_TEST_FILE:
      // Тут можна додати логіку, якщо потрібно оновити стан після завантаження файлу
      return {
        ...state,
        error: null,
      };

    // Обробка помилок
    case MEDICAL_TEST_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default medicalTestReducer;
