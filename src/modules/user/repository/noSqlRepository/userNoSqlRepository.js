const { response } = require("express");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

module.exports = {
  getLogin: async (id) => {
    try {
      let response = {};
      let result = await User.findOne({ Id: id });
      let parentName = await User.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.user = result;
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
      console.log("getParentCategories");
      let response = {};
      let result = await User.find({ recordStatusId: 1 }, { __v: 0 });

      response.users = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateUser: async (user, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        user.password = await bcrypt.hash(user.password, 10);
        let result = await User.find({ email: user.email }, { __v: 0 });
        if (result.length > 0) {
          response.message = "Email Id already exists";
          response.returnStatus = false;
          return response;
        } else {
          user.recordStatusId = 1;
          let newUser = new User(
            ({
              name,
              mobileNumber,
              email,
              password,
              createdIp,
              createdId,
              recordStatusId,
            } = user)
          );

          await newUser.save((err, result) => {
            if (err) {
              console.log("Error saving user", err);
              response.returnStatus = false;
              response.message = err.message;
              return response;
            } else {
              response.returnStatus = true;
              response.message = "Login saved successfully.";
              console.log(response.message);
              return response;
            }
          });
        }
      }

      //update
      else if (NOSQLMode === 2) {
        try {
          if (user.state === "password") {
            user.value = await bcrypt.hash(user.value, 10);
          }
          let userDetails = {};
          userDetails[user.state] = user.value;
          await User.updateOne(
            { _id: mongoose.Types.ObjectId(user.Id) },
            {
              $set: userDetails,
            }
          );

          response.returnStatus = true;
          response.message = "user details updated successfully";
          return response;
        } catch (e) {
          response.returnStatus = false;
          response.message = e.message;
          console.error(e);
          return response;
        }
      }

      //delete
      else if (NOSQLMode === 3) {
        Login.findOneAndUpdate(
          { Id: user.Id },
          {
            $set: {
              modifiedIp: user.createdIp,
              modifiedId: user.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "user details deleted successfully";
      }
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      console.error(e);
      return response;
    }
  },
};
