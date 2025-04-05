import sinon from 'sinon';
import tattooArtistsController from '../../controller/tattooArtistsController.js';
import { TattooArtists, Users } from '../../models/index.js';
import messages from '../../constants/strings.js';
import { Pool } from 'pg';

// Mock do pool do PostgreSQL
const poolStub = sinon.stub(Pool.prototype, 'query').resolves({
  rows: [
    { id: 1, name: 'Tattoo Artist 1', specialty: 'Traditional', experience: '5 years', tag_list: 'color, bold' },
    { id: 2, name: 'Tattoo Artist 2', specialty: 'Blackwork', experience: '3 years', tag_list: 'blackwork, geometric' }
  ]
});

describe('TattooArtists Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: { searchTerm: '' }, params: {}, body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      locals: {},
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Create Tattoo Artist', () => {
    it('deve criar um novo tatuador', async () => {
      req.body = { user_id: 1, specialty: 'Traditional', experience: 5, tag_list: 'rose, snake' };

      sinon.stub(Users, 'findByPk').resolves({ id: 1 });
      sinon.stub(TattooArtists, 'create').resolves({ id: 1, user_id: 1, specialty: 'Traditional', experience: 5, tag_list: 'rose, snake' });

      await tattooArtistsController.create(req, res, next);

      expect(res.locals.data).toEqual({ id: 1, user_id: 1, specialty: 'Traditional', experience: 5, tag_list: 'rose, snake' });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o user_id não existir', async () => {
      req.body = { user_id: 999, specialty: 'Traditional', experience: 5, tag_list: 'rose, snake' };

      sinon.stub(Users, 'findByPk').resolves(null);

      await tattooArtistsController.create(req, res, next);

      expect(next.calledWithMatch({ status: 400, data: messages.TATTOO_ARTISTS.INVALID_USER })).toEqual(true);
    });
  });

  describe('Update Tattoo Artist', () => {
    it('deve atualizar um tatuador existente', async () => {
      req.params.id = 1;
      req.body = { specialty: 'Neo Traditional', experience: 6, tag_list: 'eagle, flower' };

      sinon.stub(TattooArtists, 'findByPk').resolves({
        id: 1,
        update: sinon.stub().resolves({
          id: 1,
          user_id: 1,
          specialty: 'Neo Traditional',
          experience: 6,
          tag_list: 'eagle, flower'
        }),
      });

      await tattooArtistsController.update(req, res, next);

      expect(res.locals.data).toEqual({
        id: 1,
        user_id: 1,
        specialty: 'Neo Traditional',
        experience: 6,
        tag_list: 'eagle, flower'
      });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o tatuador não existir', async () => {
      req.params.id = 999;

      sinon.stub(TattooArtists, 'findByPk').resolves(null);

      await tattooArtistsController.update(req, res, next);

      expect(next.calledWithMatch({ status: 400, data: messages.TATTOO_ARTISTS.NOT_FOUND })).toEqual(true);
    });
  });

  describe('Remove Tattoo Artist', () => {
    it('deve desativar um tatuador', async () => {
      req.params.id = 1;

      sinon.stub(TattooArtists, 'findByPk').resolves({
        id: 1,
        destroy: sinon.stub().resolves()
      });

      await tattooArtistsController.remove(req, res, next);

      expect(res.locals.status).toBe(204);
      expect(res.locals.message).toEqual(messages.TATTOO_ARTISTS.REMOVE_SUCCESS);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('List Tattoo Artists', () => {
    let queryStub;
  
    afterEach(() => {
      sinon.restore(); // limpa o stub do query a cada teste
    });
  
    it('deve listar todos os tatuadores ativos', async () => {
      queryStub = sinon.stub(Pool.prototype, 'query').resolves({
        rows: [
          { id: 1, name: 'Tattoo Artist 1', specialty: 'Traditional', experience: '5 years', tag_list: 'color, bold' },
          { id: 2, name: 'Tattoo Artist 2', specialty: 'Blackwork', experience: '3 years', tag_list: 'blackwork, geometric' }
        ]
      });
  
      await tattooArtistsController.list(req, res, next);
  
      sinon.assert.calledOnce(queryStub);
      expect(res.status.calledWith(200)).toBe(true);
      expect(res.json.calledWith([
        { id: 1, name: 'Tattoo Artist 1', specialty: 'Traditional', experience: '5 years', tag_list: 'color, bold' },
        { id: 2, name: 'Tattoo Artist 2', specialty: 'Blackwork', experience: '3 years', tag_list: 'blackwork, geometric' }
      ])).toBe(true);
    });
  
    it('deve retornar erro se a busca falhar', async () => {
      queryStub = sinon.stub(Pool.prototype, 'query').rejects(new Error('Database error'));
  
      await tattooArtistsController.list(req, res, next);
  
      sinon.assert.calledOnce(queryStub);
      expect(res.status.calledWith(500)).toBe(true);
      expect(res.json.calledWith({ error: 'Erro ao listar artistas de tatuagem' })).toBe(true);
    });
  });
  
});
