exports.errorHandler = (err, req, res, next) => { 
  const error = { ...err }; 
  error.message = err.message; 
  // Log to console for dev 
  console.error(err); 
  // Mongoose bad ObjectId 
  if (err.name === 'CastError') { 
    const message = `Resource not found`; 
    error.statusCode = 404; 
  }     
  // Mongoose duplicate key 
  if (err.code === 11000) { 
    const message = `Duplicate field value entered`; 
    error.statusCode = 400; 
  } 
  res.status(error.statusCode || 500).json({ 
    success: false, 
    message: error.message || 'Server Error' 
  });
};