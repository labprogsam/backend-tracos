// controllers/UsuarioController.js
import User from "../models/userModel.js";

export default {
  async create(req, res) {
    try {
      const { name, email, password, type, created_at } = req.body;
      const user= await User.create({ name, email, password, type, created_at });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, type, profile_photo, updated_at } = req.body;

      const user= await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      await user.update({ name, email, password, type, profile_photo, updated_at });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      await user.update({ deleted_at: new Date().toISOString() });
      return res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir usuário." });
    }
  },
};
