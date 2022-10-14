const { response } = require("express");
const Coupon = require("./models/couponSchema");
const mongoose = require("mongoose");
const voucher_codes = require("voucher-code-generator");

module.exports = {
  getCoupon: async (id) => {
    try {
      let response = {};
      let result = await Coupon.findOne({ Id: id });
      let parentName = await Coupon.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.coupon = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getCoupons: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let result = await Coupon.find({ recordStatusId: 1 });

      response.coupons = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateCoupon: async (coupon, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        let couponCode = voucher_codes.generate({
          prefix: "mrvl-",
        });

        coupon.couponCode = couponCode[0];
        console.log("Updating coupon", coupon);
        await Coupon.create({ ...coupon });
        response.message = "coupon saved successfully";
        return response;
      }

      //update
      else if (NOSQLMode === 2) {
        Coupon.findOneAndUpdate(
          { Id: coupon.Id },
          {
            $set: {
              coupon: coupon.coupon,
              couponMap: coupon.couponMap,
              description: coupon.description,
              modifiedIp: coupon.createdIp,
              modifiedId: coupon.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "coupon details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        Coupon.findOneAndUpdate(
          { Id: coupon.Id },
          {
            $set: {
              modifiedIp: coupon.createdIp,
              modifiedId: coupon.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "coupon details deleted successfully";
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
