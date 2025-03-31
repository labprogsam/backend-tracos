import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { Users } from "../models/index.js";
import Messages from '../constants/strings.js';
import { Hash } from '../utils/index.js';
import { sendRecoveryLink } from '../utils/mail.js';

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = Hash(password, email.toLowerCase());

    const user = await Users.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return next({ status: 400, data: Messages.wrongEmail });
    }

    if (user.password !== hashedPassword) {
      return next({ status: 400, data: Messages.wrongPassword });
    }

    if (user.deletedAt) {
      return next({ status: 403, data: Messages.userDisabled });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.locals.data = {
      token,
      id: user.id,
    };
    res.locals.status = 200;

    return next();
  } catch (err) {
    return next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return next({ status: 401, data: Messages.missingToken });
    }

    const renewToken = (id) => {
      const newToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.locals.data = {
        token: newToken,
        id,
      };
      res.locals.status = 200;
    };

    try {
      const { id } = await jwt.verify(token, process.env.JWT_SECRET);

      if (id) {
        renewToken(id);
        return next();
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const { id } = await jwt.verify(
          token,
          process.env.JWT_SECRET,
          { ignoreExpiration: true },
        );

        if (id) {
          renewToken(id);
          return next();
        }
      }
      return next({ status: 401, data: Messages.invalidToken });
    }
    return next({ status: 500, data: Messages.internalError });
  } catch (err) {
    return next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return next({ status: 404, data: Messages.userNotFound });
    }

    const recoveryToken = Hash(email + Date.now().toString(), 'password-reset');
    user.resetPasswordToken = recoveryToken;
    user.resetPasswordExpires = Date.now() + (60 * 60000); // 60 minutes
    await user.save();

    const recoveryLink = `${process.env.FRONTEND_URL}/recuperar-senha/${recoveryToken}`;

    const sent = await sendRecoveryLink({
      email: user.email,
      name: user.name,
    }, recoveryLink);

    if (!sent) {
      return next({ status: 500, data: Messages.errorSendingEmail });
    }

    res.locals.data = Messages.emailSent;
    res.locals.status = 200;

    return next();
  } catch (err) {
    return next(err);
  }
};

const recoveryPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await Users.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      return next({ status: 400, data: Messages.recoveryTokenInvalid });
    }

    const hashedPassword = Hash(password, user.email);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.locals.data = Messages.passwordChanged;
    res.locals.status = 200;

    return next();
  } catch (err) {
    console.error("Erro recovery:", err);
    return next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const loggedUser = res.locals.USER;

    const { password } = req.body;

    const hashedPassword = Hash(password, loggedUser.email);

    await Users.update({
      password: hashedPassword,
    }, {
      where: {
        id: loggedUser.id,
      },
    });

    res.locals.status = 204;

    return next();
  } catch (err) {
    return next(err);
  }
};

export default {
  login,
  refreshToken,
  forgotPassword,
  recoveryPassword,
  updatePassword
};