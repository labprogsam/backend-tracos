import express from 'express';
import { TasksRoute, usersRoutes } from './routes/index.js'; // Importa as rotas
import sequelize from './database/index.js';

const app = express();

app.use(express.json()); // Permite o uso de JSON no corpo das requisições

// Define as rotas
app.use('/api/tasks', TasksRoute);  // Para as tarefas
app.use('/api', usersRoutes);      // Para os usuários

// Conexão com o banco
sequelize
  .authenticate()
  .then(() => console.log('Connection to the database established successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});