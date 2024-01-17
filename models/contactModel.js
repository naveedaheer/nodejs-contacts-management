module.exports = (sequelize, Sequelize) => {
    const contact = sequelize.define("contact", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phoneNumber: {
            type: Sequelize.STRING(15)
        }
    });

    return contact;
};