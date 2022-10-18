const { response } = require("express");
const Banner = require("./models/bannerSchema");
const mongoose = require("mongoose");
const voucher_codes = require("voucher-code-generator");

module.exports = {
  getBanner: async (id) => {
    try {
      let response = {};
      let result = await Banner.findOne({ Id: id });
      let parentName = await Banner.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.banner = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getBanners: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Banner.find({ recordStatusId: 1 });

      response.banners = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateBanner: async (banner, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        let bannerCode = voucher_codes.generate({
          prefix: "mrvl-",
        });

        banner.bannerCode = bannerCode[0];
        console.log("Updating banner", banner);
        await Banner.create({ ...banner });
        response.message = "banner saved successfully";
        return response;
      }

      //update
      else if (NOSQLMode === 2) {
        Banner.findOneAndUpdate(
          { Id: banner.Id },
          {
            $set: {
              banner: banner.banner,
              bannerMap: banner.bannerMap,
              description: banner.description,
              modifiedIp: banner.createdIp,
              modifiedId: banner.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "banner details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        Banner.findOneAndUpdate(
          { Id: banner.Id },
          {
            $set: {
              modifiedIp: banner.createdIp,
              modifiedId: banner.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "banner details deleted successfully";
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
