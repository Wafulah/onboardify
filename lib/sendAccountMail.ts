import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Sends a welcome email with the new NCBA account number.
 * @param to The recipient's email address.
 * @param accountNumber The 9-digit bank account number.
 * @param name The recipient's name (optional).
 */
export async function sendAccountMail(to: string, accountNumber: string, name?: string) {
    const customerName = name ? " " + name : "";
    const subject = "🎉 Welcome to NCBA - Your New Account Details";
    const text = `Hello${customerName},\n\nWelcome to NCBA! Your account has been successfully verified and opened.\n\nYour new 9-digit Current Account number is:\n${accountNumber}\n\nYou can now start using your account. If you have any questions, please contact our support team.`;
    
    const html = `<p>Hello${customerName},</p>
        <p>Welcome to NCBA! Your account has been successfully verified and opened.</p>
        <h3>Your new NCBA Current Account Number is:</h3>
        <h1 style="color: #007bff; background-color: #f0f8ff; padding: 10px; border-radius: 5px; display: inline-block;">${accountNumber}</h1>
        <p>You can now start using your account. Thank you for choosing us!</p>`;

    await transporter.sendMail({
        from: `"NCBA Bank" <accounts@yourdomain.com>`, 
        to,
        subject,
        text,
        html
    });
}