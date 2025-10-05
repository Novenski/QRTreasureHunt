const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const foundCodes = await prisma.foundCode.findMany({
      where: { userId: userId },
      include: {
        qrCode: true
      }
    });

    const totalPoints = foundCodes.reduce((sum, foundCode) => sum + foundCode.qrCode.points, 0);

    // Get user ranking
    const allUsers = await prisma.user.findMany({
      include: {
        foundCodes: {
          include: {
            qrCode: true
          }
        }
      }
    });

    const userRankings = allUsers.map(user => ({
      userId: user.id,
      username: user.username,
      totalPoints: user.foundCodes.reduce((sum, foundCode) => sum + foundCode.qrCode.points, 0),
      totalFound: user.foundCodes.length
    })).sort((a, b) => b.totalPoints - a.totalPoints);

    const userRank = userRankings.findIndex(ranking => ranking.userId === userId) + 1;

    res.json({
      user: {
        id: req.user.id
      },
      stats: {
        totalFound: foundCodes.length,
        totalPoints: totalPoints,
        rank: userRank,
        totalPlayers: allUsers.length
      },
      foundCodes: foundCodes.map(foundCode => ({
        id: foundCode.id,
        qrCode: {
          name: foundCode.qrCode.name,
          points: foundCode.qrCode.points
        },
        foundAt: foundCode.foundAt
      }))
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen der Statistiken' });
  }
});

// Get user's found codes
router.get('/found-codes', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const foundCodes = await prisma.foundCode.findMany({
      where: { userId: userId },
      include: {
        qrCode: true
      },
      orderBy: {
        foundAt: 'desc'
      }
    });

    res.json({
      foundCodes: foundCodes.map(foundCode => ({
        id: foundCode.id,
        qrCode: {
          name: foundCode.qrCode.name,
          description: foundCode.qrCode.description,
          points: foundCode.qrCode.points
        },
        foundAt: foundCode.foundAt
      }))
    });
  } catch (error) {
    console.error('Found codes error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen der gefundenen Codes' });
  }
});

module.exports = router;
