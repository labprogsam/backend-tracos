import { Model, DataTypes } from 'sequelize';

class Task extends Model {
  static init(sequelize) {
    super.init({
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['pendente', 'realizando', 'concluída'],
            allowNull: false,
        },
        data_vencimento: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
      sequelize,
      underscored: false,
    });
  }
}

export default Task;
