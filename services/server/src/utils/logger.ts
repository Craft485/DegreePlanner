import { createLogger, format, transports } from "winston"

const logger = createLogger({
  level: "debug",
  // format: format.combine(format.colorize(), format.simple(), format.timestamp()),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp(),
        // format.prettyPrint(),
        format.printf(info => `${info.timestamp} [${info.level}] ${info.message}: ${info.method} ${info.url} returned ${info.statusCode} to ${info.ip}`)
      ),
    })
  ]
})

export default logger
