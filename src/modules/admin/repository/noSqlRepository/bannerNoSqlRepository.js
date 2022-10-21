const { response } = require("express");
const Banner = require("./models/bannerSchema");
const mongoose = require("mongoose");
const voucher_codes = require("voucher-code-generator");

module.exports = {
  getBanner: async (id) => {
    try {
      let response = {};
      let productBanners = await Banner.find({
        zone: {
          $in: [
            "1stproductBanner",
            "2ndproductBanner",
            "3rdproductBanner",
            "4thproductBanner",
          ],
        },
        recordStatusId: 1,
        status: true,
      });
      let mainBanners = await Banner.find({
        zone: "mainBanner",
        recordStatusId: 1,
      });
      let subBanner = await Banner.find({
        zone: "mainBanner",
        recordStatusId: 1,
      });
      response.subBanner = subBanner;
      response.mainBanners = mainBanners;
      response.productBanners = productBanners;
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
      let productBanners = await Banner.find({
        zone: {
          $in: [
            "1stproductBanner",
            "2ndproductBanner",
            "3rdproductBanner",
            "4thproductBanner",
          ],
        },
        recordStatusId: 1,
      });
      let mainBanners = await Banner.find({
        zone: "mainBanner",
        recordStatusId: 1,
      });
      let subBanner = await Banner.find({
        zone: "subBanner",
        recordStatusId: 1,
      });
      response.subBanner = subBanner;
      response.mainBanners = mainBanners;
      response.productBanners = productBanners;
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
        banner.recordStatusId = 1;
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
