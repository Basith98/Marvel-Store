const OrderRepository = require("../repository/noSqlRepository/orderNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getOrder: async (id) => {
    console.log("Getting");
    return await OrderRepository.getOrder(id);
  },

  getOrders: async () => {
    return await OrderRepository.getOrders();
  },

  updateOrder: async (order, req) => {
    let NOSQLMode = 1;
    if (order.Id) {
      NOSQLMode = 2;
    } else if (order.recordStatusId === 3) {
      NOSQLMode = 3;
    } else if (NOSQLMode === 1) {
      // const Imagedata = await uploadS3.imageSetUp(req)
      // order.imageName = Imagedata.imageName;
    }
    return await OrderRepository.updateOrder(order, NOSQLMode);
  },
};
