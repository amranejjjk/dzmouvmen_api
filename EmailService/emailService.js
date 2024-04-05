class EmailService {
    static generatePasswordResetEmail(email, resetToken) {
      return {
        from: 'your-email@example.com',
        to: email,
        subject: 'Reset Your Password',
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  border-radius: 5px;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #007bff;
                }
                p {
                  margin-bottom: 20px;
                }
                a {
                  color: #007bff;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Reset Your Password</h1>
                <p>To reset your password, please click on the following link:</p>
                <p><a href="http://localhost:8000/api/v1/reset-password/${resetToken}">Reset Password</a></p>
              </div>
            </body>
          </html>
        `
      };
    }
  }
  
  module.exports = EmailService;
  