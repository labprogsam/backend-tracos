// routes/notificationRoutes.js

import express from 'express';
import notificationsController from '../controller/notificationsController.js';
import authorizer from '../handlers/helpers/authorizer.js';

const router = express.Router();


router.route('/notifications').get(
  authorizer,  
  notificationsController.list  
);


router.route('/notifications').post(
  authorizer,  
  notificationsController.create 
);


router.route('/notifications/:id').put(
  authorizer, 
  notificationsController.update  
);


router.route('/notifications/:id').delete(
  authorizer, 
  notificationsController.remove  
);

export default router;
