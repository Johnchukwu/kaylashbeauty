import "dotenv/config";

const required = ["ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "ADMIN_JWT_SECRET"] as const;

export const env = {
  mongoUri: process.env.MONGODB_URI ?? process.env.MONGO_URI,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  adminJwtSecret: process.env.ADMIN_JWT_SECRET,
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  bachsWebhookSecret: process.env.BACHS_WEBHOOK_SECRET,
  bachsApiKey: process.env.BACHS_API_KEY,
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
};

export function assertAdminEnvironment() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment values: ${missing.join(", ")}`);
}
