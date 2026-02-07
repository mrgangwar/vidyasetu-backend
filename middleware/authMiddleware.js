const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 🛠️ DEBUG: Dekhne ke liye ki token mein kya aa raha hai
            // console.log("Decoded Token:", decoded);

            let user;
            if (decoded.role === 'STUDENT') {
                user = await Student.findById(decoded.id).select('-password').lean();
            } else {
                user = await User.findById(decoded.id).select('-password').lean();
            }

            if (!user) {
                return res.status(401).json({ message: "User not found in Database" });
            }

            // User object attach karein
            req.user = user;
            
            // 🔍 EXTRA CHECK: Ensure role exists
            if (!req.user.role) {
                return res.status(401).json({ message: "User role is missing" });
            }

            next();

        } catch (error) {
            console.error("❌ Auth Middleware Error:", error.message);
            return res.status(401).json({ message: "Token expired or invalid" });
        }
    } else {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        // 🛠️ DEBUG: Check karne ke liye ki kaun access mang raha hai
        // console.log(`Attempting access: User Role [${req.user?.role}] vs Allowed [${roles}]`);

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Access Denied: Your role (${req.user?.role || 'Unknown'}) cannot access this.`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };