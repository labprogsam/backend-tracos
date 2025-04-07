import messages from '../constants/strings.js';
import { ArtistInformations } from '../models/index.js';
import 'dotenv/config';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import validator from 'validator';
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função auxiliar para upload
const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.v2.uploader.upload(filePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return result.secure_url;
};

// Validações comuns
const validateCommonFields = (body) => {
  const {
    zip_code,
    street,
    number,
    neighborhood,
    city,
    state,
    cpf,
    rg,
    phone_number,
  } = body;

  if (!zip_code || !street || !number || !neighborhood || !city || !state || !cpf || !rg) {
    return messages.ARTIST_INFO.MISSING_FIELDS;
  }

  if (!cpfValidator.isValid(cpf)) {
    return messages.ARTIST_INFO.INVALID_CPF;
  }

  if (!validator.isPostalCode(zip_code, 'BR')) {
    return messages.ARTIST_INFO.INVALID_ZIP_CODE;
  }

  if (!validator.isLength(phone_number, { min: 13, max: 13 }) || !validator.isNumeric(phone_number)) {
    return messages.ARTIST_INFO.INVALID_PHONE;
  }

  return null;
};

const create = async (req, res, next) => {
 

  try {
    const {
      artist_id,
      description,
      phone_number,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      rg,
      orgao_emissor,
      about_you,
      addressComplement,
    } = req.body;

    const files = req.files;

    const validationError = validateCommonFields(req.body);
    if (validationError) return next({ status: 400, data: validationError });

    if (!files || !files.identity_photos || files.identity_photos.length !== 2) {
      return next({ status: 400, data: 'É necessário enviar duas fotos de identidade.' });
    }

    if (!files.residency_proof || files.residency_proof.length !== 1) {
      return next({ status: 400, data: 'É necessário enviar uma foto do comprovante de residência.' });
    }

    const identityPhotosUrls = await Promise.all(
      files.identity_photos.map((file) => uploadToCloudinary(file.path))
    );

    const residencyProofUrl = await uploadToCloudinary(files.residency_proof[0].path);

    const artistInfo = await ArtistInformations.create({
      artist_id,
      description,
      phone_number,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      rg,
      orgao_emissor,
      about_you,
      addressComplement,
      identity_photos_url: JSON.stringify(identityPhotosUrls),
      residency_proof_url: residencyProofUrl,
    });

    res.locals.status = 201;
    res.locals.data = artistInfo;
    return next();
  } catch (err) {
  
    return next(err);
  }
};


const update = async (req, res, next) => {
  try {
    const {
      artist_id,
      description,
      phone_number,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      rg,
      orgao_emissor,
      about_you,
      addressComplement,
    } = req.body;

    const { id } = req.params;
    const files = req.files;

    // Validação de campos obrigatórios
    const validationError = validateCommonFields(req.body);
    if (validationError) return next({ status: 400, data: validationError });

    // Validação de arquivos obrigatórios (2 identidades, 1 comprovante de residência)
    if (!files || !files.identity_photos || files.identity_photos.length !== 2) {
      return next({ status: 400, data: 'É necessário enviar duas fotos de identidade.' });
    }

    if (!files.residency_proof || files.residency_proof.length !== 1) {
      return next({ status: 400, data: 'É necessário enviar uma foto do comprovante de residência.' });
    }

    // Upload dos arquivos
    const identityPhotosUrls = await Promise.all(
      files.identity_photos.map((file) => uploadToCloudinary(file.path))
    );

    const residencyProofUrl = await uploadToCloudinary(files.residency_proof[0].path);

    const updateData = {
      artist_id,
      description,
      phone_number,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      rg,
      orgao_emissor,
      about_you,
      addressComplement,
      identity_photos_url: JSON.stringify(identityPhotosUrls),
      residency_proof_url: residencyProofUrl,
    };

    const [updated] = await ArtistInformations.update(updateData, { where: { id } });

    if (!updated) {
      return next({ status: 404, data: messages.ARTIST_INFO.NOT_FOUND });
    }

    const updatedInfo = await ArtistInformations.findByPk(id);
    res.locals.status = 200;
    res.locals.data = updatedInfo;
    return next();
  } catch (err) {
   
    return next(err);
  }
};


const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ArtistInformations.destroy({ where: { id } });

    if (!deleted) {
      return next({ status: 404, data: messages.ARTIST_INFO.NOT_FOUND });
    }

    res.locals.status = 200;
    res.locals.data = { message: messages.ARTIST_INFO.DELETED };
    return next();
  } catch (err) {
   
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const all = await ArtistInformations.findAll();
    res.locals.status = 200;
    res.locals.data = all;
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
