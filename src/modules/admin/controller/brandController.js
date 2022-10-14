const BrandService = require("../BLL/brandService");
const adminHeader = { admin: true };

module.exports = {
  getBrand: async (req, res) => {
    try {
      console.log("Loading");
      // let response;
      // let brandId = req.params.id;
      // if (brandId) {
      //   response = await BrandService.getBrand(brandId);
      //   if (response.returnStatus == true) {
      //     let brandDetails = response.brand;
      //     return res.render("admin/brand/brandDetails", {
      //       brandDetails,
      //       parentBrand: response.parentName,
      //     });
      //   }
      // } else
      res.render("admin/brand/brandList", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getBrands: async (req, res) => {
    try {
      response = await BrandService.getBrands();
      res.json({ parentCategories: response.parentCategories });
    } catch (e) {
      return e;
    }
  },

  updateBrand: async (req, res) => {
    let response = {};
    try {
      const brand = req.body;
      console.log(brand);
      brand.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      brand.recordStatusId = 0;
      console.log(brand);
      response = await BrandService.updateBrand(brand, req);

      if (response.returnStatus === true) {
        message = response.message;
        res.redirect("/admin/brand", adminHeader);
      } else {
        return response.message;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
