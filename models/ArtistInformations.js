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
        gender: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isIn: [['Masculino', 'Feminino', 'Não-binário', 'Outro', 'Prefiro não dizer']]
        }
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
