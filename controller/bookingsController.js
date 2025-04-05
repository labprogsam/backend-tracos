import { Bookings } from '../models/index.js';
import messages from '../constants/strings.js';
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create = async (req, res, next) => {
  try {
    const { artist_id, customer_id, age, date_suggestion, tatoo_style, body_region, size, references, allergies, message, status } = req.body;
    if (!artist_id || !customer_id || !age || !date_suggestion) {
      return next({ status: 400, data: messages.BOOKINGS.MISSING_FIELDS });
    }

    const booking = await Bookings.create({
      artist_id,
      customer_id,
      age,
      date_suggestion,
      tatoo_style,
      body_region,
      size,
      references,
      allergies,
      message,
      status
    });

    res.locals.data = booking;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { artist_id, customer_id, age, date_suggestion, tatoo_style, body_region, size, allergies, message, status } = req.body;
    const files = req.files;

    const booking = await Bookings.findByPk(id);
    if (!booking) return next({ status: 404, data: messages.BOOKINGS.NOT_FOUND });

    if (status && !['Pendente', 'Confirmada', 'Realizada'].includes(status)) {
      return next({ status: 400, data: messages.BOOKINGS.INVALID_STATUS });
    }

    let references = booking.references;
    if (files && files.length > 0) {
      if (files.length > 4) return next({ status: 400, data: messages.BOOKINGS.TOO_MANY_FILES });
      const uploadPromises = files.map(async (file) => {
        const result = await cloudinary.v2.uploader.upload(file.path);
        fs.unlinkSync(file.path);
        return result.secure_url;
      });
      references = JSON.stringify(await Promise.all(uploadPromises));
    }

    await booking.update({
      artist_id,
      customer_id,
      age,
      date_suggestion,
      tatoo_style,
      body_region,
      size,
      references,
      allergies,
      message,
      status
    });

    res.locals.data = booking;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Bookings.findByPk(id);
    if (!booking) return next({ status: 404, data: messages.BOOKINGS.NOT_FOUND });
    await booking.update({ deletedAt: new Date().toISOString() });
    res.locals.status = 204;
    res.locals.data = { message: messages.BOOKINGS.DELETED_SUCCESS };
    return next();
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { artist_id, customer_id } = req.query;
    if (!artist_id && !customer_id) {
      return next({ status: 400, data: messages.BOOKINGS.ID_REQUIRED });
    }

    const whereClause = { deletedAt: null };
    if (artist_id) whereClause.artist_id = artist_id;
    if (customer_id) whereClause.customer_id = customer_id;

    const bookings = await Bookings.findAll({ where: whereClause, order: [['createdAt', 'DESC']] });
    res.locals.data = bookings;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default { create, update, remove, list };
