import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Default status code and message
  console.error(err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = [];

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Handle Mongoose duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    statusCode = 409;
    // Dynamically get the field that caused the duplicate
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(409).json({
      success: false,
      message: `${field} ${value} already exists`,
      errors: [{field, message: `${field} already exists`}]
    })

  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // If it's an ApiError, use its properties
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || []; // Use the errors array from ApiError
  }

  console.log(err);
  // Send the error response
  res.status(statusCode).json({
    success: false, // Explicitly false for errors
    message,
    errors: errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};


export {errorHandler};