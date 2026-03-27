const transporter = require("../config/mailer");
const User = require("../models/User");

const formatField = (label, value) => `${label}: ${value || "Not provided"}`;

const buildLostItemEmail = (item) => {
  const ownerName = item.owner?.name || "A campus user";
  const lines = [
    `${ownerName} reported a lost item on Campus Lost & Found.`,
    "",
    formatField("Title", item.title),
    formatField("Category", item.category),
    formatField("Location", item.location),
    formatField("Date of report", item.reportedAt),
    formatField("Contact", item.contact),
    formatField("Description", item.description),
  ];

  return {
    subject: `Lost item alert: ${item.title}`,
    text: lines.join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>New lost item reported</h2>
        <p>${ownerName} reported a lost item on Campus Lost &amp; Found.</p>
        <ul style="padding-left: 18px;">
          <li><strong>Title:</strong> ${item.title || "Not provided"}</li>
          <li><strong>Category:</strong> ${item.category || "Not provided"}</li>
          <li><strong>Location:</strong> ${item.location || "Not provided"}</li>
          <li><strong>Date of report:</strong> ${item.reportedAt || "Not provided"}</li>
          <li><strong>Contact:</strong> ${item.contact || "Not provided"}</li>
        </ul>
        <p><strong>Description:</strong> ${item.description || "Not provided"}</p>
      </div>
    `,
  };
};

const sendLostItemBroadcast = async (item) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return {
      delivered: false,
      reason: "Mail service is not configured",
    };
  }

  const users = await User.findAll({
    attributes: ["email"],
    where: {},
  });

  const recipients = [...new Set(users.map((user) => user.email?.trim().toLowerCase()).filter(Boolean))];

  if (!recipients.length) {
    return {
      delivered: false,
      reason: "No user emails available",
    };
  }

  const emailContent = buildLostItemEmail(item);

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: process.env.MAIL_FROM || process.env.MAIL_USER,
    bcc: recipients,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  return {
    delivered: true,
    recipientCount: recipients.length,
  };
};

module.exports = {
  sendLostItemBroadcast,
};
