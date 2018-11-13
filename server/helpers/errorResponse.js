/**
 * This arrow function reformats errors.
 * @param {string} err - the error object
 * @param {string} res - the response object
 * @param {string} message -  error message
 * @param {string} statusCode - the status code
 * @returns {object} returns json error response.
 */
const errorResponse = (err, res, message, statusCode = '') => {
  res.status(statusCode || 500).json({
    status: 'failure',
    errors: {
      message: [message || err.message]
    }
  });
};

export default errorResponse;
