import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Alert } from "react-bootstrap"; // імпортуємо Alert для повідомлень про помилки

import {
  createDiagnosisAction,
  updateDiagnosis,
  getAllDiagnosisByPatientIdAction,
} from "../../../redux/actions/diagnosisAction";

function DiagnosisBlock({ role, patientId }) {
  const dispatch = useDispatch();
  const { diagnosis_by_patient, error } = useSelector(
    (state) => state.diagnosis
  );
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Стан для відображення модального вікна
  const [isEdit, setIsEdit] = useState(false); // Стан для визначення, чи редагуємо ми діагноз
  const [formData, setFormData] = useState({
    diagnosisName: "",
    description: "",
    diagnosisDate: new Date().toISOString(),
  });
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getAllDiagnosisByPatientIdAction(patientId));
      setLoading(false);
    };

    fetchData();
  }, [dispatch, patientId]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error); // Встановлюємо повідомлення про помилку, якщо воно є
    }
  }, [error]);

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      diagnosisName: "",
      description: "",
      diagnosisDate: new Date().toISOString(),
    });
    setIsEdit(false);
    setErrorMessage(""); // Очищаємо повідомлення про помилку при закритті модалки
  };

  const handleShowAddModal = () => {
    setFormData({
      diagnosisName: "",
      description: "",
      diagnosisDate: new Date().toISOString(),
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleShowEditModal = (diagnosis) => {
    setFormData({
      diagnosisName: diagnosis.diagnosisName,
      description: diagnosis.description,
      diagnosisDate: new Date(diagnosis.diagnosisDate).toISOString(),
    });
    setSelectedDiagnosisId(diagnosis._id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        // Оновлення існуючого діагнозу
        await dispatch(
          updateDiagnosis(selectedDiagnosisId, formData.description)
        );
      } else {
        // Створення нового діагнозу
        const newDiagnosis = {
          patientId,
          diagnosisDate: formData.diagnosisDate,
          diagnosisName: formData.diagnosisName,
          description: formData.description,
        };
        await dispatch(createDiagnosisAction(newDiagnosis));
      }
      handleCloseModal();
    } catch (error) {
      // Якщо є помилка при створенні чи редагуванні
      setErrorMessage(error.message || "Невідома помилка");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Діагнози пацієнта</h3>
        {role === "admin" && (
          <button className="btn btn-success" onClick={handleShowAddModal}>
            Додати діагноз
          </button>
        )}
      </div>

      {loading ? (
        <div>Завантаження...</div>
      ) : diagnosis_by_patient && diagnosis_by_patient.length > 0 ? (
        <div>
          {diagnosis_by_patient.map((diagnosis) => (
            <div key={diagnosis._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{diagnosis.diagnosisName}</h5>
                <p className="card-text">{diagnosis.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Діагноз поставлений:{" "}
                    {new Date(diagnosis.diagnosisDate).toLocaleDateString()}
                  </small>
                </p>

                {role === "admin" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleShowEditModal(diagnosis)}
                  >
                    Редагувати
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Немає діагнозів для цього пацієнта</p>
      )}

      {/* Модальне вікно для створення або редагування діагнозу */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Редагувати діагноз" : "Додати діагноз"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Виведення помилки, якщо вона є */}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form>
            {/* Назва діагнозу (тільки для додавання нового діагнозу) */}
            {!isEdit && (
              <Form.Group className="mb-3" controlId="formDiagnosisName">
                <Form.Label>Назва діагнозу</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Назва діагнозу"
                  value={formData.diagnosisName}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosisName: e.target.value })
                  }
                  isInvalid={formSubmitted && !formData.diagnosisName} // Перевірка після сабміту
                />
                <Form.Control.Feedback type="invalid">
                  Назва діагнозу обов'язкова!
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {/* Опис діагнозу */}
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Опис"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрити
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setFormSubmitted(true); // Позначаємо, що була спроба сабміту
              if (!isEdit && !formData.diagnosisName) return; // Блокуємо сабміт
              handleSubmit();
            }}
          >
            {isEdit ? "Зберегти зміни" : "Додати діагноз"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DiagnosisBlock;
