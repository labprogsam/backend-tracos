import express from 'express';
import bookingsController from '../controller/bookingsController.js';
import authorizer from '../handlers/helpers/authorizer.js';


const router = express.Router();

// Define as rotas de Bookings
router.route('/bookings').get(
    authorizer,
    bookingsController.list
);

router.route('/bookings').post(
    authorizer,
    bookingsController.create
);

router.route('/bookings/:id').put(
    authorizer,
    bookingsController.update
);

router.route('/bookings/:id').delete(
    authorizer,
    bookingsController.remove
);


export default router;