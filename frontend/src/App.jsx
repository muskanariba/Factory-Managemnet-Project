import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Labour from "./pages/Labour";
import AttendanceHistory from "./pages/AttendanceHistory";
import Products from "./pages/Products";
import Payments from "./pages/Payments";
import LabourProfile from "./pages/LabourProfile";
import Client from "./pages/Client";
import ClientProfile from "./pages/ClientProfile";
import Sales from "./pages/Sales";
import ProtectedRoute from "./components/ProtectedRoute";

import { getCurrentUser } from "./services/authService";
import { setUser, finishLoading } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setUser(response.data.data));
      } catch (error) {
        console.error(error);
        console.log("No Active Session");
        dispatch(finishLoading());
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Attendance */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* Labour */}
        <Route
          path="/labour"
          element={
            <ProtectedRoute>
              <Labour />
            </ProtectedRoute>
          }
        />

        {/* Labour Profile */}
        <Route
          path="/labour-profile/:id"
          element={
            <ProtectedRoute>
              <LabourProfile />
            </ProtectedRoute>
          }
        />

        {/* Attendance History */}
        <Route
          path="/attendance-history"
          element={
            <ProtectedRoute>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        {/* Products */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* Payments */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* Clients */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Client />
            </ProtectedRoute>
          }
        />

        {/* Client Profile */}
        <Route
          path="/client-profile/:id"
          element={
            <ProtectedRoute>
              <ClientProfile />
            </ProtectedRoute>
          }
        />

        {/* Sales */}
<Route
  path="/sales"
  element={
    <ProtectedRoute>
      <Sales />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;