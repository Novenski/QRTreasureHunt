const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Kein Token bereitgestellt' });
    }

    console.log('Token received:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    console.log('Token decoded:', decoded);
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      console.log('User not found:', decoded.userId);
      return res.status(401).json({ error: 'Ungültiger Token' });
    }

    console.log('User found:', user.username, 'isAdmin:', user.isAdmin);

    req.user = {
      id: decoded.userId,
      isAdmin: user.isAdmin
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Ungültiger Token' });
  }
};

module.exports = authMiddleware;
