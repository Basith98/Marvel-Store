const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Product = require("./productSchema");
const Color = require("./colorSchema");
const Size = require("./sizeSchema");

const productVariationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Product,
    },
    // colorId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: Color,
    // },
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Size,
    },
    quantity: Number,
    price: Number,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

productVariationSchema.plugin(AutoIncrement, {
  productVariationId: "order_seq",
  inc_field: "productVariationId",
});

module.exports = mongoose.model("productVariation", productVariationSchema);
