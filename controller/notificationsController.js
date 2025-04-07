import messages from '../constants/strings.js';
import { Notifications } from '../models/index.js';
import 'dotenv/config';

//quando eu for criar a notification dentro do back usa essa funcao, exemplo de uso: 
//await createNotification(
//    "Tarefa Concluída",
//    `A tarefa "${task.name}" foi concluída por ${user.name}.`,
//    user_id
//  );
const createNotificationBack = async (title, description, user_id) => {
    try {
      if (!title) {
        throw new Error(messages.NOTIFICATIONS.TITLE_REQUIRED);
      }
  
      const notification = await Notifications.create({
        title,
        description,
        user_id,
      });
  
      return notification; // Retorna a notificação criada
    } catch (err) {
      console.error("Erro ao criar notificação:", err.message);
      throw err; // Lança erro para ser tratado onde a função for chamada
    }
  };

const create = async (req, res, next) => {
    try {
      const { title, description, user_id } = req.body;
  
      // Validação: title não pode ser nulo
      if (!title) {
        return next({ status: 400, data: messages.NOTIFICATIONS.TITLE_REQUIRED });
      }
  
      // Criação da notificação
      const notification = await Notifications.create({
        title,
        description,
        user_id,
      });
  
      res.locals.data = notification;
      res.locals.status = 201;
      return next();
    } catch (err) {
      return next(err);
    }
  };

const update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const notification = await Notifications.findByPk(id);
      if (!notification) return next({ status: 400, data: messages.NOTIFICATIONS.NOT_FOUND });
  
      const updatedNotification = await notification.update({
        title,
        description,
      });
  
      res.locals.data = updatedNotification;
      res.locals.status = 200;
  
      return next();
    } catch (err) {
      return next(err);
    }
  };
  
const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const notification = await Notifications.findByPk(id);
      if (!notification) return next({ status: 400, data: messages.NOTIFICATIONS.NOT_FOUND });
  
      await notification.destroy();
  
      res.locals.status = 204;
  
      return next();
    } catch (err) {
      next(err);
    }
  };

const list = async (req, res, next) => {
    try {
      const { user_id } = req.query;  // Recebendo o user_id como query parameter
  
      if (!user_id) {
        return next({ status: 400, data: messages.NOTIFICATIONS.USER_ID_REQUIRED });  // Mensagem caso não passe o user_id
      }
  
      const notifications = await Notifications.findAll({
        where: {
          user_id,  // Filtrando as notificações pelo user_id
          deletedAt: null,  // Apenas as notificações não deletadas
        },
        order: [['createdAt', 'DESC']],  // Ordem por data de criação
      });
  
      if (notifications.length === 0) {
        return next({ status: 404, data: messages.NOTIFICATIONS.NO_NOTIFICATIONS_FOUND });  // Mensagem caso não encontre notificações
      }
  
      res.locals.data = notifications;
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
    createNotificationBack,
  };
  