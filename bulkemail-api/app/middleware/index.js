const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyAddEmail = require("./verifyAddEmail");
const verifyGmailSync = require("./verifyGmailSync");
module.exports = {
  authJwt,
  verifySignUp,
  verifyAddEmail,
  verifyGmailSync
};
