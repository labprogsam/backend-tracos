const errorHandler = async (err, req, res, next) => {
  if (err.status && err.data) {
    res.locals.status = err.status;
    res.locals.data = err.data;
  } else {
    console.log(err);
    res.locals.status = 500;
    res.locals.data = "Internal server error";
  }
  return next();
};

export default errorHandler;