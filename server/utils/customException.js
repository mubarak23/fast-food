const ErrorCodes = require('./errorCodes')
const ErrorMessage = require('./errorMessage')

/**
 * Custom Exception
 */
class Exception {
    /**
   * @param  {string} message
   * @param  {string} code
   */
  constructor(message = ErrorMessage.UNKNOWN, code = ErrorCodes.UNKNOWN){
    this.message
    this.code
  }
}

module.exports = Exception