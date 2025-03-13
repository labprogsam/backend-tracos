// controllers/UsuarioController.js
import Usuario from "../models/usuarioModel";
import { Op } from "sequelize";

export default {
  async create(req, res) {
    try {
      const { nome, email, senha, tipo, created_at } = req.body;
      const usuario = await Usuario.create({ nome, email, senha, tipo, created_at });
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha, tipo, foto_perfil, updated_at } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      await usuario.update({ nome, email, senha, tipo, foto_perfil, updated_at });
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      await usuario.update({ deleted_at: new Date().toISOString() });
      return res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir usuário." });
    }
  },
};
