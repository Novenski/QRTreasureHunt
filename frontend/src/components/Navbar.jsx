import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const CustomNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="danger" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span className="me-2">🔥</span>
          QR Wachen Schatzsuche
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/leaderboard" className="text-white">
              🏆 Leaderboard
            </Nav.Link>
            <Nav.Link 
              href="https://www.paypal.com/donate/?hosted_button_id=Z2RY7TUJNN8HC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-warning fw-semibold"
            >
              💝 Spenden
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-white">
                  📊 Dashboard
                </Nav.Link>
                
                {user?.isAdmin && (
                  <Nav.Link as={Link} to="/admin" className="text-white">
                    👨‍💼 Admin
                  </Nav.Link>
                )}
                
                <Navbar.Text className="me-3 text-white">
                  👋 {user?.username}
                </Navbar.Text>
                <Nav.Link onClick={handleLogout} className="text-white">
                  🚪 Abmelden
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  🔑 Anmelden
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-warning text-dark fw-semibold ms-2">
                  📝 Registrieren
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;