const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        isAdmin: true
      }
    });

    console.log('✅ Admin user created:', admin.username);

    // Create sample QR codes
    const qrCodes = [
      {
        code: 'PARK001',
        name: 'Park-Bank QR-Code',
        description: 'Versteckt unter der Bank am Spielplatz',
        points: 10
      },
      {
        code: 'CAFE002',
        name: 'Café-Terrasse QR-Code',
        description: 'An der Wand der Café-Terrasse',
        points: 15
      },
      {
        code: 'LIBRARY003',
        name: 'Bibliothek QR-Code',
        description: 'Im Regal bei den Sachbüchern',
        points: 20
      },
      {
        code: 'STATION004',
        name: 'Bahnhof QR-Code',
        description: 'An der Wand beim Gleis 1',
        points: 25
      },
      {
        code: 'MALL005',
        name: 'Einkaufszentrum QR-Code',
        description: 'Bei der Information im Erdgeschoss',
        points: 30
      }
    ];

    for (const qrCodeData of qrCodes) {
      const qrCode = await prisma.qRCode.upsert({
        where: { code: qrCodeData.code },
        update: {},
        create: qrCodeData
      });
      console.log('✅ QR Code created:', qrCode.name);
    }

    // Note: No sample users created for production

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\n🎯 Sample QR Codes created:');
    qrCodes.forEach(qr => {
      console.log(`- ${qr.code}: ${qr.name} (${qr.points} Punkte)`);
    });
    console.log('\n⚠️  Remember to change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run seed if called directly (not imported)
if (require.main === module) {
  seed();
}
