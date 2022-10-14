const optionDTOService = require("../BLL/optionDTOService");
const ColorService = require("../BLL/colorService");
const SizeService = require("../BLL/sizeService");

module.exports = {
  getParentCategories: async (req, res) => {
    try {
      let response = await optionDTOService.getParentCategories();
      console.log("parentCategories", response.parentCategories);
      res.json({ parentCategories: response.parentCategories });
    } catch (err) {}
  },

  getSizes: async (req, res) => {
    try {
      let response = await SizeService.getSizes();
      res.json({ sizes: response.sizes });
    } catch (err) {}
  },

  getColors: async (req, res) => {
    try {
      let response = await ColorService.getColors();
      res.json({ colors: response.colors });
    } catch (err) {}
  },
};
