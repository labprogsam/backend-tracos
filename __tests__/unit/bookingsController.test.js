import sinon from 'sinon';
import bookingController from '../../controller/bookingsController.js';
import { Bookings } from '../../models/index.js';
import Messages from '../../constants/strings.js';

describe('Booking Controller', () => {
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

  describe('Create Booking', () => {
    it('deve criar um agendamento com sucesso', async () => {
      req.body = { artist_id: 1, customer_id: 2, age: 25, date_suggestion: '2025-05-01' };
      const bookingMock = { id: 1, ...req.body };
      sinon.stub(Bookings, 'create').resolves(bookingMock);

      await bookingController.create(req, res, next);

      expect(res.locals.data).toEqual(bookingMock);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se faltar artist_id', async () => {
      req.body = { customer_id: 2, age: 25, date_suggestion: '2025-05-01' };
      await bookingController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.BOOKINGS.ARTIST_REQUIRED })).toBe(true);
    });
  });

  describe('Update Booking', () => {
    it('deve atualizar um agendamento com sucesso', async () => {
      req.params.id = '1';
      req.body = { date_suggestion: '2025-06-01' };
      const bookingMock = { update: sinon.stub().resolves({ id: 1, ...req.body }) };
      sinon.stub(Bookings, 'findByPk').resolves(bookingMock);

      await bookingController.update(req, res, next);

      expect(bookingMock.update.calledOnceWith(req.body)).toBe(true);
      expect(res.locals.data).toEqual({ id: 1, ...req.body });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('Remove Booking', () => {
    it('deve remover um agendamento com sucesso', async () => {
      req.params.id = '1';
      const bookingMock = { update: sinon.stub().resolves() };
      sinon.stub(Bookings, 'findByPk').resolves(bookingMock);

      await bookingController.remove(req, res, next);

      expect(bookingMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('List Bookings', () => {
    it('deve listar todos os agendamentos', async () => {
      const bookingsMock = [
        { id: 1, artist_id: 1, customer_id: 2 },
        { id: 2, artist_id: 2, customer_id: 3 },
      ];
      sinon.stub(Bookings, 'findAll').resolves(bookingsMock);

      await bookingController.list(req, res, next);

      expect(res.locals.data).toEqual(bookingsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});