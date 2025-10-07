const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSpecificQRCode() {
  try {
    console.log('🔍 Checking specific QR code: WFB001');
    
    // Check if QR code exists
    const qrCode = await prisma.qRCode.findUnique({
      where: { code: 'WFB001' },
      include: {
        foundCodes: {
          include: {
            user: {
              select: {
                username: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!qrCode) {
      console.log('❌ QR Code WFB001 not found');
      return;
    }
    
    console.log('✅ QR Code WFB001 found:');
    console.log(`   ID: ${qrCode.id}`);
    console.log(`   Name: ${qrCode.name}`);
    console.log(`   Description: ${qrCode.description}`);
    console.log(`   Points: ${qrCode.points}`);
    console.log(`   Active: ${qrCode.isActive}`);
    console.log(`   Created: ${qrCode.createdAt}`);
    
    console.log(`\n📊 Found by ${qrCode.foundCodes.length} users:`);
    qrCode.foundCodes.forEach((found, index) => {
      console.log(`   ${index + 1}. ${found.user.username} (${found.user.email}) at ${found.foundAt}`);
    });
    
    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true
      }
    });
    
    console.log(`\n👥 All users (${allUsers.length}):`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email}) ${user.isAdmin ? '[ADMIN]' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking QR code:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecificQRCode();
