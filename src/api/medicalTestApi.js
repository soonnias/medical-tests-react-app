import axios from "axios";

const BASE_URL = "http://localhost:3000/medical-tests";

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

// Отримання всіх тестів
export const fetchMedicalTests = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching tests");
  }
};

// Отримання тесту за ID
export const getTestById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching test by ID"
    );
  }
};

// Отримання тестів за ID пацієнта
export const getTestsByPatientId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/patient/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching tests by patient ID"
    );
  }
};

// Створення нового медичного тесту
export const createMedicalTest = async (testData) => {
  try {
    const response = await axiosInstance.post("/", testData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating medical test"
    );
  }
};

export const updateMedicalTest = async (id, updateData) => {
  try {
    // Лог перед відправкою
    /*console.log("FormData перед відправкою:", updateData);
    for (let pair of updateData.entries()) {
      console.log(pair[0], pair[1]);
    }*/

    // Відправляємо `updateData` напряму
    const response = await axiosInstance.patch(`/${id}`, updateData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Відповідь сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("Помилка оновлення тесту:", error);
    throw new Error(
      error.response?.data?.message || "Помилка оновлення медичного тесту"
    );
  }
};

// Видалення медичного тесту
export const deleteMedicalTest = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting medical test"
    );
  }
};

export const downloadTestFile = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}/download`, {
      responseType: "blob",
    });

    // Отримуємо MIME-тип
    const mimeType = response.headers["content-type"];

    // Створюємо URL для завантаження
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: mimeType })
    );

    // Створюємо тимчасове посилання для завантаження
    const link = document.createElement("a");
    link.href = url;

    // Отримуємо ім'я файлу з заголовків відповіді
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "download";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch.length === 2) {
        fileName = decodeURIComponent(escape(fileNameMatch[1])); // Фікс кодування
      }
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error downloading test file"
    );
  }
};
