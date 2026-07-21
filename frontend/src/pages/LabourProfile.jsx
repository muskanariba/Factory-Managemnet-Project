import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import { addPayment } from "../services/paymentService";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getLabourProfile } from "../services/labourProfileService";

import toast from "react-hot-toast";

function LabourProfile() {
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [profile, setProfile] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getLabourProfile(id);
      setProfile(res.data.data);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };
  const handlePayment = async (data) => {
  try {
    await addPayment({
      ...data,
      worker: profile.worker._id,
    });

    toast.success("Payment added successfully");

    setOpenPaymentModal(false);

    loadProfile();
  } catch (error) {
    toast.error("Failed to add payment");
  }
};

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (!profile)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="mt-24 max-w-[1600px] mx-auto space-y-6 p-4 md:p-6 lg:p-8">

          {/* Header */}

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Labour Profile
            </h1>

            <p className="mt-1 text-slate-500">
              Complete worker information.
            </p>

          </div>

          {/* Worker Card */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold">
              {profile.worker.name}
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <div>

                <p className="text-sm text-slate-500">
                  Department
                </p>

                <h3 className="font-semibold">
                  {profile.worker.department}
                </h3>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <h3 className="font-semibold">
                  {profile.worker.phone}
                </h3>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Daily Wage
                </p>

                <h3 className="font-semibold">
                  Rs. {profile.worker.dailyWage}
                </h3>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {profile.worker.status}
                </span>

              </div>

            </div>

          </div>
                    {/* Salary Summary */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Present Days</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {profile.salary.presentDays}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Earned Salary</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-700">
                Rs. {profile.salary.earnedSalary}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Paid Amount</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                Rs. {profile.salary.paidAmount}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Remaining Salary
              </p>
              <h2 className="mt-2 text-3xl font-bold text-red-600">
                Rs. {profile.salary.remainingSalary}
              </h2>
            </div>

          </div>

          {/* Attendance History */}

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Attendance History
              </h2>

            </div>

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50">

                  <th className="p-4 text-left">Date</th>

                  <th className="p-4 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {profile.attendanceHistory.map((item) => (

                  <tr
                    key={item._id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {new Date(item.date).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "present"
                            ? "bg-green-100 text-green-700"
                            : item.status === "leave"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Payment History */}

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Payment History
              </h2>
<button
  onClick={() => setOpenPaymentModal(true)}
  className="rounded-xl bg-[#1E3A8A] px-5 py-3 text-white hover:bg-[#17307A]"
>
  Give Payment
</button>

            </div>

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50">

                  <th className="p-4 text-left">Date</th>

                  <th className="p-4 text-left">Amount</th>

                  <th className="p-4 text-left">Type</th>

                  <th className="p-4 text-left">Method</th>

                </tr>

              </thead>

              <tbody>

                {profile.paymentHistory.map((payment) => (

                  <tr
                    key={payment._id}
                    className="border-t"
                  >

                    <td className="p-4">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 font-semibold text-[#1E3A8A]">
                      Rs. {payment.amount}
                    </td>

                    <td className="p-4">
                      {payment.paymentType}
                    </td>

                    <td className="p-4">
                      {payment.paymentMethod}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>
<PaymentModal
  open={openPaymentModal}
  onClose={() => setOpenPaymentModal(false)}
  onSubmit={handlePayment}
  initialData={{
    worker: profile.worker._id,
  }}
/>
    </div>
  );
}

export default LabourProfile;