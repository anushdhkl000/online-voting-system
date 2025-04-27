exports.envConfig = () => {
    const ENVIRONMENT = process.env.ENVIRONMENT
    const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

    const JWT_SECRET = process.env.JWT_SECRET

    const EMAIL_USERNAME = process.env.SMTP_USER
    const EMAIL_PASSWORD = process.env.SMTP_PASSWORD
    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = process.env.SMTP_PORT
    const SMTP_SECURE = process.env.SMTP_SECURE

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY
    const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL
    const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
    const USER_MAIL = process.env.USER_MAIL
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
    const FRONTEND_URL = process.env.FRONTEND_URL

    let PORT
    if (ENVIRONMENT === 'development') {
        PORT = process.env.STAGING_PORT
    } else {
        PORT = process.env.PRODUCTION_PORT
    }

    return {
        ENVIRONMENT,
        PORT,
        MONGO_CONNECTION_STRING,
        JWT_SECRET,
        EMAIL_USERNAME,
        EMAIL_PASSWORD,
        SMTP_HOST,
        SMTP_PORT,
        SMTP_SECURE,
        GOOGLE_CLIENT_ID,
        GOOGLE_SECRET_KEY,
        GOOGLE_REDIRECT_URL,
        GOOGLE_REFRESH_TOKEN,
        USER_MAIL,
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET,
        FRONTEND_URL
    }
}