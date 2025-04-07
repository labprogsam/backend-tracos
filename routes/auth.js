import express from 'express';
import auth from '../controller/auth.js';

const router = express.Router();

router.route('/login').post(
  auth.login,
);

router.route('/refresh-token').get(
  auth.refreshToken,
);

router.route('/forgot-password').post(
  auth.forgotPassword,
);

router.route('/recovery-password').post(
  auth.recoveryPassword,
);

router.route('/update-password').post(
  auth.updatePassword,
);
export default router;
