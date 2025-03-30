import express from 'express';
import tagsController from '../controller/tagsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();


router.route('/tags').post(
  authorizer,
  tagsController.create
);


router.route('/tags').get(
  authorizer,
  tagsController.list
);


router.route('/tags/:id').put(
  authorizer,
  tagsController.update
);


router.route('/tags/:id').delete(
  authorizer,
  tagsController.remove
);

export default router;
