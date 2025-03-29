// models/Reports.js
import { Model, DataTypes } from "sequelize";

class Reports extends Model {
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
        title: {
            type: DataTypes.STRING(100), 
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: false
          },
          files: {
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

export default Reports;
