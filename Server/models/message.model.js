module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        messageID: {
            type: Sequelize.UUIDV1
        },
        snackRequestID: {
            type: Sequelize.UUIDV4
        },
        fromUserID: {
            type: Sequelize.UUIDV4
        },
        message: {
            type: Sequelize.STRING
        },
        timestamp: {
            type: Sequelize.DATETIME
        }
    });

    return Message;
};