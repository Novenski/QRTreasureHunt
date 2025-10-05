import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg="8">
              <h1 className="display-4 fw-bold mb-4">
                🎯 QR-Code Schatzsuche
              </h1>
              <p className="lead mb-4">
                Finde versteckte QR-Codes und sammle Punkte!
              </p>
              <div className="d-flex gap-3 justify-content-center">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-light btn-lg">
                    Zum Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg">
                      Jetzt spielen
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg">
                      Anmelden
                    </Link>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="h1 mb-4">Wie funktioniert das Spiel?</h2>
              <p className="lead text-muted">
                Einfach QR-Codes scannen und Punkte sammeln
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md="4" className="text-center">
              <div className="feature-icon">📱</div>
              <h3 className="h4 mb-3">QR-Code scannen</h3>
              <p className="text-muted">
                Scanne QR-Codes mit deinem Handy und werde zur Website weitergeleitet
              </p>
            </Col>
            
            <Col md="4" className="text-center">
              <div className="feature-icon">🎮</div>
              <h3 className="h4 mb-3">Anmelden & Spielen</h3>
              <p className="text-muted">
                Registriere dich oder melde dich an, um den QR-Code zu beanspruchen
              </p>
            </Col>
            
            <Col md="4" className="text-center">
              <div className="feature-icon">🏆</div>
              <h3 className="h4 mb-3">Punkte sammeln</h3>
              <p className="text-muted">
                Sammle Punkte und steige im Leaderboard auf
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-5 bg-light">
        <Container className="text-center">
          <h2 className="h1 mb-4">Bereit für die Schatzsuche?</h2>
          <p className="lead text-muted mb-4">
            Starte jetzt und finde alle versteckten QR-Codes!
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/leaderboard" className="btn btn-primary btn-lg">
              Leaderboard ansehen
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-outline-primary btn-lg">
                Kostenlos registrieren
              </Link>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;