const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const { join } = require('path');

const config = require('../../config');
const { BadRequestError } = require('../../utils/customError');
const TokenService = require('../src/token.service');
const { TOKEN_TYPE } = require('../constant');

async function sendEmail(opt) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: true,
    auth: {
      type: 'OAUTH2',
      user: config.nodemailer.user,
      clientId: config.nodemailer.client_id,
      clientSecret: config.nodemailer.client_secret,
      accessToken: config.nodemailer.access_token,
      refreshToken: config.nodemailer.refresh_token,
    },
    debug: true,
  });

  const mailOptions = {
    from: config.nodemailer.email,
    to: opt.email,
    subject: opt.subject,
    text: opt.body,
  };

  const sendMail = await transporter.sendMail(mailOptions);
  if (!sendMail) throw new BadRequestError(sendMail);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a === b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

handlebars.registerPartial('partialName', 'partialValue');

const verifyEmail = handlebars.compile(
  fs.readFileSync(join(__dirname, '../mails/emailVerification.hbs'), 'utf8')
);

const sendVerificationMail = async (user) => {
  const { email, id, firstname } = user;

  const context = { name: firstname };
  const template = verifyEmail(context);

  const token = Math.floor(Math.random() * 9000) + 1000;

  await TokenService.createToken({
    token,
    owner: id,
    type: TOKEN_TYPE.EMAIL_VERIFICATION,
  }).catch((err) => {
    throw new BadRequestError(err);
  });
  return sendEmail(
    { email, name: firstname },
    template,
    'WELCOME TO ALT-CAMP, VERIFY YOUR EMAIL'
  );
};

module.exports = { sendVerificationMail };
