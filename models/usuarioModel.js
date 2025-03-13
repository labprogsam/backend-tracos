// models/Usuario.js
import { Model, DataTypes } from "sequelize";

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tipo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        foto_perfil: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "usuario",
        timestamps: false,
        underscored: false,
      }
    );
  }
}

export default Usuario;

