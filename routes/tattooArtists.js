import express from 'express';
import tattooArtistController from '../controller/tattooArtistsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();

// Define as rotas de Tattoo Artists
router.route('/tattoo-artists').get(
    authorizer,
    tattooArtistController.list
);

router.route('/tattoo-artists').post(
    authorizer,
    tattooArtistController.store
);

router.route('/tattoo-artists/:id').put(
    authorizer,
    tattooArtistController.update
);

router.route('/tattoo-artists/:id').delete(
    authorizer,
    tattooArtistController.remove
);

export default router;
