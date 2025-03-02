const nodemailer = require('nodemailer');


async function sendVerificationEmail(userEmail,generatedCode)
{
    const transporter = nodemailer.createTransport(
        {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: 'lelah.sanford98@ethereal.email',
              pass: 'hXbqqrw5yA9v6TCpnf'
            }
        }
    );
    let info = await transporter.sendMail({
        from: '"UniCareerHub" <no-reply@UniCareerHub.com>',
        to: userEmail,
        subject: 'Verify Your Email Address',
        text: `Your verification code is: ${generatedCode}`,
        html: `<p>Your verification code is: <strong>${generatedCode}</strong></p>`
      });
      
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = sendVerificationEmail;