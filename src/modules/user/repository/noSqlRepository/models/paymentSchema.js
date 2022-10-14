const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Order = require("./orderSchema");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: Order,
    },
    status: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    payment_id: String,
    signature: String,
    payerId: Number,
    amount: Number,
    paymentDate: Date,
    paymentStatus: String,
    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

paymentSchema.plugin(AutoIncrement, {
  paymentId: "payment_seq",
  inc_field: "paymentId",
});

module.exports = mongoose.model("payment", paymentSchema);
