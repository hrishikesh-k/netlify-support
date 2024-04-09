import type {TLogLevel} from '~/types/server.ts'
export class ApiError extends Error {
  statusCode
  constructor(msg : string, err? : any, statusCode? : number) {
    super()
    this.cause = err
    this.message = msg
    this.name = 'ApiError'
    if (statusCode) {
      this.statusCode = statusCode
    } else if (err.status) {
      this.statusCode = err.status
    } else {
      this.statusCode = 500
    }
  }
  static badRequest(msg : string, err? : any) {
    return new ApiError(msg, err, 400)
  }
  static conflict(msg : string, err? : any) {
    return new ApiError(msg, err, 409)
  }
  static forbidden(msg : string, err? : any) {
    return new ApiError(msg, err, 403)
  }
  static internalServerError(msg : string, err? : any) {
    return new ApiError(msg, err, 500)
  }
  static notFound(msg : string, err? : any) {
    return new ApiError(msg, err, 404)
  }
  static unauthorized(msg : string, err? : any) {
    return new ApiError(msg, err, 401)
  }
}
export class Logger {
  #_level : TLogLevel
  #levelNumber : number
  #levelToNumber : Record<TLogLevel, number> = {
    debug: 20,
    error: 50,
    info: 30,
    fatal: 60,
    trace: 10,
    silent: 0,
    warn: 40
  }
  child() {
    return new Logger()
  }
  constructor(initialLevel : TLogLevel = 'info') {
    this.#_level = initialLevel
    this.#levelNumber = this.#levelToNumber[this.#_level]
  }
  debug(msg : string) {
    if (this.#levelNumber && this.#levelNumber <= this.#levelToNumber.debug) {
      console.debug(msg)
    }
  }
  error(msg : any) {
    if (this.#levelNumber && this.#levelNumber <= this.#levelToNumber.error) {
      console.error(msg)
    }
  }
  get level() {
    return this.#_level
  }
  fatal(msg : string) {
    if (this.#levelNumber && this.#levelNumber <= this.#levelToNumber.fatal) {
      console.error(msg)
    }
  }
  info(msg : string) {
    if (this.#levelNumber && this.#levelNumber <= this.#levelToNumber.info) {
      console.info(msg)
    }
  }
  set level(newLevel) {
    this.#_level = newLevel
    this.#levelNumber = this.#levelToNumber[this.#_level] || 30
  }
  silent() {}
  trace(msg : string) {
    if (this.#levelNumber && this.#levelNumber <= this.#levelToNumber.trace) {
      console.trace(msg)
    }
  }
  warn(msg : string) {
    if (this.#levelNumber && this.#levelNumber <= this.#levelToNumber.warn) {
      console.warn(msg)
    }
  }
}