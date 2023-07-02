const winston = require('winston');
const fs = require('fs');
const config = require('../config');

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, json, colorize } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level} : ${message}`;
});

const getLogToProcess = (fileOpt, consoleOpt) => {
  const logArray = [];

  logArray.push(
    new winston.transports.File(fileOpt),
    new winston.transports.Console(consoleOpt)
  );

  return logArray;
};

/**
 * Logger class
 * @class Logger
 * @description - Logger used throughout the application lifecycle
 */

class Logger {
  constructor(options) {
    this.options = options;
    this.label = options.label;
    this.logDir = options.logDir || `${config.root_path}/logs`;

    this._labelOptions = {
      console: {
        level: 'debug',
        handleExceptions: true,
        format: combine(
          colorize({ all: true }),
          printf(
            (msg) =>
              `[${new Date(msg.timestamp).toUTCString()}]: ${msg.label} : - ${
                msg.level
              }: ${msg.message}`
          )
        ),
      },
      file: {
        level: 'debug',
        filename: `${this.logDir}/app.log`,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 2000,
        format: winston.format.json(),
      },
      Route: {
        level: 'debug',
      },
    };
    this.debugMode =
      options.debugMode === true || options.debugMode === undefined;
    this.environment = config.NODE_ENV || 'development';
  }

  /**
   * Logs all transactions during the app lifecycle
   * @memberof Logger
   */
  _logTransports() {
    const { console, file } = this._labelOptions;
    const fileOpt = {
      ...file,
      filename: `${this.logDir}/app.${this.environment}.log`,
    };
    const logProcess = getLogToProcess(fileOpt, console);
    return logProcess;
  }

  /**
   * Initiates a new Loger
   * @param {*} options
   * @returns { Object } A new logger instance
   *z @memberof Logger
   */
  Init() {
    const logger = winston.createLogger({
      format: combine(
        timestamp(),
        label({
          label: this.label,
        })
      ),
      transports: this._logTransports(),
      exitOnError: false,
    });
    logger.stream = {
      write(message) {
        logger.info(`${message}++++ `);
      },
    };
    return logger;
  }

  /**
   * Creates a new instance of the winston Logger with the specified configuration.
   * @static
   * @param { Object }  options - contains configuration parameters.
   * @param { String } options.logDirPath - Path to the log folder,
   * the default directory is logs (optional).
   * @param { Boolean } options.debugMode - If true turns on the debugging mode, default is true.
   * @param { String } options.label - A name used to describe the context of the log generated.
   * @returns { Object } - An instance of logger.
   * @memberof Logger
   */
  static createLogger(options) {
    const loggerInstance = new Logger(options);
    return loggerInstance.Init();
  }
}

module.exports = Logger;
