import Sequelize from 'sequelize';
import dbConfig from './config.js';
import * as models from '../models/index.js';

const connection = new Sequelize(dbConfig);

Object.values(models).forEach((model) => {
  model.init(connection);
});

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

export default connection;
