// models/Bookings.js
import { Model, DataTypes } from "sequelize";

class Bookings extends Model {
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
          customer_id: {  
            type: DataTypes.INTEGER,
            references: {
              model: 'Customers',  
              key: 'id'        
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          age: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          tatoo_style: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          body_region: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          size: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          references: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          allergies: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          date_suggestion: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          message: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          authorization: {
            type: DataTypes.STRING,
            allowNull: true
          },
          status: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
              isIn: [['Pendente', 'Confirmada', 'Realizada']]
          }
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

export default Bookings;
