import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import userController from '../../controller/user.js';
import { Users } from '../../models/index.js';
import { Hash } from '../../utils/index.js';
import Messages from '../../constants/strings.js';

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
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

  describe('Create User', () => {
    it('deve criar um usuário com sucesso', async () => {
      req.body = {
        name: 'User',
        email: 'user@email.com',
        password: '123456',
        confirmPassword: '123456',
        type: 'CLIENTE',
      };

      const userMock = { id: 1, email: 'user@email.com' };
      sinon.stub(Users, 'create').resolves(userMock);
      sinon.stub(jwt, 'sign').returns('fakeToken');

      await userController.create(req, res, next);

      expect(res.locals.data).toEqual({ token: 'fakeToken', id: 1 });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se as senhas não coincidirem', async () => {
      req.body = {
        email: 'user@email.com',
        password: '123456',
        confirmPassword: 'wrongpassword',
      };

      await userController.create(req, res, next);

      expect(next.calledWith({ status: 401, data: Messages.confirmPassword })).toBe(true);
    });
  });

  describe('Update User', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      req.params.id = '1';
      req.body = { name: 'Updated Name', email: 'updated@email.com', type: 'TATUADOR' };
      res.locals.USER = { id: 1 };
      
      const userMock = {
        id: 1,
        name: 'User',
        email: 'user@email.com',
        type: 'CLIENTE',
        update: sinon.stub().resolves(),
      };
      sinon.stub(Users, 'findByPk').resolves(userMock);

      await userController.update(req, res, next);

      expect(userMock.update.calledOnceWith({
        name: 'Updated Name',
        email: 'updated@email.com',
        type: 'TATUADOR',
      })).toBe(true);
      expect(res.locals.data).toEqual(userMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o usuário não existir', async () => {
      req.params.id = '1';
      res.locals.USER = { id: 1 };
      sinon.stub(Users, 'findByPk').resolves(null);

      await userController.update(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.userNotFound })).toBe(true);
    });
  });

  describe('Remove User', () => {
    it('deve remover um usuário com sucesso', async () => {
      req.params.id = '1';

      const userMock = {
        update: sinon.stub().resolves(),
      };
      sinon.stub(Users, 'findByPk').resolves(userMock);

      await userController.remove(req, res, next);

      expect(userMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(203);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o usuário não existir', async () => {
      req.params.id = '1';
      sinon.stub(Users, 'findByPk').resolves(null);

      await userController.remove(req, res, next);

      expect(next.calledWith({ status: 401, data: Messages.userNotFound })).toBe(true);
    });
  });
});

