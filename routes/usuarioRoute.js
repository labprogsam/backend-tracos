import express from "express";
import usuario from "../controller/usuario.js";

const router = express.Router();

router.route("/usuarios").post(usuario.create);
router.route("/usuarios/:id").put(usuario.update);
router.route("/usuarios/:id").delete(usuario.delete);

export default router;
