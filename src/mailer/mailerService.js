const { readFileSync } = require('fs');
const { join } = require('path');
const handlebars = require('handlebars');
const { createTransport } = require('nodemailer');
const { smtpConfig, nodemailer, gmailServiceConfig } = require('../../config');

const smptOpts = {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: {
    user: smtpConfig.authUser,
    pass: smtpConfig.authPass,
  },
};

const gmailOts = {
  service: 'gmail',
  port: 587,
  secure: true,
  auth: {
    type: 'OAUTH2',
    user: nodemailer.user,
    clientId: gmailServiceConfig.client_id,
    clientSecret: gmailServiceConfig.client_secret,
    refreshToken: gmailServiceConfig.refresh_token,
    accessToken: gmailServiceConfig.access_token,
  },
  debug: true,
};

function useOpt() {
  for (let each of Object.values(smptOpts)) {
    if (each === undefined) return gmailOts;
    return smptOpts;
  }
}

handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a === b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
handlebars.registerPartial('partialName', 'partialValue');

const buildEmailTemplate = (templateName) => {
  return handlebars.compile(
    readFileSync(join(__dirname, `/templates/${templateName}.hbs`), 'utf-8')
  );
};

const sendMail = async (payload, transportOptions = useOpt()) => {
  const transporter = createTransport(transportOptions);
  const emailTemplate = buildEmailTemplate(payload.templateName)(
    payload.context
  );
  const mailOptions = {
    from: nodemailer.email,
    to: payload.email,
    subject: payload.subject,
    html: emailTemplate,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
