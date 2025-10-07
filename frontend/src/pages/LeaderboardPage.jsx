import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { leaderboardAPI } from '../services/api.jsx';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard();
      setLeaderboard(response.data.leaderboard);
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Laden des Leaderboards');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Lade Leaderboard...</p>
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
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'warning';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'warning';
    if (rank <= 10) return 'info';
    return 'light';
  };

  const getRankBgColor = (rank) => {
    if (rank === 1) return 'bg-warning bg-opacity-10';
    if (rank === 2) return 'bg-secondary bg-opacity-10';
    if (rank === 3) return 'bg-warning bg-opacity-10';
    return 'bg-light';
  };

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-5 fade-in">
          <Col>
            <div className="text-center">
              <h1 className="display-4 fw-bold text-danger mb-4">
                <span className="me-3">🔥</span>
                QR Wachen Leaderboard
                <span className="ms-3">🏆</span>
              </h1>
              <p className="lead text-muted">
                Wer hat die meisten QR-Codes gefunden?
              </p>
            </div>
          </Col>
        </Row>

        {/* Stats */}
        <Row className="mb-5">
          <Col md="4">
            <Card className="border-0 shadow-sm text-center card-hover fade-in delay-1">
              <Card.Body className="py-4">
                <div className="display-6 text-primary mb-2">👥</div>
                <h3 className="h2 fw-bold text-primary mb-1">
                  {leaderboard.length}
                </h3>
                <p className="text-muted mb-0">Aktive Spieler</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="border-0 shadow-sm text-center card-hover fade-in delay-2">
              <Card.Body className="py-4">
                <div className="display-6 text-success mb-2">🎯</div>
                <h3 className="h2 fw-bold text-success mb-1">
                  {leaderboard.reduce((sum, player) => sum + player.totalFound, 0)}
                </h3>
                <p className="text-muted mb-0">Gefundene Codes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="border-0 shadow-sm text-center card-hover fade-in delay-3">
              <Card.Body className="py-4">
                <div className="display-6 text-warning mb-2">⭐</div>
                <h3 className="h2 fw-bold text-warning mb-1">
                  {leaderboard.reduce((sum, player) => sum + player.totalPoints, 0)}
                </h3>
                <p className="text-muted mb-0">Gesamtpunkte</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Leaderboard */}
        <Row>
          <Col lg="8" className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-4">
                <h2 className="h4 fw-bold mb-0 text-center">
                  <span className="me-2">📊</span>
                  Rangliste
                </h2>
              </Card.Header>
              <Card.Body className="p-0">
                {leaderboard.length > 0 ? (
                  <div className="p-4">
                    {leaderboard.map((player, index) => (
                      <div
                        key={player.id}
                        className={`d-flex align-items-center justify-content-between p-4 rounded mb-3 ${getRankBgColor(player.rank)}`}
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-4">
                            <div className="display-6 fw-bold text-primary">
                              {getRankIcon(player.rank)}
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-1 fw-bold">
                              {player.username}
                              {player.rank <= 3 && (
                                <Badge bg={getRankColor(player.rank)} className="ms-2 fs-6">
                                  Top {player.rank}
                                </Badge>
                              )}
                            </h4>
                            <p className="text-muted mb-0">
                              <Badge bg="info" className="me-2">
                                {player.totalFound} Codes gefunden
                              </Badge>
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-end">
                          <div className="display-6 fw-bold text-success mb-1">
                            {player.totalPoints}
                          </div>
                          <div className="text-muted small">Punkte</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="display-1 mb-4">🏆</div>
                    <h3 className="h4 fw-bold text-muted mb-3">
                      Noch keine Spieler
                    </h3>
                    <p className="text-muted mb-4">
                      Sei der Erste und starte die Schatzsuche!
                    </p>
                    <a href="/register" className="btn btn-primary btn-lg">
                      Jetzt registrieren
                    </a>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-5">
          <Col>
            <div className="text-center">
              <p className="text-muted mb-0">
                <small>
                  Letztes Update: {new Date().toLocaleString('de-DE')}
                </small>
              </p>
            </div>
          </Col>
        </Row>

        {/* Donation Section */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
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

export default LeaderboardPage;