import express from "express"

import { accessCodeRoutes } from "./access-code.js"
import { authRoutes } from "./auth.js"
import { conversationsRoutes } from "./conversations.js"
import { employeesRoutes } from "./employees.js"
import { messagesRoutes } from "./message.js"
import { statusRoutes } from "./status.js"
import { tasksRoutes } from "./tasks.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/employees", employeesRoutes)
router.use("/access-code", accessCodeRoutes)
router.use("/status", statusRoutes)
router.use("/tasks", tasksRoutes)
router.use("/conversations", conversationsRoutes)
router.use("/messages", messagesRoutes)

export const routes = router
