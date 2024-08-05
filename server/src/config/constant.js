import dotenv from "dotenv"

dotenv.config()

//  Environment constants
export const ENV = {
  APP_DOMAIN: process.env.APP_DOMAIN,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  MAILER_AUTH_USER: process.env.MAILER_AUTH_USER,
  MAILER_AUTH_PASS: process.env.MAILER_AUTH_PASS,
  APP_DOMAIN: process.env.APP_DOMAIN,
}
