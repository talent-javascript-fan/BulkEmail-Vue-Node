const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.updateGmailMsg = async (req, res) => {
  try {
    const num = await User.update(req.body, {
      where: { id: req.body.user_id }
    })
    if (num == 1) {
      res.send({
        message: "Message was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Message with id=${req.body.user_id}. Maybe message was not found or req.body is empty!`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating message with id=" + req.body.user_id
    });
  }
};

exports.getGmailMsg = async (req, res) => {
  const user_id = req.query.id;
  try {
    const data = await User.findOne({
      where: {
        id: user_id,
      },
      attributes: ['email_message']
    })

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find message with id=${user_id}.`
      });
    }

  } catch (error) {
    res.status(500).send({
      message: "Error retrieving message with id=" + user_id
    });
  }
};
