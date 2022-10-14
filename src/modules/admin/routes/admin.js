const express = require("express");
const router = express.Router();
const multer = require("multer");
const DashboardController = require("../controller/dashboardController");
const UserController = require("../controller/userController");
const CategoryController = require("../controller/categoryController");
const ProductController = require("../controller/productController");
const OptionDTOController = require("../controller/optionDTOController");
const ColorController = require("../controller/colorController");
const SizeController = require("../controller/sizeController");
const BrandController = require("../controller/brandController");
const CouponController = require("../controller/couponController");
const OrderController = require("../controller/orderController");
const LoginController = require("../controller/loginController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", DashboardController.dashboardController);
router.get("/login", LoginController.getLoginPage);
router.post("/checklogin", LoginController.checkLogin);
router.get("/logout", LoginController.logOut);

//OPTION-DTO
router.get("/parentCategories", OptionDTOController.getParentCategories);
router.get("/sizesDTO", OptionDTOController.getSizes);
router.get("/colorDTO", OptionDTOController.getColors);

//USER
router.get("/user", UserController.getUsers);
router.get("/userDetails", UserController.getUser);
router.post("/updateUser", upload.single("image"), UserController.updateUser);

//CATEGORY
router.get("/categorylist", CategoryController.getCategoryPage);
router.get("/category", CategoryController.getCategories);
router.get("/categoryDetails/:id?", CategoryController.getCategory);
router.post(
  "/updateCategory",
  upload.any("Image"),
  CategoryController.updateCategory
);

//PRODUCT
router.get("/product", ProductController.getProducts);
router.get("/productDetails/:id?", ProductController.getProduct);
router.post(
  "/updateProduct",
  upload.any("Image"),
  ProductController.updateProduct
);

//BRAND
router.get("/brand", BrandController.getBrand);
router.get("/brands", BrandController.getBrands);
router.post("/updateBrand", BrandController.updateBrand);

//SIZE
router.get("/size", SizeController.getSize);
router.get("/sizeDetails", SizeController.getSizes);
router.post("/updateSize", SizeController.updateSize);

//COLOR
router.get("/color", ColorController.getColor);
router.get("/colorDetails", ColorController.getColors);
router.post("/updateColor", ColorController.updateColor);

//Order
router.get("/orders", OrderController.getOrders);
router.post("/updateStatus", OrderController.updateOrder);

//coupon
router.get("/coupon", CouponController.getCoupons);
router.get("/couponDetails", CouponController.getCoupon);
router.post("/updateCoupon", CouponController.updateCoupon);

module.exports = router;
