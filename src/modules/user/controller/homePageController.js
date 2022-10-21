const { request } = require("../../../../app");
const ProductService = require("../../admin/BLL/productService");
const CategoryService = require("../BLL/categoryService");
const BannerService = require("../../admin/BLL/bannerService");

module.exports = {
  homePageController: async (req, res) => {
    try {
      let productBanners = {},
        categoryId = 0;
      let products = await ProductService.getProducts();
      let category = await CategoryService.getParentCategories(categoryId);
      let result = await BannerService.getBanners();
      console.log("req.session.userId", req.session.userId);

      result.productBanners.map((element) => {
        if (element.zone == "1stproductBanner")
          productBanners.firstProduct = element;
        if (element.zone == "2ndproductBanner")
          productBanners.secondProduct = element;
        if (element.zone == "3rdproductBanner")
          productBanners.thirdProduct = element;
        if (element.zone == "4thproductBanner")
          productBanners.fourthProduct = element;
      });

      console.log("category", category);
      res.render("user/index", {
        products,
        user: true,
        category: category.parentCategories,
        productBanners,
        subBanner: result.subBanner,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
