const Student = require('../models/Student');
const Fees = require('../models/Fees');

exports.getStudentFeeStatus = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const today = new Date();
        const joinDate = new Date(student.joiningDate);

        // 1. Calculate Months Difference
        let monthsDiff = (today.getFullYear() - joinDate.getFullYear()) * 12;
        monthsDiff += today.getMonth() - joinDate.getMonth();
        
        // Agar aaj ki date joining date se badi ya barabar hai, toh current month count hoga
        if (today.getDate() >= joinDate.getDate()) {
            monthsDiff += 1;
        }
        
        // Agar abhi join kiye 1 mahina nahi hua but class shuru ho gayi
        if (monthsDiff <= 0) monthsDiff = 1;

        const totalFeesDue = monthsDiff * student.monthlyFees;

        // 2. Total Paid Fees nikalna
        const payments = await Fees.find({ studentId: student._id });
        const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

        const pendingAmount = totalFeesDue - totalPaid;

        res.json({
            totalFeesDue,
            totalPaid,
            pendingAmount,
            monthlyFees: student.monthlyFees,
            monthsCount: monthsDiff
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};