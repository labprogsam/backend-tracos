import sinon from 'sinon';
import reportsController from '../../controller/reportsController.js';
import { Reports } from '../../models/index.js';
import messages from '../../constants/strings.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

describe('Reports Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, files: [] };
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

  describe('Create Report', () => {
    it('deve criar um relatório com sucesso', async () => {
      req.body = { user_id: 1, title: 'Relatório 1', description: 'Descrição do relatório' };
      req.files = [{ path: 'file1.jpg' }];
      
      sinon.stub(cloudinary.v2.uploader, 'upload').resolves({ secure_url: 'https://cloudinary.com/file1.jpg' });
      sinon.stub(fs, 'unlinkSync');
      sinon.stub(Reports, 'create').resolves({ id: 1, user_id: 1, title: 'Relatório 1', description: 'Descrição do relatório', files: '["https://cloudinary.com/file1.jpg"]' });
      
      await reportsController.create(req, res, next);

      expect(res.locals.data).toHaveProperty('id', 1);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se user_id não for fornecido', async () => {
      req.body = { title: 'Relatório 1', description: 'Descrição do relatório' };
      await reportsController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: messages.REPORTS.USER_ID_REQUIRED })).toBe(true);
    });
  });

  describe('Update Report', () => {
    it('deve atualizar um relatório com sucesso', async () => {
      req.params.id = '1';
      req.body = { title: 'Título Atualizado', description: 'Descrição Atualizada', files: '[]' };
      
      const reportMock = { update: sinon.stub().resolves(req.body) };
      sinon.stub(Reports, 'findByPk').resolves(reportMock);

      await reportsController.update(req, res, next);
      expect(reportMock.update.calledOnceWith(req.body)).toBe(true);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('Remove Report', () => {
    it('deve remover um relatório com sucesso', async () => {
      req.params.id = '1';
      const reportMock = { update: sinon.stub().resolves() };
      sinon.stub(Reports, 'findByPk').resolves(reportMock);

      await reportsController.remove(req, res, next);
      expect(reportMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('List Reports', () => {
    it('deve listar todos os relatórios', async () => {
      const reportsMock = [
        { id: 1, title: 'Relatório 1', description: 'Descrição 1' },
        { id: 2, title: 'Relatório 2', description: 'Descrição 2' },
      ];
      sinon.stub(Reports, 'findAll').resolves(reportsMock);

      await reportsController.list(req, res, next);
      expect(res.locals.data).toEqual(reportsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});

/*
| Função Testada | Descrição                            | Entrada                        | Saída Esperada                       | Comportamento esperado |
|---------------|------------------------------------|--------------------------------|-------------------------------------|-------------------------|
| create       | Cria um novo relatório             | Dados válidos de relatório    | Status 201 e relatório criado      | Relatório cadastrado com sucesso |
| create       | Erro se user_id não for fornecido  | Falta o user_id               | Erro 400 e mensagem apropriada     | Nenhum relatório criado |
| update       | Atualiza dados de um relatório    | ID do relatório e novos dados | Status 200 e relatório atualizado  | Relatório editado corretamente |
| remove       | Remove um relatório               | ID de um relatório existente  | Status 204                         | Relatório marcado como removido |
| list         | Lista todos os relatórios         | Nenhuma entrada necessária    | Lista de relatórios e status 200   | Todos os relatórios são retornados |
*/
