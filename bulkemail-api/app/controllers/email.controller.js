const db = require("../models");
const config = require("../config/auth.config");
const Email = db.email;
const User = db.user;
const Op = db.Sequelize.Op;


exports.addEmail = (req, res) => {


	if (!req.body.email) {
		res.status(400).send({
			message: "Email can not be empty!"
		});
		return;
	}

	// Save Email to Database
	Email.create({
		user_id: req.body.user_id,
		email: req.body.email,
	})
		.then(user => {
			res.send({ message: "Email registered successfully!" });
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

// Retrieve all Emails from the database.
exports.findAll = (req, res) => {
	const email = req.query.email;
	const user_id = req.query.user_id;
	var condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

	Email.findAll({
		where: {
			email: { [Op.like]: `%${email}%` },
			user_id: user_id
		}
	})
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving emails."
			});
		});

};


exports.findEmail = (req, res) => {
	const user_id = req.params.user_id;
	const email_id = req.params.id;
	Email.findOne({
		where: {
			id: email_id,
			user_id: user_id,
		},
	})
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Cannot find email with id=${email_id}.`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving email with id=" + email_id
			});
		});
};

// Update a Email by the id in the request
exports.update = (req, res) => {

	if (!req.body.email) {
		res.status(400).send({
			message: "Email can not be empty!"
		});
		return;
	}

	Email.update(req.body, {
		where: { id: req.body.email_id, user_id: req.body.user_id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Email was updated successfully."
				});
			} else {
				res.send({
					message: `Cannot update Email with id=${req.body.email_id}. Maybe Email was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating Email with id=" + req.body.email_id
			});
		});
};

// Delete a Email with the specified id in the request
exports.delete = (req, res) => {
	const user_id = req.body.user_id;
	const email_id = req.body.email_id;
	Email.destroy({
		where: { id: email_id, user_id: user_id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Email was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete Email with id=${email_id}. Maybe Email was not found!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Could not delete Email with id=" + email_id
			});
		});
};

// sync gmail account
exports.syncGmail = (req, res) => {

	if (!req.body.gmail) {
		res.status(400).send({
			message: "Email can not be empty!"
		});
		return;
	}

	if (!req.body.gmail_pass) {
		res.status(400).send({
			message: "Password can not be empty!"
		});
		return;
	}

	User.update(req.body, {
		where: { id: req.body.user_id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Gmail account synchronized successfully."
				});
			} else {
				res.send({
					message: `Cannot update Gmail with id=${req.body.user_id}. Maybe Gmail was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating Gmail with id=" + req.body.user_id
			});
		});
};

// sync get gmail account
exports.getGmail = (req, res) => {

	const user_id = req.params.user_id;
	User.findByPk(user_id, { attributes: ['gmail'] })
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Cannot find gmail info.`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving gmail info with id=" + user_id
			});
		});
}

// Delete all Emails with the specified id in the request
exports.deleteAll = (req, res) => {
	const user_id = req.body.user_id;
	Email.destroy({
		where: { user_id: user_id },
		truncate: false
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Emails was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete Emails with id=${user_id}. Maybe Emails was not found!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Could not delete Emails with id=" + user_id
			});
		});
};

// Not using this right now
exports.sendMessage = (req, res) => {

	return res.status(200).send({
		success: true,
		message: "Sending emails is in process..."
	});

	const message = req.body.message;
	const user_id = req.body.user_id;
	var emailData = [];
	const mailInfo = {
		fromEmail: '',
		genericSubject: 'Hi ! nodemailer integrated with code',
		genericMailBody: message,
		list_emails: emailData,
		detailsRequiredInResponse: true,
		providers: {
			mailService: 'smtp.gmail.com',
			authUser: '',
			authPass: ''
		}
	};

	Email.findAll({ where: { user_id: user_id }, attributes: ['email'] })
		.then(data => {
			if (data) {
				for (let i = 0; i < data.length; i++) {
					emailData.push(data[i].email);
				}
				mailInfo.list_emails = emailData;
				User.findOne({
					where: {
						id: user_id
					}
				}).then(user => {
					mailInfo.fromEmail = user.gmail;
					mailInfo.providers.authUser = user.gmail;
					mailInfo.providers.authPass = user.gmail_pass;
					// notification.sendBulkEmails(req, res, { mailInfo });
					return res.status(200).send({
						success: true,
						message: "Sending emails is in process..."
					});

				});
			}
		});
};
