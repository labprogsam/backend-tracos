import { Tag } from '../models';
import messages from '../constants/strings.js';

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validações
    if (!name) return next({ status: 400, data: messages.TAGS.NAME_REQUIRED });
    if (!description) return next({ status: 400, data: messages.TAGS.DESCRIPTION_REQUIRED });

    const tag = await Tag.create({
      name,
      description,
    });

    res.locals.data = tag;
    res.locals.status = 201;

    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const tag = await Tag.findByPk(id);
    if (!tag) return next({ status: 400, data: messages.TAGS.NOT_FOUND });

    // Validações
    if (!name) return next({ status: 400, data: messages.TAGS.NAME_REQUIRED });
    if (!description) return next({ status: 400, data: messages.TAGS.DESCRIPTION_REQUIRED });

    const updatedTag = await tag.update({
      name,
      description,
    });

    res.locals.data = updatedTag;
    res.locals.status = 200;

    return next();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) return next({ status: 400, data: messages.TAGS.NOT_FOUND });

    await tag.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 204;
    res.locals.data = { message: messages.TAGS.DELETED_SUCCESS };

    return next();
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      where: {
        deletedAt: null,
      },
      order: [['createdAt', 'DESC']],
    });

    res.locals.data = tags;
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
