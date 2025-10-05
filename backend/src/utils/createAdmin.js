const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('🔐 Admin-Benutzer erstellen');
    console.log('============================\n');

    const username = await question('Benutzername: ');
    const email = await question('E-Mail-Adresse: ');
    const password = await question('Passwort: ');

    if (!username || !email || !password) {
      console.log('❌ Alle Felder sind erforderlich!');
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingAdmin) {
      console.log('❌ Ein Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log('\n✅ Admin-Benutzer erfolgreich erstellt!');
    console.log(`📧 E-Mail: ${admin.email}`);
    console.log(`👤 Benutzername: ${admin.username}`);
    console.log(`🔑 Admin-Rechte: Ja`);

  } catch (error) {
    console.error('❌ Fehler beim Erstellen des Admin-Benutzers:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
