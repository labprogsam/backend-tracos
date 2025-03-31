import { Images } from '../models/index.js';
import cloudinary from 'cloudinary';
import messages from '../constants/strings.js';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create = async (req, res, next) => {
  try {
    const { artist_id, description, tags, portfolio_index, is_featured } = req.body;
    const imageFile = req.file;
    // Validações
    if (!artist_id) return next({ status: 400, data: messages.IMAGES.ARTIST_ID_REQUIRED });
    if (!imageFile) return next({ status: 400, data: messages.IMAGES.INVALID_FILE });

    // Enviar imagem para o Cloudinary
    const result = await cloudinary.v2.uploader.upload(imageFile.path);

    // Criar imagem no banco com a URL do Cloudinary
    const image = await Images.create({
      artist_id,
      url: result.secure_url, // Link da imagem armazenada
      description,
      tags,
      portfolio_index,
      is_featured,
    });

    // Remover a imagem local após o upload
    fs.unlinkSync(imageFile.path);

    res.locals.data = image;
    res.locals.status = 201;
    return next();
  } catch (err) {
    console.error("Erro ao enviar imagem:", err);
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, tags, portfolio_index, is_featured } = req.body;
    const imageFile = req.file;

    const image = await Images.findByPk(id);
    if (!image) return next({ status: 400, data: messages.IMAGES.NOT_FOUND });

    let imageUrl = image.url;

    // Se uma nova imagem for enviada, enviar para o Cloudinary
    if (imageFile) {
      cloudinary.uploader.upload(imageFile.path, async (result) => {
        imageUrl = result.secure_url;
        // Remover a imagem local após o upload
        fs.unlinkSync(imageFile.path);

        // Atualizar a imagem no banco de dados
        const updatedImage = await image.update({
          description,
          tags,
          portfolio_index,
          is_featured,
          url: imageUrl,
        });

        res.locals.data = updatedImage;
        res.locals.status = 200;

        return next();
      });
    } else {
      // Se não houver nova imagem, apenas atualize os outros campos
      const updatedImage = await image.update({
        description,
        tags,
        portfolio_index,
        is_featured,
      });

      res.locals.data = updatedImage;
      res.locals.status = 200;

      return next();
    }
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Images.findByPk(id);
    if (!image) return next({ status: 400, data: messages.IMAGES.NOT_FOUND });

    // Deletar a imagem do banco de dados
    await image.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 204;
    res.locals.data = { message: messages.IMAGES.DELETED_SUCCESS };

    return next();
  } catch (err) {
    console.error("Erro ao criar imagem:", err);
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { artist_id } = req.query; // Pega o artist_id da query string (Ex: /images?artist_id=1)

    const whereClause = {
      deletedAt: null,
    };

    if (artist_id) {
      whereClause.artist_id = artist_id; // Filtra pelo artist_id se for passado
    }

    const images = await Images.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.locals.data = images;
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
