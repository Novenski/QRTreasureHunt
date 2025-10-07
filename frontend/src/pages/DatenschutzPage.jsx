import React from 'react';
import { Container, Card } from 'react-bootstrap';

const DatenschutzPage = () => {
  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h2 fw-bold mb-4 text-danger">
              <span className="me-2">🔒</span>
              Datenschutzerklärung
            </h1>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">1. Datenschutz auf einen Blick</h2>
              
              <h3 className="h6 fw-semibold mb-2">Allgemeine Hinweise</h3>
              <p className="small text-muted mb-3">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="h6 fw-semibold mb-2">Datenerfassung auf dieser Website</h3>
              <p className="small text-muted mb-1">
                <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
              </p>
              <p className="small text-muted mb-3">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber: Marius Priem
              </p>

              <p className="small text-muted mb-1">
                <strong>Wie erfassen wir Ihre Daten?</strong>
              </p>
              <p className="small text-muted mb-0">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z.B. bei der Registrierung). 
                Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">2. Hosting</h2>
              
              <h3 className="h6 fw-semibold mb-2">Vercel & Railway</h3>
              <p className="small text-muted mb-2">
                Diese Website wird auf Servern von Vercel (Frontend) und Railway (Backend/Datenbank) gehostet.
              </p>
              <ul className="small text-muted">
                <li>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li>Railway Corp., San Francisco, USA</li>
              </ul>
              <p className="small text-muted mb-0">
                Die Server erfassen automatisch Informationen in Server-Log-Dateien, die Ihr Browser automatisch übermittelt 
                (IP-Adresse, Browsertyp, Betriebssystem, Datum und Uhrzeit des Zugriffs).
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">3. Erhobene Daten</h2>
              
              <h3 className="h6 fw-semibold mb-2">Registrierung</h3>
              <p className="small text-muted mb-2">
                Bei der Registrierung werden folgende Daten erfasst:
              </p>
              <ul className="small text-muted mb-3">
                <li>Benutzername</li>
                <li>E-Mail-Adresse</li>
                <li>Passwort (verschlüsselt gespeichert)</li>
              </ul>

              <h3 className="h6 fw-semibold mb-2">Spielaktivitäten</h3>
              <p className="small text-muted mb-2">
                Während der Nutzung werden gespeichert:
              </p>
              <ul className="small text-muted mb-0">
                <li>Gefundene QR-Codes und Zeitpunkt des Fundes</li>
                <li>Erreichte Punkte</li>
                <li>Position im Leaderboard</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">4. Verwendung der Daten</h2>
              <p className="small text-muted mb-2">
                Die erhobenen Daten werden ausschließlich für folgende Zwecke verwendet:
              </p>
              <ul className="small text-muted mb-0">
                <li>Bereitstellung der Spielfunktionalität</li>
                <li>Authentifizierung und Benutzerverwaltung</li>
                <li>Anzeige des Leaderboards</li>
                <li>Verfolgung des Spielfortschritts</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">5. Datenweitergabe</h2>
              <p className="small text-muted mb-0">
                Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht. Die Daten werden ausschließlich für den Betrieb 
                der QR-Wachen Schatzsuche verwendet und auf sicheren Servern gespeichert.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">6. Ihre Rechte</h2>
              <p className="small text-muted mb-2">
                Sie haben das Recht:
              </p>
              <ul className="small text-muted mb-0">
                <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
                <li>Berichtigung unrichtiger Daten zu verlangen</li>
                <li>Löschung Ihrer Daten zu verlangen</li>
                <li>Der Datenverarbeitung zu widersprechen</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold mb-3">7. Cookies und LocalStorage</h2>
              <p className="small text-muted mb-0">
                Diese Website verwendet LocalStorage zur Speicherung des Authentifizierungstokens. 
                Dies ist notwendig für die Funktionalität der Anwendung. Es werden keine Tracking-Cookies verwendet.
              </p>
            </section>

            <section className="mb-0">
              <h2 className="h5 fw-bold mb-3">8. Kontakt</h2>
              <p className="small text-muted mb-0">
                Bei Fragen zum Datenschutz wenden Sie sich bitte an: Marius Priem
              </p>
            </section>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default DatenschutzPage;

