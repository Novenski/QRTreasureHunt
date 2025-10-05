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

  useEffect(() => {
    fetchQRCode();
  }, [codeId]);

  const fetchQRCode = async () => {
    try {
      const response = await qrAPI.getQRCode(codeId);
      setQrCode(response.data);
      // Reset claim status when QR code data changes
      setClaimed(false);
      setHasCheckedClaimStatus(false);
      setClaimError('');
    } catch (err) {
      setError(err.response?.data?.error || 'QR-Code nicht gefunden');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      console.log('Redirecting to login with return URL:', `/qr/${codeId}`);
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
      await qrAPI.claimQRCode(codeId);
      setClaimed(true);
      // Refresh QR code data
      await fetchQRCode();
    } catch (err) {
      setClaimError(err.response?.data?.error || 'Fehler beim Beanspruchen');
    } finally {
      setClaiming(false);
    }
  };

  // Auto-claim QR code if user is authenticated and hasn't claimed it yet
  useEffect(() => {
    if (isAuthenticated && !hasCheckedClaimStatus && qrCode && user) {
      console.log('User is authenticated, checking if QR code should be auto-claimed...');
      setHasCheckedClaimStatus(true);
      
      // Check if this QR code was already found by this user
      const hasFoundThisCode = qrCode.foundCodes?.some(foundCode => 
        foundCode.userId === user?.id
      );
      
      if (!hasFoundThisCode) {
        console.log('QR code not found by user yet, auto-claiming...');
        handleClaim();
      } else {
        console.log('QR code already found by user, setting as claimed');
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
              <Alert variant="success" className="mb-4">
                <Alert.Heading className="h5">
                  <span className="me-2">🎉</span>
                  QR-Code erfolgreich beansprucht!
                </Alert.Heading>
                <p className="mb-0">
                  Du hast <Badge bg="success" className="fs-6">{qrCode?.points} Punkte</Badge> erhalten!
                </p>
              </Alert>
            )}

            {/* QR Code Info */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="text-center p-5">
                <div className="display-1 mb-4">🎯</div>
                <h1 className="display-5 fw-bold text-primary mb-3">
                  {qrCode?.name}
                </h1>
                <Badge bg="primary" className="fs-5 px-3 py-2 mb-4">
                  {qrCode?.points} Punkte
                </Badge>
                {qrCode?.description && (
                  <p className="lead text-muted mb-4">
                    {qrCode.description}
                  </p>
                )}
              </Card.Body>
            </Card>

            {/* Game Explanation */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h2 className="h4 fw-bold text-primary mb-3">
                  🔥 Feuerwehr QR-Code Schatzsuche
                </h2>
                <p className="text-muted mb-4">
                  Glückwunsch! Du hast einen QR-Code der Feuerwehr-Schatzsuche gefunden! 
                  Dieses Spiel ist speziell für die Kollegen der Feuerwache entwickelt worden.
                </p>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h3 className="h5 fw-bold mb-3 text-success">✅ Spielregeln:</h3>
                    <ul className="list-unstyled small">
                      <li className="mb-2">✅ <strong>Zusammen spielen</strong> - Ihr könnt gerne im Team suchen</li>
                      <li className="mb-2">✅ <strong>Alleine spielen</strong> - Jeder kann auch solo alle finden</li>
                      <li className="mb-2">✅ <strong>Hilfe geben</strong> - Kollegen bei der Suche unterstützen</li>
                      <li className="mb-2">✅ <strong>Fair play</strong> - Nur ein Account pro Person</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h3 className="h5 fw-bold mb-3 text-danger">❌ Nicht erlaubt:</h3>
                    <ul className="list-unstyled small">
                      <li className="mb-2">❌ <strong>QR-Codes beschädigen</strong></li>
                      <li className="mb-2">❌ <strong>Verstecke verraten</strong></li>
                      <li className="mb-2">❌ <strong>Mehrere Accounts</strong></li>
                      <li className="mb-2">❌ <strong>Betrug</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="alert alert-info mb-0">
                  <h4 className="alert-heading h5">🏆 Preis für alle Finder!</h4>
                  <p className="mb-0">
                    <strong>Wer alle QR-Codes findet, bekommt einen kleinen Preis!</strong><br/>
                    Sammle Punkte und steige im Leaderboard auf. Viel Erfolg bei der Suche!
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="text-center p-4">
                {isAuthenticated ? (
                  <>
                    {(isAlreadyClaimed || claimed) ? (
                      <div>
                        <Alert variant="info" className="mb-3">
                          <Alert.Heading className="h6">
                            <span className="me-2">✅</span>
                            Bereits beansprucht!
                          </Alert.Heading>
                          Du hast diesen QR-Code bereits gefunden und die Punkte erhalten.
                        </Alert>
                        <div className="d-grid gap-3">
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/dashboard')}
                          >
                            Zum Dashboard
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => navigate('/leaderboard')}
                          >
                            Leaderboard ansehen
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {claimError && (
                          <Alert variant="danger" className="mb-3" dismissible onClose={() => setClaimError('')}>
                            <Alert.Heading className="h6">Fehler beim Beanspruchen</Alert.Heading>
                            {claimError}
                          </Alert>
                        )}
                        <Button
                          variant="success"
                          size="lg"
                          onClick={handleClaim}
                          disabled={claiming}
                          className="px-5"
                        >
                          {claiming ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Wird beansprucht...
                            </>
                          ) : (
                            'QR-Code beanspruchen!'
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <p className="text-muted mb-4">
                      Melde dich an oder registriere dich, um den QR-Code zu beanspruchen!
                    </p>
                    <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate(`/login?returnTo=/qr/${codeId}`)}
                        className="px-4"
                      >
                        Anmelden
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => navigate(`/register?returnTo=/qr/${codeId}`)}
                        className="px-4"
                      >
                        Registrieren
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default QRCodePage;