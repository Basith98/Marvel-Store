const { response } = require("express");
const Category = require("../../../admin/repository/noSqlRepository/models/categorySchema");
const Product = require("../../../admin/repository/noSqlRepository/models/productSchema");

module.exports = {
  getCategory: async (id) => {
    try {
      let response = {};
      let result = await Category.findOne({ Id: id });

      let parentName =
        result.parent > 0
          ? await Category.findOne({ Id: result.parent })
          : "null";
      response.parentName = parentName.name;
      console.log("result", result);
      response.category = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getFirstLevelCategoryAndProducts: async (categoryId) => {
    let response = {};
    try {
      let subCategory, categoryBasedProducts, SubCategoriesId;

      categoryId = Number(categoryId);
      SubCategoriesId = await Category.distinct("Id", {
        parentPath: categoryId,
      });

      // console.log("cat Id", SubCategoriesId);
      subCategory = await Category.find({
        parent: categoryId,
      });

      SubCategoriesId.push(categoryId);
      console.log("subCategory", SubCategoriesId);

      categoryBasedProducts = await Product.aggregate([
        { $unwind: { path: "$images" } },
        {
          $match: {
            "images.fieldName": "mainImage",
            recordStatusId: 1,
            categoryId: { $in: SubCategoriesId },
          },
        },
      ]);

      console.log("CategoryBasedProducts", categoryBasedProducts);
      response = { categoryBasedProducts, subCategory };

      return response;
    } catch (error) {
      response.returnStatus = false;
      response.message = error.message;
      console.log(error);
      return response;
    }
  },

  getParentCategories: async (categoryId) => {
    let response = {};
    try {
      let category, MainCategoryId;
      category = await Category.findOne({
        Id: categoryId,
        recordStatusId: 1,
      });

      if (categoryId > 0) {
        MainCategoryId =
          category.parentPath.length > 0 && category.parentPath[0] != 0
            ? category.parentPath[0]
            : categoryId;

        response.departments = await Category.find({
          $or: [{ Id: { $in: category.parentPath } }, { Id: categoryId }],
          recordStatusId: 1,
        }).sort({ level: 1 });
      }
      response.levelOneCategories = await Category.find({
        parent: MainCategoryId,
        recordStatusId: 1,
      });

      response.parentCategories = await Category.find({
        parent: 0,
        recordStatusId: 1,
      });

      console.log("departments: " + response.departments);

      return response;
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  getLevelOneCategory: async (id) => {
    try {
      let levelOneCategories, category, MainCategoryId;
      id = Number(id);
      category = await Category.findOne({
        Id: id,
        recordStatusId: 1,
      });
      MainCategoryId = category.parentPath[0];
      levelOneCategories = await Category.find({ parent: MainCategoryId });
      return parentCategories;
    } catch (err) {
      cconsole.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },
};
