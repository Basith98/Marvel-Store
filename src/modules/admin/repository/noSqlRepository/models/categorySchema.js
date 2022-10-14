const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const mainCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "please specify a category name",
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    isParent: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
    },
    href: {
      type: String,
      default: " ",
    },
    parentPath: { type: Array },
    imageName: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true },
  { collection: "mainCategory" }
);

mainCategorySchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "Id" });
module.exports = mongoose.model("mainCategory", mainCategorySchema);
