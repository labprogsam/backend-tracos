module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      values: ['TATUADOR', 'CLIENTE'],
      allowNull: false,
    },
    profile_photo_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
     gender: {
              type: Sequelize.STRING,
              allowNull: true,
                validate: {
                  isIn: [['Masculino', 'Feminino', 'Não-binário', 'Outro', 'Prefiro não dizer']]
              }
            },
            instagram: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            pinterest: {
              type: Sequelize.STRING,
              allowNull: true,
              unique: true
            },
            bio: {
              type: Sequelize.STRING,
              allowNull: true
            },
            tags_interests: {
              type: Sequelize.STRING,
              allowNull: true
            },
            phone_number: {
              type: Sequelize.STRING(13), // Número de telefone do tatuador, aceitando apenas inteiros, deverá ser feito tratamento de dados no back, validando se o parâmetro tem treze caracteres (Código de País + Código de Área + 9 dígitos)
              allowNull: true,
              unique: true,
            },
    resetPasswordToken: Sequelize.STRING,
    resetPasswordExpires: Sequelize.DATE,
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

  down: (queryInterface) => queryInterface.dropTable('Users'),
};
