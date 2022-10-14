module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.originalUrl == "/placeOrder" || req.originalUrl == "/updateOrder") {
      req.session.originalUrl = "/order";
    } else {
      req.session.originalUrl = req.originalUrl;
    }
    req.session.user ? next() : res.render("user/loginAndSignUp/login");
  },

  isAdminLoggedIn: (req, res, next) => {
    if (req.originalUrl != "/admin/checklogin") {
      req.session.admin
        ? next()
        : res.render("admin/login/login", { noPartials: true });
    } else next();
  },
};
