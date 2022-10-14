const OptionDTORepository = require("../repository/noSqlRepository/optionDTONoSqlRepository");

module.exports = {
  getParentCategories: async () => {
    console.log("Getting");
    return await OptionDTORepository.getParentCategories();
  },
};
