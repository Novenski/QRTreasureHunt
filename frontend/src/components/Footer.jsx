import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md="6" className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 small">
              © {new Date().getFullYear()} QR Wachen Schatzsuche - Marius Priem
            </p>
          </Col>
          <Col md="6" className="text-center text-md-end">
            <Link to="/impressum" className="text-white text-decoration-none small me-3">
              Impressum
            </Link>
            <Link to="/datenschutz" className="text-white text-decoration-none small">
              Datenschutz
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

