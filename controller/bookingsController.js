import { Bookings } from '../models/index.js';
import messages from '../constants/strings.js';

const create = async (req, res, next) => {
  try {
    const { artist_id, customer_id, age, date_suggestion, status, ...optionalFields } = req.body;

    // Validações obrigatórias
    if (!artist_id) return next({ status: 400, data: messages.BOOKINGS.ARTIST_REQUIRED });
    if (!customer_id) return next({ status: 400, data: messages.BOOKINGS.CUSTOMER_REQUIRED });
    if (!age) return next({ status: 400, data: messages.BOOKINGS.AGE_REQUIRED });
    if (!date_suggestion) return next({ status: 400, data: messages.BOOKINGS.DATE_REQUIRED });

    const booking = await Bookings.create({
      artist_id,
      customer_id,
      age,
      date_suggestion,
      status: status ?? false,
      ...optionalFields,
    });

    res.locals.data = booking;
    res.locals.status = 201;
    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Bookings.findByPk(id);
    if (!booking) return next({ status: 400, data: messages.BOOKINGS.NOT_FOUND });

    const updatedBooking = await booking.update(req.body);
    res.locals.data = updatedBooking;
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
    if (!booking) return next({ status: 400, data: messages.BOOKINGS.NOT_FOUND });

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
    const { artist_id } = req.query;
    const whereClause = { deletedAt: null };
    if (artist_id) whereClause.artist_id = artist_id;

    const bookings = await Bookings.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
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
