const ColorRepository = require("../repository/noSqlRepository/colorNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getColor: async (id) => {
    console.log("Getting");
    return await ColorRepository.getColor(id);
  },

  getColors: async () => {
    return await ColorRepository.getColors();
  },

  updateColor: async (color, req) => {
    let NOSQLMode = 1;
    if (color.Id) {
      NOSQLMode = 2;
    } else if (color.recordStatusId === 3) {
      NOSQLMode = 3;
    } else if (NOSQLMode === 1) {
      // const Imagedata = await uploadS3.imageSetUp(req)
      // color.imageName = Imagedata.imageName;
    }
    return await ColorRepository.updateColor(color, NOSQLMode);
  },
};
