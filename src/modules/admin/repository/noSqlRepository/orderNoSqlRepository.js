const { response } = require("express");
const Order = require("../../../user/repository/noSqlRepository/models/orderSchema");
var arrayToTree = require("array-to-tree");
const mongoose = require("mongoose");
const async = require("hbs/lib/async");
const OrderStatus = require("../../../user/repository/noSqlRepository/models/orderStatusSchema");

module.exports = {
  getOrder: async (id) => {
    try {
      let response = {};
      let result = await Order.findOne({ Id: id });
      let parentName = await Order.findOne({ Id: result.parent });
      response.parentName = parentName.name;
      console.log("result", result);
      response.order = result;
      response.returnStatus = true;
      return response;
    } catch (e) {
      console.error(e.message);
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  getOrders: async () => {
    try {
      console.log("getParentCategories");
      let response = {};
      let Orders = await Order.aggregate([
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

      let lastWeekOrder = await Order.find({
        currentStatus: "delivered",
        updatedAt: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
      });

      response.lastWeekOrder = lastWeekOrder;
      response.orders = Orders;
      response.returnStatus = true;
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      return response;
    }
  },

  updateOrder: async (order, NOSQLMode) => {
    let response = {};
    try {
      //insert
      if (NOSQLMode === 1) {
        let paymentStatus,
          status = order.status;
        await Order.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(order.orderId),
          },
          { $set: { currentStatus: status } }
        );

        let orderStatusState = { status: true, byPassStatus: 1 };
        orderStatusState[`${status}.$.status`] = true; // update some other field based on status.
        let query = {};
        query[status] = orderStatusState;
        await OrderStatus.findOneAndUpdate(
          {
            orderId: new mongoose.Types.ObjectId(order.orderId),
          },
          { $push: query }
        );
        return response;
      }

      //update
      else if (NOSQLMode === 2) {
        Order.findOneAndUpdate(
          { Id: order.Id },
          {
            $set: {
              order: order.order,
              orderMap: order.orderMap,
              description: order.description,
              modifiedIp: order.createdIp,
              modifiedId: order.createdId,
              recordStatusId: 1,
            },
          }
        );
        response.returnStatus = true;
        response.message = "order details updated successfully";
      }

      //delete
      else if (NOSQLMode === 3) {
        Order.findOneAndUpdate(
          { Id: order.Id },
          {
            $set: {
              modifiedIp: order.createdIp,
              modifiedId: order.createdId,
              recordStatusId: 3, //Mark us deleted
            },
          }
        );
        response.returnStatus = true;
        response.message = "order details deleted successfully";
      }
      return response;
    } catch (e) {
      response.returnStatus = false;
      response.message = e.message;
      console.error(e);
      return response;
    }
  },
};
