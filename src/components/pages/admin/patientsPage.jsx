import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Modal, Spinner, Alert } from "react-bootstrap";
import {
  getAllPatients,
  createPatientAction,
  getPatientByIdAction,
  getPatientsByNumberAction,
} from "../../../redux/actions/patientActions";
import ReactInputMask from "react-input-mask";

const PatientsPage = () => {
  const dispatch = useDispatch();
  const { patients, error } = useSelector((state) => state.patients);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    birthDate: "",
    email: "",
    phoneNumber: "",
    submit: "",
  });
  const [loading, setLoading] = useState(true);

  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getAllPatients());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  // Фільтрація пацієнтів при зміні `patients` або `search`
  useEffect(() => {
    setFilteredPatients(
      patients.filter((patient) =>
        patient.phoneNumber
          .replace(/\s/g, "")
          .includes(search.trim().replace(/\s/g, ""))
      )
    );
  }, [patients, search]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateBirthDate = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    return birthDate <= today;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPatient((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Валідація email
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email:
          value && !validateEmail(value) ? "Введіть коректну email адресу" : "",
      }));
    }

    // Валідація дати народження
    if (name === "birthDate") {
      setErrors((prev) => ({
        ...prev,
        birthDate:
          value && !validateBirthDate(value)
            ? "Дата народження не може бути в майбутньому"
            : "",
      }));
    }

    setErrors((prev) => ({
      ...prev,
      submit: "",
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Видаляємо всі символи крім цифр для валідації

    console.log(value);
    const numbersOnly = value.replace(/\D/g, "");
    console.log(numbersOnly);
    const isValid = numbersOnly.startsWith("380") && numbersOnly.length === 12;

    setCurrentPatient((prev) => ({
      ...prev,
      phoneNumber: value, // зберігаємо форматований номер для відображення
    }));

    setErrors((prev) => ({
      ...prev,
      phoneNumber:
        value && !isValid
          ? "Введіть коректний номер телефону формату +380 XX XXX XX XX"
          : "",
      submit: "",
    }));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірка всіх полів перед відправкою
    if (!validateEmail(currentPatient.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Введіть коректну email адресу",
      }));
      return;
    }

    if (!validateBirthDate(currentPatient.birthDate)) {
      setErrors((prev) => ({
        ...prev,
        birthDate: "Дата народження не може бути в майбутньому",
      }));
      return;
    }

    // Якщо є будь-які помилки, не відправляємо форму
    if (errors.email || errors.birthDate || errors.phoneNumber) {
      return;
    }

    setLoading(true);

    try {
      await dispatch(createPatientAction(currentPatient));
      if (errors.submit == "") {
        setShowModal(false);
        dispatch(getAllPatients());
        setCurrentPatient({
          lastName: "",
          firstName: "",
          birthDate: "",
          phoneNumber: "",
          email: "",
          password: "",
        });
      } else {
        console.log("catched error");
        setErrors((prev) => ({
          ...prev,
          submit: "Помилка при реєстрації, телефон або пошта вже існують",
        }));
        console.log(errors);
      }
    } catch {
      console.log("catched error");
      setErrors((prev) => ({
        ...prev,
        submit: "Помилка при реєстрації, телефон або пошта вже існують",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleErrorClose = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const handleCloseModal = () => {
    setCurrentPatient({
      lastName: "",
      firstName: "",
      birthDate: "",
      phoneNumber: "",
      email: "",
      password: "",
    });

    setShowModal(false);

    setErrors({
      submit: "",
      birthDate: "",
      email: "",
      phoneNumber: "",
    });
  };

  return (
    <div className="container mt-4">
      <h2>Пацієнти</h2>
      {error && (
        <Alert variant="danger" onClose={handleErrorClose} dismissible>
          {error}
        </Alert>
      )}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Пошук за номером..."
          value={search}
          onChange={handleSearch}
          className="w-50"
          disabled={loading}
        />
        <Button onClick={() => setShowModal(true)} disabled={loading}>
          Додати
        </Button>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </Spinner>
        </div>
      ) : (
        <div className="row">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div className="col-md-4 mb-3" key={patient._id}>
                <Card>
                  <Card.Body>
                    <Card.Title>
                      {patient.lastName} {patient.firstName}
                    </Card.Title>
                    <Card.Text>
                      <strong>Дата народження:</strong>{" "}
                      {new Date(patient.birthDate).toLocaleDateString("uk-UA")}{" "}
                      <br />
                      <strong>Телефон:</strong> {patient.phoneNumber} <br />
                      <strong>Email:</strong> {patient.email} <br />
                      <strong>Роль:</strong> {patient.role} <br />
                      <Button className="mt-2">Детальніше</Button>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">
              Користувачів за таким номером не знайдено
            </p>
          )}
        </div>
      )}
      <Modal show={showModal} onHide={() => handleCloseModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Додати пацієнта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors && Object.values(errors).some((error) => error) && (
            <div className="alert alert-danger">
              <ul>
                {Object.values(errors)
                  .filter((error) => error) // Фільтруємо порожні значення
                  .map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
              </ul>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Прізвище</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={currentPatient.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ім'я</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={currentPatient.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Дата народження</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={currentPatient.birthDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Телефон</Form.Label>
              <ReactInputMask
                mask="+380 99 999 99 99"
                className="form-control"
                name="phoneNumber"
                value={currentPatient.phoneNumber}
                onChange={handlePhoneChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentPatient.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentPatient.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </Form.Group>
            <Button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Реєстрація..." : "Зареєструвати"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PatientsPage;
