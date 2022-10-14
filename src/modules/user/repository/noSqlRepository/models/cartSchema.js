const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Product = require("../../../../admin/repository/noSqlRepository/models/productSchema");
const Size = require("../../../../admin/repository/noSqlRepository/models/sizeSchema");
const Color = require("../../../../admin/repository/noSqlRepository/models/colorSchema");

const User = require("./userSchema");

const cartSchema = new mongoose.Schema(
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
            saveForLaterStatus: {
              type: Boolean,
              default: false,
              required: false,
            },
            selectProductStatus: {
              type: Boolean,
              default: true,
              required: true,
            },
            recordStatusId: { type: Number, default: 0 },
          },
          { timestamps: true }
        ),
      },
    ],
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

cartSchema.plugin(AutoIncrement, {
  cartId: "order_seq",
  inc_field: "cartId",
});

module.exports = mongoose.model("cart", cartSchema);
