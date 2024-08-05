import express from "express"
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { db } from "../../firebase.js"
import { HttpStatusCode } from "../utils/constant.js"
import { generateNumericOTP } from "../utils/opt.js"

const router = express.Router()

// const sendAccessCodeMessage = async (phoneNumber, accessCode) => {
//   const smsResponse = await client.messages.create({
//     body: `Your access code is: ${accessCode}. Please use this code to complete your login process. If you did not request this code, please ignore this message.`,
//     from: "+12086891367",
//     to: phoneNumber,
//   })

//   // .then((message) => {
//   //   console.log(`SMS sent: ${message.sid}`)
//   //   res.status(200).json({ message: "Access code sent" })
//   // })
//   // .catch((error) => {
//   //   console.error("Error sending SMS:", error)
//   //   res.status(500).json({ message: "Error sending access code" })
//   // })

//   console.log(`SMS sent: ${smsResponse.sid}`)
// }

router.route("/create-new-access-code").post(async (req, res) => {
  try {
    const { phoneNumber } = req.body

    if (!phoneNumber) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Phone number is required" })
    }

    const accessCode = generateNumericOTP(6)

    const q = query(
      collection(db, "employee"),
      where("phone", "==", phoneNumber)
    )

    const querySnapshot = await getDocs(q)

    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    if (data.length === 0) {
      await addDoc(collection(db, "employee"), {
        phone: phoneNumber,
        accessCode: accessCode,
      })

      // await sendAccessCodeMessage(phoneNumber, accessCode)

      return res.status(HttpStatusCode.OK).json({ accessCode })
    }

    const [employee] = data
    const docRef = await updateDoc(doc(db, "employee", employee.id), {
      accessCode: accessCode,
    })

    // await sendAccessCodeMessage(phoneNumber, accessCode)

    res
      .status(HttpStatusCode.OK)
      .json({ accessCode, message: "Access code sent" })
  } catch (error) {
    console.error("Error create access code: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

router.route("/validate-access-code").post(async (req, res) => {
  try {
    const { accessCode, phoneNumber } = req.body

    const q = query(
      collection(db, "employee"),
      where("phone", "==", phoneNumber),
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

    res.status(HttpStatusCode.OK).json({ success: true })
  } catch (error) {
    console.error("validate access code fail: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

export const accessCodeRoutes = router
