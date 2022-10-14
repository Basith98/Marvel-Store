const CouponRepository = require("../repository/noSqlRepository/couponNoSqlRepository");

module.exports = {
  getCoupon: async (couponId) => {
    return await CouponRepository.getCoupon(couponId);
  },

  getCoupons: async (coupon) => {
    return await CouponRepository.getCoupons(coupon);
  },

  getUerCoupons: async (coupon) => {
    return await CouponRepository.getUerCoupons(coupon);
  },

  updateCoupon: async (coupon) => {
    let NOSQLMode = 1;
    if (coupon.Id) {
      NOSQLMode = 2;
    } else if (coupon.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await CouponRepository.updateCoupon(coupon, NOSQLMode);
  },
};
