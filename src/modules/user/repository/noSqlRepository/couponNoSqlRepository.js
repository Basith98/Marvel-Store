const { response } = require("express");
const Coupon = require("../../../admin/repository/noSqlRepository/models/couponSchema");
const mongoose = require("mongoose");
const userCoupon = require("./models/userCouponSchema");

module.exports = {
  getCoupon: async (couponId) => {
    let response = {};
    try {
      let coupon = await Coupon.find({
        _id: mongoose.Types.ObjectId(couponId),
      });
      response.coupon = coupon;
      return response;
    } catch (error) {
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  getUerCoupons: async (coupon) => {
    let response = {};
    try {
      console.log("Loading");
      let coupons = await userCoupon.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(coupon.userId),
          },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
          },
        },
        {
          $addFields: {
            expiryDate: {
              $divide: [
                { $subtract: ["$result.endDate", "$result.startDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
            isExpired: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $divide: [
                        { $subtract: ["$result.endDate", "$result.startDate"] },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
            isRedem: {
              $cond: {
                if: {
                  $eq: ["$status", "Redem"],
                },
                then: true,
                else: false,
              },
            },
          },
        },
      ]);
      response.coupons = coupons;
      return response;
    } catch (error) {
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  getCoupons: async (coupon) => {
    let response = {};
    try {
      console.log("Loading");
      let totalAmount = parseInt(coupon.amount[0]);
      let coupons = await userCoupon.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(coupon.userId),
          },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "couponId",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
          },
        },
        {
          $match: {
            "result.minimumPurchase": {
              $lte: totalAmount,
            },
          },
        },
        {
          $addFields: {
            expiryDate: {
              $divide: [
                { $subtract: ["$result.endDate", "$result.startDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
            isExpired: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $divide: [
                        { $subtract: ["$result.endDate", "$result.startDate"] },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
            isRedem: {
              $cond: {
                if: {
                  $eq: ["$status", "Redem"],
                },
                then: true,
                else: false,
              },
            },
          },
        },
      ]);
      response.coupons = coupons;
      return response;
    } catch (error) {
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  updateCoupon: async (coupon, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        let response = {};
        await userCoupon.findOneAndUpdate(
          {
            userId: mongoose.Types.ObjectId(coupon[0].userId),
            couponId: mongoose.Types.ObjectId(coupon[0].id),
          },
          { $set: { status: "Redem", recordStatusId: 2 } }
        );
        return response;
      } else if (NOSQLMode === 2) {
      } else if (NOSQLMode === 3) {
      }
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },
};
