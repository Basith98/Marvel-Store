const CartService = require("../BLL/cartService");
const CategoryService = require("../BLL/categoryService");
const OrderService = require("../BLL/orderService");
const AddressService = require("../BLL/addressService");
const RazorPay = require("../../../shared/providers/razorPay");
const CouponService = require("../BLL/couponService");

module.exports = {
  getOrderDetails: async (req, res) => {
    try {
      let categoryId = 0,
        userId = req.session.userId;
      let category = await CategoryService.getParentCategories(categoryId);
      let response = await OrderService.getOrders(userId);
      let confirmedOrders = response.Orders.filter(
        (order) =>
          order.currentStatus !== "delivered" &&
          order.currentStatus !== "Cancelled"
      );

      let deliveredOrders = response.Orders.filter(
        (order) => order.currentStatus === "delivered"
      );

      let cancelOrders = response.Orders.filter(
        (order) => order.currentStatus === "Cancelled"
      );

      console.log(confirmedOrders);
      res.render("user/order/orderList", {
        category: category.parentCategories,
        confirmedOrders: confirmedOrders,
        deliveredOrders: deliveredOrders,
        cancelOrders: cancelOrders,
      });
    } catch (err) {
      console.log(err);
      res.render("/error");
    }
  },

  orderBasedProduct: async (req, res) => {
    try {
      let response = await OrderService.orderBasedProduct(req.body.orderId);
      res.json(response.orderedProducts);
    } catch (err) {
      console.log(err);
      res.render("/error");
    }
  },

  getOrder: async (req, res) => {
    try {
      let address = {};
      console.log("getOrder");
      address.userId = req.session.userId;
      let addresses = await AddressService.getAddresses(address);
      console.log("address: " + addresses);
      res.render("user/order/deliveryAddressSection", {
        noPartials: true,
        addresses,
      });
    } catch (err) {
      res.render("/error", { message: err.message });
    }
  },

  getplaceOrderSections: async (req, res) => {
    let orderId = req.params.id;
    req.session.paymentMethod = req.body.paymentMethod;
    let data = {
      addressId: req.session.addressId,
      userId: req.session.userId,
    };
    let response = await OrderService.getplaceOrderSections(data);
    let totalAmountAndCount = await CartService.getTotalAmountAndCount(
      data.userId
    );
    console.log("ORD", response.orderedProducts);
    res.render("user/order/placeOrderSection", {
      orderDetails: response.orderedProducts,
      address: response.address[0],
      noPartials: true,
      paymentMethod: req.session.paymentMethod,
      subTotal: totalAmountAndCount.totalAmount,
    });
  },

  getPaymentSections: async (req, res) => {
    req.session.addressId = req.params.id;
    console.log("getPaymentSections", req.session.addressId);
    res.render("user/order/paymentMethodSection", {
      noPartials: true,
    });
  },

  updateOrder: async (req, res) => {
    try {
      let totalAmount,
        totalDiscount,
        couponStatus = false;
      let addressId = req.session.addressId;
      let userId = req.session.userId;

      let orderedProducts = await OrderService.getCartProductsAndUpdateCart(
        userId
      );
      let totalAmountAndCount = await CartService.getTotalAmountAndCount(
        userId
      );
      totalAmount = totalAmountAndCount.totalAmount;

      if (req.body.couponId) {
        let result = await CouponService.getCoupon(req.body.couponId);
        result.coupon[0].userId = userId;
        let response = await CouponService.updateCoupon(result.coupon);
        result.coupon.map((elem) => {
          couponStatus = true;
          totalAmount -= elem.discountAmount;
          totalDiscount += elem.discountAmount;
          totalAmount = totalAmount < 0 ? 0 : totalAmount;
        });
      }

      let orderDetails = {
        userId: userId,
        addressId: addressId,
        paymentMethod: req.session.paymentMethod,
        totalUnitPrice: totalAmount,
        products: orderedProducts,
        currentStatus: req.body.currentStatus,
        couponStatus: couponStatus,
        orderConfirmationUserEmail: "abdulbasith199814@gmail.com",
      };
      let response = await OrderService.updateOrder(orderDetails);
      console.log(response.orderId);
      if (response?.returnStatus === false) {
      }
      if (req.session.paymentMethod === "onlinePayment" && totalAmount > 0) {
        let order = await RazorPay.generatorRazorPay(
          response.orderId,
          totalAmount
        );
        res.json(order);
      } else {
        res.json({
          codStatus: true,
        });
      }
    } catch (err) {
      console.log("e", err);
      res.render("/error", { message: err.message });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      let response = await OrderService.cancelOrder(req.body.orderId);
      if (response.returnStatus === false) {
        return res.json({ status: false });
      }
      res.json({ status: true });
    } catch (err) {
      res.render("error", { message: err.message });
    }
  },

  verifyPaymentAndUpdateOrder: async (req, res) => {
    try {
      let orderDetails = {
        order: req.body.order,
        payment: req.body.payment,
        Id: 1,
        userId: req.session.userId,
      };
      let response = await OrderService.updateOrder(orderDetails);
      if (response.returnStatus == false) {
      }
      res.json({ status: true });
    } catch (err) {
      res.render("error", { message: err.message });
    }
  },
};
