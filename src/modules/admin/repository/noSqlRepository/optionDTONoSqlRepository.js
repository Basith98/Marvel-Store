const { response } = require("express");
const Category = require("./models/categorySchema");
var arrayToTree = require("array-to-tree");

module.exports = {
  getParentCategories: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Category.find(
        { recordStatusId: 1, isParent: true },
        { __v: 0 }
      );
      let arr = [];

      bodyparseResult(result);

      function bodyparseResult(results) {
        results.forEach((element) => {
          arr.push(element._doc);
        });
      }

      let formatedArray = await arrayToTree(arr, {
        parentProperty: "parent",
        customID: "Id",
      });
      console.log(formatedArray);
      response.parentCategories = formatedArray;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },
};
