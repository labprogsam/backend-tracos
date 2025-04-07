module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Notifications', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(100), 
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    user_id: {  // Atributo da chave estrangeira
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',  // Nome da tabela referenciada
        key: 'id'        // Chave primária na tabela referenciada
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('Notifications'),
};
