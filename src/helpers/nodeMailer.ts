import nodemailer from 'nodemailer';
import config from '../config';

export const transporter = nodemailer.createTransport({
  host: config.mail.host, 
  secure: true,
  port: Number(config.mail.port),
  auth: {
    user: config.mail.username,
    pass: config.mail.password
  },
});

/*
const nodeMailer = require(‘nodemailer’);
let transporter = nodemailer.createTransport({
  host: “smtp.zoho.com”,
  secure: true,
  port: 465,
  auth: {
    user: “email@domain.is”,
    pass: “password_here”,
  },
});
*/



export async function sendMail(
  to: string,
  subject: string,
  text?: string,
  html?: string,
) {
  const mailOptions = {
    from: config.mail.mail_from_email_address,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}
