const { request } = require("../../../../app");
const ProductService = require("../../admin/BLL/productService");
const CategoryService = require("../BLL/categoryService");

module.exports = {
  homePageController: async (req, res) => {
    try {
      let categoryId = 0;
      let products = await ProductService.getProducts();
      let category = await CategoryService.getParentCategories(categoryId);
      console.log("req.session.userId", req.session.userId);

      console.log("category", category);
      res.render("user/index", {
        products,
        user: true,
        category: category.parentCategories,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
