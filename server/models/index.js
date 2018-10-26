import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '/config/config.js';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';


const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config[env]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config[env]
  );
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
