import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTestTypes } from "../../../redux/actions/testTypeActions";
import {
  createNewMedicalTest,
  updateMedicalTestAction,
} from "../../../redux/actions/medicalTestAction";
import { Spinner } from "react-bootstrap";

const MedicalTestForm = ({ patientId, onClose, test, testTypes }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    testTypeId: test?.testTypeId || "",
    testDate: test?.testDate || new Date().toISOString().split("T")[0],
    result: test?.result || "",
    recommendations: test?.recommendations || "",
    file: null,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getTestTypes()); // Завантажуємо типи тестів
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (test) {
        await dispatch(updateMedicalTestAction(test._id, formData));
      } else {
        await dispatch(
          createNewMedicalTest({ userId: patientId, ...formData })
        );
      }
      onClose();
    } catch (err) {
      setError(err.message || "Помилка при збереженні тесту");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{test ? "Редагувати тест" : "Додати тест"}</h3>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Завантаження...</span>
            </Spinner>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Тип тесту:</label>
            <select
              name="testTypeId"
              value={formData.testTypeId}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="" disabled>
                Оберіть тип тесту
              </option>
              {testTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>

            <label>Дата тесту:</label>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
              required
              disabled={submitting}
            />

            {test && (
              <>
                <label>Результат:</label>
                <input
                  type="text"
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <label>Рекомендації:</label>
                <input
                  type="text"
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <label>Файл:</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  disabled={submitting}
                />
              </>
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? "Обробка..." : test ? "Оновити" : "Створити"}
            </button>
            <button type="button" onClick={onClose} disabled={submitting}>
              Скасувати
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MedicalTestForm;
