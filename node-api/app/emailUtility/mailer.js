var async = require("async");
var nodemailer = require("nodemailer");
module.exports = (req, res, { mailInfo }) => {

	const {
		fromEmail,
		providers,
		genericSubject,
		genericMailBody,
		detailsRequiredInResponse,
		list_emails
	} = mailInfo;

	try {
		var success_email = [];
		var failure_email = [];
		var transporter;
		function bulkMailer() {
			var self = this;
			transporter = nodemailer.createTransport({
				host: providers.mailService,
				port: 465,
				secure: true,
				auth: {
					user: providers.authUser,
					pass: providers.authPass,
				},
				tls: { rejectUnauthorized: false },
				debug: true
			});

			self.invokeOperation();
		}

		/* Invoking email sending operation at once */
		bulkMailer.prototype.invokeOperation = function () {
			var self = this;
			async.each(list_emails, self.SendEmail, function () {
				let response;
				if (failure_email.length > 0) {
					response = {
						success: false,
						message: failure_email.length + " Emails Failed and Success emails are " + success_email.length,
					};
				} else {
					response = {
						success: true,
						message: "All mails triggered",
					};
				}
				if (detailsRequiredInResponse) {
					response.failure_recipients = failure_email;
					response.success_recipients = failure_email;
				}
				return res.status(200).send(response);
			});
		}

		bulkMailer.prototype.SendEmail = function (Email, callback) {
			console.log("Sending email to " + Email);
			var self = this;
			self.status = false;
			async.waterfall([
				function (callback) {
					var mailOptions = {
						from: fromEmail,
						to: Email,
						subject: genericSubject,
						text: genericMailBody
					};
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log(error)
							failure_email.push(Email);
						} else {
							self.status = true;
							success_email.push(Email);
						}
						callback(null, self.status, Email);
					});
				},
				function (statusCode, Email, callback) {
					console.log(Email + " With " + statusCode);
					callback();
				}
			], function () {
				callback();
			});
		}
		new bulkMailer();

	} catch (error) {
		console.log("error mailer", error);
		return res.status(400).send({
			success: false,
			message: JSON.stringify(error)
		});
	}
}
