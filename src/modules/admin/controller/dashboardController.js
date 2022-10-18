const OrderService = require("../BLL/orderService");
const DashboardService = require("../BLL/dashboardService");

module.exports = {
  dashboardController: async (request, res) => {
    try {
      let monday = 0,
        tuesday = 0,
        wednesday = 0,
        thursday = 0,
        friday = 0,
        saturday = 0,
        sunday = 0,
        sum = 0,
        deliveredOrdersAverage,
        deliveredOrdersCount = 0,
        cancelOrdersAverage,
        cancelOrdersCount = 0,
        confirmedOrdersAverage,
        confirmedOrdersCount = 0,
        totalOrdersCount = 0,
        dateObj = new Date();

      let response = await OrderService.getOrders();
      let productDetails = await DashboardService.getProductDetailsAndUsers();
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

      response.lastWeekOrder.map((order) => {
        let date = order.updatedAt.getDay();
        switch (order.updatedAt.getDay()) {
          case 0:
            sunday += order.totalUnitPrice;
            break;
          case 1:
            monday += order.totalUnitPrice;
            break;
          case 2:
            tuesday += order.totalUnitPrice;
            break;
          case 3:
            wednesday += order.totalUnitPrice;
            break;
          case 4:
            thursday += order.totalUnitPrice;
            break;
          case 5:
            friday += order.totalUnitPrice;
            break;
          case 6:
            saturday += order.totalUnitPrice;
            break;
        }
      });

      sunday = Math.round((sunday / 50000) * 100);
      monday = Math.round((monday / 50000) * 100);
      tuesday = Math.round((tuesday / 50000) * 100);
      wednesday = Math.round((wednesday / 50000) * 100);
      thursday = Math.round((thursday / 50000) * 100);
      friday = Math.round((friday / 50000) * 100);
      saturday = Math.round((saturday / 50000) * 100);

      totalOrdersCount = response.orders.length;

      deliveredOrdersAverage = Math.round(
        (deliveredOrdersCount / totalOrdersCount) * 100
      );
      cancelOrdersAverage = Math.round(
        (cancelOrdersCount / totalOrdersCount) * 100
      );
      confirmedOrdersAverage = Math.round(
        (confirmedOrdersCount / totalOrdersCount) * 100
      );
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
        users: productDetails.users,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
      });
    } catch (error) {}

    // res.render("admin/dashboard/test", { admin: true });
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
