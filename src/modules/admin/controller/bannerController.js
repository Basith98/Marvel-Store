const BannerService = require("../BLL/bannerService");
const adminHeader = { admin: true };

module.exports = {
  getBanner: async (req, res) => {
    try {
      console.log("Loading");
      // let response;
      // let bannerId = req.params.id;
      // if (bannerId) {
      //   response = await BannerService.getBanner(bannerId);
      //   if (response.returnStatus == true) {
      //     let bannerDetails = response.banner;
      //     return res.render("admin/banner/bannerDetails", {
      //       admin: true,
      //       bannerDetails,
      //       parentBanner: response.parentName,
      //     });
      //   }
      // } else
      res.render("admin/banner/bannerDetails", adminHeader);
    } catch (err) {
      console.error("Error", err);
    }
  },

  getBanners: async (req, res) => {
    try {
      response = await BannerService.getBanners();
      console.log(response);
      res.render("admin/banner/bannerList", {
        admin: true,
        banners: response.banners,
        adminHeader,
      });
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

      // if (response.returnStatus === true) {

      message = response.message;
      res.redirect("/admin/bannerDetails");
      // } else {
      //   return response.message;
      // }
    } catch (err) {
      console.log(err);
    }
  },
};
