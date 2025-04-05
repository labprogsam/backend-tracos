module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Images', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    artist_id: {  // Atributo da chave estrangeira
      type: Sequelize.INTEGER,
      references: {
        model: 'TattooArtists',  // Nome da tabela referenciada
        key: 'id'        // Chave primária na tabela referenciada
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false, 
    },
    description: {
      type: Sequelize.STRING, 
      allowNull: true,
    },
    tags: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    portfolio_index: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    is_featured: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
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

  down: (queryInterface) => queryInterface.dropTable('Images'),
};
