module.exports = (sequelize, Sequelize) => {
    const Reviews = sequelize.define("reviews", {
        reviewID: {
            type: Sequelize.UUIDV4
        },
        content: {
            type: Sequelize.STRING
        },
        rating: {
            type: Sequelize.INTEGER
        },
        userID: {
            type: Sequelize.UUIDV4
        }
    });

    return Reviews;
};