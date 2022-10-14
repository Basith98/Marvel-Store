const { response } = require("express");
const Size = require("./models/sizeSchema");
const Product = require("./models/productSchema");
var arrayToTree = require("array-to-tree");
const mongoose = require("mongoose");
const async = require("hbs/lib/async");
const { ObjectIdentifierFilterSensitiveLog } = require("@aws-sdk/client-s3");

module.exports = {
  getSize: async (id) => {
    try {
      let response = {};
      let result = await Size.findOne({ Id: id });
      let parentName = await Size.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.size = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getSizes: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Size.find({ recordStatusId: 1 }, { __v: 0 });

      response.sizes = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getSizeByColor: async (colorId) => {
    try {
      let response = {};
      let sizes = await Product.aggregate([
        [
          {
            $match: {
              _id: new mongoose.Types.ObjectId("63339223df8fe1661cb1d940"),
              recordStatusId: 1,
            },
          },
          {
            $unwind: {
              path: "$colorAndSizeVariation",
            },
          },
          {
            $match: {
              "colorAndSizeVariation.colorId": mongoose.Types.ObjectId(colorId),
            },
          },
          {
            $lookup: {
              from: "sizes",
              localField: "colorAndSizeVariation.sizeId",
              foreignField: "_id",
              as: "result",
            },
          },
        ],
      ]);
      console.log("results", sizes);
      response.sizes = sizes;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateSize: async (size, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        console.log("Updating size", size);
        let newSize = new Size({
          size: size.size,
          sizeMap: size.sizeMap,
          description: size.description,
          createdIp: size.createdIp,
          createdId: size.createdId,
          recordStatusId: 1,
        });

        await newSize.save((err, result) => {
          if (err) {
            console.log("Error saving size", err);
            response.returnStatus = false;
            response.message = err.message;
            return response;
          } else {
            response.returnStatus = true;
            response.message = "Size saved successfully.";
            console.log(response.message);
            return response;
          }
        });
      }

      //update
      else if (NOSQLMode === 2) {
        await Size.findOneAndUpdate(
          { Id: size.sizeId },
          {
            $set: {
              size: size.size,
              sizeMap: size.sizeMap,
              description: size.description,
              modifiedIp: size.createdIp,
              modifiedId: size.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "size details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        await Size.findOneAndUpdate(
          { Id: size.sizeId },
          {
            $set: {
              modifiedIp: size.createdIp,
              modifiedId: size.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "size details deleted successfully";
      }
      return response;
    } catch (e) {
      console.log(e);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },
};
