import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Get return URL from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const returnTo = urlParams.get('returnTo') || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rulesAccepted) {
      setError('Bitte bestätige, dass du die Hinweise gelesen hast');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data;
      
      login(user, token);
      navigate(returnTo);
    } catch (err) {
      setError(err.response?.data?.error || 'Anmeldung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md="8" lg="6" xl="5">
            <Card className="border-0 shadow-lg fade-in">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="display-4 text-danger mb-3 pulse-animation">🔥</div>
                  <h1 className="h2 fw-bold text-danger mb-2 slide-in-left">QR Wachen Login</h1>
                  <p className="text-muted slide-in-right">
                    Melde dich in deinem Konto an
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="mb-4 scale-in" dismissible onClose={() => setError('')}>
                    <Alert.Heading className="h6">
                      <span className="me-2">⚠️</span>
                      Anmeldung fehlgeschlagen
                    </Alert.Heading>
                    {error}
                  </Alert>
                )}
                
                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">E-Mail-Adresse</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="deine@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      size="lg"
                      className="border-2"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Passwort</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Dein Passwort"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      size="lg"
                      className="border-2"
                    />
                  </Form.Group>

                  {/* Rules Acceptance */}
                  <Alert variant="warning" className="mb-3">
                    <div className="fw-bold small mb-2">⚠️ Wichtige Hinweise zur Suche:</div>
                    <ul className="mb-2 small" style={{fontSize: '0.8rem'}}>
                      <li>✅ QR-Codes können geöffnet, angehoben oder verschoben werden</li>
                      <li>✅ Schau hinter, drunter, drüber, links & rechts</li>
                      <li>✅ Zusammenarbeit zwischen Gewerken ist nötig</li>
                      <li className="text-danger fw-bold">❌ NICHTS abbauen, umbauen oder zerstören!</li>
                    </ul>
                    <Form.Check
                      type="checkbox"
                      id="rulesAccepted"
                      label={<span className="fw-semibold">Ich habe die Hinweise gelesen und verstanden</span>}
                      checked={rulesAccepted}
                      onChange={(e) => setRulesAccepted(e.target.checked)}
                      className="mt-2"
                    />
                  </Alert>

                  <Button
                    type="submit"
                    variant="danger"
                    size="lg"
                    className="w-100 py-3 fw-semibold"
                    disabled={loading || !rulesAccepted}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Wird angemeldet...
                      </>
                    ) : (
                      <>
                        <span className="me-2">🔥</span>
                        Anmelden
                      </>
                    )}
                  </Button>
                </Form>
                
                {/* Register Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Noch kein Konto?{' '}
                    <Link 
                      to="/register" 
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Kostenlos registrieren
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;