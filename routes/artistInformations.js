import express from 'express';
import multer from 'multer';
import artistInformation from '../controller/artistInformationsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();

// Configuração básica do multer
const upload = multer({ dest: 'uploads/' }); // arquivos são salvos temporariamente aqui

// Listar ArtistInformations
router.route('/artist-information').get(
  authorizer,
  artistInformation.list
);

// Criar ArtistInformation (com arquivos)
router.route('/artist-information').post(
  authorizer,
  upload.fields([
    { name: 'identity_photos', maxCount: 2 },
    { name: 'residency_proof', maxCount: 1 }
  ]),
  artistInformation.create
);

// Atualizar ArtistInformation (com arquivos)
router.route('/artist-information/:id').put(
  authorizer,
  upload.fields([
    { name: 'identity_photos', maxCount: 2 },
    { name: 'residency_proof', maxCount: 1 }
  ]),
  artistInformation.update
);

// Remover ArtistInformation
router.route('/artist-information/:id').delete(
  authorizer,
  artistInformation.remove
);

export default router;
