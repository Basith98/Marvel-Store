const UserRepository = require("../repository/noSqlRepository/userNoSqlRepository");

module.exports = {
  getLogin: async (id) => {
    return await UserRepository.getLogin(id);
  },

  getLogins: async () => {
    return await UserRepository.getLogins();
  },

  updateUser: async (user, req) => {
    let NOSQLMode = 1;
    if (user.Id) {
      NOSQLMode = 2;
    } else if (user.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await UserRepository.updateUser(user, NOSQLMode);
  },
};
