import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../middleware/authMiddleware.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please ensure both passwords are identical.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    let user;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in or use another email.',
        });
      }

      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
      });
    } else {
      const existingUser = memoryStore.users.find((u) => u.email === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in or use another email.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        avatar: '',
        bio: '',
        preferences: {
          theme: 'light',
          notificationsEnabled: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryStore.users.push(user);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set secure HTTP-only cookie
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        preferences: user.preferences || { theme: 'light', notificationsEnabled: true },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password to log in.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    let user;
    let isMatch = false;

    if (isDbConnected) {
      user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. No user found with this email address.',
        });
      }
      isMatch = await user.comparePassword(password);
    } else {
      user = memoryStore.users.find((u) => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. No user found with this email address.',
        });
      }
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password provided.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        preferences: user.preferences || { theme: 'light', notificationsEnabled: true },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out current user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public / Private
 */
export const logoutUser = (req, res) => {
  clearTokenCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name, avatar, bio, preferences)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, bio, preferences } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    let updatedUser;

    if (isDbConnected) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name.trim();
      if (avatar !== undefined) user.avatar = avatar;
      if (bio !== undefined) user.bio = bio;
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }

      updatedUser = await user.save();
    } else {
      const userIndex = memoryStore.users.findIndex((u) => u._id.toString() === req.user._id.toString());
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const u = memoryStore.users[userIndex];
      if (name) u.name = name.trim();
      if (avatar !== undefined) u.avatar = avatar;
      if (bio !== undefined) u.bio = bio;
      if (preferences) {
        u.preferences = { ...u.preferences, ...preferences };
      }
      u.updatedAt = new Date().toISOString();

      const { password, ...safeUser } = u;
      updatedUser = safeUser;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current password and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match our records.',
        });
      }

      user.password = newPassword;
      await user.save();
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === req.user._id.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match our records.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.updatedAt = new Date().toISOString();
    }

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    next(error);
  }
};
