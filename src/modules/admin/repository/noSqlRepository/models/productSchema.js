const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Category = require("./categorySchema");
const Color = require("./colorSchema");
const Size = require("./sizeSchema");

const productSchema = new mongoose.Schema(
  {
    productName: String,
    brandName: String,
    categoryId: Number,
    limitPerUser: Number,
    outerMaterialType: String,
    description: String,
    images: [{ fieldName: String, imageName: String }],
    colorAndSizeVariation: [
      {
        colorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Color,
          required: true,
        },
        sizeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Size,
          required: true,
        },
        Quantity: Number,
        Price: Number,
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

productSchema.plugin(AutoIncrement, {
  productId: "order_seq",
  inc_field: "productId",
});

module.exports = mongoose.model("product", productSchema);
