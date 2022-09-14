const db = require("../models");
const Email = db.email;
const User = db.user;
const Op = db.Sequelize.Op;
const mailer = require("../emailUtility/mailer");

// Create and Save a new Email
exports.create = (req, res) => {
	// Validate request
	if (!req.body.email) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
		return;
	}

	// Create a new Email
	const email = {
		username: req.body.username,
		email: req.body.email
	};

	// Save Email in the database
	Email.create(email)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the Tutorial."
			});
		});
};

// Retrieve all Emails from the database.
exports.findAll = (req, res) => {
	const email = req.query.email;
	var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

	Email.findAll({ where: condition })
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

// Find a single Email with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	Email.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Cannot find Email with id=${id}.`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Tutorial with id=" + id
			});
		});
};

// Update a Email by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;

	Email.update(req.body, {
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Email was updated successfully."
				});
			} else {
				res.send({
					message: `Cannot update Email with id=${id}. Maybe Email was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating Email with id=" + id
			});
		});
};

// Delete an Email with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	Email.destroy({
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Email was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete Email with id=${id}. Maybe Tutorial was not found!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Could not delete Email with id=" + id
			});
		});
};

// Delete all Emails from the database.
exports.deleteAll = (req, res) => {
	Email.destroy({
		where: {},
		truncate: false
	})
		.then(nums => {
			res.send({ message: `${nums} Emails were deleted successfully!` });
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while removing all emails."
			});
		});
};

exports.sendEmail = (req, res) => {
	const message = req.body.msgBody;
	var emailData = [];
	const mailInfo = {
		fromEmail: '',
		genericSubject: 'Hi',
		genericMailBody: message,
		list_emails: emailData,
		detailsRequiredInResponse: true,
		providers: {
			mailService: 'smtp.gmail.com',
			authUser: '',
			authPass: ''
		}
	};
	Email.findAll()
		.then(data => {
			if (data) {
				for (let i = 0; i < data.length; i++) {
					emailData.push(data[i].email);
				}
				mailInfo.list_emails = emailData;
				mailInfo.fromEmail = req.body.gmail;
				mailInfo.providers.authUser = req.body.gmail;
				mailInfo.providers.authPass = req.body.pwd;
				return mailer(req, res, { mailInfo });
			}
		});
};



