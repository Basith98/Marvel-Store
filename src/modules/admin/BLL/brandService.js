const BrandRepository = require("../repository/noSqlRepository/brandNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getBrand: async (id) => {
    console.log("Getting");
    return await BrandRepository.getBrand(id);
  },

  getBrands: async () => {
    return await BrandRepository.getBrands();
  },

  updateBrand: async (brand, req) => {
    let NOSQLMode = 1;
    if (brand.Id) {
      NOSQLMode = 2;
    } else if (brand.recordStatusId === 3) {
      NOSQLMode = 3;
    } else if (NOSQLMode === 1) {
      // const Imagedata = await uploadS3.imageSetUp(req)
      // brand.imageName = Imagedata.imageName;
    }
    return await BrandRepository.updateBrand(brand, NOSQLMode);
  },
};
