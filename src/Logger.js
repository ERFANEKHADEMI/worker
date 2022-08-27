/* eslint-disable class-methods-use-this */
const FgYellow = '\x1b[33m';
const FgRed = '\x1b[31m';
const FgCyan = '\x1b[36m';
const FgMagenta = '\x1b[35m';
const FgGreen = '\x1b[32m';
const Reset = '\x1b[0m';

const ms = require('ms');
const { Helper } = require('./Helper');
// LOG levels : Off (0) -> Info  (1) -> Warn (2) -> Error (3) -> Debug (4)
class Logger {
  constructor({ level = 'off', writeStream = false } = {}) {
    this.level = this.translateToCode(level);
    this.stream = writeStream;
    this.debug('Logger instantiated with loglevel:', this.level);
  }

  /**
   * Description: Convert human readable log level to level codes
   * @param {String} level
   */
  translateToCode(level) {
    let code;
    switch (level.toLowerCase()) {
      case 'off':
        code = 0;
        break;
      case 'info':
        code = 1;
        break;
      case 'warn':
        code = 2;
        break;
      case 'error':
        code = 3;
        break;
      case 'debug':
        code = 4;
        break;
      default:
        code = 0;
        break;
    }
    return code;
  }

  /**
   * Description: Print messages for loglevel info
   * @param {String| Object} msg
   * @param {Object} extra
   *
   */
  info(msg, extra) { // level 1
    if (this.level < 1) return;
    if (extra) msg += ` ${extra}`;
    if (typeof msg === 'string') {
      console.log(`${Helper.LocalTime(Date.now())} [INFO] > ${msg}`);
      this.writeToFile(`${Helper.LocalTime(Date.now())} ${msg}`, extra);
    } else {
      console.log(`${Helper.LocalTime(Date.now())} [INFO] > `, msg);
      this.writeToFile(`${Helper.LocalTime(Date.now())} ${JSON.stringify(msg)}`, extra);
    }
  }

  warn(msg, extra) { // level 2
    if (this.level < 2) return;
    if (extra) {
      if (typeof extra === 'string' && typeof msg === 'string') {
        msg += ` ${extra}`;
        console.log(`${Helper.LocalTime(Date.now())} [${FgYellow}WARN${Reset}] > ${FgYellow} ${msg}`, Reset);
        this.writeToFile(`[WARN] ${msg}`, extra);
      } else {
        console.log(`${Helper.LocalTime(Date.now())} [WARN] > ${FgRed} ${msg} `, extra);
        this.writeToFile(`[WARN] ${JSON.stringify(msg)}`, extra);
      }
      return;
    }
    if (typeof msg === 'string') {
      console.log(`${Helper.LocalTime(Date.now())} [${FgYellow}WARN${Reset}] > ${FgYellow} ${msg}`, Reset);
      this.writeToFile(`[WARN] ${msg}`, extra);
    } else {
      console.log(`${Helper.LocalTime(Date.now())} [WARN] > ${FgRed} `, msg);
      this.writeToFile(`[WARN] ${JSON.stringify(msg)}`, extra);
    }
  }

  error(msg, extra) { // level 3
    if (this.level < 3) return;
    if (extra) msg += ` ${extra}`;
    if (typeof msg === 'string') console.log(`${Helper.LocalTime(Date.now())} [ERROR] > ${FgRed} ${msg}`, Reset);
    else console.log(`${Helper.LocalTime(Date.now())} [ERROR] > ${FgRed} `, msg);
  }

  fatal(msg, extra) { //
    if (!msg) {
      console.log(`[FATAL] > ${FgRed} `, 'Unknown msg passed to Logger');
      process.exit(-1);
      return;
    }
    if (extra) {
      if (typeof msg === 'string') console.log(`[FATAL] > ${FgRed} ${msg}`, extra, Reset);
      else console.log(`[FATAL] > ${FgRed} `, msg, extra, Reset);
      process.exit(-1);
    }
    if (typeof msg === 'string') console.log(`[FATAL] > ${FgRed} ${msg}`, Reset);
    else console.log(`[FATAL] > ${FgRed} `, msg, Reset);
    process.exit(-1);
  }

  debug(msg, extra) {
    if (this.level < 4 || !msg) return;
    if (typeof msg === 'string') {
      if (extra) {
        console.log(`${Helper.LocalTime(Date.now())} [${FgMagenta}DEBUG${Reset}]> ${msg}`, extra);
        this.writeToFile(`${Helper.LocalTime(Date.now())} ${msg}`, extra);
        return;
      }
      console.debug(`${Helper.LocalTime(Date.now())} [${FgMagenta}DEBUG${Reset}]> ${msg}`);
      this.writeToFile(`${Helper.LocalTime(Date.now())} ${msg}`, extra);
    } else {
      if (extra) {
        console.log(`${Helper.LocalTime(Date.now())} [${FgMagenta}DEBUG${Reset}]> ${msg}`, extra);
        this.writeToFile(msg, extra);
        this.writeToFile(`${Helper.LocalTime(Date.now())} ${JSON.stringify(msg)}`, extra);
        return;
      }
      console.log(`${Helper.LocalTime(Date.now())} [${FgMagenta}DEBUG${Reset}] > `, msg);
      this.writeToFile(`${Helper.LocalTime(Date.now())} ${JSON.stringify(msg)}`, extra);
    }
  }

  writeToFile(msg, extra = '') {
    if (this.stream) {
      if (typeof msg === 'object') {
        this.stream.write(`${JSON.stringify(msg)}`);
      } else {
        this.stream.write(msg);
      }
      if (typeof extra === 'object') {
        this.stream.write(`${JSON.stringify(extra)}`);
      } else {
        this.stream.write(`${extra}`);
      }
      this.stream.write('\n');
    }
  }
}

module.exports = {
  Logger,
  FgRed,
  FgYellow,
  FgCyan,
  FgMagenta,
  FgGreen,
  Reset,
};
