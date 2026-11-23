import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_mern_secure_jwt_secret_key_8923482394_super_safe';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId.toString() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Set HTTP-only cookie with secure flags
 */
export const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear the HTTP-only auth cookie
 */
export const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};

/**
 * Middleware to protect routes and verify authenticated user
 */
export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fall back to Authorization: Bearer <token> header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      const found = memoryStore.users.find((u) => u._id.toString() === decoded.id.toString());
      if (found) {
        // Return clone without password
        const { password, ...safeUser } = found;
        user = safeUser;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account not found or has been deleted.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    let message = 'Not authorized: Invalid or expired token. Please log in again.';
    if (error.name === 'TokenExpiredError') {
      message = 'Your session has expired. Please log in again.';
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};
