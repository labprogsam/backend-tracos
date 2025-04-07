import sinon from 'sinon';
import imageController from '../../controller/imagesController.js';
import { Images } from '../../models/index.js';
import messages from '../../constants/strings.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

describe('Image Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null, query: {} };
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

  describe('Create Image', () => {
    it('deve criar uma imagem com sucesso', async () => {
      req.body = { artist_id: 1, description: 'Arte digital', tags: ['arte'], portfolio_index: 0, is_featured: false };
      req.file = { path: 'fakepath/image.jpg' };
      const uploadResult = { secure_url: 'https://cloudinary.com/image.jpg' };
      sinon.stub(cloudinary.v2.uploader, 'upload').resolves(uploadResult);
      sinon.stub(Images, 'create').resolves({ id: 1, ...req.body, url: uploadResult.secure_url });
      sinon.stub(fs, 'unlinkSync');

      await imageController.create(req, res, next);

      expect(res.locals.data).toEqual({ id: 1, ...req.body, url: uploadResult.secure_url });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o artist_id não for fornecido', async () => {
      req.body = { description: 'Arte digital' };
      await imageController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: messages.IMAGES.ARTIST_ID_REQUIRED })).toBe(true);
    });
  });

  describe('Update Image', () => {
    it('deve atualizar uma imagem com sucesso', async () => {
      req.params.id = '1';
      req.body = { description: 'Nova descrição', tags: ['nova'], portfolio_index: 1, is_featured: true };
      const imageMock = { id: 1, url: 'https://cloudinary.com/old_image.jpg', update: sinon.stub().resolves() };
      sinon.stub(Images, 'findByPk').resolves(imageMock);

      await imageController.update(req, res, next);

      expect(imageMock.update.calledOnceWith(req.body)).toBe(true);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se a imagem não existir', async () => {
      req.params.id = '99';
      sinon.stub(Images, 'findByPk').resolves(null);
      await imageController.update(req, res, next);
      expect(next.calledWith({ status: 400, data: messages.IMAGES.NOT_FOUND })).toBe(true);
    });
  });

  describe('Remove Image', () => {
    it('deve remover uma imagem com sucesso', async () => {
      req.params.id = '1';
      const imageMock = { update: sinon.stub().resolves() };
      sinon.stub(Images, 'findByPk').resolves(imageMock);

      await imageController.remove(req, res, next);

      expect(imageMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se a imagem não existir', async () => {
      req.params.id = '99';
      sinon.stub(Images, 'findByPk').resolves(null);
      await imageController.remove(req, res, next);
      expect(next.calledWith({ status: 400, data: messages.IMAGES.NOT_FOUND })).toBe(true);
    });
  });

  describe('List Images', () => {
    it('deve listar todas as imagens', async () => {
      const imagesMock = [
        { id: 1, artist_id: 1, url: 'https://cloudinary.com/image1.jpg' },
        { id: 2, artist_id: 2, url: 'https://cloudinary.com/image2.jpg' },
      ];
      sinon.stub(Images, 'findAll').resolves(imagesMock);

      await imageController.list(req, res, next);

      expect(res.locals.data).toEqual(imagesMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});
