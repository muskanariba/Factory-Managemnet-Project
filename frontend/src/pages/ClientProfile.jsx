import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ReceivePaymentModal from "../components/ReceivePaymentModal";

import {
  getClientProfile,
  receiveClientPayment,
} from "../services/clientProfileService";

import toast from "react-hot-toast";

function ClientProfile() {
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [profile, setProfile] = useState(null);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getClientProfile(id);
      setProfile(res.data.data);
    } catch (error) {
      toast.error("Failed to load client profile");
    }
  };

  const handleReceivePayment = async (data) => {
    try {
      await receiveClientPayment(id, data);

      toast.success("Payment received successfully");

      setOpenPaymentModal(false);

      loadProfile();
    } catch (error) {
      toast.error("Failed to receive payment");
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

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
    Client Profile
  </h1>

  <p className="mt-1 text-slate-500">
    Complete client information.
  </p>
</div>

{/* Client Card */}

<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="text-2xl font-bold">
    {profile.client.clientName}
  </h2>

  <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

    <div>
      <p className="text-sm text-slate-500">
        Phone
      </p>

      <h3 className="font-semibold">
        {profile.client.phoneNumber || "-"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Email
      </p>

      <h3 className="font-semibold">
        {profile.client.email || "-"}
      </h3>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Opening Balance
      </p>

      <h3 className="font-semibold">
        Rs. {profile.client.openingBalance || 0}
      </h3>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Status
      </p>

      <span
        className={`rounded-full px-3 py-1 text-sm ${
          profile.client.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {profile.client.status}
      </span>
    </div>

  </div>

  <div className="mt-6">
    <p className="text-sm text-slate-500">
      Address
    </p>

    <p className="mt-1 font-medium">
      {profile.client.address || "-"}
    </p>
  </div>

</div>


{/* Summary Cards */}

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Opening Balance
    </p>

    <h2 className="mt-2 text-3xl font-bold text-blue-700">
      Rs. {profile.client.openingBalance || 0}
    </h2>
  </div>

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Total Purchases
    </p>

    <h2 className="mt-2 text-3xl font-bold text-indigo-600">
      Rs. {profile.client.totalPurchases || 0}
    </h2>
  </div>

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Total Payments
    </p>

    <h2 className="mt-2 text-3xl font-bold text-green-600">
      Rs. {profile.client.totalPayments || 0}
    </h2>
  </div>

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Outstanding Balance
    </p>

    <h2 className="mt-2 text-3xl font-bold text-red-600">
      Rs. {profile.client.outstandingBalance || 0}
    </h2>
  </div>

</div>

{/* Payment History */}

<div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

  <div className="flex items-center justify-between border-b border-slate-200 p-6">

    <h2 className="text-xl font-bold">
      Payment History
    </h2>

    <button
      onClick={() => setOpenPaymentModal(true)}
      className="rounded-xl bg-[#1E3A8A] px-5 py-3 text-white hover:bg-[#17307A]"
    >
      Receive Payment
    </button>

  </div>

  <table className="w-full">

    <thead>

      <tr className="bg-slate-50">

        <th className="p-4 text-left">
          Date
        </th>

        <th className="p-4 text-left">
          Amount
        </th>

        <th className="p-4 text-left">
          Method
        </th>

        <th className="p-4 text-left">
          Remarks
        </th>

      </tr>

    </thead>

    <tbody>

      {profile.paymentHistory.length === 0 ? (

        <tr>

          <td
            colSpan="4"
            className="p-6 text-center text-slate-500"
          >
            No payment history found.
          </td>

        </tr>

      ) : (

        profile.paymentHistory.map((payment) => (

          <tr
            key={payment._id}
            className="border-t"
          >

            <td className="p-4">
              {new Date(payment.paymentDate).toLocaleDateString()}
            </td>

            <td className="p-4 font-semibold text-green-600">
              Rs. {payment.amount}
            </td>

            <td className="p-4">
              {payment.paymentMethod}
            </td>

            <td className="p-4">
              {payment.remarks || "-"}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

{/* Client Ledger */}

<div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

  <div className="border-b border-slate-200 p-6">

    <h2 className="text-xl font-bold">
      Client Ledger
    </h2>

  </div>

  <table className="w-full">

    <thead>

      <tr className="bg-slate-50">

        <th className="p-4 text-left">
          Date
        </th>

        <th className="p-4 text-left">
          Particular
        </th>

        <th className="p-4 text-left">
          Debit
        </th>

        <th className="p-4 text-left">
          Credit
        </th>

        <th className="p-4 text-left">
          Balance
        </th>

      </tr>

    </thead>

    <tbody>

      {profile.ledger.length === 0 ? (

        <tr>

          <td
            colSpan="5"
            className="p-6 text-center text-slate-500"
          >
            No ledger entries found.
          </td>

        </tr>

      ) : (

        profile.ledger.map((entry, index) => (

          <tr
            key={index}
            className="border-t"
          >

            <td className="p-4">
              {entry.date
                ? new Date(entry.date).toLocaleDateString()
                : "-"}
            </td>

            <td className="p-4">
              {entry.particular}
            </td>

            <td className="p-4 text-red-600 font-semibold">
              {entry.debit ? `Rs. ${entry.debit}` : "-"}
            </td>

            <td className="p-4 text-green-600 font-semibold">
              {entry.credit ? `Rs. ${entry.credit}` : "-"}
            </td>

            <td className="p-4 font-semibold text-[#1E3A8A]">
              Rs. {entry.balance}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

        </main>
      </div>

      <ReceivePaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        onSubmit={handleReceivePayment}
        outstanding={profile.client.outstandingBalance}
      />
    </div>
  );
}

export default ClientProfile;