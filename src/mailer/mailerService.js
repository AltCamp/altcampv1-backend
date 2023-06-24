const { readFileSync } = require('fs');
const { join } = require('path');
const handlebars = require('handlebars');
const { createTransport } = require('nodemailer');
const { smtpConfig, nodemailer } = require('../../config');

const smptOpts = {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: {
    user: smtpConfig.authUser,
    pass: smtpConfig.authPass,
  },
};

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

const sendMail = async (payload, transportOptions = smptOpts) => {
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
