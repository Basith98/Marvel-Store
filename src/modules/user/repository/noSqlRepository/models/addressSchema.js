const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const user = require("./userSchema");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
    },
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    flatHouseNoOrApartment: {
      type: String,
    },
    areaStreetOrVillage: {
      type: String,
      required: true,
    },
    landMark: {
      type: String,
      required: true,
    },
    townOrCity: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    createdId: String,
    createdIp: String,
    modifiedId: String,
    modifiedIp: String,
    recordStatusId: { type: Number, default: 1 },
  },
  { timestamps: true }
);

addressSchema.plugin(AutoIncrement, {
  addressId: "order_seq",
  inc_field: "addressId",
});

module.exports = mongoose.model("address", addressSchema);
