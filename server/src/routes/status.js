import express from "express"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase.js"
import { HttpStatusCode } from "../utils/constant.js"

const router = express.Router()

router.route("/").get(async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "status"))

    let data = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })

    res.status(HttpStatusCode.OK).json(data)
  } catch (error) {
    console.error("Error get status: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

export const statusRoutes = router
