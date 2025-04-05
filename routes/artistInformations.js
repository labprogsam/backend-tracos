import express from 'express';
import artistInformation from '../controller/artistInformationsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();

router.route('/artist-information').get(
    authorizer,
    artistInformation.list
);

router.route('/artist-information').post(
    authorizer,
    artistInformation.create
);

router.route('/artist-information/:id').put(
    authorizer,
    artistInformation.update
);

router.route('/artist-information/:id').delete(
    authorizer,
    artistInformation.remove
);

export default router;
