let userLoginService = require("../../user/BLL/loginService");
const adminHeader = { admin: true };

module.exports = {
  getLoginPage: async (req, res) => {
    try {
      res.render("admin/login/login", { noPartials: true });
    } catch (err) {}
  },

  checkLogin: async (req, res) => {
    try {
      console.log("Checking login...");
      let userCredentials = req.body;
      let result = await userLoginService.checkLogin(userCredentials);
      if (
        result.userCredentialsStatus === false ||
        result.userStatus != "admin"
      ) {
        return res.render("admin/login/login", {
          wrongCredentials: true,
          message: "Invalid username or password",
          noPartials: true,
        });
      } else {
        req.session.admin = true;
        res.redirect("/admin");
      }
      let aa;
    } catch (error) {}
  },

  logOut: async (req, res) => {
    req.session.admin = false;
    res.render("admin/login/login", { noPartials: true });
  },
};
