const CategoryService = require("../BLL/categoryService");
const CouponService = require("../BLL/couponService");

module.exports = {
  getCoupon: async (req, res) => {
    try {
      let response = await CouponService.getCoupon(req.body.couponId);
      res.render("user/coupon/coupons", { coupons: response.coupons });
    } catch (err) {
      res.render("/error", { message: err.message });
    }
  },

  getCoupons: async (req, res) => {
    try {
      let coupon = {};
      let categoryId = 0;
      coupon.userId = req.session.userId;
      let category = await CategoryService.getParentCategories(categoryId);
      let response = await CouponService.getUerCoupons(coupon);
      let isExpired = response.coupons.filter((elem) => elem.isExpired);
      let redem = response.coupons.filter((elem) => elem.isRedem);
      let coupons = response.coupons.filter(
        (elem) => elem.status === "pending" && !elem.isExpired
      );
      res.render("user/coupon/coupons", {
        category: category.parentCategories,
        isExpired: isExpired,
        redem: redem,
        coupons: coupons,
      });
    } catch (err) {
      res.render("/error", { message: err.message });
    }
  },

  updateCoupon: async (req, res) => {
    try {
      let totalCount,
        totalAmount,
        couponStatus = false,
        coupon,
        couponDetails = {};
      coupon = req.body;
      coupon.userId = req.session.userId;
      let result = await CouponService.getCoupons(coupon);

      result.coupons.map((coupon) => {
        if (
          coupon.result.couponCode === req.body.couponCode &&
          !coupon.isExpired
        ) {
          couponStatus = true;
          return res.json({
            status: true,
            couponId: coupon.couponId,
            discount: coupon.result.discountAmount,
          });
        }
      });
      if (!couponStatus) res.json({ status: false });
    } catch (err) {
      console.log("e", err);
      res.render("/error", { message: err.message });
    }
  },
};
