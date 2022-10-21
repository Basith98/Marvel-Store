const BannerRepository = require("../repository/noSqlRepository/bannerNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");
const s3Bucket = require("../../../shared/utils/AWSs3");

module.exports = {
  getBanner: async (id) => {
    console.log("Getting");
    return await BannerRepository.getBanner(id);
  },

  getBanners: async () => {
    try {
      let result = await BannerRepository.getBanners();
      if (result.mainBanners.length > 0) {
        for (let mainBanners of result.mainBanners) {
          mainBanners.imageUrl = await s3Bucket.getObjectSignedUrl(
            mainBanners.imageName
          );
        }
      }
      if (result.subBanner.length > 0) {
        for (let subBanner of result.subBanner) {
          subBanner.imageUrl = await s3Bucket.getObjectSignedUrl(
            subBanner.imageName
          );
        }
      }
      if (result.productBanners.length > 0) {
        for (let productBanners of result.productBanners) {
          productBanners.imageUrl = await s3Bucket.getObjectSignedUrl(
            productBanners.imageName
          );
        }
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  updateBanner: async (banner, req) => {
    let NOSQLMode = 1;
    if (banner.Id) {
      NOSQLMode = 2;
    } else if (banner.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    if (NOSQLMode === 1) {
      const response = await uploadS3.imageSetUp(req, 2);
      banner.imageName = response.imageDetails[0].imageName;
    }
    return await BannerRepository.updateBanner(banner, NOSQLMode);
  },
};
