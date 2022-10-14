const SizeService = require("../BLL/sizeService");

module.exports = {
  getSize: async (req, res) => {
    try {
      let response;
      let sizeId = req.params.id;
      if (sizeId) {
        response = await SizeService.getSize(sizeId);
        if (response.returnStatus == true) {
          let sizeDetails = response.size;
          return res.render("admin/size/sizeDetails", {
            admin: true,
            sizeDetails,
            parentSize: response.parentName,
          });
        }
      } else res.render("admin/size/sizeDetails");
    } catch (err) {
      console.error("Error", err);
    }
  },

  getSizes: async (req, res) => {
    try {
      let response = await SizeService.getSizes();
      res.render("admin/size/sizeList", { sizes: response.sizes, admin: true });
    } catch (e) {
      return e;
    }
  },

  updateSize: async (req, res) => {
    let response = {};
    try {
      const size = req.body;
      console.log(size);
      size.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      size.recordStatusId = 0;
      console.log(size);
      response = await SizeService.updateSize(size, req);

      // if (response.returnStatus === true) {
      message = response.message;
      res.redirect("/admin/sizeDetails");
      // } else {
      //   return response.message;
      // }
    } catch (err) {
      console.log(err);
    }
  },
};
