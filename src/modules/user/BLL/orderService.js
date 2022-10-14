const OrderRepository = require("../repository/noSqlRepository/orderNoSqlRepository");
const s3Bucket = require("../../../shared/utils/AWSs3");
const { response } = require("express");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getOrders: async (userId) => {
    try {
      return await OrderRepository.getOrders(userId);
    } catch (err) {
      console.error(err);
    }
  },

  orderBasedProduct: async (OrderId) => {
    let response = {};
    try {
      let response = await OrderRepository.orderBasedProduct(OrderId);
      for (let product of response.orderedProducts) {
        product.productDetails.images[0].imageUrl =
          await s3Bucket.getObjectSignedUrl(
            product.productDetails.images[0].imageName
          );
      }
      console.log("in service", response);
      return response;
    } catch (err) {
      console.error(err);
    }
  },

  getCartProductsAndUpdateCart: async (userId) => {
    let data = await OrderRepository.getCartProductsAndUpdateCart(userId);
    console.log("in service", data);
    return data;
  },

  cancelOrder: async (orderId) => {
    return await OrderRepository.cancelOrder(orderId);
  },

  updateOrder: async (orderDetails) => {
    let NOSQLMode = 1;
    if (orderDetails.Id) {
      NOSQLMode = 2;
    } else if (orderDetails.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await OrderRepository.updateOrder(orderDetails, NOSQLMode);
  },

  getplaceOrderSections: async (data) => {
    let response = {};
    try {
      response = await OrderRepository.getplaceOrderSections(data);
      for (let product of response.orderedProducts) {
        product.productDteails.images[0].imageUrl =
          await s3Bucket.getObjectSignedUrl(
            product.productDteails.images[0].imageName
          );
      }
      return response;
    } catch (err) {
      console.error(err);
      return (response.returnStatus = false);
    }
  },
};
