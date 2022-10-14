const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Coupon = require("../../../../admin/repository/noSqlRepository/models/couponSchema");
const User = require("./userSchema");

const userCouponSchema = new mongoose.Schema(
  {
    couponId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: Coupon,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userCoupon", userCouponSchema);
