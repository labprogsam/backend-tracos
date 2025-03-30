import jwt from 'jsonwebtoken';
import messages from '../constants/strings.js';
import { TattooArtists } from '../models/index.js';
import 'dotenv/config';

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
    res.locals.message = messages.TATTOO_ARTISTS.REMOVE_SUCCESS; // Mensagem de sucesso

    return next();
  } catch (err) {
    next(err);
  }
};

//A pesquisa será feita nos campos name, tag_list, specialty, e experience. e por enquanto só tá retornando o id do tatuador, dps vai poder retornar as imagens dele.
const list = async (req, res, next) => {
    try {
      const { search } = req.query;  // Pegando o parâmetro de pesquisa da query string
  
      if (!search) {
        return next({ status: 400, data: messages.TATTOO_ARTISTS.SEARCH_REQUIRED });
      }
  
      // Filtros de pesquisa
      const artists = await TattooArtists.findAll({
        include: [
          {
            model: Users,  // Inclui a tabela de Users para buscar pelo nome
            where: {
              name: {
                [Sequelize.Op.iLike]: `%${search}%`,  // Pesquisa no nome do tatuador
              },
            },
          },
        ],
        where: {
          [Sequelize.Op.or]: [
            { specialty: { [Sequelize.Op.iLike]: `%${search}%` } },  // Pesquisa na especialidade
            { experience: { [Sequelize.Op.iLike]: `%${search}%` } },  // Pesquisa na experiência
            { tag_list: { [Sequelize.Op.contains]: [search] } },  // Pesquisa nas tags (caso a tag seja uma string simples)
          ],
        },
        attributes: ['id'],  // Retorna apenas os IDs dos tatuadores
      });
  
      if (artists.length === 0) {
        return next({ status: 404, data: messages.TATTOO_ARTISTS.NOT_FOUND });
      }
  
      // Retorna os IDs dos tatuadores que atendem ao critério de pesquisa
      res.locals.data = artists.map((artist) => artist.id);
      res.locals.status = 200;
  
      return next();
    } catch (err) {
      return next(err);
    }
  };
  
export default {
  create,
  update,
  remove,
  list,
};
