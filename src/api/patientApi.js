import axios from "axios";

const BASE_URL = "http://localhost:3000/patients";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Отримання всіх пацієнтів
export const fetchPatients = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching patients");
  }
};

// Створення нового пацієнту
export const createPatients = async (patientsData) => {
  try {
    const response = await axiosInstance.post("/", patientsData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating patient");
  }
};

// Отримання тесту за ІД
export const getPatientById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error getting patient by ID"
    );
  }
};

// Пошук за номером
export const getPatientsByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInstance.get(`/search/${phoneNumber}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error getting patients by phine"
    );
  }
};
