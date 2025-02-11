import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../api/authService";

function Navigation() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const handleLogout = () => {
    AuthService.logout();
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold" to="/">
          Medicine.ua
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarNav"
        >
          {token ? (
            id ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Вийти
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav w-100 d-flex justify-content-between">
                <div className="d-flex">
                  <li className="nav-item">
                    <Link className="nav-link" to="/test-types">
                      Типи тестів
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/medical-tests">
                      Тести
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/diagnoses">
                      Діагнози
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/patients">
                      Пацієнти
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Вийти
                    </button>
                  </li>
                </div>
              </ul>
            )
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Зайти в акаунт
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Зареєструватись
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
