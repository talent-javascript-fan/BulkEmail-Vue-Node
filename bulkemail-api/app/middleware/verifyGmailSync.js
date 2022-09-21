var async = require("async");
var nodemailer = require("nodemailer");

checkGmailSync = (req, res, next) => {
  const gmail = req.body.gmail;
  const gpass = req.body.gmail_pass;
  transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
		  user: gmail, // generated ethereal user
		  pass: gpass, // generated ethereal password
		},
		tls: {rejectUnauthorized: false},
    	debug:true
	  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      res.status(400).send({
        message: 'Error! Please check your gmail account configuration.'
      });
      return;
    } else {
      console.log("Server is ready to take our messages");
      next();
    }
  });
};

const verifyGmailSync = {
  checkGmailSync: checkGmailSync,
};

module.exports = verifyGmailSync;
