const CartService = require("../BLL/cartService");

module.exports = {
  getTotalAmountAndCount: async (req, res) => {
    try {
      let response,
        data = [];
      let userId = req.session.userId;
      response = await CartService.getTotalAmountAndCount(userId);
      data.push(response);
      console.log("DTO", data);
      res.json({ data });
    } catch (err) {}
  },
};
