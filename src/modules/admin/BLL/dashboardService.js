const DashboardRepository = require("../repository/noSqlRepository/dashboardNoSqlRepository");
const uploadS3 = require("../../../shared/providers/setUpImageDetails");

module.exports = {
  getProductDetailsAndUsers: async () => {
    console.log("Getting");
    return await DashboardRepository.getProductDetailsAndUsers();
  },

  getDashboards: async () => {
    return await DashboardRepository.getDashboards();
  },

  updateDashboard: async (dashboard, req) => {
    let NOSQLMode = 1;
    if (dashboard.Id) {
      NOSQLMode = 2;
    } else if (dashboard.recordStatusId === 3) {
      NOSQLMode = 3;
    } else if (NOSQLMode === 1) {
      // const Imagedata = await uploadS3.imageSetUp(req)
      // dashboard.imageName = Imagedata.imageName;
    }
    return await DashboardRepository.updateDashboard(dashboard, NOSQLMode);
  },
};
