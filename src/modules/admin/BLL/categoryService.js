const CategoryRepository = require("../repository/noSqlRepository/categoryNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getCategory: async (id) => {
    console.log("Getting");
    return await CategoryRepository.getCategory(id);
  },

  getCategories: async () => {
    return await CategoryRepository.getCategories();
  },

  updateCategory: async (category, req) => {
    let NOSQLMode = 1;
    if (category.Id) {
      NOSQLMode = 2;
    } else if (category.recordStatusId === 3) {
      NOSQLMode = 3;
    } else if (NOSQLMode === 1) {
      console.log("NOSQL Mode");
      const response = await uploadS3.imageSetUp(req, 2);
      category.imageName = response.imageDetails[0].imageName;
    }
    return await CategoryRepository.updateCategory(category, NOSQLMode);
  },
};
