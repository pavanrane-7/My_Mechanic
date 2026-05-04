import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import "./index.css";
import MechanicLogin from "./pages/MechanicLogin";
import MechanicDashboard from "./pages/MechanicDashboard";
import MechanicRegister from "./pages/MechanicRegister";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/mechanic-login" element={<MechanicLogin />} />
      <Route path="/dashboard" element={<MechanicDashboard />} />
      <Route path="/mechanic-register" element={<MechanicRegister />} />
    
    
    
    
    
    
    
    
    </Routes>
  </BrowserRouter>
);