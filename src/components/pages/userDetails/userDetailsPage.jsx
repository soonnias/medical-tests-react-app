import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPatientByIdAction } from "../../../redux/actions/patientActions";
import { Tab, Nav } from "react-bootstrap"; // Для вкладок
import DiagnosisBlock from "./diagnosisBlock";
import MedicalTestsBlock from "./medicalTestsBlock";

function UserDetailsPage({ role = "admin" }) {
  const { id } = useParams();

  const { patient, error } = useSelector((state) => state.patients);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getPatientByIdAction(id));
      setLoading(false);
    };

    fetchData();
  }, [dispatch, id]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-center mb-4">
            {patient.firstName} {patient.lastName}
          </h3>
          {patient ? (
            <div className="card p-4">
              <p>
                <strong>Дата народження:</strong>{" "}
                {new Date(patient.birthDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Телефон:</strong> {patient.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
            </div>
          ) : (
            <p className="text-center text-danger">Пацієнта не знайдено</p>
          )}
        </div>
      </div>
      <Tab.Container defaultActiveKey="diagnoses">
        <div className="row mb-4">
          <div className="col-md-6 offset-md-3">
            <Nav variant="pills" className="justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="diagnoses">Діагнози</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="medicalTests">Медичні тести</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>

        <Tab.Content>
          <Tab.Pane eventKey="diagnoses">
            {/* Тебе сюди має бути компонент для діагнозів */}
            <DiagnosisBlock role={role} patientId={id}></DiagnosisBlock>
          </Tab.Pane>
          <Tab.Pane eventKey="medicalTests">
            {/* Тебе сюди має бути компонент для медичних тестів */}
            <MedicalTestsBlock role={role} patientId={id}></MedicalTestsBlock>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <div className="mt-5 pb-5"></div> {/* Простір внизу */}
    </div>
  );
}

export default UserDetailsPage;
