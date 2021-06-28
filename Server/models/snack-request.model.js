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
        addressName: {
            type: Sequelize.STRING
        },
        placeId: {
            type: Sequelize.STRING
        },
        fromLongitude: {
            type: Sequelize.FLOAT
        },
        fromLatitude: {
            type: Sequelize.FLOAT
        },
        fromAddressName: {
            type: Sequelize.STRING
        },
        fromPlaceId: {
            type: Sequelize.STRING
        },
        maxWaitTime: {
            type: Sequelize.INTEGER
        },
        distance: { // metres
            type: Sequelize.INTEGER
        },
        duration: { // seconds
            type: Sequelize.INTEGER
        },
        budget: {
            type: Sequelize.FLOAT
        }
    });

    return SnackRequest;
};