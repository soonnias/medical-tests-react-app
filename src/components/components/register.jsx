import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/authService";
import ReactInputMask from "react-input-mask";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
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
  });
  const [loading, setLoading] = useState(false);

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
    setFormData((prev) => ({
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
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Видаляємо всі символи крім цифр для валідації

    console.log(value);
    const numbersOnly = value.replace(/\D/g, "");
    console.log(numbersOnly);
    const isValid = numbersOnly.startsWith("380") && numbersOnly.length === 12;

    setFormData((prev) => ({
      ...prev,
      phoneNumber: value, // зберігаємо форматований номер для відображення
    }));

    setErrors((prev) => ({
      ...prev,
      phoneNumber:
        value && !isValid
          ? "Введіть коректний номер телефону формату +380 XX XXX XX XX"
          : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірка всіх полів перед відправкою
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Введіть коректну email адресу",
      }));
      return;
    }

    if (!validateBirthDate(formData.birthDate)) {
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
      const response = await AuthService.register(formData);
      login(response.token);
      navigate("/login");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: "Помилка при реєстрації,  телефон або пошта вже існують",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Реєстрація</h2>

              {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Прізвище</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ім'я</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Дата народження</label>
                  <input
                    type="date"
                    className={`form-control ${
                      errors.birthDate ? "is-invalid" : ""
                    }`}
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.birthDate && (
                    <div className="invalid-feedback">{errors.birthDate}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Номер телефону</label>
                  <ReactInputMask
                    mask="+380 99 999 99 99"
                    className={`form-control ${
                      errors.phoneNumber ? "is-invalid" : ""
                    }`}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+380 __ ___ __ __"
                    required
                  />
                  {errors.phoneNumber && (
                    <div className="invalid-feedback">{errors.phoneNumber}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {loading ? "Реєстрація..." : "Зареєструватися"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
