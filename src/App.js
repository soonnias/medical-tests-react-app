import "./App.css";

import { ToastContainer } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import TestTypesPage from "./components/pages/admin/testTypePage";
import Login from "./components/components/login.jsx";
import Register from "./components/components/register.jsx";
import Navigation from "./components/components/navigation";
import PatientsPage from "./components/pages/admin/patientsPage.jsx";
import UserDetailsPage from "./components/pages/userDetails/userDetailsPage.jsx";
import DiagnosisBlock from "./components/pages/userDetails/diagnosisBlock.jsx";
import DiagnosisPage from "./components/pages/admin/diagnosisPage.jsx";
import MedicalTestsPage from "./components/pages/admin/medicalTestsPage.jsx";
import { AuthProvider } from "./contexts/AuthContext.js";
import PrivateRoute from "./contexts/PrivateRoute.js";

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navigation />
      <div className="content">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Тільки для адміна */}
          <Route
            path="/test-types"
            element={
              <PrivateRoute role="admin">
                <TestTypesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <PrivateRoute role="admin">
                <PatientsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="patientDetail/:id"
            element={
              <PrivateRoute role="admin">
                <UserDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/diagnoses"
            element={
              <PrivateRoute role="admin">
                <DiagnosisPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/medical-tests/:testTypeId?"
            element={
              <PrivateRoute role="admin">
                <MedicalTestsPage />
              </PrivateRoute>
            }
          />

          {/* Для користувача */}
          <Route path="info/:id" element={<UserDetailsPage role="user" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
