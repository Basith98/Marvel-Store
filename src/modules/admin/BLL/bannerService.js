const BannerRepository = require("../repository/noSqlRepository/bannerNoSqlRepository");

module.exports = {
  getBanner: async (id) => {
    console.log("Getting");
    return await BannerRepository.getBanner(id);
  },

  getBanners: async () => {
    return await BannerRepository.getBanners();
  },

  updateBanner: async (banner, req) => {
    let NOSQLMode = 1;
    if (banner.Id) {
      NOSQLMode = 2;
    } else if (banner.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await BannerRepository.updateBanner(banner, NOSQLMode);
  },
};
