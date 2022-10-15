const async = require("hbs/lib/async");
const LoginService = require("../BLL/loginService");
const useUserHeader = { user: true };
const jwt = require("jsonwebtoken");

module.exports = {
  getLoginPage: async (req, res) => {
    try {
      console.log("Loading");
      let response;
      let loginId = req.params.id;
      if (loginId) {
        response = await LoginService.getLogin(loginId);
        if (response.returnStatus == true) {
          let loginDetails = response.login;
          return res.render("admin/login/loginDetails", {
            loginDetails,
            parentLogin: response.parentName,
          });
        }
      } else res.render("user/loginAndRegister/login", useLoginHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getLogins: async (req, res) => {
    try {
      response = await LoginService.getLogins();
      console.log(response);
      res.render("admin/login/loginList", { logins: response.logins });
    } catch (e) {
      return e;
    }
  },

  signUpForm: async (req, res) => {
    try {
      res.render("user/loginAndSignUp/signUp");
    } catch (e) {}
  },

  checkLogin: async (req, res) => {
    try {
      const userCredentials = req.body;
      const response = await LoginService.checkLogin(userCredentials);

      if (
        response.userCredentialsStatus === false ||
        response.userStatus == "admin"
      ) {
        return res.render("user/loginAndSignUp/login", {
          wrongCredentials: true,
          message: response.returnMessage,
        });
      } else if (response.returnStatus == false) {
        return res.render("error");
      } else {
        // let token = jwt.sign(
        //   { userId: response.userId, email: userCredentials.email },
        //   process.env.TOKEN_SECRET_KEY,
        //   { expiresIn: "1h" }
        // );
        req.session.user = true;
        req.session.userEmail = userCredentials.email;
        req.session.userName = response.name;
        req.session.mobileNumber = response.mobileNumber;
        req.session.userId = response.userId;
        // console.log("token", token);
        // let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        // console.log("decodeToken", decodedToken);
        req.session.originalUrl
          ? res.redirect(`${req.session.originalUrl}`)
          : res.redirect(`/`);
      }
    } catch (e) {
      console.error(e);
      return res.render("error");
    }
  },
};
