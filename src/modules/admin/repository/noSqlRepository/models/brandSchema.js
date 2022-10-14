const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const brandSchema = new mongoose.Schema({
  createdId: String,
  createdIp: String,
  modifiedId: String,
  modifiedIp: String,
  recordStatusId: Number,
});

// brandSchema.plugin(AutoIncrement, { brandid: "order_seq", inc_field: "Id" });

module.exports = mongoose.model("brand", brandSchema);
