const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    if (!options || !options.email) {
        console.log("⚠️ Email skipped: No options or recipient email provided.");
        return; 
    }

    try {

        // ✅ Default Professional Message
        const defaultMessage = `
Dear User,

Welcome to VidyaSetu – जहाँ शिक्षा और सफलता के बीच एक मजबूत सेतु बनाया जाता है।

Your notification has been generated successfully. Please check your account for the latest updates and important information.

VidyaSetu में आपका स्वागत है!
हमारा उद्देश्य आपकी learning और teaching journey को आसान, व्यवस्थित और प्रभावी बनाना है।

If you need any assistance, our support team is always ready to help you.

📚 Let’s build a brighter future together.
📚 आइए, मिलकर एक उज्जवल भविष्य का निर्माण करें।

Warm Regards,  
Team VidyaSetu
`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER ,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"VidyaSetu Support" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject || "VidyaSetu Notification",
            text: options.message || defaultMessage,
            html: options.html || `<div style="font-family:Arial,sans-serif;line-height:1.6;">
                                    ${ (options.message || defaultMessage).replace(/\n/g, "<br>") }
                                   </div>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent successfully to:", options.email);

    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
    }
};

module.exports = sendEmail;
