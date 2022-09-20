const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Update message
  app.put(
    "/api/user/updateGmailMsg",
    [
      authJwt.verifyToken,
    ],
    controller.updateGmailMsg
  );

  // Update message
  app.get(
    "/api/user/getGmailMsg",
    [
      authJwt.verifyToken,
    ],
    controller.getGmailMsg
  );

};
