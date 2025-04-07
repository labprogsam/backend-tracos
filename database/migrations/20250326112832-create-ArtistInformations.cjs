module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ArtistInformations', {
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
    zip_code: {
      type: Sequelize.STRING(8), // Número do CEP do tatuador, aceitando apenas inteiros, deverá ser feito tratamento de dados no back, validando se o parâmetro tem oito caracteres
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING, 
      allowNull: false,
    },
    number: {
      type: Sequelize.INTEGER, 
      allowNull: false,
    },
    addressComplement: {
      type: Sequelize.STRING, 
      allowNull: true, // Campo não obrigatório
    },
    neighborhood: { 
      type: Sequelize.STRING, 
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING, 
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING, 
      allowNull: false,
    },
    cpf: {
      type: Sequelize.STRING(11), // Número do CPF do tatuador, aceitando apenas inteiros, deverá ser feito tratamento de dados no back, validando se o parâmetro tem onze caracteres 
      allowNull: false,
      unique: true,
    },
    rg: {
      type: Sequelize.STRING(8), 
      allowNull: false,
      unique: true,
    },
    orgao_emissor:{
      type: Sequelize.STRING, 
      allowNull: true,
    },
    description:{
      type: Sequelize.STRING, 
      allowNull: true,
    },
    about_you: {
      type: Sequelize.TEXT, 
      allowNull: true,
    },
    isverified: {
      type: Sequelize.BOOLEAN, 
      allowNull: false,
      defaultValue: false, // Valor padrão definido
    },
    phone_number: {
              type: Sequelize.STRING(13), // Número de telefone do tatuador, aceitando apenas inteiros, deverá ser feito tratamento de dados no back, validando se o parâmetro tem treze caracteres (Código de País + Código de Área + 9 dígitos)
              allowNull: true,
              unique: true,
            },
    identity_photos_url: {
      type: Sequelize.TEXT, 
      allowNull: false,
    },
    residency_proof_url: {
      type: Sequelize.TEXT, 
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

  down: (queryInterface) => queryInterface.dropTable('ArtistInformations'),
};
