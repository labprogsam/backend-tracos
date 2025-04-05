// models/Notifications.js
import { Model, DataTypes } from "sequelize";

class Notifications extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
            type: DataTypes.STRING(100), 
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true
          },
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

export default Notifications;
