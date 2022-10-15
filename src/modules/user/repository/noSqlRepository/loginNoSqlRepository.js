const { response } = require("express");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");

module.exports = {
  getLogin: async (id) => {
    try {
      let response = {};
      let result = await User.findOne({ Id: id });
      let parentName = await User.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.login = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getLogins: async () => {
    try {
      let response = {};
      let result = await User.find({ recordStatusId: 1 }, { __v: 0 });

      response.logins = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  checkLogin: async (userCredentials) => {
    let isUserEmailExist,
      response = {};
    try {
      isUserEmailExist = await User.find({
        email: userCredentials.email,
        recordStatusId: 1,
      });

      if (isUserEmailExist.length > 0) {
        response.userCredentialsStatus = await bcrypt
          .compare(userCredentials.password, isUserEmailExist[0].password)
          .then((status) => {
            console.log(status);
            response.returnMessage = status
              ? ""
              : "Invalid username or password";
            return status;
          });
        response.mobileNumber = isUserEmailExist[0]?.mobileNumber;
        response.userId = isUserEmailExist[0].id;
        response.name = isUserEmailExist[0].name;
        response.userStatus = isUserEmailExist[0]?.status;
      } else {
        response.userCredentialsStatus = false;
        response.returnMessage = "Invalid username or password";
      }

      return response;
    } catch (e) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },
};
