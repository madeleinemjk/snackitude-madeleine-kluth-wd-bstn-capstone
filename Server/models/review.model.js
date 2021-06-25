module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
        content: {
            type: Sequelize.STRING
        },
        rating: {
            type: Sequelize.INTEGER
        }
    });

    return Review;
};