require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.js');
const seedSuperAdmin = require('./utils/seedAdmin');
const cors = require('cors');
const path = require('path');

const app = express();

// --- 1. CORS Configuration ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*' 
}));

// --- 2. Middlewares (Payload Size Fix) ---
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 3. Static Folder ---
// Normalize path for all OS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. Route Imports ---
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const startServer = async () => {
    try {
        console.log("⏳ Connecting to Database...");
        await connectDB();
        console.log("✅ Database connected successfully...");

        await seedSuperAdmin(); 

        // --- 5. Routes Setup ---
        app.use('/api/auth', authRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/teacher', teacherRoutes);
        app.use('/api/student', require('./routes/studentRoutes'));

        // Connection Test for Mobile
        app.get('/api/test-connection', (req, res) => {
            res.json({ success: true, message: "Mobile and Laptop are connected!" });
        });

        app.get('/', (req, res) => {
            res.send("Tuition SaaS Server is Running!");
        });

        const PORT = process.env.PORT || 5000;
        
        // '0.0.0.0' allows access from any device on your Wi-Fi
        app.listen(PORT, '0.0.0.0', () => {
    // Ye line terminal mein asli IP dikhayegi, check karna ki mobile mein yahi hai ya nahi
    console.log(`🚀 Server is LIVE on Port: ${PORT}`);
    console.log(`📡 Access via Mobile using your Current Laptop IP`);
});

    } catch (error) {
        console.error("❌ Server Start Error:", error.message);
        process.exit(1);
    }
};

startServer();