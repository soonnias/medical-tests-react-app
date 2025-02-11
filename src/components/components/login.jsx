import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/authService";
import ReactInputMask from "react-input-mask";
import { useAuth } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { login, getUser } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const numbersOnly = formData.phoneNumber.replace(/\D/g, "");
    const isValid = numbersOnly.startsWith("380") && numbersOnly.length === 12;

    if (!isValid) {
      setError("Введіть коректний номер телефону формату +380 XX XXX XX XX");
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.login(formData);
      //login(response.token); // Використовуємо login з контексту

      //const user = getUser();

      const user = await AuthService.getCurrentUser();

      const userRole = user?.role;
      const userId = user?._id;

      console.log("INFO LOGIN", userRole, userId);

      if (userRole === "user" && userId) {
        localStorage.setItem("id", userId);
        navigate(`/info/${userId}`);
      } else {
        navigate("/patients");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const navigateTo = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const id = localStorage.getItem("id");
          if (id) {
            navigate(`/info/${id}`);
          } else {
            navigate("/patients");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    navigateTo();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Вхід</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Номер телефону</label>
                  <ReactInputMask
                    mask="+380 99 999 99 99"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+380 __ ___ __ __"
                    required
                  />
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
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Вхід..." : "Увійти"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
