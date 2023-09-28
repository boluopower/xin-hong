import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    }),
    // new transports.Console(),
    new transports.File({filename: 'logs/info.log'}),
    new transports.File({filename: 'logs/error.log', level: 'error'})
  ]
});

logger.debug(process.env)
