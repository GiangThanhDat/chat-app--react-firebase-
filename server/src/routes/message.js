import express from "express"
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore"
import { db } from "../../firebase.js"
import { HttpStatusCode } from "../utils/constant.js"

const router = express.Router()

router
  .route("/:conversationId")
  .post(async (req, res) => {
    try {
      const { conversationId } = req.params
      const { senderId, messageContent } = req.body

      const message = {
        senderId,
        conversationId,
        messageContent,
        sentAt: Timestamp.fromDate(new Date()),
      }

      const docRef = await addDoc(collection(db, "messages"), message)
      const docSnapshot = await getDoc(docRef)
      const messageRef = docSnapshot.data()

      res.status(HttpStatusCode.OK).json({
        success: true,
        messageId: docRef.id,
        sentAt: messageRef.sentAt,
      })
    } catch (e) {
      console.error("Error adding task: ", e)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: e.message })
    }
  })
  .get(async (req, res) => {
    try {
      const { conversationId } = req.params

      const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("sentAt")
      )
      const querySnapshot = await getDocs(q)

      let data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
      })

      // const messagesWithUserPromise = data.map(async (message) => {
      //   const userRef = await getDoc(doc(db, "employee", message.senderId))
      //   const user = await userRef.data()
      //   return {
      //     ...message,
      //     sentAt: new Date(message.sentAt.seconds * 1000),
      //     user: {
      //       id: user.id,
      //       name: user.name,
      //       email: user.email,
      //     },
      //   }
      // })

      // const messagesWithUser = await Promise.all(messagesWithUserPromise)

      res.status(HttpStatusCode.OK).json(data)
    } catch (error) {
      console.error("Error adding task: ", error)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })

export const messagesRoutes = router
