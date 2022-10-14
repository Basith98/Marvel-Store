module.exports = {
  getUser: (data) => {},

  getUsers: (data) => {},

  updateUser: (data, NOSQLMode) => {
    try {
      // console.log("sqlMode", NOSQLMode);
      if (NOSQLMode === 1) {
      } else if (NOSQLMode === 2) {
      } else if (NOSQLMode === 3) {
      }
    } catch (e) {}
  },
};
