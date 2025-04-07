// models/Images.js
import { Model, DataTypes } from "sequelize";

class Images extends Model {
  static init(sequelize) {
    super.init(
      {
        artist_id: {  
            type: DataTypes.INTEGER,
            references: {
              model: 'TattooArtists',  
              key: 'id'        
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          url: {
            type: DataTypes.STRING,
            allowNull: false, 
          },
          description: {
            type: DataTypes.STRING, 
            allowNull: true,
          },
          tags: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          portfolio_index: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          is_featured: {
            type: DataTypes.BOOLEAN,
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

export default Images;
