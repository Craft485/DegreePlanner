import express from "express";
import type { Express } from "express";
import logger from "./utils/logger.js";
import router from "./routes/routes.js";
import cors from "cors"

const app: Express = express()

//Setup middleware
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const { method, url, ip } = req
  next();
  res.on("finish", () => {
    logger.info("Request received", {
      method,
      url,
      ip,
      statusCode: res.statusCode,
    })
  })
})

app.use("/", router)

app.all("/ping", (req, res) => {
  res.status(200).send("Pong!")
})

app.listen(process.env.BACK_END_SERVER_PORT, () => console.log(`Listening on port ${process.env.BACK_END_SERVER_PORT}`))
