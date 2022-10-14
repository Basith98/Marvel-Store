const { response } = require("express");
const Brand = require("./models/brandSchema");
var arrayToTree = require("array-to-tree");
const { default: mongoose } = require("mongoose");
const async = require("hbs/lib/async");

module.exports = {
  getBrand: async (id) => {
    try {
      let response = {};
      let result = await Brand.findOne({ Id: id });
      let parentName = await Brand.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.brand = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getBrands: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Brand.find({ recordStatusId: 1 }, { __v: 0 });
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

  updateBrand: (brand, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        console.log("Updating brand", brand);
        let newBrand = new Brand({
          name: brand.name,
          isParent: brand.isParrent,
          parent: brand.parentBrand,
          description: brand.description,
          imageName: brand.imageName,
          createdIp: brand.createdIp,
          createdId: brand.createdId,
          recordStatusId: 1,
        });

        newBrand.save((err, result) => {
          if (err) {
            console.log("Error saving brand", err);
            response.returnStatus = false;
            response.message = err.message;
            return response;
          } else {
            response.returnStatus = true;
            response.message = "Brand saved successfully.";
            console.log(response.message);
            return response;
          }
        });
      }

      //update
      else if (NOSQLMode === 2) {
        Brand.findOneAndUpdate(
          { Id: brand.Id },
          {
            $set: {
              name: brand.name,
              isParent: brand.isParrent,
              parent: brand.parentBrand,
              description: brand.description,
              imageName: brand.imageName,
              modifiedIp: brand.createdIp,
              modifiedId: brand.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "brand details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        Brand.findOneAndUpdate(
          { Id: brand.Id },
          {
            $set: {
              modifiedIp: brand.createdIp,
              modifiedId: brand.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "brand details deleted successfully";
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
