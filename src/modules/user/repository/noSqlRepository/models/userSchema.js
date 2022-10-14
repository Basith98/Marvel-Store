const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const loginSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: String,
    description: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: Number,
  },
  { timestamps: true }
);

loginSchema.plugin(AutoIncrement, {
  userId: "order_seq",
  inc_field: "userId",
});

module.exports = mongoose.model("user", loginSchema);
