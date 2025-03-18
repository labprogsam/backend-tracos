

// routes/index.js
import usersRoutes from './usersRoutes.js';  // Importa as rotas do arquivo usuarioRoute.js
import TasksRoute from './taskRoute.js';       // Importa as rotas do arquivo taskRoute.js

// Exporta as rotas para que possam ser usadas em outros arquivos
export { TasksRoute, usersRoutes };