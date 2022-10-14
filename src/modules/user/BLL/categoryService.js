const CategoryRepository = require("../repository/noSqlRepository/categoryNoSqlRepository");
const s3Bucket = require("../../../shared/utils/AWSs3");
const { response } = require("express");

module.exports = {
  // getCategory: async (id) => {
  //   console.log("Getting");
  //   return await CategoryRepository.getCategory(id);
  // },

  // getCategories: async () => {
  //   return await CategoryRepository.getCategories();
  // },

  getFirstLevelCategoryAndProducts: async (categoryId) => {
    let response = {};
    try {
      let product, category;
      response = await CategoryRepository.getFirstLevelCategoryAndProducts(
        categoryId
      );
      console.log("length ", response.subCategory.length);
      // if (response.subCategory.length > 0) {
      for (let product of response.categoryBasedProducts) {
        product.images.imageUrl = await s3Bucket.getObjectSignedUrl(
          product.images.imageName
        );
      }
      for (let category of response.subCategory) {
        if (category.imageName)
          category.imageUrl = await s3Bucket.getObjectSignedUrl(
            category.imageName
          );
      }
      // }
      return response;
    } catch (error) {
      response.returnStatus = false;
      console.log(error);
      return response;
    }
  },

  getSubLevelCategoryAndProducts: async () => {
    let response = {};
    try {
      response = await CategoryRepository.getSubLevelCategoryAndProducts(
        categoryId
      );
    } catch (err) {}
  },

  getParentCategories: async (categoryId) => {
    return await CategoryRepository.getParentCategories(categoryId);
  },
};
