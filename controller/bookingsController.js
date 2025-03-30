import jwt from 'jsonwebtoken';
import messages from '../constants/strings.js';
import { Bookings, Customers, TattooArtists } from '../models/index.js';
import 'dotenv/config';

const create = async (req, res, next) => {
  try {
    const { customer_id, artist_id, date_time, taglist } = req.body;

    if (!customer_id || !artist_id || !date_time) {
      return next({ status: 400, data: messages.BOOKING.MISSING_FIELDS });
    }

    // Verificando se o customer_id existe
    const customer = await Customers.findByPk(customer_id);
    if (!customer) {
      return next({ status: 404, data: messages.BOOKING.CUSTOMER_NOT_FOUND });
    }

    // Verificando se o artist_id existe
    const artist = await TattooArtists.findByPk(artist_id);
    if (!artist) {
      return next({ status: 404, data: messages.BOOKING.ARTIST_NOT_FOUND });
    }

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

    // Verificar se o 'artist_id' da requisição corresponde ao 'artist_id' da reserva
    if (booking.artist_id !== artist_id) {
      return next({ status: 403, data: messages.BOOKINGS.FORBIDDEN_UPDATE });
    }

    const updatedBooking = await booking.update({
      customer_id,
      artist_id,
      date_time,
      taglist,
    });

    // Retorna uma resposta de sucesso
    res.locals.data = {
      message: messages.BOOKINGS.UPDATE_SUCCESS,
      updatedBooking,
    };
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

    // Excluir a reserva
    await booking.destroy();

    // Mensagem de sucesso após a exclusão
    res.locals.data = { message: messages.BOOKINGS.DELETE_SUCCESS };
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
