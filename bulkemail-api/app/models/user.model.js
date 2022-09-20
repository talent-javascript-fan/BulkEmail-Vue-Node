module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    gmail: {
      type: Sequelize.STRING
    },
    gmail_pass: {
      type: Sequelize.STRING
    },
    email_message: {
      type: Sequelize.TEXT
    }
  });

  return User;
};
