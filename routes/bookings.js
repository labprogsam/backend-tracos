import express from 'express';
import multer from 'multer';

import bookingsController from '../controller/bookingsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // salva arquivos temporariamente na pasta uploads/

// Listar bookings
router.route('/bookings').get(
  authorizer,
  bookingsController.list
);

// Criar booking com upload de arquivos
router.route('/bookings').post(
  authorizer,
  upload.fields([
    { name: 'authorization', maxCount: 1 },
    { name: 'references', maxCount: 1 }
  ]),
  bookingsController.create
);

// Atualizar booking
router.route('/bookings/:id').put(
  authorizer,
  upload.fields([
    { name: 'authorization', maxCount: 1 },
    { name: 'references', maxCount: 1 }
  ]),
  bookingsController.update
);

// Remover booking
router.route('/bookings/:id').delete(
  authorizer,
  bookingsController.remove
);

export default router;