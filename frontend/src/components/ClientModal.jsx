import { useEffect, useState } from "react";
import { X } from "lucide-react";

function ClientModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "active",
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        status: initialData.status || "active",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        status: "active",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  onSubmit({
    clientName: formData.name,
    phoneNumber: formData.phone,
    email: formData.email,
    address: formData.address,
    status: formData.status,
  });
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? "Edit Client" : "Add Client"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter client details below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Client Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#1E3A8A]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <textarea
              rows={4}
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-[#1E3A8A]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#1E3A8A] px-6 py-3 font-medium text-white hover:bg-[#17307A]"
            >
              {initialData ? "Update Client" : "Add Client"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ClientModal;