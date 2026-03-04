import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import POSScreen from "./components/POSScreen";
import SalesOrderHistory from "./pages/SalesOrderHistory";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/pos" replace />} 
        />
        <Route 
          path="/pos" 
          element={
            <MainLayout>
              <POSScreen />
            </MainLayout>
          } 
        />
        <Route 
          path="/sales-orders" 
          element={
            <MainLayout>
              <SalesOrderHistory />
            </MainLayout>
          } 
        />
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;