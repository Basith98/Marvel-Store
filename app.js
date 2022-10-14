const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("express-handlebars");
const Handlebars = require("handlebars");
// const fileUpload = require("express-fileupload");
const session = require("express-session");
const {
  isAdminLoggedIn,
} = require("./src/modules/middlewares/loggedAuthentication");
const adminRouter = require("./src/modules/admin/routes/admin");
const usersRouter = require("./src/modules/user/routes/user");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const app = express();
// view engine setup

const exphbs = hbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: `${__dirname}/views/layouts/`,
  partialsDir: `${__dirname}/views/partials/`,
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine("hbs", exphbs.engine);
// app.engine(
//   "hbs",
//   hbs.engine({
//     extname: "hbs",
//     defaultLayout: "layout",
//     layoutsDir: `${__dirname}/views/layouts/`,
//     partialsDir: `${__dirname}/views/partials/`,
//   })
// );
//
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(fileUpload());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "keyboard cat", cookie: { maxAge: 600000 } }));
app.use((req, res, next) => {
  res.set("cache-control", "no-store");
  next();
});

app.use("/admin", isAdminLoggedIn, adminRouter);
app.use("/", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
