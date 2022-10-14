const { response } = require("express");
const Address = require("./models/addressSchema");
const mongoose = require("mongoose");

module.exports = {
  getAddresses: async (address) => {
    try {
      console.log("Loading");
      let addresses = await Address.find({
        userId: new mongoose.Types.ObjectId(address.userId),
        recordStatusId: 1,
      });
      console.log(`Found ${addresses.length} addresses`);
      return addresses;
    } catch (error) {
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  updateAddress: async (address, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        let response = {};

        await Address.create({ ...address });

        response.message = "Address updated successfully";
      } else if (NOSQLMode === 2) {
      } else if (NOSQLMode === 3) {
        await Address.update(
          { _id: mongoose.Types.ObjectId(address.id) },
          { $set: { recordStatusId: 3 } }
        );
        return;
      }
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },
};
