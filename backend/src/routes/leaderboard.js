const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get leaderboard (public)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        foundCodes: {
          include: {
            qrCode: true
          }
        }
      }
    });

    const leaderboard = users.map(user => ({
      id: user.id,
      username: user.username,
      totalFound: user.foundCodes.length,
      totalPoints: user.foundCodes.reduce((sum, foundCode) => sum + foundCode.qrCode.points, 0),
      foundCodes: user.foundCodes.map(foundCode => ({
        qrCodeName: foundCode.qrCode.name,
        points: foundCode.qrCode.points,
        foundAt: foundCode.foundAt
      }))
    })).sort((a, b) => b.totalPoints - a.totalPoints);

    // Add ranking
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({
      leaderboard: leaderboardWithRank,
      totalPlayers: users.length,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Abrufen des Leaderboards' });
  }
});

module.exports = router;
