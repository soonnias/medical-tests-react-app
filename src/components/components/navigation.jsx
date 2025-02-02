import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../api/authService";

function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    AuthService.logout();
    logout(); // Викликаємо функцію з контексту
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Medicine.ua
        </Link>
        {isAuthenticated ? (
          <>
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

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/test-types">
                    Типи тестів
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tests">
                    Тести
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/diagnoses">
                    Діагнози
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Користувачі
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Вийти
                  </button>
                </li>
              </ul>
            </div>
          </>
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
    </nav>
  );
}

export default Navigation;
