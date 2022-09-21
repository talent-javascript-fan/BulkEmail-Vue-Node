const db = require("../models");
const ROLES = db.ROLES;
const Email = db.email;

checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await Email.findOne({
      where: {
        email: req.body.email,
        user_id: req.body.user_id
      }
    })
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).send({
      message: error
    });
    return;
  }
};

const verifyAddEmail = {
  checkDuplicateEmail: checkDuplicateEmail,
};

module.exports = verifyAddEmail;
