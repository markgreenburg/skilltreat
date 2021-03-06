/**
 * Database configuration and initialization
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const pathToConfig = path.join(__dirname, '..', 'config', 'sequelizeConfig.json');
const config = require(pathToConfig)[env];

const sequelize = (process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, config)
  : new Sequelize(config.database, config.username, config.password, config)
);

const db = {};
// Import all models from models directory
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// Add imported models to the db instance
Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) { db[modelName].associate(db); }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* Define model relationships */
db.user.belongsToMany(db.elective, { through: 'electives_users' });
db.elective.belongsToMany(db.user, { through: 'electives_users' });
db.order.belongsToMany(db.elective, {
  through: { model: db.electives_orders, unique: false },
});
db.elective.belongsToMany(db.order, {
  through: { model: db.electives_orders, unique: false },
});
db.cart.belongsTo(db.user);
db.cart.belongsTo(db.elective);
db.order.belongsTo(db.user);
db.token.belongsTo(db.user);
db.elective.belongsTo(db.venue);

module.exports = db;
