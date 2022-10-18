const { response } = require("express");
const Product = require("./models/productSchema");
var arrayToTree = require("array-to-tree");
const mongoose = require("mongoose");
const Payment = require("../../../user/repository/noSqlRepository/models/paymentSchema");
const User = require("../../../user/repository/noSqlRepository/models/userSchema");

module.exports = {
  getProductDetailsAndUsers: async () => {
    try {
      let response = {};
      let totalProducts = await Product.find({ recordStatusId: 1 }).count();
      let totalIncome = await Payment.aggregate([
        {
          $match: {
            status: "completed",
            recordStatusId: 1,
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: "$amount",
            },
          },
        },
      ]);
      let users = await User.find({
        recordStatusId: 1,
        status: { $ne: "admin" },
      })
        .sort({ createdAt: -1 })
        .limit(5);
      response.users = users;
      response.totalProducts = totalProducts;
      response.totalIncome = totalIncome;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getDashboards: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Dashboard.find({ recordStatusId: 1 }, { __v: 0 });

      response.dashboards = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },
};
