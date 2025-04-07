import jwt from 'jsonwebtoken';
import messages from '../constants/strings.js'
import { Users } from "../models/index.js";
import { Hash } from '../utils/index.js';
import 'dotenv/config'
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      type,
      gender,
      instagram,
      pinterest,
      bio,
      interesses,
      phone_number
    } = req.body;

    const profile_photo_url = req.file;
    let photoUrl = null;

    // Upload da imagem, se enviada
    if (profile_photo_url) {
      const result = await cloudinary.v2.uploader.upload(profile_photo_url.path);
      photoUrl = result.secure_url;
      fs.unlinkSync(profile_photo_url.path); // remove o arquivo local
    }

    // Valida confirmação de senha
    if (password !== confirmPassword) {
      return next({ status: 400, data: messages.confirmPassword });
    }

    // Verifica se já existe um usuário ATIVO com o mesmo e-mail
    const existingEmail = await Users.findOne({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });

    if (existingEmail) {
      return next({ status: 400, data: messages.emailAlreadyExists });
    }

    const hashedPassword = Hash(password, email.toLowerCase());

    // Criação do usuário
    const user = await Users.create({
      name,
      email: email.toLowerCase(),
      type,
      password: hashedPassword,
      gender,
      instagram,
      pinterest,
      bio,
      interesses,
      profile_photo_url: photoUrl,
      phone_number
    });

    // Geração do token JWT
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
    console.log(err)
    return next(err);
  }
};


const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loggedUser = res.locals.USER;

    const user = await Users.findByPk(id);
    if (!user) return next({ status: 400, data: messages.userNotFound });

    if (user.id.toString() !== loggedUser.id.toString()) {
      return next({ status: 403, data: messages.forbidden });
    }

    const updates = {};
    const fields = ['name', 'email', 'type', 'gender', 'instagram', 'pinterest', 'bio', 'interesses', 'phone_number'];

    fields.forEach(field => {
      if (req.body[field]) {
        updates[field] = field === 'email' ? req.body[field].toLowerCase() : req.body[field];
      }
    });

    if (req.body.type && !['CLIENTE', 'TATUADOR'].includes(req.body.type)) {
      return next({ status: 401, data: messages.invalidType });
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      updates.profile_photo_url = result.secure_url;
    }

    await user.update(updates);

    res.locals.data = user;
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
    const user = await Users.findByPk(id);
    if (!user) {
      return next({ status: 401, data: messages.userNotFound });
    }

    await user.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 204;

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
