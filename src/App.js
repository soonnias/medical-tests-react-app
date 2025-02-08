import logo from "./logo.svg";
import "./App.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getTestTypes } from "./redux/actions/testTypeActions";
import { ToastContainer } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import TestTypesPage from "./components/pages/admin/testTypePage";
import Login from "./components/components/login.jsx";
import Register from "./components/components/register.jsx";
import Navigation from "./components/components/navigation";
import PatientsPage from "./components/pages/admin/patientsPage.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTestTypes());
  }, [dispatch]);

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
          <Route path="/" element={<TestTypesPage />} />{" "}
          <Route path="admin/testType" element={<TestTypesPage />} />{" "}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="admin/patients" element={<PatientsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
