module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('TattooArtists', {
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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    specialty: {
      type: Sequelize.STRING,
      allowNull: true, // Pode ser vazio, caso o Tatuador não tenha uma especialidade definida
    },
    experience: {
      type: Sequelize.INTEGER, // Anos de experiência do tatuador
      allowNull: true,
    },
    tag_list: {
      type: Sequelize.STRING,
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

  down: (queryInterface) => queryInterface.dropTable('TattooArtists'),
};
