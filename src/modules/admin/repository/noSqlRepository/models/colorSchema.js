const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const colorSchema = new mongoose.Schema(
  {
    color: {
      required: true,
      type: "string",
    },
    colorMap: {
      type: "string",
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

colorSchema.plugin(AutoIncrement, {
  Id: "order_seq",
  inc_field: "colorId",
});

module.exports = mongoose.model("color", colorSchema);
