const bcrypt = require('bcrypt-nodejs');

// Model for a user
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            },
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        }
    });

    // Makes sure that the password is hashed before saving it
    User.beforeSave((user, options) => {
        if (user.changed('password'))
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    // Function for comparing password hashes for sign-in
    User.prototype.comparePassword = function (password, cb) {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err)
                return cb(err);

            cb(null, isMatch);
        });
    };

    return User;
};