import sinon from 'sinon';
import notificationController from '../../controller/notificationsController.js';
import { Notifications } from '../../models/index.js';
import Messages from '../../constants/strings.js';

describe('Notification Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      locals: {},
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Create Notification', () => {
    it('deve criar uma notificação com sucesso', async () => {
      req.body = { title: 'Tarefa Concluída', description: 'A tarefa foi concluída.', user_id: 1 };
      const notificationMock = { id: 1, title: 'Tarefa Concluída', description: 'A tarefa foi concluída.', user_id: 1 };
      sinon.stub(Notifications, 'create').resolves(notificationMock);

      await notificationController.create(req, res, next);

      expect(res.locals.data).toEqual(notificationMock);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o título da notificação não for fornecido', async () => {
      req.body = { description: 'Descrição da notificação', user_id: 1 };
      await notificationController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.NOTIFICATIONS.TITLE_REQUIRED })).toBe(true);
    });
  });

  describe('Update Notification', () => {
    it('deve atualizar uma notificação com sucesso', async () => {
      req.params.id = '1';
      req.body = { title: 'Notificação Atualizada', description: 'Descrição atualizada.' };

      const notificationMock = {
        id: 1,
        title: 'Notificação Original',
        description: 'Descrição original.',
        update: sinon.stub().resolves({ id: 1, title: 'Notificação Atualizada', description: 'Descrição atualizada.' }),
      };

      sinon.stub(Notifications, 'findByPk').resolves(notificationMock);

      await notificationController.update(req, res, next);

      expect(notificationMock.update.calledOnceWith({ title: 'Notificação Atualizada', description: 'Descrição atualizada.' })).toBe(true);
      expect(res.locals.data).toEqual({ id: 1, title: 'Notificação Atualizada', description: 'Descrição atualizada.' });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se a notificação não for encontrada', async () => {
      req.params.id = '999';
      sinon.stub(Notifications, 'findByPk').resolves(null);

      await notificationController.update(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.NOTIFICATIONS.NOT_FOUND })).toBe(true);
    });
  });

  describe('Remove Notification', () => {
    it('deve remover uma notificação com sucesso', async () => {
      req.params.id = '1';

      const notificationMock = {
        id: 1,
        title: 'Notificação para remover',
        description: 'Esta notificação será removida.',
        destroy: sinon.stub().resolves(),
      };

      sinon.stub(Notifications, 'findByPk').resolves(notificationMock);

      await notificationController.remove(req, res, next);

      expect(notificationMock.destroy.calledOnce).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se a notificação não for encontrada', async () => {
      req.params.id = '999';
      sinon.stub(Notifications, 'findByPk').resolves(null);

      await notificationController.remove(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.NOTIFICATIONS.NOT_FOUND })).toBe(true);
    });
  });

  describe('List Notifications', () => {
    it('deve listar as notificações de um usuário', async () => {
      req.query.user_id = 1;
      const notificationsMock = [
        { id: 1, title: 'Notificação 1', description: 'Descrição 1', user_id: 1 },
        { id: 2, title: 'Notificação 2', description: 'Descrição 2', user_id: 1 },
      ];

      sinon.stub(Notifications, 'findAll').resolves(notificationsMock);

      await notificationController.list(req, res, next);

      expect(res.locals.data).toEqual(notificationsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o user_id não for fornecido', async () => {
      req.query.user_id = undefined;

      await notificationController.list(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.NOTIFICATIONS.USER_ID_REQUIRED })).toBe(true);
    });

    it('deve retornar erro se não houver notificações para o user_id fornecido', async () => {
      req.query.user_id = 1;

      sinon.stub(Notifications, 'findAll').resolves([]);

      await notificationController.list(req, res, next);

      expect(next.calledWith({ status: 404, data: Messages.NOTIFICATIONS.NO_NOTIFICATIONS_FOUND })).toBe(true);
    });
  });
});

