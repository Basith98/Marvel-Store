const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const couponSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: "string",
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    minimumPurchase: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

couponSchema.plugin(AutoIncrement, {
  couponId: "order_seq",
  inc_field: "couponId",
});

module.exports = mongoose.model("coupon", couponSchema);
