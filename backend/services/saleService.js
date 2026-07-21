const Sale = require("../models/Sale");
const Client = require("../models/Client");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const ClientLedger = require("../models/ClientLedger");

const generateInvoiceNumber = async () => {
  const lastSale = await Sale.findOne().sort({ createdAt: -1 });

  if (!lastSale) return "INV-00001";

  const lastNumber = parseInt(
    lastSale.invoiceNumber.replace("INV-", ""),
    10
  );

  return `INV-${String(lastNumber + 1).padStart(5, "0")}`;
};

const createSale = async (data, userId) => {
  const invoiceNumber = await generateInvoiceNumber();

  const items = [];

  let subtotal = 0;

  for (const item of data.items) {
    const amount =
      Number(item.quantity) * Number(item.rate);

    subtotal += amount;

    items.push({
      product: item.product,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      amount,
    });

    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -Number(item.quantity),
      },
    });

    await StockMovement.create({
      product: item.product,
      type: "OUT",
      quantity: Number(item.quantity),
      referenceType: "Sale",
      remarks: invoiceNumber,
      createdBy: userId,
    });
  }

  const discount = Number(data.discount || 0);

  const grandTotal = subtotal - discount;

  const paidAmount = Number(data.paidAmount || 0);

  const dueAmount = grandTotal - paidAmount;

  const status =
    dueAmount <= 0
      ? "Paid"
      : paidAmount > 0
      ? "Partial"
      : "Unpaid";

  const sale = await Sale.create({
    invoiceNumber,
    client: data.client,
    invoiceDate: data.invoiceDate,
    items,
    subtotal,
    discount,
    grandTotal,
    paidAmount,
    dueAmount,
    status,
    notes: data.notes,
    createdBy: userId,
  });

  const client = await Client.findById(data.client);

  const totalPurchases =
    Number(client.totalPurchases || 0) + grandTotal;

  const totalPayments =
    Number(client.totalPayments || 0) + paidAmount;

  const outstandingBalance =
    Number(client.openingBalance || 0) +
    totalPurchases -
    totalPayments;

  await Client.findByIdAndUpdate(data.client, {
    totalPurchases,
    totalPayments,
    outstandingBalance,
  });

  await ClientLedger.create({
    client: data.client,
    type: "Sale",
    description: invoiceNumber,
    referenceId: sale._id,
    invoiceNumber,
    debit: grandTotal,
    credit: paidAmount,
    balance: outstandingBalance,
    createdBy: userId,
  });

  return sale;
};

const getSales = async () => {
  return await Sale.find()
    .populate("client", "clientName")
    .populate("items.product", "productName")
    .sort({ createdAt: -1 });
};

const getSaleById = async (id) => {
  return await Sale.findById(id)
    .populate("client")
    .populate("items.product");
};

const updateSale = async (id, data) => {
  return await Sale.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const deleteSale = async (id) => {
  return await Sale.findByIdAndDelete(id);
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};