module.exports = (sequelize, Sequelize) => {
    const SnackRequest = sequelize.define("snackRequest", {
        description: {
            type: Sequelize.STRING
        },
        longitude: {
            type: Sequelize.FLOAT
        },
        latitude: {
            type: Sequelize.FLOAT
        },
        maxWaitTime: {
            type: Sequelize.INTEGER
        },
        budget: {
            type: Sequelize.FLOAT
        }
    });

    return SnackRequest;
};