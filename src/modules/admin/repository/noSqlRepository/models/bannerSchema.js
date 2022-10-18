const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const bannerSchema = new mongoose.Schema(
  {
    banner: {
      required: true,
      type: "string",
    },
    bannerMap: {
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

bannerSchema.plugin(AutoIncrement, {
  Id: "order_seq",
  inc_field: "bannerId",
});

module.exports = mongoose.model("banner", bannerSchema);
