const AddressRepository = require("../repository/noSqlRepository/addressNoSqlRepository");

module.exports = {
  getAddresses: async (address) => {
    let response = {};
    try {
      return await AddressRepository.getAddresses(address);
    } catch (err) {
      console.error(err);
    }
  },

  updateAddress: async (address) => {
    let NOSQLMode = 1;
    if (address.Id) {
      NOSQLMode = 2;
    } else if (address.recordStatusId === 3) {
      NOSQLMode = 3;
    }
    return await AddressRepository.updateAddress(address, NOSQLMode);
  },
};
