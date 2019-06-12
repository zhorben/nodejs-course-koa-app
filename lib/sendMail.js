const juice = require('juice');
const config = require('config');
const path = require('path');
const pug = require('pug');

const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const SMTPTransport = require('nodemailer-smtp-transport');

const transportEngine = new SMTPTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.get('mailer.user'),
    pass: config.get('mailer.pass')
  }
});

const transport = nodemailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

module.exports = async function sendMail(options) {
  const html = pug.renderFile(
    path.join(config.get('template.root'), options.template) + '.pug',
    options.locals || {},
  );
  
  const message = {
    from: {
      address: config.get('mailer.user'),
      name: config.get('mailer.name')
    },
    html: juice(html),
    to: {
      address: options.to,
    },
    subject: options.subject,
    headers: options.headers || {},
  };
  
  return await transport.sendMail(message);
  
}
