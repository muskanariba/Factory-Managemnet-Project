const saleService = require("../services/saleService");
const ApiResponse = require("../utils/ApiResponse");

const createSale = async (req, res, next) => {
  try {
    const sale = await saleService.createSale(req.body, req.user._id);

    res
      .status(201)
      .json(new ApiResponse(201, sale, "Sale created successfully"));
  } catch (error) {
    next(error);
  }
};

const getSales = async (req, res, next) => {
  try {
    const sales = await saleService.getSales();

    res
      .status(200)
      .json(new ApiResponse(200, sales, "Sales fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getSaleById = async (req, res, next) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, sale, "Sale fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const updateSale = async (req, res, next) => {
  try {
    const sale = await saleService.updateSale(req.params.id, req.body);

    res
      .status(200)
      .json(new ApiResponse(200, sale, "Sale updated successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteSale = async (req, res, next) => {
  try {
    await saleService.deleteSale(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Sale deleted successfully"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};