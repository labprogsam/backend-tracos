import express from 'express';
import { TasksRoute, usuarioRoute } from './routes/index.js'; // Importa as rotas corretamente
import sequelize from './config/database.js'; // Verifica se sua conexão com o banco está correta

const app = express();

app.use(express.json()); // Permite o uso de JSON no corpo das requisições

// Define as rotas
app.use('/api', TasksRoute);
app.use('/api', usuarioRoute);

// Teste de conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => console.log('Connection to the database established successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Inicia o servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
