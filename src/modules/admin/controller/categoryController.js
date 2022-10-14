const categoryService = require("../BLL/categoryService");
const adminHeader = { admin: true };

module.exports = {
  getCategory: async (req, res) => {
    try {
      console.log("Loading");
      let response;
      let categoryId = req.params.id;
      if (categoryId) {
        response = await categoryService.getCategory(categoryId);
        if (response.returnStatus == true) {
          let categoryDetails = response.category;
          return res.render("admin/category/categoryDetails", {
            admin: true,
            categoryDetails,
            parentCategory: response.parentName,
          });
        }
      } else res.render("admin/category/categoryDetails", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getCategoryPage: async (req, res) => {
    res.render("admin/category/categoryList", adminHeader);
  },

  getCategories: async (req, res) => {
    try {
      response = await categoryService.getCategories();
      // console.log("Loading", response.parentCategories);
      res.json({ parentCategories: response.parentCategories });
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  updateCategory: async (req, res) => {
    let response = {};
    try {
      const category = req.body;
      category.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      category.recordStatusId = 0;
      category.parentPath = category.parentPath.split(",").map(Number);
      category.parent = Number(category.parent);
      console.log("cat", category);
      console.log("typeof", typeof category.parentCategory);

      response = await categoryService.updateCategory(category, req);
      if (response.returnStatus === false) {
        message = response.message;
        return;
      }
      res.redirect("/admin/categorylist");
    } catch (err) {
      console.log(err);
    }
  },
};
