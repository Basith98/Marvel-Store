const { response } = require("express");
const Cart = require("./models/cartSchema");
const Product = require("../../../admin/repository/noSqlRepository/models/productSchema");
const async = require("hbs/lib/async");
const mongoose = require("mongoose");

module.exports = {
  getCarts: async (userId) => {
    let response = {};
    try {
      console.log(userId);
      let cart = await Cart.aggregate([
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
            "products.recordStatusId": 1,
            "products.saveForLaterStatus": false,
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
        {
          $sort: {
            createdAt: -1,
            updatedAt: -1,
          },
        },
      ]);
      console.log("================================", cart);

      let saveForLater = await Cart.aggregate([
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
            "products.recordStatusId": 1,
            "products.saveForLaterStatus": true,
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
          $addFields: {
            eachTotal: {
              $multiply: ["$products.quantity", "$productDetails.price"],
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
            updatedAt: -1,
          },
        },
      ]);
      response.saveForLater = saveForLater;
      response.cart = cart;
      // response.totalCount = totalCount;
      console.log("cart", response);
      return response;
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },

  getOneCartProductDetails: async (product) => {
    let cart = await Cart.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(product.userId),
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
          "products.productId": product.productId,
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
        $addFields: {
          eachTotal: {
            $multiply: ["$products.quantity", "$productDteails.price"],
          },
        },
      },
    ]);
    console.log("singlecart", cart);

    return cart;
  },

  updateCart: async (product, NOSQLMode) => {
    let response = {};
    try {
      // create session
      if (NOSQLMode === 1) {
        let userId = product.userId;
        product.saveForLaterStatus = false;
        product.selectedStatus = true;
        product.recordStatusId = 1;

        // update quantity increment or decrement from cart page
        if (product.quantityUpdateStatus) {
          await Cart.findOneAndUpdate(
            {
              userId: new mongoose.Types.ObjectId(userId),
              recordStatusId: 1,
              products: {
                $elemMatch: {
                  productId: new mongoose.Types.ObjectId(product.productId),
                  colorId: new mongoose.Types.ObjectId(product.colorId),
                  sizeId: new mongoose.Types.ObjectId(product.sizeId),
                  recordStatusId: 1,
                },
              },
            },
            {
              $set: { "products.$.quantity": product.quantity },
            }
          );
        }
        // add or readd product to cart session.
        else {
          // check user is exist
          let isUserExist = await Cart.findOne({
            userId: new mongoose.Types.ObjectId(userId, product.productId),
            recordStatusId: 1,
          });

          if (isUserExist) {
            // check product is already in cart session if it exists, increment quantity;
            let productExist = await Cart.findOneAndUpdate(
              {
                userId: new mongoose.Types.ObjectId(userId),
                recordStatusId: 1,
                products: {
                  $elemMatch: {
                    productId: new mongoose.Types.ObjectId(product.productId),
                    colorId: new mongoose.Types.ObjectId(product.colorId),
                    sizeId: new mongoose.Types.ObjectId(product.sizeId),
                    recordStatusId: 1,
                  },
                },
              },
              {
                $inc: { "products.$.quantity": product.quantity },
                "products.$.saveForLaterStatus": false,
              }
            );
            // if product does not exist, create it;
            isUserExist.products.push(product);
            console.log("Product", isUserExist);
            productExist ?? (await isUserExist.save());
          }

          //if user doesn't exist, create it
          else {
            await Cart.create({
              userId: product.userId,
              products: product,
            }).then((res, err) => {
              err
                ? ((response.returnStatus = false), console.log("err", err))
                : ((response.message = "Cart details saved successfully"),
                  (response.returnStatus = true));
            });
          }
        }

        return response;
      }

      //update session
      else if (NOSQLMode === 2) {
        try {
          await Cart.findOneAndUpdate(
            {
              userId: new mongoose.Types.ObjectId(product.userId),
              recordStatusId: 1,
              products: {
                $elemMatch: {
                  _id: new mongoose.Types.ObjectId(product.Id),
                  recordStatusId: 1,
                },
              },
            },
            {
              $set: {
                "products.$.saveForLaterStatus": product.saveForLaterStatus,
                "products.$.selectProductStatus": product.selectProductStatus,
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
        await Cart.findOneAndUpdate(
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

  getTotalAmountAndCount: async (userId) => {
    let response = {};
    try {
      let totalAmount = await Cart.aggregate([
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
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$eachTotal",
            },
            totalCount: {
              $sum: "$recordStatusId",
            },
          },
        },
        // {
        //   $project: {
        //     eachTotal: {
        //       $multiply: ["$products.quantity", "$productDetails.price"],
        //     },
        //   },
        // },
        // {
        //   $group: {
        //     _id: null,
        //     totalAmount: {
        //       $sum: "$eachTotal",
        //     },
        //   },
        // },
      ]);

      console.log("yuu", totalAmount);

      let selectedSubTotalCount = await Cart.aggregate([
        [
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              recordStatusId: 1,
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
            $group: {
              _id: "$userId",
              totalCount: {
                $sum: "$products.quantity",
              },
            },
          },
        ],
      ]);

      console.log("totalcount", totalAmount);
      response.selectedSubTotalCount = selectedSubTotalCount[0]?.totalCount;
      response.totalCount = totalAmount[0]?.totalCount;
      response.totalAmount = totalAmount[0]?.totalAmount;
      return response;
    } catch (err) {
      console.error(err);
      response.returnStatus = false;
      response.message = err.message;
      return response;
    }
  },
};
