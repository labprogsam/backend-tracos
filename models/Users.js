// models/Usuario.js
import { Model, DataTypes } from "sequelize";

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM,
          values: ['TATUADOR', 'CLIENTE'],
          allowNull: false,
        },
        profile_photo_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: true,
            validate: {
              isIn: [['Masculino', 'Feminino', 'Não-binário', 'Outro', 'Prefiro não dizer']]
          }
        },
        instagram: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        pinterest: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true
        },
        bio: {
          type: DataTypes.STRING,
          allowNull: true
        },
        tags_interests: {
          type: DataTypes.STRING,
          allowNull: true
        },
        phone_number: {
          type: DataTypes.STRING(13), // Número de telefone do tatuador, aceitando apenas inteiros, deverá ser feito tratamento de dados no back, validando se o parâmetro tem treze caracteres (Código de País + Código de Área + 9 dígitos)
          allowNull: true,
          unique: true,
        },
        resetPasswordToken: DataTypes.STRING,
        resetPasswordExpires: DataTypes.DATE,
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        underscored: false,
      }
    );
  }
}

export default Users;
