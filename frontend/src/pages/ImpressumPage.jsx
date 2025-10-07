import React from 'react';
import { Container, Card } from 'react-bootstrap';

const ImpressumPage = () => {
  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h2 fw-bold mb-4 text-danger">
              <span className="me-2">📋</span>
              Impressum
            </h1>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">Angaben gemäß § 5 TMG</h2>
              <p className="mb-1">
                <strong>Marius Priem</strong>
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">Kontakt</h2>
              <p className="mb-1">
                Verantwortlich für den Inhalt: Marius Priem
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">Haftungsausschluss</h2>
              
              <h3 className="h6 fw-semibold mb-2">Haftung für Inhalte</h3>
              <p className="small text-muted mb-3">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </p>

              <h3 className="h6 fw-semibold mb-2">Haftung für Links</h3>
              <p className="small text-muted mb-3">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              </p>

              <h3 className="h6 fw-semibold mb-2">Urheberrecht</h3>
              <p className="small text-muted mb-0">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. 
                Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

            <section className="mb-0">
              <h2 className="h5 fw-bold mb-3">Hinweis</h2>
              <p className="small text-muted mb-0">
                Diese Website wurde im Rahmen eines privaten Projekts für die Feuerwehr erstellt. 
                Es handelt sich um eine nicht-kommerzielle Anwendung zur internen Nutzung.
              </p>
            </section>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ImpressumPage;

