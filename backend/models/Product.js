const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      enum: ["Raw Material", "Finished Product"],
      required: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      enum: ["Kg", "Piece", "Box", "Litre", "Packet", "Meter", "Roll"],
      required: true,
    },

    stockType: {
      type: String,
      enum: ["Local", "Imported"],
      required: true,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumStock: {
      type: Number,
      default: 5,
      min: 0,
    },

    status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},

isDeleted: {
  type: Boolean,
  default: false,
},

deletedAt: {
  type: Date,
  default: null,
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ productName: 1 });
productSchema.index({ productCode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ stockType: 1 });

module.exports = mongoose.model("Product", productSchema);