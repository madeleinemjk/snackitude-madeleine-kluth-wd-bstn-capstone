module.exports = (sequelize, Sequelize) => {
    const SnackRequest = sequelize.define("snackrequest", {
        requestID: {
            type: Sequelize.UUIDV4
        },
        requestingUserID: {
            type: Sequelize.UUIDV4
        },
        deliveringUserID: {
            type: Sequelize.UUIDV4
        },
        description: {
            type: Sequelize.STRING
        },
        longitude: {
            type: Sequelize.INTEGER
        },
        latitude: {
            type: Sequelize.INTEGER
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