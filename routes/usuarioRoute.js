import express from 'express';
import usuario from '../controller/usuario.js';

const router = express.Router();

// Define as rotas de usuários
router.route('/usuarios').post(usuario.create);  // POST /api/usuarios
router.route('/usuarios/:id').put(usuario.update);  // PUT /api/usuarios/:id
router.route('/usuarios/:id').delete(usuario.delete);  // DELETE /api/usuarios/:id

export default router;
