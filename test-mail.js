var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://mrchriswhitney@gmail.com:fFrBOOoAW2r6@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Chris Whitney" <mrchriswhitney@gmail.com>', // sender address
    to: '5038038883@vtext.com', // list of receivers
    subject: 'Hello, this is the subject line', // Subject line
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
