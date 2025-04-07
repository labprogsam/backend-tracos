import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import userController from '../../controller/usersController.js';
import { Users } from '../../models/index.js';
import * as hashModule from '../../utils/hash.js';
import Messages from '../../constants/strings.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, file: undefined };
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

  // ------------------------ CREATE USER ------------------------
  describe('Create User', () => {
    it('deve criar um usuário com sucesso', async () => {
      req.body = {
        name: 'User',
        email: 'user@email.com',
        password: '123456',
        confirmPassword: '123456',
        type: 'CLIENTE',
        gender: 'M',
        instagram: '',
        pinterest: '',
        bio: '',
        tags_interests: '',
        phone_number: '',
      };
      req.file = { path: 'path/to/photo.jpg' };

      sinon.stub(Users, 'findOne').resolves(null);
      sinon.stub(hashModule, 'default').returns('hashedPassword');
      sinon.stub(cloudinary.v2.uploader, 'upload').resolves({ secure_url: 'https://cloudinary.com/photo.jpg' });
      sinon.stub(Users, 'create').resolves({ id: 1 });
      sinon.stub(jwt, 'sign').returns('fakeToken');
      sinon.stub(fs, 'unlinkSync');

      await userController.create(req, res, next);

      expect(res.locals.data).toEqual({ token: 'fakeToken', id: 1 });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
      expect(fs.unlinkSync.calledOnceWith('path/to/photo.jpg')).toBe(true);
    });

    it('deve retornar erro se as senhas não coincidirem', async () => {
      req.body = {
        name: 'User2',
        email: 'user2@email.com',
        password: '123456',
        confirmPassword: '123',
        type: 'CLIENTE'
      };

      await userController.create(req, res, next);
      expect(next.calledWithMatch({ status: 400, data: Messages.confirmPassword })).toBeTruthy();
      
    });

    it('deve retornar erro se o e-mail já estiver em uso', async () => {
      req.body = {
        name: 'User',
        email: 'email@email.com',
        password: '123456',
        confirmPassword: '123456'
      };
      sinon.stub(Users, 'findOne').resolves({ id: 2 });

      await userController.create(req, res, next);
      expect(next.calledWithMatch({ status: 400, data: Messages.emailAlreadyExists })).toBeTruthy();
     
    });
  });

  // ------------------------ UPDATE USER ------------------------
  describe('Update User', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      req.params.id = '1';
      req.body = {
        name: 'Updated Name',
        email: 'updated@email.com',
        type: 'TATUADOR'
      };
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
        type: 'TATUADOR',
      });

      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve atualizar imagem de perfil se enviada', async () => {
      req.params.id = '1';
      req.body = {};
      req.file = { path: 'temp/photo.jpg' };
      res.locals.USER = { id: 1 };

      const updatedUser = {
        id: 1,
        update: sinon.stub().resolves(),
        dataValues: { password: 'hash' }
      };

      sinon.stub(Users, 'findByPk').resolves(updatedUser);
      sinon.stub(cloudinary.v2.uploader, 'upload').resolves({ secure_url: 'https://photo.cloud' });

      await userController.update(req, res, next);

      expect(updatedUser.update.calledOnceWith({ profile_photo_url: 'https://photo.cloud' })).toBe(true);
      expect(res.locals.status).toBe(200);
    });

    it('deve impedir alteração por outro usuário', async () => {
      req.params.id = '2';
      res.locals.USER = { id: 1 };

      sinon.stub(Users, 'findByPk').resolves({ id: 2 });

      await userController.update(req, res, next);

      expect(next.calledWithMatch({ status: 403, data: Messages.forbidden })).toBe(true);
    });

    it('deve retornar erro se usuário não for encontrado', async () => {
      req.params.id = '99';
      sinon.stub(Users, 'findByPk').resolves(null);

      await userController.update(req, res, next);

      expect(next.calledWithMatch({ status: 400, data: Messages.userNotFound })).toBe(true);
    });

    it('deve retornar erro se o tipo for inválido', async () => {
      req.params.id = '1';
      req.body.type = 'INVALIDO';
      res.locals.USER = { id: 1 };

      sinon.stub(Users, 'findByPk').resolves({ id: 1 });

      await userController.update(req, res, next);

      expect(next.calledWithMatch({ status: 401, data: Messages.invalidType })).toBe(true);
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

      expect(next.calledWithMatch({ status: 401, data: Messages.userNotFound })).toBe(true);
    });
  });
});
