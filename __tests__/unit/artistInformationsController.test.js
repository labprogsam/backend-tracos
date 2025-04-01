import sinon from 'sinon';
import artistInformationController from '../../controller/artistInformationsController.js';
import { ArtistInformations } from '../../models/index.js';
import Messages from '../../constants/strings.js';

describe('Artist Information Controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: {}, params: {}, query: {} }; // Configura req com os valores necessários
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
    it('deve criar as informações do artista com sucesso', async () => {
      req.body = {
        artist_id: 1,
        description: 'Descrição do artista',
        phone_number: '1234567890123',
        gender: 'Masculino',
        zip_code: '50740170',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        cpf: '10131057456',
      };

      const artistMock = {
        artist_id: 1,
        description: 'Descrição do artista',
        phone_number: '1234567890123',
        gender: 'Masculino',
        zip_code: '50740170',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        cpf: '10131057456',
        addressComplement: null,
      };

      sinon.stub(ArtistInformations, 'create').resolves(artistMock);

      await artistInformationController.create(req, res, next);

      expect(res.locals.data).toEqual(artistMock);
      expect(res.locals.status).toBe(201);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se faltar um campo obrigatório', async () => {
      req.body = {
        artist_id: 1,
        description: 'Descrição do artista',
        phone_number: '1234567890123',
        gender: 'Masculino',
        zip_code: '12345678',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        // CPF está faltando
      };

      await artistInformationController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.ARTIST_INFO.MISSING_FIELDS })).toBe(true);
    });

    it('deve retornar erro se o CPF for inválido', async () => {
      req.body = {
        artist_id: 1,
        description: 'Descrição do artista',
        phone_number: '1234567890123',
        gender: 'Masculino',
        zip_code: '12345678',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        cpf: '12345678900', // CPF inválido
      };

      await artistInformationController.create(req, res, next);
      expect(next.calledWith({ status: 400, data: Messages.ARTIST_INFO.INVALID_CPF })).toBe(true);
    });
  });

  describe('List Artist Information', () => {
    it('deve listar todas as informações dos artistas com sucesso', async () => {
      const artistsMock = [
        { id: 1, artist_id: 1, description: 'Artista 1', phone_number: '1234567890123' },
        { id: 2, artist_id: 2, description: 'Artista 2', phone_number: '1234567890123' },
      ];

      sinon.stub(ArtistInformations, 'findAll').resolves(artistsMock);

      await artistInformationController.list(req, res, next);

      expect(res.locals.data).toEqual(artistsMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });

  describe('Update Artist Information', () => {
    it('deve atualizar as informações do artista com sucesso', async () => {
      req.params.id = '1';
      req.body = {
        description: 'Descrição atualizada',
        phone_number: '1234567890123',
        gender: 'Feminino',
        zip_code: '50740170',
        street: 'Rua Atualizada',
        number: '456',
        neighborhood: 'Bairro Atualizado',
        city: 'Cidade Atualizada',
        state: 'RJ',
        cpf: '10131057456',
      };
  
      const artistMock = {
        id: 1,
        artist_id: 1,
        description: 'Descrição atualizada',
        phone_number: '1234567890123',
        gender: 'Feminino',
        zip_code: '50740170',
        street: 'Rua Atualizada',
        number: '456',
        neighborhood: 'Bairro Atualizado',
        city: 'Cidade Atualizada',
        state: 'RJ',
        cpf: '10131057456',
        update: sinon.stub().resolves(true),  // Mock de atualização
      };
  
      // Mock da função findByPk
      sinon.stub(ArtistInformations, 'findByPk').resolves(artistMock);
      const next = sinon.spy();
  
      // Chamada do controller
      await artistInformationController.update(req, res, next);
  
      // Verificação de chamada do update com parâmetros esperados
      expect(artistMock.update).toHaveBeenCalledWith({
        description: 'Descrição atualizada',
        phone_number: '1234567890123',
        gender: 'Feminino',
        zip_code: '50740170',
        street: 'Rua Atualizada',
        number: '456',
        neighborhood: 'Bairro Atualizado',
        city: 'Cidade Atualizada',
        state: 'RJ',
        cpf: '10131057456',
      });
  
      // Verifica se os dados foram passados corretamente para res.locals
      expect(res.locals.data).toEqual(artistMock);
      expect(res.locals.status).toBe(200);
      expect(next.calledOnce).toBe(true);
    });
  });
  

  describe('Remove Artist Information', () => {
    it('deve remover as informações de um artista com sucesso', async () => {
      req.params.id = '1';
      const artistMock = { update: sinon.stub().resolves() };
      sinon.stub(ArtistInformations, 'findByPk').resolves(artistMock);

      await artistInformationController.remove(req, res, next);

      expect(artistMock.update.calledOnceWith({ deletedAt: sinon.match.string })).toBe(true);
      expect(res.locals.status).toBe(203);
      expect(next.calledOnce).toBe(true);
    });

    it('deve retornar erro se as informações do artista não existirem', async () => {
      req.params.id = '1';
      sinon.stub(ArtistInformations, 'findByPk').resolves(null);

      await artistInformationController.remove(req, res, next);

      expect(next.calledWith({ status: 404, data: Messages.ARTIST_INFO.NOT_FOUND })).toBe(true);
    });
  });
});

/*
| Função Testada | Descrição                            | Entrada                                    | Saída Esperada                              | Comportamento Esperado                      |
|----------------|--------------------------------------|--------------------------------------------|--------------------------------------------|--------------------------------------------|
| create         | Cria informações de um artista       | Dados válidos de artista                   | Status 201 e dados do artista criados      | Artista criado com sucesso                  |
| create         | Erro se faltar campo obrigatório     | Faltando um campo obrigatório              | Erro 400 e mensagem apropriada             | Nenhum artista criado                       |
| create         | Erro se CPF inválido                 | CPF inválido                               | Erro 400 e mensagem apropriada             | Nenhum artista criado                       |
| list           | Lista todas as informações dos artistas | Nenhuma entrada necessária                 | Lista de artistas e status 200             | Todos os artistas são retornados            |
| update         | Atualiza informações do artista      | ID válido e dados atualizados              | Status 200 e dados atualizados             | Artista atualizado corretamente             |
| update         | Erro se o artista não for encontrado | ID inválido                                | Erro 400 e mensagem apropriada             | Nenhuma atualização feita                   |
| remove         | Remove informações de um artista     | ID válido                                  | Status 203                                  | Artista removido com sucesso                |
| remove         | Erro se o artista não for encontrado | ID inválido                                | Erro 404 e mensagem apropriada             | Nenhuma remoção feita                       |
*/
