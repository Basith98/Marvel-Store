const { response } = require("express");
const Color = require("./models/colorSchema");
var arrayToTree = require("array-to-tree");
const { default: mongoose } = require("mongoose");
const async = require("hbs/lib/async");

module.exports = {
  getColor: async (id) => {
    try {
      let response = {};
      let result = await Color.findOne({ Id: id });
      let parentName = await Color.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.color = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getColors: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Color.find({ recordStatusId: 1 }, { __v: 0 });

      response.colors = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateColor: async (color, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        console.log("Updating color", color);
        let newColor = new Color({
          color: color.color,
          colorMap: color.colorMap,
          description: color.description,
          createdIp: color.createdIp,
          createdId: color.createdId,
          recordStatusId: 1,
        });

        await newColor.save((err, result) => {
          if (err) {
            console.log("Error saving color", err);
            response.returnStatus = false;
            response.message = err.message;
            return response;
          } else {
            response.returnStatus = true;
            response.message = "Color saved successfully.";
            console.log(response.message);
            return response;
          }
        });
      }

      //update
      else if (NOSQLMode === 2) {
        Color.findOneAndUpdate(
          { Id: color.Id },
          {
            $set: {
              color: color.color,
              colorMap: color.colorMap,
              description: color.description,
              modifiedIp: color.createdIp,
              modifiedId: color.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "color details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        Color.findOneAndUpdate(
          { Id: color.Id },
          {
            $set: {
              modifiedIp: color.createdIp,
              modifiedId: color.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "color details deleted successfully";
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
