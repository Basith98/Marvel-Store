const CouponService = require("../BLL/couponService");
const adminHeader = { admin: true };

module.exports = {
  getCoupon: async (req, res) => {
    try {
      console.log("Loading");
      // let response;
      // let couponId = req.params.id;
      // if (couponId) {
      //   response = await CouponService.getCoupon(couponId);
      //   if (response.returnStatus == true) {
      //     let couponDetails = response.coupon;
      //     return res.render("admin/coupon/couponDetails", {
      //       admin: true,
      //       couponDetails,
      //       parentCoupon: response.parentName,
      //     });
      //   }
      // } else
      res.render("admin/coupon/couponDetails", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getCoupons: async (req, res) => {
    try {
      response = await CouponService.getCoupons();
      console.log(response);
      res.render("admin/coupon/couponList", {
        admin: true,
        coupons: response.coupons,
        adminHeader,
      });
    } catch (e) {
      return e;
    }
  },

  updateCoupon: async (req, res) => {
    let response = {};
    try {
      const coupon = req.body;
      coupon.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      coupon.recordStatusId = 0;
      console.log(coupon);
      response = await CouponService.updateCoupon(coupon, req);

      // if (response.returnStatus === true) {

      message = response.message;
      res.redirect("/admin/couponDetails");
      // } else {
      //   return response.message;
      // }
    } catch (err) {
      console.log(err);
    }
  },
};
