# QR-Code Schatzsuche App 🎯

Eine mobile Webanwendung für QR-Code-Schatzsuche mit Leaderboard und Admin-Panel.

## 🎮 Spielkonzept

- QR-Codes werden versteckt und enthalten URLs zur Website
- Spieler scannen QR-Codes und werden zur Website weitergeleitet
- Nach dem Einloggen wird der QR-Code automatisch dem Spieler zugewiesen
- Leaderboard zeigt die besten Spieler
- Admin kann QR-Codes verwalten und Statistiken einsehen

## 🛠️ Tech-Stack

### Backend
- **Node.js** + **Express** - Server-Framework
- **Prisma** - ORM für Datenbankzugriff
- **SQLite** (Entwicklung) / **PostgreSQL** (Produktion)
- **JWT** - Authentifizierung
- **bcrypt** - Passwort-Hashing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - UI-Framework
- **Vite** - Build-Tool
- **React Router** - Routing
- **Axios** - HTTP-Client
- **Bootstrap 5** - Styling
- **PWA** - Progressive Web App

### Deployment
- **Frontend**: Vercel (kostenlos)
- **Backend**: Railway (kostenlos bis 5$/Monat)
- **Datenbank**: Railway PostgreSQL
- **Domain**: Eigenes Domain (optional)

## 📁 Projekt-Struktur

```
QRG/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # API Controller
│   │   ├── middleware/     # Auth, CORS, etc.
│   │   ├── routes/         # API Routes
│   │   ├── models/         # Prisma Models
│   │   └── utils/          # Helper Functions
│   ├── prisma/
│   │   ├── schema.prisma   # Datenbank-Schema
│   │   └── migrations/     # DB Migrations
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/          # Seiten
│   │   ├── hooks/          # Custom Hooks
│   │   ├── services/       # API Services
│   │   └── utils/          # Helper Functions
│   └── package.json
└── README.md
```

## 🗄️ Datenbank-Schema

### Users
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `created_at`
- `is_admin` (Boolean)

### QR_Codes
- `id` (Primary Key)
- `code` (Unique Identifier)
- `name` (Display Name)
- `description` (Beschreibung)
- `points` (Punkte-Wert)
- `is_active` (Boolean)
- `created_at`

### Found_Codes
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `qr_code_id` (Foreign Key)
- `found_at` (Timestamp)
- `location` (Optional)

## 🔗 API-Endpunkte

### Public
- `GET /api/qr/:codeId` - QR-Code Details abrufen
- `POST /api/qr/:codeId/claim` - QR-Code beanspruchen
- `GET /api/leaderboard` - Leaderboard anzeigen

### User
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Anmeldung
- `GET /api/user/stats` - User-Statistiken
- `GET /api/user/found-codes` - Gefundene Codes

### Admin
- `GET /api/admin/stats` - Gesamtstatistiken
- `GET /api/admin/users` - Alle Benutzer
- `GET /api/admin/qr-codes` - Alle QR-Codes
- `POST /api/admin/qr-codes` - Neuen QR-Code erstellen
- `PUT /api/admin/qr-codes/:id` - QR-Code bearbeiten
- `DELETE /api/admin/qr-codes/:id` - QR-Code löschen

## 🚀 Deployment-Plan

### 1. Entwicklung
- Lokale Entwicklung mit SQLite
- Hot-Reload für Frontend und Backend
- Test-Daten für Entwicklung

### 2. Staging
- Railway für Backend
- Vercel für Frontend
- PostgreSQL auf Railway

### 3. Produktion
- Custom Domain
- SSL-Zertifikat
- Monitoring und Logging

## 📱 Features

### Für Spieler
- ✅ QR-Code scannen und beanspruchen
- ✅ Leaderboard anzeigen
- ✅ Eigene Statistiken
- ✅ Mobile-optimierte UI
- ✅ Offline-Funktionalität (PWA)

### Für Admins
- ✅ QR-Code-Management
- ✅ Benutzer-Übersicht
- ✅ Statistiken-Dashboard
- ✅ Leaderboard-Verwaltung

## 🔧 Was du selbst machen musst

### 1. Domain & Hosting Setup
- Domain kaufen (z.B. bei Namecheap, GoDaddy)
- DNS-Einstellungen konfigurieren
- SSL-Zertifikat einrichten

### 2. QR-Codes erstellen
- QR-Codes mit URLs generieren: `https://deine-domain.com/qr/ABC123`
- QR-Codes an gewünschten Orten verstecken
- QR-Code-Daten in Admin-Panel eingeben

### 3. Umgebungsvariablen
- `JWT_SECRET` - Geheimer Schlüssel für JWT
- `DATABASE_URL` - Datenbank-Verbindung
- `ADMIN_EMAIL` - Admin-E-Mail für ersten Admin

### 4. Monitoring
- Railway/Vercel Logs überwachen
- Performance-Monitoring einrichten
- Backup-Strategie für Datenbank

## 🚀 Deployment

Siehe [DEPLOYMENT.md](DEPLOYMENT.md) für eine detaillierte Anleitung.

### Schnellstart

1. **GitHub Repository** erstellen und Code hochladen
2. **Railway** für Backend + PostgreSQL
3. **Vercel** für Frontend
4. **Admin-Benutzer** erstellen
5. **QR-Codes** generieren und verstecken

### Kosten

- **Vercel**: Kostenlos (Frontend)
- **Railway**: Kostenlos bis 5$/Monat (Backend + DB)
- **Domain**: Optional, ~10$/Jahr

## ✅ Projekt Status

- ✅ **Backend-Setup** - Node.js + Express + Prisma
- ✅ **Frontend-Setup** - React + Vite + Bootstrap
- ✅ **Datenbank-Schema** - Prisma Models definiert
- ✅ **API-Implementierung** - Alle Endpunkte erstellt
- ✅ **Frontend-Komponenten** - UI implementiert
- ✅ **Admin-Panel** - Verwaltungsinterface funktionsfähig
- ✅ **Deployment** - Vercel + Railway vorbereitet
- ⏳ **PWA-Features** - Mobile-Optimierung (optional)

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- Dokumentation prüfen
- Logs überprüfen

