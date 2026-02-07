const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config(); // Environment variables load karne ke liye

const seedSuperAdmin = async () => {
    try {
        // .env file se details fetch karna
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Role check karna taaki duplicate na bane
        const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });

        if (!adminExists) {
            // Password hashing (Security ke liye zaroori hai)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await User.create({
                name: 'Main Super Admin',
                email: adminEmail, // .env se aaya
                password: hashedPassword, // .env se aaya aur hash hua
                role: 'SUPER_ADMIN',
                coachingId: null // Super Admin ka koi coachingId nahi hota
            });

            console.log('✅ Super Admin created successfully!');
            console.log(`Email: ${adminEmail} (Loaded from .env)`);
        } else {
            console.log('ℹ️ Super Admin already exists. Skipping creation.');
        }
    } catch (error) {
        console.error('❌ Error seeding Super Admin:', error.message);
        // Server.js ko error throw karna taaki wo crash handle kar sake
        throw error; 
    }
};

module.exports = seedSuperAdmin;