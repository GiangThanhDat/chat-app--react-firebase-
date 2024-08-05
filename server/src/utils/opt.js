import crypto from "crypto"

export function generateNumericOTP(length = 6) {
  // Ensure the OTP length is valid
  if (length < 1) throw new Error("OTP length must be at least 1")

  // Generate random bytes
  const bytes = crypto.randomBytes(length)

  // Convert bytes to a numeric string
  const otp = parseInt(bytes.toString("hex"), 16)
    .toString()
    .padStart(length, "0")

  // Extract the required length of OTP
  return otp.substring(0, length)
}
