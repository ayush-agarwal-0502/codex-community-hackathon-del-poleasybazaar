import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { InsuranceDataProvider } from "./hooks/useInsuranceData.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <InsuranceDataProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </InsuranceDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
