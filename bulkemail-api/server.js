const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

// db.sequelize.sync();
// force: true will drop the table if it already exists
/*db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
});*/

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bulkEmail application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/email.routes')(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

var io = require('./app/socket/connect').initialize(server);
app.set('io', io);
io.on('connection', (socket) => {
  socket.on('mail_event', data => {
      var notification = require('./app/socket/notification');
      notification.checkTokenAuth(data.msg, data.uid, socket);
  });
});