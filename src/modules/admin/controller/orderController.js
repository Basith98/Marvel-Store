const OrderService = require("../BLL/orderService");
const adminHeader = { admin: true };

module.exports = {
  getOrder: async (req, res) => {
    try {
      console.log("Loading");
      let response;
      let orderId = req.params.id;
      if (orderId) {
        response = await OrderService.getOrder(orderId);
        if (response.returnStatus == true) {
          let orderDetails = response.order;
          return res.render("admin/order/orderDetails", {
            admin: true,
            orderDetails,
            parentOrder: response.parentName,
          });
        }
      } else res.render("admin/order/orderList", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getOrders: async (req, res) => {
    try {
      let response = await OrderService.getOrders();
      let confirmedOrders = response.orders.filter(
        (order) =>
          order.currentStatus !== "delivered" &&
          order.currentStatus !== "Cancelled"
      );
      let deliveredOrders = response.orders.filter(
        (order) => order.currentStatus === "delivered"
      );
      let cancelOrders = response.orders.filter(
        (order) => order.currentStatus === "Cancelled"
      );
      console.log(response);
      res.render("admin/order/orderList", {
        admin: true,
        confirmedOrders: confirmedOrders,
        cancelOrders: cancelOrders,
        deliveredOrders: deliveredOrders,
      });
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  updateOrder: async (req, res) => {
    let response = {};
    try {
      const order = req.body;
      response = await OrderService.updateOrder(order);

      if (response.returnStatus === true) {
        res.json({ status: false });
        return;
      }

      res.json({ status: true });
    } catch (err) {
      console.log(err);
    }
  },
};
