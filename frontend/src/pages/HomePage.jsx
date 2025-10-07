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
              <h1 className="display-3 display-md-2 fw-bold mb-3">
                QR Wachen Schatzsuche
              </h1>
              <p className="lead mb-3 fs-5 fs-md-4">
                Spannende Schatzsuche für die Wache!
              </p>
              {/* Mobile-optimized Prize Badge */}
              <div className="mb-4">
                <Badge bg="warning" text="dark" className="fs-6 fs-md-5 d-inline-block px-3 px-md-4 py-2 py-md-3 glow-animation" style={{maxWidth: '90%'}}>
                  🏆 Alle Codes finden = Preis!
                </Badge>
              </div>
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
          <Row className="text-center mb-4">
            <Col>
              <h2 className="h2 mb-3">🎮 So funktioniert's</h2>
              <p className="text-muted">
                Einfache Schritte zur Schatzsuche
              </p>
            </Col>
          </Row>
          
          {/* Simplified Steps */}
          <Row className="g-3 mb-4">
            <Col xs="6" md="3" className="text-center">
              <Card className="border-0 shadow-sm h-100 card-hover">
                <Card.Body className="p-3">
                  <div className="fs-1 mb-2">📱</div>
                  <h3 className="h6 fw-bold mb-1">1. Scannen</h3>
                  <p className="small text-muted mb-0">QR-Code finden</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs="6" md="3" className="text-center">
              <Card className="border-0 shadow-sm h-100 card-hover">
                <Card.Body className="p-3">
                  <div className="fs-1 mb-2">🔑</div>
                  <h3 className="h6 fw-bold mb-1">2. Anmelden</h3>
                  <p className="small text-muted mb-0">Account erstellen</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs="6" md="3" className="text-center">
              <Card className="border-0 shadow-sm h-100 card-hover">
                <Card.Body className="p-3">
                  <div className="fs-1 mb-2">⭐</div>
                  <h3 className="h6 fw-bold mb-1">3. Sammeln</h3>
                  <p className="small text-muted mb-0">Punkte erhalten</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs="6" md="3" className="text-center">
              <Card className="border-0 shadow-sm h-100 card-hover">
                <Card.Body className="p-3">
                  <div className="fs-1 mb-2">🏆</div>
                  <h3 className="h6 fw-bold mb-1">4. Gewinnen</h3>
                  <p className="small text-muted mb-0">Preis erhalten</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Compact Rules */}
          <Row className="justify-content-center">
            <Col lg="10">
              <Row className="g-3">
                <Col md="6">
                  <Card className="border-success border-opacity-25 bg-success bg-opacity-10 h-100">
                    <Card.Body className="p-3">
                      <h5 className="h6 text-success mb-2">✅ Erlaubt</h5>
                      <ul className="list-unstyled small mb-0">
                        <li className="mb-1">• Im Team suchen</li>
                        <li className="mb-1">• Alleine spielen</li>
                        <li className="mb-1">• Tipps geben</li>
                        <li className="mb-0">• Codes mehrfach scannen</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md="6">
                  <Card className="border-danger border-opacity-25 bg-danger bg-opacity-10 h-100">
                    <Card.Body className="p-3">
                      <h5 className="h6 text-danger mb-2">❌ Verboten</h5>
                      <ul className="list-unstyled small mb-0">
                        <li className="mb-1">• Codes beschädigen</li>
                        <li className="mb-1">• Verstecke verraten</li>
                        <li className="mb-1">• Mehrere Accounts</li>
                        <li className="mb-0">• Betrügen</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
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