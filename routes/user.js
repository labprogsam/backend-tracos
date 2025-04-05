import express from 'express';
import user from '../controller/usersController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();

// Define as rotas de usuários
router.route('/users').post(
    user.create
);
router.route('/users/:id').put(
    authorizer,
    user.update
);
router.route('/users/:id').delete(
    authorizer,
    user.remove
);

router.route('/users/change-password').post(
    authorizer,
    // user.updatePassword,
  );
  

export default router;
