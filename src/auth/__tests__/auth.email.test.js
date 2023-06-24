const { createTransport } = require('nodemailer-mock');

const { sendEmail } = require('../../../utils/sendMails');

const transporter = createTransport();

describe('sendEmail', () => {
  it('should send an email successfully', async () => {
    const to = 'princesam3600@gmail.com';
    const subject = 'Test Email';
    const body = '<h1>This is a test email</h1>';

    await sendEmail({ email: to, subject, body });

    // Assertions
    const sentMail = transporter.mock.getSetMail();
    console.log(sentMail);
    expect(sentMail.length).toBe(1);
    expect(sentMail[0].to).toBe(to);
    expect(sentMail[0].subject).toBe(subject);
    expect(sentMail[0].html).toBe(body);
  });
});
