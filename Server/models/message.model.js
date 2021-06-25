module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        message: {
            type: Sequelize.STRING
        },
        timestamp: {
            type: Sequelize.DATE
        }
    });

    return Message;
};