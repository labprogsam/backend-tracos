import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import authController from '../../controller/auth.js';
import { Users } from '../../models/index.js';
import { Hash } from '../../utils/index.js';
import Messages from '../../constants/strings.js';

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
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

  describe('Login', () => {
    it('deve retornar sucesso ao logar', async () => {
      req.body = { email: 'user@email.com', password: '123456' };

      const userMock = {
        id: 1,
        email: 'user@email.com',
        password: Hash('123456', 'user@email.com'),
        deletedAt: null,
      };

      sinon.stub(Users, 'findOne').resolves(userMock);
      sinon.stub(jwt, 'sign').returns('fakeToken');

      await authController.login(req, res, next);

      expect(res.locals.data).toEqual({ token: 'fakeToken', id: 1 });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o email estiver errado', async () => {
      req.body = { email: 'notfound@email.com', password: '123456' };

      sinon.stub(Users, 'findOne').resolves(null);

      await authController.login(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.wrongEmail })).toBe(true);
    });

    it('deve retornar erro se a senha estiver errada', async () => {
      req.body = { email: 'user@email.com', password: 'wrongpassword' };

      const userMock = {
        id: 1,
        email: 'user@email.com',
        password: Hash('123456', 'user@email.com'),
        deletedAt: null,
      };

      sinon.stub(Users, 'findOne').resolves(userMock);

      await authController.login(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.wrongPassword })).toBe(true);
    });

    it('deve retornar erro se o usuário estiver desativado', async () => {
      req.body = { email: 'user@email.com', password: '123456' };

      const userMock = {
        id: 1,
        email: 'user@email.com',
        password: Hash('123456', 'user@email.com'),
        deletedAt: new Date(),
      };

      sinon.stub(Users, 'findOne').resolves(userMock);

      await authController.login(req, res, next);

      expect(next.calledWith({ status: 403, data: Messages.userDisabled })).toBe(true);
    });
  });

  describe('Refresh Token', () => {
    it('deve gerar um novo token se o token for válido', async () => {
      req.headers = { token: 'validToken' };

      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(jwt, 'sign').returns('newToken');

      await authController.refreshToken(req, res, next);

      expect(res.locals.data).toEqual({ token: 'newToken', id: 1 });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o token não for fornecido', async () => {
      req.headers = {};

      await authController.refreshToken(req, res, next);

      expect(next.calledWith({ status: 401, data: Messages.missingToken })).toBe(true);
    });

    it('deve retornar erro se o token for inválido', async () => {
      req.headers = { token: 'invalidToken' };

      sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

      await authController.refreshToken(req, res, next);

      expect(next.calledWith({ status: 401, data: Messages.invalidToken })).toBe(true);
    });
  });

  describe('Forgot Password', () => {
    it('deve enviar um e-mail de recuperação', async () => {
      req.body = { email: 'user@email.com' };

      const userMock = {
        email: 'user@email.com',
        name: 'User',
        save: sinon.stub(),
      };

      sinon.stub(Users, 'findOne').resolves(userMock);
      sinon.stub(userMock, 'save').resolves();
      sinon.stub(authController, 'sendRecoveryLink').resolves(true);

      await authController.forgotPassword(req, res, next);

      expect(res.locals.data).toBe(Messages.emailSent);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o e-mail não existir', async () => {
      req.body = { email: 'notfound@email.com' };

      sinon.stub(Users, 'findOne').resolves(null);

      await authController.forgotPassword(req, res, next);

      expect(next.calledWith({ status: 404, data: Messages.userNotFound })).toBe(true);
    });
  });

  describe('Recovery Password', () => {
    it('deve redefinir a senha com sucesso', async () => {
      req.body = { token: 'recoveryToken', password: 'newPassword' };

      const userMock = {
        email: 'user@email.com',
        resetPasswordToken: 'recoveryToken',
        resetPasswordExpires: Date.now() + 60000,
        save: sinon.stub(),
      };

      sinon.stub(Users, 'findOne').resolves(userMock);

      await authController.recoveryPassword(req, res, next);

      expect(userMock.password).toBe(Hash('newPassword', 'user@email.com'));
      expect(userMock.resetPasswordToken).toBeNull();
      expect(userMock.resetPasswordExpires).toBeNull();
      expect(res.locals.data).toBe(Messages.passwordChanged);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o token for inválido', async () => {
      req.body = { token: 'invalidToken', password: 'newPassword' };

      sinon.stub(Users, 'findOne').resolves(null);

      await authController.recoveryPassword(req, res, next);

      expect(next.calledWith({ status: 400, data: Messages.recoveryTokenInvalid })).toBe(true);
    });
  });

  describe('Update Password', () => {
    it('deve atualizar a senha do usuário logado', async () => {
      res.locals.USER = { id: 1, email: 'user@email.com' };
      req.body = { password: 'newPassword' };

      sinon.stub(Users, 'update').resolves([1]);

      await authController.updatePassword(req, res, next);

      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });
  });
});
