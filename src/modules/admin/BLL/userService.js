const UserRepository = require("../repository/noSqlRepository/userNoSqlRepository");

module.exports = {
  getUser: async (userData) => {
    return await userRepository(userFormatedData);
  },

  getUsers: async (userData) => {
    return await userRepository(userFormatedData);
  },

  updateUser: async (userData) => {
    let NOSQLMode = 1;
    if (userData._id !== "") {
      NOSQLMode = 2;
    }
    if (userData.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    console.log("mode", NOSQLMode);
    return await UserRepository.updateUser(data, NOSQLMode);
  },
};
