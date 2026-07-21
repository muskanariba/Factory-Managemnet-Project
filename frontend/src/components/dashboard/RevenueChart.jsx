import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

function RevenueChart({ dashboard }) {
  const amount = dashboard?.todaySalaryExpense || 0;

  const data = [
    {
      name: "Today",
      revenue: amount,
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Today's Payments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Salary payments processed today
          </p>

        </div>

        <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">

            <TrendingUp
              size={18}
              className="text-blue-700"
            />

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Total
            </p>

            <h3 className="font-semibold text-slate-900">
              Rs. {amount.toLocaleString()}
            </h3>

          </div>

        </div>

      </div>

      {/* Chart */}

      <div className="h-[300px] px-4 py-4">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="paymentGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563EB"
                  stopOpacity={0.30}
                />

                <stop
                  offset="95%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="#E5E7EB"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [
                `Rs. ${Number(value).toLocaleString()}`,
                "Payments",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1D4ED8"
              strokeWidth={3}
              fill="url(#paymentGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default RevenueChart;