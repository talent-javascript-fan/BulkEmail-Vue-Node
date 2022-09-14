module.exports = (sequelize, Sequelize) => {
	const Email = sequelize.define("emails", {
		email: {
			type: Sequelize.STRING
		}
	});
	return Email;
};
