import axios from "axios";

const BASE_URL = "http://localhost:3000/diagnosis";

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

// Отримання всіх діагнозів
export const fetchDiagnosis = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching diagnosis"
    );
  }
};

// Створення нового діагнозу
export const createDiagnosis = async (diagnosisData) => {
  try {
    const response = await axiosInstance.post("/", diagnosisData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating diagnosis"
    );
  }
};

// Отримання всіх діагнозів за пацієнтом
export const getAllDiagnosisByPatient = async (patientId) => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error getting giagnosis by patient ID"
    );
  }
};

// Оновлення опису діагнозу
export const updateDescriptionDiagnosis = async (id, description) => {
  try {
    const response = await axiosInstance.patch(
      `/${id}/desciption`,
      description
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating diagnosis"
    );
  }
};
