const { response } = require("express");
const Category = require("./models/categorySchema");
var arrayToTree = require("array-to-tree");
const { default: mongoose } = require("mongoose");
const async = require("hbs/lib/async");

module.exports = {
  getCategory: async (id) => {
    try {
      let response = {};
      let result = await Category.findOne({ Id: id });

      let parentName =
        result.parent > 0
          ? await Category.findOne({ Id: result.parent })
          : "null";
      response.parentName = parentName.name;
      console.log("result", result);
      response.category = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getCategories: async () => {
    try {
      let response = {};
      let result = await Category.find({ recordStatusId: 1 }, { __v: 0 });
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
      response.parentCategories = formatedArray;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateCategory: async (category, NOSQLMode) => {
    let response = {};
    try {
      let parentCategory, level;
      if (category.parent > 0) {
        parentCategory = await Category.findOne({
          Id: category.parent,
          recordStatusId: 1,
        });
        level = parentCategory.level + 1;
      } else {
        level = 0;
      }

      console.log("level: " + level);

      if (NOSQLMode === 1) {
        let newCategory = new Category({
          name: category.name,
          isParent: category.isParrent,
          parent: category.parent,
          level: level,
          parentPath: category.parentPath,
          description: category.description,
          imageName: category.imageName,
          createdIp: category.createdIp,
          createdId: category.createdId,
          recordStatusId: 1,
        });

        await newCategory.save((err, result) => {
          if (err) {
            console.log("Error saving category", err);
            response.returnStatus = false;
            response.message = err.message;
            return response;
          } else {
            response.returnStatus = true;
            response.message = "Category saved successfully.";
            console.log(response.message);
            return response;
          }
        });
      }

      //update
      else if (NOSQLMode === 2) {
        await Category.findOneAndUpdate(
          { Id: category.Id },
          {
            $set: {
              name: category.name,
              isParent: category.isParrent,
              parent: category.parentCategory,
              description: category.description,
              imageName: category.imageName,
              modifiedIp: category.createdIp,
              modifiedId: category.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "category details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        await Category.findOneAndUpdate(
          { Id: category.Id },
          {
            $set: {
              modifiedIp: category.createdIp,
              modifiedId: category.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "category details deleted successfully";
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
