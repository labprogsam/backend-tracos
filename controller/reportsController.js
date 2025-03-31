import { Reports } from '../models/index.js';
import messages from '../constants/strings.js';
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create = async (req, res, next) => {
  try {
    const { user_id, title, description } = req.body;
    const files = req.files; // Recebe múltiplos arquivos
    console.log(user_id)
    // Validações
    if (!user_id) return next({ status: 400, data: messages.REPORTS.USER_ID_REQUIRED });
    if (!title) return next({ status: 400, data: messages.REPORTS.TITLE_REQUIRED });
    if (!description) return next({ status: 400, data: messages.REPORTS.DESCRIPTION_REQUIRED });

    // Upload dos arquivos para o Cloudinary
    const uploadPromises = files.map(async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.path);
      fs.unlinkSync(file.path); // Remove o arquivo local após o upload
      return result.secure_url; // Retorna a URL do arquivo no Cloudinary
    });

    const uploadedFiles = await Promise.all(uploadPromises); // Espera todos os uploads

    // Criar o report no banco
    const report = await Reports.create({
      user_id,
      title,
      description,
      files: JSON.stringify(uploadedFiles), // Salva as URLs como JSON no banco
    });

    res.locals.data = report;
    res.locals.status = 201;

    return next();
  } catch (err) {
    console.error("Erro ao enviar arquivos:", err);
    return next(err);
  }
};



const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, files } = req.body;

    const report = await Reports.findByPk(id);
    if (!report) return next({ status: 400, data: messages.REPORTS.NOT_FOUND });

    // Validações
    if (!title) return next({ status: 400, data: messages.REPORTS.TITLE_REQUIRED });
    if (!description) return next({ status: 400, data: messages.REPORTS.DESCRIPTION_REQUIRED });

    const updatedReport = await report.update({
      title,
      description,
      files,
    });

    res.locals.data = updatedReport;
    res.locals.status = 200;

    return next();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await Reports.findByPk(id);
    if (!report) return next({ status: 400, data: messages.REPORTS.NOT_FOUND });

    await report.update({ deletedAt: new Date().toISOString() });

    res.locals.status = 204;
    res.locals.data = { message: messages.REPORTS.DELETED_SUCCESS };

    return next();
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const reports = await Reports.findAll({
      where: {
        deletedAt: null,
      },
      order: [['createdAt', 'DESC']],
    });

    res.locals.data = reports;
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
