import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Spinner, Tab, Tabs } from 'react-bootstrap';
import { adminAPI } from '../services/api.jsx';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New QR Code Form
  const [newQRCode, setNewQRCode] = useState({
    code: '',
    name: '',
    description: '',
    points: 10,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, qrCodesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getQRCodes(),
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setQrCodes(qrCodesRes.data.qrCodes);
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQRCode = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await adminAPI.createQRCode(newQRCode);
      setNewQRCode({ code: '', name: '', description: '', points: 10 });
      setCreateSuccess('QR-Code erfolgreich erstellt!');
      fetchData(); // Refresh data
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Fehler beim Erstellen');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQRCode = async (id) => {
    if (window.confirm('QR-Code wirklich löschen?')) {
      try {
        await adminAPI.deleteQRCode(id);
        fetchData(); // Refresh data
        alert('QR-Code erfolgreich gelöscht!');
      } catch (err) {
        alert(err.response?.data?.error || 'Fehler beim Löschen');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Benutzer wirklich löschen? Alle gefundenen QR-Codes werden ebenfalls entfernt.')) {
      try {
        await adminAPI.deleteUser(id);
        fetchData(); // Refresh data
        alert('Benutzer erfolgreich gelöscht!');
      } catch (err) {
        alert(err.response?.data?.error || 'Fehler beim Löschen');
      }
    }
  };

  const handleToggleQRCodeActive = async (id) => {
    try {
      await adminAPI.toggleQRCodeActive(id);
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.error || 'Fehler beim Ändern des Status');
    }
  };

  const handleCopyQRCodeLink = async (qrCode) => {
    try {
      const qrCodeUrl = `${window.location.origin}/qr/${qrCode.code}`;
      await navigator.clipboard.writeText(qrCodeUrl);
      
      // Show success message temporarily
      const originalText = event.target.textContent;
      event.target.textContent = '✅ Kopiert!';
      event.target.className = 'btn btn-success btn-sm';
      
      setTimeout(() => {
        event.target.textContent = originalText;
        event.target.className = 'btn btn-outline-info btn-sm';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/qr/${qrCode.code}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      const originalText = event.target.textContent;
      event.target.textContent = '✅ Kopiert!';
      event.target.className = 'btn btn-success btn-sm';
      
      setTimeout(() => {
        event.target.textContent = originalText;
        event.target.className = 'btn btn-outline-info btn-sm';
      }, 2000);
    }
  };

  const handleEditQRCode = async (qrCode) => {
    const newName = prompt('Neuer Name:', qrCode.name);
    if (newName === null) return; // User cancelled
    
    const newDescription = prompt('Neue Beschreibung:', qrCode.description || '');
    if (newDescription === null) return; // User cancelled
    
    const newPoints = prompt('Neue Punkte:', qrCode.points);
    if (newPoints === null) return; // User cancelled
    
    try {
      await adminAPI.updateQRCode(qrCode.id, {
        name: newName,
        description: newDescription,
        points: parseInt(newPoints) || qrCode.points,
        isActive: qrCode.isActive
      });
      fetchData(); // Refresh data
      alert('QR-Code erfolgreich aktualisiert!');
    } catch (err) {
      alert(err.response?.data?.error || 'Fehler beim Aktualisieren');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Lade Admin-Daten...</p>
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

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="display-5 fw-bold text-primary mb-3">
                <span className="me-2">👨‍💼</span>
                Admin Dashboard
              </h1>
              <p className="lead text-muted">
                Verwaltung der QR-Code Schatzsuche
              </p>
            </div>
          </Col>
        </Row>

        {/* Tabs */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="px-4 pt-4"
            >
              <Tab eventKey="overview" title="📊 Übersicht">
                <div className="p-4">
                  {/* Stats Cards */}
                  <Row className="g-4 mb-5">
                    <Col md="3">
                      <Card className="h-100 border-0 shadow-sm stats-card">
                        <Card.Body className="text-center">
                          <div className="display-4 text-primary mb-2">👥</div>
                          <h3 className="h2 fw-bold text-primary mb-1">
                            {stats?.overview?.totalUsers || 0}
                          </h3>
                          <p className="text-muted mb-0">Registrierte Benutzer</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md="3">
                      <Card className="h-100 border-0 shadow-sm stats-card">
                        <Card.Body className="text-center">
                          <div className="display-4 text-success mb-2">🎯</div>
                          <h3 className="h2 fw-bold text-success mb-1">
                            {stats?.overview?.totalFoundCodes || 0}
                          </h3>
                          <p className="text-muted mb-0">Gefundene Codes</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md="3">
                      <Card className="h-100 border-0 shadow-sm stats-card">
                        <Card.Body className="text-center">
                          <div className="display-4 text-warning mb-2">📦</div>
                          <h3 className="h2 fw-bold text-warning mb-1">
                            {stats?.overview?.remainingQRCodes || 0}
                          </h3>
                          <p className="text-muted mb-0">Verbleibende Codes</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md="3">
                      <Card className="h-100 border-0 shadow-sm stats-card">
                        <Card.Body className="text-center">
                          <div className="display-4 text-info mb-2">📅</div>
                          <h3 className="h2 fw-bold text-info mb-1">
                            {stats?.overview?.todayFoundCodes || 0}
                          </h3>
                          <p className="text-muted mb-0">Heute gefunden</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Top Users */}
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-0 py-4">
                      <h2 className="h4 fw-bold mb-0">
                        <span className="me-2">🏆</span>
                        Top 5 Spieler
                      </h2>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="p-4">
                        {stats?.topUsers?.map((user, index) => (
                          <div key={user.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-3">
                            <div className="d-flex align-items-center">
                              <Badge bg={index < 3 ? 'warning' : 'secondary'} className="fs-6 px-3 py-2 me-3">
                                #{index + 1}
                              </Badge>
                              <div>
                                <h5 className="mb-1 fw-semibold">{user.username}</h5>
                                <small className="text-muted">{user.totalFound} Codes gefunden</small>
                              </div>
                            </div>
                            <Badge bg="success" className="fs-6 px-3 py-2">
                              {user.totalPoints} Punkte
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Donation Notice */}
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
                </div>
              </Tab>

              <Tab eventKey="qr-codes" title="🎯 QR-Codes">
                <div className="p-4">
                  {/* Create New QR Code */}
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-0 py-4">
                      <h2 className="h4 fw-bold mb-0">
                        <span className="me-2">➕</span>
                        Neuen QR-Code erstellen
                      </h2>
                    </Card.Header>
                    <Card.Body className="p-4">
                      {createError && (
                        <Alert variant="danger" className="mb-3" dismissible onClose={() => setCreateError('')}>
                          <Alert.Heading className="h6">Fehler beim Erstellen</Alert.Heading>
                          {createError}
                        </Alert>
                      )}
                      
                      {createSuccess && (
                        <Alert variant="success" className="mb-3" dismissible onClose={() => setCreateSuccess('')}>
                          <Alert.Heading className="h6">Erfolgreich erstellt!</Alert.Heading>
                          {createSuccess}
                        </Alert>
                      )}

                      <Form onSubmit={handleCreateQRCode}>
                        <Row className="g-3">
                          <Col md="6">
                            <Form.Group>
                              <Form.Label className="fw-semibold">Code (eindeutig)</Form.Label>
                              <Form.Control
                                type="text"
                                required
                                placeholder="z.B. PARK001"
                                value={newQRCode.code}
                                onChange={(e) => setNewQRCode({...newQRCode, code: e.target.value})}
                              />
                            </Form.Group>
                          </Col>
                          <Col md="6">
                            <Form.Group>
                              <Form.Label className="fw-semibold">Name</Form.Label>
                              <Form.Control
                                type="text"
                                required
                                placeholder="z.B. Park-Bank QR-Code"
                                value={newQRCode.name}
                                onChange={(e) => setNewQRCode({...newQRCode, name: e.target.value})}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        <Form.Group className="mt-3">
                          <Form.Label className="fw-semibold">Beschreibung</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows="3"
                            placeholder="Beschreibung des Verstecks..."
                            value={newQRCode.description}
                            onChange={(e) => setNewQRCode({...newQRCode, description: e.target.value})}
                          />
                        </Form.Group>
                        
                        <Form.Group className="mt-3">
                          <Form.Label className="fw-semibold">Punkte</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            className="w-auto"
                            value={newQRCode.points}
                            onChange={(e) => setNewQRCode({...newQRCode, points: parseInt(e.target.value)})}
                          />
                        </Form.Group>
                        
                        <Button 
                          type="submit" 
                          variant="primary" 
                          className="mt-3"
                          disabled={creating}
                        >
                          {creating ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Wird erstellt...
                            </>
                          ) : (
                            'QR-Code erstellen'
                          )}
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>

                  {/* QR Codes List */}
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-0 py-4">
                      <h2 className="h4 fw-bold mb-0">
                        <span className="me-2">📋</span>
                        Alle QR-Codes ({qrCodes.length})
                      </h2>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="p-4">
                        {qrCodes.map((qrCode) => (
                          <Card key={qrCode.id} className="mb-3 border-0 bg-light">
                            <Card.Body className="p-3">
                              <Row className="align-items-center">
                                <Col md="8">
                                  <h5 className="mb-1 fw-semibold">{qrCode.name}</h5>
                                  <p className="text-muted mb-1 small">
                                    Code: <Badge bg="secondary">{qrCode.code}</Badge> • 
                                    <Badge bg="primary" className="ms-1">{qrCode.points} Punkte</Badge>
                                  </p>
                                  {qrCode.description && (
                                    <p className="text-muted mb-0 small">{qrCode.description}</p>
                                  )}
                                  <small className="text-muted">
                                    {qrCode.foundCount} mal gefunden
                                  </small>
                                </Col>
                                <Col md="4" className="text-end">
                                  <Badge bg={qrCode.isActive ? 'success' : 'danger'} className="me-2">
                                    {qrCode.isActive ? 'Aktiv' : 'Inaktiv'}
                                  </Badge>
                                  <div className="d-flex gap-2 justify-content-end">
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      onClick={() => handleCopyQRCodeLink(qrCode)}
                                      title="Link kopieren für QR-Code Generator"
                                    >
                                      📋
                                    </Button>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => handleEditQRCode(qrCode)}
                                      title="Bearbeiten"
                                    >
                                      ✏️
                                    </Button>
                                    <Button
                                      variant={qrCode.isActive ? 'outline-warning' : 'outline-success'}
                                      size="sm"
                                      onClick={() => handleToggleQRCodeActive(qrCode.id)}
                                      title={qrCode.isActive ? 'Deaktivieren' : 'Aktivieren'}
                                    >
                                      {qrCode.isActive ? '⏸️' : '▶️'}
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDeleteQRCode(qrCode.id)}
                                      title="Löschen"
                                    >
                                      🗑️
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Tab>

              <Tab eventKey="users" title="👥 Benutzer">
                <div className="p-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-0 py-4">
                      <h2 className="h4 fw-bold mb-0">
                        <span className="me-2">👥</span>
                        Alle Benutzer ({users.length})
                      </h2>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="p-4">
                        {users.map((user) => (
                          <Card key={user.id} className="mb-3 border-0 bg-light">
                            <Card.Body className="p-3">
                              <Row className="align-items-center">
                                <Col md="6">
                                  <h5 className="mb-1 fw-semibold">
                                    {user.username}
                                    {user.isAdmin && (
                                      <Badge bg="danger" className="ms-2">Admin</Badge>
                                    )}
                                  </h5>
                                  <p className="text-muted mb-0 small">{user.email}</p>
                                  <small className="text-muted">
                                    Registriert: {new Date(user.createdAt).toLocaleDateString('de-DE')}
                                  </small>
                                </Col>
                                <Col md="6" className="text-end">
                                  <div className="d-flex align-items-center justify-content-end gap-3">
                                    <div>
                                      <Badge bg="success" className="fs-6 px-3 py-2 me-2">
                                        {user.totalPoints} Punkte
                                      </Badge>
                                      <Badge bg="info" className="fs-6 px-3 py-2">
                                        {user.totalFound} Codes
                                      </Badge>
                                    </div>
                                    {!user.isAdmin && (
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteUser(user.id)}
                                        title="Benutzer löschen"
                                      >
                                        🗑️
                                      </Button>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminPage;