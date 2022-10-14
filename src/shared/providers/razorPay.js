const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
  generatorRazorPay: async (orderId, amount) => {
    try {
      let orderDetails,
        options = {
          amount: parseInt(amount) * 100,
          currency: "INR",
          receipt: `${orderId}`,
        };
      await instance.orders.create(options, (err, order) => {
        orderDetails = order;
        if (err) return err;
      });
      return orderDetails;
    } catch (err) {
      console.error("Error creating order", err);
      return err;
    }
  },
};
