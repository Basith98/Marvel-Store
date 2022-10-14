const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Order = require("./orderSchema");

const orderStatusSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: Order,
    },
    paymentConfirmation: [
      {
        type: new mongoose.Schema(
          {
            status: { type: Boolean, default: false },
            byPassStatus: { type: Number, default: 0 },
          },
          { timestamps: true }
        ),
      },
    ],
    orderConfirmed: [
      {
        type: new mongoose.Schema(
          {
            status: { type: Boolean, default: false },
            byPassStatus: { type: Number, default: 0 },
          },
          { timestamps: true }
        ),
      },
    ],
    Shipped: [
      {
        type: new mongoose.Schema(
          {
            status: { type: Boolean },
            byPassStatus: { type: Number, default: 0 },
            ShippedDate: Date,
          },
          { timestamps: true }
        ),
      },
    ],
    outForDelivery: [
      {
        type: new mongoose.Schema(
          {
            status: { type: Boolean, default: false },
            byPassStatus: { type: Number, default: 0 },
            outForDeliveryDate: Date,
          },
          { timestamps: true }
        ),
      },
    ],
    deliveryExeceptDate: Date,
    delivered: [
      {
        type: new mongoose.Schema(
          {
            status: { type: Boolean, default: false },
            byPassStatus: { type: Number, default: 0 },
            deliveredDate: Date,
          },
          { timestamps: true }
        ),
      },
    ],
    Cancelled: [
      {
        type: new mongoose.Schema(
          {
            status: { type: Boolean, default: false },
            byPassStatus: { type: Number, default: 0 },
            cancelReasons: String,
            cancelReasonDescrition: String,
          },
          { timestamps: true }
        ),
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

orderStatusSchema.plugin(AutoIncrement, {
  orderStatusId: "orderStatus_seq",
  inc_field: "orderStatusId",
});

module.exports = mongoose.model("orderStatus", orderStatusSchema);
