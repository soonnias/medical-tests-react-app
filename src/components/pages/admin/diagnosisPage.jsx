import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllDiagnosis } from "../../../redux/actions/diagnosisAction";

function DiagnosisPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { diagnosis, error } = useSelector((state) => state.diagnosis);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getAllDiagnosis());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError("Некоректний діапазон дат");
    } else {
      setDateError(null);
    }
  }, [startDate, endDate]);

  const filteredDiagnosis = diagnosis?.filter((diagnos) => {
    const fullName =
      `${diagnos.patientId.lastName} ${diagnos.patientId.firstName}`.toLowerCase();
    const diagnosisDate = new Date(diagnos.diagnosisDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      fullName.includes(searchTerm.toLowerCase()) &&
      (!start || diagnosisDate >= start) &&
      (!end || diagnosisDate <= end)
    );
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Усі діагнози</h3>
      </div>
      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Пошук за ім'ям або прізвищем"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {dateError && <p className="text-danger">{dateError}</p>}

      {loading ? (
        <div>Завантаження...</div>
      ) : filteredDiagnosis && filteredDiagnosis.length > 0 ? (
        <div className="row">
          {filteredDiagnosis.map((diagnos) => (
            <div key={diagnos._id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">
                    {diagnos.patientId.lastName} {diagnos.patientId.firstName}
                  </h4>
                  <h5 className="card-title">{diagnos.diagnosisName}</h5>
                  <p className="card-text">{diagnos.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Діагноз поставлений:{" "}
                      {new Date(diagnos.diagnosisDate).toLocaleDateString()}
                    </small>
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/patientDetail/${diagnos.patientId._id}`)
                    }
                  >
                    Перейти до пацієнта
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Немає діагнозів для цього пацієнта</p>
      )}
    </div>
  );
}

export default DiagnosisPage;
