// models/ArtistInformations.js
import { Model, DataTypes } from "sequelize";

class ArtistInformations extends Model {
  static init(sequelize) {
    super.init(
      {
        artist_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'TattooArtists', 
            key: 'id'        
          },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        description: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        phone_number: {
          type: DataTypes.STRING(13),
          allowNull: false,
          unique: true,
        },        
        zip_code: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        street: {
        type: DataTypes.STRING, 
        allowNull: false,
        },
        number: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        },
        addressComplement: {
        type: DataTypes.STRING, 
        allowNull: true, // Campo não obrigatório
        },
        neighborhood: { 
        type: DataTypes.STRING, 
        allowNull: false,
        },
        city: {
        type: DataTypes.STRING, 
        allowNull: false,
        },
        state: {
        type: DataTypes.STRING, 
        allowNull: false,
        },
        cpf: {
        type: DataTypes.STRING(11), 
        allowNull: false,
        unique: true,
        },
        rg: {
          type: DataTypes.STRING(8), 
          allowNull: false,
          unique: true,
        },
        orgao_emissor:{
          type: DataTypes.STRING, 
          allowNull: true,
        },
        about_you: {
          type: DataTypes.TEXT, 
          allowNull: true,
        },
        identity_photos_url: {
          type: DataTypes.TEXT, 
          allowNull: false,
        },
        residency_proof_url: {
          type: DataTypes.TEXT, 
          allowNull: false,
        },
        isverified: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
        defaultValue: false, // Valor padrão definido
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

export default ArtistInformations;
