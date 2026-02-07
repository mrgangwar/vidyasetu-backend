const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Student name is required"],
        trim: true 
    },
    fatherName: { type: String, trim: true },
    collegeName: { type: String, trim: true },
    address: { type: String, trim: true },
    mobileNumber: { 
        type: String, 
        required: [true, "Mobile number is required"],
        trim: true 
    },
    email: { 
        type: String, 
        lowercase: true, 
        trim: true 
    },
    studentLoginId: { 
        type: String, 
        required: [true, "Login ID is required"], 
        unique: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    profilePhoto: { type: String, default: "" },
    batchTime: { type: String, trim: true }, 
    session: { type: String, trim: true },    
    parentMobile: { type: String, trim: true },
    role: { 
        type: String, 
        default: 'STUDENT' 
    },
    coachingId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coaching',
        required: true // Har student kisi coaching se juda hona chahiye
    },
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    pushToken: { 
        type: String, 
        default: '' 
    },
    // --- Fee & Dashboard Related Fields ---
    joiningDate: {
        type: Date,
        required: [true, "Joining date is required"],
        default: Date.now 
    },
    monthlyFees: {
        type: Number,
        required: [true, "Monthly fees amount is required"],
        min: [0, "Fees cannot be negative"],
        default: 0
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false 
    },
}, { 
    timestamps: true 
});

// Indexing for faster searches
studentSchema.index({ studentLoginId: 1 });
studentSchema.index({ coachingId: 1 });

module.exports = mongoose.model('Student', studentSchema);