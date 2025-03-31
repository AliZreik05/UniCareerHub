const {google} = require ('googleapis')
const nodemailer = require('nodemailer')
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

async function sendVerificationEmail(userEmail,generatedCode)
{
    try{
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:
            {
                type:'OAuth2',
                user: 'unicareerhub271@gmail.com',
                clientId : CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken : REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions =
        {
            from: '"UniCareerHub" <no-reply@UniCareerHub.com>',
            to: userEmail,
            subject: 'Verify Your Email Address',
            text: `Your verification code is: ${generatedCode}`,
            html: `<p>Your verification code is: <strong>${generatedCode}</strong></p>`
        }
        const result = await transport.sendMail(mailOptions)
        return result
    }catch (error)
    {
        error
    }
}
module.exports = sendVerificationEmail;