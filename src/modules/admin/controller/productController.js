const productService = require("../BLL/productService");
const adminHeader = { admin: true };

module.exports = {
  getProduct: async (req, res) => {
    try {
      let id = req.body.id;
      if (id > 0) {
        let response = await productService.getProduct(id);
        console.log(response);
        // if(response.returnStatus == true) {
        return res.render("admin/product/productDetails", response.categories);
      }
      res.render("admin/product/productDetails", adminHeader);
    } catch (err) {
      console.log(err);
    }
  },

  getProducts: async (req, res) => {
    let categoryId,
      products,
      response = {};
    try {
      categoryId = 0;

      response = await productService.getProducts(categoryId);
      console.log("response", response);
      if (response?.returnStatus === false) {
        return;
      }
      res.render("admin/product/productList", {
        products: response,
        admin: true,
      });
    } catch (e) {}
  },

  updateProduct: async (req, res) => {
    let transcationalInformation = {};
    try {
      let index = req.body.sizes.length - 1;
      let colorAndSizeVariation = JSON.parse(req.body.sizes[index]);
      req.body.colorAndSizeVariation = colorAndSizeVariation;
      console.log("req", req.body);
      req.body.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      transcationalInformation = await productService.updateProduct(req);

      if (transcationalInformation.returnStatus === false) {
        message = transcationalInformation.message;
        res.send();
      }
      console.log("transcationalInformation", transcationalInformation);
      res.json(transcationalInformation);
      // res.redirect("/admin/product");
    } catch (err) {
      console.log(err);
    }
  },
};
