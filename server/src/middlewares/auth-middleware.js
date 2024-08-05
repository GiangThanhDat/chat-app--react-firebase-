// const jwt = require('jsonwebtoken');
// const secretKey = 'your-secret-key'; // Use the same secret key as in authRoutes.js
import jwt from "jsonwebtoken"
import { ENV } from "../config/constant.js"
import { HttpStatusCode } from "../utils/constant.js"

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }
  try {
    console.log({ token })
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    console.log("error:", err)
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid token" })
  }
}
