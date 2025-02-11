import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Form, Modal, Spinner, Alert } from "react-bootstrap";
import {
  createTestTypeAction,
  deleteTestTypeAction,
  getTestTypes,
  updateTestTypeAction,
} from "../../../redux/actions/testTypeActions";
import { useNavigate } from "react-router-dom";

const TestTypesPage = () => {
  const dispatch = useDispatch();
  const { testTypes, error } = useSelector((state) => state.testType);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTestType, setCurrentTestType] = useState({ name: "" });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getTestTypes());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSort = () => setSortAsc(!sortAsc);
  const handleDelete = (id) => dispatch(deleteTestTypeAction(id));

  const handleSave = () => {
    console.log("CURRENT TEST", currentTestType);
    if (currentTestType._id) {
      dispatch(updateTestTypeAction(currentTestType._id, currentTestType));
    } else {
      dispatch(createTestTypeAction(currentTestType));
    }
    setShowModal(false);
    setCurrentTestType({ name: "" });
  };

  const handleErrorClose = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const filteredTestTypes = !loading
    ? testTypes
        .filter(
          (type) =>
            type.name && type.name.toLowerCase().includes(search.toLowerCase()) // перевірка наявності 'name'
        )
        .sort((a, b) =>
          sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        )
    : [];

  return (
    <div className="container mt-4">
      <h2>Типи тестів</h2>
      {error && (
        <Alert variant="danger" onClose={handleErrorClose} dismissible>
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Пошук..."
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                Назва {sortAsc ? "↑" : "↓"}
              </th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestTypes.map((type) => (
              <tr key={type._id}>
                <td>{type.name}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentTestType(type);
                      setShowModal(true);
                    }}
                    className="me-3"
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(type._id)}
                    className="me-3"
                  >
                    Видалити
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => navigate(`/medical-tests/${type._id}`)}
                  >
                    Детальніше
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentTestType._id ? "Редагувати" : "Додати"} тип тесту
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Назва</Form.Label>
              <Form.Control
                type="text"
                value={currentTestType.name}
                onChange={(e) =>
                  setCurrentTestType({
                    ...currentTestType,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSave}>Зберегти</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestTypesPage;
