const OrderService = require("../BLL/orderService");
const DashboardService = require("../BLL/dashboardService");

module.exports = {
  dashboardController: async (request, res) => {
    console.log("in");
    let deliveredOrdersAverage,
      deliveredOrdersCount = 0;
    let cancelOrdersAverage,
      cancelOrdersCount = 0;
    let confirmedOrdersAverage,
      confirmedOrdersCount = 0;
    let totalOrdersCount = 0;

    let response = await OrderService.getOrders();
    let productDetails = await DashboardService.getProductDetails();
    let confirmedOrders = response.orders.filter(
      (order) =>
        order.currentStatus !== "delivered" &&
        order.currentStatus !== "Cancelled"
    );
    response.orders.map((order) => {
      if (order.currentStatus === "delivered") deliveredOrdersCount++;
      if (order.currentStatus === "Cancelled") cancelOrdersCount++;
      if (
        order.currentStatus !== "delivered" &&
        order.currentStatus !== "Cancelled"
      )
        confirmedOrdersCount++;
    });
    totalOrdersCount = response.orders.length;

    deliveredOrdersAverage = (deliveredOrdersCount / totalOrdersCount) * 100;
    cancelOrdersAverage = (cancelOrdersCount / totalOrdersCount) * 100;
    confirmedOrdersAverage = (confirmedOrdersCount / totalOrdersCount) * 100;
    res.render("admin/dashboard/mainDashboard", {
      admin: true,
      totalProducts: productDetails.totalProducts,
      totalIncome: productDetails.totalIncome[0].totalIncome,
      deliveredOrdersCount: deliveredOrdersCount,
      cancelOrdersCount: cancelOrdersCount,
      confirmedOrdersCount: confirmedOrdersCount,
      totalOrdersCount: totalOrdersCount,
      deliveredOrdersAverage: deliveredOrdersAverage,
      cancelOrdersAverage: cancelOrdersAverage,
      confirmedOrdersAverage: confirmedOrdersAverage,
    });
    // return response;
  },

  checkLoginController: (request, response) => {
    let data = request.body;
    if (data.email == "basith1@gmail.com" && data.password == "12345") {
      response.redirect("/admin");
    } else {
      response.render("user/loginAndSignUp/loginPage", { loginErr: true });
    }
    // return response;
  },
};
