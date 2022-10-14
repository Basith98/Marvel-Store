const LoginService = require("../BLL/loginService");
const UserService = require("../BLL/userService");
const AddressService = require("../BLL/addressService");

module.exports = {
  getLoginAndSecurity: async (req, res) => {
    try {
      if (req.session.accountSignIn) {
        res.render("user/account/login&security", {
          userName: req.session.userName,
          email: req.session.userEmail,
          mobileNumber: req.session.mobileNumber,
        });
      } else {
        res.render("user/account/login&securityLoginPage", {
          userName: req.session.userName,
          email: req.session.userEmail,
        });
      }
    } catch (err) {}
  },

  checkPassword: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/");
      }
      const userCredentials = {};
      userCredentials.password = req.body.password;
      userCredentials.email = req.session.userEmail;
      const response = await LoginService.checkLogin(userCredentials);
      if (response.userCredentialsStatus === false) {
        return res.render("user/account/login&securityLoginPage", {
          userName: req.session.userName,
          email: req.session.userEmail,
          loginFail: true,
        });
      } else if (response.returnStatus == false) {
        return res.render("error");
      } else {
        req.session.accountSignIn = true;
        res.render("user/account/login&security", {
          userName: req.session.userName,
          email: req.session.userEmail,
          mobileNumber: req.session.mobileNumber,
        });
      }
    } catch (err) {
      console.error(err);
      res.render("error", { message: err.message });
    }
  },

  updateAccountDetails: async (req, res) => {
    try {
      let userDetails = req.body;
      userDetails.Id = req.session.userId;
      let result = await UserService.updateUser(userDetails);
      if (result.returnStatus == false) {
        return res.json({ status: false });
      } else res.json({ status: true });
    } catch (err) {
      console.error(err);
      res.render("error", { message: err.message });
    }
  },

  getAddressDetails: async (req, res) => {
    let address = {};
    address.userId = req.session.userId;
    let addresses = await AddressService.getAddresses(address);
    res.render("user/account/address", { addresses });
  },
};
