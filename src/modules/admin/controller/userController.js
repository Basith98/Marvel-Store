let userService = require("../BLL/userService");
const adminHeader = { admin: true };

module.exports = {
  getUser: async (req, res) => {
    try {
      if (req.body.id === "") {
        let service = await userService.getUser(req.body);
      } else res.render("admin/user/userDetails", adminHeader);
    } catch (err) {}
  },

  getUsers: (req, res) => {
    res.render("admin/user/userList", adminHeader);
  },

  updateUser: (req, res) => {
    const userData = req.body;
    userService.updateUser(userData);
  },
};
