import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import chatConfig from '../config';

interface EmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: chatConfig.mailHost,
  port: parseInt(chatConfig.mailPort, 10),
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: chatConfig.mailUser,
    pass: chatConfig.mailPassword,
  },
});

async function sendEmail(options: EmailOptions) {
  try {
    const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    const info = await transporter.sendMail({
      from: options.from || '"Default Sender" <default@example.com>', // sender address
      to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: options.html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendTemplateEmail(
  to: string | string[],
  subject: string,
  templateName: string,
  templateData: Record<string, any>
) {
  try {
    const templatePath = path.join(
      __dirname,
      '..', // go to server folder
      '..', // go to src folder
      'src', // go to src folder
      'templates', // go to templates folder
      `${templateName}.hbs`
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(templateData);

    return await sendEmail({
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending template email:', error);
    throw error;
  }
}

export { sendEmail, sendTemplateEmail };
