const BannerService = require("../BLL/bannerService");
const adminHeader = { admin: true };

module.exports = {
  getBanner: async (req, res) => {
    try {
      res.render("admin/banner/bannerDetails", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getBanners: async (req, res) => {
    try {
      let result = await BannerService.getBanners();
      res.render("admin/banner/bannerList", adminHeader);
    } catch (e) {
      return e;
    }
  },

  updateBanner: async (req, res) => {
    let response = {};
    try {
      const banner = req.body;
      banner.createdIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      banner.recordStatusId = 0;
      console.log(banner);
      response = await BannerService.updateBanner(banner, req);

      message = response.message;
      res.redirect("/admin/bannerList");
      // } else {
      //   return response.message;
      // }
    } catch (err) {
      console.log(err);
    }
  },
};
