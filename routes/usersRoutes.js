import express from 'express';
import usuario from '../controller/users.js';

const router = express.Router();

// Define as rotas de usuários
router.route('/users').post(usuario.create);  // POST /api/usuarios
router.route('/users/:id').put(usuario.update);  // PUT /api/usuarios/:id
router.route('/users/:id').delete(usuario.delete);  // DELETE /api/usuarios/:id

export default router;
