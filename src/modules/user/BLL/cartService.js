const CartRepository = require("../repository/noSqlRepository/cartNoSqlRepository");
const s3Bucket = require("../../../shared/utils/AWSs3");
const { response } = require("express");

module.exports = {
  getCarts: async (userId) => {
    let response = {};
    try {
      let response = await CartRepository.getCarts(userId);
      if (response.cart.length > 0) {
        for (let i = 0; i < response.cart.length; i++) {
          response.cart[i].productDteails.images[0].imageUrl =
            await s3Bucket.getObjectSignedUrl(
              response.cart[i].productDteails.images[0].imageName
            );
        }
      }
      if (response.saveForLater.length > 0) {
        for (let i = 0; i < response.saveForLater.length; i++) {
          let imageUrl = await s3Bucket.getObjectSignedUrl(
            response.saveForLater[i].productDetails.images[0].imageName
          );
          console.log(imageUrl);
          response.saveForLater[i].productDetails.images[0].imageUrl = imageUrl;
        }
      }

      console.log("in service", response);
      return response;
    } catch (err) {
      console.error(err);
    }
  },

  updateCart: async (product) => {
    let NOSQLMode = 1;
    if (product.Id) {
      NOSQLMode = 2;
    } else if (product.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await CartRepository.updateCart(product, NOSQLMode);
  },
  getOneCartProductDetails: async (product) => {
    return await CartRepository.getOneCartProductDetails(product);
  },

  getTotalAmountAndCount: async (userId) => {
    return await CartRepository.getTotalAmountAndCount(userId);
  },
};
