const ColorService = require("../BLL/ColorService");
const adminHeader = { admin: true };

module.exports = {
  getColor: async (req, res) => {
    try {
      console.log("Loading");
      let response;
      let colorId = req.params.id;
      if (colorId) {
        response = await ColorService.getColor(colorId);
        if (response.returnStatus == true) {
          let colorDetails = response.color;
          return res.render("admin/color/colorDetails", {
            admin: true,
            colorDetails,
            parentColor: response.parentName,
          });
        }
      } else res.render("admin/color/colorList", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getColors: async (req, res) => {
    try {
      response = await ColorService.getColors();
      console.log(response);
      res.render("admin/color/colorList", {
        admin: true,
        colors: response.colors,
        adminHeader,
      });
    } catch (e) {
      return e;
    }
  },

  updateColor: async (req, res) => {
    let response = {};
    try {
      const color = req.body;
      color.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      color.recordStatusId = 0;
      console.log(color);
      response = await ColorService.updateColor(color, req);

      // if (response.returnStatus === true) {

      message = response.message;
      res.redirect("/admin/colorDetails");
      // } else {
      //   return response.message;
      // }
    } catch (err) {
      console.log(err);
    }
  },
};
