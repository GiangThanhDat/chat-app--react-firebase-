import fs from "fs"
import nodemailer from "nodemailer"
import path from "path"
import { fileURLToPath } from "url"
import { ENV } from "../config/constant.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: ENV.MAILER_AUTH_USER,
    pass: ENV.MAILER_AUTH_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

export const createVerifyEmailContent = (name, verificationLink) => {
  let template = fs.readFileSync(
    path.join(__dirname, "verify-template.html"),
    "utf8"
  )
  return template
    .replaceAll("{{verificationLink}}", verificationLink)
    .replaceAll("{{name}}", name)
}

export const createAccessEmailContent = (name, accessCode) => {
  let template = fs.readFileSync(
    path.join(__dirname, "access-code-template.html"),
    "utf8"
  )
  return template
    .replaceAll("{{accessCode}}", accessCode)
    .replaceAll("{{name}}", name)
}

export const sendMail = (to, subject, content) => {
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log("Server is ready to take our messages")
    }
  })

  const mainOptions = {
    from: "The Engineer team",
    to,
    subject,
    text: "",
    html: content,
  }

  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err)
      throw Error("Send mail failure", err)
    } else {
      console.log("Message sent: " + info.response)
    }
  })
}
