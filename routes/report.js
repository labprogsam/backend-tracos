import express from 'express';
import reportsController from '../controller/reportsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();


router.route('/reports').post(
  authorizer,
  reportsController.create
);


router.route('/reports').get(
  authorizer,
  reportsController.list
);


router.route('/reports/:id').put(
  authorizer,
  reportsController.update
);


router.route('/reports/:id').delete(
  authorizer,
  reportsController.remove
);

export default router;
