// controllers/artistInformationController.js
import messages from '../constants/strings.js';
import { ArtistInformations } from '../models/index.js';
import 'dotenv/config';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import validator from 'validator';

const create = async (req, res, next) => {
  try {
    const {
      artist_id,
      description,
      phone_number,
      gender,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      addressComplement // Campo opcional
    } = req.body;

    // Verifica se os campos obrigatórios não estão vazios
    if (!gender || !zip_code || !street || !number || !neighborhood || !city || !state || !cpf) {
      return next({ status: 400, data: messages.ARTIST_INFO.MISSING_FIELDS });
    }

    // Validação de CPF
    if (!cpfValidator.isValid(cpf)) {
      return next({ status: 400, data: messages.ARTIST_INFO.INVALID_CPF });
    }

    // Validação de CEP (deve ter 8 dígitos numéricos)
    if (!validator.isPostalCode(zip_code, 'BR')) {
      return next({ status: 400, data: messages.ARTIST_INFO.INVALID_ZIP_CODE });
    }

    // Validação do número de telefone (deve ter 13 caracteres, incluindo DDI + DDD + número)
    if (!validator.isLength(phone_number, { min: 13, max: 13 }) || !validator.isNumeric(phone_number)) {
      return next({ status: 400, data: messages.ARTIST_INFO.INVALID_PHONE });
    }

    // Criando registro no banco de dados
    const artistInfo = await ArtistInformations.create({
      artist_id,
      description,
      phone_number,
      gender,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      addressComplement // Pode ser undefined, pois é opcional
    });

    res.locals.data = artistInfo;
    res.locals.status = 201;
    return next();
  } catch (err) {
    console.error("Erro ao criar ArtistInformation:", err);
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const artistInfos = await ArtistInformations.findAll();
    res.locals.data = artistInfos;
    res.locals.status = 200;
    return next();
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loggedUser = res.locals.USER;
    const {
      description,
      phone_number,
      gender,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      addressComplement // Campo opcional
    } = req.body;

    // Verifica se os campos obrigatórios não estão vazios (não inclui campos opcionais como addressComplement)
    if (!gender || !zip_code || !street || !number || !neighborhood || !city || !state || !cpf) {
      return next({ status: 400, data: messages.ARTIST_INFO.MISSING_FIELDS });
    }

    // Validação de CPF
    if (!cpfValidator.isValid(cpf)) {
      return next({ status: 400, data: messages.ARTIST_INFO.INVALID_CPF });
    }

    // Validação de CEP (deve ter 8 dígitos numéricos)
    if (!validator.isPostalCode(zip_code, 'BR')) {
      return next({ status: 400, data: messages.ARTIST_INFO.INVALID_ZIP_CODE });
    }

    // Validação do número de telefone (deve ter 13 caracteres, incluindo DDI + DDD + número)
    if (phone_number && (!validator.isLength(phone_number, { min: 13, max: 13 }) || !validator.isNumeric(phone_number))) {
      return next({ status: 400, data: messages.ARTIST_INFO.INVALID_PHONE });
    }

    // Verifica se o registro existe
    const artistInfo = await ArtistInformations.findByPk(id);
    if (!artistInfo) return next({ status: 400, data: messages.ARTIST_INFO.NOT_FOUND });

   

    // Atualiza o registro com as novas informações
    await artistInfo.update({
      description,
      phone_number,
      gender,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
      cpf,
      addressComplement // Pode ser undefined, pois é opcional
    });

    res.locals.data = artistInfo;
    res.locals.status = 200;

    return next();
  } catch (err) {
    console.error("Erro ao atualizar ArtistInformation:", err);
    return next(err);
  }
};


const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artistInfo = await ArtistInformations.findByPk(id);
    if (!artistInfo) return next({ status: 404, data: messages.ARTIST_INFO.NOT_FOUND });

    await artistInfo.update({ deletedAt: new Date().toISOString() });
    res.locals.status = 204;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default {
  create,
  list,
  update,
  remove,
};

