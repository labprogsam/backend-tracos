import jwt from 'jsonwebtoken';
import messages from '../constants/strings.js';
import { Booking, Customers, TattooArtists } from '../models/index.js';
import 'dotenv/config';

const create = async (req, res, next) => {
  try {
    const { customer_id, artist_id, date_time, taglist } = req.body;

    const booking = await Booking.create({
      customer_id,
      artist_id,
      date_time,
      taglist,
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
    const { customer_id, artist_id, date_time, taglist } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) return next({ status: 400, data: messages.BOOKINGS.NOT_FOUND });

    const updatedBooking = await booking.update({
      customer_id,
      artist_id,
      date_time,
      taglist,
    });

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

    const booking = await Booking.findByPk(id);
    if (!booking) return next({ status: 400, data: messages.BOOKINGS.NOT_FOUND });

    await booking.destroy();

    res.locals.status = 204;

    return next();
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
    try {
      const { artist_id } = req.query;  // Pegando o parâmetro artist_id da query string
  
      const where = {};
      if (artist_id) {
        where.artist_id = artist_id;  // Se artist_id for fornecido, filtra pelo artist_id
      }
  
      const bookings = await Booking.findAll({
        where,
        include: [Customers, TattooArtists],  // Inclui informações de Customers e TattooArtists
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
