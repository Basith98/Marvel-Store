const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Product = require("../../../../admin/repository/noSqlRepository/models/productSchema");
const User = require("./userSchema");
const Address = require("./addressSchema");
const Size = require("../../../../admin/repository/noSqlRepository/models/sizeSchema");
const Color = require("../../../../admin/repository/noSqlRepository/models/colorSchema");

const orderSchema = new mongoose.Schema(
  {
    userId: { required: true, type: mongoose.Schema.Types.ObjectId, ref: User },
    products: [
      {
        type: new mongoose.Schema(
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: Product,
            },
            colorId: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: Color,
            },
            sizeId: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: Size,
            },
            quantity: {
              type: Number,
              required: true,
            },
            amount: { type: Number, required: true },
            recordStatusId: { type: Number, default: 1 },
          },
          { timestamps: true }
        ),
      },
    ],
    coupon: [
      {
        type: new mongoose.Schema({
          couponId: String,
          couponSavingsPrice: Number,
        }),
      },
      {
        totalDiscountAmount: { type: Number },
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Address,
    },
    couponStatus: { type: Boolean, default: false },
    totalUnitPrice: Number,
    currentStatus: String,
    orderConfirmationUserEmail: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, {
  orderId: "order_seq",
  inc_field: "orderId",
});

module.exports = mongoose.model("order", orderSchema);
