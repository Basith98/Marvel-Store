const { response } = require("express");
const Product = require("./models/productSchema");
const ProductVariation = require("./models/productVariationSchema");
const mongoose = require("mongoose");
const async = require("hbs/lib/async");
const Color = require("./models/colorSchema");

module.exports = {
  getProduct: async (id) => {
    let product,
      colorId,
      colors,
      response = {};
    try {
      id.toString();
      product = await Product.aggregate([
        { $match: { recordStatusId: 1, _id: new mongoose.Types.ObjectId(id) } },
      ]);
      colorId = Array.prototype.slice
        .call(
          await Product.aggregate([
            {
              $match: {
                recordStatusId: 1,
                _id: new mongoose.Types.ObjectId(id),
              },
            },
            {
              $unwind: {
                path: "$colorAndSizeVariation",
              },
            },
            {
              $group: {
                _id: "$colorAndSizeVariation.colorId",
              },
            },
          ]),
          0
        )
        .map((element) => {
          console.log("cId", colorId);
          return element._id;
        });

      colors = await Color.find({
        _id: { $in: colorId },
      });

      product[0].colors = colors;
      return product;
    } catch (error) {
      console.log(error);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getProducts: async (categoryId) => {
    let products,
      response = {};
    try {
      if (categoryId > 0) {
      } else {
        products = await Product.aggregate([
          { $unwind: { path: "$images" } },
          { $match: { "images.fieldName": "mainImage", recordStatusId: 1 } },
        ]).sort({ createdAt: 1 });
      }
      return products;
    } catch (error) {
      console.log(e);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateProduct: async (product, NOSQLMode) => {
    let response = {};

    try {
      if (NOSQLMode === 1) {
        let products = new Product(
          ({
            productName,
            brandName,
            categoryId,
            outerMaterialType,
            description,
            images,
            colorAndSizeVariation,
            createdId,
            createdIp,
            recordStatusId,
          } = product)
        );

        await products.save();
        response.message = "Product details saved successfully";

        return response;
      } else if (NOSQLMode === 2) {
      } else if (NOSQLMode === 3) {
      }
      return response;
    } catch (e) {
      console.log(e);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },
};
