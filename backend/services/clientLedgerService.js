const Client = require("../models/Client");
const ClientPayment = require("../models/ClientPayment");

const getClientLedger = async (clientId) => {
  const client = await Client.findById(clientId);

  if (!client) {
    throw new Error("Client not found");
  }

  const ledger = [];

  let balance = Number(client.openingBalance || 0);

  // Opening Balance
  ledger.push({
    date: client.createdAt,
    description: "Opening Balance",
    type: "opening",
    debit: balance,
    credit: 0,
    balance,
  });

  // Payments
  const payments = await ClientPayment.find({
    client: clientId,
    status: "active",
  }).sort({ paymentDate: 1 });

  for (const payment of payments) {
    balance -= Number(payment.amount);

    ledger.push({
      _id: payment._id,
      date: payment.paymentDate,
      description: `Payment (${payment.paymentMethod})`,
      type: "payment",
      debit: 0,
      credit: payment.amount,
      balance,
      reference: payment.reference,
      notes: payment.notes,
    });
  }

  return ledger;
};

module.exports = {
  getClientLedger,
};