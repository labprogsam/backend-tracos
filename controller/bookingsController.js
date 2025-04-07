import { Bookings } from '../models/index.js';
import messages from '../constants/strings.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path);
  fs.unlinkSync(file.path);
  return result.secure_url;
};

const create = async (req, res, next) => {
  try {
    const {
      artist_id,
      customer_id,
      age,
      date_suggestion,
      tatoo_style,
      body_region,
      size,
      message
    } = req.body;

    const files = req.files || {};

    if (!artist_id || !customer_id || !age || !date_suggestion) {
      return next({ status: 400, data: messages.BOOKINGS.MISSING_FIELDS });
    }

    if (parseInt(age) < 18 && !files.authorization) {
      return next({ status: 400, data: messages.BOOKINGS.AUTHORIZATION_REQUIRED });
    }

    let authorization = null;
    let references = null;

    if (files.authorization) {
      authorization = await uploadToCloudinary(files.authorization[0]);
    }

    if (files.references) {
      references = await uploadToCloudinary(files.references[0]);
    }

    const booking = await Bookings.create({
      artist_id,
      customer_id,
      age,
      tatoo_style,
      body_region,
      size,
      date_suggestion,
      authorization,
      references,
      message,
      status:'Pendente'
    });

    res.locals.data = booking;
    res.locals.status = 200;
    return next();
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const files = req.files || {};

    const booking = await Bookings.findByPk(id);
    if (!booking) {
      return next({ status: 400, data: messages.BOOKINGS.NOT_FOUND });
    }

    const allowedStatuses = ['Pendente', 'Confirmada', 'Realizada'];
    if (status && !allowedStatuses.includes(status)) {
      return next({ status: 400, data: 'Status inválido' });
    }

    let updateData = {};
    if (status) updateData.status = status;

    if (files.authorization) {
      updateData.authorization = await uploadToCloudinary(files.authorization[0]);
    }

    if (files.references) {
      updateData.references = await uploadToCloudinary(files.references[0]);
    }

    const updatedBooking = await booking.update(updateData);

    res.locals.data = updatedBooking;
    res.locals.status = 200;
    return next();
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Bookings.findByPk(id);
    if (!booking) {
      return next({ status: 400, data: messages.BOOKINGS.NOT_FOUND });
    }

    await booking.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 204;
    return next();
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { artist_id } = req.query;

    const whereClause = { deletedAt: null };
    if (artist_id) whereClause.artist_id = artist_id;

    const bookings = await Bookings.findAll({ where: whereClause });

    res.locals.data = bookings;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default {
  create,
  update,
  remove,
  list,
};
