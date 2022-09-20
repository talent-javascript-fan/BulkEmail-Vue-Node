const { authJwt, verifyAddEmail, verifyGmailSync } = require("../middleware");
const emailController = require("../controllers/email.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new Email
  app.post(
    "/api/email/addEmail", 
    [
      authJwt.verifyToken,
      verifyAddEmail.checkDuplicateEmail,
    ],
    emailController.addEmail
  );

  // Retrieve user all Emails
  app.get(
    "/api/email",
    [
      authJwt.verifyToken,
    ],
    emailController.findAll
  );
  
  // Update a Email with id and user id
  app.put(
    "/api/email/update",
    [
      authJwt.verifyToken,
    ],
    emailController.update
  );

  // Delete Email
  app.post(
    "/api/email/deleteEmail", 
    [
      authJwt.verifyToken,
    ],
    emailController.delete
  );

  // Sync Gmail Account
  app.post(
    "/api/email/syncGmail", 
    [
      authJwt.verifyToken,
      verifyGmailSync.checkGmailSync
    ],
    emailController.syncGmail
  );

  // Get Gmail Account
  app.get(
    "/api/email/getGmail/:user_id", 
    [
      authJwt.verifyToken,
    ],
    emailController.getGmail
  );

  app.post(
    "/api/email/removeAll",
    [
      authJwt.verifyToken
    ],
    emailController.deleteAll
  );

  app.post(
    "/api/email/sendMessage",
    [
      authJwt.verifyToken
    ],
    emailController.sendMessage
  );

};
