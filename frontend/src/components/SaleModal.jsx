import { useEffect, useMemo, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { getClients } from "../services/clientService";
import { getProducts } from "../services/productService";

function SaleModal({
  open,
  onClose,
  onSubmit,
  initialData,
  products = [],
}) {
  const [clients, setClients] = useState([]);


  const emptyItem = {
    product: "",
    quantity: 1,
    rate: 0,
    amount: 0,
  };

  const [formData, setFormData] = useState({
    client: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    items: [emptyItem],
    discount: 0,
    paidAmount: 0,
    notes: "",
  });

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        client: initialData.client?._id || "",
        invoiceDate:
          initialData.invoiceDate?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        items:
          initialData.items.length > 0
            ? initialData.items
            : [emptyItem],
        discount: initialData.discount || 0,
        paidAmount: initialData.paidAmount || 0,
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        client: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        items: [emptyItem],
        discount: 0,
        paidAmount: 0,
        notes: "",
      });
    }
  }, [initialData]);

  const loadData = async () => {
    try {
      const clientRes = await getClients();

setClients(clientRes.data || []);

      setClients(clientRes.data.data);
      setProducts(productRes.data.data);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    const items = [...formData.items];

    items[index][field] = value;

    if (field === "product") {
      const product = products.find(
        (p) => p._id === value
      );

      if (product) {
        items[index].rate =
          Number(
            product.salePrice ||
              product.sellingPrice ||
              product.price ||
              0
          );
      }
    }

    items[index].quantity =
      Number(items[index].quantity);

    items[index].rate =
      Number(items[index].rate);

    items[index].amount =
      items[index].quantity *
      items[index].rate;

    setFormData((prev) => ({
      ...prev,
      items,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...emptyItem,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return toast.error(
        "At least one product is required."
      );
    }

    const items = formData.items.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      items,
    }));
  };

  const subtotal = useMemo(() => {
    return formData.items.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );
  }, [formData.items]);

  const grandTotal = useMemo(() => {
    return (
      subtotal -
      Number(formData.discount || 0)
    );
  }, [subtotal, formData.discount]);

  const dueAmount = useMemo(() => {
    return (
      grandTotal -
      Number(formData.paidAmount || 0)
    );
  }, [grandTotal, formData.paidAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.client)
      return toast.error("Select client.");

    if (
      formData.items.some(
        (i) => !i.product
      )
    )
      return toast.error(
        "Select all products."
      );

    onSubmit({
      ...formData,
      subtotal,
      grandTotal,
      dueAmount,
    });
  };

  if (!open) return null;
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

     <div className="w-full max-w-6xl rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-xl max-h-[95vh] overflow-y-auto">

        {/* Header */}

      <div className="mb-6 flex items-start justify-between gap-4">
          <div>

            <h2 className="text-2xl font-bold">
              {initialData ? "Edit Sale" : "Add Sale"}
            </h2>

            <p className="text-slate-500">
              Create customer invoice.
            </p>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form onSubmit={handleSubmit}>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="h-12 rounded-xl border px-4"
              required
            >

              <option value="">
                Select Client
              </option>

              {clients.map((client) => (

                <option
                  key={client._id}
                  value={client._id}
                >
                  {client.clientName}
                </option>

              ))}

            </select>

            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="h-12 rounded-xl border px-4"
            />

          </div>

          {/* Products */}

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">

           <div className="grid min-w-[760px] grid-cols-12 bg-slate-50 px-5 py-4 font-semibold">

              <div className="col-span-4">
                Product
              </div>

              <div className="col-span-2 text-center">
                Qty
              </div>

              <div className="col-span-2 text-center">
                Rate
              </div>

              <div className="col-span-2 text-center">
                Amount
              </div>

              <div className="col-span-2 text-center">
                Action
              </div>

            </div>

            {formData.items.map((item, index) => (

           <div
  key={index}
  className="grid min-w-[760px] grid-cols-12 items-center gap-3 border-t px-5 py-4"

>

                <div className="col-span-4">

                  <select
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "product",
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-3"
                  >

                    <option value="">
                      Select Product
                    </option>

                  {(products || []).map((product) => (
  <option
    key={product._id}
    value={product._id}
  >
    {product.productName}
  </option>
))}

                  </select>

                </div>

                <div className="col-span-2">

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-3 text-center"
                  />

                </div>

                <div className="col-span-2">

                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "rate",
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border px-3 text-center"
                  />

                </div>

                <div className="col-span-2 text-center font-semibold">

                  Rs. {Number(item.amount).toLocaleString()}

                </div>

                <div className="col-span-2 flex justify-center">

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(index)
                    }
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

            <div className="border-t p-5">

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 text-white"
              >
                <Plus size={18} />
                Add Product
              </button>

            </div>

          </div>
                    {/* Bottom */}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                rows={8}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter notes..."
                className="w-full rounded-xl border px-4 py-3 resize-none"
              />

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="mb-4 flex justify-between">

                <span className="font-medium">
                  Subtotal
                </span>

                <span className="font-semibold">
                  Rs. {subtotal.toLocaleString()}
                </span>

              </div>

              <div className="mb-4 flex items-center justify-between">

                <span className="font-medium">
                  Discount
                </span>

                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
              className="h-11 w-24 sm:w-32 lg:w-36 rounded-xl border px-3 text-right"
                />

              </div>

              <div className="mb-4 flex justify-between border-t pt-4">

                <span className="text-lg font-bold">
                  Grand Total
                </span>

                <span className="text-xl font-bold text-[#1E3A8A]">
                  Rs. {grandTotal.toLocaleString()}
                </span>

              </div>

              <div className="mb-4 flex items-center justify-between">

                <span className="font-medium">
                  Paid Amount
                </span>

                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                 className="h-11 w-24 sm:w-32 lg:w-36 rounded-xl border px-3 text-right"
                />

              </div>

              <div className="flex justify-between border-t pt-4">

                <span className="text-lg font-bold text-red-600">
                  Due Amount
                </span>

                <span className="text-xl font-bold text-red-600">
                  Rs. {dueAmount.toLocaleString()}
                </span>

              </div>

            </div>

          </div>

          {/* Footer */}

     <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
             className="w-full rounded-xl border border-slate-300 px-6 py-3 hover:bg-slate-100 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
             className="w-full rounded-xl bg-[#1E3A8A] px-6 py-3 text-white hover:bg-[#17307A] sm:w-auto"
            >
              {initialData ? "Update Sale" : "Save Sale"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SaleModal;