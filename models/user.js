// models/Usuario.js
import { Model, DataTypes } from "sequelize";

class User extends Model {
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
        profile_photo: {
          type: DataTypes.STRING,
          allowNull: true,
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

export default User;
