import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTestTypes } from "../../../redux/actions/testTypeActions";
import { Modal, Button, Form } from "react-bootstrap";
import {
  createNewMedicalTest,
  downloadMedicalTestFile,
  getMedicalTestsByPatientId,
  updateMedicalTestAction,
} from "../../../redux/actions/medicalTestAction";

function MedicalTestsBlock({ patientId, role }) {
  const dispatch = useDispatch();
  const { patientTests, error } = useSelector((state) => state.medicalTests);
  const { testTypes } = useSelector((state) => state.testType);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [formData, setFormData] = useState({
    testTypeId: "",
    testDate: new Date().toISOString().split("T")[0],
    result: "",
    recommendations: "",
    file: null,
    filePath: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (patientId) {
      dispatch(getMedicalTestsByPatientId(patientId));
    }
    dispatch(getTestTypes());
  }, [dispatch, patientId]);

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
      const formDataToSend = new FormData();

      if (formData.result) formDataToSend.append("result", formData.result);
      if (formData.recommendations)
        formDataToSend.append("recommendations", formData.recommendations);
      if (formData.file) {
        console.log("файл завантажено в вебці");
        console.log(formData.file);
        formDataToSend.append("file", formData.file);
      }

      if (isEditing) {
        await dispatch(updateMedicalTestAction(selectedTestId, formDataToSend));
      } else {
        if (!formData.testTypeId || !formData.testDate) {
          throw new Error("Будь ласка, заповніть всі обов'язкові поля.");
        }

        await dispatch(
          createNewMedicalTest({
            userId: patientId,
            testTypeId: formData.testTypeId,
            testDate: formData.testDate,
          })
        );
      }

      setShowModal(false);
    } catch (err) {
      setErrorMessage(err.message || "Помилка при збереженні тесту");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Медичні тести</h3>
        {role === "admin" && (
          <Button
            variant="success"
            onClick={() => {
              setFormData({
                testTypeId: "",
                testDate: new Date().toISOString().split("T")[0],
                result: "",
                recommendations: "",
                file: null,
              });
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            Додати тест
          </Button>
        )}
      </div>

      {error && <p className="text-danger">{error}</p>}

      {patientTests.length === 0 ? (
        <p>Немає тестів для цього пацієнта.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Дата тесту</th>
              <th>Тип тесту</th>
              <th>Статус</th>
              <th>Результат</th>
              {role === "admin" && <th>Дії</th>}
              <th>Pdf</th>
            </tr>
          </thead>
          <tbody>
            {patientTests.map((test) => (
              <tr key={test._id}>
                <td>{new Date(test.testDate).toLocaleDateString()}</td>
                <td>{test.testTypeId?.name}</td>
                <td>{test.status}</td>
                <td>{test.result}</td>
                {role === "admin" && (
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          result: test.result || "",
                          recommendations: test.recommendations || "",
                          file: null,
                          filePath: test.filePath || "",
                        });
                        setSelectedTestId(test._id);
                        setIsEditing(true);
                        setShowModal(true);
                      }}
                    >
                      Редагувати
                    </Button>
                  </td>
                )}
                <td>
                  {test.filePath ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        dispatch(downloadMedicalTestFile(test._id))
                      }
                    >
                      Завантажити
                    </Button>
                  ) : (
                    <span>Немає файлу</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal для створення/редагування */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Редагувати тест" : "Додати тест"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <Form onSubmit={handleSubmit}>
            {!isEditing ? (
              <>
                <Form.Group>
                  <Form.Label>Тип тесту:</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Дата тесту:</Form.Label>
                  <Form.Control
                    type="date"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    max={new Date().toISOString().split("T")[0]} // Обмеження на майбутні дати
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group>
                  <Form.Label>Результат:</Form.Label>
                  <Form.Control
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Рекомендації:</Form.Label>
                  <Form.Control
                    type="text"
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Файл:</Form.Label>

                  {/* Відображаємо поточний файл, якщо він є */}
                  {formData.filePath && (
                    <div className="mb-2">
                      <a
                        href={formData.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-block"
                      >
                        {formData.filePath.split("/").pop()}
                      </a>
                    </div>
                  )}

                  <Form.Control
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </>
            )}

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Скасувати
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Обробка..." : isEditing ? "Оновити" : "Створити"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MedicalTestsBlock;
