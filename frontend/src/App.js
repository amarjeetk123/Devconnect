import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Loginpage/Login";
import Register from "./pages/Loginpage/Register";
import Dashboard from "./pages/dashborad/Dashboard.jsx";
import Layout from "./pages/Header/Layout.jsx";
import PublicRoute from "./PublicRoute.js";
import Useraccount from "./pages/user-page/Useraccount.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ❌ No Header */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>} />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* ✅ With Header */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-account" element={<Useraccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;