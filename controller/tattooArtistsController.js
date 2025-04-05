import jwt from 'jsonwebtoken';
import messages from '../constants/strings.js';
import { Users, TattooArtists, ArtistInformations } from '../models/index.js';
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// Configuração de conexão com o banco
const pool = new Pool({
  user: process.env.DB_USER, 
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASS, 
  port: 5432, 
  ssl:true
});

const create = async (req, res, next) => {
  try {
    const { user_id, specialty, experience, tag_list } = req.body;

    // Verifica se o user_id existe
    const user = await Users.findByPk(user_id);
    if (!user) {
      return next({ status: 400, data: messages.TATTOO_ARTISTS.INVALID_USER });
    }

    const artist = await TattooArtists.create({
      user_id,
      specialty,
      experience,
      tag_list,
    });

    res.locals.data = artist;
    res.locals.status = 201;
    res.locals.message = messages.TATTOO_ARTISTS.CREATE_SUCCESS;

    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { specialty, experience, tag_list } = req.body;

    const artist = await TattooArtists.findByPk(id);
    if (!artist) return next({ status: 400, data: messages.TATTOO_ARTISTS.NOT_FOUND });

    const updatedArtist = await artist.update({
      specialty,
      experience,
      tag_list,
    });

    res.locals.data = updatedArtist;
    res.locals.status = 200;
    res.locals.message = messages.TATTOO_ARTISTS.UPDATE_SUCCESS;

    return next();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artist = await TattooArtists.findByPk(id);
    if (!artist) return next({ status: 400, data: messages.TATTOO_ARTISTS.NOT_FOUND });

    await artist.destroy();

    res.locals.status = 204;
    res.locals.message = messages.TATTOO_ARTISTS.REMOVE_SUCCESS;

    return next();
  } catch (err) {
    next(err);
  }
};

async function list(req, res) {
  const { searchTerm } = req.query; // Supondo que o searchTerm seja passado via query string

  try {
    // Certifique-se de que o searchTerm está no formato correto para ser utilizado na query
    const formattedSearchTerm = `%${searchTerm}%`;

    // Modificando a consulta para dividir tag_list em um array
    const query = `
  SELECT DISTINCT t.id, u.name, t.specialty, t.experience, t.tag_list
  FROM "TattooArtists" t
  LEFT JOIN "Users" u ON t.user_id = u.id
  LEFT JOIN "ArtistInformations" ai ON t.id = ai.artist_id
  WHERE u.name ILIKE $1
     OR ai.description ILIKE $1
     OR t.specialty ILIKE $1
     OR t.experience::text ILIKE $1
     OR EXISTS (
         SELECT 1 FROM unnest(string_to_array(t.tag_list, ', ')) AS tag
         WHERE tag ILIKE $1
     );
`;

const result = await pool.query(query, [`%${searchTerm}%`]);
    // Retornando os resultados
    res.status(200).json(result.rows);  // `result.rows` contém os registros retornados pela query
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar artistas de tatuagem' });
  }
}

export default {
  create,
  update,
  remove,
  list,
};
