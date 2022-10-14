const LoginRepository = require("../repository/noSqlRepository/loginNoSqlRepository");

module.exports = {
  getLogin: async (id) => {
    console.log("Getting");
    return await LoginRepository.getLogin(id);
  },

  getLogins: async () => {
    return await LoginRepository.getLogins();
  },

  checkLogin: async (userCredentials) => {
    return await LoginRepository.checkLogin(userCredentials);
  },
};
