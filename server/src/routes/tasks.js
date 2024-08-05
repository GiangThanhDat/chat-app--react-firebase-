import express from "express"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore"
import { db } from "../../firebase.js"
import { HttpStatusCode } from "../utils/constant.js"

const router = express.Router()

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const { id: docId } = req.params
      const docRef = doc(db, "tasks", docId)

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

      const docRef = doc(db, "tasks", docId)
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
      await deleteDoc(doc(db, "tasks", docId))
      res.status(HttpStatusCode.OK).json({ success: true })
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })

router
  .route("/")
  .get(async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"))

      let data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
      })

      res.status(HttpStatusCode.OK).json(data)
    } catch (error) {
      console.error("Error get tasks: ", error)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const body = req.body

      const docRef = await addDoc(collection(db, "tasks"), body)
      const docSnapshot = await getDoc(docRef)
      const createdTask = docSnapshot.data()

      res.status(HttpStatusCode.OK).json({ success: true, taskId: docRef.id })
    } catch (e) {
      console.error("Error adding task: ", e)
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: e.message })
    }
  })

export const tasksRoutes = router
