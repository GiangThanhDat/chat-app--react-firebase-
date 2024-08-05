import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import http from "http"
import { dirname } from "path"
import { Server } from "socket.io"
import { fileURLToPath } from "url"
import { ENV } from "./config/constant.js"
import { routes } from "./routes/index.js"

const app = express()
app.use(cors())

const server = http.createServer(app)

const __dirname = dirname(fileURLToPath(import.meta.url))

const io = new Server(server, { cors: { origin: "*" } })

app.use(express.json())
app.use(bodyParser.json())

app.use("/", routes)

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message) // Broadcast the message to all connected clients
  })
})

server.listen(ENV.APP_PORT, ENV.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Realtime management app run on ${ENV.APP_HOST}:${ENV.APP_PORT}`)
})
