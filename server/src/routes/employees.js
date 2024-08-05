import express from "express"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { db } from "../../firebase.js"
import { ENV } from "../config/constant.js"
import { HttpStatusCode } from "../utils/constant.js"
import {
  createAccessEmailContent,
  createVerifyEmailContent,
  sendMail,
} from "../utils/mailer.js"
import { generateNumericOTP } from "../utils/opt.js"

const router = express.Router()

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const { id: docId } = req.params
      const docRef = doc(db, "employee", docId)

      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("No such document!")
      }

      const data = docSnap.data()
      res.status(HttpStatusCode.OK).json(data)
    } catch (error) {
      console.error("Error get a document: ", error)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })
  .put(async (req, res) => {
    try {
      const body = req.body
      const { id: docId } = req.params

      const docRef = doc(db, "employee", docId)
      await updateDoc(docRef, body)

      res.status(HttpStatusCode.OK).json({ success: true, id: docId })
    } catch (error) {
      console.error("Error updating document: ", error)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { id: docId } = req.params
      await deleteDoc(doc(db, "employee", docId))
      res.status(HttpStatusCode.OK).json({ success: true })
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })

router
  .route("/")
  .get(async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "employee"))

      let data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
      })

      res.status(HttpStatusCode.OK).json(data)
    } catch (error) {
      console.error("Error get documents: ", error)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const body = req.body

      const q = query(
        collection(db, "employee"),
        where("email", "==", body.email)
      )

      const employeeByEmailSnapshot = await getDocs(q)

      if (employeeByEmailSnapshot.size) {
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
          success: false,
          message: "This Email already exists in the system",
        })
      }

      const docRef = await addDoc(collection(db, "employee"), body)
      const docSnapshot = await getDoc(docRef)
      const createdEmployee = docSnapshot.data()

      const verificationLink = `${ENV.APP_DOMAIN}/auth/setup-credentials/${docSnapshot.id}`

      const emailContent = createVerifyEmailContent(
        createdEmployee.name,
        verificationLink
      )

      sendMail(createdEmployee.email, "Welcome to Our Team", emailContent)

      res
        .status(HttpStatusCode.OK)
        .json({ success: true, employeeId: docRef.id })
    } catch (e) {
      console.error("Error adding document: ", e)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: e.message })
    }
  })

router.route("/login-email").post(async (req, res) => {
  try {
    const { email } = req.body
    const accessCode = generateNumericOTP(6)

    const q = query(collection(db, "employee"), where("email", "==", email))

    const data = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    let emailContent = ""

    if (data.length === 0) {
      const docRef = await addDoc(collection(db, "employee"), {
        email,
        accessCode: accessCode,
      })

      const docSnapshot = await getDoc(docRef)
      const createdEmployee = docSnapshot.data()

      emailContent = createAccessEmailContent(
        createdEmployee.name || email,
        accessCode
      )

      sendMail(email, "Access code for authentication", emailContent)

      return res.status(HttpStatusCode.OK).json({ accessCode })
    }

    const [employee] = data

    emailContent = createAccessEmailContent(employee.nam || email, accessCode)

    await updateDoc(doc(db, "employee", employee.id), {
      accessCode: accessCode,
    })

    sendMail(email, "Access code for authentication", emailContent)

    res.status(HttpStatusCode.OK).json({ accessCode })
  } catch (error) {
    console.error("Error get access code by email failure: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

router.route("/validate-access-code").post(async (req, res) => {
  try {
    const { accessCode, email } = req.body

    const q = query(
      collection(db, "employee"),
      where("email", "==", email),
      where("accessCode", "==", accessCode)
    )

    const querySnapshot = await getDocs(q)

    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    if (!data.length) {
      return res
        .status(HttpStatusCode.OK)
        .json({ success: false, message: "Access code is incorrect" })
    }

    const [ValidatedEmployee] = data
    await updateDoc(doc(db, "employee", ValidatedEmployee.id), {
      accessCode: "",
    })

    const { id, name, userName, password } = ValidatedEmployee

    if (name && userName && password) {
      res
        .status(HttpStatusCode.OK)
        .json({ success: true, credential: true, id })
    }

    res.status(HttpStatusCode.OK).json({ success: true, credential: false, id })
  } catch (error) {
    console.error("validate access code fail: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

export const employeesRoutes = router
