import { createLogger, format, transports } from "winston"

const logger = createLogger({
  level: "debug",
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp(),
        format.printf(info => `${info.timestamp} [${info.level}] ${info.message}: ${info.method} ${info.url} returned ${info.statusCode} to ${info.ip}`)
      ),
    })
  ]
})

export default logger
