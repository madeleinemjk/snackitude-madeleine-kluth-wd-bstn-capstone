const dbConfig = require('../config/db.config');

// Initialise sequelize context, set up config
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add models
db.snackRequests = require('./snack-request.model')(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);
db.reviews = require('./review.model')(sequelize, Sequelize);
db.messages = require('./message.model')(sequelize, Sequelize);

// Add relationships
db.snackRequests.Messages = db.snackRequests.hasMany(db.messages, { as: 'messages' });
db.messages.User = db.messages.belongsTo(db.users, {as: 'sendingUser' });

db.snackRequests.DeliveringUser = db.snackRequests.belongsTo(db.users, { as: 'deliveringUser' });
db.snackRequests.RequestingUser = db.snackRequests.belongsTo(db.users, { as: 'requestingUser' });

db.users.Reviews = db.users.hasMany(db.reviews, { as: 'reviews', foreignKey: 'userId' });
db.reviews.Reviewer = db.reviews.belongsTo(db.users, { as: 'reviewer', foreignKey: 'reviewerId' });

// Export! Yay
module.exports = db;