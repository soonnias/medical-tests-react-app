import "./App.css";

import { ToastContainer } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import TestTypesPage from "./components/pages/admin/testTypePage";
import Login from "./components/components/login.jsx";
import Register from "./components/components/register.jsx";
import Navigation from "./components/components/navigation";
import PatientsPage from "./components/pages/admin/patientsPage.jsx";
import UserDetailsPage from "./components/pages/userDetails/userDetailsPage.jsx";

function App() {
  return (
    <>
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
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/test-types" element={<TestTypesPage />} />{" "}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="patientDetail/:id" element={<UserDetailsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
