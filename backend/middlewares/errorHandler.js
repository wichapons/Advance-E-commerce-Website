const errorHandler = (error, req, res, next) => {
    console.log(error);
    const response = {
      message: error.message,
    };
    // Send the detailed error when in dev mode ONLY
    if (process.env.NODE_ENV === "dev") {
      response.stack = error.stack;
    }
    res.status(500).json(response);
  };
  
  module.exports = errorHandler;
  