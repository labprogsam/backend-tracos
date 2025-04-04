import jwt from 'jsonwebtoken';
import messages from '../constants/strings.js'
import { User } from "../models/index.js";
import { Hash } from '../utils/index.js';
import 'dotenv/config'

const create = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      type
    } = req.body;

    const hashedPassword = Hash(password, email.toLowerCase());

    if (password !== confirmPassword) {
      return next({ status: 401, data: messages.confirmPassword });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      type,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.locals.data = {
      token,
      id: user.id,
    };

    res.locals.status = 201;
    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, type } = req.body;
    const loggedUser = res.locals.USER;

    const user = await User.findByPk(id);
    if (!user) return next({ status: 400, data: messages.userNotFound });

    const isSameUser = user.id.toString() === loggedUser.id.toString();

    if (!isSameUser) {
      return next({ status: 403, data: messages.forbidden });
    }

    if (type !== "CLIENTE" && type !== "TATUADOR") {
      return next({ status: 401, data: messages.invalidType });
    }

    const updatedUser = await user.update({
      name,
      email: email.toLowerCase(),
      type
    });

    res.locals.data = updatedUser[1][0];
    delete res.locals.data.dataValues.password;
    res.locals.status = 200;

    return next();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return next({ status: 401, data: messages.userNotFound });
    }

    await user.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 203;

    return next();
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  update,
  remove,
};
