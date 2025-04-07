import sinon from 'sinon';
import artistInformationController from '../../controller/artistInformationsController.js';
import { ArtistInformations } from '../../models/index.js';
import messages from '../../constants/strings.js';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import validator from 'validator';
import cloudinary from 'cloudinary';
import fs from 'fs';

describe('Artist Information Controller - Novo', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, files: {} };
    res = {
      locals: {},
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Create Artist Information', () => {
    it('deve criar uma informação de artista com sucesso com upload de arquivos', async () => {
      req.body = {
        artist_id: 1,
        description: 'Artista experiente',
        phone_number: '5511999999999',
        gender: 'Masculino',
        zip_code: '01001000',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '12345678909',
        rg: '1234567',
        orgao_emissor: 'SSP',
        about_you: 'Informações sobre você',
      };

      req.files = {
        identity_photos: [
          { path: 'path/to/identity1.jpg' },
          { path: 'path/to/identity2.jpg' },
        ],
        residency_proof: [
          { path: 'path/to/residency.jpg' },
        ],
      };

      // Stubs para validações
      sinon.stub(cpfValidator, 'isValid').returns(true);
      sinon.stub(validator, 'isPostalCode').returns(true);
      sinon.stub(validator, 'isLength').returns(true);
      sinon.stub(validator, 'isNumeric').returns(true);

      // Stubs para cloudinary e fs
      sinon.stub(cloudinary.v2.uploader, 'upload')
        .onFirstCall().resolves({ secure_url: 'https://cloudinary.com/identity1.jpg' })
        .onSecondCall().resolves({ secure_url: 'https://cloudinary.com/identity2.jpg' })
        .onThirdCall().resolves({ secure_url: 'https://cloudinary.com/residency.jpg' });

      sinon.stub(fs, 'unlinkSync'); // Evita deletar arquivos reais

      const createdMock = {
        id: 1,
        ...req.body,
        identity_photos_url: JSON.stringify([
          'https://cloudinary.com/identity1.jpg',
          'https://cloudinary.com/identity2.jpg',
        ]),
        residency_proof_url: 'https://cloudinary.com/residency.jpg',
      };

      sinon.stub(ArtistInformations, 'create').resolves(createdMock);

      await artistInformationController.create(req, res, next);

      expect(res.locals.data).toEqual(createdMock);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se faltar alguma das fotos obrigatórias', async () => {
      req.body = {
        zip_code: '01001000',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '12345678909',
        rg: '1234567',
        phone_number: '5511999999999',
      };

      req.files = {
        identity_photos: [{ path: 'path/to/only_one.jpg' }], // apenas 1 foto
        residency_proof: [{ path: 'path/to/residency.jpg' }],
      };

      sinon.stub(cpfValidator, 'isValid').returns(true);
      sinon.stub(validator, 'isPostalCode').returns(true);
      sinon.stub(validator, 'isLength').returns(true);
      sinon.stub(validator, 'isNumeric').returns(true);

      await artistInformationController.create(req, res, next);

      expect(next.calledWithMatch({ status: 400, data: 'É necessário enviar duas fotos de identidade.' })).toBe(true);
    });

    it('deve retornar erro se o CPF for inválido', async () => {
      req.body = {
        zip_code: '01001000',
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '00000000000',
        rg: '1234567',
        phone_number: '5511999999999',
      };

      sinon.stub(cpfValidator, 'isValid').returns(false);

      await artistInformationController.create(req, res, next);

      expect(next.calledWithMatch({ status: 400, data: messages.ARTIST_INFO.INVALID_CPF })).toBe(true);
    });
  });

  describe('Update Artist Information', () => {
    it('deve atualizar uma informação de artista com sucesso', async () => {
      req.params.id = 1;
      req.body = {
        artist_id: 2,
        description: 'Atualizado',
        phone_number: '5511988888888',
        zip_code: '12345678',
        street: 'Nova Rua',
        number: '456',
        neighborhood: 'Bairro Novo',
        city: 'Rio de Janeiro',
        state: 'RJ',
        cpf: '98765432100',
        rg: '7654321',
        orgao_emissor: 'SSP-RJ',
        about_you: 'Atualização sobre você',
      };
      req.files = {
        identity_photos: [
          { path: 'path/to/identity1.jpg' },
          { path: 'path/to/identity2.jpg' },
        ],
        residency_proof: [
          { path: 'path/to/residency.jpg' },
        ],
      };
  
      // Stubs de validação
      sinon.stub(cpfValidator, 'isValid').returns(true);
      sinon.stub(validator, 'isPostalCode').returns(true);
      sinon.stub(validator, 'isLength').returns(true);
      sinon.stub(validator, 'isNumeric').returns(true);
      // Upload e unlink
      sinon.stub(cloudinary.v2.uploader, 'upload')
        .onFirstCall().resolves({ secure_url: 'https://cloudinary.com/identity1-updated.jpg' })
        .onSecondCall().resolves({ secure_url: 'https://cloudinary.com/identity2-updated.jpg' })
        .onThirdCall().resolves({ secure_url: 'https://cloudinary.com/residency-updated.jpg' });
  
      sinon.stub(fs, 'unlinkSync');
  
      const updatedMock = {
        id: 1,
        ...req.body,
        identity_photos_url: JSON.stringify([
          'https://cloudinary.com/identity1-updated.jpg',
          'https://cloudinary.com/identity2-updated.jpg',
        ]),
        residency_proof_url: 'https://cloudinary.com/residency-updated.jpg',
      };
  
      const updateStub = sinon.stub(ArtistInformations, 'update').resolves([1]);
      const findStub = sinon.stub(ArtistInformations, 'findByPk').resolves(updatedMock);
  
      await artistInformationController.update(req, res, next);
  
      expect(updateStub.calledOnce).toBe(true);
      expect(res.locals.data).toEqual(updatedMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  
    it('deve retornar erro se CPF inválido no update', async () => {
      req.params.id = 1;
      req.body = {
        artist_id: 1,
        description: 'Teste',
        phone_number: '1199999999999',
        zip_code: '01001-000',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cpf: '10131057457', // inválido
        rg: '12345678',
        orgao_emissor: 'SSP',
        about_you: 'Algo sobre mim',
      };
    
      sinon.stub(cpfValidator, 'isValid').returns(false);
    
      await artistInformationController.update(req, res, next);
    
      expect(next.calledWithMatch({ status: 400, data: messages.ARTIST_INFO.INVALID_CPF })).toBe(true);
    
      cpfValidator.isValid.restore(); // limpa o stub depois do teste
    });
    
  });
  
  describe('Remove Artist Information', () => {
    it('deve remover uma informação de artista com sucesso', async () => {
      req.params.id = 1;
      sinon.stub(ArtistInformations, 'destroy').resolves(1); // 1 linha removida
  
      await artistInformationController.remove(req, res, next);
  
      expect(res.locals.status).toBe(200);
      expect(res.locals.data).toEqual({ message: messages.ARTIST_INFO.DELETED });
      expect(next.calledOnce).toBe(true);
    });
  
    it('deve retornar erro se o ID não existir', async () => {
      req.params.id = 999;
      sinon.stub(ArtistInformations, 'destroy').resolves(0); // Nada removido
  
      await artistInformationController.remove(req, res, next);
  
      expect(next.calledWithMatch({ status: 404, data: messages.ARTIST_INFO.NOT_FOUND })).toBe(true);
    });
  });
  
  describe('List Artist Informations', () => {
    it('deve listar todas as informações de artistas', async () => {
      const listMock = [
        { id: 1, artist_id: 1, description: 'Artista 1' },
        { id: 2, artist_id: 2, description: 'Artista 2' },
      ];
  
      sinon.stub(ArtistInformations, 'findAll').resolves(listMock);
  
      await artistInformationController.list(req, res, next);
  
      expect(res.locals.status).toBe(200);
      expect(res.locals.data).toEqual(listMock);
      expect(next.calledOnce).toBe(true);
    });
  });
  
});
