import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadMedicalTestFile,
  getAllMedicalTests,
  updateMedicalTestAction,
} from "../../../redux/actions/medicalTestAction";
import { getTestTypes } from "../../../redux/actions/testTypeActions";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function MedicalTestsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tests, error } = useSelector((state) => state.medicalTests);
  const { testTypes } = useSelector((state) => state.testType);

  const [showModal, setShowModal] = useState(false);
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

  const { testTypeId } = useParams();
  const [selectedTestType, setSelectedTestType] = useState(testTypeId || "");

  useEffect(() => {
    dispatch(getAllMedicalTests());
    dispatch(getTestTypes());
  }, [dispatch]);

  useEffect(() => {
    if (testTypeId) {
      const existsInTestTypes = testTypes.some(
        (type) => type._id === testTypeId
      );

      if (existsInTestTypes) {
        setSelectedTestType(testTypeId);
      } else {
        setSelectedTestType("");
      }
    }
  }, [testTypeId, testTypes]);

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

      await dispatch(updateMedicalTestAction(selectedTestId, formDataToSend));
      setShowModal(false);
    } catch (err) {
      setErrorMessage(err.message || "Помилка при збереженні тесту");
    } finally {
      setSubmitting(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const filteredTests = tests.filter((test) => {
    const fullName =
      `${test.userId.firstName} ${test.userId.lastName}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus
      ? test.status === selectedStatus
      : true;

    const matchesTestType = selectedTestType
      ? test.testTypeId?._id === selectedTestType
      : true;

    const matchesDate =
      (!dateRange.from ||
        new Date(test.testDate) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(test.testDate) <= new Date(dateRange.to));

    return matchesName && matchesStatus && matchesTestType && matchesDate;
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Медичні тести</h3>
      </div>

      {/* Панель фільтрів */}
      <Form className="mb-3">
        <Row>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Пошук пацієнта..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Всі статуси</option>
              <option value="В обробці">В обробці</option>
              <option value="Виконано">Виконано</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={selectedTestType}
              onChange={(e) => setSelectedTestType(e.target.value)}
            >
              <option value="">Всі типи тестів</option>
              {testTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </Col>
        </Row>
      </Form>

      {error && <p className="text-danger">{error}</p>}

      {filteredTests.length === 0 ? (
        <p>Тести відсутні</p>
      ) : (
        <Container className="mt-4">
          {filteredTests.length === 0 ? (
            <p>Тести відсутні</p>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredTests.map((test) => (
                <Col key={test._id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title>{test.testTypeId?.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {new Date(test.testDate).toLocaleDateString()}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>Статус:</strong> {test.status}
                      </Card.Text>
                      <Card.Text>
                        <strong>Результат:</strong> {test.result}
                      </Card.Text>
                      <Card.Text>
                        <strong>Рекомендації:</strong>{" "}
                        {test.recommendations || "Немає"}
                      </Card.Text>
                      <Card.Text>
                        <strong>Пацієнт:</strong> {test.userId.firstName}{" "}
                        {test.userId.lastName}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/patientDetail/${test.userId._id}`)
                        }
                      >
                        Перейти до пацієнта
                      </Button>
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

                          setShowModal(true);
                        }}
                      >
                        Редагувати
                      </Button>
                      {test.filePath ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            dispatch(downloadMedicalTestFile(test._id))
                          }
                        >
                          Завантажити PDF
                        </Button>
                      ) : (
                        <span className="text-muted">Немає файлу</span>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      )}

      {/* Modal для створення/редагування */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Редагувати тест</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <Form onSubmit={handleSubmit}>
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

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Скасувати
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Обробка..." : "Оновити"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MedicalTestsPage;
