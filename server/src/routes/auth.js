import bcrypt from "bcryptjs"
import express from "express"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import jwt from "jsonwebtoken"
import { db } from "../../firebase.js"
import { ENV } from "../config/constant.js"
import { HttpStatusCode } from "../utils/constant.js"

const router = express.Router()

router.route("/register").post(async (req, res) => {
  try {
    const { id, userName, password } = req.body

    const salt = await bcrypt.genSaltSync(10)
    const hash = await bcrypt.hash(password, salt)

    const docRef = await doc(db, "employee", id)

    const docSnap = await getDoc(docRef)
    const data = docSnap.data()
    if (docSnap.exists()) {
      if (data.userName && data.password) {
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
          success: false,
          message: "Your email is already have a account credential",
        })
      }
    }

    await updateDoc(docRef, {
      userName,
      password: hash,
    })

    const token = jwt.sign(
      {
        userId: id,
        userName: userName,
        role: data.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    )

    res.status(HttpStatusCode.OK).json({
      success: true,
      employeeId: id,
      message: "User registered successfully",
      token,
    })
  } catch (error) {
    console.error("Error registering account credentials: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

router.route("/login").post(async (req, res) => {
  try {
    const { userName, password } = req.body

    const q = query(
      collection(db, "employee"),
      where("userName", "==", userName)
    )

    const querySnapshot = await getDocs(q)
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ d: doc.id, ...doc.data() })
    })

    if (!data.length) {
      return res.status(HttpStatusCode.OK).json({
        success: false,
        message: "Account is not exist",
      })
    }

    const [employee] = data

    const isMath = await bcrypt.compareSync(password, employee.password)
    if (!isMath) {
      return res.status(HttpStatusCode.INTERNAL_SERVER).json({
        success: false,
        message: "Invalid userName or password",
      })
    }

    const token = jwt.sign(
      {
        userId: employee.id,
        email: employee.email,
        role: employee.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    )

    res.status(HttpStatusCode.OK).json({
      token: token,
      name: employee.name,
      userId: employee.id,
      email: employee.email,
    })
  } catch (error) {
    console.error("login Error: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

export const authRoutes = router
