const controller = require("../controllers/email.controller.js");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.post("/api/emails", controller.create);
	app.get("/api/emails", controller.findAll);
	app.get("/api/emails/:id", controller.findOne);
	app.put("/api/emails/:id", controller.update);
	app.delete("/api/emails/:id", controller.delete);
	app.delete("/api/emails/", controller.deleteAll);
	app.post("/api/transfer", controller.sendEmail);
};
