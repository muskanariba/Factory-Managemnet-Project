import { Pencil, Trash2 } from "lucide-react";

function SaleTable({
  sales,
  search,
  onEdit,
  onDelete,
}) {
  const filteredSales = sales.filter((sale) => {
    const invoice = sale.invoiceNumber || "";
    const client = sale.client?.clientName || "";

    return (
      invoice.toLowerCase().includes(search.toLowerCase()) ||
      client.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (filteredSales.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        No sales found.
      </div>
    );
  }

  return (
    <>
      {/* ================= Desktop ================= */}

      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="min-w-[1200px]">

            <div className="grid grid-cols-12 bg-slate-50 px-6 py-4 font-semibold text-slate-700">

              <div className="col-span-2">
                Invoice
              </div>

              <div className="col-span-3">
                Client
              </div>

              <div className="col-span-2">
                Date
              </div>

              <div className="col-span-1">
                Total
              </div>

              <div className="col-span-1">
                Paid
              </div>

              <div className="col-span-1">
                Due
              </div>

              <div className="col-span-2 text-center">
                Actions
              </div>

            </div>

            {filteredSales.map((sale) => (

              <div
                key={sale._id}
                className="grid grid-cols-12 items-center border-t border-slate-100 px-6 py-5 hover:bg-slate-50"
              >

                <div className="col-span-2 font-semibold text-[#1E3A8A]">
                  {sale.invoiceNumber}
                </div>

                <div className="col-span-3">
                  {sale.client?.clientName}
                </div>

                <div className="col-span-2">
                  {new Date(
                    sale.invoiceDate
                  ).toLocaleDateString()}
                </div>

                <div className="col-span-1 font-semibold">
                  Rs. {sale.grandTotal}
                </div>

                <div className="col-span-1 text-green-600 font-semibold">
                  Rs. {sale.paidAmount}
                </div>

                <div className="col-span-1 text-red-600 font-semibold">
                  Rs. {sale.dueAmount}
                </div>

                <div className="col-span-2 flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(sale)}
                    className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(sale._id)}
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

          </div>
        </div>
      </div>

      {/* ================= Mobile ================= */}

      <div className="grid gap-4 lg:hidden">

        {filteredSales.map((sale) => (

          <div
            key={sale._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold text-[#1E3A8A]">
                  {sale.invoiceNumber}
                </h3>

                <p className="text-sm text-slate-500">
                  {sale.client?.clientName}
                </p>

              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {sale.status}
              </span>

            </div>

            <div className="mt-5 space-y-2 text-sm">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Total
                </span>

                <span className="font-semibold">
                  Rs. {sale.grandTotal}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Paid
                </span>

                <span className="font-semibold text-green-600">
                  Rs. {sale.paidAmount}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Due
                </span>

                <span className="font-semibold text-red-600">
                  Rs. {sale.dueAmount}
                </span>

              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => onEdit(sale)}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(sale._id)}
                className="flex-1 rounded-xl bg-red-600 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </>
  );
}

export default SaleTable;