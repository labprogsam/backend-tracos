import { Customers } from '../models/index.js';
import { Users } from '../models/index.js';
import messages from '../constants/strings.js';

const create = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    // Verificando se o user_id existe
    const userExists = await Users.findByPk(user_id);
    if (!userExists) {
      return next({ status: 400, data: messages.CUSTOMERS.USER_ID_NOT_FOUND });
    }

    const customer = await Customers.create({
      user_id,
    });

    res.locals.data = customer;
    res.locals.status = 201;

    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const customer = await Customers.findByPk(id);
    if (!customer) return next({ status: 400, data: messages.CUSTOMERS.NOT_FOUND });

    const userExists = await Users.findByPk(user_id);
    if (!userExists) {
      return next({ status: 400, data: messages.CUSTOMERS.USER_ID_NOT_FOUND });
    }

    const updatedCustomer = await customer.update({
      user_id,
    });

    res.locals.data = updatedCustomer;
    res.locals.status = 200;

    return next();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customers.findByPk(id);
    if (!customer) return next({ status: 400, data: messages.CUSTOMERS.NOT_FOUND });

    await customer.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 204;
    res.locals.data = { message: messages.CUSTOMERS.DELETED_SUCCESS };

    return next();
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const customers = await Customers.findAll({
      where: {
        deletedAt: null,
      },
      order: [['createdAt', 'DESC']],
    });

    res.locals.data = customers;
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
