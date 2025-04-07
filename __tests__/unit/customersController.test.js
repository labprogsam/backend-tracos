import sinon from 'sinon';
import customersController from '../../controller/customersController.js';
import { Customers, Users } from '../../models/index.js';
import messages from '../../constants/strings.js';

describe('Customers Controller', () => {
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

  describe('Create Customer', () => {
    it('deve criar um novo cliente', async () => {
      req.body = { user_id: 1 };

      sinon.stub(Users, 'findByPk').resolves({ id: 1 });
      sinon.stub(Customers, 'create').resolves({ id: 1, user_id: 1 });

      await customersController.create(req, res, next);

      expect(res.locals.data).toEqual({ id: 1, user_id: 1 });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o user_id não existir', async () => {
      req.body = { user_id: 999 };

      sinon.stub(Users, 'findByPk').resolves(null);

      await customersController.create(req, res, next);

      expect(next.calledWith({ status: 400, data: messages.CUSTOMERS.USER_ID_NOT_FOUND })).toBe(true);
    });
  });

  describe('Update Customer', () => {
    it('deve atualizar um cliente existente', async () => {
      req.params.id = 1;
      req.body.user_id = 2;

      sinon.stub(Customers, 'findByPk').resolves({ id: 1, update: sinon.stub().resolves({ id: 1, user_id: 2 }) });
      sinon.stub(Users, 'findByPk').resolves({ id: 2 });

      await customersController.update(req, res, next);

      expect(res.locals.data).toEqual({ id: 1, user_id: 2 });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se o cliente não existir', async () => {
      req.params.id = 999;

      sinon.stub(Customers, 'findByPk').resolves(null);

      await customersController.update(req, res, next);

      expect(next.calledWith({ status: 400, data: messages.CUSTOMERS.NOT_FOUND })).toBe(true);
    });
  });

  describe('Remove Customer', () => {
    it('deve desativar um cliente', async () => {
      req.params.id = 1;

      sinon.stub(Customers, 'findByPk').resolves({ id: 1, update: sinon.stub().resolves() });

      await customersController.remove(req, res, next);

      expect(res.locals.status).toBe(204);
      expect(res.locals.data).toEqual({ message: messages.CUSTOMERS.DELETED_SUCCESS });
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('List Customers', () => {
    it('deve listar todos os clientes ativos', async () => {
      const customersMock = [{ id: 1, user_id: 1 }, { id: 2, user_id: 2 }];

      sinon.stub(Customers, 'findAll').resolves(customersMock);

      await customersController.list(req, res, next);

      expect(res.locals.data).toEqual(customersMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});

