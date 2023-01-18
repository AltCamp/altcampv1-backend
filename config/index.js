require('dotenv').config()

module.exports = {
    app: {
        port: process.env.PORT || 8000,
        name: process.env.NAME,
        env: process.env.APP_ENV,
        frontendDomain: process.env.APP_FRONTEND_DOMAIN,
    },
    db: {
        name:
            process.env.APP_ENV == 'production'
                ? process.env.DATABASE_URL
                : process.env.TEST_DATABASE_URL,

        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiry: process.env.EXPIRY
    }
}