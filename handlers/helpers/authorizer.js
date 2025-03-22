import jwt from 'jsonwebtoken';
import User from "../../models/userModel.js";
import Messages from '../../constants/strings.js';

const authorizer = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return next({ status: 401, data: Messages.missingToken });
    }

    try {
      const { id } = await jwt.verify(token, process.env.JWT_SECRET);

      if (!id) {
        return next({ status: 500, data: Messages.internalError });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return next({ status: 401, data: Messages.userNotFound });
      }

      if (user.disabledAt) {
        return next({ status: 403, data: Messages.userDisabled });
      }

      res.locals.USER = user;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next({ status: 401, data: Messages.expiredToken });
      }
      if (err.name === 'JsonWebTokenError') {
        return next({ status: 401, data: Messages.invalidToken });
      }
      return next(err);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

export default authorizer;
