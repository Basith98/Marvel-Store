const SizeRepository = require("../repository/noSqlRepository/sizeNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getSize: async (id) => {
    console.log("Getting");
    return await SizeRepository.getSize(id);
  },

  getSizes: async () => {
    return await SizeRepository.getSizes();
  },

  getSizeByColor: async (colorId) => {
    return await SizeRepository.getSizeByColor(colorId);
  },

  updateSize: async (size, req) => {
    let NOSQLMode = 1;
    if (size.Id) {
      NOSQLMode = 2;
    } else if (size.recordStatusId === 3) {
      NOSQLMode = 3;
    } else if (NOSQLMode === 1) {
      // const Imagedata = await uploadS3.imageSetUp(req)
      // size.imageName = Imagedata.imageName;
    }
    return await SizeRepository.updateSize(size, NOSQLMode);
  },
};
