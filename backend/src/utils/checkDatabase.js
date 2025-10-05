const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database state...');
    
    // Check if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Created: ${adminUser.createdAt}`);
      console.log(`   Updated: ${adminUser.updatedAt}`);
    } else {
      console.log('❌ No admin user found');
    }
    
    // Check QR codes
    const qrCodes = await prisma.qRCode.findMany();
    console.log(`\n📊 QR Codes found: ${qrCodes.length}`);
    
    if (qrCodes.length > 0) {
      console.log('   QR Codes:');
      qrCodes.forEach(qr => {
        console.log(`   - ${qr.code}: ${qr.name} (Created: ${qr.createdAt})`);
      });
    }
    
    // Check found codes
    const foundCodes = await prisma.foundCode.findMany();
    console.log(`\n🎯 Found codes: ${foundCodes.length}`);
    
    if (foundCodes.length > 0) {
      console.log('   Found codes:');
      foundCodes.forEach(found => {
        console.log(`   - User ${found.userId} found QR ${found.qrCodeId} at ${found.foundAt}`);
      });
    }
    
    // Check total users
    const totalUsers = await prisma.user.count();
    console.log(`\n👥 Total users: ${totalUsers}`);
    
    console.log('\n📅 Current time:', new Date().toISOString());
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
