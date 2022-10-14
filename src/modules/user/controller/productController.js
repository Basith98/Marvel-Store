const ProductService = require("../../admin/BLL/productService");
const SizeService = require("../../admin/BLL/sizeService");
const CategoryService = require("../BLL/categoryService");

module.exports = {
  getProduct: async (req, res) => {
    try {
      let id = req.params.id;
      let response = await ProductService.getProduct(id);
      let category = await CategoryService.getParentCategories();
      console.log(response.product);
      if (response.returnStatus == false) {
        res.render("/error", { message: response.message });
      }
      console.log("response", response.product[0].colors);
      res.render("user/product/productDetails", {
        product: response.product,
        images: response.product[0].images,
        category: category.parentCategories,
      });
    } catch (err) {
      res.render("/error");
    }
  },

  getProducts: async (req, res) => {
    let categoryId,
      products,
      response = {};
    try {
      categoryId = 0;

      response = await ProductService.getProducts(categoryId);

      if (response?.returnStatus === false) {
        return;
      }
      res.render("admin/product/productList", {
        products: response,
        admin: true,
      });
    } catch (e) {}
  },

  getSizeByColor: async (req, res) => {
    try {
      let colorId = req.body.colorId;
      let response = await SizeService.getSizeByColor(colorId);
      if (response.returnStatus === false) {
      }
      res.json(response.sizes);
    } catch (e) {
      res.render("/error", { message: e.message });
    }
  },
};
