const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all QR codes (public, for dashboard overview)
router.get('/all', async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        points: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      qrCodes: qrCodes.map(qrCode => ({
        id: qrCode.id,
        code: qrCode.code,
        name: qrCode.name,
        description: qrCode.description,
        points: qrCode.points,
        isActive: qrCode.isActive,
        createdAt: qrCode.createdAt
      }))
    });
  } catch (error) {
    console.error('Get all QR codes error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen der QR-Codes' });
  }
});

// Get QR code details (public)
router.get('/:codeId', async (req, res) => {
  try {
    const { codeId } = req.params;
    
    // Case-insensitive search
    const qrCode = await prisma.qRCode.findFirst({
      where: { 
        code: {
          equals: codeId,
          mode: 'insensitive'
        }
      },
      include: {
        foundCodes: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'QR-Code nicht gefunden' });
    }

    if (!qrCode.isActive) {
      return res.status(400).json({ error: 'QR-Code ist nicht mehr aktiv' });
    }

    // Return QR code info without sensitive data
    res.json({
      id: qrCode.id,
      code: qrCode.code,
      name: qrCode.name,
      description: qrCode.description,
      points: qrCode.points,
      foundCount: qrCode.foundCodes.length,
      foundCodes: qrCode.foundCodes.map(fc => ({
        userId: fc.userId,
        foundAt: fc.foundAt
      }))
    });
  } catch (error) {
    console.error('QR code fetch error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen des QR-Codes' });
  }
});

// Claim QR code (authenticated)
router.post('/:codeId/claim', authMiddleware, async (req, res) => {
  try {
    const { codeId } = req.params;
    const userId = req.user.id;

    // Check if QR code exists and is active (case-insensitive)
    const qrCode = await prisma.qRCode.findFirst({
      where: { 
        code: {
          equals: codeId,
          mode: 'insensitive'
        }
      }
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'QR-Code nicht gefunden' });
    }

    if (!qrCode.isActive) {
      return res.status(400).json({ error: 'QR-Code ist nicht mehr aktiv' });
    }

    // Check if user already found this code
    const existingFoundCode = await prisma.foundCode.findFirst({
      where: {
        userId: userId,
        qrCodeId: qrCode.id
      }
    });

    if (existingFoundCode) {
      return res.status(400).json({ error: 'Du hast diesen QR-Code bereits gefunden' });
    }

    // Create found code record
    const foundCode = await prisma.foundCode.create({
      data: {
        userId: userId,
        qrCodeId: qrCode.id,
        foundAt: new Date()
      },
      include: {
        qrCode: true,
        user: {
          select: {
            username: true
          }
        }
      }
    });

    // Get user stats
    const userStats = await prisma.foundCode.findMany({
      where: { userId: userId },
      include: {
        qrCode: true
      }
    });

    const totalPoints = userStats.reduce((sum, foundCode) => sum + foundCode.qrCode.points, 0);

    res.json({
      message: 'QR-Code erfolgreich beansprucht!',
      foundCode: {
        id: foundCode.id,
        qrCode: {
          name: foundCode.qrCode.name,
          points: foundCode.qrCode.points
        },
        foundAt: foundCode.foundAt
      },
      userStats: {
        totalFound: userStats.length,
        totalPoints: totalPoints
      }
    });
  } catch (error) {
    console.error('QR code claim error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Beanspruchen des QR-Codes' });
  }
});

module.exports = router;
