import React from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section py-5" style={{ position: 'relative', zIndex: 1 }}>
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="justify-content-center text-center">
            <Col lg="8" className="fade-in">
              <div className="display-1 mb-4 pulse-animation">🔥</div>
              <h1 className="display-3 fw-bold mb-4">
                QR Wachen Schatzsuche
              </h1>
              <p className="lead mb-4 fs-4">
                Eine spannende Schatzsuche für die Kollegen der Wache!
              </p>
              <Badge bg="warning" text="dark" className="fs-5 mb-5 d-inline-block px-4 py-3 glow-animation">
                🏆 Wer alle QR-Codes findet, bekommt einen kleinen Preis!
              </Badge>
              <div className="d-flex gap-3 justify-content-center mt-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-light btn-lg px-5 py-3">
                    📊 Zum Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-warning btn-lg px-5 py-3 text-dark fw-bold">
                      🚀 Jetzt mitspielen
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3">
                      🔑 Anmelden
                    </Link>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Game Rules Section */}
      <div className="py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="h1 mb-4">🎮 Spielregeln & Prinzip</h2>
              <p className="lead text-muted">
                So funktioniert unsere Feuerwehr-Schatzsuche
              </p>
            </Col>
          </Row>
          
          <Row className="g-4 mb-5">
            <Col md="6" lg="3" className="text-center">
              <div className="feature-icon mb-3">📱</div>
              <h3 className="h5 mb-3">QR-Code scannen</h3>
              <p className="text-muted small">
                Scanne versteckte QR-Codes mit deinem Handy - sie leiten dich zur Website weiter
              </p>
            </Col>
            
            <Col md="6" lg="3" className="text-center">
              <div className="feature-icon mb-3">🎯</div>
              <h3 className="h5 mb-3">Anmelden & Beanspruchen</h3>
              <p className="text-muted small">
                Registriere dich oder melde dich an, um den QR-Code zu beanspruchen
              </p>
            </Col>
            
            <Col md="6" lg="3" className="text-center">
              <div className="feature-icon mb-3">🏆</div>
              <h3 className="h5 mb-3">Punkte sammeln</h3>
              <p className="text-muted small">
                Sammle Punkte und steige im Leaderboard auf
              </p>
            </Col>
            
            <Col md="6" lg="3" className="text-center">
              <div className="feature-icon mb-3">🎁</div>
              <h3 className="h5 mb-3">Preis gewinnen</h3>
              <p className="text-muted small">
                Wer alle QR-Codes findet, bekommt einen kleinen Preis!
              </p>
            </Col>
          </Row>

          {/* Game Rules Card */}
          <Row className="justify-content-center">
            <Col lg="8">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="h4 mb-4 text-center">📋 Spielregeln</h3>
                  <Row>
                    <Col md="6">
                      <h5 className="text-primary mb-3">✅ Erlaubt:</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">✅ <strong>Zusammen spielen</strong> - Ihr könnt gerne im Team suchen</li>
                        <li className="mb-2">✅ <strong>Alleine spielen</strong> - Jeder kann auch solo alle finden</li>
                        <li className="mb-2">✅ <strong>Hilfe geben</strong> - Kollegen bei der Suche unterstützen</li>
                        <li className="mb-2">✅ <strong>Mehrfach scannen</strong> - QR-Codes können mehrfach gescannt werden</li>
                      </ul>
                    </Col>
                    <Col md="6">
                      <h5 className="text-danger mb-3">❌ Nicht erlaubt:</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">❌ <strong>QR-Codes beschädigen</strong> - Bitte nicht zerstören</li>
                        <li className="mb-2">❌ <strong>Verstecke verraten</strong> - Anderen nicht die Standorte verraten</li>
                        <li className="mb-2">❌ <strong>Mehrere Accounts</strong> - Nur ein Account pro Person</li>
                        <li className="mb-2">❌ <strong>Betrug</strong> - Fair play ist wichtig!</li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* How to Play Section */}
      <div className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="h1 mb-4">🚀 So startest du</h2>
              <p className="lead text-muted">
                In wenigen Schritten bist du dabei
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md="4" className="text-center">
              <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <span className="fw-bold fs-4">1</span>
              </div>
              <h3 className="h5 mb-3">Registrieren</h3>
              <p className="text-muted">
                Erstelle einen Account mit deinem Namen und E-Mail
              </p>
            </Col>
            
            <Col md="4" className="text-center">
              <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <span className="fw-bold fs-4">2</span>
              </div>
              <h3 className="h5 mb-3">QR-Codes finden</h3>
              <p className="text-muted">
                Suche nach versteckten QR-Codes in der Feuerwache
              </p>
            </Col>
            
            <Col md="4" className="text-center">
              <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                <span className="fw-bold fs-4">3</span>
              </div>
              <h3 className="h5 mb-3">Punkte sammeln</h3>
              <p className="text-muted">
                Scanne, beanspruche und sammle Punkte für das Leaderboard
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-5 bg-white">
        <Container className="text-center">
          <h2 className="h1 mb-4">Bereit für die Schatzsuche?</h2>
          <p className="lead text-muted mb-4">
            Starte jetzt und finde alle versteckten QR-Codes in der Feuerwache!
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

      {/* Donation Section */}
      <div className="py-5 bg-light">
        <Container className="text-center">
          <h2 className="h1 mb-4">💝 Unterstütze das Spiel</h2>
          <p className="lead text-muted mb-4">
            Dieses Spiel läuft auf kostenpflichtigen Servern. Hilf mit, die Kosten zu decken!
          </p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="display-4 text-primary mb-3">💰</div>
                  <h3 className="h4 mb-3">Spende via PayPal</h3>
                  <p className="text-muted mb-4">
                    Jeder Beitrag hilft dabei, das Spiel am Laufen zu halten und neue Features zu entwickeln.
                  </p>
                  <a 
                    href="https://www.paypal.com/donate/?hosted_button_id=Z2RY7TUJNN8HC" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                  >
                    💳 Jetzt spenden
                  </a>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;