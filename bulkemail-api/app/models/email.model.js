module.exports = (sequelize, Sequelize) => {
  const Email = sequelize.define("emails", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING
    }
  });

  return Email;
};
