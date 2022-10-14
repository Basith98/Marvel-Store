const { response } = require("express");
const Order = require("./models/orderSchema");
const Product = require("../../../admin/repository/noSqlRepository/models/productSchema");
const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const Cart = require("./models/cartSchema");
const OrderStatus = require("./models/orderStatusSchema");
const Payment = require("./models/paymentSchema");
const Address = require("./models/addressSchema");
const UserCoupon = require("./models/userCouponSchema");
const Coupon = require("../../../admin/repository/noSqlRepository/models/couponSchema");

module.exports = {
  getOrders: async (userId) => {
    let response = {};
    try {
      console.log(userId);
      let Orders = await Order.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "addressId",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "orderId",
            as: "payment",
          },
        },
        {
          $sort: {
            createdAt: -1,
            updatedAt: -1,
          },
        },
      ]);
      response.Orders = Orders;
      // response.totalCount = totalCount;
      console.log("order", response);
      return response;
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  orderBasedProduct: async (OrderId) => {
    let response = {};
    try {
      let orderedProducts = await Order.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(OrderId),
          },
        },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails.colorAndSizeVariation",
          },
        },
        {
          $match: {
            $and: [
              {
                $expr: {
                  $eq: [
                    "$products.sizeId",
                    "$productDetails.colorAndSizeVariation.sizeId",
                  ],
                },
              },
              {
                $expr: {
                  $eq: [
                    "$products.colorId",
                    "$productDetails.colorAndSizeVariation.colorId",
                  ],
                },
              },
            ],
          },
        },
        {
          $addFields: {
            eachTotal: {
              $multiply: [
                "$products.quantity",
                "$productDetails.colorAndSizeVariation.Price",
              ],
            },
          },
        },
        {
          $lookup: {
            from: "sizes",
            localField: "products.sizeId",
            foreignField: "_id",
            as: "sizes",
          },
        },
        {
          $lookup: {
            from: "colors",
            localField: "products.colorId",
            foreignField: "_id",
            as: "colors",
          },
        },
      ]);
      response.orderedProducts = orderedProducts;
      return response;
    } catch (err) {
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  getCartProductsAndUpdateCart: async (userId) => {
    try {
      let productDetails = Array.prototype.slice
        .call(
          await Cart.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
              },
            },
            {
              $unwind: {
                path: "$products",
              },
            },
            {
              $match: {
                "products.selectProductStatus": true,
                "products.saveForLaterStatus": false,
                recordStatusId: 1,
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "productDteails",
              },
            },
            {
              $unwind: {
                path: "$productDteails",
              },
            },
            {
              $unwind: {
                path: "$productDteails.colorAndSizeVariation",
              },
            },
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: [
                        "$products.sizeId",
                        "$productDteails.colorAndSizeVariation.sizeId",
                      ],
                    },
                  },
                  {
                    $expr: {
                      $eq: [
                        "$products.colorId",
                        "$productDteails.colorAndSizeVariation.colorId",
                      ],
                    },
                  },
                ],
              },
            },

            {
              $addFields: {
                eachTotal: {
                  $multiply: [
                    "$products.quantity",
                    "$productDteails.colorAndSizeVariation.Price",
                  ],
                },
              },
            },
          ]),
          0
        )
        .map((element) => {
          return {
            productId: element.products.productId,
            colorId: element.products.colorId,
            sizeId: element.products.sizeId,
            quantity: element.products.quantity,
            amount: element.eachTotal,
          };
        });

      // await Cart.update(
      //   {
      //     userId: new mongoose.Types.ObjectId("631b1a462b94a448c455b357"),
      //   },
      //   {
      //     $push: {
      //       "products.$[elem]": {
      //         recordStatusId: 4,

      //       },
      //     },
      //   },
      //   {
      //     multi: true,
      //     arrayFilters: [
      //       {
      //         "elem.saveForLaterStatus": {
      //           $eq: false,
      //         },
      //         "elem.selectProductStatus": {
      //           $eq: true,
      //         },
      //       },
      //     ],
      //   }
      // );

      // await Cart.Update(
      //   {
      //     userId: new mongoose.Types.ObjectId(userId),
      //     products: {
      //       $elemMatch: {
      //         selectProductStatus: true,
      //       },
      //     },
      //   },
      //   {
      //     $set: { "products.$.recordStatusId": 4 },
      //   }
      // );

      console.log("productDetails", productDetails);
      return productDetails;

      // return productDetails;
    } catch (err) {
      console.error(err);
      return (returnStatus = false);
    }
  },

  getplaceOrderSections: async (data) => {
    let response = {};
    try {
      let address = await Address.find({
        _id: new mongoose.Types.ObjectId(data.addressId),
      });
      let orderedProducts = await Cart.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(data.userId),
          },
        },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $match: {
            "products.recordStatusId": 1,
            "products.saveForLaterStatus": false,
            "products.selectProductStatus": true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDteails",
          },
        },
        {
          $unwind: {
            path: "$productDteails",
          },
        },
        {
          $unwind: {
            path: "$productDteails.colorAndSizeVariation",
          },
        },
        {
          $match: {
            $and: [
              {
                $expr: {
                  $eq: [
                    "$products.sizeId",
                    "$productDteails.colorAndSizeVariation.sizeId",
                  ],
                },
              },
              {
                $expr: {
                  $eq: [
                    "$products.colorId",
                    "$productDteails.colorAndSizeVariation.colorId",
                  ],
                },
              },
            ],
          },
        },

        {
          $addFields: {
            eachTotal: {
              $multiply: [
                "$products.quantity",
                "$productDteails.colorAndSizeVariation.Price",
              ],
            },
          },
        },
        {
          $lookup: {
            from: "sizes",
            localField: "products.sizeId",
            foreignField: "_id",
            as: "sizes",
          },
        },
        {
          $lookup: {
            from: "colors",
            localField: "products.colorId",
            foreignField: "_id",
            as: "colors",
          },
        },
      ]);
      response.address = address;
      response.orderedProducts = orderedProducts;
      return response;
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  cancelOrder: async (orderId) => {
    let response;
    try {
      let status = "Cancelled";
      await Order.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(orderId),
        },
        { $set: { currentStatus: status } }
      );

      let orderStatusState = { status: true, byPassStatus: 1 };
      await OrderStatus.findOneAndUpdate(
        {
          orderId: new mongoose.Types.ObjectId(orderId),
        },
        { $push: { Cancelled: orderStatusState } }
      );
      return response;
    } catch (err) {
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  updateOrder: async (orderDetails, NOSQLMode) => {
    let response = {};
    try {
      if (NOSQLMode === 1) {
        let orderStatus = {};
        if (orderDetails.paymentMethod === "cod") {
          orderDetails.currentStatus = "orderConfirmed";
        }
        await Order.create({ ...orderDetails }).then((res) => {
          orderStatus.orderId = res._id;
          orderStatus[res.currentStatus] = new Array();
          orderStatus[res.currentStatus].push({ status: true });
        });

        await OrderStatus.create({ ...orderStatus });

        await Payment.create({
          orderId: orderStatus.orderId,
          paymentMethod: orderDetails.paymentMethod,
          amount: orderDetails.totalUnitPrice,
          status: "pending",
        });
        response.orderId = orderStatus.orderId;

        return response;
      } else if (NOSQLMode === 2) {
        try {
          let paymentStatus,
            status = "orderConfirmed";
          paymentStatus = "completed";

          let totalUnitPrice = orderDetails.order.amount / 100;

          let eligibleCoupon = await Coupon.aggregate([
            {
              $match: {
                minimumPurchase: {
                  $lt: totalUnitPrice,
                },
              },
            },
            {
              $lookup: {
                from: "usercoupons",
                let: {
                  couponId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: [
                              "$userId",
                              mongoose.Types.ObjectId(orderDetails.userId),
                            ],
                          },
                          {
                            $gte: ["$couponId", "$$couponId"],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: "results",
              },
            },
            {
              $match: {
                "results.0": {
                  $exists: false,
                },
              },
            },
            {
              $addFields: {
                userId: mongoose.Types.ObjectId(orderDetails.userId),
                status: "pending",
                couponId: "$_id",
              },
            },
            {
              $project: {
                userId: 1,
                status: 1,
                couponId: 1,
                _id: 0,

                year: {
                  $year: "$startDate",
                },
                month: {
                  $month: "$startDate",
                },
                day: {
                  $dayOfMonth: "$startDate",
                },
              },
            },
            {
              $match: {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1, //because January starts with 0
                day: new Date().getDate(),
              },
            },
          ]);

          if (eligibleCoupon.length > 0) {
            await UserCoupon.create(eligibleCoupon);
          }

          await Order.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(orderDetails.order.receipt),
            },
            { $set: { currentStatus: status } }
          );

          let orderStatusState = { status: true, byPassStatus: 1 };
          orderStatusState[`${status}.$.status`] = true; // update some other field based on status.
          let obj = {};
          await OrderStatus.findOneAndUpdate(
            {
              orderId: new mongoose.Types.ObjectId(orderDetails.order.receipt),
            },
            { $push: { orderConfirmed: orderStatusState } }
          );

          let paymentObj = {};
          await Payment.findOneAndUpdate(
            {
              orderId: new mongoose.Types.ObjectId(orderDetails.order.receipt),
            },
            {
              $set: {
                payment_id: orderDetails.payment.razorpay_payment_id,
                signature: orderDetails.payment.razorpay_signature,
                paymentStatus: paymentStatus,
                status: paymentStatus,
              },
            }
          );

          return response;
        } catch (err) {
          response.returnStatus = false;
          response.message = err.message;
          return response;
        }
      } else if (NOSQLMode === 3) {
        console.log("NOSQL mode", NOSQLMode);
        await Order.findOneAndUpdate(
          {
            $and: [
              { userId: product.userId },
              { "products._id": new mongoose.Types.ObjectId(product.id) },
            ],
          },
          { $set: { "products.$.recordStatusId": 3 } }
        ).then((res, err) => {
          err
            ? (response.returnStatus = false)
            : (response.returnStatus = true);
          console.log("res", res);
        });
      }
      return response;
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },
};
