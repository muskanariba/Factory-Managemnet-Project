import mongoose from "mongoose";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";

/**
 * Get All Stock Movements
 */
export const getStockMovements = async (filters = {}) => {
  const query = {
    isDeleted: false,
  };

  if (filters.product) {
    query.product = filters.product;
  }

  if (filters.stockType) {
    query.stockType = filters.stockType;
  }

  if (filters.movementType) {
    query.movementType = filters.movementType;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return await StockMovement.find(query)
    .populate("product", "productName productCode color")
    .populate("createdBy", "name")
    .sort({ movementDate: -1 });
};

/**
 * Get Single Stock Movement
 */
export const getStockMovementById = async (id) => {
  const movement = await StockMovement.findById(id)
    .populate("product")
    .populate("createdBy", "name");

  if (!movement || movement.isDeleted) {
    throw new Error("Stock movement not found.");
  }

  return movement;
};

/**
 * Create Stock Movement
 */
export const createStockMovement = async (data, userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await Product.findById(data.product).session(session);

    if (!product) {
      throw new Error("Product not found.");
    }

    let updatedStock = product.currentStock;

    switch (data.movementType) {
      case "Purchase":
      case "Receive":
      case "Adjustment":
        updatedStock += data.quantity;
        break;

      case "Issue":
      case "Production":
      case "Sale":
        if (updatedStock < data.quantity) {
          throw new Error("Insufficient stock available.");
        }

        updatedStock -= data.quantity;
        break;

      default:
        throw new Error("Invalid movement type.");
    }

    product.currentStock = updatedStock;

    await product.save({ session });

    const movement = await StockMovement.create(
      [
        {
          ...data,
          balanceAfterTransaction: updatedStock,
          createdBy: userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return movement[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Update Stock Movement
 * (Business logic will be added after Sales & Production modules)
 */
export const updateStockMovement = async () => {
  throw new Error("Update Stock Movement will be implemented later.");
};

/**
 * Cancel Stock Movement
 * (Instead of deleting records)
 */
export const cancelStockMovement = async (id) => {
  const movement = await StockMovement.findById(id);

  if (!movement) {
    throw new Error("Stock movement not found.");
  }

  movement.status = "Cancelled";

  await movement.save();

  return movement;
};

/**
 * Soft Delete
 */
export const deleteStockMovement = async (id) => {
  const movement = await StockMovement.findById(id);

  if (!movement) {
    throw new Error("Stock movement not found.");
  }

  movement.isDeleted = true;
  movement.deletedAt = new Date();

  await movement.save();

  return movement;
};

/**
 * Low Stock Products
 */
export const getLowStockProducts = async () => {
  return await Product.find({
    currentStock: {
      $lte: "$minimumStock",
    },
  });
};

/**
 * Stock History
 */
export const getStockHistory = async (productId) => {
  return await StockMovement.find({
    product: productId,
    isDeleted: false,
  })
    .sort({
      movementDate: -1,
    })
    .populate("createdBy", "name");
};