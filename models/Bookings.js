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
          date_time: {
            type: DataTypes.DATE, 
            allowNull: false, 
          },
          taglist: {
            type: DataTypes.ARRAY(DataTypes.STRING), 
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

export default Bookings;
