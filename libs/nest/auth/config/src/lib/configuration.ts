import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
  JWT_SECRET: process.env['AUTH_JWT_SECRET'],
  GOOGLE_CLIENT_ID: process.env['AUTH_GOOGLE_CLIENT_ID'],
  GOOGLE_CLIENT_SECRET: process.env['AUTH_GOOGLE_CLIENT_SECRET'],
  GOOGLE_CALLBACK_URL: process.env['AUTH_GOOGLE_CALLBACK_URL'],
}))
