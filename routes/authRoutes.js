const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Controllers import
const forgotController = require('../controllers/forgotPasswordController');
const authController = require('../controllers/authController');

// Middleware import (Bahut zaroori hai!)
const { protect } = require('../middleware/authMiddleware');

// 🔍 DEBUGGING: Load check
console.log("🔐 Checking Auth Route Handlers:");
console.log("- login:", typeof authController.login);
console.log("- getNotices:", typeof authController.getNotices);

const { sendOTP, resetPassword } = forgotController;
const { login, getNotices } = authController; // getNotices ko yahan destructure kiya

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * @route   POST /api/auth/send-otp (Password Reset ke liye)
 */
router.post(
    '/send-otp',
    [
        check('email', 'Please include a valid email').isEmail(),
        validate
    ],
    sendOTP
);

/**
 * @route   POST /api/auth/reset-password
 */
router.post(
    '/reset-password',
    [
        check('email', 'Email is required').isEmail(),
        check('otp', 'OTP is required (6 digits)').isLength({ min: 6, max: 6 }),
        check('newPassword', 'Password must be at least 6 characters long').isLength({ min: 6 }),
        validate
    ],
    resetPassword
);

/**
 * @route   POST /api/auth/login (Teacher, Student, Admin sab ke liye)
 */
router.post(
    '/login',
    [
        check('emailOrId', 'Email or Login ID is required').not().isEmpty(),
        check('password', 'Password is required').exists(),
        validate
    ],
    login
);

/**
 * @route   GET /api/auth/notices
 * @desc    Get notices for Teacher or Student based on their role
 * @access  Private (Needs Token)
 */
router.get('/notices', protect, getNotices);
router.post('/update-push-token', protect, authController.updatePushToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user data
 * @access  Private
 */
router.get('/me', protect, authController.getMe); // 👈 Ye line add karein
module.exports = router;