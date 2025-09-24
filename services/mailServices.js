// C:\express\osmium_blog_backend\osmium_blog_express_application\services\mailService.js
import transporter from "../config/mailer.js";
import Mail from "../models/Mail.js";

export async function sendMail({ email, subject, template, context, text }) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      template,
      context,
      ...(text ? { text } : {}),
    });

    return "SENT";
  } catch (err) {
    console.error("sendMail Error:", err.message);
    return "FAILED";
  }
}

export async function createMail(data) {
  const mail = new Mail(data);

  try {
    const status = await sendMail(data);
    mail.status = status;
    await mail.save();
    return mail;
  } catch (err) {
    mail.status = "FAILED";
    await mail.save();
    throw new Error("Mail sending failed");
  }
}
