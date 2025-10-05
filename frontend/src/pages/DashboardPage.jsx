import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { userAPI, qrAPI } from '../services/api.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [allQRCodes, setAllQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, qrCodesRes] = await Promise.all([
        userAPI.getStats(),
        qrAPI.getAllQRCodes(), // Neue API für alle QR-Codes
      ]);
      
      setStats(statsRes.data);
      setAllQRCodes(qrCodesRes.data.qrCodes || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Laden der Statistiken');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Lade deine Statistiken...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Fehler beim Laden</Alert.Heading>
          {error}
        </Alert>
      </Container>
    );
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return 'warning';
    if (rank <= 10) return 'info';
    return 'secondary';
  };

  // Check if user has found a specific QR code
  const hasFoundQRCode = (qrCodeId) => {
    return stats?.foundCodes?.some(foundCode => foundCode.qrCode.id === qrCodeId) || false;
  };

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-5">
        {/* Welcome Header */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="display-5 fw-bold text-primary mb-3">
                Willkommen zurück, {user?.username}! 👋
              </h1>
              <p className="lead text-muted">
                Hier ist dein Dashboard mit deinen Statistiken und Erfolgen
              </p>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col md="3">
            <Card className="h-100 border-0 shadow-sm stats-card">
              <Card.Body className="text-center">
                <div className="display-4 text-primary mb-2">🎯</div>
                <h3 className="h2 fw-bold text-primary mb-1">
                  {stats?.stats?.totalFound || 0}
                </h3>
                <p className="text-muted mb-0">Gefundene Codes</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md="3">
            <Card className="h-100 border-0 shadow-sm stats-card">
              <Card.Body className="text-center">
                <div className="display-4 text-success mb-2">⭐</div>
                <h3 className="h2 fw-bold text-success mb-1">
                  {stats?.stats?.totalPoints || 0}
                </h3>
                <p className="text-muted mb-0">Gesamtpunkte</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md="3">
            <Card className="h-100 border-0 shadow-sm stats-card">
              <Card.Body className="text-center">
                <div className="display-4 text-warning mb-2">🏆</div>
                <h3 className="h2 fw-bold text-warning mb-1">
                  {getRankIcon(stats?.stats?.rank || 0)}
                </h3>
                <p className="text-muted mb-0">Aktueller Rang</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md="3">
            <Card className="h-100 border-0 shadow-sm stats-card">
              <Card.Body className="text-center">
                <div className="display-4 text-info mb-2">👥</div>
                <h3 className="h2 fw-bold text-info mb-1">
                  {stats?.stats?.totalPlayers || 0}
                </h3>
                <p className="text-muted mb-0">Spieler gesamt</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Rank Badge */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-4">
                <Badge 
                  bg={getRankColor(stats?.stats?.rank || 0)} 
                  className="fs-4 px-4 py-2 mb-3"
                >
                  Rang {stats?.stats?.rank || 0} von {stats?.stats?.totalPlayers || 0}
                </Badge>
                <p className="text-muted mb-0">
                  Du bist unter den besten {Math.round(((stats?.stats?.totalPlayers || 0) - (stats?.stats?.rank || 0) + 1) / (stats?.stats?.totalPlayers || 1) * 100)}% aller Spieler!
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* QR Codes Overview */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-4">
                <h2 className="h4 fw-bold mb-0">
                  <span className="me-2">🗺️</span>
                  QR-Code Karte
                </h2>
                <p className="text-muted mb-0 mt-2">
                  Alle versteckten QR-Codes - finde sie alle!
                </p>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="p-4">
                  <Row className="g-3">
                    {allQRCodes.map((qrCode) => {
                      const isFound = hasFoundQRCode(qrCode.id);
                      return (
                        <Col md="6" lg="4" key={qrCode.id}>
                          <Card className={`h-100 border-0 ${isFound ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                            <Card.Body className="p-3">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <Badge bg={isFound ? 'success' : 'secondary'} className="fs-6 px-3 py-2">
                                  {qrCode.points} Punkte
                                </Badge>
                                {isFound && (
                                  <Badge bg="success" className="fs-6 px-3 py-2">
                                    ✅ Gefunden
                                  </Badge>
                                )}
                              </div>
                              
                              <h5 className={`fw-semibold mb-2 ${isFound ? '' : 'text-muted'}`}>
                                {isFound ? qrCode.name : 'Versteckter QR-Code'}
                              </h5>
                              
                              <p className={`small mb-2 ${isFound ? '' : 'text-muted'}`}>
                                {isFound ? qrCode.description : 'Finde diesen QR-Code, um Details zu sehen!'}
                              </p>
                              
                              <div className="text-muted small">
                                Code: <Badge bg="outline-secondary" className="ms-1">
                                  {isFound ? qrCode.code : '??? ???'}
                                </Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                  
                  {allQRCodes.length === 0 && (
                    <div className="text-center py-5">
                      <div className="display-1 mb-3">🗺️</div>
                      <h3 className="h4 fw-bold text-muted mb-3">
                        Noch keine QR-Codes versteckt
                      </h3>
                      <p className="text-muted">
                        Der Admin muss erst QR-Codes erstellen und verstecken.
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Found Codes */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-4">
                <h2 className="h4 fw-bold mb-0">
                  <span className="me-2">🎁</span>
                  Deine gefundenen QR-Codes
                </h2>
              </Card.Header>
              <Card.Body className="p-0">
                {stats?.foundCodes?.length > 0 ? (
                  <div className="p-4">
                    {stats.foundCodes.map((foundCode, index) => (
                      <div key={foundCode.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <Badge bg="primary" className="fs-6 px-3 py-2">
                              #{index + 1}
                            </Badge>
                          </div>
                          <div>
                            <h5 className="mb-1 fw-semibold">
                              {foundCode.qrCode.name}
                            </h5>
                            <small className="text-muted">
                              Gefunden am {new Date(foundCode.foundAt).toLocaleDateString('de-DE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <Badge bg="success" className="fs-6 px-3 py-2">
                            +{foundCode.qrCode.points} Punkte
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="display-1 mb-3">🔍</div>
                    <h3 className="h4 fw-bold text-muted mb-3">
                      Noch keine QR-Codes gefunden
                    </h3>
                    <p className="text-muted mb-4">
                      Gehe auf die Suche und scanne deinen ersten QR-Code!
                    </p>
                    <a href="/leaderboard" className="btn btn-primary btn-lg">
                      Leaderboard ansehen
                    </a>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Donation Section */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body className="p-4 text-center">
                <div className="display-4 text-primary mb-3">💝</div>
                <h3 className="h4 fw-bold mb-3">Unterstütze das Spiel</h3>
                <p className="text-muted mb-4">
                  Dieses Spiel läuft auf kostenpflichtigen Servern (Railway + Vercel). 
                  Hilf mit, die monatlichen Kosten zu decken!
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

export default DashboardPage;