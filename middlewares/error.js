/**
 * @desc    Global error handler middleware
 * @param   {Error} err - The error object
 * @param   {Request} req - Express request object
 * @param   {Response} res - Express response object
 * @param   {Function} next - Express next middleware function
 * 
 * Handles different types of errors with appropriate status codes and responses.
 * Logs errors with timestamp for better debugging.
 */
const errorHandler = (err, req, res, next) => {
  // Log error with timestamp and stack trace
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  // Handle Mongoose CastError (invalid ID format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Malformed ID parameter',
      details: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: Object.values(err.errors).map(val => ({
        field: val.path,
        message: val.message
      }))
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ // 409 Conflict is more appropriate for duplicates
      success: false,
      error: 'Duplicate field value',
      details: `${field} '${err.keyValue[field]}' already exists`
    });
  }

  // Handle JWT authentication errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token',
      solution: 'Please login again'
    });
  }

  // Handle expired JWT tokens
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication token expired',
      solution: 'Please login again'
    });
  }

  // Default error handling
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    // Only show stack trace in development environment
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * @desc    404 Not Found middleware
 * @param   {Request} req - Express request object
 * @param   {Response} res - Express response object
 * @param   {Function} next - Express next middleware function
 * 
 * Catches unmatched routes and passes 404 errors to the error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error); // Forward to error handler
};

export { errorHandler, notFound };