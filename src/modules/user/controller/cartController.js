const CategoryService = require("../BLL/categoryService");
const CartService = require("../BLL/cartService");

module.exports = {
  getCarts: async (req, res) => {
    try {
      let response,
        category,
        totalAmountAndCount,
        cartStatus,
        isCartAndSaveLaterEmpty,
        userId = "631b1a462b94a448c455b357";
      cartStatus = true;
      response = await CartService.getCarts(userId);
      category = await CategoryService.getParentCategories(0);
      totalAmountAndCount = await CartService.getTotalAmountAndCount(userId);
      console.log("response", response.cart);
      if (response.returnStatus === false) {
        res.render("/error", { message: response.message });
      }
      cartStatus = response.cart.length > 0 ? true : false;
      isCartAndSaveLaterEmpty =
        response.cart.length > 0 || response.saveForLater.length > 0
          ? true
          : false;

      res.render("user/cart/cartList", {
        category: category.parentCategories,
        cartProducts: response.cart,
        saveForLater: response.saveForLater,
        totalCount: totalAmountAndCount.totalCount,
        totalAmount: totalAmountAndCount.totalAmount,
        selectedSubTotalCount: totalAmountAndCount.selectedSubTotalCount,
        isCartAndSaveLaterEmpty,
        cartStatus,
      });
    } catch (err) {
      res.render("/error", { message: err.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      let totalCount, totalAmount, cartStatus, product;
      product = req.body;
      product.userId = "631b1a462b94a448c455b357";
      console.log("product ", product);
      let response = await CartService.updateCart(product);
      let singlecart = await CartService.getOneCartProductDetails(product);
      let totalAmountAndCount = await CartService.getTotalAmountAndCount(
        product.userId
      );
      console.log("singlecart", singlecart);
      if (response?.returnStatus === false) {
      }
      cartStatus = totalAmountAndCount.totalCount ?? false;

      res.json({
        response,
        totalCount: totalAmountAndCount.totalCount,
        totalAmount: totalAmountAndCount.totalAmount,
        selectedSubTotalCount: totalAmountAndCount.selectedSubTotalCount,
        cartStatus,
      });
    } catch (err) {
      console.log("e", err);
      res.render("/error", { message: err.message });
    }
  },
};
