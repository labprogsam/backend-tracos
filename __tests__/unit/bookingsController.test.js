import sinon from 'sinon';
import bookingsController from '../../controller/bookingsController.js';
import { Bookings } from '../../models/index.js';
import messages from '../../constants/strings.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

describe('Bookings Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, files: [], query: {} };
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
      req.body = { artist_id: 1, customer_id: 2, age: 25, date_suggestion: '2025-04-10' };
      sinon.stub(Bookings, 'create').resolves({ id: 1, ...req.body });
      await bookingsController.create(req, res, next);
      expect(res.locals.data).toHaveProperty('id', 1);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se campos obrigatórios não forem fornecidos', async () => {
      req.body = { artist_id: 1, age: 25 };
      await bookingsController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: messages.BOOKINGS.MISSING_FIELDS })).toBe(true);
    });
  });

  describe('Update Booking', () => {
    it('deve atualizar um agendamento com sucesso', async () => {
      req.params.id = '1';
      req.body = { status: 'Confirmada' };
  
      const bookingMock = { update: sinon.stub().resolves(req.body) };
      sinon.stub(Bookings, 'findByPk').resolves(bookingMock);
  
      await bookingsController.update(req, res, next);
  
      expect(bookingMock.update.calledOnce).toBe(true);
      expect(bookingMock.update.firstCall.args[0]).toMatchObject({ status: 'Confirmada' });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
  
  describe('Remove Booking', () => {
    it('deve remover um agendamento com sucesso', async () => {
      req.params.id = '1';
      const bookingMock = { update: sinon.stub().resolves() };
      sinon.stub(Bookings, 'findByPk').resolves(bookingMock);
      await bookingsController.remove(req, res, next);
      expect(bookingMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('List Bookings', () => {
    it('deve listar os agendamentos pelo artist_id', async () => {
      req.query.artist_id = '1';
      const bookingsMock = [{ id: 1, artist_id: 1, customer_id: 2 }];
      sinon.stub(Bookings, 'findAll').resolves(bookingsMock);
      await bookingsController.list(req, res, next);
      expect(res.locals.data).toEqual(bookingsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});
