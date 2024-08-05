import express from "express"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore"
import { db } from "../../firebase.js"
import { HttpStatusCode } from "../utils/constant.js"

const router = express.Router()

router.route("/").post(async (req, res) => {
  try {
    const { name, participants } = req.body

    const docRef = await addDoc(collection(db, "conversations"), {
      name,
      create_at: Timestamp.fromDate(new Date()),
      update_at: Timestamp.fromDate(new Date()),
    })
    const docSnapshot = await getDoc(docRef)
    const conversationRef = docSnapshot.data()

    const participantPromises = participants.map((userId) => {
      return addDoc(collection(db, "participants"), {
        userId,
        conversationId: docSnapshot.id,
        joinAt: Timestamp.fromDate(new Date()),
      })
    })

    await Promise.all(participantPromises)
    res
      .status(HttpStatusCode.OK)
      .json({ success: true, conversationId: conversationRef.id })
  } catch (e) {
    console.error("Error adding task: ", e)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: e.message })
  }
})

router.route("/:userId").get(async (req, res) => {
  try {
    const { userId } = req.params
    const q = query(
      collection(db, "participants"),
      where("userId", "==", userId)
    )
    const querySnapshot = await getDocs(q)
    const conversationIds = []
    querySnapshot.forEach((doc) => {
      const participant = doc.data()
      if (participant.conversationId) {
        conversationIds.push(participant.conversationId)
      }
    })

    if (conversationIds.length === 0) {
      return res.status(HttpStatusCode.OK).json([])
    }

    const conversationPromises = conversationIds.map((id) =>
      getDoc(doc(db, "conversations", id))
    )

    const conversationsSnapshot = await Promise.all(conversationPromises)

    const conversations = []
    conversationsSnapshot.forEach((docSnapshot) => {
      if (docSnapshot.exists()) {
        conversations.push({ id: docSnapshot.id, ...docSnapshot.data() })
      }
    })

    const conversationWithLastMessagePromise = conversations.map(
      async (conversation) => {
        const messageQuery = query(
          collection(db, "messages"),
          where("conversationId", "==", conversation.id),
          orderBy("sentAt", "desc"),
          limit(1)
        )
        const messagesQuerySnapshot = await getDocs(messageQuery)

        let lastMessage = null
        messagesQuerySnapshot.forEach((doc) => {
          lastMessage = { id: doc.id, ...doc.data() }
        })

        const participantsQuery = query(
          collection(db, "participants"),
          where("conversationId", "==", conversation.id),
          where("userId", "!=", userId)
        )

        const participantsQuerySnapshot = await getDocs(participantsQuery)

        let participants = []
        participantsQuerySnapshot.forEach(async (doc) => {
          participants.push({ id: doc.id, ...doc.data() })
        })

        const participantsWithUserPromise = participants.map(
          async (participant) => {
            const userRef = await getDoc(
              doc(db, "employee", participant.userId)
            )
            const userFullName = userRef.data().name
            return { ...participant, userFullName }
          }
        )

        const participantsWithUser = await Promise.all(
          participantsWithUserPromise
        )

        return {
          ...conversation,
          lastMessage,
          participants: participantsWithUser,
        }
      }
    )

    const conversationWithMessage = await Promise.all(
      conversationWithLastMessagePromise
    )

    res.status(HttpStatusCode.OK).json(conversationWithMessage)
  } catch (error) {
    console.error("Error adding task: ", error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
  }
})

router.route("/:conversationId/participants").post(async (req, res) => {
  try {
    const { participants } = req.body
    const { conversationId } = req.params

    const participantPromises = participants.map((userId) => {
      return addDoc(collection(db, "participants"), {
        userId,
        conversationId: conversationId,
        joinAt: Timestamp.fromDate(new Date()),
      })
    })

    await Promise.all(participantPromises)

    res
      .status(HttpStatusCode.OK)
      .json({ success: true, conversationId: conversationId })
    // get conversations by user_id
  } catch (error) {
    console.error("Error adding task: ", e)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: e.message })
  }
})

export const conversationsRoutes = router
