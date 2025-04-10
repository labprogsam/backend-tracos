export default {
    wrongEmail: 'Wrong Email',
    missingToken: 'Missing Token',
    missingToken: 'Missing Token',
    notFound: 'Not Found',
    userNotFound: 'User Not Found',
    userDisabled: 'User Disabled',
    wrongPassword: 'Wrong Password',
    confirmPassword: 'Password and password confirmation do not match',
    userNotFound: "User not found",
    invalidType: "Invalid type. Try 'TATUADOR' or 'CLIENTE'",
    internalError: "Internal server error",
    expiredToken: "Expired token",
    invalidToken: "Invalid token",
    forbidden: 'Forbidden',
    recoveryTokenInvalid: 'Recovery token invalid',
    passwordChanged: 'password changed successfully',
    emailAlreadyExists: "Já existe um usuário com este e-mail.",
    cpfAlreadyExists: "Já existe um usuário com este CPF.",

    ARTIST_INFO: {
        MISSING_FIELDS: "Todos os campos obrigatórios devem ser preenchidos.",
        INVALID_CPF: "O CPF informado é inválido.",
        INVALID_ZIP_CODE: "O CEP informado é inválido. Deve conter 8 dígitos numéricos.",
        INVALID_PHONE: "O número de telefone deve conter 13 dígitos (DDI + DDD + número).",
        NOT_FOUND: "Informações do tatuador não encontradas.",
      },
      BOOKINGS: {
        NOT_FOUND: "Reserva não encontrada.",
        FORBIDDEN_UPDATE: "Você não tem permissão para modificar esta reserva.", 
        UPDATE_SUCCESS: "Reserva atualizada com sucesso.", 
        DELETE_SUCCESS: "Reserva excluída com sucesso.", 
        CREATE_SUCCESS: "Reserva criada com sucesso.", 
        INVALID_CUSTOMER: "O cliente não é válido ou não existe.",
        INVALID_ARTIST: "O tatuador não é válido ou não existe.", 
        INVALID_DATE: "A data e hora fornecidas não são válidas.", 
        INVALID_TAGS: "A lista de tags fornecida contém valores inválidos.", 
        REQUIRED_FIELDS: "Os campos 'customer_id' e 'artist_id' são obrigatórios.",
        ARTIST_REQUIRED: "O ID do tatuador é obrigatório.",
        CUSTOMER_REQUIRED: "O ID do cliente é obrigatório.",
        AGE_REQUIRED: "A idade é obrigatória.",
        DATE_REQUIRED: "A data sugerida é obrigatória.",
        NOT_FOUND: "Reserva não encontrada.",
        DELETED_SUCCESS: "Reserva deletada com sucesso.",
        INVALID_STATUS: "Status inválido." ,
        MISSING_FIELDS: "Campos obrigatórios, não preenchidos",
        AUTHORIZATION_REQUIRED: 'Menores de idade devem fornecer autorização.',
        
      },
      TATTOO_ARTISTS: {
        NOT_FOUND: "Tatuador não encontrado.",
        REMOVE_SUCCESS: "Tatuador removido com sucesso.", 
        CREATE_SUCCESS: "Tatuador criado com sucesso.", 
        UPDATE_SUCCESS: "Tatuador atualizado com sucesso.", 
        INVALID_USER: "O usuário informado não existe ou não é válido.", 
        SEARCH_REQUIRED: "É necessário fornecer um parâmetro de pesquisa para realizar a busca.",
      },
      NOTIFICATIONS: {
        TITLE_REQUIRED: 'O título da notificação é obrigatório.',
        NOT_FOUND: 'Notificação não encontrada.',
        SUCCESS_CREATED: 'Notificação criada com sucesso.',
        SUCCESS_UPDATED: 'Notificação atualizada com sucesso.',
        SUCCESS_DELETED: 'Notificação deletada com sucesso.',
        USER_ID_REQUIRED: 'O user_id é obrigatório para listar notificações.',
        NO_NOTIFICATIONS_FOUND: 'Nenhuma notificação encontrada para este usuário.',
      },
      CUSTOMERS: {
        NOT_FOUND: "Cliente não encontrado.",
        CREATED_SUCCESS: "Cliente criado com sucesso.",
        UPDATED_SUCCESS: "Cliente atualizado com sucesso.",
        DELETED_SUCCESS: "Cliente deletado com sucesso.",
        USER_ID_REQUIRED: "O campo 'user_id' é obrigatório.",
        USER_ID_NOT_FOUND: "O 'user_id' informado não existe.",
      },
      TAGS: {
        NOT_FOUND: "Tag não encontrada.",
        CREATED_SUCCESS: "Tag criada com sucesso.",
        UPDATED_SUCCESS: "Tag atualizada com sucesso.",
        DELETED_SUCCESS: "Tag deletada com sucesso.",
        NAME_REQUIRED: "O campo 'name' é obrigatório.",
        DESCRIPTION_REQUIRED: "O campo 'description' é obrigatório.",
      },
      REPORTS: {
        NOT_FOUND: "Relatório não encontrado.",
        CREATED_SUCCESS: "Relatório criado com sucesso.",
        UPDATED_SUCCESS: "Relatório atualizado com sucesso.",
        DELETED_SUCCESS: "Relatório deletado com sucesso.",
        TITLE_REQUIRED: "O campo 'title' é obrigatório.",
        DESCRIPTION_REQUIRED: "O campo 'description' é obrigatório.",
        USER_ID_REQUIRED: "O campo 'user_id' é obrigatório.",
      },
      IMAGES: {
        NOT_FOUND: "Imagem não encontrada.",
        CREATED_SUCCESS: "Imagem criada com sucesso.",
        UPDATED_SUCCESS: "Imagem atualizada com sucesso.",
        DELETED_SUCCESS: "Imagem deletada com sucesso.",
        URL_REQUIRED: "A URL da imagem é obrigatória.",
        ARTIST_ID_REQUIRED: "O campo 'artist_id' é obrigatório.",
        INVALID_FILE: "Arquivo inválido. Por favor, envie uma imagem.",
      },
};
  