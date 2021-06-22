module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        userID: {
            type: Sequelize.UUIDV4
        },
        email: {
            type: Sequelize.VARCHAR
        },
        password: {
            type: Sequelize.CHAR(60)
        },
        firstName: {
            type: Sequelize.STRING
        }
    });

    return User;
};