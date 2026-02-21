// src/renderer/core/logger/index.ts

/**
 * The level of the log.
 * Different levels of logs are displayed in different colors in the console.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger options.
 */
interface LoggerOptions {
  /**
   * The minimum level of logs to display.
   * Logs with a level lower than this will not be displayed.
   */
  level: LogLevel;
}

/**
 * The key for storing logger options in localStorage.
 */
const LOGGER_OPTIONS_KEY = 'logger-options';

/**
 * The default logger options.
 */
const defaultOptions: LoggerOptions = {
  level: import.meta.env.MODE === 'production' ? 'info' : 'debug',
};

/**
 * Get logger options from localStorage.
 * If not set, return the default options.
 */
function getOptions(): LoggerOptions {
  try {
    const options = localStorage.getItem(LOGGER_OPTIONS_KEY);
    return options ? JSON.parse(options) : defaultOptions;
  }
  catch (error) {
    return defaultOptions;
  }
}

/**
 * The logger class.
 * This class provides methods for logging at different levels.
 */
class Logger {
  private options: LoggerOptions = getOptions();

  /**
   * Get the current time in the format HH:mm:ss.
   */
  private get time() {
    return new Date().toLocaleTimeString();
  }

  /**
   * Log a message at the 'debug' level.
   * These logs are for debugging and are not displayed in production.
   * @param message The message to log.
   * @param args Additional arguments to log.
   */
  debug(message: any, ...args: any[]) {
    this.log('debug', '#7f8c8d', message, ...args);
  }

  /**
   * Log a message at the 'info' level.
   * These logs are for informational purposes.
   * @param message The message to log.
   * @param args Additional arguments to log.
   */
  info(message: any, ...args: any[]) {
    this.log('info', '#2ecc71', message, ...args);
  }

  /**
   * Log a message at the 'warn' level.
   * These logs are for warnings that something may be wrong.
   * @param message The message to log.
   * @param args Additional arguments to log.
   */
  warn(message: any, ...args: any[]) {
    this.log('warn', '#f39c12', message, ...args);
  }

  /**
   * Log a message at the 'error' level.
   * These logs are for errors that have occurred.
   * @param message The message to log.
   * @param args Additional arguments to log.
   */
  error(message: any, ...args: any[]) {
    this.log('error', '#e74c3c', message, ...args);
  }

  /**
   * The core log method.
   * This method logs a message at a specific level.
   * @param level The level of the log.
   * @param color The color of the log message in the console.
   * @param message The message to log.
   * @param args Additional arguments to log.
   */
  private log(level: LogLevel, color: string, message: any, ...args: any[]) {
    const levelIndex = this.getLevelIndex(level);
    const optionsLevelIndex = this.getLevelIndex(this.options.level);

    if (levelIndex < optionsLevelIndex) {
      return;
    }

    if (import.meta.env.MODE === 'production') {
      // In production, we might want to send logs to a remote server
      // or save them to a local file. For now, we'll just log to the console.
      console[level](`[${this.time}] [${level.toUpperCase()}]`, message, ...args);
    }
    else {
      // In development, we use colors to make logs more readable.
      console[level](
        `%c[${this.time}] [${level.toUpperCase()}]`,
        `color: ${color}; font-weight: bold;`,
        message,
        ...args,
      );
    }
  }

  /**
   * Get the index of a log level.
   * The index is used to determine if a log should be displayed.
   * @param level The log level.
   */
  private getLevelIndex(level: LogLevel) {
    switch (level) {
      case 'debug':
        return 0;
      case 'info':
        return 1;
      case 'warn':
        return 2;
      case 'error':
        return 3;
      default:
        return 0;
    }
  }
}

/**
 * The global logger instance.
 * Use this instance to log messages throughout the application.
 */
const logger = new Logger();

export default logger;
