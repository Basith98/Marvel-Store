const UserService = require("../BLL/userService");
const nodemailer = require("nodemailer");
// const secure_configuration = require("./secure");

module.exports = {
  getAccount: async (req, res) => {
    try {
      let response;

      if (req.session.user) {
        // response = await UserService.getLogin(userId);
        res.render("user/account/accounts");
      } else res.render("user/loginAndSignUp/login");
    } catch (err) {
      console.error("Error", err);
    }
  },

  getLogins: async (req, res) => {
    try {
      response = await UserService.getLogins();
      console.log(response);
      res.render("admin/user/userList", { users: response.users });
    } catch (e) {
      return e;
    }
  },

  updateUser: async (req, res) => {
    let response = {};
    try {
      const user = req.body;
      user.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      user.recordStatusId = 0;
      console.log(user);
      response = {};
      await UserService.updateUser(user, req);
      // let testAccount = await nodemailer.createTestAccount();

      // let mail = "marvelstore22@gmail.com";
      // password = "marvel1q2w!Q@W";

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   host: "smtp.ethereal.email",
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: testAccount.mail,
      //     pass: testAccount.password,
      //   },
      // });

      // const mailConfigurations = {
      //   // It should be a string of sender email
      //   from: "marvelstore2@gmail.com",

      //   // Comma Separated list of mails
      //   to: "abdulbasith199814@gmail.com",

      //   // Subject of Email
      //   subject: "Sending Email using Node.js",

      //   // This would be the text of email body
      //   text:
      //     "Hi! There, You know I am using the" +
      //     " NodeJS Code along with NodeMailer " +
      //     "to send this email.",
      // };

      // transporter.sendMail(mailConfigurations, function (error, info) {
      //   if (error) throw Error(error);
      //   console.log("Email Sent Successfully");
      //   console.log(info);
      // });

      if (response.returnStatus === false) {
        return res.render("user/loginAndSignUp/signUp", {
          user: true,
          isExist: true,
          message: response.message,
        });
      }
      res.redirect("/");

      message = response.message;
      // res.redirect("/admin/userDetails");
      // } else {
      //   return response.message;
      // }
    } catch (err) {
      console.log(err);
    }
  },
};
