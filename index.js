require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.js'); // Sirf upar hi rehne dein
const seedSuperAdmin = require('./utils/seedAdmin');
const cors = require('cors');
const path = require('path');

const app = express();

// --- 1. Middlewares ---
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 2. Static Folder ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. Routes (Inhe bahar rakhein taaki server turant respond kare) ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

app.get('/api/test-connection', (req, res) => res.json({ success: true, message: "Connected!" }));
app.get('/', (req, res) => res.send("Tuition SaaS Server is Running!"));

// --- 4. Start Server & Connect DB ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 Server is LIVE on Port: ${PORT}`);
    
    try {
        console.log("⏳ Connecting to Database...");
        await connectDB(); // Ye config/db.js se aayega
        console.log("✅ Database connected successfully...");
        
        await seedSuperAdmin(); 
        console.log("👤 Super Admin check completed.");
    } catch (error) {
        console.error("❌ Background Startup Error:", error.message);
    }
});