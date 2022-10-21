const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Product = require("./productSchema");

const bannerSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: "string",
    },
    zone: {
      type: "string",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
    },
    status: { type: Boolean, default: false },
    categoryId: Number,
    imageName: String,
    startDate: Date,
    EndDate: Date,
    description: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

bannerSchema.plugin(AutoIncrement, {
  Id: "order_seq",
  inc_field: "bannerId",
});

module.exports = mongoose.model("banner", bannerSchema);
