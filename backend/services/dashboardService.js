const Labour = require("../models/Labour");
const Attendance = require("../models/Attendance");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const { calculateLabourSalary } = require("./salaryService");

const getDashboardData = async () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const totalWorkers = await Labour.countDocuments();

  const presentToday = await Attendance.countDocuments({
    date: today,
    status: "present",
  });

  const absentToday = await Attendance.countDocuments({
    date: today,
    status: "absent",
  });

  const leaveToday = await Attendance.countDocuments({
    date: today,
    status: "leave",
  });

  const totalProducts = await Product.countDocuments();

  const recentAttendance = await Attendance.find()
    .populate("worker", "name")
    .sort({ date: -1 })
    .limit(5);

  const recentPayments = await Payment.find()
    .populate("worker", "name")
    .sort({ paymentDate: -1 })
    .limit(5);

  const workers = await Labour.find();

  let pendingSalary = 0;

  for (const worker of workers) {
    const salary = await calculateLabourSalary(worker._id);
    pendingSalary += salary.remainingSalary;
  }

  const todayPayments = await Payment.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const advancePayments = await Payment.aggregate([
    {
      $match: {
        paymentType: "Advance",
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return {
    totalWorkers,
    presentToday,
    absentToday,
    leaveToday,
    totalProducts,

    todaySalaryExpense: todayPayments[0]?.total || 0,

    pendingSalary,

    advancePayments: advancePayments[0]?.total || 0,

    recentAttendance,

    recentPayments,
  };
};

module.exports = {
  getDashboardData,
};