const CategoryService = require("../BLL/categoryService");
const AddressService = require("../BLL/addressService");

module.exports = {
  getAddresses: async (req, res) => {
    try {
      let address;
      address.userId = req.session.userId;
      let response = await AddressService.getAddress(address);
      console.log(response);
      res.json({ response });
    } catch (err) {
      res.render("/error", { message: err.message });
    }
  },

  updateAddress: async (req, res) => {
    try {
      let totalCount, totalAmount, addressStatus, address;
      address = req.body;
      address.userId = req.session.userId;
      address.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      address.createdId = req.session.userId;
      console.log("address ", address);
      let response = await AddressService.updateAddress(address);
      if (req.body.accountAddress) {
        res.redirect("/addressDetails");
      } else if (req.body.recordStatusId == 3) {
        res.json({ status: true });
      } else {
        res.redirect("/order");
      }
    } catch (err) {
      console.log("e", err);
      res.render("/error", { message: err.message });
    }
  },
};
