// models/TattooArtists.js
import { Model, DataTypes } from "sequelize";

class TattooArtists extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users', 
            key: 'id'        
          },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        specialty: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        experience: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        tag_list: {
          type: DataTypes.STRING,
          allowNull: true,
        },
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

export default TattooArtists;
