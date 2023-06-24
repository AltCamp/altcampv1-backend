require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 8000,
    name: process.env.NAME,
    env: process.env.APP_ENV,
    frontendDomain: process.env.APP_FRONTEND_DOMAIN,
  },
  db: {
    name:
      process.env.APP_ENV === 'production'
        ? process.env.DATABASE_URL
        : process.env.TEST_DATABASE_URL,

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },
  nodemailer: {
    user: process.env.NODEMAILER_USER,
    email: process.env.NODEMAILER_EMAIL,
  },
  gmailServiceConfig: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
  },
  smtpConfig: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    authUser: process.env.SMTP_AUTH_USER,
    authPass: process.env.SMTP_AUTH_PASS,
  },
  cloudinary: {
    name:
      process.env.APP_ENV === 'production'
        ? process.env.CLOUDINARY_CLOUD_NAME
        : process.env.TEST_CLOUDINARY_CLOUD_NAME,
    key:
      process.env.APP_ENV === 'production'
        ? process.env.CLOUDINARY_API_KEY
        : process.env.TEST_CLOUDINARY_API_KEY,
    secret:
      process.env.APP_ENV === 'production'
        ? process.env.CLOUDINARY_API_SECRET
        : process.env.TEST_CLOUDINARY_API_SECRET,
    folder: process.env.APP_ENV === 'production' ? 'prod' : 'test',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.APP_ENV,
  },
};
