
const notFoundHandler = async (req, res, next) => {
  try {
    if (!res.locals.status && !res.locals.data) {
      res.locals.status = 404;
      res.locals.data = "Invalid URL";
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

export default notFoundHandler;