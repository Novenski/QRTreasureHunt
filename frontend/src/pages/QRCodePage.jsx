import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { qrAPI } from '../services/api.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const QRCodePage = () => {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [hasCheckedClaimStatus, setHasCheckedClaimStatus] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  useEffect(() => {
    fetchQRCode();
  }, [codeId]);

  const fetchQRCode = async () => {
    try {
      const response = await qrAPI.getQRCode(codeId);
      setQrCode(response.data);
      // Only reset claim status if not currently showing success message
      if (!claimed) {
        setHasCheckedClaimStatus(false);
        setClaimError('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'QR-Code nicht gefunden');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      navigate(`/login?returnTo=/qr/${codeId}`);
      return;
    }

    // Check if already claimed
    const isAlreadyClaimed = qrCode && user ? qrCode.foundCodes?.some(foundCode => 
      foundCode.userId === user.id
    ) : false;
    
    if (isAlreadyClaimed) {
      setClaimError('Du hast diesen QR-Code bereits beansprucht!');
      return;
    }

    setClaiming(true);
    setClaimError('');
    
    try {
      const response = await qrAPI.claimQRCode(codeId);
      setClaimed(true);
      
      // Start countdown for redirect
      setRedirectCountdown(3);
      const countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Don't refresh QR code data immediately to preserve success message
      // The redirect will happen before the user sees the updated data
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Fehler beim Beanspruchen';
      setClaimError(errorMessage);
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !hasCheckedClaimStatus && qrCode && user) {
      setHasCheckedClaimStatus(true);
      
      const hasFoundThisCode = qrCode.foundCodes?.some(foundCode => 
        foundCode.userId === user?.id
      );
      
      if (hasFoundThisCode) {
        setClaimed(true);
      }
    }
  }, [isAuthenticated, qrCode, user, hasCheckedClaimStatus]);

  // Calculate if QR code is already claimed (stable calculation)
  const isAlreadyClaimed = qrCode && user ? qrCode.foundCodes?.some(foundCode => 
    foundCode.userId === user.id
  ) : false;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Lade QR-Code-Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center p-5">
                  <div className="display-1 text-danger mb-4">❌</div>
                  <h1 className="h2 fw-bold text-danger mb-4">
                    QR-Code nicht gefunden
                  </h1>
                  <p className="text-muted mb-4">{error}</p>
                  <Button variant="primary" onClick={() => navigate('/')}>
                    Zur Startseite
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg="8">
            {/* Success Message */}
            {claimed && (
              <Alert variant="success" className="mb-4 scale-in">
                <Alert.Heading className="h4">
                  <span className="me-2 pulse-animation">🎉</span>
                  QR-Code erfolgreich beansprucht!
                </Alert.Heading>
                <p className="mb-3">
                  Du hast <Badge bg="success" className="fs-5 px-3 py-2 pulse-animation">{qrCode?.points} Punkte</Badge> erhalten!
                </p>
                {redirectCountdown > 0 && (
                  <div className="d-flex align-items-center justify-content-center fade-in">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-success fw-bold">
                      Weiterleitung zum Dashboard in {redirectCountdown} Sekunden...
                    </span>
                  </div>
                )}
              </Alert>
            )}

            {/* QR Code Info */}
            <Card className="border-0 shadow-sm mb-4 card-hover fade-in">
              <Card.Body className="text-center p-4 p-md-5">
                <div className="display-1 mb-4 scale-in">🔥</div>
                <h1 className="display-5 fw-bold text-danger mb-3 slide-in-left">
                  {qrCode?.name}
                </h1>
                <Badge bg="danger" className="fs-5 px-3 py-2 mb-3 glow-animation">
                  {qrCode?.points} Punkte
                </Badge>
                {qrCode?.description && (
                  <p className="lead text-muted mb-4 slide-in-right">
                    {qrCode.description}
                  </p>
                )}

                {/* Action Buttons - Direkt unter QR-Code */}
                <div className="mt-4 pt-3 border-top">
                  {isAuthenticated ? (
                    <>
                      {(isAlreadyClaimed || claimed) ? (
                        <Alert variant="success" className="mb-3">
                          <Alert.Heading className="h6 mb-2">
                            <span className="me-2">✅</span>
                            Bereits beansprucht!
                          </Alert.Heading>
                          <p className="small mb-0">Du hast die Punkte bereits erhalten.</p>
                        </Alert>
                      ) : (
                        <>
                          {claimError && (
                            <Alert variant="danger" className="mb-3">
                              {claimError}
                            </Alert>
                          )}
                          <Button
                            variant="success"
                            size="lg"
                            onClick={handleClaim}
                            disabled={claiming}
                            className="w-100 py-3 fw-bold"
                          >
                            {claiming ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Wird beansprucht...
                              </>
                            ) : (
                              <>
                                <span className="me-2">🎯</span>
                                QR-Code beanspruchen & {qrCode?.points} Punkte erhalten
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div>
                      <Alert variant="warning" className="mb-3">
                        <div className="fw-bold mb-1">🔐 Anmeldung erforderlich</div>
                        <p className="small mb-0">
                          Melde dich an, um diesen QR-Code zu beanspruchen!
                        </p>
                      </Alert>
                      
                      <div className="d-grid gap-2">
                        <Button
                          variant="danger"
                          size="lg"
                          onClick={() => navigate(`/login?returnTo=/qr/${codeId}`)}
                          className="py-3 fw-bold"
                        >
                          <span className="me-2">🔑</span>
                          Anmelden
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="lg"
                          onClick={() => navigate(`/register?returnTo=/qr/${codeId}`)}
                          className="py-3 fw-bold"
                        >
                          <span className="me-2">📝</span>
                          Registrieren
                        </Button>
                      </div>
                      
                      <div className="mt-3">
                        <small className="text-muted">
                          💡 Nach der Anmeldung kommst du automatisch hierher zurück!
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Game Explanation */}
            <Card className="border-0 shadow-sm mb-4 card-hover fade-in delay-1">
              <Card.Body className="p-3 p-md-4">
                <div className="text-center mb-3">
                  <div className="display-4 mb-2">🎯</div>
                  <h2 className="h4 fw-bold text-danger mb-2">
                    QR Wachen Schatzsuche
                  </h2>
                  <p className="text-success fw-bold mb-0">
                    ✅ QR-Code gefunden!
                  </p>
                </div>

                {/* Prize Alert - Mobile Optimized */}
                <Alert variant="warning" className="mb-3 text-center">
                  <div className="fw-bold fs-5">🏆 Hauptgewinn</div>
                  <div className="small">Alle QR-Codes finden = Preis!</div>
                </Alert>

                {/* How to Play - Simplified */}
                <Card className="bg-light border-0 mb-3">
                  <Card.Body className="p-3">
                    <h3 className="h6 fw-bold mb-2 text-primary">📋 So funktioniert's:</h3>
                    <ol className="mb-0 small ps-3">
                      <li className="mb-1">Melde dich an oder registriere dich</li>
                      <li className="mb-1">QR-Code scannen & Punkte sammeln</li>
                      <li className="mb-1">Alle Codes finden & gewinnen!</li>
                    </ol>
                  </Card.Body>
                </Card>

                {/* Important Notice */}
                <Alert variant="info" className="mb-3">
                  <div className="fw-bold small mb-2">⚠️ Wichtige Hinweise zur Suche:</div>
                  <ul className="mb-0 small" style={{fontSize: '0.75rem'}}>
                    <li>✅ QR-Codes können geöffnet, angehoben oder verschoben werden</li>
                    <li>✅ Schau hinter, drunter, drüber, links & rechts</li>
                    <li>✅ Alle Codes sind frei zugänglich</li>
                    <li>✅ Zusammenarbeit zwischen Gewerken ist nötig</li>
                    <li className="text-danger fw-bold">❌ NICHTS abbauen, umbauen oder zerstören!</li>
                  </ul>
                </Alert>
                
                {/* Rules - Compact */}
                <div className="row g-2">
                  <div className="col-6">
                    <Card className="bg-success bg-opacity-10 border-success border-opacity-25 h-100">
                      <Card.Body className="p-2">
                        <div className="fw-bold small text-success mb-1">✅ Erlaubt</div>
                        <ul className="list-unstyled mb-0" style={{fontSize: '0.75rem'}}>
                          <li>• Im Team suchen</li>
                          <li>• Solo spielen</li>
                          <li>• Tipps geben</li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-6">
                    <Card className="bg-danger bg-opacity-10 border-danger border-opacity-25 h-100">
                      <Card.Body className="p-2">
                        <div className="fw-bold small text-danger mb-1">❌ Verboten</div>
                        <ul className="list-unstyled mb-0" style={{fontSize: '0.75rem'}}>
                          <li>• Codes beschädigen</li>
                          <li>• Verstecke verraten</li>
                          <li>• Mehrere Accounts</li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Navigation Buttons - Only after claim */}
            {isAuthenticated && (isAlreadyClaimed || claimed) && (
              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  📊 Zum Dashboard
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate('/leaderboard')}
                >
                  🏆 Leaderboard ansehen
                </Button>
              </div>
            )}

            {/* Stats */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <p className="text-muted mb-0">
                  <Badge bg="secondary" className="me-2">
                    {qrCode?.foundCount || 0}
                  </Badge>
                  Spieler haben diesen QR-Code bereits gefunden
                </p>
              </Card.Body>
            </Card>

            {/* Donation Section */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body className="p-4 text-center">
                <div className="display-4 text-primary mb-3">💝</div>
                <h3 className="h4 fw-bold mb-3">Unterstütze das Spiel</h3>
                <p className="text-muted mb-4">
                  Dieses Spiel läuft auf kostenpflichtigen Servern. 
                  Hilf mit, die Kosten zu decken und das Spiel am Laufen zu halten!
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default QRCodePage;