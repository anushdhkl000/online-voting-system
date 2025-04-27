const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { envConfig } = require("../config/envConfig");

const config = envConfig();

const sendTestEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
            user: config.EMAIL_USERNAME,
            pass: config.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    }
    const info = await transporter.sendMail(mailOptions);
    return info;
}

const sendLiveMail = async (options) => {
    const oAuth2Client = new google.auth.OAuth2(
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_SECRET_KEY,
        config.GOOGLE_REDIRECT_URL
    );
    oAuth2Client.setCredentials({
        refresh_token: config.GOOGLE_REFRESH_TOKEN
    });
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: config.USER_MAIL,
                clientId: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_SECRET_KEY,
                refreshToken: config.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken

            }
        })

        const mailOptions = {
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: options.html
        }
        const info = await transport.sendMail(mailOptions);
        return info;
    } catch (error) {
        return error
    }

}



module.exports = {
    sendTestEmail,
    sendLiveMail
};