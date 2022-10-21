const CategoryService = require("../BLL/categoryService");
const CartService = require("../BLL/cartService");

module.exports = {
  getFirstLevelCategoryAndProducts: async (req, res) => {
    try {
      let response,
        category,
        categoryId = req.params.id;
      let userId = req.session.userId;
      let totalAmountAndCount = await CartService.getTotalAmountAndCount(
        userId
      );
      category = await CategoryService.getParentCategories(categoryId);
      console.log("lengthrrr", category.parentCategories);

      response = await CategoryService.getFirstLevelCategoryAndProducts(
        categoryId
      );
      console.log("length", response);
      if (
        response.subCategory.length === 0 &&
        response.categoryBasedProducts.length === 0
      ) {
        return res.render("user/category/comingSoonPage", {
          category: category.parentCategories,
        });
      }
      res.render("user/category/firstLevelCategory", {
        subCategories: response.subCategory,
        categoryBasedProducts: response.categoryBasedProducts,
        category: category.parentCategories,
        firstlevelCategories: category.levelOneCategories,
        categoryDepartments: category.departments,
        cartTotalCount: totalAmountAndCount.totalCount,
      });
    } catch (err) {
      console.log("err", err);
      res.render("/error");
    }
  },

  getSubLevelCategoryAndProducts: async (req, res) => {
    try {
      let categoryId = req.params.id;
      let category = await CategoryService.getParentCategories(categoryId);
      let response = await CategoryService.getFirstLevelCategoryAndProducts(
        categoryId
      );
      if (response.subCategory.length === 0) {
        return res.render("user/category/comingSoonPage", {
          category,
        });
      }
      res.render("user/category/subLevelCategory", {
        subCategories: response.subCategory,
        categoryBasedProducts: response.categoryBasedProducts,
        category: category.parentCategories,
        firstlevelCategories: category.levelOneCategories,
        categoryDepartments: category.departments,
      });
    } catch (err) {}
  },

  getCategorys: async (req, res) => {
    let categoryId,
      categorys,
      response = {};
    try {
      categoryId = 0;
      let userId = req.session.userId;
      let totalAmountAndCount = await CartService.getTotalAmountAndCount(
        userId
      );
      response = await CategoryService.getCategorys(categoryId);

      if (response?.returnStatus === false) {
        return;
      }
      res.render("admin/category/categoryList", {
        categorys: response,
        admin: true,
        cartTotalCount: totalAmountAndCount.totalCount,
      });
    } catch (e) {}
  },
};
