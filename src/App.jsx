// import "./App.css";
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import SaleOrder from "./components/SaleOrder";
// import SalesOrderHistory from "./pages/SalesOrderHistory";

// const MainLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen w-full bg-gray-100">
//       <main className="w-full">
//         {children}
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route 
//           path="/" 
//           element={<Navigate to="/pos" replace />} 
//         />
//         <Route 
//           path="/pos" 
//           element={
//             <MainLayout>
//               <SaleOrder />
//             </MainLayout>
//           } 
//         />
//         <Route 
//           path="/sales-orders" 
//           element={
//             <MainLayout>
//               <SalesOrderHistory />
//             </MainLayout>
//           } 
//         />
//         <Route path="*" element={<Navigate to="/pos" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;









import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaleOrder from './components/SaleOrder';
import CartPage from './components/CartPage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/pos" element={<SaleOrder />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;