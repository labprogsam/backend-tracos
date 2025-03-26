module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Customer', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {  // Atributo da chave estrangeira
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',  // Nome da tabela referenciada
        key: 'id'        // Chave primária na tabela referenciada
      },
      allowNull: false,
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

  down: (queryInterface) => queryInterface.dropTable('Customer'),
};
