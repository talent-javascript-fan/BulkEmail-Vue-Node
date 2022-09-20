const db = require("../models");
const ROLES = db.ROLES;
const Email = db.email;

checkDuplicateEmail = (req, res, next) => {
  // Email
  Email.findOne({
    where: {
      email: req.body.email,
      user_id: req.body.user_id
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    next();
  });
};

const verifyAddEmail = {
  checkDuplicateEmail: checkDuplicateEmail,
};

module.exports = verifyAddEmail;
