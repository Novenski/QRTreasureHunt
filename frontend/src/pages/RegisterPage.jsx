import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      const { user, token } = response.data;
      setSuccess('Registrierung erfolgreich! Du wirst weitergeleitet...');
      
      // Wait a moment to show success message
      setTimeout(() => {
        login(user, token);
        
        // Redirect to the return URL or dashboard
        console.log('Registration successful, redirecting to:', returnTo);
        navigate(returnTo);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Registrierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md="6" lg="5">
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="display-4 mb-3">🎯</div>
                  <h2 className="h3 mb-2 fw-bold">Registrieren</h2>
                  <p className="text-muted">
                    Erstelle dein Konto und starte die Schatzsuche!
                  </p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
                    <Alert.Heading className="h6">Registrierung fehlgeschlagen</Alert.Heading>
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert variant="success" className="mb-4">
                    <Alert.Heading className="h6">Erfolgreich!</Alert.Heading>
                    {success}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Benutzername</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Wähle einen Benutzernamen"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">E-Mail-Adresse</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="deine@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Passwort</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Mindestens 6 Zeichen"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Passwort bestätigen</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Passwort wiederholen"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="py-3"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 py-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Wird registriert...
                      </>
                    ) : (
                      'Konto erstellen'
                    )}
                  </Button>
                </Form>
                
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Bereits ein Konto?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Jetzt anmelden
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

export default RegisterPage;