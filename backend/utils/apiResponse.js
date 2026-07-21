// class ApiResponse {
//   constructor(statusCode, success, message, data = null) {
//     this.statusCode = statusCode;
//     this.success = success;
//     this.message = message;
//     this.data = data;
//   }
// }

// module.exports = ApiResponse;

class ApiResponse {
  constructor(statusCode, success, message, data = null) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(res, data, message = "Success", statusCode = 200) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, true, message, data));
  }

  static error(res, message = "Error", statusCode = 500) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, false, message));
  }
}

module.exports = ApiResponse;