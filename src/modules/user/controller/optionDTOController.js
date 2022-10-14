const CartService = require("../BLL/CartService");

module.exports = {
  getTotalAmountAndCount: async (req, res) => {
    try {
      let response,
        data = [];
      let userId = "631b1a462b94a448c455b357";
      response = await CartService.getTotalAmountAndCount(userId);
      data.push(response);
      console.log("DTO", data);
      res.json({ data });
    } catch (err) {}
  },
};
