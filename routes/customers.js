import express from 'express';
import customersController from '../controller/customersController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();


router.route('/customers').post(
  authorizer,
  customersController.create
);


router.route('/customers').get(
  authorizer,
  customersController.list
);


router.route('/customers/:id').put(
  authorizer,
  customersController.update
);


router.route('/customers/:id').delete(
  authorizer,
  customersController.remove
);

export default router;
