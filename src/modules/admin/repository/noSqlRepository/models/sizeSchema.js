const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    sizeMap: { type: String, required: true },
    description: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

sizeSchema.plugin(AutoIncrement, { sizeId: "order_seq", inc_field: "sizeId" });

module.exports = mongoose.model("size", sizeSchema);
