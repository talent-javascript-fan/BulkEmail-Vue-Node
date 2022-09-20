const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.updateGmailMsg = (req, res) => {
  User.update(req.body, {
    where: { id: req.body.user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Message was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Message with id=${req.body.user_id}. Maybe message was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating message with id=" + req.body.user_id
      });
    });
};

exports.getGmailMsg = (req, res) => {
  const user_id = req.query.id;
  User.findOne({
    where: {
      id: user_id,
    },
    attributes: ['email_message']
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find message with id=${user_id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving message with id=" + user_id
      });
    });
};
