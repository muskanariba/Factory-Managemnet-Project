const { getDashboardData } = require("../services/dashboardService");
const ApiResponse = require("../utils/ApiResponse");

const dashboard = async (req, res, next) => {
  try {
    const data = await getDashboardData();

    ApiResponse.success(res, data, "Dashboard loaded");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  dashboard,
};