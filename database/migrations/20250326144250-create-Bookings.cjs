module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Bookings', {
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
    customer_id: {  // Atributo da chave estrangeira
      type: Sequelize.INTEGER,
      references: {
        model: 'Customers',  // Nome da tabela referenciada
        key: 'id'        // Chave primária na tabela referenciada
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    tatoo_style: {
      type: Sequelize.STRING,
      allowNull: true
    },
    body_region: {
      type: Sequelize.STRING,
      allowNull: true
    },
    size: {
      type: Sequelize.STRING,
      allowNull: true
    },
    references: {
      type: Sequelize.STRING,
      allowNull: true
    },
    allergies: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    date_suggestion: {
      type: Sequelize.DATE, // Data e Hora da Marcação
      allowNull: false, 
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    authorization: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['Pendente', 'Confirmada', 'Realizada']]
      }
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

  down: (queryInterface) => queryInterface.dropTable('Bookings'),
};
