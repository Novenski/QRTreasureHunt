import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth.jsx';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Lade...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center p-5">
                  <div className="display-1 text-danger mb-4">🚫</div>
                  <h1 className="h2 fw-bold text-danger mb-4">
                    Zugriff verweigert
                  </h1>
                  <p className="text-muted">
                    Du hast keine Admin-Berechtigung für diese Seite.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;