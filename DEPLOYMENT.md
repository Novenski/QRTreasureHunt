# QR-Code Schatzsuche - Deployment Guide

## 🚀 Deployment Übersicht

Diese Anwendung wird auf folgenden Plattformen deployed:
- **Frontend**: Vercel (React App)
- **Backend**: Railway (Node.js API)
- **Datenbank**: Railway PostgreSQL

## 📋 Voraussetzungen

1. **GitHub Repository** erstellen und Code hochladen
2. **Vercel Account** (kostenlos)
3. **Railway Account** (kostenlos)
4. **Node.js** installiert (für lokale Entwicklung)

## 🔧 Deployment Schritte

### 1. Backend auf Railway deployen

1. Gehe zu [railway.app](https://railway.app)
2. Melde dich mit GitHub an
3. Klicke "New Project" → "Deploy from GitHub repo"
4. Wähle dein Repository aus
5. Wähle den `backend` Ordner als Root Directory
6. Railway erstellt automatisch eine PostgreSQL Datenbank

### 2. Umgebungsvariablen setzen

In Railway Dashboard → Variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=dein-super-geheimer-jwt-schluessel
NODE_ENV=production
PORT=3001
```

### 3. Datenbank migrieren

In Railway Dashboard → Deploy Logs → Console:

```bash
npm run db:migrate
npm run db:seed
```

### 4. Admin-Benutzer erstellen

```bash
npm run db:create-admin
```

### 5. Frontend auf Vercel deployen

1. Gehe zu [vercel.com](https://vercel.com)
2. Melde dich mit GitHub an
3. Klicke "New Project" → "Import Git Repository"
4. Wähle dein Repository aus
5. Wähle den `frontend` Ordner als Root Directory
6. Setze Build Command: `npm run build`
7. Setze Output Directory: `dist`

### 6. Frontend Umgebungsvariablen

In Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://dein-railway-backend-url.up.railway.app/api
```

## 🔐 Admin-Zugang

Nach dem Deployment:

1. Gehe zu deiner Vercel-App
2. Klicke auf "Registrieren"
3. Erstelle einen neuen Benutzer
4. Gehe zu Railway Console
5. Führe aus: `npm run db:create-admin`
6. Folge den Anweisungen zum Erstellen eines Admin-Benutzers

## 📱 QR-Codes erstellen

1. Melde dich als Admin an
2. Gehe zum Admin-Panel
3. Erstelle neue QR-Codes
4. Generiere QR-Codes mit URLs wie: `https://deine-app.vercel.app/qr/PARK001`

## 🛠️ Lokale Entwicklung

```bash
# Backend starten
cd backend
npm install
npm run dev

# Frontend starten (neues Terminal)
cd frontend
npm install
npm run dev
```

## 📊 Monitoring

- **Railway**: Backend-Logs und Performance
- **Vercel**: Frontend-Analytics und Performance
- **PostgreSQL**: Datenbank-Performance

## 🔄 Updates deployen

1. Änderungen zu GitHub pushen
2. Railway und Vercel deployen automatisch
3. Bei Datenbankänderungen: `npm run db:migrate` in Railway Console

## 🆘 Troubleshooting

### Backend startet nicht
- Prüfe Umgebungsvariablen in Railway
- Prüfe Logs in Railway Dashboard

### Frontend kann Backend nicht erreichen
- Prüfe `VITE_API_URL` in Vercel
- Prüfe CORS-Einstellungen im Backend

### Datenbankfehler
- Prüfe `DATABASE_URL` in Railway
- Führe Migrationen aus: `npm run db:migrate`

## 📞 Support

Bei Problemen:
1. Prüfe Logs in Railway/Vercel Dashboard
2. Teste lokal mit `npm run dev`
3. Prüfe Umgebungsvariablen
4. Prüfe GitHub Repository für Updates
