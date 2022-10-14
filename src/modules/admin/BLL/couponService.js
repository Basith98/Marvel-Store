const CouponRepository = require("../repository/noSqlRepository/couponNoSqlRepository");

module.exports = {
  getCoupon: async (id) => {
    console.log("Getting");
    return await CouponRepository.getCoupon(id);
  },

  getCoupons: async () => {
    return await CouponRepository.getCoupons();
  },

  updateCoupon: async (coupon, req) => {
    let NOSQLMode = 1;
    if (coupon.Id) {
      NOSQLMode = 2;
    } else if (coupon.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await CouponRepository.updateCoupon(coupon, NOSQLMode);
  },
};
