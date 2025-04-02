import sinon from 'sinon';
import bookingController from '../../controller/bookingsController.js';
import { Bookings, Customers, TattooArtists } from '../../models/index.js';
import messages from '../../constants/strings.js';

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
    it('deve criar uma reserva com sucesso', async () => {
      req.body = { customer_id: 1, artist_id: 2, date_time: '2025-04-02T12:00:00Z', taglist: ['tatuagem'] };
      
      sinon.stub(Customers, 'findByPk').resolves({ id: 1 });
      sinon.stub(TattooArtists, 'findByPk').resolves({ id: 2 });
      sinon.stub(Bookings, 'create').resolves({ id: 1, ...req.body });

      await bookingController.create(req, res, next);

      expect(res.locals.data).toEqual({ id: 1, ...req.body });
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se faltar campos obrigatórios', async () => {
      req.body = { customer_id: 1 };
      await bookingController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: messages.BOOKINGS.MISSING_FIELDS })).toBe(true);
    });
  });

  describe('Update Booking', () => {
    it('deve atualizar uma reserva com sucesso', async () => {
      req.params.id = '1';
      req.body = { customer_id: 1, artist_id: 2, date_time: '2025-04-02T15:00:00Z', taglist: ['nova'] };
      
      const bookingMock = { id: 1, artist_id: 2, update: sinon.stub().resolves({ id: 1, ...req.body }) };
      sinon.stub(Bookings, 'findByPk').resolves(bookingMock);

      await bookingController.update(req, res, next);

      expect(bookingMock.update.calledOnceWith(req.body)).toBe(true);
      expect(res.locals.data).toEqual({ message: messages.BOOKINGS.UPDATE_SUCCESS, updatedBooking: { id: 1, ...req.body } });
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('Remove Booking', () => {
    it('deve remover uma reserva com sucesso', async () => {
      req.params.id = '1';
      const bookingMock = { destroy: sinon.stub().resolves() };
      sinon.stub(Bookings, 'findByPk').resolves(bookingMock);

      await bookingController.remove(req, res, next);

      expect(bookingMock.destroy.calledOnce).toBe(true);
      expect(res.locals.data).toEqual({ message: messages.BOOKINGS.DELETE_SUCCESS });
      expect(res.locals.status).toBe(204);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('List Bookings', () => {
    it('deve listar todas as reservas', async () => {
      req.query.artist_id = '2';
      const bookingsMock = [{ id: 1, artist_id: 2, customer_id: 1, date_time: '2025-04-02T12:00:00Z', taglist: ['tatuagem'] }];
      sinon.stub(Bookings, 'findAll').resolves(bookingsMock);

      await bookingController.list(req, res, next);

      expect(res.locals.data).toEqual(bookingsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
});
