import sinon from 'sinon';
import tagController from '../../controller/tagsController.js';
import { Tags } from '../../models/index.js';
import Messages from '../../constants/strings.js';

describe('Tag Controller', () => {
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

  describe('Create Tag', () => {
    it('deve criar uma tag com sucesso', async () => {
      req.body = { name: 'Tag1', description: 'Descrição da Tag1' };
      const tagMock = { id: 1, name: 'Tag1', description: 'Descrição da Tag1' };
      sinon.stub(Tags, 'create').resolves(tagMock);

      await tagController.create(req, res, next);

      expect(res.locals.data).toEqual(tagMock);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o nome da tag não for fornecido', async () => {
      req.body = { description: 'Descrição da Tag1' };
      await tagController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.TAGS.NAME_REQUIRED })).toBe(true);
    });
  });

  it('deve atualizar uma tag com sucesso', async () => {
    req.params.id = '1';
    req.body = { name: 'Tag Atualizada', description: 'Nova descrição' };
    
    const tagMock = { 
      id: 1, 
      name: 'Tag Antiga', 
      description: 'Descrição Antiga', 
      update: sinon.stub().resolves({ id: 1, name: 'Tag Atualizada', description: 'Nova descrição' }) 
    };
  
    sinon.stub(Tags, 'findByPk').resolves(tagMock);
  
    await tagController.update(req, res, next);
  
    expect(tagMock.update.calledOnceWith({ name: 'Tag Atualizada', description: 'Nova descrição' })).toBe(true);
    expect(res.locals.data).toEqual({ id: 1, name: 'Tag Atualizada', description: 'Nova descrição' });
    expect(res.locals.status).toBe(200);
    expect(next.calledOnce).toBe(true);
  });
  

  describe('Remove Tag', () => {
    it('deve remover uma tag com sucesso', async () => {
      req.params.id = '1';
      const tagMock = { update: sinon.stub().resolves() };
      sinon.stub(Tags, 'findByPk').resolves(tagMock);

      await tagController.remove(req, res, next);

      expect(tagMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se a tag não existir', async () => {
      req.params.id = '1';
      sinon.stub(Tags, 'findByPk').resolves(null);
      await tagController.remove(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.TAGS.NOT_FOUND })).toBe(true);
    });
  });

  describe('List Tags', () => {
    it('deve listar todas as tags', async () => {
      const tagsMock = [
        { id: 1, name: 'Tag1', description: 'Descrição 1' },
        { id: 2, name: 'Tag2', description: 'Descrição 2' },
      ];
      sinon.stub(Tags, 'findAll').resolves(tagsMock);

      await tagController.list(req, res, next);

      expect(res.locals.data).toEqual(tagsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});

/*
| Função Testada | Descrição                            | Entrada                        | Saída Esperada                       | Comportamento esperado |
|---------------|------------------------------------|--------------------------------|-------------------------------------|-------------------------|
| create       | Cria uma nova tag                  | Dados válidos de tag          | Status 201 e tag criada            | Tag cadastrada com sucesso |
| create       | Erro se nome não for fornecido     | Falta o nome                  | Erro 400 e mensagem apropriada     | Nenhuma tag criada |
| update       | Atualiza dados de uma tag         | ID da tag e novos dados       | Status 200 e tag atualizada        | Tag editada corretamente |
| update       | Erro se a tag não existir         | ID inválido                    | Erro 400 e mensagem apropriada     | Nenhuma edição feita |
| remove       | Remove uma tag                    | ID de uma tag existente       | Status 204                         | Tag marcada como removida |
| remove       | Erro se a tag não existir         | ID inválido                    | Erro 400 e mensagem apropriada     | Nenhuma remoção feita |
| list         | Lista todas as tags               | Nenhuma entrada necessária     | Lista de tags e status 200         | Todas as tags são retornadas |
*/
