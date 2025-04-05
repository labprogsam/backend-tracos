import sinon from 'sinon';
import artistInformationController from '../../controller/artistInformationsController.js';
import { ArtistInformations } from '../../models/index.js';
import Messages from '../../constants/strings.js';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import validator from 'validator';

describe('Artist Information Controller', () => {
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

  describe('Create Artist Information', () => {
    it('deve criar uma informação de artista com sucesso', async () => {
      req.body = {
        artist_id: 1,
        description: 'Artista experiente',
        phone_number: '5511999999999',
        gender: 'Masculino',
        zip_code: '01001000',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '12345678909',
      };
      
      sinon.stub(cpfValidator, 'isValid').returns(true);
      sinon.stub(validator, 'isPostalCode').returns(true);
      sinon.stub(validator, 'isLength').returns(true);
      sinon.stub(validator, 'isNumeric').returns(true);
      
      const artistInfoMock = { id: 1, ...req.body };
      sinon.stub(ArtistInformations, 'create').resolves(artistInfoMock);

      await artistInformationController.create(req, res, next);

      expect(res.locals.data).toEqual(artistInfoMock);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se os campos obrigatórios estiverem ausentes', async () => {
      req.body = { artist_id: 1 };
      await artistInformationController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.ARTIST_INFO.MISSING_FIELDS })).toBe(true);
    });
  });

  describe('Update Artist Information', () => {
    it('deve atualizar uma informação de artista com sucesso', async () => {
      req.params.id = '1';
      res.locals.USER = { id: 1 };
      req.body = {
        description: 'Atualizado',
        phone_number: '5511988888888',
        gender: 'Masculino',
        zip_code: '01001000',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '12345678909',
      };
  
      const artistInfoMock = {
        id: 1,
        artist_id: 1,
        update: sinon.stub().resolvesThis(),
      };
  
      sinon.stub(ArtistInformations, 'findByPk').resolves(artistInfoMock);
      sinon.stub(validator, 'isPostalCode').returns(true);
      sinon.stub(validator, 'isLength').returns(true);
      sinon.stub(validator, 'isNumeric').returns(true);
      sinon.stub(cpfValidator, 'isValid').returns(true);
  
      await artistInformationController.update(req, res, next);
  
      expect(artistInfoMock.update.calledOnce).toBe(true);
      expect(artistInfoMock.update.firstCall.args[0]).toMatchObject(req.body);
      expect(res.locals.data).toEqual(artistInfoMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  
    it('deve retornar erro se a informação não for encontrada', async () => {
      req.params.id = '999';
      req.body = {
        description: 'Atualizado',
        phone_number: '5511988888888',
        gender: 'Masculino',
        zip_code: '01001000',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '12345678909',
      };
  
      sinon.stub(ArtistInformations, 'findByPk').resolves(null);
      sinon.stub(validator, 'isPostalCode').returns(true);
      sinon.stub(validator, 'isLength').returns(true);
      sinon.stub(validator, 'isNumeric').returns(true);
      sinon.stub(cpfValidator, 'isValid').returns(true);
  
      await artistInformationController.update(req, res, next);
  
      expect(next.calledOnce).toBe(true);
      expect(next.firstCall.args[0]).toEqual({
        status: 400,
        data: Messages.ARTIST_INFO.NOT_FOUND,
      });
    });
  });
  
  describe('Remove Artist Information', () => {
    it('deve remover uma informação de artista com sucesso', async () => {
      req.params.id = '1';
      const artistInfoMock = {
        id: 1,
        update: sinon.stub().resolves(),
      };

      sinon.stub(ArtistInformations, 'findByPk').resolves(artistInfoMock);
      await artistInformationController.remove(req, res, next);

      expect(artistInfoMock.update.calledOnce).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se a informação não for encontrada', async () => {
      req.params.id = '999';
      sinon.stub(ArtistInformations, 'findByPk').resolves(null);

      await artistInformationController.remove(req, res, next);

      expect(next.calledWith({ status: 404, data: Messages.ARTIST_INFO.NOT_FOUND })).toBe(true);
    });
  });

  describe('List Artist Informations', () => {
    it('deve listar as informações dos artistas', async () => {
      const artistInfosMock = [
        { id: 1, artist_id: 1, description: 'Artista 1' },
        { id: 2, artist_id: 2, description: 'Artista 2' },
      ];

      sinon.stub(ArtistInformations, 'findAll').resolves(artistInfosMock);

      await artistInformationController.list(req, res, next);

      expect(res.locals.data).toEqual(artistInfosMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});
