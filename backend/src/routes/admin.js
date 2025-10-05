const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin-Berechtigung erforderlich' });
  }
  next();
};

// Get overall statistics
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalQRCodes = await prisma.qRCode.count();
    const totalFoundCodes = await prisma.foundCode.count();
    const activeQRCodes = await prisma.qRCode.count({
      where: { isActive: true }
    });

    // Get today's found codes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFoundCodes = await prisma.foundCode.count({
      where: {
        foundAt: {
          gte: today
        }
      }
    });

    // Get top 5 users
    const topUsers = await prisma.user.findMany({
      include: {
        foundCodes: {
          include: {
            qrCode: true
          }
        }
      },
      take: 5
    });

    const topUsersWithStats = topUsers.map(user => ({
      id: user.id,
      username: user.username,
      totalFound: user.foundCodes.length,
      totalPoints: user.foundCodes.reduce((sum, foundCode) => sum + foundCode.qrCode.points, 0)
    })).sort((a, b) => b.totalPoints - a.totalPoints);

    res.json({
      overview: {
        totalUsers,
        totalQRCodes,
        totalFoundCodes,
        activeQRCodes,
        remainingQRCodes: totalQRCodes - totalFoundCodes,
        todayFoundCodes
      },
      topUsers: topUsersWithStats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen der Statistiken' });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        foundCodes: {
          include: {
            qrCode: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const usersWithStats = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      totalFound: user.foundCodes.length,
      totalPoints: user.foundCodes.reduce((sum, foundCode) => sum + foundCode.qrCode.points, 0)
    }));

    res.json({ users: usersWithStats });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen der Benutzer' });
  }
});

// Get all QR codes
router.get('/qr-codes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const qrCodesWithStats = qrCodes.map(qrCode => ({
      id: qrCode.id,
      code: qrCode.code,
      name: qrCode.name,
      description: qrCode.description,
      points: qrCode.points,
      isActive: qrCode.isActive,
      createdAt: qrCode.createdAt,
      foundCount: qrCode.foundCodes.length,
      foundBy: qrCode.foundCodes.map(foundCode => ({
        username: foundCode.user.username,
        foundAt: foundCode.foundAt
      }))
    }));

    res.json({ qrCodes: qrCodesWithStats });
  } catch (error) {
    console.error('Admin QR codes error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen der QR-Codes' });
  }
});

// Create new QR code
router.post('/qr-codes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, name, description, points } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: 'Code und Name sind erforderlich' });
    }

    // Check if code already exists
    const existingCode = await prisma.qRCode.findUnique({
      where: { code: code }
    });

    if (existingCode) {
      return res.status(400).json({ error: 'QR-Code existiert bereits' });
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        code: code,
        name: name,
        description: description || null,
        points: points || 10,
        isActive: true
      }
    });

    res.status(201).json({
      message: 'QR-Code erfolgreich erstellt',
      qrCode
    });
  } catch (error) {
    console.error('Create QR code error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Erstellen des QR-Codes' });
  }
});

// Update QR code
router.put('/qr-codes/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, points, isActive } = req.body;

    const qrCode = await prisma.qRCode.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        points: points,
        isActive: isActive
      }
    });

    res.json({
      message: 'QR-Code erfolgreich aktualisiert',
      qrCode
    });
  } catch (error) {
    console.error('Update QR code error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Aktualisieren des QR-Codes' });
  }
});

// Delete QR code
router.delete('/qr-codes/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.qRCode.delete({
      where: { id: id }
    });

    res.json({ message: 'QR-Code erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete QR code error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Löschen des QR-Codes' });
  }
});

// Delete user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if trying to delete own account
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Du kannst dein eigenes Konto nicht löschen' });
    }

    // Delete user (cascade will handle foundCodes)
    await prisma.user.delete({
      where: { id: id }
    });

    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Löschen des Benutzers' });
  }
});

// Toggle QR code active status
router.patch('/qr-codes/:id/toggle-active', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const qrCode = await prisma.qRCode.findUnique({
      where: { id: id }
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'QR-Code nicht gefunden' });
    }

    const updatedQrCode = await prisma.qRCode.update({
      where: { id: id },
      data: {
        isActive: !qrCode.isActive
      }
    });

    res.json({
      message: `QR-Code ${updatedQrCode.isActive ? 'aktiviert' : 'deaktiviert'}`,
      qrCode: updatedQrCode
    });
  } catch (error) {
    console.error('Toggle QR code active error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Ändern des QR-Code-Status' });
  }
});

module.exports = router;
