import express from 'express';
import multer from 'multer';
import reportsController from '../controller/reportsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });
router.route('/reports').post(
  authorizer,
  upload.array('files', 5), // Permite até 5 arquivos
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
