import fs from 'fs'
import path from 'path'
import util from 'util'
import dayjs from 'dayjs'

// Create logs directory if it doesn't exist
const logsDir = 'logs'
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Helper function to get formatted timestamp
const getTimestamp = () => dayjs().format('HH:mm:ss')
const getDateTimestamp = () => dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')

// Helper function to write to log file
export const writeToLog = (level: string, ...args: any[]) => {
  const timestamp = getDateTimestamp()
  const message = util.format(...args)
  const logEntry = `[${timestamp}] ${level}: ${message}\n`
  fs.appendFileSync(path.join(logsDir, `${level}.log`), logEntry)
}

// Custom console colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
}

// Helper function to format console message with timestamp
const formatConsolePrefix = (level: string) => {
  const timestamp = getTimestamp()
  return `[${timestamp}] ${level}`
}

// Custom logging functions
const originalConsole = { ...console }

console.trace = (/*...args*/) => {
  if (process.env.NODE_ENV === 'dev') {
    //originalConsole.log(colors.gray, ...formatConsoleMessage('⚙️', ...args), colors.reset)
    //writeToLog('TRACE', ...args)
  }
}

console.debug = (...args) => {
  if (process.env.NODE_ENV === 'dev') {
    originalConsole.log(colors.magenta + formatConsolePrefix('🤖') + colors.reset, ...args)
    //writeToLog('DEBUG', ...args)
  }
}

console.info = (...args) => {
  originalConsole.log(colors.blue + formatConsolePrefix('ℹ️') + colors.reset, ...args)
  //writeToLog('INFO', ...args)
}

console.warn = (...args) => {
  originalConsole.log(colors.yellow + formatConsolePrefix('⚠️') + colors.reset, ...args)
  //writeToLog('WARN', ...args)
}

console.error = (...args) => {
  originalConsole.error(colors.red + formatConsolePrefix('🚨') + colors.reset, ...args)
  writeToLog('ERROR', ...args)
}

/*console.fatal = (...args) => {
  originalConsole.error(colors.red + '\x1b[7m' + formatConsolePrefix('💀') + colors.reset, ...args)
  writeToLog('FATAL', ...args)
}*/

/*console.success = (...args) => {
  originalConsole.log(colors.green + formatConsolePrefix('✅') + colors.reset, ...args)
  //writeToLog('SUCCESS', ...args)
}*/
