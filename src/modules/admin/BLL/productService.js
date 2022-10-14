const ProductRepository = require("../repository/noSqlRepository/productNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");
const s3Bucket = require("../../../shared/utils/AWSs3");

module.exports = {
  getProduct: async (id) => {
    let response = {};
    try {
      let imageUrl,
        product = await ProductRepository.getProduct(id);
      for (let image of product[0].images) {
        image.imageUrl = await s3Bucket.getObjectSignedUrl(image.imageName);
      }
      response.product = product;
      console.log("product.length", product.length);
      product.length === 0
        ? (response.returnStatus = false)
        : (response.returnStatus = true);
      return response;
    } catch (err) {
      console.log(err);
    }
  },

  getProducts: async (categoryId) => {
    try {
      let products = await ProductRepository.getProducts(categoryId);
      for (let product of products) {
        product.images.imageUrl = await s3Bucket.getObjectSignedUrl(
          product.images.imageName
        );
      }
      return products;
    } catch (error) {
      console.log("err", error);
    }
  },

  updateProduct: async (req) => {
    let NOSQLMode = 1;
    if (req.body._id) {
      NOSQLMode = 2;
    } else if (req.body.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    if (NOSQLMode === 1) {
      const imageDetails = await uploadS3.imageSetUp(req, 2); // 2 indicates, more than one image;
      req.body.images = imageDetails.imageDetails;
    }
    return await ProductRepository.updateProduct(req.body, NOSQLMode);
  },
};
