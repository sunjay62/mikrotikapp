import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ProtectedRoute from "utils/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<AuthLayout />} />
        <Route path="login" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={<ProtectedRoute element={<AdminLayout />} />}
        />
      </Route>
    </Routes>
  );
};

export default App;
