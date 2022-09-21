const db = require("../models");
const config = require("../config/auth.config");
const Email = db.email;
const User = db.user;
const Op = db.Sequelize.Op;


exports.addEmail = async (req, res) => {

  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!"
    });
    return;
  }

  try {
    // Save Email to Database
    await Email.create({
      user_id: req.body.user_id,
      email: req.body.email,
    })
    res.send({ message: "Email registered successfully!" });
  } catch(error) {
    res.status(500).send({ message: err.message });
  }
  
};

// Retrieve all Emails from the database.
exports.findAll = async (req, res) => {
  const email = req.query.email;
  const user_id = req.query.user_id;
  var condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
  try {
    const data = await Email.findAll({where: {
      email: { [Op.like]: `%${email}%` },
      user_id: user_id
    }})
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
      error.message || "Some error occurred while retrieving emails."
    });
  }
};


exports.findEmail = async (req, res) => {
  const user_id = req.params.user_id;
  const email_id = req.params.id;
  try {
    const data = await Email.findOne({
      where: {
        id: email_id,
        user_id: user_id, 
      },
    })
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find email with id=${email_id}.`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving email with id=" + email_id
    });
  }
};

// Update a Email by the id in the request
exports.update = async (req, res) => {

  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!"
    });
    return;
  }
  
  try {
    const num = await Email.update(req.body, {
      where: { id: req.body.email_id, user_id: req.body.user_id }
    })
    if (num == 1) {
      res.send({
        message: "Email was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Email with id=${req.body.email_id}. Maybe Email was not found or req.body is empty!`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating Email with id=" + req.body.email_id
    });
  }
};

// Delete a Email with the specified id in the request
exports.delete = async (req, res) => {
  const user_id = req.body.user_id;
  const email_id = req.body.email_id;
  try {
    const num = await Email.destroy({
      where: { id: email_id, user_id: user_id }
    })
    if (num == 1) {
      res.send({
        message: "Email was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Email with id=${email_id}. Maybe Email was not found!`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Email with id=" + email_id
    });
  }
};

// sync gmail account
exports.syncGmail = async (req, res) => {

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
  
  try {
    const num = await User.update(req.body, {
      where: { id: req.body.user_id }
    })
    if (num == 1) {
      res.send({
        message: "Gmail account synchronized successfully."
      });
    } else {
      res.send({
        message: `Cannot update Gmail with id=${req.body.user_id}. Maybe Gmail was not found or req.body is empty!`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating Gmail with id=" + req.body.user_id
    });
  }
};

// sync get gmail account
exports.getGmail = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const data = await User.findByPk(user_id,{attributes: ['gmail']})
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find gmail info.`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving gmail info with id=" + user_id
    });
  }
}

// Delete all Emails with the specified id in the request
exports.deleteAll = async (req, res) => {
  const user_id = req.body.user_id;
  try {
    const num = await Email.destroy({
      where: { user_id: user_id },
      truncate: false
    })
    if (num == 1) {
      res.send({
        message: "Emails was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Emails with id=${user_id}. Maybe Emails was not found!`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Emails with id=" + user_id
    });
  }
};

// Not using this right now
exports.sendMessage = (req, res) => {

  return res.status(200).send({
    success: true,
    message: "Sending emails is in process..."
  });

 };