import axios from "axios";

const BASE_URL = "http://localhost:3000/test-types";

// Налаштування інстансу Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Отримання всіх типів тестів
export const fetchTestTypes = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching test types"
    );
  }
};

// Створення нового типу тесту
export const createTestType = async (testTypeData) => {
  try {
    const response = await axiosInstance.post("/", testTypeData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating test type"
    );
  }
};

// Оновлення типу тесту
export const updateTestType = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating test type"
    );
  }
};

// Видалення типу тесту
export const deleteTestType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting test type"
    );
  }
};
