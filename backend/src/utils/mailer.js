const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Memories" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Memories App</title>
        </head>
        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
          line-height: 1.6;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          ">
            <div style="
              background-color: white;
              border-radius: 10px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
              <!-- Logo and Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://res.cloudinary.com/dptaceizj/image/upload/fl_preserve_transparency/v1738526145/open-book_5336946_ws2x6g.jpg?_s=public-apps" alt="Memories Logo" style="max-width: 150px;">
                <h1 style="
                  color: #333;
                  margin: 20px 0;
                  font-size: 24px;
                ">Welcome to Memories!</h1>
              </div>

              <!-- Main Content -->
              <div style="margin-bottom: 30px;">
                <p style="
                  color: #666;
                  font-size: 16px;
                  margin-bottom: 20px;
                ">Thank you for joining Memories. To start journaling your precious moments, please verify your email address.</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" style="
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #4A90E2;
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    margin: 20px 0;
                    transition: background-color 0.3s ease;
                  ">Verify Email Address</a>
                </div>

                <p style="
                  color: #666;
                  font-size: 14px;
                  margin-top: 20px;
                ">This link will expire in 1 hour. If expired, please register again.</p>
              </div>

              <!-- Security Note -->
              <div style="
                background-color: #f8f9fa;
                border-radius: 5px;
                padding: 15px;
                margin-top: 20px;
              ">
                <p style="
                  color: #666;
                  font-size: 14px;
                  margin: 0;
                ">If you didn't create an account with Memories, please ignore this email.</p>
              </div>

              <!-- Footer -->
              <div style="
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
              ">
                <p style="
                  color: #999;
                  font-size: 13px;
                  margin: 0;
                ">© ${new Date().getFullYear()} Memories App. All rights reserved.</p>

              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
