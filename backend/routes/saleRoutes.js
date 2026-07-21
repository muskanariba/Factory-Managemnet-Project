const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const saleController = require("../controllers/saleController");

router.use(authMiddleware);

router.post("/", saleController.createSale);

router.get("/", saleController.getSales);

router.get("/:id", saleController.getSaleById);

router.put("/:id", saleController.updateSale);

router.delete("/:id", saleController.deleteSale);

module.exports = router;