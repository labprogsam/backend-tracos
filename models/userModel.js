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
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        profile_photo: {
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
        tableName: "users",
        timestamps: false,
        underscored: false,
      }
    );
  }
}

export default User;

