module.exports = (error, req, res, next) => {
  if (error.code === "23505") {
    duplicateErrorHandler(error);
  }
  if (error.message === 'jwt expired') {
    error.statusCode = 401;
  }
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    message: error.message,
  });
};

const duplicateErrorHandler = (error) => {
  const regex = /Key \(email\)=/; // Regular expression
  const cleanedMessage = error.detail.replace(regex, "");
  error.status = "fail";
  error.statusCode = 400;
  error.message = cleanedMessage;
};
