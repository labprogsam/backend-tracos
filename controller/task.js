import { Task } from '../models/index.js';

const create = async (req, res, next) => {
  try {

    const {
      titulo,
      descricao,
      status,
      data_vencimento
    } = req.body;

    const task = await Task.create({
      titulo,
      descricao,
      status,
      data_vencimento
    });

    res.locals.status = 201;
    res.locals.data = task;
    return next();
  } catch (err) {
    if(err.errors[0].type == "notNull Violation") {
    return next({ status: 400, data: "O campo '" + err.errors[0].path + "' não pode ser null!" });
    }
    return next(err);
  }
};

const list = async (req, res, next) => {
  const { status } = req.query;
  try {
    const tasks = await Task.findAll({
      where: {
        status: status,
      },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt'],
      },
    });

    res.locals.data = tasks;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);

    if (!task) return next({ status: 404, data: "Task not found!" });

    const {
      titulo,
      descricao,
      status,
      data_vencimento
    } = req.body;

    const updatedTask = await Task.update({
      titulo,
      descricao,
      status,
      data_vencimento
    }, {
      where: {
        id: taskId,
      },
      returning: true,
    });

    res.locals.data = updatedTask[1][0];
    res.locals.status = 200;
    return next();
  } catch (err) {
    if (err.parent.routine == 'enum_in') {
      return next({ status: 400, data: "Tipo de status inválido!" });
    }
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);

    if (!task) return next({ status: 404, data: "Task not found!" });

    await Task.destroy({
      where: {
        id: taskId,
      },
    });

    res.locals.status = 204;
    return next();
  } catch (err) {
    return next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId, {
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt'],
      },
    });

    if (!task) return next({ status: 404, data: "Task not found!" });

    res.locals.data = task;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default {
  create,
  list,
  remove,
  update,
  detail,
};
