import express from 'express';
import multer from 'multer';
import imagesController from '../controller/imagesController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();


const upload = multer({ dest: 'uploads/' });


router.route('/images').post(
  authorizer,
  upload.single('image'), // Campo 'image' no corpo da requisição
  imagesController.create
);


router.route('/images').get(
  authorizer,
  imagesController.list
);


router.route('/images/:id').put(
  authorizer,
  upload.single('image'),
  imagesController.update
);


router.route('/images/:id').delete(
  authorizer,
  imagesController.remove
);

export default router;
