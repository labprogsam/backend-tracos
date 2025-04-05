import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import userController from '../../controller/usersController.js';
import { Users } from '../../models/index.js';
import * as hashModule from '../../utils/hash.js'; // << aqui tá o segredo
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

      sinon.stub(Users, 'findOne').resolves(null);
      sinon.stub(hashModule, 'default').returns('hashedPassword'); // <-- funciona
      sinon.stub(Users, 'create').resolves({ id: 1 });
      sinon.stub(jwt, 'sign').returns('fakeToken');

      await userController.create(req, res, next);

      expect(res.locals.data).toEqual({ token: 'fakeToken', id: 1 });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });
  });

  // ------------------------ UPDATE USER ------------------------
  describe('Update User', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      req.params.id = '1';
      req.body = { name: 'Updated Name', email: 'updated@email.com', type: 'TATUADOR' };
      res.locals.USER = { id: 1 };

      const updatedUser = {
        id: 1,
        name: 'Original Name',
        email: 'original@email.com',
        type: 'CLIENTE',
        update: sinon.stub().callsFake(async function (newData) {
          Object.assign(this, newData);
          return this;
        }),
        dataValues: { password: 'hash' }
      };

      sinon.stub(Users, 'findByPk').resolves(updatedUser);

      await userController.update(req, res, next);

      expect(updatedUser.update.calledOnceWith({
        name: 'Updated Name',
        email: 'updated@email.com',
        type: 'TATUADOR',
      })).toBe(true);

      expect(res.locals.data).toMatchObject({
        id: 1,
        name: 'Updated Name',
        email: 'updated@email.com',
        type: 'TATUADOR'
      });

      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });

  // ------------------------ REMOVE USER ------------------------
  describe('Remove User', () => {
    it('deve remover um usuário com sucesso', async () => {
      req.params.id = '1';

      const userMock = {
        update: sinon.stub().resolves(),
      };
      sinon.stub(Users, 'findByPk').resolves(userMock);

      await userController.remove(req, res, next);

      expect(userMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(204);
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

