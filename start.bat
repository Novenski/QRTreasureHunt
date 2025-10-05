# QR-Code Schatzsuche App - Start-Script

echo "🎯 QR-Code Schatzsuche App wird gestartet..."
echo ""

# Backend starten
echo "📦 Backend wird gestartet..."
cd backend
echo "🔧 Prisma Client wird generiert..."
npx prisma generate
echo "🗄️ Datenbank wird migriert..."
npx prisma migrate dev --name init
echo "🌱 Test-Daten werden erstellt..."
npm run db:seed
echo "🚀 Backend-Server wird gestartet..."
npm run dev &
BACKEND_PID=$!

# Warten bis Backend läuft
echo "⏳ Warte bis Backend bereit ist..."
sleep 5

# Frontend starten
echo "🎨 Frontend wird gestartet..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Beide Server sind gestartet!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "📊 API Health: http://localhost:3001/api/health"
echo ""
echo "📋 Test-Zugangsdaten:"
echo "   Admin: admin@example.com / admin123"
echo "   User: user@example.com / user123"
echo ""
echo "🎯 Test-QR-Codes:"
echo "   PARK001, CAFE002, LIBRARY003, STATION004, MALL005"
echo ""
echo "Drücke Ctrl+C zum Beenden"

# Warten auf Interrupt
wait $BACKEND_PID $FRONTEND_PID
