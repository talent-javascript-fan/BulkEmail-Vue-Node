var async = require("async");
var nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const config = require("../config/auth.config.js");
const db = require("../models");
const Email = db.email;
const User = db.user;
const Op = db.Sequelize.Op;
// define start method that gets `io` send to it
module.exports = {

    checkTokenAuth: function(message, uid, socket) {

        require('../socket/connect').io().use(async (socket, next) => {
            // fetch token from handshake auth sent by FE
            const token = socket.handshake.auth.token;
            console.log("token", token);
            try {
                // verify jwt token and get user data
                const user = await jwt.verify(token, config.secret);
                console.log('user', user);
                // save the user data into socket object, to be used further
                socket.user = user;
                next();
            } catch (e) {
                // if token is invalid, close connection
                console.log('error', e.message);
                return next(new Error(e.message));
            }
        });

            
        // const message = "static message for now";
        const user_id = uid;
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
  
        Email.findAll({where: { user_id: user_id }, attributes: ['email'] })
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
                this.sendBulkEmails(mailInfo, socket);
                // socket.emit('mail_event', 'hello there');
                });
            }
        });
    },
    sendBulkEmails: function(mailInfo, socket) {

        const success_email = [];
        const failure_email = [];

        const {
            fromEmail,
            providers,
            genericSubject,
            genericMailBody,
            detailsRequiredInResponse,
            list_emails
        } = mailInfo;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: providers.authUser,
                pass: providers.authPass,
            },
        });

        async.each(list_emails, (Email, callback) => {
            async.waterfall([
                function (callback) {
                    var mailOptions = {
                        from: fromEmail,
                        to: Email,
                        subject: genericSubject,
                        text: genericMailBody
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        let status;
                        if (error) {
                            status = false;
                            failure_email.push(Email);
                        } else {
                            status = true;
                            success_email.push(Email);
                        }
                        socket.emit('mail_event', 'Email sent : ' + success_email.length +
                        ' out of : '+list_emails.length);
                        callback(null, status, Email);
                    });
                },
                function (statusCode, Email, callback) {
                    // require('../socket/connect').io().emit('mail_event', "Will update DB here for " + Email + " with " + statusCode);
                    callback();
                }
            ], function () {
                callback();
            });
        }, function () {
            /*require('../socket/connect').io().emit('mail_event', 'Success Mails: ' + success_email.join(
                ', '
            ));
            require('../socket/connect').io().emit('mail_event', 'Failed Mails: ' + failure_email.join(
                ', '
            ));*/
        });
    }
}