const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
     service: "gmail",
  auth: {
    user: "kusumasaketh92@gmail.com",
    pass: "pjti pgbv qnbj jszh",
  },
})
module.exports = {transporter}