var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../middlewares/loggedAuthentication");
const HomePageController = require("../controller/homePageController");
const UserController = require("../controller/userController");
const LoginController = require("../controller/loginController");
const ProductController = require("../controller/productController");
const CategoryController = require("../controller/categoryController");
const CartController = require("../controller/cartController");
const OptionDTOController = require("../controller/optionDTOController");
const OrderController = require("../controller/orderController");
const AddressController = require("../controller/addressController");
const CouponController = require("../controller/couponController");
const AccountController = require("../controller/accountController");

/* GET home page. */
router.get("/", HomePageController.homePageController);

//optionsDTO
router.post(
  "/getTotalAmountAndCount",
  OptionDTOController.getTotalAmountAndCount
);

//login&security
router.get(
  "/loginAndSecurity",
  isLoggedIn,
  AccountController.getLoginAndSecurity
);
router.post("/checkPassword", AccountController.checkPassword);
router.post(
  "/updateAccountdetails",
  isLoggedIn,
  AccountController.updateAccountDetails
);
router.get("/addressDetails", isLoggedIn, AccountController.getAddressDetails);

//User and Account
router.get("/account", isLoggedIn, UserController.getAccount);
router.post("/userRegister", UserController.updateUser);
router.post("/checkLogin", LoginController.checkLogin);
router.get("/signUpForm", LoginController.signUpForm);

//product
router.get("/productDetails/:id", ProductController.getProduct);
router.post("/sizeByColor", ProductController.getSizeByColor);

//Category
router.get(
  "/firstLevelCategory/:id",
  CategoryController.getFirstLevelCategoryAndProducts
);

//Cart
router.post("/updateCart", isLoggedIn, CartController.updateCart);
router.get("/cartDetails", isLoggedIn, CartController.getCarts);

//order
router.get("/order", isLoggedIn, OrderController.getOrder);
router.get(
  "/orderPaymentMethod/:id?",
  isLoggedIn,
  OrderController.getPaymentSections
);
router.post("/updateOrder", isLoggedIn, OrderController.updateOrder);
router.post("/placeOrder", isLoggedIn, OrderController.getplaceOrderSections);
router.post(
  "/verifyPayment",
  isLoggedIn,
  OrderController.verifyPaymentAndUpdateOrder
);
router.get("/orderDetails", isLoggedIn, OrderController.getOrderDetails);
router.post(
  "/orderBasedProduct",
  isLoggedIn,
  OrderController.orderBasedProduct
);
router.post("/cancelOrder", isLoggedIn, OrderController.cancelOrder);

//address
router.post("/updateAddress", AddressController.updateAddress);
router.post("/deleteAddress", AddressController.updateAddress);
//coupons
router.get("/couponDetails", isLoggedIn, CouponController.getCoupons);
router.post("/applyCode", CouponController.updateCoupon);
module.exports = router;
