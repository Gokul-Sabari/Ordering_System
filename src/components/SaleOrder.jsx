


// import React, { useState, useEffect, useRef, forwardRef, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchLink } from './fetchComponent';
// import { toast } from 'react-toastify';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import { useReactToPrint } from 'react-to-print';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import CircularProgress from '@mui/material/CircularProgress';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import CommonHeader from './CommonHeader';
// import { encryptPasswordFun } from "./functions";
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Button from '@mui/material/Button';
// import { getSessionUser,ISOStrings } from "../components/functions";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import TransactionDetails from './TransactionDetails'
// import PendingBillDetails from './PendingBillDetails';



// const BROWN = "#4a2c1a";
// const BROWN_DARK = "#3a1f0e";
// const BROWN_LIGHT = "#6b3f23";
// const ACCENT = "#c8a96e";
// const BG_COLOR = "#fdf8f3";

// import beansImg from '../assets/images/categoryImages/Beans.jpg';
// import desiCpImg from '../assets/images/categoryImages/desi.jpeg';
// import dhallImg from '../assets/images/categoryImages/dhall.jpg';
// import iiItemImg from '../assets/images/categoryImages/2item.jpeg';
// // import kabuliCpImg from '../assets/images/categoryImages/Kabuli_cp.jpg';
// import kabuliCpImg from '../assets/images/categoryImages/kabuli.jpeg';
// import kanamImg from '../assets/images/categoryImages/kanam.jpeg';
// import masoorImg from '../assets/images/categoryImages/Masoor.jpg';
// import milletsImg from '../assets/images/categoryImages/millets.jpeg';
// import mochaiImg from '../assets/images/categoryImages/Mochai.jpg';
// import moongImg from '../assets/images/categoryImages/moong_dhal.jpg';
// import peasImg from '../assets/images/categoryImages/Peas.jpg';
// import riceImg from '../assets/images/categoryImages/Rice.jpg';
// import thattaiImg from '../assets/images/categoryImages/Thattai.jpg';
// import retailImg from '../assets/images/categoryImages/Kabuli_cp.jpg';

// const categoryImages = {
//   "1.BEANS": beansImg,
//   "2.Desi cp": desiCpImg,
//   "3.DHALL": dhallImg,
//   "4.II Item": iiItemImg,
//   "5.Kabuli cp": kabuliCpImg,
//   "6.KANAM": kanamImg,
//   "7.MASOOR": masoorImg,
//   "8.MILLETS": milletsImg,
//   "9.Mochai": mochaiImg,
//   "10.Moong": moongImg,
//   "11.PEAS": peasImg,
//   "12.RICE": riceImg,
//   "13.Thattai": thattaiImg,
//   "15.Retail": retailImg,
// };

// const getCategoryImage = (categoryName) => categoryImages[categoryName];



// const buildPrintHtml = (customer, cartItems, totals, storage, createdOn, orderDate) => {
//   const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
//   const rupee = (n) =>
//     safeNum(n).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   const totalKgs = (cartItems || []).reduce((s, i) => s + safeNum(i.kgs), 0);
//   const totalBags = (cartItems || []).reduce((sum, item) => {
//     const displayName = item.shortName || item.Print_Name || "";
//     const packWeight =
//       parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
//     return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
//   }, 0);


//   const formatDateTime = () => {
//     let dateToUse = createdOn || orderDate;
    
//     if (dateToUse) {
//       try {
//         let dateObj;
        
//         if (typeof dateToUse === 'string') {

//           if (dateToUse.includes(' ') && dateToUse.includes('-')) {
//             const [datePart, timePart] = dateToUse.split(' ');
//             const [year, month, day] = datePart.split('-');
            
//             if (timePart) {
//               const [hours, minutes] = timePart.split(':');
//               dateObj = new Date(year, parseInt(month) - 1, day, parseInt(hours), parseInt(minutes));
//             } else {
//               dateObj = new Date(year, parseInt(month) - 1, day);
//             }
//           } 
        
//           else if (dateToUse.includes('T')) {
//             dateObj = new Date(dateToUse);
//           }
//           else {
//             dateObj = new Date(dateToUse);
//           }
          
//           if (!isNaN(dateObj.getTime())) {
//             const day = String(dateObj.getDate()).padStart(2, '0');
//             const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//             const year = dateObj.getFullYear();
//             let hours = dateObj.getHours();
//             const minutes = String(dateObj.getMinutes()).padStart(2, '0');
//             const ampm = hours >= 12 ? 'PM' : 'AM';
//             hours = hours % 12 || 12;
//             return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
//           }
//         }
//       } catch (e) {}
//     }
    
//     // Fallback to current time
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     let hours = now.getHours();
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
//   };

//   const rows = (cartItems || [])
//     .map((item) => {
//       const displayName = item.shortName || item.Print_Name || "";
//       const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
//       const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
//       return `
//         <tr>
//           <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
//             ₹${rupee(item.price)}
//           </td>
//           <td style="border:1px solid #000;padding:8px 4px;text-align:left;font-size:14px;">
//             ${displayName}
//           </td>
//           <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
//             ${bags > 0 ? Math.round(bags) : 0}
//           </td>
//         </tr>`;
//     })
//     .join("");

//   const takenBy = storage?.Created_BY_Name || storage?.Name || "—";
//   const formattedDateTime = formatDateTime();

//   return `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <title>Quotation</title>
//   <style>
//     @page { size: 80mm auto; margin: 0; }
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     body {
//       font-family: 'Courier New', Courier, monospace;
//       font-size: 14px;
//       font-weight: 900;
//       color: #000;
//       background: #fff;
//       padding: 2mm;
//       width: 80mm;
//     }
//     table { width: 100%; border-collapse: collapse; }
//   </style>
// </head>
// <body>
//   <div style="margin-bottom:2mm;font-size:14px;font-weight:1000;display:flex;justify-content:space-between;">
//     <span>${formattedDateTime}</span>
//     <span>TAKEN: ${takenBy}</span>
//   </div>

//   <div style="border-top:1px solid #000;border-bottom:1px solid #000;padding:1mm 0;margin-bottom:2mm;">
//     <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
//       <span style="min-width:13ch;white-space:pre;">PARTY NAME : </span>
//       <span>${customer?.Billl_Name || customer?.Party_Mailing_Name || "—"}</span>
//     </div>
//     <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
//       <span style="min-width:13ch;white-space:pre;">LOCATION   : </span>
//       <span>${customer?.Party_Location || customer?.Party_Mailing_Address || customer?.City || "—"}</span>
//     </div>
//     <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
//       <span style="min-width:13ch;white-space:pre;">PH.NO      : </span>
//       <span>${customer?.Mobile_No || customer?.Land_Line || "—"}</span>
//     </div>
//     <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
//       <span style="min-width:13ch;white-space:pre;">TRANSPORT  : </span>
//       <span>${customer?.Transporter || "—"}</span>
//     </div>
//     <div style="font-weight:800;display:flex;align-items:flex-start;">
//       <span style="min-width:13ch;white-space:pre;">BROKER     : </span>
//       <span>${customer?.Broker || "—"}</span>
//     </div>
//   </div>

//   <div style="border:0.5px solid #000;">
//     <table>
//       <thead>
//         <tr>
//           <th style="border:0.5px solid #000;padding:0.5mm;text-align:center;font-size:14px;font-weight:1000;background:#f5f5f5;width:25mm;">RATE</th>
//           <th style="border:0.5px solid #000;padding:0.5mm;text-align:center;font-size:14px;font-weight:800;background:#f5f5f5;width:45mm;">ITEM NAME</th>
//           <th style="border:0.5px solid #000;padding:0.5mm;text-align:center;font-size:14px;font-weight:800;background:#f5f5f5;width:10mm;">BAGS</th>
//         </tr>
//       </thead>
//       <tbody>${rows}</tbody>
//     </table>
//     <div style="background:#f0f0f0;border-top:1px solid #000;padding:1mm;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:bold;">
//       <span>&#8377;${rupee(totals?.subtotal)}</span>
//       <span>${totalKgs.toFixed(2)} KGS</span>
//       <span>${Math.round(totalBags)} BAGS</span>
//     </div>
//   </div>

//   <script>
//     window.onload = function () {
//       window.print();
//       window.addEventListener('afterprint', function () { window.close(); });
//     };
//   </script>
// </body>
// </html>`;
// };


// const isMobileDevice = () =>
//   typeof window !== "undefined" &&
//   (window.innerWidth <= 768 ||
//     /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));


// const mobilePrint = (customer, cartItems, totals, storage, createdOn, orderDate) => {
//   const html = buildPrintHtml(customer, cartItems, totals, storage, createdOn, orderDate);
//   const printWindow = window.open("", "_blank", "width=400,height=600");
//   if (!printWindow) {
    
//     const blob = new Blob([html], { type: "text/html" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.target = "_blank";
//     a.click();
//     setTimeout(() => URL.revokeObjectURL(url), 10000);
//     return;
//   }
//   printWindow.document.write(html);
//   printWindow.document.close();
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CategoryCard
// // ─────────────────────────────────────────────────────────────────────────────

// const CategoryCard = ({ category, isSelected, onClick, isMobile, isReduced }) => {
//   const imageUrl = getCategoryImage(category.name);
//   const cardSize = isReduced ? "80px" : "120px";
//   const fontSize = isReduced ? "11px" : (isMobile ? "18px" : "15px");
//   const checkmarkSize = isReduced ? "20px" : "32px";
//   const checkmarkFontSize = isReduced ? "12px" : "18px";
//   const checkmarkTop = isReduced ? "4px" : "12px";
//   const checkmarkRight = isReduced ? "4px" : "12px";

//   return (
//     <div
//       onClick={onClick}
//       style={{
//         width: cardSize, height: cardSize, borderRadius: "5px",
//         overflow: "hidden", position: "relative", margin: 0, padding: 0,
//         cursor: "pointer", flex: "0 0 auto",
//         boxShadow: isSelected
//           ? `0 0 0 3px ${BROWN_DARK}, 0 8px 20px rgba(0,0,0,0.2)`
//           : "0 4px 12px rgba(0,0,0,0.1)",
//         transform: isSelected ? "scale(1.02)" : "scale(1)",
//         transition: "all 0.3s ease",
//       }}
//     >
//       <img src={imageUrl} alt={category.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//       <div style={{
//         position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
//         background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}>
//         <span style={{
//           color: "#fff", fontSize, fontWeight: "bold",
//           textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
//           textAlign: "center", padding: "0 8px", letterSpacing: "1px",
//         }}>
//           {category.name}
//         </span>
//       </div>
//       {isSelected && (
//         <div style={{
//           position: "absolute", top: checkmarkTop, right: checkmarkRight,
//           width: checkmarkSize, height: checkmarkSize, borderRadius: "50%",
//           background: BROWN_DARK, display: "flex", alignItems: "center",
//           justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//         }}>
//           <span style={{ color: "#fff", fontSize: checkmarkFontSize }}>✓</span>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // LoginPopup
// // ─────────────────────────────────────────────────────────────────────────────

// const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [step, setStep] = useState(1);

//   useEffect(() => {
//     if (isOpen) { setStep(1); setUsername(""); setPassword(""); }
//   }, [isOpen]);

//   const handleUsernameSubmit = async (e) => {
//     e.preventDefault();
//     if (!username.trim()) { toast.error("Please enter your username"); return; }
//     setIsLoading(true);
//     try {
//       const data = await fetchLink({
//         address: `authorization/getUserTypeAuth`,
//         method: "POST",
//         bodyData: { username: username.trim() },
//       });
//       if (!data.success) { toast.error(data.message || "User not found"); return; }
//       if (data.requirePassword) {
//         setStep(2);
//       } else {
//         const customer = data.customer || {};
//         const usename = customer.A1;
//         // localStorage.setItem("user", JSON.stringify({ ...customer, Name: usename }));
//           localStorage.setItem("user", JSON.stringify({ 
//     ...customer, 
//     Name: usename,
//     Ret_Id: customer.Ret_Id,  
//     UserId: customer.Ret_Id 
//   }));
//         localStorage.setItem("session", JSON.stringify({ 
//     username: username.trim(), 
//     ...data,
//     retId: customer.Ret_Id,   // Store retId in session
//     userId: customer.Ret_Id   // Also store as userId
//   }));
//         localStorage.setItem("loginAt", new Date().toString());
//         localStorage.setItem("username", username);
//         localStorage.setItem("userType", "customer");
//         localStorage.setItem("retId", customer.Ret_Id || "");
//         toast.success("Login successful!");
//         setUsername(""); setPassword(""); setStep(1);
//         if (onLoginSuccess) onLoginSuccess();
//         onClose();
//       }
//     } catch (error) {
//       console.error("Username check error:", error);
//       toast.error("Something went wrong! Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     if (!password.trim()) { toast.error("Please enter your password"); return; }
//     setIsLoading(true);
//     try {
//       const passHash = await encryptPasswordFun(password);
//       const data = await fetchLink({
//         address: `authorization/login`,
//         method: "POST",
//         bodyData: { username: username.trim(), password: passHash, APP_Type: 2 },
//       });
//       if (data.success) {
//         const { user, sessionInfo } = data;
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("session", JSON.stringify(sessionInfo));
//         localStorage.setItem("loginAt", new Date().toString());
//         localStorage.setItem("userType", "employee");
//         localStorage.removeItem("retId");
//         toast.success("Login successful!");
//         setUsername(""); setPassword(""); setStep(1);
//         if (onLoginSuccess) onLoginSuccess();
//         onClose();
//       } else {
//         toast.error(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Something went wrong! Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div style={{
//       position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
//       backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
//       justifyContent: "center", alignItems: "center", zIndex: 9999,
//     }}>
//       <div style={{
//         backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
//         maxWidth: "400px", width: "90%",
//         boxShadow: "0 10px 40px rgba(0,0,0,0.2)", position: "relative",
//       }}>
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute", top: "12px", right: "12px",
//             background: "transparent", border: "none",
//             fontSize: "20px", cursor: "pointer", color: "#999",
//             padding: "4px 8px", borderRadius: "50%",
//           }}
//           onMouseEnter={(e) => { e.target.style.background = "#f0f0f0"; e.target.style.color = "#666"; }}
//           onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#999"; }}
//         >✕</button>

//         <div style={{ background: "#f9f4ef", borderRadius: "12px", padding: "20px" }}>
//           <div style={{
//             fontSize: "18px", fontWeight: "600", color: BROWN,
//             marginBottom: "16px", paddingBottom: "8px",
//             borderBottom: `2px solid ${ACCENT}`,
//             display: "flex", alignItems: "center", gap: "8px",
//           }}>
//             {step === 2 && (
//               <button
//                 onClick={() => { setStep(1); setPassword(""); }}
//                 style={{ background: "transparent", border: "none", cursor: "pointer", color: BROWN, fontSize: "18px", padding: 0 }}
//               >←</button>
//             )}
//             <span>
//               {step === 1
//                 ? <><span style={{ color: BROWN_DARK }}>Sign</span> In</>
//                 : <><span style={{ color: BROWN_DARK }}>Enter</span> Password</>}
//             </span>
//           </div>

//           {step === 1 && (
//             <form onSubmit={handleUsernameSubmit}>
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Username</div>
//                 <input
//                   type="text" value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Enter your username"
//                   required autoFocus
//                   style={{
//                     width: "100%", padding: "12px", border: "1px solid #ddd",
//                     borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box",
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>
//               <button
//                 type="submit" disabled={isLoading}
//                 style={{
//                   width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff",
//                   border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600",
//                   cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
//                 }}
//                 onMouseEnter={(e) => !isLoading && (e.target.style.background = BROWN)}
//                 onMouseLeave={(e) => !isLoading && (e.target.style.background = BROWN_DARK)}
//               >
//                 {isLoading
//                   ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
//                       <CircularProgress size={20} style={{ color: "#fff" }} /><span>Checking...</span>
//                     </div>
//                   : "Continue"}
//               </button>
//             </form>
//           )}

//           {step === 2 && (
//             <form onSubmit={handlePasswordSubmit}>
//               <div style={{ marginBottom: "16px" }}>
//                 <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Username</div>
//                 <div style={{
//                   padding: "12px", background: "#e8e0d8", borderRadius: "8px",
//                   fontSize: "14px", color: BROWN_DARK, fontWeight: "500",
//                   display: "flex", alignItems: "center", gap: "8px",
//                 }}>
//                   <span>👤</span><span>{username}</span>
//                 </div>
//               </div>
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Password</div>
//                 <input
//                   type="password" value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   required autoFocus
//                   style={{
//                     width: "100%", padding: "12px", border: "1px solid #ddd",
//                     borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box",
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>
//               <button
//                 type="submit" disabled={isLoading}
//                 style={{
//                   width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff",
//                   border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600",
//                   cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
//                 }}
//                 onMouseEnter={(e) => !isLoading && (e.target.style.background = BROWN)}
//                 onMouseLeave={(e) => !isLoading && (e.target.style.background = BROWN_DARK)}
//               >
//                 {isLoading
//                   ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
//                       <CircularProgress size={20} style={{ color: "#fff" }} /><span>Signing In...</span>
//                     </div>
//                   : "Sign In"}
//               </button>
//             </form>
//           )}

//           <div style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: "#999" }}>
//             <p>Enter your credentials to place order</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ProductCard
// // ─────────────────────────────────────────────────────────────────────────────

// function ProductCard({ product, quantity, onUpdateQty, isMobile }) {
//   const outOfStock = product.stock <= 0;
//   const [localQuantity, setLocalQuantity] = useState(quantity);
//   const [isEditing, setIsEditing] = useState(false);
//   const inputRef = useRef(null);

//   // Sync local state with prop when quantity changes externally
//   useEffect(() => {
//     setLocalQuantity(quantity);
//   }, [quantity]);

//   const handleIncrease = () => {
//     onUpdateQty(product.id, 1);
//   };

//   const handleDecrease = () => {
//     if (quantity > 0) {
//       onUpdateQty(product.id, -1);
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const value = e.target.value;
//     // Allow empty string or numbers only
//     if (value === '' || /^\d+$/.test(value)) {
//       setLocalQuantity(value === '' ? '' : parseInt(value, 10));
//     }
//   };

//   const handleQuantityBlur = () => {
//     setIsEditing(false);
//     let newQty = localQuantity;
    
//     // If empty or invalid, set to 0
//     if (newQty === '' || isNaN(newQty) || newQty < 0) {
//       newQty = 0;
//     }
    
//     // Only update if different from current
//     if (newQty !== quantity) {
//       // Calculate delta and apply
//       const delta = newQty - quantity;
//       if (delta !== 0) {
//         onUpdateQty(product.id, delta);
//       }
//     }
//     setLocalQuantity(quantity);
//   };

//   const handleQuantityKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.target.blur();
//     }
//     if (e.key === 'Escape') {
//       setLocalQuantity(quantity);
//       setIsEditing(false);
//       e.target.blur();
//     }
//   };

//   const handleQuantityClick = () => {
//     setIsEditing(true);
   
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus();
//         inputRef.current.select();
//       }
//     }, 50);
//   };

//   if (isMobile) {
//     return (
//       <div style={{
//         display: "flex", background: "#fff", borderRadius: "12px",
//         width: "100%", minHeight: "110px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//         border: "1px solid #e8ddd4", overflow: "hidden",
//       }}>
//         <div style={{ flex: 1, padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//           <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#6b5454", lineHeight: 1.3 }}>
//             {product.name}
//           </p>
//           {product.shortName && (
//             <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888", lineHeight: 1.2 }}>{product.shortName}</p>
//           )}
//           <p style={{ margin: "4px 0 0", fontSize: "11px", color: outOfStock ? "#e74c3c" : "#555", fontWeight: outOfStock ? "600" : "normal" }}>
//             {outOfStock ? "⚠ Out of Stock" : `Stock: ${product.stock.toFixed(1)} Bags`}
//             {!outOfStock && product.balQty > 0 && (
//               <span style={{ color: "#999", marginLeft: "4px" }}>({product.balQty} kg)</span>
//             )}
//           </p>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
//             <span style={{ fontSize: "17px", fontWeight: "700", color: "#3a1f0e" }}>₹{product.price}</span>
//             {outOfStock ? (
//               <span style={{ fontSize: "11px", color: "#fff", background: "#b0a0a0", borderRadius: "10px", padding: "3px 8px" }}>Out of Stock</span>
//             ) : (
//               <div style={{ display: "flex", alignItems: "center", background: "#6b5454", borderRadius: "20px", padding: "3px 8px", gap: "4px" }}>
//                 <button
//                   onClick={handleDecrease}
//                   disabled={quantity === 0}
//                   style={{
//                     background: "transparent", border: "none", color: "#fff", fontWeight: "bold",
//                     fontSize: "16px", cursor: quantity === 0 ? "not-allowed" : "pointer",
//                     width: "24px", height: "24px", display: "flex", alignItems: "center",
//                     justifyContent: "center", borderRadius: "50%", opacity: quantity === 0 ? 0.4 : 1,
//                     lineHeight: 1, padding: 0, flexShrink: 0,
//                   }}
//                 >−</button>
                
//                 {/* Editable quantity input */}
//                 {isEditing ? (
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={localQuantity}
//                     onChange={handleQuantityChange}
//                     onBlur={handleQuantityBlur}
//                     onKeyDown={handleQuantityKeyDown}
//                     style={{
//                       width: "30px",
//                       background: "rgba(255,255,255,0.2)",
//                       border: "none",
//                       borderRadius: "4px",
//                       color: "#fff",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       textAlign: "center",
//                       padding: "2px 0",
//                       outline: "2px solid #fff",
//                       minWidth: "20px",
//                     }}
//                     autoFocus
//                   />
//                 ) : (
//                   <span 
//                     onClick={handleQuantityClick}
//                     style={{ 
//                       color: "#fff", 
//                       fontSize: "14px", 
//                       fontWeight: "600", 
//                       minWidth: "20px", 
//                       textAlign: "center",
//                       cursor: "pointer",
//                       padding: "2px 4px",
//                       borderRadius: "4px",
//                     }}
//                     onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
//                     onMouseLeave={(e) => e.target.style.background = "transparent"}
//                     title="Click to edit quantity"
//                   >
//                     {quantity}
//                   </span>
//                 )}
                
//                 <button
//                   onClick={handleIncrease}
//                   style={{
//                     background: "transparent", border: "none", color: "#fff", fontWeight: "bold",
//                     fontSize: "16px", cursor: "pointer", width: "24px", height: "24px",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     borderRadius: "50%", lineHeight: 1, padding: 0, flexShrink: 0,
//                   }}
//                 >+</button>
//               </div>
//             )}
//           </div>
//         </div>
//         <div style={{ width: "110px", minWidth: "110px", overflow: "hidden", background: "#f5f0eb" }}>
//           <img
//             alt={product.name}
//             src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=110&h=110&fit=crop"}
//             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=110&h=110&fit=crop"; }}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </div>
//       </div>
//     );
//   }

//   // Desktop version
//   return (
//     <div className="product-card bg-white relative rounded-[15px] w-[400px] h-[150px] shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[-12px_10px_8px_-3px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-[4px]">
//       <div className="overflow-clip relative rounded-[inherit] size-full" style={{ display: "flex" }}>
//         <div style={{ flex: 1, padding: "12px 0 12px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//           <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[16px] whitespace-nowrap m-0">{product.shortName}</p>
//           <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[13px] whitespace-nowrap m-0">{product.name}</p>
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <div className="bg-[#6b5454] h-[30px] overflow-clip px-3 flex items-center justify-center rounded">
//               <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[20px] text-white m-0">₹{product.price}</p>
//             </div>
//             {outOfStock ? (
//               <div className="bg-[#6b5454] h-[26px] rounded-[15px] px-3 opacity-50 flex items-center justify-center">
//                 <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-white m-0">Out of Stock</p>
//               </div>
//             ) : (
//               <div className="bg-[#6b5454] h-[30px] flex items-center justify-between px-3 gap-1 rounded">
//                 <button 
//                   onClick={handleDecrease} 
//                   className="text-white font-bold text-base hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center" 
//                   disabled={quantity === 0}
//                   style={{ opacity: quantity === 0 ? 0.4 : 1, cursor: quantity === 0 ? 'not-allowed' : 'pointer' }}
//                 >−</button>
                
//                 {/* Editable quantity input - Desktop */}
//                 {isEditing ? (
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={localQuantity}
//                     onChange={handleQuantityChange}
//                     onBlur={handleQuantityBlur}
//                     onKeyDown={handleQuantityKeyDown}
//                     style={{
//                       width: "30px",
//                       background: "rgba(255,255,255,0.2)",
//                       border: "none",
//                       borderRadius: "4px",
//                       color: "#fff",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       textAlign: "center",
//                       padding: "2px 0",
//                       outline: "2px solid #fff",
//                       minWidth: "20px",
//                     }}
//                     autoFocus
//                   />
//                 ) : (
//                   <span 
//                     onClick={handleQuantityClick}
//                     style={{ 
//                       color: "#fff", 
//                       fontSize: "14px", 
//                       fontWeight: "600", 
//                       minWidth: "16px", 
//                       textAlign: "center",
//                       cursor: "pointer",
//                       padding: "2px 4px",
//                       borderRadius: "4px",
//                     }}
//                     onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
//                     onMouseLeave={(e) => e.target.style.background = "transparent"}
//                     title="Click to edit quantity"
//                   >
//                     {quantity}
//                   </span>
//                 )}
                
//                 <button 
//                   onClick={handleIncrease} 
//                   className="text-white font-bold text-base hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
//                 >+</button>
//               </div>
//             )}
//           </div>
//           <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap m-0 ${outOfStock ? "text-red-500" : "text-[#403f3d]"}`}>
//             Stock: {outOfStock ? "Out of Stock" : `${product.stock.toFixed(1)} Bags`}
//             {!outOfStock && product.balQty > 0 && (
//               <span className="text-[#666] ml-1 text-[9px]">({product.balQty} kg)</span>
//             )}
//           </p>
//         </div>
//         <div style={{ width: "130px", height: "100%", position: "relative", overflow: "hidden", borderTopRightRadius: "15px", borderBottomRightRadius: "15px" }}>
//           <img
//             alt={product.name}
//             className="w-full h-full object-cover"
//             src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=130&h=170&fit=crop"}
//             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=130&h=170&fit=crop"; }}
//           />
//           <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 10 }}>
//             <div className="bg-white border border-[#6b5454] border-solid rounded-[50px] size-[24px] cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center">
//               <ShoppingCartIcon style={{ fontSize: "12px", color: "#6b5454" }} />
//             </div>
//             {quantity > 0 && (
//               <span className="absolute bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ top: "-4px", right: "-4px" }}>
//                 {quantity}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//       <div aria-hidden="true" className="absolute border border-[#6b5454] border-solid inset-[-1px] pointer-events-none rounded-[16px] shadow-[-12px_10px_8px_-3px_rgba(0,0,0,0.15)]" />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MobileOrderSummary
// // ─────────────────────────────────────────────────────────────────────────────

// function MobileOrderSummary({ selectedCount, totalAmount, onGoToCart, footerOffset = 0 }) {
//   if (selectedCount === 0) return null;
//   return (
//     <div className="cart-summary" style={{
//   // position: "sticky",  
//   // bottom: 0,         
//   // right: 0, 
//   // left: 0,
//   // backgroundColor: "white", 
//   // boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
//   padding: "12px 16px", 
//   zIndex: 1000,
//   borderTopLeftRadius: "16px", 
//   borderTopRightRadius: "16px",
//   // borderTop: `2px solid ${BROWN_DARK}`,
//   marginTop: "auto",   // Push to bottom of flex container
// }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div />
//         <button
//           onClick={onGoToCart}
//           className="cart-summary-button"
//           style={{
//             backgroundColor: BROWN_DARK, color: "white", border: "none",
//             borderRadius: "25px", padding: "12px 24px", fontSize: "16px",
//             fontWeight: "bold", cursor: "pointer", display: "flex",
//             alignItems: "center", gap: "8px",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//           }}
//         >
//           <ShoppingCartIcon style={{ fontSize: "18px" }} />
//           Go to Cart
//           <span style={{
//             backgroundColor: "#e74c3c", borderRadius: "50%",
//             width: "20px", height: "20px", fontSize: "12px",
//             display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "4px",
//           }}>{selectedCount}</span>
//         </button>
//       </div>
//     </div>
//   );
// }


// function MobileTabBar({ activeTab, onHome, onDashboard, onCart, cartCount }) {
//   const tabs = [
//     { key: "home", label: "Home", icon: "🏠", onClick: onHome },
//     { key: "dashboard", label: "Dashboard", icon: "📊", onClick: onDashboard },
//     { key: "cart", label: "Cart", icon: "🛒", onClick: onCart },
//   ];

//   return (
//     <div style={{
//       position: "fixed", bottom: 0, left: 0, right: 0,
//       backgroundColor: "#fff", borderTop: "1px solid #e8ddd4",
//       display: "flex", justifyContent: "space-around", alignItems: "center",
//       padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
//       zIndex: 1100, boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
//     }}>
//       {tabs.map((tab) => {
//         const isActive = activeTab === tab.key;
//         return (
//           <button
//             key={tab.key}
//             onClick={tab.onClick}
//             style={{
//               flex: 1, background: "transparent", border: "none", cursor: "pointer",
//               display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
//               padding: "4px 0", position: "relative",
//             }}
//           >
//             <span style={{ fontSize: "20px", position: "relative" }}>
//               {tab.icon}
//               {tab.key === "cart" && cartCount > 0 && (
//                 <span style={{
//                   position: "absolute", top: "-6px", right: "-10px",
//                   background: "#e74c3c", color: "#fff", borderRadius: "50%",
//                   width: "16px", height: "16px", fontSize: "10px",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontWeight: "bold",
//                 }}>{cartCount > 9 ? "9+" : cartCount}</span>
//               )}
//             </span>
//             <span style={{
//               fontSize: "11px",
//               fontWeight: isActive ? "700" : "500",
//               color: isActive ? BROWN_DARK : "#999",
//             }}>{tab.label}</span>
//             <span style={{
//               position: "absolute", bottom: "-8px", width: "24px", height: "3px",
//               borderRadius: "2px", background: isActive ? BROWN_DARK : "transparent",
//             }} />
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function ThreeDotMenu({ isLoggedIn, userName, onLogout, onLoginClick, onSaleOrders,onDashboard }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div ref={menuRef} style={{ position: "relative" }}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           background: "transparent", border: "none", cursor: "pointer",
//           padding: "6px", display: "flex", alignItems: "center", justifyContent: "center",
//           color: "#fff", borderRadius: "50%", flexShrink: 0,
//           minWidth: "36px", minHeight: "36px",
//           WebkitTapHighlightColor: "transparent",
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
//         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//       >
//         <MoreVertIcon style={{ fontSize: isMobile ? "22px" : "24px" }} />
//       </button>

//      {isOpen && (
//   <div style={{
//     position: "absolute", top: "100%", right: 0, marginTop: "8px",
//     backgroundColor: "#fff", borderRadius: isMobile ? "16px" : "20px",
//     boxShadow: "0 10px 40px rgba(0,0,0,0.2)", minWidth: "300px",
//     zIndex: 1000, overflow: "hidden",
//   }}>
//     {isLoggedIn ? (
//       <>
//         <div style={{
//           padding: isMobile ? "20px 16px" : "24px 20px",
//           background: "linear-gradient(135deg, #4a2c1a 0%, #3a1f0e 100%)",
//           borderBottom: `1px solid ${ACCENT}`,
//         }}>
//           <div style={{
//             width: isMobile ? "48px" : "60px", height: isMobile ? "48px" : "60px",
//             borderRadius: "50%", background: "#c8a96e",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             marginBottom: isMobile ? "12px" : "16px",
//           }}>
//             <span style={{ color: "#4a2c1a", fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>
//               {userName?.charAt(0) || ""}
//             </span>
//           </div>
//           <div style={{ fontSize: isMobile ? "18px" : "20px", color: "#fff" }}>{userName || ""}</div>
//         </div>
//         <div style={{ padding: isMobile ? "8px" : "12px" }}>
//           {/* Sale Orders - Show for both employee and customer */}
//           {(localStorage.getItem("userType") === "employee" || localStorage.getItem("userType") === "customer") && (
//             <button
//               onClick={() => { onSaleOrders(); setIsOpen(false); }}
//               style={{
//                 width: "100%", padding: isMobile ? "14px 16px" : "16px 20px",
//                 background: "transparent", border: "none", textAlign: "left",
//                 fontSize: isMobile ? "15px" : "16px", color: BROWN,
//                 cursor: "pointer", display: "flex", alignItems: "center",
//                 gap: "12px", borderRadius: isMobile ? "8px" : "12px",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "#f5f0eb"}
//               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//             >
//               <span style={{ fontSize: isMobile ? "18px" : "20px" }}>📋</span>
//               <span>Sale Orders</span>
//             </button>
//           )}

//           {/* Dashboard - Show if onDashboard prop exists and user is logged in */}
//           {onDashboard && (
//             <button
//               onClick={() => { onDashboard(); setIsOpen(false); }}
//               style={{
//                 width: "100%", padding: isMobile ? "14px 16px" : "16px 20px",
//                 background: "transparent", border: "none", textAlign: "left",
//                 fontSize: isMobile ? "15px" : "16px", color: BROWN,
//                 cursor: "pointer", display: "flex", alignItems: "center",
//                 gap: "12px", borderRadius: isMobile ? "8px" : "12px",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "#f5f0eb"}
//               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//             >
//               <span style={{ fontSize: isMobile ? "18px" : "20px" }}>📊</span>
//               <span>Dashboard</span>
//             </button>
//           )}

//           {/* Logout - Show for all logged-in users */}
//           <button
//             onClick={() => { onLogout(); setIsOpen(false); }}
//             style={{
//               width: "100%", padding: isMobile ? "14px 16px" : "16px 20px",
//               background: "transparent", border: "none", textAlign: "left",
//               fontSize: isMobile ? "15px" : "16px", color: "#d32f2f",
//               cursor: "pointer", display: "flex", alignItems: "center",
//               gap: "12px", borderRadius: isMobile ? "8px" : "12px", marginTop: "4px",
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
//             onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//           >
//             <span style={{ fontSize: isMobile ? "18px" : "20px" }}>🚪</span>
//             <span>Logout</span>
//           </button>
//         </div>
//       </>
//     ) : (
//       <>
//         <div style={{ padding: isMobile ? "20px 16px" : "24px 20px", background: "#f9f4ef", textAlign: "center" }}>
//           <div style={{
//             width: isMobile ? "48px" : "60px", height: isMobile ? "48px" : "60px",
//             borderRadius: "50%", background: "#e0d5cc",
//             display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
//           }}>
//             <span style={{ color: BROWN, fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>?</span>
//           </div>
//           <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "600", color: BROWN, marginBottom: "4px" }}>Not Signed In</div>
//           <div style={{ fontSize: isMobile ? "13px" : "15px", color: "#666" }}>Sign in to place orders</div>
//         </div>
//         <div style={{ padding: isMobile ? "12px" : "20px" }}>
//           <button
//             onClick={() => { onLoginClick(); setIsOpen(false); }}
//             style={{
//               width: "100%", padding: isMobile ? "14px 16px" : "16px 24px",
//               background: BROWN, border: "none", borderRadius: isMobile ? "8px" : "12px",
//               fontSize: isMobile ? "15px" : "18px", fontWeight: "600", color: "#fff",
//               cursor: "pointer", display: "flex", alignItems: "center",
//               justifyContent: "center", gap: "12px",
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
//             onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
//           >
//             <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🔑</span>
//             <span>Sign In</span>
//           </button>
//         </div>
//       </>
//     )}
//   </div>
// )}
//     </div>
//   );
// }


// const INITIAL_CUSTOMER_LOAD = 10;
// const LOAD_MORE_CUSTOMERS = 15;
// function CustomerSelector({ isLoggedIn, userType, customers, selectedCustomer, onSelectCustomer, loading, isMobile }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [displayedCustomers, setDisplayedCustomers] = useState([]);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [displayCount, setDisplayCount] = useState(15);
//   const [allFilteredResults, setAllFilteredResults] = useState([]);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [isInitializing, setIsInitializing] = useState(false);
  
//   const dropdownRef = useRef(null);
//   const buttonRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const isSelectingRef = useRef(false);
//   const listContainerRef = useRef(null);
//   const searchTimeoutRef = useRef(null);
//   const openTimeoutRef = useRef(null);
  
//   const INITIAL_LOAD = 15;
//   const LOAD_MORE_COUNT = 20;
//   const BATCH_SIZE = 30;

//   // Pre-compute first batch of customers for instant display
//   const initialCustomers = useMemo(() => {
//     return customers.slice(0, INITIAL_LOAD);
//   }, [customers, INITIAL_LOAD]);

//   // Pre-compute normalized strings for faster search
//   const customerSearchCache = useMemo(() => {
//     if (!customers || customers.length === 0) return new Map();
    
//     const cacheLimit = Math.min(customers.length, 300);
//     const map = new Map();
    
//     for (let i = 0; i < cacheLimit; i++) {
//       const c = customers[i];
//       const fields = [];
//       if (c.name) fields.push(String(c.name));
//       if (c.billName) fields.push(String(c.billName));
//       if (c.mobile) fields.push(String(c.mobile));
//       if (c.city) fields.push(String(c.city));
//       if (c.id) fields.push(String(c.id));
//       if (c.address) fields.push(String(c.address));
//       if (c.brokerName) fields.push(String(c.brokerName));
//       if (c.transporterName) fields.push(String(c.transporterName));
      
//       const normalized = fields.map(f => 
//         f.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
//       );
      
//       map.set(c.id, { customer: c, normalized });
//     }
//     return map;
//   }, [customers]);



  
//   const getCustomerData = useCallback((customer) => {
//     const cached = customerSearchCache.get(customer.id);
//     if (cached) return cached;
    
//     const fields = [];
//     if (customer.name) fields.push(String(customer.name));
//     if (customer.billName) fields.push(String(customer.billName));
//     if (customer.mobile) fields.push(String(customer.mobile));
//     if (customer.city) fields.push(String(customer.city));
//     if (customer.id) fields.push(String(customer.id));
//     if (customer.address) fields.push(String(customer.address));
//     if (customer.brokerName) fields.push(String(customer.brokerName));
//     if (customer.transporterName) fields.push(String(customer.transporterName));
    
//     const normalized = fields.map(f => 
//       f.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
//     );
    
//     return { customer, normalized };
//   }, [customerSearchCache]);

//   const performSearch = useCallback((searchTerm) => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
    
//     searchTimeoutRef.current = setTimeout(() => {
//       if (!searchTerm.trim()) {
//         setDisplayedCustomers(initialCustomers);
//         setAllFilteredResults(customers);
//         setHasSearched(false);
//         setDisplayCount(INITIAL_LOAD);
//         return;
//       }
      
//       const normalizedSearch = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
//       if (!normalizedSearch || normalizedSearch.length < 2) {
//         setDisplayedCustomers(initialCustomers);
//         setAllFilteredResults(customers);
//         setHasSearched(false);
//         setDisplayCount(INITIAL_LOAD);
//         return;
//       }
      
//       const searchInChunks = () => {
//         const results = [];
//         const totalCustomers = customers.length;
//         const chunkSize = BATCH_SIZE;
//         let currentIndex = 0;
        
//         const processChunk = () => {
//           const endIndex = Math.min(currentIndex + chunkSize, totalCustomers);
          
//           for (let i = currentIndex; i < endIndex; i++) {
//             const customer = customers[i];
//             const data = getCustomerData(customer);
//             let matched = false;
            
//             for (let j = 0; j < data.normalized.length; j++) {
//               if (data.normalized[j].includes(normalizedSearch)) {
//                 matched = true;
//                 break;
//               }
//             }
            
//             if (matched) {
//               results.push(customer);
//             }
//           }
          
//           currentIndex = endIndex;
          
//           if (currentIndex < totalCustomers) {
//             if (window.requestIdleCallback) {
//               requestIdleCallback(processChunk, { timeout: 100 });
//             } else {
//               setTimeout(processChunk, 50);
//             }
//           } else {
//             setAllFilteredResults(results);
//             setHasSearched(true);
//             const initialResults = results.slice(0, INITIAL_LOAD);
//             setDisplayCount(Math.min(INITIAL_LOAD, results.length));
//             setDisplayedCustomers(initialResults);
//           }
//         };
        
//         if (window.requestIdleCallback) {
//           requestIdleCallback(processChunk, { timeout: 50 });
//         } else {
//           setTimeout(processChunk, 50);
//         }
//       };
      
//       searchInChunks();
//     }, 300);
//   }, [customers, getCustomerData, initialCustomers, INITIAL_LOAD]);

//   const handleListScroll = useCallback((e) => {
//     if (isLoadingMore) return;
    
//     const container = e.currentTarget;
//     const threshold = isMobile ? 200 : 150;
//     const isNearBottom = 
//       container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    
//     if (isNearBottom) {
//       const totalResults = hasSearched ? allFilteredResults.length : customers.length;
//       if (displayedCustomers.length < totalResults) {
//         setIsLoadingMore(true);
        
//         requestAnimationFrame(() => {
//           const nextCount = Math.min(displayCount + LOAD_MORE_COUNT, totalResults);
//           setDisplayCount(nextCount);
          
//           const source = hasSearched ? allFilteredResults : customers;
//           setDisplayedCustomers(source.slice(0, nextCount));
          
//           setIsLoadingMore(false);
//         });
//       }
//     }
//   }, [isLoadingMore, hasSearched, allFilteredResults, customers, displayedCustomers, displayCount, isMobile]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (isSelectingRef.current) return;
//       if (buttonRef.current && buttonRef.current.contains(e.target)) return;
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         handleClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("touchstart", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("touchstart", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isOpen || !isMobile) return;
    
//     let scrollTimer;
//     const handleScroll = () => {
//       clearTimeout(scrollTimer);
//       scrollTimer = setTimeout(() => {
//         if (!isSelectingRef.current && !isInitializing) {
//           handleClose();
//         }
//       }, 300);
//     };
    
//     window.addEventListener("scroll", handleScroll, true);
//     return () => {
//       window.removeEventListener("scroll", handleScroll, true);
//       clearTimeout(scrollTimer);
//     };
//   }, [isOpen, isMobile, isInitializing]);

//   useEffect(() => {
//     if (isOpen && searchInputRef.current && isMobile) {
//       setTimeout(() => {
//         if (searchInputRef.current) {
//           searchInputRef.current.focus();
//         }
//       }, 300);
//     }
//   }, [isOpen, isMobile]);

//   if (!isLoggedIn || !customers || customers.length === 0) return null;

//   const handleToggle = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isOpen) {
//       // Set initial customers IMMEDIATELY before opening
//       setDisplayedCustomers(initialCustomers);
//       setAllFilteredResults(customers);
//       setSearch("");
//       setDisplayCount(INITIAL_LOAD);
//       setHasSearched(false);
//       setIsInitializing(false);
      
//       // Open the dropdown
//       setIsOpen(true);
//     } else {
//       handleClose();
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setSearch("");
//     setDisplayedCustomers([]);
//     setHasSearched(false);
//     setDisplayCount(INITIAL_LOAD);
//     setIsInitializing(false);
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     performSearch(value);
//   };

//   const handleCustomerSelect = (customer) => {
//     isSelectingRef.current = true;
//     if (onSelectCustomer) onSelectCustomer(customer);
//     handleClose();
//     setTimeout(() => { 
//       isSelectingRef.current = false; 
//     }, 200);
//   };

//   // Mobile dropdown - Full screen with proper styling
//   const mobileDropdownStyle = {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#fff',
//     zIndex: 9999,
//     display: 'flex',
//     flexDirection: 'column',
//     overflow: 'hidden',
//     margin: 0,
//     padding: 0,
//   };

//   const desktopDropdownStyle = {
//     position: 'absolute',
//     top: 'calc(100% + 8px)',
//     left: 0,
//     right: 0,
//     width: "360px",
//     maxHeight: "400px",
//     overflowY: "auto",
//     background: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '12px',
//     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
//     zIndex: 9999,
//   };

//   const dropdownStyle = isMobile ? mobileDropdownStyle : desktopDropdownStyle;

//   return (
//     <div style={{ 
//       position: "relative", 
//       width: isMobile ? "100%" : "auto",
//       maxWidth: isMobile ? "100%" : "320px",
//     }} ref={dropdownRef}>
//       {/* Dropdown Button */}
//       <div
//         ref={buttonRef} 
//         onClick={handleToggle}
//         style={{
//           display: "flex", 
//           alignItems: "center", 
//           gap: "8px",
//           padding: isMobile ? "8px 12px" : "8px 14px",
//           background: "#f5ede3", 
//           border: `1.5px solid ${isOpen ? BROWN : ACCENT}`,
//           borderRadius: "25px", 
//           cursor: "pointer", 
//           transition: "all 0.2s",
//           width: "100%",
//           boxSizing: "border-box",
//           userSelect: "none",
//           WebkitTapHighlightColor: "transparent",
//         }}
//       >
//         <span style={{ fontSize: isMobile ? "14px" : "16px", flexShrink: 0 }}>🏪</span>
//         <span style={{
//           fontSize: isMobile ? "12px" : "14px", 
//           fontWeight: "500",
//           color: selectedCustomer ? BROWN_DARK : "#666",
//           overflow: "hidden", 
//           textOverflow: "ellipsis", 
//           whiteSpace: "nowrap", 
//           flex: 1,
//           minWidth: 0,
//         }}>
//           {selectedCustomer ? selectedCustomer.name : "Select outlet..."}
//         </span>
//         {selectedCustomer && selectedCustomer.mobile && !isMobile && (
//           <span style={{ fontSize: "10px", color: "#888", marginLeft: "2px", flexShrink: 0 }}>
//             📱{selectedCustomer.mobile}
//           </span>
//         )}
//         <span style={{
//           fontSize: "10px", 
//           color: BROWN_LIGHT, 
//           flexShrink: 0,
//           transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
//           transition: "transform 0.2s",
//         }}>▼</span>
//       </div>

//       {/* Dropdown Content */}
//       {isOpen && (
//         <div style={dropdownStyle}>
//           {/* Mobile Header */}
//           {isMobile && (
//             <div style={{
//               padding: "14px 16px",
//               background: BROWN_DARK,
//               color: "#fff",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexShrink: 0,
//               borderBottom: `1px solid ${ACCENT}`,
//               width: "100%",
//               boxSizing: "border-box",
//             }}>
//               <span style={{ fontSize: "17px", fontWeight: "bold" }}>Select Customer</span>
//               <button
//                 onClick={handleClose}
//                 style={{
//                   background: "transparent",
//                   border: "none",
//                   color: "#fff",
//                   fontSize: "22px",
//                   cursor: "pointer",
//                   padding: "4px 8px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   WebkitTapHighlightColor: "transparent",
//                 }}
//               >✕</button>
//             </div>
//           )}

//           {/* Search Bar - Fixed width issues */}
//           <div style={{
//             padding: isMobile ? "10px 16px" : "12px",
//             borderBottom: "1px solid #f0f0f0",
//             background: "#f9f9f9",
//             flexShrink: 0,
//             width: "100%",
//             boxSizing: "border-box",
//           }}>
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               width: "100%",
//               boxSizing: "border-box",
//             }}>
//               <div style={{
//                 flex: 1,
//                 minWidth: 0,
//                 position: "relative",
//               }}>
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder={isMobile ? "Search customers..." : "Search by name, mobile, city..."}
//                   value={search}
//                   onChange={handleSearchChange}
//                   autoComplete="off"
//                   style={{
//                     width: "100%",
//                     padding: isMobile ? "10px 14px" : "10px 12px",
//                     paddingLeft: isMobile ? "36px" : "12px",
//                     border: `1px solid ${ACCENT}`,
//                     borderRadius: "8px",
//                     fontSize: isMobile ? "15px" : "14px",
//                     outline: "none",
//                     boxSizing: "border-box",
//                     backgroundColor: "#fff",
//                     color: BROWN_DARK,
//                     WebkitAppearance: "none",
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = ACCENT}
//                 />
//                 {/* Search Icon inside input */}
//                 {isMobile && (
//                   <SearchIcon style={{
//                     position: "absolute",
//                     left: "10px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     fontSize: "18px",
//                     color: "#999",
//                     pointerEvents: "none",
//                   }} />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Search Results Info */}
//           {hasSearched && search.trim() && (
//             <div style={{
//               padding: "6px 16px",
//               fontSize: "11px",
//               color: allFilteredResults.length > 0 ? "#4caf50" : "#e74c3c",
//               background: "#fafafa",
//               borderBottom: "1px solid #f0f0f0",
//               flexShrink: 0,
//               width: "100%",
//               boxSizing: "border-box",
//             }}>
//               {allFilteredResults.length} result{allFilteredResults.length !== 1 ? "s" : ""} found
//             </div>
//           )}

//           {/* Customer List - Fixed alignment */}
//           <div
//             ref={listContainerRef}
//             onScroll={handleListScroll}
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               WebkitOverflowScrolling: "touch",
//               minHeight: "200px",
//               width: "100%",
//               boxSizing: "border-box",
//               padding: isMobile ? "0" : "4px 0",
//             }}
//           >
//             {loading || isInitializing ? (
//               <div style={{
//                 padding: "40px",
//                 textAlign: "center",
//                 color: "#999",
//                 width: "100%",
//                 boxSizing: "border-box",
//               }}>
//                 <CircularProgress size={24} style={{ color: BROWN }} />
//                 <div style={{ marginTop: "10px", fontSize: "13px" }}>Loading...</div>
//               </div>
//             ) : displayedCustomers.length === 0 ? (
//               <div style={{
//                 padding: "60px 20px",
//                 textAlign: "center",
//                 color: "#999",
//                 fontSize: "13px",
//                 width: "100%",
//                 boxSizing: "border-box",
//               }}>
//                 {hasSearched && search.trim() ? "No matching customers" : "No customers available"}
//               </div>
//             ) : (
//               <>
//                 {displayedCustomers.map((customer) => {
//                   const isSelected = selectedCustomer?.id === customer.id;
                  
//                   return (
//                     <div
//                       key={customer.id}
//                       onClick={() => handleCustomerSelect(customer)}
//                       style={{
//                         padding: isMobile ? "14px 16px" : "12px 16px",
//                         borderBottom: "1px solid #f5f0eb",
//                         cursor: "pointer",
//                         background: isSelected ? "#f0e9e2" : "transparent",
//                         transition: "background 0.1s",
//                         width: "100%",
//                         boxSizing: "border-box",
//                         textAlign: "left",
//                       }}
//                       onTouchStart={() => {
//                         if (!isSelected) {
//                           const el = document.getElementById(`customer-${customer.id}`);
//                           if (el) {
//                             el.style.background = "#faf6f2";
//                             setTimeout(() => {
//                               el.style.background = isSelected ? "#f0e9e2" : "transparent";
//                             }, 150);
//                           }
//                         }
//                       }}
//                       id={`customer-${customer.id}`}
//                     >
//                       <div style={{
//                         fontSize: isMobile ? "15px" : "14px",
//                         fontWeight: isSelected ? "700" : "500",
//                         color: BROWN_DARK,
//                         marginBottom: "4px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px",
//                         textAlign: "left",
//                       }}>
//                         {isSelected && (
//                           <span style={{ color: "#4caf50", fontSize: "14px" }}>✓</span>
//                         )}
//                         <span style={{ wordBreak: "break-word" }}>{customer.name}</span>
//                         {customer.partyMailingName && customer.partyMailingName !== customer.name && (
//                           <span style={{ fontSize: "11px", color: "#888", fontWeight: "normal" }}>
//                             ({customer.partyMailingName})
//                           </span>
//                         )}
//                       </div>
//                       <div style={{
//                         fontSize: isMobile ? "12px" : "11px",
//                         color: "#666",
//                         display: "flex",
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         gap: "8px",
//                         textAlign: "left",
//                       }}>
//                         {customer.mobile && (
//                           <span style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: "3px",
//                             background: "#f0e9e2",
//                             padding: "2px 8px",
//                             borderRadius: "12px",
//                             fontSize: isMobile ? "11px" : "10px",
//                             color: BROWN_DARK,
//                           }}>📱 {customer.mobile}</span>
//                         )}
//                         {customer.city && (
//                           <span style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: "3px",
//                             fontSize: isMobile ? "11px" : "10px",
//                             color: "#888",
//                           }}>📍 {customer.city}</span>
//                         )}
//                       </div>
//                       {(!isMobile || (customer.brokerName || customer.transporterName)) && (
//                         <div style={{
//                           fontSize: "10px",
//                           color: "#aaa",
//                           marginTop: "3px",
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "8px",
//                           textAlign: "left",
//                         }}>
//                           {customer.brokerName && customer.brokerName !== "0" && <span>🏢 {customer.brokerName}</span>}
//                           {customer.transporterName && customer.transporterName !== "0" && <span>🚚 {customer.transporterName}</span>}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {/* Load More */}
//                 {!loading && !isInitializing && displayedCustomers.length > 0 &&
//                  displayedCustomers.length < (hasSearched ? allFilteredResults.length : customers.length) && (
//                   <div style={{
//                     padding: "12px 16px",
//                     textAlign: "center",
//                     borderTop: "1px solid #f0f0f0",
//                     background: "#f9f9f9",
//                     width: "100%",
//                     boxSizing: "border-box",
//                   }}>
//                     {isLoadingMore ? (
//                       <CircularProgress size={16} style={{ color: BROWN }} />
//                     ) : (
//                       <button
//                         onClick={() => {
//                           const totalResults = hasSearched ? allFilteredResults.length : customers.length;
//                           const nextCount = Math.min(displayCount + LOAD_MORE_COUNT, totalResults);
//                           setDisplayCount(nextCount);
//                           const source = hasSearched ? allFilteredResults : customers;
//                           setDisplayedCustomers(source.slice(0, nextCount));
//                         }}
//                         style={{
//                           background: "transparent",
//                           border: `1px solid ${BROWN_LIGHT}`,
//                           borderRadius: "8px",
//                           padding: "8px 16px",
//                           color: BROWN_DARK,
//                           fontSize: "12px",
//                           cursor: "pointer",
//                           fontWeight: "500",
//                           width: "100%",
//                           maxWidth: "100%",
//                           boxSizing: "border-box",
//                         }}
//                       >
//                         Load More ({displayedCustomers.length} / {hasSearched ? allFilteredResults.length : customers.length})
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// const QuotationPrint = forwardRef(({ customer, cartItems, totals, storage,createdOn, orderDate }, ref) => {
  
//   const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
//   const rupee = (n) =>
//     safeNum(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const totalKgs = cartItems?.length
//     ? cartItems.reduce((sum, item) => sum + safeNum(item.kgs), 0) : 0;

//   const totalBags = cartItems?.length
//     ? cartItems.reduce((sum, item) => {
//         const displayName = item.shortName || item.Print_Name || "";
//         const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
//         return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
//       }, 0) : 0;


//        const formatCreatedDate = () => {
//     // First try to use createdOn from the order
//     let dateToUse = createdOn || orderDate;
    
//     if (dateToUse) {
//       try {
//         let dateObj;
        
//         // Handle different date formats
//         if (typeof dateToUse === 'string') {
//           // Check if it's in "YYYY-MM-DD HH:MM:SS" format
//           if (dateToUse.includes(' ') && dateToUse.includes('-')) {
//             const [datePart, timePart] = dateToUse.split(' ');
//             const [year, month, day] = datePart.split('-');
            
//             if (timePart) {
//               const [hours, minutes] = timePart.split(':');
//               // Create date object with these parts
//               dateObj = new Date(year, parseInt(month) - 1, day, parseInt(hours), parseInt(minutes));
//             } else {
//               dateObj = new Date(year, parseInt(month) - 1, day);
//             }
//           } 
//           // Check if it's ISO format with T
//           else if (dateToUse.includes('T')) {
//             dateObj = new Date(dateToUse);
//           }
//           // Try parsing as regular date string
//           else {
//             dateObj = new Date(dateToUse);
//           }
          
//           // Check if date is valid
//           if (!isNaN(dateObj.getTime())) {
//             // Format to DD/MM/YYYY HH:MM AM/PM
//             const day = String(dateObj.getDate()).padStart(2, '0');
//             const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//             const year = dateObj.getFullYear();
//             let hours = dateObj.getHours();
//             const minutes = String(dateObj.getMinutes()).padStart(2, '0');
//             const ampm = hours >= 12 ? 'PM' : 'AM';
//             hours = hours % 12 || 12;
            
//             return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
//           }
//         }
//         // If dateToUse is already a Date object
//         else if (dateToUse instanceof Date && !isNaN(dateToUse.getTime())) {
//           const day = String(dateToUse.getDate()).padStart(2, '0');
//           const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
//           const year = dateToUse.getFullYear();
//           let hours = dateToUse.getHours();
//           const minutes = String(dateToUse.getMinutes()).padStart(2, '0');
//           const ampm = hours >= 12 ? 'PM' : 'AM';
//           hours = hours % 12 || 12;
          
//           return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
//         }
//       } catch (e) {
//         console.warn("Error parsing date:", e);
//       }
//     }
    
//     // Fallback to current IST time
//     const now = new Date();
//     const istOffset = 5.5 * 60 * 60 * 1000;
//     const istDate = new Date(now.getTime() + istOffset);
//     const year = istDate.getUTCFullYear();
//     const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(istDate.getUTCDate()).padStart(2, '0');
//     let hours = istDate.getUTCHours();
//     const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
    
//     return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
//   };
  
//   // Also format the order date separately if needed
//   const formatOrderDate = () => {
//     if (orderDate) {
//       try {
//         let dateObj = new Date(orderDate);
//         if (!isNaN(dateObj.getTime())) {
//           const day = String(dateObj.getDate()).padStart(2, '0');
//           const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//           const year = dateObj.getFullYear();
//           return `${day}/${month}/${year}`;
//         }
//       } catch (e) {}
//     }
//     return formatCreatedDate().split(' ')[0]; // Return just the date part
//   };

  
//   return (
//     <>
//       <style>{`
//         @media print {
//           @page { size: 80mm auto; margin: 0mm; }
//           body * { visibility: hidden; }
//           #print-section, #print-section * { visibility: visible; }
//           #print-section {
//             position: absolute; left: 0; top: 0; width: 80mm; margin: 0; padding: 2mm;
//           }
//           .print-container { width: 80mm !important; margin: 0 auto !important; }
//           table { width: 100% !important; page-break-inside: avoid; }
//           tr, td, th { page-break-inside: avoid; }
//         }
//       `}</style>
//       <div
//         id="print-section"
//         ref={ref}
//         className="print-container"
//         style={{
//           width: "80mm", fontFamily: "'Courier New', Courier, monospace",
//           fontSize: "14px", padding: "2mm", lineHeight: 1.4,
//           color: "#000", fontWeight: 900, backgroundColor: "#fff",
//         }}
//       >
//         <div style={{ marginBottom: "2mm", fontSize: "14px", fontWeight: 1000 }}>
//         {formatCreatedDate()}
//           {"  TAKEN: "}{storage?.Created_BY_Name || storage?.Name || "—"}
//         </div>


// <div style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", padding: "1mm 0", marginBottom: "2mm" }}>
//   {[
//     ["PARTY NAME", customer?.Billl_Name || customer?.Party_Mailing_Name || "—"],
//     ["LOCATION", customer?.Party_Location || customer?.Party_Mailing_Address || customer?.City || "—"],
//     ["PH.NO", customer?.Mobile_No || customer?.Land_Line || "—"],
//     ["TRANSPORT", customer?.Transporter || "—"],
//     ["BROKER", customer?.Broker || "—"],
//   ].map(([label, value], i) => (
//     <div key={i} style={{ fontWeight: 800, marginBottom: i < 4 ? "2px" : 0, display: "flex", alignItems: "flex-start" }}>
//       <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>{label.padEnd(10)} : </span>
//       <span style={{ flex: 1, wordBreak: "break-word" }}>{value}</span>
//     </div>
//   ))}
// </div>

//         <div style={{ border: "0.5px solid #000" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 {[["RATE", "25mm"], ["ITEM NAME", "45mm"], ["BAGS", "10mm"]].map(([h, w]) => (
//                   <th key={h} style={{
//                     border: "0.5px solid #000", padding: "0.5mm", textAlign: "center",
//                     fontSize: "14px", fontWeight: 800, background: "#f5f5f5", width: w,
//                   }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems && cartItems.length > 0 ? (
//                 cartItems.map((item, i) => {
//                   const displayName = item.shortName || item.Print_Name || "";
//                   const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
//                   const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
//                   return (
//                     <tr key={i} style={{ minHeight: "8mm" }}>
//                       <td style={{ border: "0.5px solid #000", padding: "2mm 1mm", textAlign: "center", verticalAlign: "middle", fontSize: "14px", fontWeight: 900 }}>
//                         ₹{rupee(item.price)}
//                       </td>
//                       <td style={{ border: "0.5px solid #000", textAlign: "left", paddingLeft: "1.5mm", paddingRight: "1.5mm", verticalAlign: "middle", fontSize: "13px", fontWeight: 800, wordBreak: "break-word" }}>
//                         {displayName}
//                       </td>
//                       <td style={{ border: "0.5px solid #000", textAlign: "center", padding: "0.3mm", verticalAlign: "middle", fontSize: "13px", fontWeight: 800 }}>
//                         {bags > 0 ? Math.round(bags) : 0}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 Array.from({ length: 8 }).map((_, i) => (
//                   <tr key={i} style={{ minHeight: "8mm" }}>
//                     <td style={{ border: "0.5px solid #000", padding: "2px" }}></td>
//                     <td style={{ border: "0.5px solid #000", padding: "2px" }}></td>
//                     <td style={{ border: "0.5px solid #000", padding: "2px" }}></td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//           <div style={{
//             background: "#f0f0f0", borderTop: "1px solid #000", padding: "1mm",
//             display: "flex", justifyContent: "space-between", alignItems: "center",
//             fontSize: "12px", fontWeight: "bold",
//           }}>
//             <span>₹{rupee(totals?.subtotal)}</span>
//             <span>{totalKgs.toFixed(2)} KGS</span>
//             <span>{Math.round(totalBags)} BAGS</span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// });

// QuotationPrint.displayName = "QuotationPrint";



// const PrintPreviewModal = ({ open, onClose, customer, cartItems, totals, onPrintAndSave, storage, isReprint = false,createdOn, orderDate }) => {
//   const printRef = useRef();
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768);
//   }, []);

//   // Function to trigger print directly
//   const triggerDirectPrint = (htmlContent) => {
//     // Create a new window
//     const printWindow = window.open('', '_blank', 'width=600,height=800');
    
//     if (!printWindow) {
//       toast.error('Please allow popups to print');
//       return false;
//     }
    
//     // Write the HTML content
//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
    
//     // Wait for content to load then print
//     printWindow.onload = () => {
//       setTimeout(() => {
//         printWindow.focus();
//         printWindow.print();
        
//         // Optional: close after print (but give user time to see)
//         printWindow.onafterprint = () => {
//           setTimeout(() => {
//             if (confirm("Print completed. Close this window?")) {
//               printWindow.close();
//             }
//           }, 500);
//         };
//       }, 500);
//     };
    
//     return true;
//   };


//   const buildCompletePrintHtml = () => {
//     const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
//     const rupee = (n) => safeNum(n).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//     const totalKgs = (cartItems || []).reduce((s, i) => s + safeNum(i.kgs), 0);
//     const totalBags = (cartItems || []).reduce((sum, item) => {
//       const displayName = item.shortName || item.Print_Name || "";
//       const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
//       return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
//     }, 0);

//     const rows = (cartItems || [])
//       .map((item) => {
//         const displayName = item.shortName || item.Print_Name || "";
//         const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
//         const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
//         return `
//           <tr>
//             <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
//               ₹${rupee(item.price)}
//             </td>
//             <td style="border:1px solid #000;padding:8px 4px;text-align:left;font-size:14px;">
//               ${displayName}
//             </td>
//             <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
//               ${bags > 0 ? Math.round(bags) : 0}
//             </td>
//           </tr>`;
//       })
//       .join("");



      
//     const now = new Date();
//     const dateStr = now.toLocaleDateString("en-GB");
//     const timeStr = now.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//     const takenBy = storage?.Created_BY_Name || storage?.Name || "—";

// return `<!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
//       <title>SM Traders - Receipt</title>
//       <style>
//         @media print {
//           @page {
//             size: 80mm auto;
//             margin: 0mm;
//           }
//           body {
//             margin: 0;
//             padding: 2mm;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         body {
//           font-family: 'Courier New', Courier, monospace;
//           font-size: 14px;
//           padding: 5mm;
//           background: white;
//         }
        
//         .receipt {
//           max-width: 80mm;
//           margin: 0;
//           background: white;
//           text-align: left;
//         }
        
//         .info-row {
//           display: flex;
//           margin-bottom: 5px;
//           font-size: 14px;
//           text-align: left;
//         }
        
//         .info-label {
//           min-width: 100px;
//           font-weight: bold;
//           text-align: left;
//         }
        
//         .info-value {
//           flex: 1;
//           text-align: left;
//           font-weight: bold;
//         }
        
//         .date-taken-row {
//           display: flex;
//           justify-content: space-between;
//           font-weight: bold;
//           font-size: 15px;
      
//           text-align: left;
//           margin-bottom: 10px;
//         }
        
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 10px 0;
//         }
        
//         th {
//           background: #f0f0f0;
//           font-weight: bold;
//           padding: 8px 5px;
//           border: 1px solid #000;
//           text-align: center;
//           font-size: 15px;
//         }
        
//         td {
//           padding: 8px 5px;
//           border: 1px solid #000;
          
//           text-align: center;
//           font-size: 15px;
//           font-weight: bold !important;
//         }
        
//         td:nth-child(2) {
//           text-align: left;
//           font-weight: bold !important;
//         }
        
//         .total-row {
//           background: #f0f0f0;
//           display: flex;
//           justify-content: space-between;
//           padding: 8px;
//           font-weight: bold;
          
//           border: 1px solid #000;
//           border-top: none;
//           text-align: left;
//         }
        
//         .print-button-container {
//           position: fixed;
//           bottom: 20px;
//           left: 0;
//           right: 0;
//           text-align: center;
//           padding: 16px;
//           z-index: 10000;
//         }
        
//         .print-btn {
//           background: #4a2c1a;
//           color: white;
//           border: none;
//           padding: 15px 30px;
//           border-radius: 10px;
//           font-size: 18px;
//           font-weight: bold;
//           cursor: pointer;
//           width: 90%;
//           max-width: 300px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//         }
        
//         .close-btn {
//           background: #999;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 8px;
//           font-size: 14px;
//           cursor: pointer;
//           margin-top: 10px;
//           width: 90%;
//           max-width: 300px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="receipt">
       
//         <div class="date-taken-row">
//           <span>${dateStr} ${timeStr}</span>
//           <span>TAKEN: ${takenBy}</span>
//         </div>

//         <div style="border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; margin-bottom: 15px;">
//           <div class="info-row">
//             <span class="info-label">PARTY NAME:</span>
//             <span class="info-value">${customer?.Party_Mailing_Name || customer?.Billl_Name || "—"}</span>
//           </div>
//           <div class="info-row">
//             <span class="info-label">LOCATION:</span>
//             <span class="info-value">${customer?.Party_Mailing_Address || customer?.Party_Location || customer?.City || "—"}</span>
//           </div>
//           <div class="info-row">
//             <span class="info-label">PHONE:</span>
//             <span class="info-value">${customer?.Mobile_No || customer?.Land_Line || "—"}</span>
//           </div>
//           <div class="info-row">
//             <span class="info-label">TRANSPORT:</span>
//             <span class="info-value">${customer?.Transporter || "—"}</span>
//           </div>
//           <div class="info-row">
//             <span class="info-label">BROKER:</span>
//             <span class="info-value">${customer?.Broker || "—"}</span>
//           </div>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th style="width: 20%">RATE</th>
//               <th style="width: 60%">ITEM NAME</th>
//               <th style="width: 20%">BAGS</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${rows && rows.length > 0 ? rows : `
//             <tr>
//               <td colspan="3" style="text-align:center;padding:20px;font-weight:bold;">No items</td>
//             </tr>
//             `}
//           </tbody>
//         </table>
        
//         <div class="total-row">
//           <span>₹${rupee(totals?.subtotal)}</span>
//           <span>${totalKgs.toFixed(2)} KGS</span>
//           <span>${Math.round(totalBags)} BAGS</span>
//         </div>
//       </div>
      
//       <div class="print-button-container no-print">
//         <button class="print-btn" onclick="window.print();">🖨️ PRINT RECEIPT</button>
//         <button class="close-btn" onclick="window.close();">✕ CLOSE</button>
//       </div>
      
//       <script>
//         // Auto-trigger print after page loads
//         window.onload = function() {
//           setTimeout(function() {
//             window.print();
//           }, 500);
//         };
//       </script>
//     </body>
//     </html>`;
//   };

//   const handlePrint = async () => {
//     setIsPrinting(true);
    
//     try {

//       if (!isReprint && onPrintAndSave) {
//         const saveResult = await onPrintAndSave();
//         if (!saveResult) {
//           setIsPrinting(false);
//           return;
//         }
//       }

     
//       onClose();
      
//       setTimeout(() => {
//         const html = buildCompletePrintHtml();
//         triggerDirectPrint(html);
//         setIsPrinting(false);
//       }, 300);
      
//     } catch (error) {
//       console.error("Print error:", error);
//       toast.error("Print failed: " + (error.message || "Unknown error"));
//       setIsPrinting(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={(_, reason) => {
//         if (reason !== "backdropClick" || !isPrinting) onClose();
//       }}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         style: { margin: "10px", width: "calc(100% - 20px)", maxWidth: "500px" },
//       }}
//     >
//       <DialogTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
//         {isReprint ? "Reprint Quotation" : "Print Preview — Quotation"}
//       </DialogTitle>

//       <DialogContent style={{
//         overflowX: "auto", display: "flex", justifyContent: "center",
//         alignItems: "center", minHeight: "400px", backgroundColor: "#f5f5f5",
//       }}>
//         <div className="print-container" style={{
//           backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "inline-block",
//         }}>
//           <QuotationPrint
//             ref={printRef}
//             customer={customer}
//             cartItems={cartItems}
//             totals={totals}
//             storage={storage}
//               createdOn={createdOn} // Pass this
//             orderDate={orderDate} // Pass this
//           />
//         </div>
//       </DialogContent>

//       <DialogActions style={{ padding: "16px" }}>
//         <Button onClick={() => { if (!isPrinting) onClose(); }} variant="outlined" disabled={isPrinting}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handlePrint}
//           disabled={isPrinting}
//           style={{ fontWeight: "bold", backgroundColor: BROWN_DARK }}
//         >
//           {isPrinting ? "Processing..." : isReprint ? "Print" : "Print & Save"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };


// // iOS-specific print handler
// const handleIOSPrint = (html) => {
//   // Create a blob and open in new tab
//   const blob = new Blob([html], { type: 'text/html' });
//   const url = URL.createObjectURL(blob);
//   window.open(url, '_blank');
//   setTimeout(() => URL.revokeObjectURL(url), 1000);
//   toast.info('Tap Share button then Print to print');
// };


// const TransporterDropdown = ({ selectedTransporter, onSelectTransporter, availableTransporters, loading, onOpen }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       setTimeout(() => inputRef.current?.focus(), 50);
//     }
//   }, [isOpen]);



//   const filteredTransporters = searchTerm.trim()
//     ? availableTransporters.filter(t => {
//         const search = searchTerm.toLowerCase().trim();
//         const nameMatch = (t.name || "").toLowerCase().includes(search);
//         const aliasMatch = (t.alias_name || "").toLowerCase().includes(search);
//         const codeMatch = (t.code || "").toLowerCase().includes(search);
//         const mobileMatch = (t.mobile || "").toLowerCase().includes(search);
        
//         return nameMatch || aliasMatch || codeMatch || mobileMatch;
//       })
//     : availableTransporters;

  

//   return (
//     <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
//       <div
//         onClick={() => { setIsOpen(prev => !prev); onOpen && onOpen(); }}
//         style={{
//           padding: "12px",
//           border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
//           borderRadius: "8px", background: "#fff", cursor: "pointer",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           transition: "border-color 0.2s",
//         }}
//       >
//         <span style={{ 
//           color: selectedTransporter.name ? BROWN : "#999", fontSize: "14px",
//           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 
//         }}>
//           {selectedTransporter.name || "Select Transporter"}
//         </span>
//         <span style={{
//           color: BROWN_LIGHT, fontSize: "11px", marginLeft: "8px",
//           transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
//         }}>▼</span>
//       </div>

//       {isOpen && (
//         <div style={{
//           position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
//           background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
//           maxHeight: "280px", overflowY: "auto", zIndex: 1000,
//           boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//         }}>
//           <div style={{
//             padding: "8px", borderBottom: "1px solid #f0f0f0",
//             position: "sticky", top: 0, background: "#fff",
//             display: "flex", alignItems: "center", gap: "6px",
//           }}>
//             <SearchIcon style={{ fontSize: "16px", color: "#999", flexShrink: 0 }} />
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder="Search by name, alias, code or mobile..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 flex: 1, border: `1px solid ${ACCENT}`,
//                 borderRadius: "6px", padding: "6px 8px",
//                 fontSize: "13px", outline: "none", boxSizing: "border-box",
//               }}
//               onFocus={(e) => e.target.style.borderColor = BROWN}
//               onBlur={(e) => e.target.style.borderColor = ACCENT}
//             />
//             {searchTerm && (
//               <button
//                 onClick={(e) => { e.stopPropagation(); setSearchTerm(""); }}
//                 style={{ background: "transparent", border: "none", cursor: "pointer",
//                   color: "#aaa", fontSize: "16px", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
//               >×</button>
//             )}
//           </div>

//           {searchTerm.trim() && (
//             <div style={{
//               padding: "4px 12px", fontSize: "11px", color: "#999",
//               background: "#fafafa", borderBottom: "1px solid #f0f0f0",
//             }}>
//               {filteredTransporters.length} result{filteredTransporters.length !== 1 ? "s" : ""} for "{searchTerm}"
//             </div>
//           )}

//           <div
//             onClick={() => { onSelectTransporter({ id: null, name: "" }); setIsOpen(false); setSearchTerm(""); }}
//             style={{
//               padding: "10px 12px", borderBottom: "1px solid #f5f0eb",
//               cursor: "pointer", fontSize: "13px", color: "#999", fontStyle: "italic",
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = "#faf6f2"}
//             onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//           >
//             — None —
//           </div>

//           {loading ? (
//             <div style={{ padding: "16px", textAlign: "center" }}>
//               <CircularProgress size={16} style={{ color: BROWN }} />
//             </div>
//           ) : filteredTransporters.length === 0 ? (
//             <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "13px" }}>
//               No transporters found{searchTerm ? ` for "${searchTerm}"` : ""}
//             </div>
//           ) : (
//             filteredTransporters.map(transporter => (
//               <div
//                 key={transporter.id}
//                 onClick={() => { onSelectTransporter({ id: transporter.id, name: transporter.name }); setIsOpen(false); setSearchTerm(""); }}
//                 style={{
//                   padding: "10px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
//                   background: selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent",
//                 }}
//                 onMouseEnter={(e) => { if (selectedTransporter.id !== transporter.id) e.currentTarget.style.background = "#faf6f2"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent"; }}
//               >
//                 <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{transporter.name}</div>
//                 {/* {transporter.alias_name && (
//                   <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
//                     Alias: {transporter.alias_name}
//                   </div>
//                 )} */}
//                 {(transporter.code || transporter.mobile) && (
//                   <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
//                     {transporter.code && `Code: ${transporter.code}`}
//                     {transporter.code && transporter.mobile && " | "}
//                     {transporter.mobile}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const MobileCartDrawer = ({
//   isOpen, onClose, cartItems, products, allProducts, onUpdateQty, onRemoveItem,
//   isLoggedIn, onLoginClick, externalCustomers, onCustomerChange,
//   selectedCustomer: headerSelectedCustomer, userType, footerOffset = 0,
// }) => {
//   const [step, setStep] = useState(1);
//   const [contactNumber, setContactNumber] = useState("");
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [description, setDescription] = useState("");
//   const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [creditInfo, setCreditInfo] = useState(null);
//   const [showCreditLimitDialog, setShowCreditLimitDialog] = useState(false);
//   const selectedCustomer = headerSelectedCustomer;

//   const [availableBrokers, setAvailableBrokers] = useState([]);
//   const [availableTransporters, setAvailableTransporters] = useState([]);
//   const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
//   const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
//   const [loadingBrokers, setLoadingBrokers] = useState(false);
//   const [loadingTransporters, setLoadingTransporters] = useState(false);
//   const [customerSearch, setCustomerSearch] = useState("");
//   const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
//   const [printModalOpen, setPrintModalOpen] = useState(false);
//   const [lastOrderData, setLastOrderData] = useState(null);
//   const printRef = useRef();

//   const [brokerDropdownOpen, setBrokerDropdownOpen] = useState(false);
//   const [brokerSearch, setBrokerSearch] = useState("");
//   const [transporterSearch, setTransporterSearch] = useState("");

//   // State for editable prices and quantities
//   const [customPrices, setCustomPrices] = useState({});
//   const [editingProductId, setEditingProductId] = useState(null);
//   const [editingField, setEditingField] = useState(null); // 'price' or 'qty'
//   const [tempValue, setTempValue] = useState("");

//   const handleReactPrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "QuotationBill",
//     onAfterPrint: () => {
//       toast.success("Print completed successfully");
//       Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
//       localStorage.removeItem('cartItems');
//       localStorage.removeItem('selectedCustomer');
//       localStorage.removeItem('selectedCustomerId');
//       setPrintModalOpen(false);
//       onClose();
//     },
//     onPrintError: (error) => {
//       console.error("Print Error:", error);
//       toast.error("Print failed");
//     },
//   });

//   useEffect(() => {
//     if (isOpen) { fetchBrokers(); fetchTransporters(); }
//   }, [isOpen]);

//   const fetchBrokers = async () => {
//     if (availableBrokers.length > 0) return;
//     setLoadingBrokers(true);
//     try {
//       const response = await fetchLink({ address: `pos/brokers` });
//       if (response?.success) {
//         const data = response.data?.Brokers || response.data || [];
//         if (Array.isArray(data)) {
//           setAvailableBrokers(data.map(b => ({ 
//             id: String(b.Broker_Id).trim(), 
//             name: (b.Broker_Name || "").trim(),
//             alias_name: b.Allias_Name || b.alias_name || b.Alias || b.alias || "",
//             code: b.Broker_Code || b.code || "",
//             mobile: b.Mobile_No || b.mobile || ""
//           })));
//         }
//       }
//     } catch (error) { console.error("Failed to load brokers:", error); }
//     finally { setLoadingBrokers(false); }
//   };

//   const fetchTransporters = async () => {
//     if (availableTransporters.length > 0) return;
//     setLoadingTransporters(true);
//     try {
//       const response = await fetchLink({ address: `pos/transporters` });
//       if (response?.success) {
//         const data = response.data?.Transporters || response.data || [];
//         if (Array.isArray(data)) {
//           setAvailableTransporters(data.map(t => ({
//             id: String(t.Transporter_Id).trim(),
//             name: (t.Transporter_Name || "").trim(),
//             alias_name: (t.Allias_Name || t.Alias_name || t.Alias || "").trim(),
//             code: (t.Transporter_Code || t.code || "").trim(),
//             mobile: (t.Mobile_No || t.mobile || "").trim()
//           })));
//         }
//       }
//     } catch (error) {
//       console.error("Failed to load transporters:", error);
//       toast.error("Failed to load transporters");
//     } finally {
//       setLoadingTransporters(false);
//     }
//   };

//   const fetchCreditInfo = async (retailerId) => {
//     if (!retailerId) { setCreditInfo(null); return; }
//     try {
//       const response = await fetchLink({
//         address: `receipt/receiptMaster/pendingSalesInvoiceReceipt/amount?Retailer_Id=${retailerId}`,
//         method: "GET",
//       });
//       if (response?.success) {
//         setCreditInfo(response.others || null);
//       } else {
//         setCreditInfo(null);
//       }
//     } catch (error) {
//       console.error("Error fetching credit info:", error);
//       setCreditInfo(null);
//     }
//   };

//   useEffect(() => {
//     if (selectedCustomer?.id) {
//       fetchCreditInfo(selectedCustomer.id);
//     } else {
//       setCreditInfo(null);
//     }
//   }, [selectedCustomer?.id]);

//   useEffect(() => {
//     if (selectedCustomer) {
//       const isEditing = localStorage.getItem('isEditingOrder') === 'true';
//       let contactNum = selectedCustomer.mobile || "";
//       let shipAddress = selectedCustomer.address || "";
//       let deliverAddress = selectedCustomer.address || "";
//       let customerCity = selectedCustomer.city || "";
      
//       if (isEditing) {
//         const editDataStr = localStorage.getItem('editOrderData');
//         if (editDataStr) {
//           try {
//             const editData = JSON.parse(editDataStr);
//             contactNum = editData.originalMobile || selectedCustomer.mobile || "";
//             shipAddress = editData.originalAddress || selectedCustomer.address || "";
//             deliverAddress = editData.originalAddress || selectedCustomer.address || "";
//             customerCity = editData.originalCity || selectedCustomer.city || "";
//           } catch(e) {}
//         }
//       }
      
//       setContactNumber(contactNum);
//       if (shipAddress) {
//         setShippingAddress(shipAddress);
//         setDeliveryAddress(deliverAddress);
//       }

//       if (selectedCustomer.brokerName && selectedCustomer.brokerName !== "0") {
//         const brokerName = String(selectedCustomer.brokerName).trim();
//         const brokerId = selectedCustomer.brokerId ? String(selectedCustomer.brokerId).trim() : null;
        
//         if (brokerId && brokerId !== "0" && brokerId !== "null" && brokerId !== "") {
//           const found = availableBrokers.find(b => b.id === brokerId);
//           setSelectedBroker(found || { id: brokerId, name: brokerName });
//         } else {
//           const found = availableBrokers.find(b => b.name.toLowerCase() === brokerName.toLowerCase());
//           setSelectedBroker(found || { id: null, name: brokerName });
//         }
//       } else {
//         setSelectedBroker({ id: null, name: "" });
//       }

//       if (selectedCustomer.transporterName && selectedCustomer.transporterName !== "0") {
//         const transporterName = String(selectedCustomer.transporterName).trim();
//         const transporterId = selectedCustomer.transporterId ? String(selectedCustomer.transporterId).trim() : null;
        
//         if (transporterId && transporterId !== "0" && transporterId !== "null" && transporterId !== "") {
//           const found = availableTransporters.find(t => t.id === transporterId);
//           setSelectedTransporter(found || { id: transporterId, name: transporterName });
//         } else {
//           const found = availableTransporters.find(t => t.name.toLowerCase() === transporterName.toLowerCase());
//           setSelectedTransporter(found || { id: null, name: transporterName });
//         }
//       } else {
//         setSelectedTransporter({ id: null, name: "" });
//       }
//     }
//   }, [selectedCustomer, availableBrokers, availableTransporters]);

//   useEffect(() => {
//     if (!isOpen) { setTimeout(() => setStep(1), 300); setCustomerSearch(""); }
//   }, [isOpen]);

//   const getProductPackGet = (productId) => {
//     const p = allProducts.find(p => String(p.Product_Id) === productId) || products.find(p => p.id === productId);
//     return p?.packGet || parseFloat(p?.PackGet) || 1;
//   };

//   // Enhanced cart items with custom prices
//   const enhancedCartItems = Object.entries(cartItems)
//     .filter(([_, qty]) => qty > 0)
//     .map(([productId, qty]) => {
//       const product = products.find(p => p.id === productId) || {};
//       const packGet = getProductPackGet(productId);
//       const kgs = qty * packGet;
//       const price = customPrices[productId] !== undefined ? customPrices[productId] : (product.price || 0);
//       const amount = price * qty * packGet;
//       return { ...product, id: productId, quantity: qty, packGet, kgs, amount, price };
//     });

//   const totalItems = enhancedCartItems.reduce((s, i) => s + i.quantity, 0);
//   const totalKgs = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);
//   const subtotalAmount = enhancedCartItems.reduce((s, i) => s + i.amount, 0);

//   // Handle price click
//   const handlePriceClick = (productId, currentPrice) => {
//     setEditingProductId(productId);
//     setEditingField('price');
//     setTempValue(currentPrice.toString());
//   };

//   // Handle quantity click
//   const handleQtyClick = (productId, currentQty) => {
//     setEditingProductId(productId);
//     setEditingField('qty');
//     setTempValue(currentQty.toString());
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     if (editingField === 'price') {
//       if (value === '' || /^\d*\.?\d*$/.test(value)) {
//         setTempValue(value);
//       }
//     } else if (editingField === 'qty') {
//       if (value === '' || /^\d+$/.test(value)) {
//         setTempValue(value);
//       }
//     }
//   };

//   // Handle key down (Enter to save, Escape to cancel)
//   const handleKeyDown = (e, productId) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSaveEdit(productId);
//     } else if (e.key === 'Escape') {
//       handleCancelEdit();
//     }
//   };

//   // Handle blur (save on blur)
//   const handleBlur = (productId) => {
//     handleSaveEdit(productId);
//   };

//   // Save edit
//   const handleSaveEdit = (productId) => {
//     if (editingField === 'price') {
//       const newPrice = parseFloat(tempValue);
//       if (!isNaN(newPrice) && newPrice >= 0) {
//         setCustomPrices(prev => ({ ...prev, [productId]: newPrice }));
//         toast.success(`Price updated to ₹${newPrice.toFixed(2)}/kg`);
//       } else {
//         toast.error("Please enter a valid price");
//       }
//     } else if (editingField === 'qty') {
//       const newQty = parseInt(tempValue);
//       if (!isNaN(newQty) && newQty >= 0) {
//         if (newQty === 0) {
//           // Remove item if quantity is 0
//           onRemoveItem(productId);
//           toast.info("Item removed from cart");
//         } else {
//           // Update quantity
//           const currentQty = cartItems[productId] || 0;
//           const delta = newQty - currentQty;
//           if (delta !== 0) {
//             onUpdateQty(productId, delta);
//           }
//           toast.success(`Quantity updated to ${newQty}`);
//         }
//       } else if (tempValue === '' || tempValue === '0') {
//         onRemoveItem(productId);
//         toast.info("Item removed from cart");
//       } else {
//         toast.error("Please enter a valid quantity");
//       }
//     }
//     setEditingProductId(null);
//     setEditingField(null);
//     setTempValue("");
//   };

//   // Cancel edit
//   const handleCancelEdit = () => {
//     setEditingProductId(null);
//     setEditingField(null);
//     setTempValue("");
//   };

//   const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
//   const nameParts = (str) => (str || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
//   const matchName = (name, query) => {
//     if (!query.trim()) return true;
//     const q = query.toLowerCase().trim();
//     const qNorm = normalize(q);
//     const nNorm = normalize(name);
//     const parts = nameParts(name);
//     if (nNorm.includes(qNorm)) return true;
//     if (name.toLowerCase().includes(q)) return true;
//     for (let i = 0; i < parts.length; i++) {
//       if (parts.slice(i).join("").includes(qNorm)) return true;
//     }
//     return parts.some(p => p.includes(qNorm));
//   };

//   const getFilteredCustomers = () => {
//     if (!customerSearch.trim()) return [];
//     const searchTerm = customerSearch.toLowerCase().trim();
//     const searchMobile = customerSearch.replace(/\D/g, "");
//     return (externalCustomers || []).filter(c =>
//       (c.name && c.name.toLowerCase().includes(searchTerm)) ||
//       (c.billName && c.billName.toLowerCase().includes(searchTerm)) ||
//       (c.mobile && c.mobile.replace(/\D/g, "").includes(searchMobile)) ||
//       (c.city && c.city.toLowerCase().includes(searchTerm)) ||
//       (c.brokerName && c.brokerName.toLowerCase().includes(searchTerm)) ||
//       (c.transporterName && c.transporterName.toLowerCase().includes(searchTerm))
//     );
//   };

//   const filteredCustomers = getFilteredCustomers();
//   const filteredBrokers = brokerSearch.trim()
//     ? availableBrokers.filter(b => matchName(b.name, brokerSearch)) : availableBrokers;

//   const computeOrderTotals = () => {
//     const totalBeforeTax = enhancedCartItems.reduce((s, i) => {
//       const price = customPrices[i.id] !== undefined ? customPrices[i.id] : i.price;
//       return s + (price * i.kgs);
//     }, 0);
//     const totalTax = enhancedCartItems.reduce((s, i) => {
//       const price = customPrices[i.id] !== undefined ? customPrices[i.id] : i.price;
//       const taxRate = i.taxRate || 12;
//       return s + ((price * i.kgs) * (taxRate / 100));
//     }, 0);
//     const totalInvoiceValue = totalBeforeTax + totalTax;
//     return { totalBeforeTax, totalTax, totalInvoiceValue };
//   };

//   const handleCheckout = async () => {
//     if (!isLoggedIn) { toast.error("Please sign in to place an order"); setIsLoginPopupOpen(true); return; }
//     if (!contactNumber) { toast.error("Please enter contact number"); return; }
//     if (!selectedCustomer) { toast.error("Please select a customer"); return; }

//     const { totalInvoiceValue } = computeOrderTotals();
//     const creditLimit = parseFloat(creditInfo?.creditLimit || 0);
//     const outstanding = parseFloat(creditInfo?.outstanding || 0);

//     if (creditLimit > 0 && (outstanding + totalInvoiceValue) > creditLimit) {
//       setShowCreditLimitDialog(true);
//       return;
//     }

//     await proceedCheckout();
//   };

//   const proceedCheckout = async () => {
//     setIsProcessing(true);

//     const now = new Date();
//     const formattedDateTime = ISOStrings(new Date(), true);  
//     const formattedDateOnly = ISOStrings(new Date(), false); 

//     const parseData = JSON.parse(localStorage.getItem('user') || '{}');
//     const storage = JSON.parse(localStorage.getItem('user') || '{}');

//     const editOrderId = localStorage.getItem('editOrderId');
//     const isEditing = !!editOrderId;

//     const { totalBeforeTax, totalTax, totalInvoiceValue } = computeOrderTotals();
//     const totalKgsValue = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);

//     const Staff_Involved_List = [];

//     if (selectedBroker?.id && selectedBroker.id !== "0" && selectedBroker.id !== "null" && selectedBroker.id !== "") {
//       const brokerIdNum = parseInt(selectedBroker.id);
//       if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
//         Staff_Involved_List.push({ Involved_Emp_Id: brokerIdNum, Cost_Center_Type_Id: 3 });
//       }
//     }

//     if (selectedTransporter?.id && selectedTransporter.id !== "0" && selectedTransporter.id !== "null" && selectedTransporter.id !== "") {
//       const transporterIdNum = parseInt(selectedTransporter.id);
//       if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
//         Staff_Involved_List.push({ Involved_Emp_Id: transporterIdNum, Cost_Center_Type_Id: 2 });
//       }
//     }

//     const generalInfo = {
//       ...(isEditing && { So_Id: parseInt(editOrderId) }),
//       So_Date: formattedDateOnly,
//       Retailer_Id: parseInt(selectedCustomer.id),
//       Sales_Person_Id: storage?.user?.SalesPersonId || 0,
//       Branch_Id: storage?.user?.BranchId || parseData?.BranchId,
//       VoucherType: 200, GST_Inclusive: 2, IS_IGST: 0,
//       CSGT_Total: (totalTax / 2).toFixed(2), SGST_Total: (totalTax / 2).toFixed(2),
//       IGST_Total: "0.00", Round_off: "0.00",
//       Total_Before_Tax: totalBeforeTax.toFixed(2), Total_Tax: totalTax.toFixed(2),
//       Total_Invoice_value: totalInvoiceValue.toFixed(2),
//       Narration: description || "", isConverted: 0, Cancel_status: 1,
//       Created_by: parseData?.UserId || storage?.user?.UserId,
//       Created_on: formattedDateTime,
//       Trans_Type: isEditing ? "UPDATE" : "INSERT", Alter_Id: 0,
//       Customer_Name: selectedCustomer.name || "", Ord_Mobile_No: contactNumber,
//       Broker_Name: selectedBroker.name || "", Broker_Id: selectedBroker.id || null,
//       Transporter_Name: selectedTransporter.name || "", Transporter_Id: selectedTransporter.id || null,
//       Shipp_Address: shippingAddress || selectedCustomer.address || "",
//       Deliv_Address: deliveryAddress || shippingAddress || selectedCustomer.address || "",
//       Total_Kgs: totalKgsValue.toFixed(2), Total_Items: enhancedCartItems.length,
//       Staff_Involved_List,
//     };

//     const stockInfo = enhancedCartItems.map((item, index) => {
//       const taxRate = item.taxRate || 12;
//       const cgstSgstRate = taxRate / 2;
//       const price = customPrices[item.id] !== undefined ? customPrices[item.id] : item.price;
//       const taxableAmount = price * item.kgs;
//       const taxAmount = taxableAmount * (taxRate / 100);
//       const cgstSgstAmount = taxAmount / 2;
//       const finalAmount = taxableAmount + taxAmount;
//       return {
//         So_Date: formattedDateOnly, S_No: index + 1, Item_Id: parseInt(item.id),
//         Bill_Qty: item.kgs.toFixed(2), Taxable_Rate: price.toFixed(2),
//         Item_Rate: price.toFixed(2), Amount: taxableAmount.toFixed(2), Free_Qty: "0.00",
//         Total_Qty: item.quantity.toString(), Taxble: taxAmount.toFixed(2),
//         HSN_Code: item.hsn || "210690", Unit_Id: item.unitId, Unit_Name: item.unitName,
//         Taxable_Amount: taxableAmount.toFixed(2), Tax_Rate: taxRate,
//         Cgst: cgstSgstRate, Cgst_Amo: cgstSgstAmount.toFixed(2),
//         Sgst: cgstSgstRate, Sgst_Amo: cgstSgstAmount.toFixed(2),
//         Igst: 0, Igst_Amo: "0.00", Final_Amo: finalAmount.toFixed(2),
//         Created_on: formattedDateTime, Product_Id: parseInt(item.id), Product_Name: item.name,
//         Quantity: item.quantity, Price: price, Total: taxableAmount.toFixed(2),
//         Weight: item.kgs.toString(), Unit: item.unit, PackGet: item.packGet,
//       };
//     });

//     const saleData = {
//       generalInfo, stockInfo,
//       totalAmount: totalInvoiceValue, totalItems: enhancedCartItems.length,
//       totalKgs: totalKgsValue.toFixed(2), customerId: selectedCustomer.id,
//       customerName: selectedCustomer.name || "", contactNumber,
//       brokerName: selectedBroker.name, transporter: selectedTransporter.name,
//       shippingAddress, deliveryAddress, description,
//       Created_by: parseData?.UserId || parseData?.user_id || "",
//       Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 2,
//     };

//     try {
//       const loadingToast = toast.loading(isEditing ? "Updating order..." : "Placing order...");
//       const response = await fetchLink({
//         address: `sales/salesInvoice/Whatsapp`,
//         method: isEditing ? 'PUT' : 'POST',
//         bodyData: saleData,
//       });
//       toast.dismiss(loadingToast);

//       if (response?.success) {
//         toast.success(isEditing ? "Order updated successfully!" : "Order placed successfully!");
//         if (isEditing) {
//           localStorage.removeItem('editOrderId'); localStorage.removeItem('editOrderNumber');
//           localStorage.removeItem('isEditingOrder'); localStorage.removeItem('editOrderData');
//           localStorage.removeItem('editCustomerData');
//         }

//         const customerDataForPrint = {
//           Billl_Name: selectedCustomer.billName || selectedCustomer.name || "",
//           Party_Mailing_Name: selectedCustomer.partyMailingName || selectedCustomer.billName || selectedCustomer.name || "",
//           Party_Location: selectedCustomer.city || "",
//           Party_Mailing_Address: selectedCustomer.partyMailingAddress || shippingAddress || selectedCustomer.address || "",
//           City: selectedCustomer.city || "",
//           Mobile_No: contactNumber,
//           Land_Line: selectedCustomer.mobile || "",
//           Transporter: selectedTransporter.name || "",
//           Broker: selectedBroker.name || "",
//         };

//         const printCartItems = enhancedCartItems.map(item => ({
//           ...item, Print_Name: item.shortName || item.name, 
//           price: customPrices[item.id] !== undefined ? customPrices[item.id] : item.price, 
//           kgs: item.kgs,
//         }));

//         setLastOrderData({
//           orderId: response.data?.So_Id || response.data?.OrderId,
//           customerData: customerDataForPrint, printCartItems,
//           totals: { subtotal: totalInvoiceValue },
//         });
//         setPrintModalOpen(true);
//       } else {
//         toast.error(response?.message || "Failed to process order");
//       }
//     } catch (error) {
//       toast.error("Failed to process order: " + (error.message || "Unknown error"));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Render cart items with edit functionality similar to CartItemRow
//   const renderCartItem = (item) => {
//     const isEditingThisItem = editingProductId === item.id;
//     const isEditingPrice = isEditingThisItem && editingField === 'price';
//     const isEditingQty = isEditingThisItem && editingField === 'qty';
//     const currentPrice = customPrices[item.id] !== undefined ? customPrices[item.id] : item.price;

//     return (
//       <div key={item.id} style={{
//         display: "flex", 
//         justifyContent: "space-between", 
//         alignItems: "center",
//         padding: "10px 0", 
//         borderBottom: "1px dashed #ddd",
//         flexWrap: "wrap",
//         gap: "8px",
//       }}>
//         {/* Left side - Product info */}
//         <div style={{ 
//           display: "flex", 
//           gap: "12px", 
//           alignItems: "center", 
//           flex: 1,
//           minWidth: "60%",
//         }}>
//           <img
//             src={item.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=40&h=40&fit=crop"}
//             alt={item.name}
//             style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
//             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=40&h=40&fit=crop"; }}
//           />
//           <div style={{ flex: 1, minWidth: "0" }}>
//             <h3 style={{ 
//               fontSize: "12px", 
//               fontWeight: "600", 
//               color: BROWN, 
//               margin: "0 0 2px 0",
//               wordBreak: "break-word",
//             }}>
//               {item.name?.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
//             </h3>
            
//             {/* Price section with edit functionality */}
//             <div style={{ 
//               display: "flex", 
//               gap: "6px", 
//               alignItems: "center", 
//               flexWrap: "wrap",
//             }}>
//               {isEditingPrice ? (
//                 <div style={{ 
//                   display: "flex", 
//                   alignItems: "center", 
//                   gap: "4px",
//                   flexWrap: "wrap",
//                 }}>
//                   <input
//                     type="text"
//                     value={tempValue}
//                     onChange={handleInputChange}
//                     onKeyDown={(e) => handleKeyDown(e, item.id)}
//                     onBlur={() => handleBlur(item.id)}
//                     autoFocus
//                     style={{
//                       width: "70px",
//                       padding: "2px 6px",
//                       border: `2px solid ${BROWN}`,
//                       borderRadius: "12px",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: BROWN,
//                       background: "#fff",
//                       outline: "none",
//                     }}
//                   />
//                   <span style={{ 
//                     fontSize: "14px", 
//                     fontWeight: "600", 
//                     color: BROWN 
//                   }}>/kg</span>
//                   <div style={{ 
//                     display: "flex", 
//                     gap: "3px",
//                     alignItems: "center",
//                   }}>
//                     <button
//                       onClick={() => handleSaveEdit(item.id)}
//                       style={{
//                         background: "#4CAF50",
//                         border: "none",
//                         borderRadius: "12px",
//                         padding: "2px 6px",
//                         color: "#fff",
//                         fontSize: "10px",
//                         cursor: "pointer",
//                         minWidth: "16px",
//                         minHeight: "16px",
//                       }}
//                     >
//                       ✓
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       style={{
//                         background: "#f44336",
//                         border: "none",
//                         borderRadius: "12px",
//                         padding: "1px 5px",
//                         color: "#fff",
//                         fontSize: "8px",
//                         cursor: "pointer",
//                         minWidth: "16px",
//                         minHeight: "16px",
//                       }}
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <span 
//                   onClick={() => handlePriceClick(item.id, currentPrice)}
//                   style={{ 
//                     background: "#f0e9e2", 
//                     padding: "2px 6px", 
//                     borderRadius: "12px", 
//                     fontSize: "13px", 
//                     color: BROWN,
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                     fontWeight: "800",
//                     border: "1px solid transparent",
//                     whiteSpace: "nowrap",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "#e8ddd4";
//                     e.currentTarget.style.borderColor = BROWN;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "#f0e9e2";
//                     e.currentTarget.style.borderColor = "transparent";
//                   }}
//                   title="Click to edit price"
//                 >
//                   ₹{(currentPrice || 0).toFixed(2)}/kg ✎
//                 </span>
//               )}
              
//               <span style={{ 
//                 fontSize: "9px", 
//                 color: "#666",
//                 whiteSpace: "nowrap",
//               }}>
//                 Pack: {item.packGet}kg
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Right side - Quantity controls and amount */}
//         <div style={{ 
//           display: "flex", 
//           alignItems: "center", 
//           gap: "6px",
//           flexShrink: 0,
//           marginLeft: "auto",
//         }}>
//           <div style={{ 
//             display: "flex", 
//             alignItems: "center", 
//             gap: "2px", 
//             background: "#f5f0eb", 
//             padding: "2px 3px", 
//             borderRadius: "25px",
//             flexShrink: 0,
//           }}>
//             <button 
//               onClick={() => onUpdateQty(item.id, -1)} 
//               style={{ 
//                 width: "28px", 
//                 height: "28px", 
//                 borderRadius: "50%", 
//                 border: "none", 
//                 background: "#fff", 
//                 color: BROWN, 
//                 cursor: "pointer", 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center", 
//                 fontSize: "16px", 
//                 fontWeight: "bold", 
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 flexShrink: 0,
//               }}
//             >-</button>
            
//             {/* Quantity display - clickable to edit */}
//             {isEditingQty ? (
//               <input
//                 type="text"
//                 value={tempValue}
//                 onChange={handleInputChange}
//                 onKeyDown={(e) => handleKeyDown(e, item.id)}
//                 onBlur={() => handleBlur(item.id)}
//                 autoFocus
//                 style={{
//                   width: "40px",
//                   padding: "4px 2px",
//                   border: `2px solid ${BROWN}`,
//                   borderRadius: "8px",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   color: BROWN,
//                   background: "#fff",
//                   textAlign: "center",
//                   outline: "none",
//                 }}
//               />
//             ) : (
//               <span 
//                 onClick={() => handleQtyClick(item.id, item.quantity)}
//                 style={{ 
//                   fontSize: "16px", 
//                   fontWeight: "600", 
//                   color: BROWN, 
//                   minWidth: "32px", 
//                   textAlign: "center",
//                   cursor: "pointer",
//                   padding: "4px 4px",
//                   borderRadius: "4px",
//                   transition: "background 0.2s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "#e8ddd4";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "transparent";
//                 }}
//                 title="Click to edit quantity"
//               >
//                 {item.quantity}
//               </span>
//             )}
            
//             <button 
//               onClick={() => onUpdateQty(item.id, 1)} 
//               style={{ 
//                 width: "28px", 
//                 height: "28px", 
//                 borderRadius: "50%", 
//                 border: "none", 
//                 background: "#fff", 
//                 color: BROWN, 
//                 cursor: "pointer", 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center", 
//                 fontSize: "16px", 
//                 fontWeight: "bold", 
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                 flexShrink: 0,
//               }}
//             >+</button>
//           </div>
          
//           <div style={{ 
//             display: "flex", 
//             alignItems: "center", 
//             gap: "2px",
//             flexShrink: 0,
//           }}>
//             <div style={{ textAlign: "right" }}>
//               <span style={{ 
//                 fontSize: "14px", 
//                 fontWeight: "700", 
//                 color: BROWN, 
//                 minWidth: "60px", 
//                 display: "block" 
//               }}>₹{item.amount.toFixed(2)}</span>
//               <span style={{ 
//                 fontSize: "8px", 
//                 color: "#999", 
//                 display: "block" 
//               }}>({item.quantity} × {item.packGet}kg)</span>
//             </div>
//             <div
//               onClick={() => onRemoveItem(item.id)}
//               style={{ 
//                 color: "#999", 
//                 cursor: "pointer", 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center", 
//                 width: "28px", 
//                 height: "28px", 
//                 borderRadius: "50%",
//                 flexShrink: 0,
//               }}
//               onMouseEnter={(e) => { 
//                 e.currentTarget.style.background = "#fee"; 
//                 e.currentTarget.style.color = "#ff4444"; 
//               }}
//               onMouseLeave={(e) => { 
//                 e.currentTarget.style.background = "transparent"; 
//                 e.currentTarget.style.color = "#999"; 
//               }}
//             >
//               <DeleteOutlineIcon style={{ fontSize: "18px" }} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }} />

//       {printModalOpen && lastOrderData && (
//         <PrintPreviewModal
//           open={printModalOpen}
//           onClose={() => {
//             setPrintModalOpen(false);
//             Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
//             localStorage.removeItem('cartItems');
//             localStorage.removeItem('selectedCustomer');
//             localStorage.removeItem('selectedCustomerId');
//             onClose();
//           }}
//           customer={lastOrderData.customerData}
//           cartItems={lastOrderData.printCartItems}
//           totals={lastOrderData.totals}
//           storage={JSON.parse(localStorage.getItem('user') || '{}')}
//           isReprint={true}
//         />
//       )}

//       <div style={{
//         position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "100%",
//         backgroundColor: "#fff", zIndex: 1000, display: "flex", flexDirection: "column",
//         boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", animation: "slideInRight 0.3s ease",
//       }}>
//         {/* Header */}
//         <div style={{
//           padding: "16px 20px", backgroundColor: BROWN_DARK, color: "#fff",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             {step === 2 && (
//               <button onClick={() => setStep(1)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px" }}>←</button>
//             )}
//             <span style={{ fontSize: "18px", fontWeight: "bold" }}>
//               {step === 1 ? `Cart (${totalItems})` : "Edit Order Details"}
//             </span>
//           </div>
//           <CloseIcon style={{ cursor: "pointer", fontSize: "24px" }} onClick={onClose} />
//         </div>

//         {/* Scrollable body */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

//           {/* STEP 1 – Cart Items */}
//           {step === 1 ? (
//             <>
//               {enhancedCartItems.length === 0 ? (
//                 <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
//                   <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
//                   <p>Your cart is empty</p>
//                 </div>
//               ) : (
//                 <>
//                   {enhancedCartItems.map(item => renderCartItem(item))}

//                   <div style={{ marginTop: "16px", padding: "16px", background: "#f9f4ef", borderRadius: "12px" }}>
//                     {[
//                       ["Total Items:", totalItems],
//                       ["Total Kgs:", `${totalKgs.toFixed(2)} kg`],
//                       ["Subtotal:", `₹${subtotalAmount.toFixed(2)}`],
//                     ].map(([label, value]) => (
//                       <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "6px" }}>
//                         <span>{label}</span><span>{value}</span>
//                       </div>
//                     ))}
//                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "10px", marginTop: "4px" }}>
//                       <span>Total:</span><span>₹{subtotalAmount.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </>
//           ) : (
//             // STEP 2 – Editable Order Details
//             <div>
//               {creditInfo && (
//                 <div style={{
//                   marginBottom: "16px",
//                   padding: "10px 12px",
//                   background: "#fff3f3",
//                   border: "1px solid #e0b8b8",
//                   borderRadius: "8px",
//                   display: "flex",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                   gap: "10px",
//                 }}>
//                   <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px", animation: "blinker 1s linear infinite" }}>
//                     Outstanding: ₹{parseFloat(creditInfo.outstanding || 0).toFixed(2)}
//                   </div>
//                   <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px", animation: "blinker 1s linear infinite" }}>
//                     Credit Limit: {parseFloat(creditInfo.creditLimit || 0) === 0
//                       ? "Unlimited"
//                       : `₹${parseFloat(creditInfo.creditLimit).toFixed(2)}`}
//                   </div>
//                 </div>
//               )}

//               {/* Editable Order Items */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
//                   Order Items ({enhancedCartItems.length})
//                 </label>
//                 {enhancedCartItems.map(item => renderCartItem(item))}

//                 {/* Order Summary */}
//                 <div style={{
//                   marginTop: "12px",
//                   padding: "16px",
//                   background: "#f9f4ef",
//                   borderRadius: "12px",
//                   border: "1px solid #e8ddd4",
//                 }}>
//                   {[
//                     ["Total Items:", totalItems],
//                     ["Total Kgs:", `${totalKgs.toFixed(2)} kg`],
//                     ["Subtotal:", `₹${computeOrderTotals().totalBeforeTax.toFixed(2)}`],
//                     ["Tax:", `₹${computeOrderTotals().totalTax.toFixed(2)}`],
//                     ["Total:", `₹${computeOrderTotals().totalInvoiceValue.toFixed(2)}`],
//                   ].map(([label, value]) => (
//                     <div key={label} style={{ 
//                       display: "flex", 
//                       justifyContent: "space-between", 
//                       fontSize: label.includes("Total:") && !label.includes("Items") && !label.includes("Kgs") ? "15px" : "13px", 
//                       color: label.includes("Total:") && !label.includes("Items") && !label.includes("Kgs") ? BROWN_DARK : "#666", 
//                       marginBottom: "6px",
//                       fontWeight: label.includes("Total:") && !label.includes("Items") && !label.includes("Kgs") ? "bold" : "normal",
//                     }}>
//                       <span>{label}</span>
//                       <span>{value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Customer Selection */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Customer *</label>
//                 <div style={{ position: "relative" }}>
//                   <div
//                     onClick={() => { setCustomerDropdownOpen(prev => !prev); if (!customerDropdownOpen) setCustomerSearch(""); }}
//                     style={{
//                       padding: "10px 12px", border: `1px solid ${customerDropdownOpen ? BROWN : "#ddd"}`,
//                       borderRadius: "8px", fontSize: "14px", background: "#fff", cursor: "pointer",
//                       display: "flex", justifyContent: "space-between", alignItems: "center",
//                       color: selectedCustomer ? BROWN_DARK : "#999",
//                     }}
//                   >
//                     <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
//                       {selectedCustomer ? selectedCustomer.name : "Select customer..."}
//                     </span>
//                     <span style={{ fontSize: "11px", marginLeft: "8px", color: BROWN_LIGHT, transform: customerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
//                   </div>

//                   {customerDropdownOpen && (
//                     <div style={{
//                       position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
//                       background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
//                       boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 2000,
//                       maxHeight: "320px", overflowY: "auto",
//                     }}>
//                       <div style={{ padding: "12px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, background: "#fff" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${ACCENT}`, borderRadius: "8px", padding: "4px 8px", background: "#fff" }}>
//                           <SearchIcon style={{ fontSize: "18px", color: "#999" }} />
//                           <input
//                             type="text" placeholder="Search by name, mobile, or city..."
//                             value={customerSearch}
//                             onChange={(e) => setCustomerSearch(e.target.value)}
//                             autoFocus
//                             style={{ flex: 1, border: "none", padding: "8px 4px", fontSize: "14px", outline: "none", background: "transparent" }}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                           {customerSearch && (
//                             <button onClick={(e) => { e.stopPropagation(); setCustomerSearch(""); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#aaa", fontSize: "16px", padding: "4px" }}>✕</button>
//                           )}
//                         </div>
//                       </div>

//                       {customerSearch.trim() && (
//                         <div style={{ padding: "6px 12px", fontSize: "11px", color: filteredCustomers.length > 0 ? "#4caf50" : "#e74c3c", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
//                           {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""} found
//                         </div>
//                       )}

//                       {externalCustomers && externalCustomers.length > 0 ? (
//                         customerSearch.trim() && filteredCustomers.length === 0 ? (
//                           <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
//                             <p>No customers found for "{customerSearch}"</p>
//                           </div>
//                         ) : (
//                           (customerSearch.trim() ? filteredCustomers : externalCustomers).map(c => (
//                             <div
//                               key={c.id}
//                               onClick={() => {
//                                 onCustomerChange && onCustomerChange(c);
//                                 setCustomerDropdownOpen(false);
//                                 setCustomerSearch("");
//                                 setContactNumber(c.mobile || "");
//                                 if (c.address) { setShippingAddress(c.address); setDeliveryAddress(c.address); }
//                                 if (c.brokerName && c.brokerName !== "0") {
//                                   const found = availableBrokers.find(b => b.name.toLowerCase() === String(c.brokerName).trim().toLowerCase());
//                                   setSelectedBroker(found || { id: null, name: String(c.brokerName).trim() });
//                                 } else { setSelectedBroker({ id: null, name: "" }); }
//                                 if (c.transporterName && c.transporterName !== "0") {
//                                   const found = availableTransporters.find(t => t.name.toLowerCase() === String(c.transporterName).trim().toLowerCase());
//                                   setSelectedTransporter(found || { id: null, name: String(c.transporterName).trim() });
//                                 } else { setSelectedTransporter({ id: null, name: "" }); }
//                               }}
//                               style={{
//                                 padding: "12px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
//                                 background: selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent",
//                               }}
//                               onMouseEnter={(e) => { if (selectedCustomer?.id !== c.id) e.currentTarget.style.background = "#faf6f2"; }}
//                               onMouseLeave={(e) => { e.currentTarget.style.background = selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent"; }}
//                             >
//                               <div style={{ fontWeight: "600", fontSize: "14px", color: BROWN_DARK }}>{c.name}</div>
//                               {(c.mobile || c.city) && (
//                                 <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
//                                   {c.mobile && <span>📱 {c.mobile}</span>}
//                                   {c.city && <span> • 📍 {c.city}</span>}
//                                 </div>
//                               )}
//                               {(c.brokerName || c.transporterName) && (
//                                 <div style={{ fontSize: "10px", color: "#aaa", marginTop: "2px" }}>
//                                   {c.brokerName && c.brokerName !== "0" && <span>🏢 {c.brokerName}</span>}
//                                   {c.transporterName && c.transporterName !== "0" && <span> • 🚚 {c.transporterName}</span>}
//                                 </div>
//                               )}
//                             </div>
//                           ))
//                         )
//                       ) : (
//                         <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
//                           <p>No customers available. Please make sure you are logged in.</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {selectedCustomer && (
//                   <div style={{ marginTop: "8px", padding: "8px 10px", background: "#f9f4ef", borderRadius: "6px", fontSize: "12px", color: "#666" }}>
//                     {selectedCustomer.mobile && <span>📱 {selectedCustomer.mobile}</span>}
//                     {selectedCustomer.city && <span> • 📍 {selectedCustomer.city}</span>}
//                     {selectedBroker.name && <div style={{ marginTop: "2px" }}>🏢 Broker: {selectedBroker.name}</div>}
//                     {selectedTransporter.name && <div>🚚 Transporter: {selectedTransporter.name}</div>}
//                   </div>
//                 )}
//               </div>

//               {/* Broker – Searchable Dropdown */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Broker</label>
//                 <div style={{ position: "relative" }}>
//                   <div
//                     onClick={() => { setBrokerDropdownOpen(prev => !prev); }}
//                     style={{
//                       padding: "10px 12px", border: `1px solid ${brokerDropdownOpen ? BROWN : "#ddd"}`,
//                       borderRadius: "8px", fontSize: "14px", background: "#fff", cursor: "pointer",
//                       display: "flex", justifyContent: "space-between", alignItems: "center",
//                       color: selectedBroker.name ? BROWN_DARK : "#999",
//                     }}
//                   >
//                     <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
//                       {selectedBroker.name || "Select broker..."}
//                     </span>
//                     <span style={{ fontSize: "11px", marginLeft: "8px", color: BROWN_LIGHT, transform: brokerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
//                   </div>

//                   {brokerDropdownOpen && (
//                     <div style={{
//                       position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
//                       background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
//                       boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 2000, maxHeight: "240px", overflowY: "auto",
//                     }}>
//                       <div style={{ padding: "8px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, background: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
//                         <SearchIcon style={{ fontSize: "16px", color: "#999", flexShrink: 0 }} />
//                         <input
//                           type="text" placeholder="Search broker..." value={brokerSearch}
//                           onChange={(e) => setBrokerSearch(e.target.value)}
//                           autoFocus
//                           style={{ flex: 1, border: `1px solid ${ACCENT}`, borderRadius: "6px", padding: "6px 8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                         {brokerSearch && (
//                           <button onClick={(e) => { e.stopPropagation(); setBrokerSearch(""); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#aaa", fontSize: "16px", lineHeight: 1, padding: "0 2px" }}>×</button>
//                         )}
//                       </div>

//                       {brokerSearch.trim() && (
//                         <div style={{ padding: "4px 12px", fontSize: "11px", color: "#999", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
//                           {filteredBrokers.length} result{filteredBrokers.length !== 1 ? "s" : ""} for "{brokerSearch}"
//                         </div>
//                       )}

//                       <div
//                         onClick={() => { setSelectedBroker({ id: null, name: "" }); setBrokerDropdownOpen(false); setBrokerSearch(""); }}
//                         style={{ padding: "10px 12px", borderBottom: "1px solid #f5f0eb", cursor: "pointer", fontSize: "13px", color: "#999", fontStyle: "italic" }}
//                         onMouseEnter={(e) => e.currentTarget.style.background = "#faf6f2"}
//                         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//                       >— None —</div>

//                       {loadingBrokers ? (
//                         <div style={{ padding: "16px", textAlign: "center" }}><CircularProgress size={16} style={{ color: BROWN }} /></div>
//                       ) : filteredBrokers.length === 0 ? (
//                         <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "13px" }}>No brokers found</div>
//                       ) : (
//                         filteredBrokers.map(broker => (
//                           <div
//                             key={broker.id}
//                             onClick={() => { setSelectedBroker(broker); setBrokerDropdownOpen(false); setBrokerSearch(""); }}
//                             style={{
//                               padding: "10px 12px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
//                               background: selectedBroker.id === broker.id ? "#f0e9e2" : "transparent",
//                               fontSize: "13px", color: BROWN_DARK,
//                             }}
//                             onMouseEnter={(e) => { if (selectedBroker.id !== broker.id) e.currentTarget.style.background = "#faf6f2"; }}
//                             onMouseLeave={(e) => { e.currentTarget.style.background = selectedBroker.id === broker.id ? "#f0e9e2" : "transparent"; }}
//                           >
//                             <div style={{ fontWeight: "500" }}>{broker.name}</div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Transporter */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Transporter</label>
//                 <TransporterDropdown
//                   selectedTransporter={selectedTransporter}
//                   onSelectTransporter={(transporter) => setSelectedTransporter(transporter)}
//                   availableTransporters={availableTransporters}
//                   loading={loadingTransporters}
//                   onOpen={fetchTransporters}
//                   isMobile={true}
//                 />
//               </div>

//               {/* Contact Number */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Contact Number *</label>
//                 <input
//                   type="tel" placeholder="Enter contact number" value={contactNumber}
//                   onChange={(e) => setContactNumber(e.target.value)}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>

//               {/* Shipping Address */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Shipping Address</label>
//                 <textarea
//                   placeholder="Enter shipping address" value={shippingAddress}
//                   onChange={(e) => setShippingAddress(e.target.value)}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>

//               {/* Delivery Address */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Delivery Address</label>
//                 <textarea
//                   placeholder="Enter delivery address" value={deliveryAddress}
//                   onChange={(e) => setDeliveryAddress(e.target.value)}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>

//               {/* Description */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Description</label>
//                 <textarea
//                   placeholder="Notes or description" value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {enhancedCartItems.length > 0 && (
//           <div style={{ padding: "16px 20px", paddingBottom: `calc(16px + ${footerOffset}px)`, borderTop: "1px solid #eee", background: "#fff" }}>
//             {step === 1 ? (
//               <button
//                 onClick={() => setStep(2)}
//                 style={{ width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
//               >Proceed to Order Details →</button>
//             ) : (
//               <div style={{ display: "flex", gap: "10px", width: "100%" }}>
//                 {localStorage.getItem('editOrderId') && (
//                   <button
//                     onClick={() => {
//                       localStorage.removeItem('editOrderId'); localStorage.removeItem('isEditingOrder'); localStorage.removeItem('editOrderData');
//                       Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
//                       localStorage.removeItem('cartItems'); onClose();
//                     }}
//                     style={{ flex: 1, padding: "14px", background: "#fff", color: "#d32f2f", border: "2px solid #d32f2f", borderRadius: "25px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
//                   >Cancel</button>
//                 )}
//                 <button
//                   onClick={handleCheckout} disabled={isProcessing}
//                   style={{
//                     flex: 2, padding: "14px",
//                     background: localStorage.getItem('editOrderId') ? ACCENT : BROWN_DARK,
//                     color: localStorage.getItem('editOrderId') ? BROWN_DARK : "#fff",
//                     border: "none", borderRadius: "25px", fontSize: "15px", fontWeight: "600",
//                     cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.7 : 1,
//                   }}
//                 >{isProcessing ? 'Processing...' : (localStorage.getItem('editOrderId') ? 'Update Order' : 'Place Order')}</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
//         @keyframes blinker { 50% { opacity: 0; } }
//       `}</style>

//       <LoginPopup
//         isOpen={isLoginPopupOpen}
//         onClose={() => setIsLoginPopupOpen(false)}
//         onLoginSuccess={() => { setIsLoginPopupOpen(false); window.location.reload(); }}
//       />

//       <Dialog
//         open={showCreditLimitDialog}
//         onClose={() => setShowCreditLimitDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle style={{ fontWeight: "bold", color: "#e74c3c" }}>
//           ⚠️ Credit Limit Exceeded
//         </DialogTitle>
//         <DialogContent>
//           <p style={{ fontSize: "14px", color: "#333", marginBottom: "12px" }}>
//             This order will take the customer's outstanding balance above their approved credit limit.
//           </p>
//           <div style={{
//             background: "#fff3f3", border: "1px solid #e0b8b8",
//             borderRadius: "8px", padding: "12px", fontSize: "14px",
//           }}>
//             <div>Outstanding: ₹{parseFloat(creditInfo?.outstanding || 0).toFixed(2)}</div>
//             <div>Credit Limit: ₹{parseFloat(creditInfo?.creditLimit || 0).toFixed(2)}</div>
//             <div>Current Order: ₹{computeOrderTotals().totalInvoiceValue.toFixed(2)}</div>
//           </div>
//           <p style={{ fontSize: "13px", color: "#666", marginTop: "12px" }}>
//             Do you still want to place this order?
//           </p>
//         </DialogContent>
//         <DialogActions style={{ padding: "16px" }}>
//           <Button onClick={() => setShowCreditLimitDialog(false)} variant="outlined">
//             Cancel
//           </Button>
//           <Button
//             onClick={() => { setShowCreditLimitDialog(false); proceedCheckout(); }}
//             variant="contained"
//             style={{ backgroundColor: "#e74c3c", fontWeight: "bold" }}
//           >
//             Continue Anyway
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <LoginPopup
//         isOpen={isLoginPopupOpen}
//         onClose={() => setIsLoginPopupOpen(false)}
//         onLoginSuccess={() => { setIsLoginPopupOpen(false); window.location.reload(); }}
//       />
//     </>
//   );
// };

// export default function SMTraders() {
//   const navigate = useNavigate();

//   const [quantities, setQuantities] = useState({});
//   const [search, setSearch] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [stockGroups, setStockGroups] = useState([]);
//   const [posGroups, setPosGroups] = useState([]);
//   const [displayProducts, setDisplayProducts] = useState([]);
//   const [selectedStockGroup, setSelectedStockGroup] = useState("All");
//   const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
//   const [showPOSGroups, setShowPOSGroups] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
//   const [viewMode, setViewMode] = useState('categories');

//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isMobileCartDrawerOpen, setIsMobileCartDrawerOpen] = useState(false);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
//   const [userType, setUserType] = useState("");

//   const [customers, setCustomers] = useState([]);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   // const [showSaleOrders, setShowSaleOrders] = useState(false);


//   const handleSaleOrdersClick = () => setShowSaleOrders(true);
//   const handleDashboard = () => setShowDashboard(true);
//   const [showSaleOrders, setShowSaleOrders] = useState(false);
//    const [showDashboard, setShowDashboard] = useState(() => window.innerWidth <= 768);


//   useEffect(() => {
//     const isEditing = localStorage.getItem('isEditingOrder');
//     const editData = localStorage.getItem('editOrderData');
//     const savedCustomer = localStorage.getItem('selectedCustomer');
//     if (isEditing === 'true' && editData) {
//       try {
//         const parsed = JSON.parse(editData);
//         if (parsed.cartItems && Object.keys(parsed.cartItems).length > 0) setQuantities(parsed.cartItems);
//         if (parsed.customerDetails) {
//           setSelectedCustomer(parsed.customerDetails);
//           localStorage.setItem('selectedCustomer', JSON.stringify(parsed.customerDetails));
//           localStorage.setItem('selectedCustomerId', parsed.customerDetails.id);
//         }
//         toast.info("Edit mode active - make your changes and click Update");
//       } catch (e) { console.error("Error restoring edit state:", e); }
//     } else if (savedCustomer && !selectedCustomer) {
//       try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
//     }
//   }, []);

//   const handleBackFromSaleOrders = () => {
//     setShowSaleOrders(false);
//     const isEditing = localStorage.getItem('isEditingOrder');
//     const editData = localStorage.getItem('editOrderData');
//     if (isEditing === 'true' && editData) {
//       const savedCustomer = localStorage.getItem("selectedCustomer");
//       if (savedCustomer && !selectedCustomer) {
//         try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
//       }
//       const savedCart = localStorage.getItem('cartItems');
//       if (savedCart && Object.keys(quantities).length === 0) {
//         try { setQuantities(JSON.parse(savedCart)); } catch (e) { console.error(e); }
//       }
//       toast.info("Edit mode active - make your changes and click Update");
//     }
//     checkLoginStatus();
//   };

//   useEffect(() => {
//     const savedCustomer = localStorage.getItem("selectedCustomer");
//     if (savedCustomer && !selectedCustomer) {
//       try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedCustomer) {
//       localStorage.setItem("selectedCustomer", JSON.stringify(selectedCustomer));
//       localStorage.setItem("selectedCustomerId", selectedCustomer.id);
//     }
//   }, [selectedCustomer]);

//   const fetchCompleteCustomerDetails = async (customerId) => {
//     try {
//       const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
//       if (response?.success && Array.isArray(response.data)) {
//         const customer = response.data.find(c => String(c.Customer_Id) === String(customerId));
//         if (customer) {
//           return {
//             brokerId: customer.Broker_Id ? String(customer.Broker_Id).trim() : "",
//             brokerName: customer.Broker_Name || customer.Broker || "",
//             transporterId: customer.Transporter_Id ? String(customer.Transporter_Id).trim() : "",
//             transporterName: customer.Transporter_Name || customer.Transporter || "",
//           };
//         }
//       }
//     } catch (error) { console.error("Error fetching customer details:", error); }
//     return null;
//   };

//   const checkLoginStatus = () => {
//     try {
//       const user = localStorage.getItem("user");
//       const session = localStorage.getItem("session");
//       const loginAt = localStorage.getItem("loginAt");
//       const storedUserType = localStorage.getItem("userType") || "employee";

//       if (user && session && loginAt) {
//         setIsLoggedIn(true); setUserType(storedUserType);
//         let userData;
//         try { userData = JSON.parse(user); } catch (e) { userData = user; }
//         const sessionData = JSON.parse(session);

//         let customerList = [];
//         if (sessionData?.customer && Array.isArray(sessionData.customer)) {
//           customerList = sessionData.customer.map(c => ({
//             id: c.Ret_Id,
//             name: c.Ledger_Name || c.Party_Mailing_Name || c.A1,
//             billName: c.Party_Name || c.Ledger_Name,
//             mobile: c.A1 || "",
//             city: c.Party_Location || "",
//             address: c.Party_Mailing_Address || "",
//             brokerId: c.Broker_Id || c.Ref_Brokers || "",
//             brokerName: c.Broker_Name || "",
//             transporterId: c.Transporter_Id || "",
//             transporterName: c.Transporter_Name || "",
//             ledgerName: c.Ledger_Name,
//             partyMailingAddress: c.Party_Mailing_Address,
//             partyMailingName: c.Party_Mailing_Name,
//             ledgerTallyId: c.Ledger_Tally_Id,
//           }));
//         }
//         if (customerList.length > 0) setCustomers(customerList);

//         if (storedUserType === "customer" || storedUserType === "employee") {
//           const savedCustomerId = localStorage.getItem("selectedCustomerId");
//           let defaultCustomer = null;
//           if (savedCustomerId && customerList.length > 0) defaultCustomer = customerList.find(c => c.id === savedCustomerId);
//           if (!defaultCustomer && customerList.length > 0) defaultCustomer = customerList[0];
//           if (defaultCustomer) {
//             (async () => {
//               const details = await fetchCompleteCustomerDetails(defaultCustomer.id);
//               const finalCustomer = details
//                 ? { ...defaultCustomer, brokerId: details.brokerId || defaultCustomer.brokerId, brokerName: details.brokerName || defaultCustomer.brokerName, transporterId: details.transporterId || defaultCustomer.transporterId, transporterName: details.transporterName || defaultCustomer.transporterName }
//                 : { ...defaultCustomer };
//               setSelectedCustomer(finalCustomer);
//               localStorage.setItem("selectedCustomerId", finalCustomer.id);
//               localStorage.setItem("selectedCustomer", JSON.stringify(finalCustomer));
//             })();
//           }
//           const name = sessionData.username || userData?.Name || userData?.User_Name || "User";
//           setUserName(name);
//         }
//       } else {
//         setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
//       }
//     } catch (error) {
//       console.error("Error checking login status:", error);
//       setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
//     }
//   };

// const handleLoginSuccess = () => {
//   checkLoginStatus();
//   if (showSaleOrders) {
//     window.location.reload();
//   }
// };

//   const handleLogout = () => {
//     ["user", "session", "loginAt", "userType", "retId", "selectedCustomerId", "selectedCustomer","username"].forEach(k => localStorage.removeItem(k));
//     setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
//     toast.success("Logged out successfully");
//   };

//   const fetchCustomers = async () => {
//     setLoadingCustomers(true);
//     try {
//       const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=100000&page=1` });
//       if (response?.success && Array.isArray(response.data)) {
//         setCustomers(response.data.map((c) => ({
//           id: c.Customer_Id || c.Ret_Id,
//           name: (c.Short_Name || c.Billl_Name || "").replace(/\u0004/g, "").trim(),
//           billName: (c.Billl_Name || "").trim(),
//           mobile: (c.Mobile_No || "").trim(),
//           city: (c.City || "").trim(),
//           address: (c.Address || "").trim(),
//           brokerId: c.Broker_Id || "",
//           brokerName: (c.Broker_Name || c.Broker || "").trim(),
//           transporterId: c.Transporter_Id || "",
//           transporterName: (c.Transporter_Name || c.Transporter || "").trim(),
//           partyMailingName: c.Party_Mailing_Name || c.Billl_Name || "",
//           partyMailingAddress: c.Party_Mailing_Address || c.Address || "",
//         })));
//       }
//     } catch (error) { console.error("Error fetching customers:", error); toast.error("Failed to load customers"); }
//     finally { setLoadingCustomers(false); }
//   };

//   const formatProduct = (product) => {
//     const uniqueId = String(product.Product_Id);
//     const balQty = parseFloat(product.Bal_Qty) || 0;
//     const packGet = parseFloat(product.PackGet) || 1;
//     const stockInBags = packGet > 0 ? balQty / packGet : 0;
//     const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
//     return {
//       id: uniqueId, name: product.Product_Name || product.Stock_Item || "Unknown",
//       fullName: product.Product_Name || "Unknown", shortName: product.Short_Name,
//       weight: product.PackGet ? `${product.PackGet}kg` : "N/A",
//       stockGroup: product.Stock_Group || "General", posGroup: product.POS_Group || "General",
//       price, stock: stockInBags, unit: product.Units || "Bags",
//       image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=116&fit=crop",
//       coolie: product.Coolie, brokerage: product.NagalBrokerage || product.Brokerage,
//       packGet: product.PackGet, hsnCode: product.HSN_Code, balQty,
//       originalProduct: product, isInStock: stockInBags > 0,
//     };
//   };

//   const deduplicateProducts = (products) => {
//     const map = new Map();
//     products.forEach((p) => { if (!map.has(p.Product_Id)) map.set(p.Product_Id, p); });
//     return Array.from(map.values());
//   };

//   const mergeProductData = (productList, stockResponse) => {
//     if (!productList?.length) return [];
//     let stockData = [];
//     if (stockResponse?.success && stockResponse.data?.Pos_Product) {
//       const pp = stockResponse.data.Pos_Product;
//       stockData = Array.isArray(pp) ? pp[0]?.Product_Entry || [] : pp.Product_Entry || [];
//     }
//     const stockMap = new Map();
//     stockData.forEach((item) => stockMap.set(String(item.Product_Id).trim(), item));
//     return productList.map((product) => {
//       const si = stockMap.get(String(product.Product_Id).trim());
//       return si
//         ? { ...product, Bal_Qty: si.Bal_Qty || 0, Price: si.Price || product.Product_Rate || 0, _hasStock: true }
//         : { ...product, Bal_Qty: 0, Price: product.Product_Rate || 0, _hasStock: false };
//     });
//   };

//   const fetchAllData = async () => {
//     setLoadingProducts(true);
//     try {
//       const [posResponse, stockResponse] = await Promise.all([
//         fetchLink({ address: `pos/posProductList` }),
//         fetchLink({ address: `pos/productMaster` }),
//       ]);
//       let productList = [];
//       if (posResponse?.success && posResponse.data) productList = posResponse.data;
//       const merged = mergeProductData(productList, stockResponse);
     
//       const unique = deduplicateProducts(merged);
    
//       const active = unique.filter((p) => p.Active_Deactive === 1 || p.Active_Deactive === 1 || p.Active_Deactive === 1);
//       const inStock = active.filter((p) => {
//         const bq = parseFloat(p.Bal_Qty) || 0;
//         const pg = parseFloat(p.PackGet) || 1;
//         return pg > 0 ? bq / pg > 0 : false;
//       });
//       setAllProducts(inStock); setDisplayProducts(inStock);
//       localStorage.setItem("products", JSON.stringify(inStock.map(formatProduct)));
//       setInitialLoadDone(true);
//     } catch (error) { toast.error("Failed to load products"); }
//     finally { setLoadingProducts(false); }
//   };

//   useEffect(() => { checkLoginStatus(); }, []);
//   useEffect(() => { if (isLoggedIn && userType === "employee") fetchCustomers(); }, [isLoggedIn, userType]);
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const load = () => {
//       try {
//         const saved = localStorage.getItem("cartItems");
//         if (saved) setQuantities(JSON.parse(saved));
//       } catch (e) { console.error(e); }
//     };
//     load();
//     const onVisible = () => { if (document.visibilityState === "visible") load(); };
//     const onFocus = () => load();
//     const onStorage = (e) => { if (e.key === "cartItems") load(); };
//     document.addEventListener("visibilitychange", onVisible);
//     window.addEventListener("focus", onFocus);
//     window.addEventListener("storage", onStorage);
//     return () => {
//       document.removeEventListener("visibilitychange", onVisible);
//       window.removeEventListener("focus", onFocus);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   useEffect(() => { if (initialLoadDone) localStorage.setItem("cartItems", JSON.stringify(quantities)); }, [quantities, initialLoadDone]);
//   useEffect(() => { fetchAllData(); }, []);

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const groups = [...new Set(allProducts.map((p) => p.Stock_Group))]
//         .filter((g) => g && g.trim() && g !== "NOT FOUND" && g !== "NULL").sort()
//         .map((g) => ({ id: g, name: g }));
//       setStockGroups([{ id: "All", name: "All" }, ...groups]);
//     }
//   }, [allProducts]);

//   const extractPOSGroups = (list) =>
//     [...new Set(list.map((p) => (p.POS_Group || "").trim()))]
//       .filter((g) => g && g !== "NULL")
//       .map((g) => ({ posGroup: g, itemCount: list.filter((p) => (p.POS_Group || "").trim() === g).length }))
//       .sort((a, b) => a.posGroup.localeCompare(b.posGroup));

//   const handleStockGroupClick = (group) => {
//     setSelectedPOSGroup(null); setSelectedStockGroup(group.id); setViewMode('products');
//     if (group.id === "All") {
//       setDisplayProducts(allProducts); setShowPOSGroups(false); setPosGroups([]);
//     } else {
//       const filtered = allProducts.filter((p) => (p.Stock_Group || "").trim() === group.id.trim());
//       setDisplayProducts(filtered);
//       const pgl = extractPOSGroups(filtered);
//       setPosGroups(pgl); setShowPOSGroups(true);
//       if (isMobile && pgl.length > 0) setIsDrawerOpen(true);
//     }
//   };

//   const handleBackToCategories = () => { setSelectedStockGroup("All"); setSearch(""); setViewMode('categories'); };
//   const handlePOSGroupClick = (posGroup) => {
//     setSelectedPOSGroup(posGroup);
//     setDisplayProducts(allProducts.filter((p) =>
//       (p.Stock_Group || "").trim() === selectedStockGroup.trim() &&
//       (p.POS_Group || "").trim() === posGroup.trim()
//     ));
//     if (isMobile) setIsDrawerOpen(false);
//   };
//   const handleAllPOSGroupsClick = () => {
//     setSelectedPOSGroup(null);
//     setDisplayProducts(allProducts.filter((p) => (p.Stock_Group || "").trim() === selectedStockGroup.trim()));
//     if (isMobile) setIsDrawerOpen(false);
//   };

//   const updateQty = (id, delta) => {
//     setQuantities((prev) => {
//       const next = Math.max(0, (prev[id] || 0) + delta);
//       if (next === 0) { const { [id]: _, ...rest } = prev; return rest; }
//       return { ...prev, [id]: next };
//     });
//   };

//   const handleRemoveItem = (id) => {
//     setQuantities(prev => {
//       const { [id]: _, ...rest } = prev;
//       localStorage.setItem("cartItems", JSON.stringify(rest));
//       return rest;
//     });
//   };

//   const selectedCount = Object.values(quantities).reduce((s, q) => s + q, 0);
//   const totalAmount = Object.entries(quantities).reduce((s, [id, qty]) => {
//     const p = allProducts.find((p) => String(p.Product_Id) === id);
//     return p ? s + (parseFloat(p.Price) || parseFloat(p.Product_Rate) || 0) * qty : s;
//   }, 0);

//   const filtered = displayProducts.filter((p) => {
//     const bq = parseFloat(p.Bal_Qty) || 0;
//     const pg = parseFloat(p.PackGet) || 1;
//     if (pg > 0 ? bq / pg <= 0 : true) return false;
//     if (!search) return true;
//     const normalize = (str) => (str || "").toLowerCase().replace(/[.\-_\s]+/g, "");
//     const sl = normalize(search);
//     return (
//       normalize(p.Product_Name).includes(sl) || normalize(p.Short_Name).includes(sl) ||
//       normalize(p.POS_Group).includes(sl) || normalize(p.Stock_Group).includes(sl) ||
//       (p.Product_Name && p.Product_Name.toLowerCase().includes(search.toLowerCase())) ||
//       (p.Short_Name && p.Short_Name.toLowerCase().includes(search.toLowerCase()))
//     );
//   });

//   const formattedProducts = allProducts.map(formatProduct);

//   const handleCartClick = async () => {
//     localStorage.setItem('cartItems', JSON.stringify(quantities));
//     localStorage.setItem('products', JSON.stringify(formattedProducts));
//     if (isMobile) {
//       setIsMobileCartDrawerOpen(true);
//     } else {
//       const navigationState = {};
//       if (selectedCustomer) {
//         let customerData = { ...selectedCustomer };
//         if ((!customerData.brokerName || !customerData.transporterName) && userType === "customer") {
//           const details = await fetchCompleteCustomerDetails(customerData.id);
//           if (details) {
//             customerData = { ...customerData, brokerId: details.brokerId || customerData.brokerId, brokerName: details.brokerName || customerData.brokerName, transporterId: details.transporterId || customerData.transporterId, transporterName: details.transporterName || customerData.transporterName };
//             setSelectedCustomer(customerData);
//             localStorage.setItem("selectedCustomer", JSON.stringify(customerData));
//           }
//         }
//         navigationState.selectedCustomer = {
//           id: customerData.id, name: customerData.name, billName: customerData.billName,
//           mobile: customerData.mobile, city: customerData.city, address: customerData.address,
//           brokerId: customerData.brokerId, brokerName: customerData.brokerName,
//           transporterId: customerData.transporterId, transporterName: customerData.transporterName,
//         };
//       }
//       if (selectedCustomer) localStorage.setItem('selectedCustomerData', JSON.stringify(navigationState.selectedCustomer));
//       navigate('/cart', { state: navigationState });
//     }
//   };

//   const handleSelectCustomer = async (customer) => {
//     if (!customer || !customer.id) return;
//     let updatedCustomer = { ...customer };
//     try {
//       const response = await fetchLink({
//         address: `pos/retailerMasterOptRetailerId?Customer_Id=${customer.id}&limit=10000000&page=1`,
//       });
//       if (response?.success && Array.isArray(response.data)) {
//         const found = response.data.find(c => String(c.Customer_Id) === String(customer.id));
//         if (found) {
//           updatedCustomer = {
//             ...customer,
//             brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : customer.brokerId || "",
//             brokerName: found.Broker_Name || found.Broker || customer.brokerName || "",
//             transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : customer.transporterId || "",
//             transporterName: found.Transporter_Name || found.Transporter || customer.transporterName || "",
//             partyMailingName: found.Party_Mailing_Name || found.Billl_Name || customer.name || "",
//             partyMailingAddress: found.Party_Mailing_Address || found.Address || customer.address || "",
//             billName: found.Billl_Name || customer.name || "",
//           };
//         }
//       }
//     } catch (error) { console.error("Error fetching complete customer details:", error); }
//     setSelectedCustomer(updatedCustomer);
//     localStorage.setItem("selectedCustomerId", String(updatedCustomer.id));
//     localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
//     localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(updatedCustomer));
//     localStorage.setItem("cartPageSelectedCustomerId", String(updatedCustomer.id));
//   };

//   const MobileDrawer = () => (
//     <>
//       {isDrawerOpen && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setIsDrawerOpen(false)} />}
//       <div style={{
//         position: "fixed", top: 0, left: 0, bottom: 0, width: "85%", maxWidth: "320px",
//         backgroundColor: "#fff", zIndex: 1000,
//         transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
//         transition: "transform 0.1s ease-in-out", overflowY: "auto",
//         boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
//       }}>
//         <div style={{
//           padding: "20px 16px", backgroundColor: BROWN_DARK, color: "#fff",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           position: "sticky", top: 0, zIndex: 10,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FilterListIcon style={{ fontSize: "20px" }} />
//             <span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedStockGroup} - POS Groups</span>
//           </div>
//           <CloseIcon style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setIsDrawerOpen(false)} />
//         </div>
//         <div style={{ padding: "16px" }}>
//           {showPOSGroups && posGroups.length > 0 ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//               <button
//                 onClick={handleAllPOSGroupsClick}
//                 style={{
//                   padding: "12px 16px", borderRadius: "8px", border: "none",
//                   backgroundColor: selectedPOSGroup === null ? BROWN_DARK : "#f5f0eb",
//                   color: selectedPOSGroup === null ? "#fff" : BROWN_DARK,
//                   fontSize: "14px", cursor: "pointer",
//                   fontWeight: selectedPOSGroup === null ? "bold" : "normal",
//                   textAlign: "left", width: "100%",
//                 }}
//               >All POS Groups ({displayProducts.length})</button>
//               {posGroups.map((group, i) => (
//                 <button
//                   key={i} onClick={() => handlePOSGroupClick(group.posGroup)}
//                   style={{
//                     padding: "12px 16px", borderRadius: "8px", border: "none",
//                     backgroundColor: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#f5f0eb",
//                     color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK,
//                     fontSize: "14px", cursor: "pointer",
//                     fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal",
//                     textAlign: "left", width: "100%",
//                   }}
//                 >{group.posGroup} ({group.itemCount})</button>
//               ))}
//             </div>
//           ) : (
//             <div style={{ textAlign: "center", padding: "40px 20px", color: "#999", fontSize: "14px" }}>
//               No POS groups available for this category
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );

//   const mediaQueryStyles = `
//     @media screen and (max-width: 768px) { .products-grid { grid-template-columns: 1fr !important; gap: 12px !important; padding: 12px !important; } .product-card { width: 100% !important; height: auto !important; min-height: 140px !important; } .category-filters { padding: 8px 12px !important; } }
//     @media screen and (max-width: 480px) { .mobile-drawer { width: 85% !important; max-width: 280px !important; } .cart-summary { padding: 10px 16px !important; } }
//     @media screen and (min-width: 1600px) { .products-grid { max-width: 1800px !important; margin: 0 auto !important; grid-template-columns: repeat(4, 1fr) !important; } }
//   `;

//   const isCategoryReduced = selectedStockGroup !== "All";

//   return (
//     <>
//       <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
//   {showDashboard ? (
//         <Dashboard
//           isMobile={isMobile}
//           isLoggedIn={isLoggedIn}
//           userName={userName}
//           customers={customers}
//           allProducts={allProducts}
//           onLoginClick={() => setIsLoginPopupOpen(true)}
//           onLogout={handleLogout}
//           onHome={() => { setShowDashboard(false); setShowSaleOrders(false); }}
//           onSaleOrders={() => { setShowDashboard(false); setShowSaleOrders(true); }}
//           activeTab="dashboard"
//         />
//       ) : showSaleOrders ? (
//         <SaleOrders onBack={handleBackFromSaleOrders} />
//       ) : (
//        <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile ? (selectedCount > 0 ? "100px" : "80px") : "0"}}>
//           <style>{mediaQueryStyles}</style>

//           <CommonHeader
//             title="SM Traders" logo="SMT" showSearch={false} showCart={true}
//             showBackButton={false} showTitle={true} cartItemCount={selectedCount}
//             selectedCount={selectedCount} onCartClick={handleCartClick}
//             handleCartClick={handleCartClick} isMobile={isMobile}
//             backgroundColor={BROWN_DARK} isLoggedIn={isLoggedIn} userName={userName}
//             showCustomerSelector={isLoggedIn && customers.length > 0}
//             customers={customers} selectedCustomer={selectedCustomer}
//             onCustomerSelect={handleSelectCustomer} loadingCustomers={loadingCustomers}
//             userType={userType}
//             customActions={
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "auto" }}>
//                 <ThreeDotMenu
//                   isLoggedIn={isLoggedIn} userName={userName}
//                   onLogout={handleLogout} onLoginClick={() => setIsLoginPopupOpen(true)}
//                   onSaleOrders={handleSaleOrdersClick}
//                   onDashboard={handleDashboard}
//                 />
//               </div>
//             }
//           />

//           {isMobile && viewMode === 'categories' && (
//             <div style={{ padding: "16px", background: "#f5f0eb", minHeight: "calc(100vh - 120px)" }}>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
//                 {stockGroups.filter((g) => g.id !== "All").map((group) => (
//                   <div
//                     key={group.id} onClick={() => handleStockGroupClick(group)}
//                     style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "180px" }}
//                   >
//                     <div style={{ height: "130px", position: "relative", overflow: "hidden" }}>
//                       <img src={getCategoryImage(group.name)} alt={group.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                       <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)" }} />
//                     </div>
//                     <div style={{ padding: "12px", background: BROWN_DARK, color: "#fff", textAlign: "center", fontSize: "14px", fontWeight: "600" }}>{group.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(viewMode === 'products' || !isMobile) && (
//             <>
//               {isMobile && (
//                 <div style={{ padding: "12px 16px", background: "#f5f0eb", borderBottom: "1px solid #ddd" }}>
//                   <button
//                     onClick={handleBackToCategories}
//                     style={{ background: "transparent", border: `1px solid ${BROWN_DARK}`, borderRadius: "20px", padding: "8px 16px", color: BROWN_DARK, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
//                   ><span>←</span> Back to Categories</button>
//                 </div>
//               )}

//               {!isMobile && (
//                 <div className="category-filters" style={{ background: "#f5f0eb", padding: "24px", borderBottom: "1px solid #ddd", position: "sticky", top: 68, zIndex: 90, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
//                   {loadingProducts ? (
//                     <div style={{ textAlign: "center", padding: "20px", width: "100%", color: "#999" }}>Loading categories...</div>
//                   ) : (
//                     <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", gap: "12px", margin: 0, padding: "0 0 12px 0", scrollbarWidth: "thin", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
//                       {stockGroups.filter((g) => g.id !== "All").map((group) => (
//                         <CategoryCard key={group.id} category={{ name: group.name }} isSelected={selectedStockGroup === group.id} onClick={() => handleStockGroupClick(group)} isMobile={isMobile} isReduced={isCategoryReduced} />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {!isMobile && showPOSGroups && (
//                 <div className="pos-groups-container" style={{ background: "#f9f4ef", padding: "15px 24px", borderBottom: "1px solid #e8ddd4" }}>
//                   <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                     <button
//                       onClick={handleAllPOSGroupsClick}
//                       style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === null ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === null ? BROWN_DARK : "#fff", color: selectedPOSGroup === null ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === null ? "bold" : "normal" }}
//                     >All POS Groups ({displayProducts.length})</button>
//                     {posGroups.length > 0 ? posGroups.map((group, i) => (
//                       <button
//                         key={i} onClick={() => handlePOSGroupClick(group.posGroup)}
//                         style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === group.posGroup ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#fff", color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal" }}
//                       >{group.posGroup} ({group.itemCount})</button>
//                     )) : <div style={{ color: "#666", fontStyle: "italic", padding: "8px" }}>No POS groups available</div>}
//                   </div>
//                 </div>
//               )}

//               <div className="products-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(420px, 1fr))", gap: isMobile ? 16 : 24, padding: isMobile ? "16px" : "24px 24px 40px", maxWidth: 1800, margin: "0 auto", justifyContent: "center" }}>
//                 {loadingProducts ? (
//                   <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>Loading products...</div>
//                 ) : filtered.length > 0 ? (
//                   filtered.map((product) => {
//                     const formatted = formatProduct(product);
//                     return (
//                       <div key={formatted.id} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//                         <ProductCard product={formatted} quantity={quantities[formatted.id] || 0} onUpdateQty={updateQty} isMobile={isMobile} />
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>No products found</div>
//                 )}
//               </div>
//             </>
//           )}

//           {isMobile && !showDashboard && <MobileDrawer />}
//           {isMobile && !showDashboard && (
//             <MobileOrderSummary
//               selectedCount={selectedCount}
//               totalAmount={totalAmount}
//               onGoToCart={handleCartClick}
//               footerOffset={isMobile ? 64 : 0}
//             />
//           )}
//           <MobileCartDrawer
//             isOpen={isMobileCartDrawerOpen} onClose={() => setIsMobileCartDrawerOpen(false)}
//             cartItems={quantities} products={formattedProducts} allProducts={allProducts}
//             onUpdateQty={updateQty} onRemoveItem={handleRemoveItem}
//             isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginPopupOpen(true)}
//             selectedCustomer={selectedCustomer} userType={userType}
//             externalCustomers={customers} onCustomerChange={handleSelectCustomer}
//             footerOffset={isMobile ? 64 : 0}
//           />
//           {isMobile && (
//             <MobileTabBar
//               activeTab={showDashboard ? "dashboard" : "home"}
//               onHome={() => { setShowDashboard(false); setShowSaleOrders(false); }}
//               onDashboard={() => { setShowDashboard(true); setShowSaleOrders(false); }}
//               onCart={handleCartClick}
//               cartCount={selectedCount}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// }



// function SaleOrders({ onBack }) {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedOrders, setExpandedOrders] = useState({});
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [brokerFilter, setBrokerFilter] = useState("");
//   const [transporterFilter, setTransporterFilter] = useState("");
//   const navigate = useNavigate();

//   const [fromDate, setFromDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 0); return d; });
//   const [toDate, setToDate] = useState(new Date());
//   const [showFilterDialog, setShowFilterDialog] = useState(false);
//   const [tempFromDate, setTempFromDate] = useState(null);
//   const [tempToDate, setTempToDate] = useState(null);
//   const [tempBrokerFilter, setTempBrokerFilter] = useState("");
//   const [tempTransporterFilter, setTempTransporterFilter] = useState("");

//   const [printModalOpen, setPrintModalOpen] = useState(false);
//   const [printData, setPrintData] = useState(null);
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

//   const getBrokerName = (order) => {
//     if (!order.Staff_Involved_List || !Array.isArray(order.Staff_Involved_List)) return "";
//     const broker = order.Staff_Involved_List.find(s => s.Cost_Center_Type_Id === 3 || s.EmpType === "Broker");
//     return broker?.EmpName || "";
//   };

//   const getTransporterName = (order) => {
//     if (!order.Staff_Involved_List || !Array.isArray(order.Staff_Involved_List)) return "";
//     const transporter = order.Staff_Involved_List.find(s => s.Cost_Center_Type_Id === 2 || s.EmpType === "Load Man");
//     return transporter?.EmpName || "";
//   };

//   const getOrderStatus = (order) => order.OrderStatus || "";

//   const uniqueBrokers = useMemo(() => {
//     const set = new Set();
//     orders.forEach(o => { const n = getBrokerName(o); if (n && n.trim()) set.add(n.trim()); });
//     return Array.from(set).sort();
//   }, [orders]);

//   const uniqueTransporters = useMemo(() => {
//     const set = new Set();
//     orders.forEach(o => { const n = getTransporterName(o); if (n && n.trim()) set.add(n.trim()); });
//     return Array.from(set).sort();
//   }, [orders]);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => { fetchSaleOrders(); }, [fromDate, toDate]);

//   // const fetchSaleOrders = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const userData = JSON.parse(localStorage.getItem('user') || '{}');
//   //     const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
//   //     const userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';
//   //     const formattedFromDate = fromDate.toISOString().split('T')[0];
//   //     const formattedToDate = toDate.toISOString().split('T')[0];
//   //     const response = await fetchLink({
//   //       address: `sales/salesOrder/list?Created_by=${userId}&FromDate=${formattedFromDate}&ToDate=${formattedToDate}`,
//   //       method: 'GET',
//   //     });
//   //     if (response?.success) {
//   //       const orderData = response.data || response.Data || [];
//   //       setOrders(Array.isArray(orderData) ? orderData : []);
//   //     } else {
//   //       toast.error(response?.message || "Failed to fetch orders"); setOrders([]);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching sale orders:", error);
//   //     toast.error("Failed to load sale orders"); setOrders([]);
//   //   } finally { setLoading(false); }
//   // };

 
//  const fetchSaleOrders = async () => {
//   setLoading(true);
//   try {
//     // Get user data from localStorage
//     const userData = JSON.parse(localStorage.getItem('user') || '{}');
//     const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
//     const userType = localStorage.getItem('userType');
    
//     let userId = null;
    
//     // For employee login
//     if (userType === 'employee') {
//       userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';
//     } 
//     // For customer login
//     else if (userType === 'customer') {
//       // Customers should see orders created by them
//       // Use Ret_Id or Customer_Id from the user data
//       userId = userData.Ret_Id || userData.Customer_Id || userData.id || sessionData?.retId || '';
//     }
    
//     // If no userId found, try to get from session
//     if (!userId) {
//       userId = sessionData?.userId || sessionData?.Ret_Id || '';
//     }

//     const formattedFromDate = fromDate.toISOString().split('T')[0];
//     const formattedToDate = toDate.toISOString().split('T')[0];
//     const mobileno=JSON.parse(localStorage.getItem('username') || '{}');
//     // Build URL with parameters
//     let url = `sales/salesOrder/list?Created_by=${userId}&Mobile_No=${mobileno}&FromDate=${formattedFromDate}&ToDate=${formattedToDate}`;
    
//     const response = await fetchLink({
//       address: url,
//       method: 'GET',
//     });
    
//     if (response?.success) {
//       const orderData = response.data || response.Data || [];
//       setOrders(Array.isArray(orderData) ? orderData : []);
//     } else {
//       toast.error(response?.message || "Failed to fetch orders");
//       setOrders([]);
//     }
//   } catch (error) {
//     console.error("Error fetching sale orders:", error);
//     toast.error("Failed to load sale orders");
//     setOrders([]);
//   } finally {
//     setLoading(false);
//   }
// };
 
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
//     } catch { return dateString; }
//   };

//   const handleOpenFilterDialog = () => {
//     setTempFromDate(fromDate); setTempToDate(toDate);
//     setTempBrokerFilter(brokerFilter); setTempTransporterFilter(transporterFilter);
//     setShowFilterDialog(true);
//   };

//   const handleFilterApply = () => {
//     if (tempFromDate && tempToDate) { setFromDate(tempFromDate); setToDate(tempToDate); }
//     setBrokerFilter(tempBrokerFilter); setTransporterFilter(tempTransporterFilter);
//     setShowFilterDialog(false);
//     const activeFilters = [];
//     if (tempFromDate && tempToDate) activeFilters.push("date range");
//     if (tempBrokerFilter) activeFilters.push("broker");
//     if (tempTransporterFilter) activeFilters.push("transporter");
//     if (activeFilters.length > 0) toast.success(`Filters applied: ${activeFilters.join(", ")}`);
//   };

//   const handleFilterClear = () => {
//     const d = new Date(); d.setDate(d.getDate() - 0);
//     setTempFromDate(d); setTempToDate(new Date());
//     setTempBrokerFilter(""); setTempTransporterFilter("");
//   };

//   const handleFilterReset = () => {
//     const d = new Date(); d.setDate(d.getDate() - 0);
//     setFromDate(d); setToDate(new Date());
//     setBrokerFilter(""); setTransporterFilter("");
//     setTempFromDate(d); setTempToDate(new Date());
//     setTempBrokerFilter(""); setTempTransporterFilter("");
//     setShowFilterDialog(false);
//     toast.success("All filters cleared");
//   };

//   const getTotalBillQty = (productsList) => {
//     if (!productsList || !Array.isArray(productsList) || productsList.length === 0) return 0;
//     return productsList.reduce((sum, product) => sum + (parseFloat(product.Bill_Qty) || 0), 0);
//   };

//   const getTotalItems = (productsList) => (!productsList || !Array.isArray(productsList)) ? 0 : productsList.length;

//   const filteredOrders = useMemo(() => {
//     return orders.filter(order => {
//       if (debouncedSearchTerm) {
//         const search = debouncedSearchTerm.toLowerCase();
//         const productNames = (order.Products_List || []).map(p => p.Product_Name || '').join(' ').toLowerCase();
//         const matchesSearch = (
//           (order.Retailer_Name && order.Retailer_Name.toLowerCase().includes(search)) ||
//           (order.Customer_Name && order.Customer_Name.toLowerCase().includes(search)) ||
//           (order.So_Inv_No && order.So_Inv_No.toLowerCase().includes(search)) ||
//           (order.So_No && order.So_No.toString().includes(search)) ||
//           (order.Narration && order.Narration.toLowerCase().includes(search)) ||
//           (order.OrderStatus && order.OrderStatus.toLowerCase().includes(search)) ||
//           productNames.includes(search)
//         );
//         if (!matchesSearch) return false;
//       }
//       if (brokerFilter && getBrokerName(order).trim() !== brokerFilter) return false;
//       if (transporterFilter && getTransporterName(order).trim() !== transporterFilter) return false;
//       return true;
//     });
//   }, [orders, debouncedSearchTerm, brokerFilter, transporterFilter]);

//   const toggleOrderExpansion = (orderId) => setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));

//   const getProductPackGet = (productName) => {
//     if (productName) {
//       const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
//       if (packMatch) return parseFloat(packMatch[1]);
//     }
//     return 1;
//   };

// const handlePrintOrder = async (e, order) => {

//   e.stopPropagation();
//   try {
//     const productsList = order.Products_List || [];
//      const createdOnDate = order.Created_on || order.Created_On || order.created_on;
//     const orderDateValue = order.So_Date;

//     const originalCustomerName = order.Retailers_Name || order.Customer_Name || order.Party_Name || order.Billl_Name || "";
//     const originalCity = order.City || "";
//     const originalAddress = order.Shipp_Address || order.Shipping_Address || order.Address || "";
//     const originalMobile = order.Ord_Mobile_No || order.Mobile_No || order.Contact_No || "";
//     const originalBrokerName = getBrokerName(order);
//     const originalTransporterName = getTransporterName(order);
    



//     const printCartItems = productsList.map(p => ({
//       Print_Name: p.Product_Short_Name || p.Product_Name || "",
//       shortName: p.Short_Name || p.Product_Short_Name || p.Product_Name || "",
//       kgs: parseFloat(p.Bill_Qty) || 0,
//       price: parseFloat(p.Item_Rate) || parseFloat(p.Price) || 0,
//     }));

//     // Create customer data with correct field priorities
//     let customerData = {
//       Billl_Name: originalCustomerName,  // Primary field for PARTY NAME
//       Party_Mailing_Name: originalCustomerName,
//       Party_Location: originalCity,       // Primary field for LOCATION
//       Party_Mailing_Address: originalAddress,
//       City: originalCity,
//       Mobile_No: originalMobile,
//       Land_Line: originalMobile,
//       Transporter: originalTransporterName,
//       Broker: originalBrokerName,
//     };

//     const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
//     if (retailerId) {
//       const response = await fetchLink({ 
//         address: `pos/retailerMasterOptRetailerId?Customer_Id=${retailerId}&limit=10000000&page=1` 
//       });
//       if (response?.success && Array.isArray(response.data)) {
//         const found = response.data.find(c => String(c.Customer_Id) === String(retailerId));
//         if (found) {
        
//           customerData = {
//             Billl_Name: originalCustomerName,  
//             Party_Mailing_Name: originalCustomerName,
//             Party_Location: originalCity || found.City || "", 
//             Party_Mailing_Address: originalAddress || found.Address || found.Party_Mailing_Address || "",
//             City: originalCity || found.City || "",
//             Mobile_No: originalMobile || found.Mobile_No || "",
//             Land_Line: found.Land_Line || originalMobile || "",
//             Transporter: originalTransporterName || found.Transporter || "",
//             Broker: originalBrokerName || found.Broker || "",
//           };
//         }
//       }
//     }

//     const totalInvoiceValue = parseFloat(order.Total_Invoice_value || 0);
//     const totalKgs = productsList.reduce((sum, p) => sum + (parseFloat(p.Bill_Qty) || 0), 0);
//     const totals = { 
//       subtotal: totalInvoiceValue, 
//       tax: 0, 
//       total: totalInvoiceValue, 
//       totalItems: productsList.length, 
//       totalKgs 
//     };
    
//     const storage = JSON.parse(localStorage.getItem('user') || '{}');
    
//     setPrintData({ 
//       customer: customerData, 
//       cartItems: printCartItems, 
//       totals, 
//       storage,
//       createdOn: createdOnDate,  // Add this
//       orderDate: orderDateValue,  // Add this
//     });
//     setPrintModalOpen(true);
//   } catch (error) {
//     console.error("Error preparing print data:", error);
//     toast.error("Failed to prepare print data");
//   }
// };



// const handleEditOrder = async (e, order) => {
 
//   e.stopPropagation();
//   try {
//     const orderId = order.So_Id || order.So_No || order.OrderId;
//     localStorage.setItem('editOrderId', orderId);
//     localStorage.setItem("selectedCustomerId", order.Retailer_Id);

   
//     let actualBrokerId = null;
//     let actualBrokerName = "";
//     let actualTransporterId = null;
//     let actualTransporterName = "";

//     if (order.Staff_Involved_List && Array.isArray(order.Staff_Involved_List)) {
   
//       const broker = order.Staff_Involved_List.find(
//         staff => staff.Cost_Center_Type_Id === 3 || staff.EmpType === "Broker"
//       );
//       if (broker) {
//         actualBrokerId = broker.Involved_Emp_Id || broker.Emp_Id;
//         actualBrokerName = broker.EmpName || "";
      
//       }

 
//       const transporter = order.Staff_Involved_List.find(
//         staff => staff.Cost_Center_Type_Id === 2 || staff.EmpType === "Load Man"
//       );
//       if (transporter) {
//         actualTransporterId = transporter.Involved_Emp_Id || transporter.Emp_Id;
//         actualTransporterName = transporter.EmpName || "";
     
//       }
//     }

    
//     const originalCustomerName = order.Retailer_Name || order.Customer_Name || order.Party_Name || "";
//     const originalCity = order.City || "";
//     const originalAddress = order.Shipp_Address || order.Shipping_Address || order.Address || "";
//     const originalMobile = order.Ord_Mobile_No || order.Mobile_No || order.Contact_No || "";
    
   
//     const response = await fetchLink({ 
//       address: `pos/retailerMasterOpt?Customer_Id=${order.Retailer_Id}&limit=10000000&page=1` 
//     });
    
//     let completeCustomerDetails = null;
//     if (response?.success && Array.isArray(response.data)) {
//       const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
//       completeCustomerDetails = response.data.find(c => String(c.Customer_Id) === String(retailerId));
//     }

//     const getProductPackGet = (productName) => {
//       if (productName) {
//         const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
//         if (packMatch) return parseFloat(packMatch[1]);
//       }
//       return 1;
//     };

//     const cartItemsObj = {};
//     const productsList = [];

//     if (order.Products_List && Array.isArray(order.Products_List)) {
//       order.Products_List.forEach(product => {
//         const productId = String(product.Product_Id || product.Item_Id);
        
//         const originalProductName = product.Product_Name || product.Item_Name || "";
//         const originalShortName = product.Product_Short_Name || product.Short_Name || originalProductName;
        
//         let packGet = parseFloat(product.PackGet) || parseFloat(product.Pack_Get) || 1;
//         if (packGet === 1 && originalProductName) packGet = getProductPackGet(originalProductName);
        
//         const billQty = parseFloat(product.Bill_Qty) || 0;
//         const quantity = packGet > 0 && billQty > 0 ? Math.round(billQty / packGet) : 1;
//         const pricePerKg = parseFloat(product.Item_Rate) || parseFloat(product.Price) || 0;
//         const amount = parseFloat(product.Amount) || (pricePerKg * billQty) || 0;
        
//         cartItemsObj[productId] = quantity;
//         productsList.push({
//           id: productId,
//           name: originalProductName, 
//           shortName: originalShortName, 
//           quantity: quantity,
//           kgs: billQty,
//           price: pricePerKg,
//           packGet: packGet,
//           amount: amount,
//         });
//       });
//     }

  
//     const editData = {
//       customerId: order.Retailer_Id || order.Customer_Id || order.Party_Id,
//       customerName: originalCustomerName, 
//       customerMobile: originalMobile || completeCustomerDetails?.Mobile_No || "",
//       customerAddress: originalAddress || completeCustomerDetails?.Address || "", 
//       customerCity: originalCity || completeCustomerDetails?.City || "", 
//       orderId: orderId,
//       orderNumber: order.So_Inv_No || order.So_No || order.OrderNumber,
//       cartItems: cartItemsObj,
//       productsList: productsList,
      
//       brokerId: actualBrokerId,
//       brokerName: actualBrokerName,
//       transporterId: actualTransporterId,
//       transporterName: actualTransporterName,
//       shippingAddress: originalAddress || completeCustomerDetails?.Address || order.Shipp_Address || order.Shipping_Address || "",
//       deliveryAddress: originalAddress || completeCustomerDetails?.Address || order.Deliv_Address || order.Delivery_Address || order.Shipp_Address || "",
//       contactNumber: originalMobile || completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
//       description: order.Narration || order.Description || order.Note || "",
     
//       originalCustomerName: originalCustomerName,
//       originalCity: originalCity,
//       originalAddress: originalAddress,
//       originalMobile: originalMobile,
//       originalBillName: completeCustomerDetails?.Billl_Name || originalCustomerName,
//       originalPartyMailingName: completeCustomerDetails?.Party_Mailing_Name || originalCustomerName,
//       originalPartyMailingAddress: completeCustomerDetails?.Party_Mailing_Address || originalAddress,
//       customerDetails: {
//         id: order.Retailer_Id || order.Customer_Id || order.Party_Id,
//         name: originalCustomerName, // Use original Tamil name
//         mobile: originalMobile || completeCustomerDetails?.Mobile_No || "",
//         address: originalAddress || completeCustomerDetails?.Address || "",
//         city: originalCity || completeCustomerDetails?.City || "",
//         brokerId: actualBrokerId,
//         brokerName: actualBrokerName,
//         transporterId: actualTransporterId,
//         transporterName: actualTransporterName,
//         billName: completeCustomerDetails?.Billl_Name || originalCustomerName,
//         partyMailingName: completeCustomerDetails?.Party_Mailing_Name || originalCustomerName,
//         partyMailingAddress: completeCustomerDetails?.Party_Mailing_Address || originalAddress,
//       },
//     };

  

//     localStorage.setItem('editOrderData', JSON.stringify(editData));
//     localStorage.setItem('isEditingOrder', 'true');
    
//     // Store the actual IDs separately to ensure they're not overwritten
//     if (actualBrokerId) localStorage.setItem('editBrokerId', actualBrokerId);
//     if (actualBrokerName) localStorage.setItem('editBrokerName', actualBrokerName);
//     if (actualTransporterId) localStorage.setItem('editTransporterId', actualTransporterId);
//     if (actualTransporterName) localStorage.setItem('editTransporterName', actualTransporterName);
    
//     // Store original customer data for print
//     localStorage.setItem('editCustomerOriginalName', originalCustomerName);
//     localStorage.setItem('editCustomerOriginalCity', originalCity);
//     localStorage.setItem('editCustomerOriginalAddress', originalAddress);
//     localStorage.setItem('editCustomerOriginalMobile', originalMobile);
//     localStorage.setItem('editCustomerBillName', completeCustomerDetails?.Billl_Name || originalCustomerName);
//     localStorage.setItem('editCustomerPartyMailingName', completeCustomerDetails?.Party_Mailing_Name || originalCustomerName);
//     localStorage.setItem('editCustomerPartyMailingAddress', completeCustomerDetails?.Party_Mailing_Address || originalAddress);
    
//     const currentCart = localStorage.getItem('cartItems');
//     if (currentCart) localStorage.setItem('previousCartItems', currentCart);
//     const productsData = localStorage.getItem('products');
//     if (productsData) localStorage.setItem('productsBackup', productsData);

//     navigate('/cart', {
//       state: {
//         editOrderData: editData,
//         isEditingOrder: true,
//         selectedCustomer: {
//           id: editData.customerDetails.id,
//           name: originalCustomerName, // Use original Tamil name
//           billName: editData.customerDetails.billName,
//           mobile: originalMobile || editData.customerDetails.mobile || "",
//           city: originalCity || editData.customerDetails.city || "",
//           address: originalAddress || editData.customerDetails.address || "",
//           brokerId: actualBrokerId,
//           brokerName: actualBrokerName,
//           transporterId: actualTransporterId,
//           transporterName: actualTransporterName,
//           partyMailingName: editData.customerDetails.partyMailingName,
//           partyMailingAddress: editData.customerDetails.partyMailingAddress,
//         },
//       },
//     });
//     toast.info(`Loading order #${order.So_Inv_No || order.So_No} for editing...`);
//   } catch (error) {
//     console.error("Error fetching customer details:", error);
//     toast.error("Failed to load order details for editing");
//   }
// };

//   const productTableHeaderStyle = { padding: "10px 12px", textAlign: "center", color: BROWN, fontSize: "12px", fontWeight: "600" };
//   const productTableCellStyle = { padding: "10px 12px", textAlign: "center", fontSize: "12px", color: "#666" };

//   const ProductListExpand = ({ products }) => {
//     if (!products || products.length === 0) return null;
//     return (
//       <div style={{ padding: "16px", background: "#f9f4ef", borderTop: "2px solid #e8ddd4" }}>
//         <h4 style={{ margin: "0 0 12px 0", color: BROWN, fontSize: "14px", fontWeight: "600" }}>Products ({products.length})</h4>
//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
//             <thead>
//               <tr style={{ background: "#f0e9e2", borderBottom: `2px solid ${ACCENT}` }}>
//                 <th style={productTableHeaderStyle}>S.No</th>
//                 <th style={{ ...productTableHeaderStyle, textAlign: "left" }}>Product Name</th>
//                 <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Kgs</th>
//                 <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Rate (₹/kg)</th>
//                 <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Amount (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product, idx) => (
//                 <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = "#fdf8f3"}
//                   onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//                 >
//                   <td style={productTableCellStyle}>{idx + 1}</td>
//                   <td style={{ ...productTableCellStyle, textAlign: "left", fontWeight: "500", color: BROWN_DARK }}>{product.Product_Name || "Unknown Product"}</td>
//                   <td style={{ ...productTableCellStyle, textAlign: "right" }}>{parseFloat(product.Bill_Qty || 0).toFixed(2)}</td>
//                   <td style={{ ...productTableCellStyle, textAlign: "right" }}>₹{parseFloat(product.Item_Rate || product.Price || 0).toFixed(2)}</td>
//                   <td style={{ ...productTableCellStyle, textAlign: "right", fontWeight: "600", color: BROWN_DARK }}>₹{parseFloat(product.Amount || 0).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const activeFiltersCount = (brokerFilter ? 1 : 0) + (transporterFilter ? 1 : 0);
//   const tableHeaderStyle = { padding: "12px 16px", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" };

//   return (
//     <>
//        <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile ? "70px" : "0" }}>
//         {/* Header */}
//         <div style={{
//           padding: "16px 20px", backgroundColor: BROWN_DARK, color: "#fff",
//           display: "flex", alignItems: "center", gap: "12px",
//           position: "sticky", top: 0, zIndex: 100,
//           flexWrap: isMobile ? "wrap" : "nowrap",
//         }}>
//           <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px" }}>←</button>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: "18px", fontWeight: "bold" }}>Sale Orders</div>
//             <div style={{ fontSize: "12px", opacity: 0.8 }}>
//               {filteredOrders.length} of {orders.length} orders
//               {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active)`}
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div style={{ position: "relative", width: isMobile ? "100%" : "250px", order: isMobile ? 2 : 1 }}>
//             <input
//               type="text" placeholder="Search orders..." value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%", padding: "8px 12px 8px 32px", borderRadius: "20px",
//                 border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)",
//                 color: "#fff", fontSize: "12px", outline: "none",
//               }}
//             />
//             <SearchIcon style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(255,255,255,0.7)" }} />
//           </div>

//           {/* Filter Button */}
//           <button
//             onClick={handleOpenFilterDialog}
//             style={{
//               background: activeFiltersCount > 0 ? ACCENT : "rgba(255,255,255,0.15)",
//               border: "1px solid rgba(255,255,255,0.3)", borderRadius: "20px",
//               padding: "6px 12px", color: activeFiltersCount > 0 ? BROWN_DARK : "#fff",
//               cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px",
//               order: isMobile ? 1 : 2, fontWeight: activeFiltersCount > 0 ? "600" : "400",
//             }}
//           >
//             <FilterListIcon style={{ fontSize: "16px" }} />
//             Filter
//             {activeFiltersCount > 0 && (
//               <span style={{ background: "#e74c3c", color: "#fff", borderRadius: "10px", padding: "2px 6px", fontSize: "10px", marginLeft: "4px" }}>
//                 {activeFiltersCount}
//               </span>
//             )}
//           </button>

//           {activeFiltersCount > 0 && (
//             <button
//               onClick={handleFilterReset}
//               style={{
//                 background: "#e74c3c", border: "none", borderRadius: "20px", padding: "6px 12px",
//                 color: "#fff", cursor: "pointer", fontSize: "12px",
//                 display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, order: isMobile ? 3 : 3,
//               }}
//             >✕ Clear All</button>
//           )}
//         </div>

//         {/* Filter Dialog */}
//         {showFilterDialog && (
//           <div
//             style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}
//             onClick={() => setShowFilterDialog(false)}
//           >
//             <div
//               style={{ background: "#fff", borderRadius: "16px", width: isMobile ? "92%" : "500px", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div style={{ padding: "20px 24px", background: BROWN_DARK, color: "#fff", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <div>
//                   <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Filter Orders</h3>
//                   <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>Apply filters to narrow down results</p>
//                 </div>
//                 <CloseIcon style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => setShowFilterDialog(false)} />
//               </div>

//               <div style={{ padding: "24px" }}>
//                 {/* Date Range */}
//                 <div style={{ marginBottom: "28px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` }}>
//                     <span style={{ fontSize: "18px" }}>📅</span>
//                     <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Date Range</span>
//                   </div>
//                   <div style={{ marginBottom: "16px" }}>
//                     <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "13px", fontWeight: "500" }}>From Date</label>
//                     <DatePicker selected={tempFromDate} onChange={(date) => setTempFromDate(date)} selectsStart startDate={tempFromDate} endDate={tempToDate} dateFormat="dd/MM/yyyy" placeholderText="Select from date" className="date-picker-input" />
//                   </div>
//                   <div>
//                     <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "13px", fontWeight: "500" }}>To Date</label>
//                     <DatePicker selected={tempToDate} onChange={(date) => setTempToDate(date)} selectsEnd startDate={tempFromDate} endDate={tempToDate} minDate={tempFromDate} dateFormat="dd/MM/yyyy" placeholderText="Select to date" className="date-picker-input" />
//                   </div>
//                 </div>

//                 {/* Broker Filter */}
//                 {uniqueBrokers.length > 0 && (
//                   <div style={{ marginBottom: "28px" }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` }}>
//                       <span style={{ fontSize: "18px" }}>👤</span>
//                       <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Broker</span>
//                     </div>
//                     <div style={{ position: "relative" }}>
//                       <select
//                         value={tempBrokerFilter} onChange={(e) => setTempBrokerFilter(e.target.value)}
//                         style={{ width: "100%", padding: "12px 32px 12px 12px", border: `1px solid ${tempBrokerFilter ? BROWN_DARK : ACCENT}`, borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: tempBrokerFilter ? "#f9f4ef" : "#fff", color: tempBrokerFilter ? BROWN_DARK : "#333", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
//                       >
//                         <option value="">All Brokers</option>
//                         {uniqueBrokers.map(b => <option key={b} value={b}>{b}</option>)}
//                       </select>
//                       <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BROWN_LIGHT, fontSize: "12px" }}>▼</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Transporter Filter */}
//                 {uniqueTransporters.length > 0 && (
//                   <div style={{ marginBottom: "28px" }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` }}>
//                       <span style={{ fontSize: "18px" }}>🚚</span>
//                       <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Transporter</span>
//                     </div>
//                     <div style={{ position: "relative" }}>
//                       <select
//                         value={tempTransporterFilter} onChange={(e) => setTempTransporterFilter(e.target.value)}
//                         style={{ width: "100%", padding: "12px 32px 12px 12px", border: `1px solid ${tempTransporterFilter ? BROWN_DARK : ACCENT}`, borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: tempTransporterFilter ? "#f9f4ef" : "#fff", color: tempTransporterFilter ? BROWN_DARK : "#333", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
//                       >
//                         <option value="">All Transporters</option>
//                         {uniqueTransporters.map(t => <option key={t} value={t}>{t}</option>)}
//                       </select>
//                       <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BROWN_LIGHT, fontSize: "12px" }}>▼</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div style={{ padding: "16px 24px", borderTop: "1px solid #e8ddd4", display: "flex", gap: "12px", background: "#faf6f2", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
//                 <Button variant="outlined" onClick={handleFilterClear} style={{ flex: 1 }}>Clear All</Button>
//                 <Button variant="contained" onClick={handleFilterApply} style={{ flex: 1, backgroundColor: BROWN_DARK, color: "#fff", fontWeight: "600" }}>Apply Filters</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div style={{ padding: isMobile ? "12px" : "24px", overflowX: "auto" }}>
//           {loading ? (
//             <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
//               <CircularProgress style={{ color: BROWN, marginBottom: "16px" }} />
//               <p>Loading orders...</p>
//             </div>
//           ) : filteredOrders.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
//               <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
//               <h3 style={{ color: "#666", marginBottom: "8px" }}>No Orders Found</h3>
//               <p style={{ fontSize: "14px" }}>
//                 {debouncedSearchTerm || brokerFilter || transporterFilter ? "Try adjusting your search or filters" : "No orders found in selected date range"}
//               </p>
//             </div>
//           ) : isMobile ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//               {filteredOrders.map((order, index) => {
//                 const totalBillQty = getTotalBillQty(order.Products_List);
//                 const totalItems = getTotalItems(order.Products_List);
//                 const orderKey = order.So_Id || order.So_No || index;
//                 const isExpanded = expandedOrders[orderKey] || false;
//                 const brokerName = getBrokerName(order);
//                 const transporterName = getTransporterName(order);
//                 return (
//                   <div key={orderKey} style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e8ddd4", overflow: "hidden" }}>
//                     <div onClick={() => toggleOrderExpansion(orderKey)} style={{ padding: "16px", cursor: "pointer" }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontSize: "15px", fontWeight: "600", color: BROWN_DARK, marginBottom: "4px" }}>{order.Retailer_Name || order.Customer_Name || "Unknown Customer"}</div>
//                           <div style={{ fontSize: "12px", color: "#666" }}>Order #{order.So_Inv_No || order.So_No}</div>
//                           {brokerName && <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>Broker: {brokerName}</div>}
//                           {transporterName && <div style={{ fontSize: "10px", color: "#888" }}>Transporter: {transporterName}</div>}
//                         </div>
//                         <div style={{ textAlign: "right", marginLeft: "12px" }}>
//                           <div style={{ fontSize: "15px", fontWeight: "bold", color: BROWN_DARK }}>₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}</div>
//                           <div style={{ fontSize: "11px", color: "#666" }}>{totalItems} items • {totalBillQty.toFixed(2)} kg</div>
//                         </div>
//                       </div>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#999" }}>
//                         <span>{formatDate(order.So_Date)}</span>
//                         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                           <span style={{ padding: "2px 8px", borderRadius: "10px", background: order.OrderStatus === "pending" ? "#fff3cd" : "#d4edda", color: order.OrderStatus === "pending" ? "#856404" : "#155724", fontSize: "10px", fontWeight: "600" }}>
//                             {order.OrderStatus || order.VoucherTypeGet || "N/A"}
//                           </span>
//                           <span style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", fontSize: "16px" }}>▼</span>
//                         </div>
//                       </div>
//                       {order.Narration && (
//                         <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic", padding: "8px", background: "#f9f4ef", borderRadius: "8px", marginTop: "8px" }}>{order.Narration}</div>
//                       )}
//                       <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" }}>
//                         <button
//                           onClick={(e) => handlePrintOrder(e, order)}
//                           style={{ padding: "8px 16px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
//                           onMouseEnter={(e) => e.currentTarget.style.background = "#388E3C"}
//                           onMouseLeave={(e) => e.currentTarget.style.background = "#4CAF50"}
//                         >🖨️ Print</button>
//                         <button
//                           onClick={(e) => handleEditOrder(e, order)}
//                           style={{ padding: "8px 16px", background: ACCENT, color: BROWN_DARK, border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
//                           onMouseEnter={(e) => e.currentTarget.style.background = "#b8956a"}
//                           onMouseLeave={(e) => e.currentTarget.style.background = ACCENT}
//                         >✏️ Edit</button>
//                       </div>
//                     </div>
//                     {isExpanded && <ProductListExpand products={order.Products_List} />}
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 0", minWidth: "1200px" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#f9f4ef" }}>
//                     <th style={tableHeaderStyle}></th>
//                     {["Order #", "Date", "Customer", "Broker", "Transporter", "Items", "Status", "Kgs", "Amount", "Actions"].map((h, i) => (
//                       <th key={h} style={{ ...tableHeaderStyle, textAlign: i >= 6 && i <= 8 ? "right" : i === 9 ? "center" : "left" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order, index) => {
//                     const totalBillQty = getTotalBillQty(order.Products_List);
//                     const totalItems = getTotalItems(order.Products_List);
//                     const orderKey = order.So_Id || order.So_No || index;
//                     const isExpanded = expandedOrders[orderKey] || false;
//                     const brokerName = getBrokerName(order);
//                     const transporterName = getTransporterName(order);
//                     const OrderStatus = getOrderStatus(order);
//                     return (
//                       <React.Fragment key={orderKey}>
//                         <tr
//                           onClick={() => toggleOrderExpansion(orderKey)}
//                           style={{ backgroundColor: "#fff", cursor: "pointer", transition: "all 0.2s", borderBottom: "1px solid #e8ddd4" }}
//                           onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fdf8f3"; }}
//                           onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
//                         >
//                           <td style={{ padding: "14px 8px 14px 16px", textAlign: "center", color: BROWN_LIGHT, fontSize: "14px" }}>
//                             <span style={{ display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>►</span>
//                           </td>
//                           <td style={{ padding: "14px 16px", color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>{order.So_Inv_No || order.So_No || "N/A"}</td>
//                           <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px", textAlign: "center" }}>{order.So_Date ? order.So_Date.split('T')[0] : "N/A"}</td>
//                           <td style={{ padding: "14px 16px" }}>
//                             <div style={{ color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>{order.Retailer_Name || order.Customer_Name || "Unknown"}</div>
//                             {order.Ord_Mobile_No && <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>📞 {order.Ord_Mobile_No}</div>}
//                           </td>
//                           <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>{brokerName || "-"}</td>
//                           <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>{transporterName || "-"}</td>
//                           <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{totalItems}</td>
//                           <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{OrderStatus}</td>
//                           <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{totalBillQty.toFixed(2)} kg</td>
//                           <td style={{ padding: "14px 16px", textAlign: "right", color: BROWN_DARK, fontWeight: "600", fontSize: "14px" }}>₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}</td>
//                           <td style={{ padding: "14px 16px", textAlign: "center" }}>
//                             <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
//                               <button
//                                 onClick={(e) => handlePrintOrder(e, order)}
//                                 style={{ background: "#4CAF50", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", color: "#fff", fontSize: "12px", fontWeight: "600", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
//                                 onMouseEnter={(e) => e.currentTarget.style.background = "#388E3C"}
//                                 onMouseLeave={(e) => e.currentTarget.style.background = "#4CAF50"}
//                               >🖨️ Print</button>
//                               <button
//                                 onClick={(e) => handleEditOrder(e, order)}
//                                 style={{ background: BROWN, border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", color: "#fff", fontSize: "12px", fontWeight: "600", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
//                                 onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
//                                 onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
//                               >✏️ Edit</button>
//                             </div>
//                           </td>
//                         </tr>
//                         {isExpanded && (
//                           <tr>
//                             <td colSpan={12} style={{ padding: "0" }}>
//                               <ProductListExpand products={order.Products_List} />
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Print Preview Modal for SaleOrders – uses the unified PrintPreviewModal */}
//       <PrintPreviewModal
//         open={printModalOpen}
//         onClose={() => setPrintModalOpen(false)}
//         customer={printData?.customer}
//         cartItems={printData?.cartItems}
//         totals={printData?.totals}
//         storage={printData?.storage}
//         isReprint={true}
//         createdOn={printData?.createdOn}  
//         orderDate={printData?.orderDate}  

//       />
//     </>
//   );
// }

// function Dashboard({
//   isMobile,
//   isLoggedIn,
//   userName,
//   customers,
//   allProducts,
//   onLoginClick,
//   onLogout,
//   onHome,
//   onSaleOrders,
//   activeTab = "dashboard",
// }) {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stockGroupsCount, setStockGroupsCount] = useState(0);
//   const [pendingBills, setPendingBills] = useState(0);
//   const [transactions, setTransactions] = useState(0);
//   const [viewTickets, setViewTickets] = useState(0);
//   const [showTransactionDetails, setShowTransactionDetails] = useState(false);
//   const [showPendingBills,setShowPendingBills]=useState(false)


//   const handleTransactionClick = () => {
//     setShowTransactionDetails(true);
//   };

//   const handlePendingBillsClick=()=>{
//     setShowPendingBills(true)
//   }

//   useEffect(() => {
//     fetchTodayOrders();
//     fetchDashboardStats();
//   }, []);

//   const fetchTodayOrders = async () => {
//     setLoading(true);
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
//       const userType = localStorage.getItem('userType');
      
//       let userId = null;
      
//       if (userType === 'employee') {
//         userId = userData.UserId || userData.user_id || userData.User_Id || '';
//       } else if (userType === 'customer') {
//         userId = userData.Ret_Id || userData.Customer_Id || userData.id || sessionData?.retId || '';
//       }
      
//       if (!userId) {
//         userId = sessionData?.userId || sessionData?.Ret_Id || '';
//       }
//       const mobileno=JSON.parse(localStorage.getItem('username') || '{}');
//       const today = new Date().toISOString().split('T')[0];
//       const response = await fetchLink({
//         address: `sales/salesOrder/list?Created_by=${userId}&Mobile_No=${mobileno}&FromDate=${today}&ToDate=${today}`,
//         method: 'GET',
//       });
      
//       if (response?.success) {
//         const orderData = response.data || response.Data || [];
//         setOrders(Array.isArray(orderData) ? orderData : []);
//       } else {
//         setOrders([]);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard orders:", error);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDashboardStats = async () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
//       const userType = localStorage.getItem('userType');
      
//       let userId = null;
      
//       if (userType === 'employee') {
//         userId = userData.UserId || userData.user_id || userData.User_Id || '';
//       } else if (userType === 'customer') {
//         userId = userData.Ret_Id || userData.Customer_Id || userData.id || sessionData?.retId || '';
//       }
      
//       if (!userId) {
//         userId = sessionData?.userId || sessionData?.Ret_Id || '';
//       }

      
//       const pendingResponse = await fetchLink({
//         address: `sales/pendingBills?Created_by=${userId}`,
//         method: 'GET',
//       });
//       if (pendingResponse?.success) {
//         setPendingBills(pendingResponse.data?.count || 0);
//       }

//       // Fetch transactions count
//       const transactionResponse = await fetchLink({
//         address: `sales/transactions/count?Created_by=${userId}`,
//         method: 'GET',
//       });
//       if (transactionResponse?.success) {
//         setTransactions(transactionResponse.data?.count || 0);
//       }

//       // Fetch view tickets
//       const ticketResponse = await fetchLink({
//         address: `support/tickets?Created_by=${userId}`,
//         method: 'GET',
//       });
//       if (ticketResponse?.success) {
//         const tickets = ticketResponse.data || [];
//         setViewTickets(tickets.length);
//       }

//     } catch (error) {
//       console.error("Error fetching dashboard stats:", error);
//     }
//   };

//   useEffect(() => {
//     if (allProducts && allProducts.length > 0) {
//       const groups = new Set(
//         allProducts.map((p) => (p.Stock_Group || "").trim()).filter(Boolean)
//       );
//       setStockGroupsCount(groups.size);
//     }
//   }, [allProducts]);

//   const todaysRevenue = orders.reduce((s, o) => s + (parseFloat(o.Total_Invoice_value) || 0), 0);
//   const todaysOrders = orders.length;
//   const todaysKgs = orders.reduce((sum, o) => {
//     const products = o.Products_List || [];
//     return sum + products.reduce((s, p) => s + (parseFloat(p.Bill_Qty) || 0), 0);
//   }, 0);
//   const totalCustomers = (customers || []).length;

//   const rupee = (n) =>
//     (Number.isFinite(Number(n)) ? Number(n) : 0).toLocaleString("en-IN", {
//       maximumFractionDigits: 0,
//     });

//   const todayLabel = new Date().toLocaleDateString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric",
//   });

//   // Updated stat cards with click handlers
//   const statCards = [
//     { 
//       label: "Today's Orders", 
//       value: loading ? "—" : todaysOrders, 
//       icon: "📦", 
//       iconBg: "#f0e9e2",
//       color: BROWN_DARK,
//       onClick: () => onSaleOrders && onSaleOrders() 
//     },
//     { 
//       label: "Pending Bills", 
       
//       icon: "📋", 
//       iconBg: "#fef3e2",
//       color: "#e67e22",
//       onClick: handlePendingBillsClick
//     },
//     { 
//       label: "Transactions",
//       icon: "💰", 
//       iconBg: "#e2f0f0",
//       color: "#2980b9",
//       onClick: handleTransactionClick 
//     },
//     // { 
//     //   label: "Total Customers", 
//     //   value: totalCustomers || "—", 
//     //   icon: "🏪", 
//     //   iconBg: "#e8f0e2",
//     //   color: BROWN_DARK,
//     //   onClick: () => toast.info("Showing customer list...")
//     // },
//     // { 
//     //   label: "Kgs order today", 
//     //   value: loading ? "—" : `${todaysKgs.toFixed(0)} kg`, 
//     //   icon: "⚖️", 
//     //   iconBg: "#f0e6d8",
//     //   color: BROWN_DARK,
//     //   onClick: () => onSaleOrders && onSaleOrders()
//     // },
//     { 
//       label: "View Ticket", 
//       value: loading ? "—" : viewTickets, 
//       icon: "🎫", 
//       iconBg: "#f0e2ec",
//       color: "#8e44ad",
//       onClick: () => toast.info("Opening tickets...")
//     },
//   ];

//   const footerTabs = [
//     { key: "home", label: "Home", icon: "🏠", onClick: onHome },
//     { key: "dashboard", label: "Dashboard", icon: "📊", onClick: () => {} },
//     { key: "saleOrders", label: "Sale Orders", icon: "📋", onClick: onSaleOrders },
//   ];

 
//   if (showTransactionDetails) {
//     return <TransactionDetails onBack={() => setShowTransactionDetails(false)} />;
//   }

//     if (showPendingBills) {
//     return <PendingBillDetails onBack={() => setShowPendingBills(false)} />;
//   }


// return (
//   <>
//     {/* Desktop Modal for TransactionDetails */}
//     {showTransactionDetails && !isMobile && (
//       <div style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         zIndex: 10000,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "20px",
//       }}>
//         <div style={{
//           backgroundColor: "#fff",
//           borderRadius: "16px",
//           width: "100%",
//           maxWidth: "900px",
//           maxHeight: "90vh",
//           overflowY: "auto",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//           position: "relative",
//         }}>
//           {/* Close Button */}
//           <button
//             onClick={() => setShowTransactionDetails(false)}
//             style={{
//               position: "absolute",
//               top: "16px",
//               right: "16px",
//               background: "#f0f0f0",
//               border: "none",
//               borderRadius: "50%",
//               width: "40px",
//               height: "40px",
//               fontSize: "24px",
//               cursor: "pointer",
//               color: "#999",
//               zIndex: 10001,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "all 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = BROWN_DARK;
//               e.currentTarget.style.color = "#fff";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#f0f0f0";
//               e.currentTarget.style.color = "#999";
//             }}
//           >
//             ✕
//           </button>
          
//           {/* TransactionDetails Content */}
//           <div style={{ padding: "24px" }}>
//             <TransactionDetails 
//               onBack={() => setShowTransactionDetails(false)}
//               isMobile={false}
//               isModal={true}
//             />
//           </div>
//         </div>
//       </div>
//     )}

   
//     {showTransactionDetails && isMobile && (
//       <TransactionDetails 
//         onBack={() => setShowTransactionDetails(false)}
//         isMobile={true}
//         isModal={false}
//       />
//     )}


//     <div style={{
//       fontFamily: "'Georgia', serif",
//       background: "#f5f0eb",
//       minHeight: "100vh",
//       paddingBottom: isMobile ? "76px" : "40px",
//       opacity: showTransactionDetails && !isMobile ? 0.3 : 1,
//       pointerEvents: showTransactionDetails && !isMobile ? "none" : "auto",
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: isMobile ? "16px 20px" : "20px 32px",
//         backgroundColor: BROWN_DARK,
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: "12px",
//         position: "sticky",
//         top: 0,
//         zIndex: 100,
//       }}>
//         <div>
//           <div style={{ fontSize: isMobile ? "13px" : "14px", opacity: 0.8 }}>
//             Welcome back,
//           </div>
//           <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "bold" }}>
//             {userName || "User"}
//           </div>
//         </div>

//         <ThreeDotMenu
//           isLoggedIn={isLoggedIn}
//           userName={userName}
//           onLogout={onLogout}
//           onLoginClick={onLoginClick}
//           onSaleOrders={onSaleOrders}
//           onDashboard={() => {}}
//         />
//       </div>

//       <div style={{
//         padding: isMobile ? "16px" : "24px 32px",
//         maxWidth: "1100px",
//         margin: "0 auto",
//       }}>
//         {/* Hero card */}
//         <div style={{
//           background: `linear-gradient(135deg, ${BROWN} 0%, ${BROWN_DARK} 100%)`,
//           borderRadius: "20px",
//           padding: isMobile ? "20px" : "28px",
//           color: "#fff",
//           position: "relative",
//           overflow: "hidden",
//           marginBottom: isMobile ? "16px" : "24px",
//           minHeight: isMobile ? "150px" : "170px",
//         }}>
//           <div style={{ fontSize: "13px", opacity: 0.85, marginBottom: "8px" }}>
//             Today's revenue
//           </div>
//           <div style={{ fontSize: isMobile ? "30px" : "36px", fontWeight: "bold", marginBottom: "10px" }}>
//             ₹{loading ? "—" : rupee(todaysRevenue)}
//           </div>
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: "6px",
//             background: "rgba(255,255,255,0.15)", borderRadius: "20px",
//             padding: "4px 12px", fontSize: "12px",
//           }}>
//             <span>{todayLabel}</span>
//           </div>

//           <svg
//             viewBox="0 0 400 100"
//             preserveAspectRatio="none"
//             style={{
//               position: "absolute", bottom: 0, left: 0, width: "100%", height: "60px",
//               opacity: 0.25,
//             }}
//           >
//             <path
//               d="M0,60 C60,10 100,90 160,50 C220,10 260,80 320,40 C360,15 380,40 400,30 L400,100 L0,100 Z"
//               fill="#fff"
//             />
//           </svg>
//         </div>

     
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
//           gap: isMobile ? "12px" : "16px",
//         }}>
//           {statCards.map((card) => (
//             <div
//               key={card.label}
//               onClick={card.onClick}
//               style={{
//                 background: "#fff",
//                 borderRadius: "16px",
//                 padding: isMobile ? "16px" : "20px",
//                 border: "1px solid #e8ddd4",
//                 cursor: "pointer",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-4px)";
//                 e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)";
//                 e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
//               }}
//             >
//               <div style={{
//                 width: "36px", height: "36px", borderRadius: "10px",
//                 background: card.iconBg, display: "flex", alignItems: "center",
//                 justifyContent: "center", fontSize: "16px", marginBottom: "12px",
//               }}>
//                 {card.icon}
//               </div>
//               <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
//                 {card.label}
//               </div>
//               <div style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: "bold", color: card.color || BROWN_DARK }}>
//                 {card.value}
//               </div>
            
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer nav (mobile only) */}
//       {isMobile && (
//         <div style={{
//           position: "fixed", bottom: 0, left: 0, right: 0,
//           backgroundColor: "#fff", borderTop: "1px solid #e8ddd4",
//           display: "flex", justifyContent: "space-around", alignItems: "center",
//           padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
//           zIndex: 1100, boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
//         }}>
//           {footerTabs.map((tab) => {
//             const isActive = activeTab === tab.key;
//             return (
//               <button
//                 key={tab.key}
//                 onClick={tab.onClick}
//                 style={{
//                   flex: 1, background: "transparent", border: "none", cursor: "pointer",
//                   display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
//                   padding: "4px 0", position: "relative",
//                 }}
//               >
//                 <span style={{ fontSize: "20px" }}>{tab.icon}</span>
//                 <span style={{
//                   fontSize: "11px",
//                   fontWeight: isActive ? "700" : "500",
//                   color: isActive ? BROWN_DARK : "#999",
//                 }}>{tab.label}</span>
//                 <span style={{
//                   position: "absolute", bottom: "-8px", width: "24px", height: "3px",
//                   borderRadius: "2px", background: isActive ? BROWN_DARK : "transparent",
//                 }} />
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   </>
// );
// }



import React, { useState, useEffect, useRef, forwardRef, useMemo,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useReactToPrint } from 'react-to-print';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CommonHeader from './CommonHeader';
import { encryptPasswordFun } from "./functions";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { getSessionUser,ISOStrings } from "../components/functions";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionDetails from './TransactionDetails'
import PendingBillDetails from './PendingBillDetails';



const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";

import beansImg from '../assets/images/categoryImages/Beans.jpg';
import desiCpImg from '../assets/images/categoryImages/desi.jpeg';
import dhallImg from '../assets/images/categoryImages/dhall.jpg';
import iiItemImg from '../assets/images/categoryImages/2item.jpeg';
// import kabuliCpImg from '../assets/images/categoryImages/Kabuli_cp.jpg';
import kabuliCpImg from '../assets/images/categoryImages/kabuli.jpeg';
import kanamImg from '../assets/images/categoryImages/kanam.jpeg';
import masoorImg from '../assets/images/categoryImages/Masoor.jpg';
import milletsImg from '../assets/images/categoryImages/millets.jpeg';
import mochaiImg from '../assets/images/categoryImages/Mochai.jpg';
import moongImg from '../assets/images/categoryImages/moong_dhal.jpg';
import peasImg from '../assets/images/categoryImages/Peas.jpg';
import riceImg from '../assets/images/categoryImages/Rice.jpg';
import thattaiImg from '../assets/images/categoryImages/Thattai.jpg';
import retailImg from '../assets/images/categoryImages/Kabuli_cp.jpg';

const categoryImages = {
  "1.BEANS": beansImg,
  "2.Desi cp": desiCpImg,
  "3.DHALL": dhallImg,
  "4.II Item": iiItemImg,
  "5.Kabuli cp": kabuliCpImg,
  "6.KANAM": kanamImg,
  "7.MASOOR": masoorImg,
  "8.MILLETS": milletsImg,
  "9.Mochai": mochaiImg,
  "10.Moong": moongImg,
  "11.PEAS": peasImg,
  "12.RICE": riceImg,
  "13.Thattai": thattaiImg,
  "15.Retail": retailImg,
};

const getCategoryImage = (categoryName) => categoryImages[categoryName];



const buildPrintHtml = (customer, cartItems, totals, storage, createdOn, orderDate) => {
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const rupee = (n) =>
    safeNum(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalKgs = (cartItems || []).reduce((s, i) => s + safeNum(i.kgs), 0);
  const totalBags = (cartItems || []).reduce((sum, item) => {
    const displayName = item.shortName || item.Print_Name || "";
    const packWeight =
      parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
    return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
  }, 0);


  const formatDateTime = () => {
    let dateToUse = createdOn || orderDate;
    
    if (dateToUse) {
      try {
        let dateObj;
        
        if (typeof dateToUse === 'string') {

          if (dateToUse.includes(' ') && dateToUse.includes('-')) {
            const [datePart, timePart] = dateToUse.split(' ');
            const [year, month, day] = datePart.split('-');
            
            if (timePart) {
              const [hours, minutes] = timePart.split(':');
              dateObj = new Date(year, parseInt(month) - 1, day, parseInt(hours), parseInt(minutes));
            } else {
              dateObj = new Date(year, parseInt(month) - 1, day);
            }
          } 
        
          else if (dateToUse.includes('T')) {
            dateObj = new Date(dateToUse);
          }
          else {
            dateObj = new Date(dateToUse);
          }
          
          if (!isNaN(dateObj.getTime())) {
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            let hours = dateObj.getHours();
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
          }
        }
      } catch (e) {}
    }
    
    // Fallback to current time
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const rows = (cartItems || [])
    .map((item) => {
      const displayName = item.shortName || item.Print_Name || "";
      const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
      const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
      return `
        <tr>
          <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
            ₹${rupee(item.price)}
          </td>
          <td style="border:1px solid #000;padding:8px 4px;text-align:left;font-size:14px;">
            ${displayName}
          </td>
          <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
            ${bags > 0 ? Math.round(bags) : 0}
          </td>
        </tr>`;
    })
    .join("");

  const takenBy = storage?.Created_BY_Name || storage?.Name || "—";
  const formattedDateTime = formatDateTime();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Quotation</title>
  <style>
    @page { size: 80mm auto; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      font-weight: 900;
      color: #000;
      background: #fff;
      padding: 2mm;
      width: 80mm;
    }
    table { width: 100%; border-collapse: collapse; }
  </style>
</head>
<body>
  <div style="margin-bottom:2mm;font-size:14px;font-weight:1000;display:flex;justify-content:space-between;">
    <span>${formattedDateTime}</span>
    <span>TAKEN: ${takenBy}</span>
  </div>

  <div style="border-top:1px solid #000;border-bottom:1px solid #000;padding:1mm 0;margin-bottom:2mm;">
    <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
      <span style="min-width:13ch;white-space:pre;">PARTY NAME : </span>
      <span>${customer?.Billl_Name || customer?.Party_Mailing_Name || "—"}</span>
    </div>
    <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
      <span style="min-width:13ch;white-space:pre;">LOCATION   : </span>
      <span>${customer?.Party_Location || customer?.Party_Mailing_Address || customer?.City || "—"}</span>
    </div>
    <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
      <span style="min-width:13ch;white-space:pre;">PH.NO      : </span>
      <span>${customer?.Mobile_No || customer?.Land_Line || "—"}</span>
    </div>
    <div style="font-weight:800;margin-bottom:2px;display:flex;align-items:flex-start;">
      <span style="min-width:13ch;white-space:pre;">TRANSPORT  : </span>
      <span>${customer?.Transporter || "—"}</span>
    </div>
    <div style="font-weight:800;display:flex;align-items:flex-start;">
      <span style="min-width:13ch;white-space:pre;">BROKER     : </span>
      <span>${customer?.Broker || "—"}</span>
    </div>
  </div>

  <div style="border:0.5px solid #000;">
    <table>
      <thead>
        <tr>
          <th style="border:0.5px solid #000;padding:0.5mm;text-align:center;font-size:14px;font-weight:1000;background:#f5f5f5;width:25mm;">RATE</th>
          <th style="border:0.5px solid #000;padding:0.5mm;text-align:center;font-size:14px;font-weight:800;background:#f5f5f5;width:45mm;">ITEM NAME</th>
          <th style="border:0.5px solid #000;padding:0.5mm;text-align:center;font-size:14px;font-weight:800;background:#f5f5f5;width:10mm;">BAGS</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="background:#f0f0f0;border-top:1px solid #000;padding:1mm;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:bold;">
      <span>&#8377;${rupee(totals?.subtotal)}</span>
      <span>${totalKgs.toFixed(2)} KGS</span>
      <span>${Math.round(totalBags)} BAGS</span>
    </div>
  </div>

  <script>
    window.onload = function () {
      window.print();
      window.addEventListener('afterprint', function () { window.close(); });
    };
  </script>
</body>
</html>`;
};


const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));


const mobilePrint = (customer, cartItems, totals, storage, createdOn, orderDate) => {
  const html = buildPrintHtml(customer, cartItems, totals, storage, createdOn, orderDate);
  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) {
    
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
};

// ─────────────────────────────────────────────────────────────────────────────
// CategoryCard
// ─────────────────────────────────────────────────────────────────────────────

const CategoryCard = ({ category, isSelected, onClick, isMobile, isReduced }) => {
  const imageUrl = getCategoryImage(category.name);
  const cardSize = isReduced ? "80px" : "120px";
  const fontSize = isReduced ? "11px" : (isMobile ? "18px" : "15px");
  const checkmarkSize = isReduced ? "20px" : "32px";
  const checkmarkFontSize = isReduced ? "12px" : "18px";
  const checkmarkTop = isReduced ? "4px" : "12px";
  const checkmarkRight = isReduced ? "4px" : "12px";

  return (
    <div
      onClick={onClick}
      style={{
        width: cardSize, height: cardSize, borderRadius: "5px",
        overflow: "hidden", position: "relative", margin: 0, padding: 0,
        cursor: "pointer", flex: "0 0 auto",
        boxShadow: isSelected
          ? `0 0 0 3px ${BROWN_DARK}, 0 8px 20px rgba(0,0,0,0.2)`
          : "0 4px 12px rgba(0,0,0,0.1)",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
    >
      <img src={imageUrl} alt={category.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          color: "#fff", fontSize, fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          textAlign: "center", padding: "0 8px", letterSpacing: "1px",
        }}>
          {category.name}
        </span>
      </div>
      {isSelected && (
        <div style={{
          position: "absolute", top: checkmarkTop, right: checkmarkRight,
          width: checkmarkSize, height: checkmarkSize, borderRadius: "50%",
          background: BROWN_DARK, display: "flex", alignItems: "center",
          justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          <span style={{ color: "#fff", fontSize: checkmarkFontSize }}>✓</span>
        </div>
      )}
    </div>
  );
};


const LoginPopup = ({ isOpen, onClose, onLoginSuccess,initialUsername = "" }) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
 
  useEffect(() => {
    if (isOpen) {  setStep(initialUsername ? 2 : 1); ; setUsername(initialUsername); setPassword(""); }
  }, [isOpen,initialUsername]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { toast.error("Please enter your username"); return; }
    setIsLoading(true);
    try {
      const data = await fetchLink({
        address: `authorization/getUserTypeAuth`,
        method: "POST",
        bodyData: { username: username.trim() },
      });
      if (!data.success) { toast.error(data.message || "User not found"); return; }
      if (data.requirePassword) {
        setStep(2);
      } else {
        const customer = data.customer || {};
        const usename = customer.A1;
        // localStorage.setItem("user", JSON.stringify({ ...customer, Name: usename }));
          localStorage.setItem("user", JSON.stringify({ 
    ...customer, 
    Name: usename,
    Ret_Id: customer.Ret_Id,  
    UserId: customer.Ret_Id 
  }));
        localStorage.setItem("session", JSON.stringify({ 
    username: username.trim(), 
    ...data,
    retId: customer.Ret_Id,  
    userId: customer.Ret_Id   
  }));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("username", username);
        localStorage.setItem("userType", "customer");
        localStorage.setItem("retId", customer.Ret_Id || "");
        toast.success("Login successful!");
        setUsername(""); setPassword(""); setStep(1);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Username check error:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { toast.error("Please enter your password"); return; }
    setIsLoading(true);
    try {
      const passHash = await encryptPasswordFun(password);
      const data = await fetchLink({
        address: `authorization/login`,
        method: "POST",
        bodyData: { username: username.trim(), password: passHash, APP_Type: 2 },
      });
      if (data.success) {
        const { user, sessionInfo } = data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("session", JSON.stringify(sessionInfo));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("userType", "employee");
        localStorage.removeItem("retId");
        toast.success("Login successful!");
        setUsername(""); setPassword(""); setStep(1);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
        maxWidth: "400px", width: "90%",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)", position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "12px", right: "12px",
            background: "transparent", border: "none",
            fontSize: "20px", cursor: "pointer", color: "#999",
            padding: "4px 8px", borderRadius: "50%",
          }}
          onMouseEnter={(e) => { e.target.style.background = "#f0f0f0"; e.target.style.color = "#666"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#999"; }}
        >✕</button>

        <div style={{ background: "#f9f4ef", borderRadius: "12px", padding: "20px" }}>
          <div style={{
            fontSize: "18px", fontWeight: "600", color: BROWN,
            marginBottom: "16px", paddingBottom: "8px",
            borderBottom: `2px solid ${ACCENT}`,
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {step === 2 && (
              <button
                onClick={() => { setStep(1); setPassword(""); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: BROWN, fontSize: "18px", padding: 0 }}
              >←</button>
            )}
            <span>
              {step === 1
                ? <><span style={{ color: BROWN_DARK }}>Sign</span> In</>
                : <><span style={{ color: BROWN_DARK }}>Enter</span> Password</>}
            </span>
          </div>

          {step === 1 && (
            <form onSubmit={handleUsernameSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Username</div>
                <input
                  type="text" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required autoFocus
                  style={{
                    width: "100%", padding: "12px", border: "1px solid #ddd",
                    borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
              <button
                type="submit" disabled={isLoading}
                style={{
                  width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff",
                  border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => !isLoading && (e.target.style.background = BROWN)}
                onMouseLeave={(e) => !isLoading && (e.target.style.background = BROWN_DARK)}
              >
                {isLoading
                  ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <CircularProgress size={20} style={{ color: "#fff" }} /><span>Checking...</span>
                    </div>
                  : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Username</div>
                <div style={{
                  padding: "12px", background: "#e8e0d8", borderRadius: "8px",
                  fontSize: "14px", color: BROWN_DARK, fontWeight: "500",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <span>👤</span><span>{username}</span>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Password</div>
                <input
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required autoFocus
                  style={{
                    width: "100%", padding: "12px", border: "1px solid #ddd",
                    borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
              <button
                type="submit" disabled={isLoading}
                style={{
                  width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff",
                  border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => !isLoading && (e.target.style.background = BROWN)}
                onMouseLeave={(e) => !isLoading && (e.target.style.background = BROWN_DARK)}
              >
                {isLoading
                  ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <CircularProgress size={20} style={{ color: "#fff" }} /><span>Signing In...</span>
                    </div>
                  : "Sign In"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: "#999" }}>
            <p>Enter your credentials to place order</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({ product, quantity, onUpdateQty, isMobile }) {
  const outOfStock = product.stock <= 0;
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  // Sync local state with prop when quantity changes externally
  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const handleIncrease = () => {
    onUpdateQty(product.id, 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onUpdateQty(product.id, -1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setLocalQuantity(value === '' ? '' : parseInt(value, 10));
    }
  };

  const handleQuantityBlur = () => {
    setIsEditing(false);
    let newQty = localQuantity;
    
    // If empty or invalid, set to 0
    if (newQty === '' || isNaN(newQty) || newQty < 0) {
      newQty = 0;
    }
    
    // Only update if different from current
    if (newQty !== quantity) {
      // Calculate delta and apply
      const delta = newQty - quantity;
      if (delta !== 0) {
        onUpdateQty(product.id, delta);
      }
    }
    setLocalQuantity(quantity);
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
    if (e.key === 'Escape') {
      setLocalQuantity(quantity);
      setIsEditing(false);
      e.target.blur();
    }
  };

  const handleQuantityClick = () => {
    setIsEditing(true);
   
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
  };

  if (isMobile) {
    return (
      <div style={{
        display: "flex", background: "#fff", borderRadius: "12px",
        width: "100%", minHeight: "110px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e8ddd4", overflow: "hidden",
      }}>
        <div style={{ flex: 1, padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#6b5454", lineHeight: 1.3 }}>
            {product.name}
          </p>
          {product.shortName && (
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888", lineHeight: 1.2 }}>{product.shortName}</p>
          )}
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: outOfStock ? "#e74c3c" : "#555", fontWeight: outOfStock ? "600" : "normal" }}>
            {outOfStock ? "⚠ Out of Stock" : `Stock: ${product.stock.toFixed(1)} Bags`}
            {!outOfStock && product.balQty > 0 && (
              <span style={{ color: "#999", marginLeft: "4px" }}>({product.balQty} kg)</span>
            )}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "17px", fontWeight: "700", color: "#3a1f0e" }}>₹{product.price}</span>
            {/* {outOfStock ? (
              <span style={{ fontSize: "11px", color: "#fff", background: "#b0a0a0", borderRadius: "10px", padding: "3px 8px" }}>Out of Stock</span>
            ) : ( */}
              <div style={{ display: "flex", alignItems: "center", background: "#6b5454", borderRadius: "20px", padding: "3px 8px", gap: "4px" }}>
                <button
                  onClick={handleDecrease}
                  disabled={quantity === 0}
                  style={{
                    background: "transparent", border: "none", color: "#fff", fontWeight: "bold",
                    fontSize: "16px", cursor: quantity === 0 ? "not-allowed" : "pointer",
                    width: "24px", height: "24px", display: "flex", alignItems: "center",
                    justifyContent: "center", borderRadius: "50%", opacity: quantity === 0 ? 0.4 : 1,
                    lineHeight: 1, padding: 0, flexShrink: 0,
                  }}
                >−</button>
                
                {/* Editable quantity input */}
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={localQuantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    onKeyDown={handleQuantityKeyDown}
                    style={{
                      width: "30px",
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "2px 0",
                      outline: "2px solid #fff",
                      minWidth: "20px",
                    }}
                    autoFocus
                  />
                ) : (
                  <span 
                    onClick={handleQuantityClick}
                    style={{ 
                      color: "#fff", 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      minWidth: "20px", 
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                    title="Click to edit quantity"
                  >
                    {quantity}
                  </span>
                )}
                
                <button
                  onClick={handleIncrease}
                  style={{
                    background: "transparent", border: "none", color: "#fff", fontWeight: "bold",
                    fontSize: "16px", cursor: "pointer", width: "24px", height: "24px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", lineHeight: 1, padding: 0, flexShrink: 0,
                  }}
                >+</button>
              </div>
            {/* )} */}
          </div>
        </div>
        <div style={{ width: "110px", minWidth: "110px", overflow: "hidden", background: "#f5f0eb" }}>
          <img
            alt={product.name}
            src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=110&h=110&fit=crop"}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=110&h=110&fit=crop"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="product-card bg-white relative rounded-[15px] w-[400px] h-[150px] shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[-12px_10px_8px_-3px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-[4px]">
      <div className="overflow-clip relative rounded-[inherit] size-full" style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "12px 0 12px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[16px] whitespace-nowrap m-0">{product.shortName}</p>
          <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[13px] whitespace-nowrap m-0">{product.name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="bg-[#6b5454] h-[30px] overflow-clip px-3 flex items-center justify-center rounded">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[20px] text-white m-0">₹{product.price}</p>
            </div>
            {/* {outOfStock ? (
              <div className="bg-[#6b5454] h-[26px] rounded-[15px] px-3 opacity-50 flex items-center justify-center">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-white m-0">Out of Stock</p>
              </div>
            ) : ( */}
              <div className="bg-[#6b5454] h-[30px] flex items-center justify-between px-3 gap-1 rounded">
                <button 
                  onClick={handleDecrease} 
                  className="text-white font-bold text-base hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center" 
                  disabled={quantity === 0}
                  style={{ opacity: quantity === 0 ? 0.4 : 1, cursor: quantity === 0 ? 'not-allowed' : 'pointer' }}
                >−</button>
                
                {/* Editable quantity input - Desktop */}
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={localQuantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    onKeyDown={handleQuantityKeyDown}
                    style={{
                      width: "30px",
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "2px 0",
                      outline: "2px solid #fff",
                      minWidth: "20px",
                    }}
                    autoFocus
                  />
                ) : (
                  <span 
                    onClick={handleQuantityClick}
                    style={{ 
                      color: "#fff", 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      minWidth: "16px", 
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                    title="Click to edit quantity"
                  >
                    {quantity}
                  </span>
                )}
                
                <button 
                  onClick={handleIncrease} 
                  className="text-white font-bold text-base hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
                >+</button>
              </div>
            {/* )} */}
          </div>
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap m-0 ${outOfStock ? "text-red-500" : "text-[#403f3d]"}`}>
            Stock: {outOfStock ? "Out of Stock" : `${product.stock.toFixed(1)} Bags`}
            {!outOfStock && product.balQty > 0 && (
              <span className="text-[#666] ml-1 text-[9px]">({product.balQty} kg)</span>
            )}
          </p>
        </div>
        <div style={{ width: "130px", height: "100%", position: "relative", overflow: "hidden", borderTopRightRadius: "15px", borderBottomRightRadius: "15px" }}>
          <img
            alt={product.name}
            className="w-full h-full object-cover"
            src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=130&h=170&fit=crop"}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31e?w=130&h=170&fit=crop"; }}
          />
          <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 10 }}>
            <div className="bg-white border border-[#6b5454] border-solid rounded-[50px] size-[24px] cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center">
              <ShoppingCartIcon style={{ fontSize: "12px", color: "#6b5454" }} />
            </div>
            {quantity > 0 && (
              <span className="absolute bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ top: "-4px", right: "-4px" }}>
                {quantity}
              </span>
            )}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b5454] border-solid inset-[-1px] pointer-events-none rounded-[16px] shadow-[-12px_10px_8px_-3px_rgba(0,0,0,0.15)]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MobileOrderSummary
// ─────────────────────────────────────────────────────────────────────────────

function MobileOrderSummary({ selectedCount, totalAmount, onGoToCart, footerOffset = 0 }) {
  if (selectedCount === 0) return null;
  return (
    <div className="cart-summary" style={{
  // position: "sticky",  
  // bottom: 0,         
  // right: 0, 
  // left: 0,
  // backgroundColor: "white", 
  // boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
  padding: "12px 16px", 
  zIndex: 1000,
  borderTopLeftRadius: "16px", 
  borderTopRightRadius: "16px",
  // borderTop: `2px solid ${BROWN_DARK}`,
  marginTop: "auto",   // Push to bottom of flex container
}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div />
        <button
          onClick={onGoToCart}
          className="cart-summary-button"
          style={{
            backgroundColor: BROWN_DARK, color: "white", border: "none",
            borderRadius: "25px", padding: "12px 24px", fontSize: "16px",
            fontWeight: "bold", cursor: "pointer", display: "flex",
            alignItems: "center", gap: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <ShoppingCartIcon style={{ fontSize: "18px" }} />
          Go to Cart
          <span style={{
            backgroundColor: "#e74c3c", borderRadius: "50%",
            width: "20px", height: "20px", fontSize: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "4px",
          }}>{selectedCount}</span>
        </button>
      </div>
    </div>
  );
}


function MobileTabBar({ activeTab, onHome, onDashboard, onCart, cartCount }) {
  const tabs = [
    { key: "home", label: "Home", icon: "🏠", onClick: onHome },
    { key: "dashboard", label: "Dashboard", icon: "📊", onClick: onDashboard },
    { key: "cart", label: "Cart", icon: "🛒", onClick: onCart },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      backgroundColor: "#fff", borderTop: "1px solid #e8ddd4",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
      zIndex: 1100, boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={tab.onClick}
            style={{
              flex: 1, background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              padding: "4px 0", position: "relative",
            }}
          >
            <span style={{ fontSize: "20px", position: "relative" }}>
              {tab.icon}
              {tab.key === "cart" && cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "-6px", right: "-10px",
                  background: "#e74c3c", color: "#fff", borderRadius: "50%",
                  width: "16px", height: "16px", fontSize: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold",
                }}>{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </span>
            <span style={{
              fontSize: "11px",
              fontWeight: isActive ? "700" : "500",
              color: isActive ? BROWN_DARK : "#999",
            }}>{tab.label}</span>
            <span style={{
              position: "absolute", bottom: "-8px", width: "24px", height: "3px",
              borderRadius: "2px", background: isActive ? BROWN_DARK : "transparent",
            }} />
          </button>
        );
      })}
    </div>
  );
}

function ThreeDotMenu({ isLoggedIn, userName, onLogout, onLoginClick, onSaleOrders,onDashboard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: "6px", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", borderRadius: "50%", flexShrink: 0,
          minWidth: "36px", minHeight: "36px",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <MoreVertIcon style={{ fontSize: isMobile ? "22px" : "24px" }} />
      </button>

     {isOpen && (
  <div style={{
    position: "absolute", top: "100%", right: 0, marginTop: "8px",
    backgroundColor: "#fff", borderRadius: isMobile ? "16px" : "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)", minWidth: "300px",
    zIndex: 1000, overflow: "hidden",
  }}>
    {isLoggedIn ? (
      <>
        <div style={{
          padding: isMobile ? "20px 16px" : "24px 20px",
          background: "linear-gradient(135deg, #4a2c1a 0%, #3a1f0e 100%)",
          borderBottom: `1px solid ${ACCENT}`,
        }}>
          <div style={{
            width: isMobile ? "48px" : "60px", height: isMobile ? "48px" : "60px",
            borderRadius: "50%", background: "#c8a96e",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: isMobile ? "12px" : "16px",
          }}>
            <span style={{ color: "#4a2c1a", fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>
              {userName?.charAt(0) || ""}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? "18px" : "20px", color: "#fff" }}>{userName || ""}</div>
        </div>
        <div style={{ padding: isMobile ? "8px" : "12px" }}>
          {/* Sale Orders - Show for both employee and customer */}
          {(localStorage.getItem("userType") === "employee" || localStorage.getItem("userType") === "customer") && (
            <button
              onClick={() => { onSaleOrders(); setIsOpen(false); }}
              style={{
                width: "100%", padding: isMobile ? "14px 16px" : "16px 20px",
                background: "transparent", border: "none", textAlign: "left",
                fontSize: isMobile ? "15px" : "16px", color: BROWN,
                cursor: "pointer", display: "flex", alignItems: "center",
                gap: "12px", borderRadius: isMobile ? "8px" : "12px",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f5f0eb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: isMobile ? "18px" : "20px" }}>📋</span>
              <span>Sale Orders</span>
            </button>
          )}

          {/* Dashboard - Show if onDashboard prop exists and user is logged in */}
          {onDashboard && (
            <button
              onClick={() => { onDashboard(); setIsOpen(false); }}
              style={{
                width: "100%", padding: isMobile ? "14px 16px" : "16px 20px",
                background: "transparent", border: "none", textAlign: "left",
                fontSize: isMobile ? "15px" : "16px", color: BROWN,
                cursor: "pointer", display: "flex", alignItems: "center",
                gap: "12px", borderRadius: isMobile ? "8px" : "12px",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f5f0eb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: isMobile ? "18px" : "20px" }}>📊</span>
              <span>Dashboard</span>
            </button>
          )}

          {/* Logout - Show for all logged-in users */}
          <button
            onClick={() => { onLogout(); setIsOpen(false); }}
            style={{
              width: "100%", padding: isMobile ? "14px 16px" : "16px 20px",
              background: "transparent", border: "none", textAlign: "left",
              fontSize: isMobile ? "15px" : "16px", color: "#d32f2f",
              cursor: "pointer", display: "flex", alignItems: "center",
              gap: "12px", borderRadius: isMobile ? "8px" : "12px", marginTop: "4px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: isMobile ? "18px" : "20px" }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </>
    ) : (
      <>
        <div style={{ padding: isMobile ? "20px 16px" : "24px 20px", background: "#f9f4ef", textAlign: "center" }}>
          <div style={{
            width: isMobile ? "48px" : "60px", height: isMobile ? "48px" : "60px",
            borderRadius: "50%", background: "#e0d5cc",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          }}>
            <span style={{ color: BROWN, fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>?</span>
          </div>
          <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "600", color: BROWN, marginBottom: "4px" }}>Not Signed In</div>
          <div style={{ fontSize: isMobile ? "13px" : "15px", color: "#666" }}>Sign in to place orders</div>
        </div>
        <div style={{ padding: isMobile ? "12px" : "20px" }}>
          <button
            onClick={() => { onLoginClick(); setIsOpen(false); }}
            style={{
              width: "100%", padding: isMobile ? "14px 16px" : "16px 24px",
              background: BROWN, border: "none", borderRadius: isMobile ? "8px" : "12px",
              fontSize: isMobile ? "15px" : "18px", fontWeight: "600", color: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "12px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
            onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
          >
            <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🔑</span>
            <span>Sign In</span>
          </button>
        </div>
      </>
    )}
  </div>
)}
    </div>
  );
}


const INITIAL_CUSTOMER_LOAD = 10;
const LOAD_MORE_CUSTOMERS = 15;
function CustomerSelector({ isLoggedIn, userType, customers, selectedCustomer, onSelectCustomer, loading, isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayCount, setDisplayCount] = useState(15);
  const [allFilteredResults, setAllFilteredResults] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);
  const isSelectingRef = useRef(false);
  const listContainerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);
  
  const INITIAL_LOAD = 15;
  const LOAD_MORE_COUNT = 20;
  const BATCH_SIZE = 30;

  // Pre-compute first batch of customers for instant display
  const initialCustomers = useMemo(() => {
    return customers.slice(0, INITIAL_LOAD);
  }, [customers, INITIAL_LOAD]);

  // Pre-compute normalized strings for faster search
  const customerSearchCache = useMemo(() => {
    if (!customers || customers.length === 0) return new Map();
    
    const cacheLimit = Math.min(customers.length, 300);
    const map = new Map();
    
    for (let i = 0; i < cacheLimit; i++) {
      const c = customers[i];
      const fields = [];
      if (c.name) fields.push(String(c.name));
      if (c.billName) fields.push(String(c.billName));
      if (c.mobile) fields.push(String(c.mobile));
      if (c.city) fields.push(String(c.city));
      if (c.id) fields.push(String(c.id));
      if (c.address) fields.push(String(c.address));
      if (c.brokerName) fields.push(String(c.brokerName));
      if (c.transporterName) fields.push(String(c.transporterName));
      
      const normalized = fields.map(f => 
        f.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      
      map.set(c.id, { customer: c, normalized });
    }
    return map;
  }, [customers]);



  
  const getCustomerData = useCallback((customer) => {
    const cached = customerSearchCache.get(customer.id);
    if (cached) return cached;
    
    const fields = [];
    if (customer.name) fields.push(String(customer.name));
    if (customer.billName) fields.push(String(customer.billName));
    if (customer.mobile) fields.push(String(customer.mobile));
    if (customer.city) fields.push(String(customer.city));
    if (customer.id) fields.push(String(customer.id));
    if (customer.address) fields.push(String(customer.address));
    if (customer.brokerName) fields.push(String(customer.brokerName));
    if (customer.transporterName) fields.push(String(customer.transporterName));
    
    const normalized = fields.map(f => 
      f.toString().toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    
    return { customer, normalized };
  }, [customerSearchCache]);

  const performSearch = useCallback((searchTerm) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (!searchTerm.trim()) {
        setDisplayedCustomers(initialCustomers);
        setAllFilteredResults(customers);
        setHasSearched(false);
        setDisplayCount(INITIAL_LOAD);
        return;
      }
      
      const normalizedSearch = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!normalizedSearch || normalizedSearch.length < 2) {
        setDisplayedCustomers(initialCustomers);
        setAllFilteredResults(customers);
        setHasSearched(false);
        setDisplayCount(INITIAL_LOAD);
        return;
      }
      
      const searchInChunks = () => {
        const results = [];
        const totalCustomers = customers.length;
        const chunkSize = BATCH_SIZE;
        let currentIndex = 0;
        
        const processChunk = () => {
          const endIndex = Math.min(currentIndex + chunkSize, totalCustomers);
          
          for (let i = currentIndex; i < endIndex; i++) {
            const customer = customers[i];
            const data = getCustomerData(customer);
            let matched = false;
            
            for (let j = 0; j < data.normalized.length; j++) {
              if (data.normalized[j].includes(normalizedSearch)) {
                matched = true;
                break;
              }
            }
            
            if (matched) {
              results.push(customer);
            }
          }
          
          currentIndex = endIndex;
          
          if (currentIndex < totalCustomers) {
            if (window.requestIdleCallback) {
              requestIdleCallback(processChunk, { timeout: 100 });
            } else {
              setTimeout(processChunk, 50);
            }
          } else {
            setAllFilteredResults(results);
            setHasSearched(true);
            const initialResults = results.slice(0, INITIAL_LOAD);
            setDisplayCount(Math.min(INITIAL_LOAD, results.length));
            setDisplayedCustomers(initialResults);
          }
        };
        
        if (window.requestIdleCallback) {
          requestIdleCallback(processChunk, { timeout: 50 });
        } else {
          setTimeout(processChunk, 50);
        }
      };
      
      searchInChunks();
    }, 300);
  }, [customers, getCustomerData, initialCustomers, INITIAL_LOAD]);

  const handleListScroll = useCallback((e) => {
    if (isLoadingMore) return;
    
    const container = e.currentTarget;
    const threshold = isMobile ? 200 : 150;
    const isNearBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    
    if (isNearBottom) {
      const totalResults = hasSearched ? allFilteredResults.length : customers.length;
      if (displayedCustomers.length < totalResults) {
        setIsLoadingMore(true);
        
        requestAnimationFrame(() => {
          const nextCount = Math.min(displayCount + LOAD_MORE_COUNT, totalResults);
          setDisplayCount(nextCount);
          
          const source = hasSearched ? allFilteredResults : customers;
          setDisplayedCustomers(source.slice(0, nextCount));
          
          setIsLoadingMore(false);
        });
      }
    }
  }, [isLoadingMore, hasSearched, allFilteredResults, customers, displayedCustomers, displayCount, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSelectingRef.current) return;
      if (buttonRef.current && buttonRef.current.contains(e.target)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !isMobile) return;
    
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (!isSelectingRef.current && !isInitializing) {
          handleClose();
        }
      }, 300);
    };
    
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      clearTimeout(scrollTimer);
    };
  }, [isOpen, isMobile, isInitializing]);

  useEffect(() => {
    if (isOpen && searchInputRef.current && isMobile) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    }
  }, [isOpen, isMobile]);

  if (!isLoggedIn || !customers || customers.length === 0) return null;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen) {
      // Set initial customers IMMEDIATELY before opening
      setDisplayedCustomers(initialCustomers);
      setAllFilteredResults(customers);
      setSearch("");
      setDisplayCount(INITIAL_LOAD);
      setHasSearched(false);
      setIsInitializing(false);
      
      // Open the dropdown
      setIsOpen(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
    setDisplayedCustomers([]);
    setHasSearched(false);
    setDisplayCount(INITIAL_LOAD);
    setIsInitializing(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    performSearch(value);
  };

  const handleCustomerSelect = (customer) => {
    isSelectingRef.current = true;
    if (onSelectCustomer) onSelectCustomer(customer);
    handleClose();
    setTimeout(() => { 
      isSelectingRef.current = false; 
    }, 200);
  };

  // Mobile dropdown - Full screen with proper styling
  const mobileDropdownStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  };

  const desktopDropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    width: "360px",
    maxHeight: "400px",
    overflowY: "auto",
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 9999,
  };

  const dropdownStyle = isMobile ? mobileDropdownStyle : desktopDropdownStyle;

  return (
    <div style={{ 
      position: "relative", 
      width: isMobile ? "100%" : "auto",
      maxWidth: isMobile ? "100%" : "320px",
    }} ref={dropdownRef}>
      {/* Dropdown Button */}
      <div
        ref={buttonRef} 
        onClick={handleToggle}
        style={{
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          padding: isMobile ? "8px 12px" : "8px 14px",
          background: "#f5ede3", 
          border: `1.5px solid ${isOpen ? BROWN : ACCENT}`,
          borderRadius: "25px", 
          cursor: "pointer", 
          transition: "all 0.2s",
          width: "100%",
          boxSizing: "border-box",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span style={{ fontSize: isMobile ? "14px" : "16px", flexShrink: 0 }}>🏪</span>
        <span style={{
          fontSize: isMobile ? "12px" : "14px", 
          fontWeight: "500",
          color: selectedCustomer ? BROWN_DARK : "#666",
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          whiteSpace: "nowrap", 
          flex: 1,
          minWidth: 0,
        }}>
          {selectedCustomer ? selectedCustomer.name : "Select outlet..."}
        </span>
        {selectedCustomer && selectedCustomer.mobile && !isMobile && (
          <span style={{ fontSize: "10px", color: "#888", marginLeft: "2px", flexShrink: 0 }}>
            📱{selectedCustomer.mobile}
          </span>
        )}
        <span style={{
          fontSize: "10px", 
          color: BROWN_LIGHT, 
          flexShrink: 0,
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
          transition: "transform 0.2s",
        }}>▼</span>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div style={dropdownStyle}>
          {/* Mobile Header */}
          {isMobile && (
            <div style={{
              padding: "14px 16px",
              background: BROWN_DARK,
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              borderBottom: `1px solid ${ACCENT}`,
              width: "100%",
              boxSizing: "border-box",
            }}>
              <span style={{ fontSize: "17px", fontWeight: "bold" }}>Select Customer</span>
              <button
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "22px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  WebkitTapHighlightColor: "transparent",
                }}
              >✕</button>
            </div>
          )}

          {/* Search Bar - Fixed width issues */}
          <div style={{
            padding: isMobile ? "10px 16px" : "12px",
            borderBottom: "1px solid #f0f0f0",
            background: "#f9f9f9",
            flexShrink: 0,
            width: "100%",
            boxSizing: "border-box",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              boxSizing: "border-box",
            }}>
              <div style={{
                flex: 1,
                minWidth: 0,
                position: "relative",
              }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isMobile ? "Search customers..." : "Search by name, mobile, city..."}
                  value={search}
                  onChange={handleSearchChange}
                  autoComplete="off"
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 14px" : "10px 12px",
                    paddingLeft: isMobile ? "36px" : "12px",
                    border: `1px solid ${ACCENT}`,
                    borderRadius: "8px",
                    fontSize: isMobile ? "15px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    color: BROWN_DARK,
                    WebkitAppearance: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = ACCENT}
                />
                {/* Search Icon inside input */}
                {isMobile && (
                  <SearchIcon style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "#999",
                    pointerEvents: "none",
                  }} />
                )}
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {hasSearched && search.trim() && (
            <div style={{
              padding: "6px 16px",
              fontSize: "11px",
              color: allFilteredResults.length > 0 ? "#4caf50" : "#e74c3c",
              background: "#fafafa",
              borderBottom: "1px solid #f0f0f0",
              flexShrink: 0,
              width: "100%",
              boxSizing: "border-box",
            }}>
              {allFilteredResults.length} result{allFilteredResults.length !== 1 ? "s" : ""} found
            </div>
          )}

          {/* Customer List - Fixed alignment */}
          <div
            ref={listContainerRef}
            onScroll={handleListScroll}
            style={{
              flex: 1,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              minHeight: "200px",
              width: "100%",
              boxSizing: "border-box",
              padding: isMobile ? "0" : "4px 0",
            }}
          >
            {loading || isInitializing ? (
              <div style={{
                padding: "40px",
                textAlign: "center",
                color: "#999",
                width: "100%",
                boxSizing: "border-box",
              }}>
                <CircularProgress size={24} style={{ color: BROWN }} />
                <div style={{ marginTop: "10px", fontSize: "13px" }}>Loading...</div>
              </div>
            ) : displayedCustomers.length === 0 ? (
              <div style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "#999",
                fontSize: "13px",
                width: "100%",
                boxSizing: "border-box",
              }}>
                {hasSearched && search.trim() ? "No matching customers" : "No customers available"}
              </div>
            ) : (
              <>
                {displayedCustomers.map((customer) => {
                  const isSelected = selectedCustomer?.id === customer.id;
                  
                  return (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      style={{
                        padding: isMobile ? "14px 16px" : "12px 16px",
                        borderBottom: "1px solid #f5f0eb",
                        cursor: "pointer",
                        background: isSelected ? "#f0e9e2" : "transparent",
                        transition: "background 0.1s",
                        width: "100%",
                        boxSizing: "border-box",
                        textAlign: "left",
                      }}
                      onTouchStart={() => {
                        if (!isSelected) {
                          const el = document.getElementById(`customer-${customer.id}`);
                          if (el) {
                            el.style.background = "#faf6f2";
                            setTimeout(() => {
                              el.style.background = isSelected ? "#f0e9e2" : "transparent";
                            }, 150);
                          }
                        }
                      }}
                      id={`customer-${customer.id}`}
                    >
                      <div style={{
                        fontSize: isMobile ? "15px" : "14px",
                        fontWeight: isSelected ? "700" : "500",
                        color: BROWN_DARK,
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        textAlign: "left",
                      }}>
                        {isSelected && (
                          <span style={{ color: "#4caf50", fontSize: "14px" }}>✓</span>
                        )}
                        <span style={{ wordBreak: "break-word" }}>{customer.name}</span>
                        {customer.partyMailingName && customer.partyMailingName !== customer.name && (
                          <span style={{ fontSize: "11px", color: "#888", fontWeight: "normal" }}>
                            ({customer.partyMailingName})
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: isMobile ? "12px" : "11px",
                        color: "#666",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "8px",
                        textAlign: "left",
                      }}>
                        {customer.mobile && (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            background: "#f0e9e2",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: isMobile ? "11px" : "10px",
                            color: BROWN_DARK,
                          }}>📱 {customer.mobile}</span>
                        )}
                        {customer.city && (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: isMobile ? "11px" : "10px",
                            color: "#888",
                          }}>📍 {customer.city}</span>
                        )}
                      </div>
                      {(!isMobile || (customer.brokerName || customer.transporterName)) && (
                        <div style={{
                          fontSize: "10px",
                          color: "#aaa",
                          marginTop: "3px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          textAlign: "left",
                        }}>
                          {customer.brokerName && customer.brokerName !== "0" && <span>🏢 {customer.brokerName}</span>}
                          {customer.transporterName && customer.transporterName !== "0" && <span>🚚 {customer.transporterName}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Load More */}
                {!loading && !isInitializing && displayedCustomers.length > 0 &&
                 displayedCustomers.length < (hasSearched ? allFilteredResults.length : customers.length) && (
                  <div style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    borderTop: "1px solid #f0f0f0",
                    background: "#f9f9f9",
                    width: "100%",
                    boxSizing: "border-box",
                  }}>
                    {isLoadingMore ? (
                      <CircularProgress size={16} style={{ color: BROWN }} />
                    ) : (
                      <button
                        onClick={() => {
                          const totalResults = hasSearched ? allFilteredResults.length : customers.length;
                          const nextCount = Math.min(displayCount + LOAD_MORE_COUNT, totalResults);
                          setDisplayCount(nextCount);
                          const source = hasSearched ? allFilteredResults : customers;
                          setDisplayedCustomers(source.slice(0, nextCount));
                        }}
                        style={{
                          background: "transparent",
                          border: `1px solid ${BROWN_LIGHT}`,
                          borderRadius: "8px",
                          padding: "8px 16px",
                          color: BROWN_DARK,
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: "500",
                          width: "100%",
                          maxWidth: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        Load More ({displayedCustomers.length} / {hasSearched ? allFilteredResults.length : customers.length})
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


const QuotationPrint = forwardRef(({ customer, cartItems, totals, storage,createdOn, orderDate,expenses }, ref) => {
  
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const rupee = (n) =>
    safeNum(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalKgs = cartItems?.length
    ? cartItems.reduce((sum, item) => sum + safeNum(item.kgs), 0) : 0;


       const expenseRows = (Array.isArray(expenses) ? expenses : []).filter(
      (e) => e && (e.Account_Name || e.Expence_Name) && Number(e.Expence_Value) !== 0
    );



  const totalBags = cartItems?.length
    ? cartItems.reduce((sum, item) => {
        const displayName = item.shortName || item.Print_Name || "";
        const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
        return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
      }, 0) : 0;


       const formatCreatedDate = () => {
  
    let dateToUse = createdOn || orderDate;
    
    if (dateToUse) {
      try {
        let dateObj;
        

        if (typeof dateToUse === 'string') {
          
          if (dateToUse.includes(' ') && dateToUse.includes('-')) {
            const [datePart, timePart] = dateToUse.split(' ');
            const [year, month, day] = datePart.split('-');
            
            if (timePart) {
              const [hours, minutes] = timePart.split(':');
              
              dateObj = new Date(year, parseInt(month) - 1, day, parseInt(hours), parseInt(minutes));
            } else {
              dateObj = new Date(year, parseInt(month) - 1, day);
            }
          } 
     
          else if (dateToUse.includes('T')) {
            dateObj = new Date(dateToUse);
          }
     
          else {
            dateObj = new Date(dateToUse);
          }
      
          if (!isNaN(dateObj.getTime())) {
          
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            let hours = dateObj.getHours();
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            
            return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
          }
        }
        // If dateToUse is already a Date object
        else if (dateToUse instanceof Date && !isNaN(dateToUse.getTime())) {
          const day = String(dateToUse.getDate()).padStart(2, '0');
          const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
          const year = dateToUse.getFullYear();
          let hours = dateToUse.getHours();
          const minutes = String(dateToUse.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          
          return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
        }
      } catch (e) {
        console.warn("Error parsing date:", e);
      }
    }
    
    // Fallback to current IST time
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    let hours = istDate.getUTCHours();
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };
  
  // Also format the order date separately if needed
  const formatOrderDate = () => {
    if (orderDate) {
      try {
        let dateObj = new Date(orderDate);
        if (!isNaN(dateObj.getTime())) {
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          return `${day}/${month}/${year}`;
        }
      } catch (e) {}
    }
    return formatCreatedDate().split(' ')[0]; 
  };

  
  return (
    <>
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 0mm; }
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section {
            position: absolute; left: 0; top: 0; width: 80mm; margin: 0; padding: 2mm;
          }
          .print-container { width: 80mm !important; margin: 0 auto !important; }
          table { width: 100% !important; page-break-inside: avoid; }
          tr, td, th { page-break-inside: avoid; }
        }
      `}</style>
      <div
        id="print-section"
        ref={ref}
        className="print-container"
        style={{
          width: "80mm", fontFamily: "'Courier New', Courier, monospace",
          fontSize: "14px", padding: "2mm", lineHeight: 1.4,
          color: "#000", fontWeight: 900, backgroundColor: "#fff",
        }}
      >
        <div style={{ marginBottom: "2mm", fontSize: "14px", fontWeight: 1000 }}>
        {formatCreatedDate()}
          {"  TAKEN: "}{storage?.Created_BY_Name || storage?.Name || "—"}
        </div>


<div style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", padding: "1mm 0", marginBottom: "2mm" }}>
  {[
    ["PARTY NAME", customer?.Billl_Name || customer?.Party_Mailing_Name || "—"],
    ["LOCATION", customer?.Party_Location || customer?.Party_Mailing_Address || customer?.City || "—"],
    ["PH.NO", customer?.Mobile_No || customer?.Land_Line || "—"],
    ["TRANSPORT", customer?.Transporter || "—"],
    ["BROKER", customer?.Broker || "—"],
  ].map(([label, value], i) => (
    <div key={i} style={{ fontWeight: 800, marginBottom: i < 4 ? "2px" : 0, display: "flex", alignItems: "flex-start" }}>
      <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>{label.padEnd(10)} : </span>
      <span style={{ flex: 1, wordBreak: "break-word" }}>{value}</span>
    </div>
  ))}
</div>

        <div style={{ border: "0.5px solid #000" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[["RATE", "25mm"], ["ITEM NAME", "45mm"], ["BAGS", "10mm"]].map(([h, w]) => (
                  <th key={h} style={{
                    border: "0.5px solid #000", padding: "0.5mm", textAlign: "center",
                    fontSize: "14px", fontWeight: 800, background: "#f5f5f5", width: w,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item, i) => {
                  const displayName = item.shortName || item.Print_Name || "";
                  const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
                  const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
                  return (
                    <tr key={i} style={{ minHeight: "8mm" }}>
                      <td style={{ border: "0.5px solid #000", padding: "2mm 1mm", textAlign: "center", verticalAlign: "middle", fontSize: "14px", fontWeight: 900 }}>
                        ₹{rupee(item.price)}
                      </td>
                      <td style={{ border: "0.5px solid #000", textAlign: "left", paddingLeft: "1.5mm", paddingRight: "1.5mm", verticalAlign: "middle", fontSize: "13px", fontWeight: 800, wordBreak: "break-word" }}>
                        {displayName}
                      </td>
                      <td style={{ border: "0.5px solid #000", textAlign: "center", padding: "0.3mm", verticalAlign: "middle", fontSize: "13px", fontWeight: 800 }}>
                        {bags > 0 ? Math.round(bags) : 0}
                      </td>
                    </tr>
                  );
                })
              ) : (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} style={{ minHeight: "8mm" }}>
                    <td style={{ border: "0.5px solid #000", padding: "2px" }}></td>
                    <td style={{ border: "0.5px solid #000", padding: "2px" }}></td>
                    <td style={{ border: "0.5px solid #000", padding: "2px" }}></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {expenseRows.length > 0 && (
  <div style={{  padding: "1mm" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
      <tbody>
        {expenseRows.map((exp, i) => {
          const val = safeNum(exp.Expence_Value);
          return (
            <tr key={i}>
              <td
                style={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  padding: "0 4px 1px 0",
                  width: "1%", 
                }}
              >
                {val < 0 ? "-" : ""}₹{rupee(Math.abs(val))}
              </td>
              <td
                style={{
                  fontWeight: 700,
                  textAlign: "center",
                  
                  padding: "0 0 1px 0",
                }}
              >
                {(exp.Account_Name || exp.Expence_Name || "")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}


          <div style={{
            background: "#f0f0f0", borderTop: "1px solid #000", padding: "1mm",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: "12px", fontWeight: "bold",
          }}>
            <span>₹{rupee(totals?.subtotal)}</span>
            <span>{totalKgs.toFixed(2)} KGS</span>
            <span>{Math.round(totalBags)} BAGS</span>
          </div>
        </div>
      </div>
    </>
  );
});

QuotationPrint.displayName = "QuotationPrint";



const PrintPreviewModal = ({ open, onClose, customer, cartItems, totals, onPrintAndSave, storage, isReprint = false,createdOn, orderDate ,expenses}) => {
  const printRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768);
  }, []);

  // Function to trigger print directly
  const triggerDirectPrint = (htmlContent) => {
    // Create a new window
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return false;
    }
    
    // Write the HTML content
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        
        // Optional: close after print (but give user time to see)
        printWindow.onafterprint = () => {
          setTimeout(() => {
            if (confirm("Print completed. Close this window?")) {
              printWindow.close();
            }
          }, 500);
        };
      }, 500);
    };
    
    return true;
  };


  const buildCompletePrintHtml = () => {
    const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const rupee = (n) => safeNum(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const totalKgs = (cartItems || []).reduce((s, i) => s + safeNum(i.kgs), 0);
    const totalBags = (cartItems || []).reduce((sum, item) => {
      const displayName = item.shortName || item.Print_Name || "";
      const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
      return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
    }, 0);

    const rows = (cartItems || [])
      .map((item) => {
        const displayName = item.shortName || item.Print_Name || "";
        const packWeight = parseFloat(displayName?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
        const bags = packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
        return `
          <tr>
            <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
              ₹${rupee(item.price)}
            </td>
            <td style="border:1px solid #000;padding:8px 4px;text-align:left;font-size:14px;">
              ${displayName}
            </td>
            <td style="border:1px solid #000;padding:8px 4px;text-align:center;font-size:14px;">
              ${bags > 0 ? Math.round(bags) : 0}
            </td>
          </tr>`;
      })
      .join("");


 const expenseRowsHtml = (Array.isArray(expenses) ? expenses : [])
      .filter(exp => exp && exp.Account_Name && Number(exp.Expence_Value) !== 0)
      .map(exp => {
        const val = safeNum(exp.Expence_Value);
        return `
          <div style="display:flex;justify-content:space-between;padding:4px 8px;font-size:13px;font-weight:bold;border-bottom:1px dashed #ccc;">
            <span>${val < 0 ? "-" : ""}₹${rupee(Math.abs(val))}</span>
            <span>${exp.Account_Name}</span>
          </div>`;
      })
      .join("");
      
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB");
    const timeStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const takenBy = storage?.Created_BY_Name || storage?.Name || "—";

return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
      <title>SM Traders - Receipt</title>
      <style>
        @media print {
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
          body {
            margin: 0;
            padding: 2mm;
          }
          .no-print {
            display: none !important;
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Courier New', Courier, monospace;
          font-size: 14px;
          padding: 5mm;
          background: white;
        }
        
        .receipt {
          max-width: 80mm;
          margin: 0;
          background: white;
          text-align: left;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 5px;
          font-size: 14px;
          text-align: left;
        }
        
        .info-label {
          min-width: 100px;
          font-weight: bold;
          text-align: left;
        }
        
        .info-value {
          flex: 1;
          text-align: left;
          font-weight: bold;
        }
        
        .date-taken-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 15px;
      
          text-align: left;
          margin-bottom: 10px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        
        th {
          background: #f0f0f0;
          font-weight: bold;
          padding: 8px 5px;
          border: 1px solid #000;
          text-align: center;
          font-size: 15px;
        }
        
        td {
          padding: 8px 5px;
          border: 1px solid #000;
          
          text-align: center;
          font-size: 15px;
          font-weight: bold !important;
        }
        
        td:nth-child(2) {
          text-align: left;
          font-weight: bold !important;
        }
        
        .total-row {
          background: #f0f0f0;
          display: flex;
          justify-content: space-between;
          padding: 8px;
          font-weight: bold;
          
          border: 1px solid #000;
          border-top: none;
          text-align: left;
        }
        
        .print-button-container {
          position: fixed;
          bottom: 20px;
          left: 0;
          right: 0;
          text-align: center;
          padding: 16px;
          z-index: 10000;
        }
        
        .print-btn {
          background: #4a2c1a;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          width: 90%;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .close-btn {
          background: #999;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 10px;
          width: 90%;
          max-width: 300px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
       
        <div class="date-taken-row">
          <span>${dateStr} ${timeStr}</span>
          <span>TAKEN: ${takenBy}</span>
        </div>

        <div style="border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; margin-bottom: 15px;">
          <div class="info-row">
            <span class="info-label">PARTY NAME:</span>
            <span class="info-value">${customer?.Party_Mailing_Name || customer?.Billl_Name || "—"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">LOCATION:</span>
            <span class="info-value">${customer?.Party_Mailing_Address || customer?.Party_Location || customer?.City || "—"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">PHONE:</span>
            <span class="info-value">${customer?.Mobile_No || customer?.Land_Line || "—"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">TRANSPORT:</span>
            <span class="info-value">${customer?.Transporter || "—"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">BROKER:</span>
            <span class="info-value">${customer?.Broker || "—"}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 20%">RATE</th>
              <th style="width: 60%">ITEM NAME</th>
              <th style="width: 20%">BAGS</th>
            </tr>
          </thead>
          <tbody>
            ${rows && rows.length > 0 ? rows : `
            <tr>
              <td colspan="3" style="text-align:center;padding:20px;font-weight:bold;">No items</td>
            </tr>
            `}
          </tbody>
        </table>
         ${expenseRowsHtml}
        <div class="total-row">
          <span>₹${rupee(totals?.subtotal)}</span>
          <span>${totalKgs.toFixed(2)} KGS</span>
          <span>${Math.round(totalBags)} BAGS</span>
        </div>
      </div>
      
      <div class="print-button-container no-print">
        <button class="print-btn" onclick="window.print();">🖨️ PRINT RECEIPT</button>
        <button class="close-btn" onclick="window.close();">✕ CLOSE</button>
      </div>
      
      <script>
        // Auto-trigger print after page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>`;
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {

      if (!isReprint && onPrintAndSave) {
        const saveResult = await onPrintAndSave();
        if (!saveResult) {
          setIsPrinting(false);
          return;
        }
      }

     
      onClose();
      
      setTimeout(() => {
        const html = buildCompletePrintHtml();
        triggerDirectPrint(html);
        setIsPrinting(false);
      }, 300);
      
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Print failed: " + (error.message || "Unknown error"));
      setIsPrinting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick" || !isPrinting) onClose();
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { margin: "10px", width: "calc(100% - 20px)", maxWidth: "500px" },
      }}
    >
      <DialogTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
        {isReprint ? "Reprint Quotation" : "Print Preview — Quotation"}
      </DialogTitle>

      <DialogContent style={{
        overflowX: "auto", display: "flex", justifyContent: "center",
        alignItems: "center", minHeight: "400px", backgroundColor: "#f5f5f5",
      }}>
        <div className="print-container" style={{
          backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "inline-block",
        }}>
          <QuotationPrint
            ref={printRef}
            customer={customer}
            cartItems={cartItems}
            totals={totals}
            expenses={expenses} 
            storage={storage}
              createdOn={createdOn} // Pass this
            orderDate={orderDate} // Pass this
          />
        </div>
      </DialogContent>

      <DialogActions style={{ padding: "16px" }}>
        <Button onClick={() => { if (!isPrinting) onClose(); }} variant="outlined" disabled={isPrinting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePrint}
          disabled={isPrinting}
          style={{ fontWeight: "bold", backgroundColor: BROWN_DARK }}
        >
          {isPrinting ? "Processing..." : isReprint ? "Print" : "Print & Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const handleIOSPrint = (html) => {

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.info('Tap Share button then Print to print');
};


const TransporterDropdown = ({ selectedTransporter, onSelectTransporter, availableTransporters, loading, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);



  const filteredTransporters = searchTerm.trim()
    ? availableTransporters.filter(t => {
        const search = searchTerm.toLowerCase().trim();
        const nameMatch = (t.name || "").toLowerCase().includes(search);
        const aliasMatch = (t.alias_name || "").toLowerCase().includes(search);
        const codeMatch = (t.code || "").toLowerCase().includes(search);
        const mobileMatch = (t.mobile || "").toLowerCase().includes(search);
        
        return nameMatch || aliasMatch || codeMatch || mobileMatch;
      })
    : availableTransporters;

  

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => { setIsOpen(prev => !prev); onOpen && onOpen(); }}
        style={{
          padding: "12px",
          border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
          borderRadius: "8px", background: "#fff", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          transition: "border-color 0.2s",
        }}
      >
        <span style={{ 
          color: selectedTransporter.name ? BROWN : "#999", fontSize: "14px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 
        }}>
          {selectedTransporter.name || "Select Transporter"}
        </span>
        <span style={{
          color: BROWN_LIGHT, fontSize: "11px", marginLeft: "8px",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
        }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
          maxHeight: "280px", overflowY: "auto", zIndex: 1000,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}>
          <div style={{
            padding: "8px", borderBottom: "1px solid #f0f0f0",
            position: "sticky", top: 0, background: "#fff",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <SearchIcon style={{ fontSize: "16px", color: "#999", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name, alias, code or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1, border: `1px solid ${ACCENT}`,
                borderRadius: "6px", padding: "6px 8px",
                fontSize: "13px", outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = BROWN}
              onBlur={(e) => e.target.style.borderColor = ACCENT}
            />
            {searchTerm && (
              <button
                onClick={(e) => { e.stopPropagation(); setSearchTerm(""); }}
                style={{ background: "transparent", border: "none", cursor: "pointer",
                  color: "#aaa", fontSize: "16px", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
              >×</button>
            )}
          </div>

          {searchTerm.trim() && (
            <div style={{
              padding: "4px 12px", fontSize: "11px", color: "#999",
              background: "#fafafa", borderBottom: "1px solid #f0f0f0",
            }}>
              {filteredTransporters.length} result{filteredTransporters.length !== 1 ? "s" : ""} for "{searchTerm}"
            </div>
          )}

          <div
            onClick={() => { onSelectTransporter({ id: null, name: "" }); setIsOpen(false); setSearchTerm(""); }}
            style={{
              padding: "10px 12px", borderBottom: "1px solid #f5f0eb",
              cursor: "pointer", fontSize: "13px", color: "#999", fontStyle: "italic",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#faf6f2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            — None —
          </div>

          {loading ? (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <CircularProgress size={16} style={{ color: BROWN }} />
            </div>
          ) : filteredTransporters.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              No transporters found{searchTerm ? ` for "${searchTerm}"` : ""}
            </div>
          ) : (
            filteredTransporters.map(transporter => (
              <div
                key={transporter.id}
                onClick={() => { onSelectTransporter({ id: transporter.id, name: transporter.name }); setIsOpen(false); setSearchTerm(""); }}
                style={{
                  padding: "10px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
                  background: selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent",
                }}
                onMouseEnter={(e) => { if (selectedTransporter.id !== transporter.id) e.currentTarget.style.background = "#faf6f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent"; }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{transporter.name}</div>
                {/* {transporter.alias_name && (
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                    Alias: {transporter.alias_name}
                  </div>
                )} */}
                {(transporter.code || transporter.mobile) && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {transporter.code && `Code: ${transporter.code}`}
                    {transporter.code && transporter.mobile && " | "}
                    {transporter.mobile}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const RoundNumber = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
const getPercentage = (total, percent) =>
  RoundNumber((Number(total) || 0) * (Number(percent) || 0) / 100);
const Addition = (...args) =>
  RoundNumber(args.reduce((s, v) => s + (Number(v) || 0), 0));

const MobileCartDrawer = ({
  isOpen, onClose, cartItems, products, allProducts, onUpdateQty, onRemoveItem,
  isLoggedIn, onLoginClick, externalCustomers, onCustomerChange,
  selectedCustomer: headerSelectedCustomer, userType, footerOffset = 0,
}) => {
  const [step, setStep] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [creditInfo, setCreditInfo] = useState(null);
  const [showCreditLimitDialog, setShowCreditLimitDialog] = useState(false);
  const selectedCustomer = headerSelectedCustomer;

  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [availableTransporters, setAvailableTransporters] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
  const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);
  const printRef = useRef();

  const [brokerDropdownOpen, setBrokerDropdownOpen] = useState(false);
  const [brokerSearch, setBrokerSearch] = useState("");
  const [transporterSearch, setTransporterSearch] = useState("");

  const [customPrices, setCustomPrices] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'price' or 'qty'
  const [tempValue, setTempValue] = useState("");

  // ── Expenses state ─────────────────────────────────────────────
  const [expenseMaster, setExpenseMaster] = useState([]);
  const [loadingExpenseMaster, setLoadingExpenseMaster] = useState(false);
  const [invoiceExpenses, setInvoiceExpenses] = useState([]);

  const handleReactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QuotationBill",
    onAfterPrint: () => {
      toast.success("Print completed successfully");
      Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
      localStorage.removeItem('cartItems');
      localStorage.removeItem('selectedCustomer');
      localStorage.removeItem('selectedCustomerId');
      setPrintModalOpen(false);
      onClose();
    },
    onPrintError: (error) => {
      console.error("Print Error:", error);
      toast.error("Print failed");
    },
  });

  useEffect(() => {
    if (isOpen) { fetchBrokers(); fetchTransporters(); fetchExpenseMaster(); }
  }, [isOpen]);

  const fetchBrokers = async () => {
    if (availableBrokers.length > 0) return;
    setLoadingBrokers(true);
    try {
      const response = await fetchLink({ address: `pos/brokers` });
      if (response?.success) {
        const data = response.data?.Brokers || response.data || [];
        if (Array.isArray(data)) {
          setAvailableBrokers(data.map(b => ({ 
            id: String(b.Broker_Id).trim(), 
            name: (b.Broker_Name || "").trim(),
            alias_name: b.Allias_Name || b.alias_name || b.Alias || b.alias || "",
            code: b.Broker_Code || b.code || "",
            mobile: b.Mobile_No || b.mobile || ""
          })));
        }
      }
    } catch (error) { console.error("Failed to load brokers:", error); }
    finally { setLoadingBrokers(false); }
  };

  const fetchTransporters = async () => {
    if (availableTransporters.length > 0) return;
    setLoadingTransporters(true);
    try {
      const response = await fetchLink({ address: `pos/transporters` });
      if (response?.success) {
        const data = response.data?.Transporters || response.data || [];
        if (Array.isArray(data)) {
          setAvailableTransporters(data.map(t => ({
            id: String(t.Transporter_Id).trim(),
            name: (t.Transporter_Name || "").trim(),
            alias_name: (t.Allias_Name || t.Alias_name || t.Alias || "").trim(),
            code: (t.Transporter_Code || t.code || "").trim(),
            mobile: (t.Mobile_No || t.mobile || "").trim()
          })));
        }
      }
    } catch (error) {
      console.error("Failed to load transporters:", error);
      toast.error("Failed to load transporters");
    } finally {
      setLoadingTransporters(false);
    }
  };

  // ── Fetch expense master (same endpoint desktop uses) ──────────
  const fetchExpenseMaster = async () => {
    if (expenseMaster.length > 0) return;
    setLoadingExpenseMaster(true);
    try {
      const response = await fetchLink({ address: `masters/defaultAccountMaster?Type=SALE_ORDER` });
      if (response?.success && Array.isArray(response.data)) {
        setExpenseMaster(response.data);
      }
    } catch (error) {
      console.error("Failed to load expense master:", error);
      toast.error("Failed to load expense options");
    } finally {
      setLoadingExpenseMaster(false);
    }
  };

  const fetchCreditInfo = async (retailerId) => {
    if (!retailerId) { setCreditInfo(null); return; }
    try {
      const response = await fetchLink({
        address: `receipt/receiptMaster/pendingSalesInvoiceReceipt/amount?Retailer_Id=${retailerId}`,
        method: "GET",
      });
      if (response?.success) {
        setCreditInfo(response.others || null);
      } else {
        setCreditInfo(null);
      }
    } catch (error) {
      console.error("Error fetching credit info:", error);
      setCreditInfo(null);
    }
  };

  useEffect(() => {
    if (selectedCustomer?.id) {
      fetchCreditInfo(selectedCustomer.id);
    } else {
      setCreditInfo(null);
    }
  }, [selectedCustomer?.id]);

  useEffect(() => {
    if (selectedCustomer) {
      const isEditing = localStorage.getItem('isEditingOrder') === 'true';
      let contactNum = selectedCustomer.mobile || "";
      let shipAddress = selectedCustomer.address || "";
      let deliverAddress = selectedCustomer.address || "";
      let customerCity = selectedCustomer.city || "";
      
      if (isEditing) {
        const editDataStr = localStorage.getItem('editOrderData');
        if (editDataStr) {
          try {
            const editData = JSON.parse(editDataStr);
            contactNum = editData.originalMobile || selectedCustomer.mobile || "";
            shipAddress = editData.originalAddress || selectedCustomer.address || "";
            deliverAddress = editData.originalAddress || selectedCustomer.address || "";
            customerCity = editData.originalCity || selectedCustomer.city || "";
          } catch(e) {}
        }
      }
      
      setContactNumber(contactNum);
      if (shipAddress) {
        setShippingAddress(shipAddress);
        setDeliveryAddress(deliverAddress);
      }

      if (selectedCustomer.brokerName && selectedCustomer.brokerName !== "0") {
        const brokerName = String(selectedCustomer.brokerName).trim();
        const brokerId = selectedCustomer.brokerId ? String(selectedCustomer.brokerId).trim() : null;
        
        if (brokerId && brokerId !== "0" && brokerId !== "null" && brokerId !== "") {
          const found = availableBrokers.find(b => b.id === brokerId);
          setSelectedBroker(found || { id: brokerId, name: brokerName });
        } else {
          const found = availableBrokers.find(b => b.name.toLowerCase() === brokerName.toLowerCase());
          setSelectedBroker(found || { id: null, name: brokerName });
        }
      } else {
        setSelectedBroker({ id: null, name: "" });
      }

      if (selectedCustomer.transporterName && selectedCustomer.transporterName !== "0") {
        const transporterName = String(selectedCustomer.transporterName).trim();
        const transporterId = selectedCustomer.transporterId ? String(selectedCustomer.transporterId).trim() : null;
        
        if (transporterId && transporterId !== "0" && transporterId !== "null" && transporterId !== "") {
          const found = availableTransporters.find(t => t.id === transporterId);
          setSelectedTransporter(found || { id: transporterId, name: transporterName });
        } else {
          const found = availableTransporters.find(t => t.name.toLowerCase() === transporterName.toLowerCase());
          setSelectedTransporter(found || { id: null, name: transporterName });
        }
      } else {
        setSelectedTransporter({ id: null, name: "" });
      }
    }
  }, [selectedCustomer, availableBrokers, availableTransporters]);

  useEffect(() => {
    if (!isOpen) { setTimeout(() => setStep(1), 300); setCustomerSearch(""); }
  }, [isOpen]);

  const getProductPackGet = (productId) => {
    const p = allProducts.find(p => String(p.Product_Id) === productId) || products.find(p => p.id === productId);
    return p?.packGet || parseFloat(p?.PackGet) || 1;
  };

  // Enhanced cart items with custom prices
  const enhancedCartItems = Object.entries(cartItems)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const product = products.find(p => p.id === productId) || {};
      const packGet = getProductPackGet(productId);
      const kgs = qty * packGet;
      const price = customPrices[productId] !== undefined ? customPrices[productId] : (product.price || 0);
      const amount = price * qty * packGet;
      return { ...product, id: productId, quantity: qty, packGet, kgs, amount, price };
    });

  const totalItems = enhancedCartItems.reduce((s, i) => s + i.quantity, 0);
  const totalKgs = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);
  const subtotalAmount = enhancedCartItems.reduce((s, i) => s + i.amount, 0);

  // ── Coolie expense, computed from product master data (matches desktop logic) ──
  const coolieExp = useMemo(() => {
    return enhancedCartItems.reduce((sum, item) => {
      const coolieRate = parseFloat(item.coolie) || 0;
      return Addition(sum, coolieRate * item.quantity);
    }, 0);
  }, [enhancedCartItems]);

  // ── Running invoice total: subtotal + all expenses added so far ──
  const Total_Invoice_value = useMemo(() => {
    const totalExpenses = invoiceExpenses.reduce(
      (acc, exp) => Addition(acc, parseFloat(exp.Expence_Value) || 0), 0
    );
    return Addition(subtotalAmount, totalExpenses);
  }, [subtotalAmount, invoiceExpenses]);

  // Handle price click
  const handlePriceClick = (productId, currentPrice) => {
    setEditingProductId(productId);
    setEditingField('price');
    setTempValue(currentPrice.toString());
  };

  // Handle quantity click
  const handleQtyClick = (productId, currentQty) => {
    setEditingProductId(productId);
    setEditingField('qty');
    setTempValue(currentQty.toString());
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (editingField === 'price') {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setTempValue(value);
      }
    } else if (editingField === 'qty') {
      if (value === '' || /^\d+$/.test(value)) {
        setTempValue(value);
      }
    }
  };

  // Handle key down (Enter to save, Escape to cancel)
  const handleKeyDown = (e, productId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(productId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Handle blur (save on blur)
  const handleBlur = (productId) => {
    handleSaveEdit(productId);
  };

  // Save edit
  const handleSaveEdit = (productId) => {
    if (editingField === 'price') {
      const newPrice = parseFloat(tempValue);
      if (!isNaN(newPrice) && newPrice >= 0) {
        setCustomPrices(prev => ({ ...prev, [productId]: newPrice }));
        toast.success(`Price updated to ₹${newPrice.toFixed(2)}/kg`);
      } else {
        toast.error("Please enter a valid price");
      }
    } else if (editingField === 'qty') {
      const newQty = parseInt(tempValue);
      if (!isNaN(newQty) && newQty >= 0) {
        if (newQty === 0) {
          // Remove item if quantity is 0
          onRemoveItem(productId);
          toast.info("Item removed from cart");
        } else {
          // Update quantity
          const currentQty = cartItems[productId] || 0;
          const delta = newQty - currentQty;
          if (delta !== 0) {
            onUpdateQty(productId, delta);
          }
          toast.success(`Quantity updated to ${newQty}`);
        }
      } else if (tempValue === '' || tempValue === '0') {
        onRemoveItem(productId);
        toast.info("Item removed from cart");
      } else {
        toast.error("Please enter a valid quantity");
      }
    }
    setEditingProductId(null);
    setEditingField(null);
    setTempValue("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditingField(null);
    setTempValue("");
  };

  const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const nameParts = (str) => (str || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const matchName = (name, query) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const qNorm = normalize(q);
    const nNorm = normalize(name);
    const parts = nameParts(name);
    if (nNorm.includes(qNorm)) return true;
    if (name.toLowerCase().includes(q)) return true;
    for (let i = 0; i < parts.length; i++) {
      if (parts.slice(i).join("").includes(qNorm)) return true;
    }
    return parts.some(p => p.includes(qNorm));
  };

  const getFilteredCustomers = () => {
    if (!customerSearch.trim()) return [];
    const searchTerm = customerSearch.toLowerCase().trim();
    const searchMobile = customerSearch.replace(/\D/g, "");
    return (externalCustomers || []).filter(c =>
      (c.name && c.name.toLowerCase().includes(searchTerm)) ||
      (c.billName && c.billName.toLowerCase().includes(searchTerm)) ||
      (c.mobile && c.mobile.replace(/\D/g, "").includes(searchMobile)) ||
      (c.city && c.city.toLowerCase().includes(searchTerm)) ||
      (c.brokerName && c.brokerName.toLowerCase().includes(searchTerm)) ||
      (c.transporterName && c.transporterName.toLowerCase().includes(searchTerm))
    );
  };

  const filteredCustomers = getFilteredCustomers();
  const filteredBrokers = brokerSearch.trim()
    ? availableBrokers.filter(b => matchName(b.name, brokerSearch)) : availableBrokers;


  const handleSelectExpense = (index, expenseId) => {
    if (!expenseId) {
      setInvoiceExpenses(prev => prev.map((item, i) =>
        i === index ? { Expense_Id: '', Account_Name: '', Group_Name: '', percentageValue: 0, Expence_Value: '' } : item
      ));
      return;
    }

    const selected = expenseMaster.find(exp => String(exp.Acc_Id) === String(expenseId));
    if (!selected) return;

    const isCoolie = (selected.Account_Name || '').trim().toUpperCase() === 'COOLIE EXPENSES';
    const percentValue = Number(selected.percentageValue) || 0;

    setInvoiceExpenses(prev => prev.map((item, i) => {
      if (i !== index) return item;

      let value = '';
      if (isCoolie) {
        value = RoundNumber(-coolieExp);
      } else if (percentValue !== 0) {
        value = RoundNumber(getPercentage(Total_Invoice_value, percentValue));
      }

      return {
        ...item,
        Expense_Id: selected.Acc_Id,
        Account_Name: selected.Account_Name,
        Group_Name: selected.Group_Name,
        percentageValue: selected.percentageValue,
        Expence_Value: value,
      };
    }));
  };

  // ── Manual entry (only enabled for non-percentage expenses) ──
  const handleExpenseValueChange = (index, value) => {
    if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return;
    setInvoiceExpenses(prev => prev.map((item, i) =>
      i === index ? { ...item, Expence_Value: value } : item
    ));
  };

  const addExpenseRow = () => {
    setInvoiceExpenses(prev => [
      ...prev,
      { Expense_Id: '', Account_Name: '', Group_Name: '', percentageValue: 0, Expence_Value: '' },
    ]);
  };

  const removeExpenseRow = (index) => {
    setInvoiceExpenses(prev => prev.filter((_, i) => i !== index));
  };

  const getAvailableOptionsForRow = (rowIndex) =>
    expenseMaster.filter(exp => {
      if (String(exp.Acc_Id) === String(invoiceExpenses[rowIndex]?.Expense_Id)) return true;
      return !invoiceExpenses.some((inv, idx) => idx !== rowIndex && String(inv.Expense_Id) === String(exp.Acc_Id));
    });

const computeOrderTotals = () => {
  const totalBeforeTax = enhancedCartItems.reduce((s, i) => {
    const price = customPrices[i.id] !== undefined ? customPrices[i.id] : i.price;
    return s + (price * i.kgs);
  }, 0);
  const totalTax = 0; // Tax exempted sale order
  const totalExpenses = invoiceExpenses.reduce(
    (acc, exp) => Addition(acc, parseFloat(exp.Expence_Value) || 0), 0
  );
  const totalInvoiceValue = Addition(totalBeforeTax, totalExpenses);
  return { totalBeforeTax, totalTax, totalExpenses, totalInvoiceValue };
};

  const handleCheckout = async () => {
    if (!isLoggedIn) { toast.error("Please sign in to place an order"); setIsLoginPopupOpen(true); return; }
    if (!contactNumber) { toast.error("Please enter contact number"); return; }
    if (!selectedCustomer) { toast.error("Please select a customer"); return; }

    const { totalInvoiceValue } = computeOrderTotals();
    const creditLimit = parseFloat(creditInfo?.creditLimit || 0);
    const outstanding = parseFloat(creditInfo?.outstanding || 0);

    if (creditLimit > 0 && (outstanding + totalInvoiceValue) > creditLimit) {
      setShowCreditLimitDialog(true);
      return;
    }

    await proceedCheckout();
  };

  const proceedCheckout = async () => {
    setIsProcessing(true);

    const now = new Date();
    const formattedDateTime = ISOStrings(new Date(), true);  
    const formattedDateOnly = ISOStrings(new Date(), false); 

    const parseData = JSON.parse(localStorage.getItem('user') || '{}');
    const storage = JSON.parse(localStorage.getItem('user') || '{}');

    const editOrderId = localStorage.getItem('editOrderId');
    const isEditing = !!editOrderId;

    const { totalBeforeTax, totalTax, totalInvoiceValue } = computeOrderTotals();
    const totalKgsValue = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);

    const Staff_Involved_List = [];

    if (selectedBroker?.id && selectedBroker.id !== "0" && selectedBroker.id !== "null" && selectedBroker.id !== "") {
      const brokerIdNum = parseInt(selectedBroker.id);
      if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
        Staff_Involved_List.push({ Involved_Emp_Id: brokerIdNum, Cost_Center_Type_Id: 3 });
      }
    }

    if (selectedTransporter?.id && selectedTransporter.id !== "0" && selectedTransporter.id !== "null" && selectedTransporter.id !== "") {
      const transporterIdNum = parseInt(selectedTransporter.id);
      if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
        Staff_Involved_List.push({ Involved_Emp_Id: transporterIdNum, Cost_Center_Type_Id: 2 });
      }
    }

    const Expence_Array = invoiceExpenses
      .filter(e => e.Expense_Id)
      .map(e => ({
        Expense_Id: e.Expense_Id,
        Account_Name: e.Account_Name,
        Group_Name: e.Group_Name,
        Expence_Value: RoundNumber(e.Expence_Value),
      }));

    const generalInfo = {
      ...(isEditing && { So_Id: parseInt(editOrderId) }),
      So_Date: formattedDateOnly,
      Retailer_Id: parseInt(selectedCustomer.id),
      Sales_Person_Id: storage?.user?.SalesPersonId || 0,
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId,
      VoucherType: 200, GST_Inclusive: 2, IS_IGST: 0,
      CSGT_Total: (totalTax / 2).toFixed(2), // → "0.00"
SGST_Total: (totalTax / 2).toFixed(2), // → "0.00"
      IGST_Total: "0.00", Round_off: "0.00",
      Total_Before_Tax: totalBeforeTax.toFixed(2), Total_Tax: totalTax.toFixed(2),
      Total_Invoice_value: totalInvoiceValue.toFixed(2),
      Narration: description || "", isConverted: 0, Cancel_status: 1,
      Created_by: parseData?.UserId || storage?.user?.UserId,
      Created_on: formattedDateTime,
      Trans_Type: isEditing ? "UPDATE" : "INSERT", Alter_Id: 0,
      Customer_Name: selectedCustomer.name || "", Ord_Mobile_No: contactNumber,
      Broker_Name: selectedBroker.name || "", Broker_Id: selectedBroker.id || null,
      Transporter_Name: selectedTransporter.name || "", Transporter_Id: selectedTransporter.id || null,
      Shipp_Address: shippingAddress || selectedCustomer.address || "",
      Deliv_Address: deliveryAddress || shippingAddress || selectedCustomer.address || "",
      Total_Kgs: totalKgsValue.toFixed(2), Total_Items: enhancedCartItems.length,
      Staff_Involved_List,
      Expence_Array,
    };

   const stockInfo = enhancedCartItems.map((item, index) => {
  const taxRate = 0; // Tax exempted sale order
  const cgstSgstRate = 0;
  const price = customPrices[item.id] !== undefined ? customPrices[item.id] : item.price;
  const taxableAmount = price * item.kgs;
  const taxAmount = 0;
  const cgstSgstAmount = 0;
  const finalAmount = taxableAmount;
  return {
    So_Date: formattedDateOnly, S_No: index + 1, Item_Id: parseInt(item.id),
    Bill_Qty: item.kgs.toFixed(2), Taxable_Rate: price.toFixed(2),
    Item_Rate: price.toFixed(2), Amount: taxableAmount.toFixed(2), Free_Qty: "0.00",
    Total_Qty: item.quantity.toString(), Taxble: taxAmount.toFixed(2),
    HSN_Code: item.hsn || "210690", Unit_Id: item.unitId, Unit_Name: item.unitName,
    Taxable_Amount: taxableAmount.toFixed(2), Tax_Rate: taxRate,
    Cgst: cgstSgstRate, Cgst_Amo: cgstSgstAmount.toFixed(2),
    Sgst: cgstSgstRate, Sgst_Amo: cgstSgstAmount.toFixed(2),
    Igst: 0, Igst_Amo: "0.00", Final_Amo: finalAmount.toFixed(2),
    Created_on: formattedDateTime, Product_Id: parseInt(item.id), Product_Name: item.name,
    Quantity: item.quantity, Price: price, Total: taxableAmount.toFixed(2),
    Weight: item.kgs.toString(), Unit: item.unit, PackGet: item.packGet,
  };
});

    const saleData = {
      generalInfo, stockInfo,
      totalAmount: totalInvoiceValue, totalItems: enhancedCartItems.length,
      totalKgs: totalKgsValue.toFixed(2), customerId: selectedCustomer.id,
      customerName: selectedCustomer.name || "", contactNumber,
      brokerName: selectedBroker.name, transporter: selectedTransporter.name,
      shippingAddress, deliveryAddress, description,
      Created_by: parseData?.UserId || parseData?.user_id || "",
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 2,
    };

    try {
      const loadingToast = toast.loading(isEditing ? "Updating order..." : "Placing order...");
      const response = await fetchLink({
        address: `sales/salesInvoice/Whatsapp`,
        method: isEditing ? 'PUT' : 'POST',
        bodyData: saleData,
      });
      toast.dismiss(loadingToast);

      if (response?.success) {
        toast.success(isEditing ? "Order updated successfully!" : "Order placed successfully!");
        if (isEditing) {
          localStorage.removeItem('editOrderId'); localStorage.removeItem('editOrderNumber');
          localStorage.removeItem('isEditingOrder'); localStorage.removeItem('editOrderData');
          localStorage.removeItem('editCustomerData');
        }

        const customerDataForPrint = {
          Billl_Name: selectedCustomer.billName || selectedCustomer.name || "",
          Party_Mailing_Name: selectedCustomer.partyMailingName || selectedCustomer.billName || selectedCustomer.name || "",
          Party_Location: selectedCustomer.city || "",
          Party_Mailing_Address: selectedCustomer.partyMailingAddress || shippingAddress || selectedCustomer.address || "",
          City: selectedCustomer.city || "",
          Mobile_No: contactNumber,
          Land_Line: selectedCustomer.mobile || "",
          Transporter: selectedTransporter.name || "",
          Broker: selectedBroker.name || "",
        };

        const printCartItems = enhancedCartItems.map(item => ({
          ...item, Print_Name: item.shortName || item.name, 
          price: customPrices[item.id] !== undefined ? customPrices[item.id] : item.price, 
          kgs: item.kgs,
        }));

        setLastOrderData({
          orderId: response.data?.So_Id || response.data?.OrderId,
          customerData: customerDataForPrint, printCartItems,
          totals: { subtotal: totalInvoiceValue },
          expenses: Expence_Array,
        });
        setPrintModalOpen(true);
      } else {
        toast.error(response?.message || "Failed to process order");
      }
    } catch (error) {
      toast.error("Failed to process order: " + (error.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Render cart items with edit functionality similar to CartItemRow
  const renderCartItem = (item) => {
    const isEditingThisItem = editingProductId === item.id;
    const isEditingPrice = isEditingThisItem && editingField === 'price';
    const isEditingQty = isEditingThisItem && editingField === 'qty';
    const currentPrice = customPrices[item.id] !== undefined ? customPrices[item.id] : item.price;

    return (
      <div key={item.id} style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "10px 0", 
        borderBottom: "1px dashed #ddd",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        {/* Left side - Product info */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          alignItems: "center", 
          flex: 1,
          minWidth: "60%",
        }}>
          <img
            src={item.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=40&h=40&fit=crop"}
            alt={item.name}
            style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=40&h=40&fit=crop"; }}
          />
          <div style={{ flex: 1, minWidth: "0" }}>
            <h3 style={{ 
              fontSize: "12px", 
              fontWeight: "600", 
              color: BROWN, 
              margin: "0 0 2px 0",
              wordBreak: "break-word",
            }}>
              {item.name?.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
            </h3>
            
            {/* Price section with edit functionality */}
            <div style={{ 
              display: "flex", 
              gap: "6px", 
              alignItems: "center", 
              flexWrap: "wrap",
            }}>
              {isEditingPrice ? (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px",
                  flexWrap: "wrap",
                }}>
                  <input
                    type="text"
                    value={tempValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    onBlur={() => handleBlur(item.id)}
                    autoFocus
                    style={{
                      width: "70px",
                      padding: "2px 6px",
                      border: `2px solid ${BROWN}`,
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: BROWN,
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                  <span style={{ 
                    fontSize: "14px", 
                    fontWeight: "600", 
                    color: BROWN 
                  }}>/kg</span>
                  <div style={{ 
                    display: "flex", 
                    gap: "3px",
                    alignItems: "center",
                  }}>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      style={{
                        background: "#4CAF50",
                        border: "none",
                        borderRadius: "12px",
                        padding: "2px 6px",
                        color: "#fff",
                        fontSize: "10px",
                        cursor: "pointer",
                        minWidth: "16px",
                        minHeight: "16px",
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        background: "#f44336",
                        border: "none",
                        borderRadius: "12px",
                        padding: "1px 5px",
                        color: "#fff",
                        fontSize: "8px",
                        cursor: "pointer",
                        minWidth: "16px",
                        minHeight: "16px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <span 
                  onClick={() => handlePriceClick(item.id, currentPrice)}
                  style={{ 
                    background: "#f0e9e2", 
                    padding: "2px 6px", 
                    borderRadius: "12px", 
                    fontSize: "13px", 
                    color: BROWN,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: "800",
                    border: "1px solid transparent",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e8ddd4";
                    e.currentTarget.style.borderColor = BROWN;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f0e9e2";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  title="Click to edit price"
                >
                  ₹{(currentPrice || 0).toFixed(2)}/kg ✎
                </span>
              )}
              
              <span style={{ 
                fontSize: "9px", 
                color: "#666",
                whiteSpace: "nowrap",
              }}>
                Pack: {item.packGet}kg
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Quantity controls and amount */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "6px",
          flexShrink: 0,
          marginLeft: "auto",
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "2px", 
            background: "#f5f0eb", 
            padding: "2px 3px", 
            borderRadius: "25px",
            flexShrink: 0,
          }}>
            <button 
              onClick={() => onUpdateQty(item.id, -1)} 
              style={{ 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%", 
                border: "none", 
                background: "#fff", 
                color: BROWN, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "16px", 
                fontWeight: "bold", 
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                flexShrink: 0,
              }}
            >-</button>
            
            {/* Quantity display - clickable to edit */}
            {isEditingQty ? (
              <input
                type="text"
                value={tempValue}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                onBlur={() => handleBlur(item.id)}
                autoFocus
                style={{
                  width: "40px",
                  padding: "4px 2px",
                  border: `2px solid ${BROWN}`,
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: BROWN,
                  background: "#fff",
                  textAlign: "center",
                  outline: "none",
                }}
              />
            ) : (
              <span 
                onClick={() => handleQtyClick(item.id, item.quantity)}
                style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  color: BROWN, 
                  minWidth: "32px", 
                  textAlign: "center",
                  cursor: "pointer",
                  padding: "4px 4px",
                  borderRadius: "4px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e8ddd4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                title="Click to edit quantity"
              >
                {item.quantity}
              </span>
            )}
            
            <button 
              onClick={() => onUpdateQty(item.id, 1)} 
              style={{ 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%", 
                border: "none", 
                background: "#fff", 
                color: BROWN, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "16px", 
                fontWeight: "bold", 
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                flexShrink: 0,
              }}
            >+</button>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "2px",
            flexShrink: 0,
          }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ 
                fontSize: "14px", 
                fontWeight: "700", 
                color: BROWN, 
                minWidth: "60px", 
                display: "block" 
              }}>₹{item.amount.toFixed(2)}</span>
              <span style={{ 
                fontSize: "8px", 
                color: "#999", 
                display: "block" 
              }}>({item.quantity} × {item.packGet}kg)</span>
            </div>
            <div
              onClick={() => onRemoveItem(item.id)}
              style={{ 
                color: "#999", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = "#fee"; 
                e.currentTarget.style.color = "#ff4444"; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.color = "#999"; 
              }}
            >
              <DeleteOutlineIcon style={{ fontSize: "18px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Render one expense row ─────────────────────────────────────
  const renderExpenseRow = (row, index) => {
    const isDisabledInput = !row.Expense_Id || Number(row.percentageValue) !== 0;
    return (
      <div key={index} style={{
        display: "flex", gap: "8px", alignItems: "center",
        padding: "10px", background: "#f9f4ef", borderRadius: "8px",
        border: "1px solid #e8ddd4", marginBottom: "8px", flexWrap: "wrap",
      }}>
        <select
          value={row.Expense_Id}
          onChange={(e) => handleSelectExpense(index, e.target.value)}
          style={{
            flex: "1 1 160px", padding: "8px", border: "1px solid #ddd",
            borderRadius: "6px", fontSize: "13px", outline: "none", background: "#fff",
          }}
        >
          <option value="">Select Expense</option>
          {getAvailableOptionsForRow(index).map(exp => (
            <option key={exp.Acc_Id} value={exp.Acc_Id}>{exp.Account_Name}</option>
          ))}
        </select>

        <input
          type="text"
          value={row.Expence_Value}
          disabled={isDisabledInput}
          onChange={(e) => handleExpenseValueChange(index, e.target.value)}
          placeholder="0.00"
          style={{
            width: "90px", padding: "8px", border: `1px solid ${BROWN}`,
            borderRadius: "6px", fontSize: "13px", textAlign: "right",
            outline: "none", background: isDisabledInput ? "#f0f0f0" : "#fff",
          }}
        />

        <button
          onClick={() => removeExpenseRow(index)}
          style={{ background: "transparent", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: "18px" }}
        >✕</button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }} />

      {printModalOpen && lastOrderData && (
        <PrintPreviewModal
          open={printModalOpen}
          onClose={() => {
            setPrintModalOpen(false);
            Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
            localStorage.removeItem('cartItems');
            localStorage.removeItem('selectedCustomer');
            localStorage.removeItem('selectedCustomerId');
            onClose();
          }}
          customer={lastOrderData.customerData}
          expenses={lastOrderData?.expenses} 
          cartItems={lastOrderData.printCartItems}
          totals={lastOrderData.totals}
          storage={JSON.parse(localStorage.getItem('user') || '{}')}
          isReprint={true}
        />
      )}

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "100%",
        backgroundColor: "#fff", zIndex: 1000, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", animation: "slideInRight 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", backgroundColor: BROWN_DARK, color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px" }}>←</button>
            )}
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {step === 1 ? `Cart (${totalItems})` : "Edit Order Details"}
            </span>
          </div>
          <CloseIcon style={{ cursor: "pointer", fontSize: "24px" }} onClick={onClose} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

          {/* STEP 1 – Cart Items */}
          {step === 1 ? (
            <>
              {enhancedCartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {enhancedCartItems.map(item => renderCartItem(item))}

                  <div style={{ marginTop: "16px", padding: "16px", background: "#f9f4ef", borderRadius: "12px" }}>
                    {[
                      ["Total Items:", totalItems],
                      ["Total Kgs:", `${totalKgs.toFixed(2)} kg`],
                      ["Subtotal:", `₹${subtotalAmount.toFixed(2)}`],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                        <span>{label}</span><span>{value}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "10px", marginTop: "4px" }}>
                      <span>Total:</span><span>₹{subtotalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            // STEP 2 – Editable Order Details
            <div>
              {creditInfo && (
                <div style={{
                  marginBottom: "16px",
                  padding: "10px 12px",
                  background: "#fff3f3",
                  border: "1px solid #e0b8b8",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}>
                  <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px", animation: "blinker 1s linear infinite" }}>
                    Outstanding: ₹{parseFloat(creditInfo.outstanding || 0).toFixed(2)}
                  </div>
                  <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px", animation: "blinker 1s linear infinite" }}>
                    Credit Limit: {parseFloat(creditInfo.creditLimit || 0) === 0
                      ? "Unlimited"
                      : `₹${parseFloat(creditInfo.creditLimit).toFixed(2)}`}
                  </div>
                </div>
              )}

              {/* Editable Order Items */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                  Order Items ({enhancedCartItems.length})
                </label>
                {enhancedCartItems.map(item => renderCartItem(item))}

                {/* ── Expenses section ── */}
                <div style={{ marginTop: "16px", marginBottom: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>Expenses</label>
                    <button
                      onClick={addExpenseRow}
                      disabled={expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length}
                      style={{
                        background: BROWN, color: "#fff", border: "none", borderRadius: "20px",
                        padding: "6px 14px", fontSize: "12px", fontWeight: "600",
                        cursor: (expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length) ? "not-allowed" : "pointer",
                        opacity: (expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length) ? 0.5 : 1,
                      }}
                    >+ Add Expense</button>
                  </div>

                  {loadingExpenseMaster && (
                    <div style={{ padding: "8px", textAlign: "center" }}>
                      <CircularProgress size={16} style={{ color: BROWN }} />
                    </div>
                  )}

                  {invoiceExpenses.map((row, index) => renderExpenseRow(row, index))}
                </div>

                {/* Order Summary */}
                <div style={{
                  marginTop: "12px",
                  padding: "16px",
                  background: "#f9f4ef",
                  borderRadius: "12px",
                  border: "1px solid #e8ddd4",
                }}>
                  {[
                    ["Total Items:", totalItems],
                    ["Total Kgs:", `${totalKgs.toFixed(2)} kg`],
                    ["Subtotal:", `₹${subtotalAmount.toFixed(2)}`],
                    ...invoiceExpenses
                      .filter(e => e.Account_Name)
                      .map(e => [
                        `${e.Account_Name}:`,
                        `${Number(e.Expence_Value) < 0 ? "-" : ""}₹${Math.abs(Number(e.Expence_Value) || 0).toFixed(2)}`,
                      ]),
                  
                    ["Total:", `₹${computeOrderTotals().totalInvoiceValue.toFixed(2)}`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      fontSize: label === "Total:" ? "15px" : "13px", 
                      color: label === "Total:" ? BROWN_DARK : "#666", 
                      marginBottom: "6px",
                      fontWeight: label === "Total:" ? "bold" : "normal",
                    }}>
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Customer *</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => { setCustomerDropdownOpen(prev => !prev); if (!customerDropdownOpen) setCustomerSearch(""); }}
                    style={{
                      padding: "10px 12px", border: `1px solid ${customerDropdownOpen ? BROWN : "#ddd"}`,
                      borderRadius: "8px", fontSize: "14px", background: "#fff", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      color: selectedCustomer ? BROWN_DARK : "#999",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {selectedCustomer ? selectedCustomer.name : "Select customer..."}
                    </span>
                    <span style={{ fontSize: "11px", marginLeft: "8px", color: BROWN_LIGHT, transform: customerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </div>

                  {customerDropdownOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                      background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 2000,
                      maxHeight: "320px", overflowY: "auto",
                    }}>
                      <div style={{ padding: "12px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, background: "#fff" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${ACCENT}`, borderRadius: "8px", padding: "4px 8px", background: "#fff" }}>
                          <SearchIcon style={{ fontSize: "18px", color: "#999" }} />
                          <input
                            type="text" placeholder="Search by name, mobile, or city..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            autoFocus
                            style={{ flex: 1, border: "none", padding: "8px 4px", fontSize: "14px", outline: "none", background: "transparent" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {customerSearch && (
                            <button onClick={(e) => { e.stopPropagation(); setCustomerSearch(""); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#aaa", fontSize: "16px", padding: "4px" }}>✕</button>
                          )}
                        </div>
                      </div>

                      {customerSearch.trim() && (
                        <div style={{ padding: "6px 12px", fontSize: "11px", color: filteredCustomers.length > 0 ? "#4caf50" : "#e74c3c", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                          {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""} found
                        </div>
                      )}

                      {externalCustomers && externalCustomers.length > 0 ? (
                        customerSearch.trim() && filteredCustomers.length === 0 ? (
                          <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
                            <p>No customers found for "{customerSearch}"</p>
                          </div>
                        ) : (
                          (customerSearch.trim() ? filteredCustomers : externalCustomers).map(c => (
                            <div
                              key={c.id}
                              onClick={() => {
                                onCustomerChange && onCustomerChange(c);
                                setCustomerDropdownOpen(false);
                                setCustomerSearch("");
                                setContactNumber(c.mobile || "");
                                if (c.address) { setShippingAddress(c.address); setDeliveryAddress(c.address); }
                                if (c.brokerName && c.brokerName !== "0") {
                                  const found = availableBrokers.find(b => b.name.toLowerCase() === String(c.brokerName).trim().toLowerCase());
                                  setSelectedBroker(found || { id: null, name: String(c.brokerName).trim() });
                                } else { setSelectedBroker({ id: null, name: "" }); }
                                if (c.transporterName && c.transporterName !== "0") {
                                  const found = availableTransporters.find(t => t.name.toLowerCase() === String(c.transporterName).trim().toLowerCase());
                                  setSelectedTransporter(found || { id: null, name: String(c.transporterName).trim() });
                                } else { setSelectedTransporter({ id: null, name: "" }); }
                              }}
                              style={{
                                padding: "12px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
                                background: selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent",
                              }}
                              onMouseEnter={(e) => { if (selectedCustomer?.id !== c.id) e.currentTarget.style.background = "#faf6f2"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent"; }}
                            >
                              <div style={{ fontWeight: "600", fontSize: "14px", color: BROWN_DARK }}>{c.name}</div>
                              {(c.mobile || c.city) && (
                                <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                                  {c.mobile && <span>📱 {c.mobile}</span>}
                                  {c.city && <span> • 📍 {c.city}</span>}
                                </div>
                              )}
                              {(c.brokerName || c.transporterName) && (
                                <div style={{ fontSize: "10px", color: "#aaa", marginTop: "2px" }}>
                                  {c.brokerName && c.brokerName !== "0" && <span>🏢 {c.brokerName}</span>}
                                  {c.transporterName && c.transporterName !== "0" && <span> • 🚚 {c.transporterName}</span>}
                                </div>
                              )}
                            </div>
                          ))
                        )
                      ) : (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
                          <p>No customers available. Please make sure you are logged in.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div style={{ marginTop: "8px", padding: "8px 10px", background: "#f9f4ef", borderRadius: "6px", fontSize: "12px", color: "#666" }}>
                    {selectedCustomer.mobile && <span>📱 {selectedCustomer.mobile}</span>}
                    {selectedCustomer.city && <span> • 📍 {selectedCustomer.city}</span>}
                    {selectedBroker.name && <div style={{ marginTop: "2px" }}>🏢 Broker: {selectedBroker.name}</div>}
                    {selectedTransporter.name && <div>🚚 Transporter: {selectedTransporter.name}</div>}
                  </div>
                )}
              </div>

              {/* Broker – Searchable Dropdown */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Broker</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => { setBrokerDropdownOpen(prev => !prev); }}
                    style={{
                      padding: "10px 12px", border: `1px solid ${brokerDropdownOpen ? BROWN : "#ddd"}`,
                      borderRadius: "8px", fontSize: "14px", background: "#fff", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      color: selectedBroker.name ? BROWN_DARK : "#999",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {selectedBroker.name || "Select broker..."}
                    </span>
                    <span style={{ fontSize: "11px", marginLeft: "8px", color: BROWN_LIGHT, transform: brokerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </div>

                  {brokerDropdownOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                      background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 2000, maxHeight: "240px", overflowY: "auto",
                    }}>
                      <div style={{ padding: "8px", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, background: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                        <SearchIcon style={{ fontSize: "16px", color: "#999", flexShrink: 0 }} />
                        <input
                          type="text" placeholder="Search broker..." value={brokerSearch}
                          onChange={(e) => setBrokerSearch(e.target.value)}
                          autoFocus
                          style={{ flex: 1, border: `1px solid ${ACCENT}`, borderRadius: "6px", padding: "6px 8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {brokerSearch && (
                          <button onClick={(e) => { e.stopPropagation(); setBrokerSearch(""); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#aaa", fontSize: "16px", lineHeight: 1, padding: "0 2px" }}>×</button>
                        )}
                      </div>

                      {brokerSearch.trim() && (
                        <div style={{ padding: "4px 12px", fontSize: "11px", color: "#999", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                          {filteredBrokers.length} result{filteredBrokers.length !== 1 ? "s" : ""} for "{brokerSearch}"
                        </div>
                      )}

                      <div
                        onClick={() => { setSelectedBroker({ id: null, name: "" }); setBrokerDropdownOpen(false); setBrokerSearch(""); }}
                        style={{ padding: "10px 12px", borderBottom: "1px solid #f5f0eb", cursor: "pointer", fontSize: "13px", color: "#999", fontStyle: "italic" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#faf6f2"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >— None —</div>

                      {loadingBrokers ? (
                        <div style={{ padding: "16px", textAlign: "center" }}><CircularProgress size={16} style={{ color: BROWN }} /></div>
                      ) : filteredBrokers.length === 0 ? (
                        <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "13px" }}>No brokers found</div>
                      ) : (
                        filteredBrokers.map(broker => (
                          <div
                            key={broker.id}
                            onClick={() => { setSelectedBroker(broker); setBrokerDropdownOpen(false); setBrokerSearch(""); }}
                            style={{
                              padding: "10px 12px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
                              background: selectedBroker.id === broker.id ? "#f0e9e2" : "transparent",
                              fontSize: "13px", color: BROWN_DARK,
                            }}
                            onMouseEnter={(e) => { if (selectedBroker.id !== broker.id) e.currentTarget.style.background = "#faf6f2"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = selectedBroker.id === broker.id ? "#f0e9e2" : "transparent"; }}
                          >
                            <div style={{ fontWeight: "500" }}>{broker.name}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Transporter */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Transporter</label>
                <TransporterDropdown
                  selectedTransporter={selectedTransporter}
                  onSelectTransporter={(transporter) => setSelectedTransporter(transporter)}
                  availableTransporters={availableTransporters}
                  loading={loadingTransporters}
                  onOpen={fetchTransporters}
                  isMobile={true}
                />
              </div>

              {/* Contact Number */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Contact Number *</label>
                <input
                  type="tel" placeholder="Enter contact number" value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>

              {/* Shipping Address */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Shipping Address</label>
                <textarea
                  placeholder="Enter shipping address" value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Delivery Address</label>
                <textarea
                  placeholder="Enter delivery address" value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Description</label>
                <textarea
                  placeholder="Notes or description" value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
            </div>
          )}
        </div>

        {enhancedCartItems.length > 0 && (
          <div style={{ padding: "16px 20px", paddingBottom: `calc(16px + ${footerOffset}px)`, borderTop: "1px solid #eee", background: "#fff" }}>
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                style={{ width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
              >Proceed to Order Details →</button>
            ) : (
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                {localStorage.getItem('editOrderId') && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('editOrderId'); localStorage.removeItem('isEditingOrder'); localStorage.removeItem('editOrderData');
                      Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
                      localStorage.removeItem('cartItems'); onClose();
                    }}
                    style={{ flex: 1, padding: "14px", background: "#fff", color: "#d32f2f", border: "2px solid #d32f2f", borderRadius: "25px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
                  >Cancel</button>
                )}
                <button
                  onClick={handleCheckout} disabled={isProcessing}
                  style={{
                    flex: 2, padding: "14px",
                    background: localStorage.getItem('editOrderId') ? ACCENT : BROWN_DARK,
                    color: localStorage.getItem('editOrderId') ? BROWN_DARK : "#fff",
                    border: "none", borderRadius: "25px", fontSize: "15px", fontWeight: "600",
                    cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.7 : 1,
                  }}
                >{isProcessing ? 'Processing...' : (localStorage.getItem('editOrderId') ? 'Update Order' : 'Place Order')}</button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes blinker { 50% { opacity: 0; } }
      `}</style>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        // onLoginSuccess={() => { setIsLoginPopupOpen(false); window.location.reload(); }}
         onLoginSuccess={()=>{setIsLoginPopupOpen(false); window.location.reload();}}
  initialUsername={getContactNumberFromURL() || ""}
      />

      <Dialog
        open={showCreditLimitDialog}
        onClose={() => setShowCreditLimitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ fontWeight: "bold", color: "#e74c3c" }}>
          ⚠️ Credit Limit Exceeded
        </DialogTitle>
        <DialogContent>
          <p style={{ fontSize: "14px", color: "#333", marginBottom: "12px" }}>
            This order will take the customer's outstanding balance above their approved credit limit.
          </p>
          <div style={{
            background: "#fff3f3", border: "1px solid #e0b8b8",
            borderRadius: "8px", padding: "12px", fontSize: "14px",
          }}>
            <div>Outstanding: ₹{parseFloat(creditInfo?.outstanding || 0).toFixed(2)}</div>
            <div>Credit Limit: ₹{parseFloat(creditInfo?.creditLimit || 0).toFixed(2)}</div>
            <div>Current Order: ₹{computeOrderTotals().totalInvoiceValue.toFixed(2)}</div>
          </div>
          <p style={{ fontSize: "13px", color: "#666", marginTop: "12px" }}>
            Do you still want to place this order?
          </p>
        </DialogContent>
        <DialogActions style={{ padding: "16px" }}>
          <Button onClick={() => setShowCreditLimitDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => { setShowCreditLimitDialog(false); proceedCheckout(); }}
            variant="contained"
            style={{ backgroundColor: "#e74c3c", fontWeight: "bold" }}
          >
            Continue Anyway
          </Button>
        </DialogActions>
      </Dialog>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        onLoginSuccess={() => { setIsLoginPopupOpen(false); window.location.reload(); }}
      />
    </>
  );
};


// const getContactNumberFromURL = () => {
//   try {
//     const path = window.location.pathname;
//     // Match pattern like /1234567890/ or /1234567890
//     const match = path.match(/\/(\d{10,15})\/?$/);
//     if (match && match[1]) {
//       return match[1];
//     }
//     return null;
//   } catch (error) {
//     console.error("Error extracting contact number from URL:", error);
//     return null;
//   }
// };


const getContactNumberFromURL = () => {
  try {
    const path = window.location.pathname;
    const match = path.match(/\/(\d{10,15})\/?$/);
    if (match && match[1]) {
      let number = match[1];
      if (number.length > 10 && number.startsWith('91')) {
        number = number.slice(2);
      }
      return number;
    }
    return null;
  } catch (error) {
    console.error("Error extracting contact number from URL:", error);
    return null;
  }
};



// export default function SMTraders() {
//   const navigate = useNavigate();

//   const [quantities, setQuantities] = useState({});
//   const [search, setSearch] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [stockGroups, setStockGroups] = useState([]);
//   const [posGroups, setPosGroups] = useState([]);
//   const [displayProducts, setDisplayProducts] = useState([]);
//   const [selectedStockGroup, setSelectedStockGroup] = useState("All");
//   const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
//   const [showPOSGroups, setShowPOSGroups] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
//   const [viewMode, setViewMode] = useState('categories');

//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isMobileCartDrawerOpen, setIsMobileCartDrawerOpen] = useState(false);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
//   const [userType, setUserType] = useState("");

//   const [customers, setCustomers] = useState([]);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   // const [showSaleOrders, setShowSaleOrders] = useState(false);


//   const handleSaleOrdersClick = () => setShowSaleOrders(true);
//   const handleDashboard = () => setShowDashboard(true);
//   const [showSaleOrders, setShowSaleOrders] = useState(false);
//    const [showDashboard, setShowDashboard] = useState(() => window.innerWidth <= 768);

   

//   useEffect(() => {
//     const isEditing = localStorage.getItem('isEditingOrder');
//     const editData = localStorage.getItem('editOrderData');
//     const savedCustomer = localStorage.getItem('selectedCustomer');
//     if (isEditing === 'true' && editData) {
//       try {
//         const parsed = JSON.parse(editData);
//         if (parsed.cartItems && Object.keys(parsed.cartItems).length > 0) setQuantities(parsed.cartItems);
//         if (parsed.customerDetails) {
//           setSelectedCustomer(parsed.customerDetails);
//           localStorage.setItem('selectedCustomer', JSON.stringify(parsed.customerDetails));
//           localStorage.setItem('selectedCustomerId', parsed.customerDetails.id);
//         }
//         toast.info("Edit mode active - make your changes and click Update");
//       } catch (e) { console.error("Error restoring edit state:", e); }
//     } else if (savedCustomer && !selectedCustomer) {
//       try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
//     }
//   }, []);

//   const handleBackFromSaleOrders = () => {
//     setShowSaleOrders(false);
//     const isEditing = localStorage.getItem('isEditingOrder');
//     const editData = localStorage.getItem('editOrderData');
//     if (isEditing === 'true' && editData) {
//       const savedCustomer = localStorage.getItem("selectedCustomer");
//       if (savedCustomer && !selectedCustomer) {
//         try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
//       }
//       const savedCart = localStorage.getItem('cartItems');
//       if (savedCart && Object.keys(quantities).length === 0) {
//         try { setQuantities(JSON.parse(savedCart)); } catch (e) { console.error(e); }
//       }
//       toast.info("Edit mode active - make your changes and click Update");
//     }
//     checkLoginStatus();
//   };

//   useEffect(() => {
//     const savedCustomer = localStorage.getItem("selectedCustomer");
//     if (savedCustomer && !selectedCustomer) {
//       try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedCustomer) {
//       localStorage.setItem("selectedCustomer", JSON.stringify(selectedCustomer));
//       localStorage.setItem("selectedCustomerId", selectedCustomer.id);
//     }
//   }, [selectedCustomer]);

//   const fetchCompleteCustomerDetails = async (customerId) => {
//     try {
//       const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
//       if (response?.success && Array.isArray(response.data)) {
//         const customer = response.data.find(c => String(c.Customer_Id) === String(customerId));
//         if (customer) {
//           return {
//             brokerId: customer.Broker_Id ? String(customer.Broker_Id).trim() : "",
//             brokerName: customer.Broker_Name || customer.Broker || "",
//             transporterId: customer.Transporter_Id ? String(customer.Transporter_Id).trim() : "",
//             transporterName: customer.Transporter_Name || customer.Transporter || "",
//           };
//         }
//       }
//     } catch (error) { console.error("Error fetching customer details:", error); }
//     return null;
//   };

//   const checkLoginStatus = () => {
//     try {
//       const user = localStorage.getItem("user");
//       const session = localStorage.getItem("session");
//       const loginAt = localStorage.getItem("loginAt");
//       const storedUserType = localStorage.getItem("userType") || "employee";

//       if (user && session && loginAt) {
//         setIsLoggedIn(true); setUserType(storedUserType);
//         let userData;
//         try { userData = JSON.parse(user); } catch (e) { userData = user; }
//         const sessionData = JSON.parse(session);

//         let customerList = [];
//         if (sessionData?.customer && Array.isArray(sessionData.customer)) {
//           customerList = sessionData.customer.map(c => ({
//             id: c.Ret_Id,
//             name: c.Ledger_Name || c.Party_Mailing_Name || c.A1,
//             billName: c.Party_Name || c.Ledger_Name,
//             mobile: c.A1 || "",
//             city: c.Party_Location || "",
//             address: c.Party_Mailing_Address || "",
//             brokerId: c.Broker_Id || c.Ref_Brokers || "",
//             brokerName: c.Broker_Name || "",
//             transporterId: c.Transporter_Id || "",
//             transporterName: c.Transporter_Name || "",
//             ledgerName: c.Ledger_Name,
//             partyMailingAddress: c.Party_Mailing_Address,
//             partyMailingName: c.Party_Mailing_Name,
//             ledgerTallyId: c.Ledger_Tally_Id,
//           }));
//         }
//         if (customerList.length > 0) setCustomers(customerList);

//         if (storedUserType === "customer" || storedUserType === "employee") {
//           const savedCustomerId = localStorage.getItem("selectedCustomerId");
//           let defaultCustomer = null;
//           if (savedCustomerId && customerList.length > 0) defaultCustomer = customerList.find(c => c.id === savedCustomerId);
//           if (!defaultCustomer && customerList.length > 0) defaultCustomer = customerList[0];
//           if (defaultCustomer) {
//             (async () => {
//               const details = await fetchCompleteCustomerDetails(defaultCustomer.id);
//               const finalCustomer = details
//                 ? { ...defaultCustomer, brokerId: details.brokerId || defaultCustomer.brokerId, brokerName: details.brokerName || defaultCustomer.brokerName, transporterId: details.transporterId || defaultCustomer.transporterId, transporterName: details.transporterName || defaultCustomer.transporterName }
//                 : { ...defaultCustomer };
//               setSelectedCustomer(finalCustomer);
//               localStorage.setItem("selectedCustomerId", finalCustomer.id);
//               localStorage.setItem("selectedCustomer", JSON.stringify(finalCustomer));
//             })();
//           }
//           const name = sessionData.username || userData?.Name || userData?.User_Name || "User";
//           setUserName(name);
//         }
//       } else {
//         setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
//       }
//     } catch (error) {
//       console.error("Error checking login status:", error);
//       setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
//     }
//   };

// const handleLoginSuccess = () => {
//   checkLoginStatus();
//   if (showSaleOrders) {
//     window.location.reload();
//   }
// };

//   const handleLogout = () => {
//     ["user", "session", "loginAt", "userType", "retId", "selectedCustomerId", "selectedCustomer","username"].forEach(k => localStorage.removeItem(k));
//     setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
//     toast.success("Logged out successfully");
//   };

//   const fetchCustomers = async () => {
//     setLoadingCustomers(true);
//     try {
//       const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=100000&page=1` });
//       if (response?.success && Array.isArray(response.data)) {
//         setCustomers(response.data.map((c) => ({
//           id: c.Customer_Id || c.Ret_Id,
//           name: (c.Short_Name || c.Billl_Name || "").replace(/\u0004/g, "").trim(),
//           billName: (c.Billl_Name || "").trim(),
//           mobile: (c.Mobile_No || "").trim(),
//           city: (c.City || "").trim(),
//           address: (c.Address || "").trim(),
//           brokerId: c.Broker_Id || "",
//           brokerName: (c.Broker_Name || c.Broker || "").trim(),
//           transporterId: c.Transporter_Id || "",
//           transporterName: (c.Transporter_Name || c.Transporter || "").trim(),
//           partyMailingName: c.Party_Mailing_Name || c.Billl_Name || "",
//           partyMailingAddress: c.Party_Mailing_Address || c.Address || "",
//         })));
//       }
//     } catch (error) { console.error("Error fetching customers:", error); toast.error("Failed to load customers"); }
//     finally { setLoadingCustomers(false); }
//   };

//   const formatProduct = (product) => {
//     const uniqueId = String(product.Product_Id);
//     const balQty = parseFloat(product.Bal_Qty) || 0;
//     const packGet = parseFloat(product.PackGet) || 1;
//     const stockInBags = packGet > 0 ? balQty / packGet : 0;
//     const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
//     return {
//       id: uniqueId, name: product.Product_Name || product.Stock_Item || "Unknown",
//       fullName: product.Product_Name || "Unknown", shortName: product.Short_Name,
//       weight: product.PackGet ? `${product.PackGet}kg` : "N/A",
//       stockGroup: product.Stock_Group || "General", posGroup: product.POS_Group || "General",
//       price, stock: stockInBags, unit: product.Units || "Bags",
//       image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=116&fit=crop",
//       coolie: product.Coolie, brokerage: product.NagalBrokerage || product.Brokerage,
//       packGet: product.PackGet, hsnCode: product.HSN_Code, balQty,
//       originalProduct: product, isInStock: stockInBags > 0,
//     };
//   };

//   const deduplicateProducts = (products) => {
//     const map = new Map();
//     products.forEach((p) => { if (!map.has(p.Product_Id)) map.set(p.Product_Id, p); });
//     return Array.from(map.values());
//   };

//   const mergeProductData = (productList, stockResponse) => {
//     if (!productList?.length) return [];
//     let stockData = [];
//     if (stockResponse?.success && stockResponse.data?.Pos_Product) {
//       const pp = stockResponse.data.Pos_Product;
//       stockData = Array.isArray(pp) ? pp[0]?.Product_Entry || [] : pp.Product_Entry || [];
//     }
//     const stockMap = new Map();
//     stockData.forEach((item) => stockMap.set(String(item.Product_Id).trim(), item));
//     return productList.map((product) => {
//       const si = stockMap.get(String(product.Product_Id).trim());
//       return si
//         ? { ...product, Bal_Qty: si.Bal_Qty || 0, Price: si.Price || product.Product_Rate || 0, _hasStock: true }
//         : { ...product, Bal_Qty: 0, Price: product.Product_Rate || 0, _hasStock: false };
//     });
//   };

//   const fetchAllData = async () => {
//     setLoadingProducts(true);
//     try {
//       const [posResponse, stockResponse] = await Promise.all([
//         fetchLink({ address: `pos/posProductList` }),
//         fetchLink({ address: `pos/productMaster` }),
//       ]);
//       let productList = [];
//       if (posResponse?.success && posResponse.data) productList = posResponse.data;
//       const merged = mergeProductData(productList, stockResponse);
     
//       const unique = deduplicateProducts(merged);
    
//       const active = unique.filter((p) => p.Active_Deactive === 1 || p.Active_Deactive === 1 || p.Active_Deactive === 1);
//       const inStock = active.filter((p) => {
//         const bq = parseFloat(p.Bal_Qty) || 0;
//         const pg = parseFloat(p.PackGet) || 1;
//         return pg > 0 ? bq / pg > 0 : false;
//       });
//       setAllProducts(inStock); setDisplayProducts(inStock);
//       localStorage.setItem("products", JSON.stringify(inStock.map(formatProduct)));
//       setInitialLoadDone(true);
//     } catch (error) { toast.error("Failed to load products"); }
//     finally { setLoadingProducts(false); }
//   };

//   useEffect(() => { checkLoginStatus(); }, []);
//   useEffect(() => { if (isLoggedIn && userType === "employee") fetchCustomers(); }, [isLoggedIn, userType]);
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const load = () => {
//       try {
//         const saved = localStorage.getItem("cartItems");
//         if (saved) setQuantities(JSON.parse(saved));
//       } catch (e) { console.error(e); }
//     };
//     load();
//     const onVisible = () => { if (document.visibilityState === "visible") load(); };
//     const onFocus = () => load();
//     const onStorage = (e) => { if (e.key === "cartItems") load(); };
//     document.addEventListener("visibilitychange", onVisible);
//     window.addEventListener("focus", onFocus);
//     window.addEventListener("storage", onStorage);
//     return () => {
//       document.removeEventListener("visibilitychange", onVisible);
//       window.removeEventListener("focus", onFocus);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   useEffect(() => { if (initialLoadDone) localStorage.setItem("cartItems", JSON.stringify(quantities)); }, [quantities, initialLoadDone]);
//   useEffect(() => { fetchAllData(); }, []);

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const groups = [...new Set(allProducts.map((p) => p.Stock_Group))]
//         .filter((g) => g && g.trim() && g !== "NOT FOUND" && g !== "NULL").sort()
//         .map((g) => ({ id: g, name: g }));
//       setStockGroups([{ id: "All", name: "All" }, ...groups]);
//     }
//   }, [allProducts]);

//   const extractPOSGroups = (list) =>
//     [...new Set(list.map((p) => (p.POS_Group || "").trim()))]
//       .filter((g) => g && g !== "NULL")
//       .map((g) => ({ posGroup: g, itemCount: list.filter((p) => (p.POS_Group || "").trim() === g).length }))
//       .sort((a, b) => a.posGroup.localeCompare(b.posGroup));

//   const handleStockGroupClick = (group) => {
//     setSelectedPOSGroup(null); setSelectedStockGroup(group.id); setViewMode('products');
//     if (group.id === "All") {
//       setDisplayProducts(allProducts); setShowPOSGroups(false); setPosGroups([]);
//     } else {
//       const filtered = allProducts.filter((p) => (p.Stock_Group || "").trim() === group.id.trim());
//       setDisplayProducts(filtered);
//       const pgl = extractPOSGroups(filtered);
//       setPosGroups(pgl); setShowPOSGroups(true);
//       if (isMobile && pgl.length > 0) setIsDrawerOpen(true);
//     }
//   };

//   const handleBackToCategories = () => { setSelectedStockGroup("All"); setSearch(""); setViewMode('categories'); };
//   const handlePOSGroupClick = (posGroup) => {
//     setSelectedPOSGroup(posGroup);
//     setDisplayProducts(allProducts.filter((p) =>
//       (p.Stock_Group || "").trim() === selectedStockGroup.trim() &&
//       (p.POS_Group || "").trim() === posGroup.trim()
//     ));
//     if (isMobile) setIsDrawerOpen(false);
//   };
//   const handleAllPOSGroupsClick = () => {
//     setSelectedPOSGroup(null);
//     setDisplayProducts(allProducts.filter((p) => (p.Stock_Group || "").trim() === selectedStockGroup.trim()));
//     if (isMobile) setIsDrawerOpen(false);
//   };

//   const updateQty = (id, delta) => {
//     setQuantities((prev) => {
//       const next = Math.max(0, (prev[id] || 0) + delta);
//       if (next === 0) { const { [id]: _, ...rest } = prev; return rest; }
//       return { ...prev, [id]: next };
//     });
//   };

//   const handleRemoveItem = (id) => {
//     setQuantities(prev => {
//       const { [id]: _, ...rest } = prev;
//       localStorage.setItem("cartItems", JSON.stringify(rest));
//       return rest;
//     });
//   };

//   const selectedCount = Object.values(quantities).reduce((s, q) => s + q, 0);
//   const totalAmount = Object.entries(quantities).reduce((s, [id, qty]) => {
//     const p = allProducts.find((p) => String(p.Product_Id) === id);
//     return p ? s + (parseFloat(p.Price) || parseFloat(p.Product_Rate) || 0) * qty : s;
//   }, 0);

//   const filtered = displayProducts.filter((p) => {
//     const bq = parseFloat(p.Bal_Qty) || 0;
//     const pg = parseFloat(p.PackGet) || 1;
//     if (pg > 0 ? bq / pg <= 0 : true) return false;
//     if (!search) return true;
//     const normalize = (str) => (str || "").toLowerCase().replace(/[.\-_\s]+/g, "");
//     const sl = normalize(search);
//     return (
//       normalize(p.Product_Name).includes(sl) || normalize(p.Short_Name).includes(sl) ||
//       normalize(p.POS_Group).includes(sl) || normalize(p.Stock_Group).includes(sl) ||
//       (p.Product_Name && p.Product_Name.toLowerCase().includes(search.toLowerCase())) ||
//       (p.Short_Name && p.Short_Name.toLowerCase().includes(search.toLowerCase()))
//     );
//   });

//   const formattedProducts = allProducts.map(formatProduct);

//   const handleCartClick = async () => {
//     localStorage.setItem('cartItems', JSON.stringify(quantities));
//     localStorage.setItem('products', JSON.stringify(formattedProducts));
//     if (isMobile) {
//       setIsMobileCartDrawerOpen(true);
//     } else {
//       const navigationState = {};
//       if (selectedCustomer) {
//         let customerData = { ...selectedCustomer };
//         if ((!customerData.brokerName || !customerData.transporterName) && userType === "customer") {
//           const details = await fetchCompleteCustomerDetails(customerData.id);
//           if (details) {
//             customerData = { ...customerData, brokerId: details.brokerId || customerData.brokerId, brokerName: details.brokerName || customerData.brokerName, transporterId: details.transporterId || customerData.transporterId, transporterName: details.transporterName || customerData.transporterName };
//             setSelectedCustomer(customerData);
//             localStorage.setItem("selectedCustomer", JSON.stringify(customerData));
//           }
//         }
//         navigationState.selectedCustomer = {
//           id: customerData.id, name: customerData.name, billName: customerData.billName,
//           mobile: customerData.mobile, city: customerData.city, address: customerData.address,
//           brokerId: customerData.brokerId, brokerName: customerData.brokerName,
//           transporterId: customerData.transporterId, transporterName: customerData.transporterName,
//         };
//       }
//       if (selectedCustomer) localStorage.setItem('selectedCustomerData', JSON.stringify(navigationState.selectedCustomer));
//       navigate('/cart', { state: navigationState });
//     }
//   };

//   const handleSelectCustomer = async (customer) => {
//     if (!customer || !customer.id) return;
//     let updatedCustomer = { ...customer };
//     try {
//       const response = await fetchLink({
//         address: `pos/retailerMasterOptRetailerId?Customer_Id=${customer.id}&limit=10000000&page=1`,
//       });
//       if (response?.success && Array.isArray(response.data)) {
//         const found = response.data.find(c => String(c.Customer_Id) === String(customer.id));
//         if (found) {
//           updatedCustomer = {
//             ...customer,
//             brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : customer.brokerId || "",
//             brokerName: found.Broker_Name || found.Broker || customer.brokerName || "",
//             transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : customer.transporterId || "",
//             transporterName: found.Transporter_Name || found.Transporter || customer.transporterName || "",
//             partyMailingName: found.Party_Mailing_Name || found.Billl_Name || customer.name || "",
//             partyMailingAddress: found.Party_Mailing_Address || found.Address || customer.address || "",
//             billName: found.Billl_Name || customer.name || "",
//           };
//         }
//       }
//     } catch (error) { console.error("Error fetching complete customer details:", error); }
//     setSelectedCustomer(updatedCustomer);
//     localStorage.setItem("selectedCustomerId", String(updatedCustomer.id));
//     localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
//     localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(updatedCustomer));
//     localStorage.setItem("cartPageSelectedCustomerId", String(updatedCustomer.id));
//   };

//   const MobileDrawer = () => (
//     <>
//       {isDrawerOpen && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setIsDrawerOpen(false)} />}
//       <div style={{
//         position: "fixed", top: 0, left: 0, bottom: 0, width: "85%", maxWidth: "320px",
//         backgroundColor: "#fff", zIndex: 1000,
//         transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
//         transition: "transform 0.1s ease-in-out", overflowY: "auto",
//         boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
//       }}>
//         <div style={{
//           padding: "20px 16px", backgroundColor: BROWN_DARK, color: "#fff",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           position: "sticky", top: 0, zIndex: 10,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FilterListIcon style={{ fontSize: "20px" }} />
//             <span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedStockGroup} - POS Groups</span>
//           </div>
//           <CloseIcon style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setIsDrawerOpen(false)} />
//         </div>
//         <div style={{ padding: "16px" }}>
//           {showPOSGroups && posGroups.length > 0 ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//               <button
//                 onClick={handleAllPOSGroupsClick}
//                 style={{
//                   padding: "12px 16px", borderRadius: "8px", border: "none",
//                   backgroundColor: selectedPOSGroup === null ? BROWN_DARK : "#f5f0eb",
//                   color: selectedPOSGroup === null ? "#fff" : BROWN_DARK,
//                   fontSize: "14px", cursor: "pointer",
//                   fontWeight: selectedPOSGroup === null ? "bold" : "normal",
//                   textAlign: "left", width: "100%",
//                 }}
//               >All POS Groups ({displayProducts.length})</button>
//               {posGroups.map((group, i) => (
//                 <button
//                   key={i} onClick={() => handlePOSGroupClick(group.posGroup)}
//                   style={{
//                     padding: "12px 16px", borderRadius: "8px", border: "none",
//                     backgroundColor: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#f5f0eb",
//                     color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK,
//                     fontSize: "14px", cursor: "pointer",
//                     fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal",
//                     textAlign: "left", width: "100%",
//                   }}
//                 >{group.posGroup} ({group.itemCount})</button>
//               ))}
//             </div>
//           ) : (
//             <div style={{ textAlign: "center", padding: "40px 20px", color: "#999", fontSize: "14px" }}>
//               No POS groups available for this category
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );

//   const mediaQueryStyles = `
//     @media screen and (max-width: 768px) { .products-grid { grid-template-columns: 1fr !important; gap: 12px !important; padding: 12px !important; } .product-card { width: 100% !important; height: auto !important; min-height: 140px !important; } .category-filters { padding: 8px 12px !important; } }
//     @media screen and (max-width: 480px) { .mobile-drawer { width: 85% !important; max-width: 280px !important; } .cart-summary { padding: 10px 16px !important; } }
//     @media screen and (min-width: 1600px) { .products-grid { max-width: 1800px !important; margin: 0 auto !important; grid-template-columns: repeat(4, 1fr) !important; } }
//   `;

//   const isCategoryReduced = selectedStockGroup !== "All";

//   return (
//     <>
//       <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
//   {showDashboard ? (
//         <Dashboard
//           isMobile={isMobile}
//           isLoggedIn={isLoggedIn}
//           userName={userName}
//           customers={customers}
//           allProducts={allProducts}
//           onLoginClick={() => setIsLoginPopupOpen(true)}
//           onLogout={handleLogout}
//           onHome={() => { setShowDashboard(false); setShowSaleOrders(false); }}
//           onSaleOrders={() => { setShowDashboard(false); setShowSaleOrders(true); }}
//           activeTab="dashboard"
//         />
//       ) : showSaleOrders ? (
//         <SaleOrders onBack={handleBackFromSaleOrders} />
//       ) : (
//        <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile ? (selectedCount > 0 ? "100px" : "80px") : "0"}}>
//           <style>{mediaQueryStyles}</style>

//           <CommonHeader
//             title="SM Traders" logo="SMT" showSearch={false} showCart={true}
//             showBackButton={false} showTitle={true} cartItemCount={selectedCount}
//             selectedCount={selectedCount} onCartClick={handleCartClick}
//             handleCartClick={handleCartClick} isMobile={isMobile}
//             backgroundColor={BROWN_DARK} isLoggedIn={isLoggedIn} userName={userName}
//             showCustomerSelector={isLoggedIn && customers.length > 0}
//             customers={customers} selectedCustomer={selectedCustomer}
//             onCustomerSelect={handleSelectCustomer} loadingCustomers={loadingCustomers}
//             userType={userType}
//             customActions={
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "auto" }}>
//                 <ThreeDotMenu
//                   isLoggedIn={isLoggedIn} userName={userName}
//                   onLogout={handleLogout} onLoginClick={() => setIsLoginPopupOpen(true)}
//                   onSaleOrders={handleSaleOrdersClick}
//                   onDashboard={handleDashboard}
//                 />
//               </div>
//             }
//           />

//           {isMobile && viewMode === 'categories' && (
//             <div style={{ padding: "16px", background: "#f5f0eb", minHeight: "calc(100vh - 120px)" }}>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
//                 {stockGroups.filter((g) => g.id !== "All").map((group) => (
//                   <div
//                     key={group.id} onClick={() => handleStockGroupClick(group)}
//                     style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "180px" }}
//                   >
//                     <div style={{ height: "130px", position: "relative", overflow: "hidden" }}>
//                       <img src={getCategoryImage(group.name)} alt={group.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                       <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)" }} />
//                     </div>
//                     <div style={{ padding: "12px", background: BROWN_DARK, color: "#fff", textAlign: "center", fontSize: "14px", fontWeight: "600" }}>{group.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(viewMode === 'products' || !isMobile) && (
//             <>
//               {isMobile && (
//                 <div style={{ padding: "12px 16px", background: "#f5f0eb", borderBottom: "1px solid #ddd" }}>
//                   <button
//                     onClick={handleBackToCategories}
//                     style={{ background: "transparent", border: `1px solid ${BROWN_DARK}`, borderRadius: "20px", padding: "8px 16px", color: BROWN_DARK, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
//                   ><span>←</span> Back to Categories</button>
//                 </div>
//               )}

//               {!isMobile && (
//                 <div className="category-filters" style={{ background: "#f5f0eb", padding: "24px", borderBottom: "1px solid #ddd", position: "sticky", top: 68, zIndex: 90, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
//                   {loadingProducts ? (
//                     <div style={{ textAlign: "center", padding: "20px", width: "100%", color: "#999" }}>Loading categories...</div>
//                   ) : (
//                     <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", gap: "12px", margin: 0, padding: "0 0 12px 0", scrollbarWidth: "thin", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
//                       {stockGroups.filter((g) => g.id !== "All").map((group) => (
//                         <CategoryCard key={group.id} category={{ name: group.name }} isSelected={selectedStockGroup === group.id} onClick={() => handleStockGroupClick(group)} isMobile={isMobile} isReduced={isCategoryReduced} />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {!isMobile && showPOSGroups && (
//                 <div className="pos-groups-container" style={{ background: "#f9f4ef", padding: "15px 24px", borderBottom: "1px solid #e8ddd4" }}>
//                   <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                     <button
//                       onClick={handleAllPOSGroupsClick}
//                       style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === null ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === null ? BROWN_DARK : "#fff", color: selectedPOSGroup === null ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === null ? "bold" : "normal" }}
//                     >All POS Groups ({displayProducts.length})</button>
//                     {posGroups.length > 0 ? posGroups.map((group, i) => (
//                       <button
//                         key={i} onClick={() => handlePOSGroupClick(group.posGroup)}
//                         style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === group.posGroup ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#fff", color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal" }}
//                       >{group.posGroup} ({group.itemCount})</button>
//                     )) : <div style={{ color: "#666", fontStyle: "italic", padding: "8px" }}>No POS groups available</div>}
//                   </div>
//                 </div>
//               )}

//               <div className="products-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(420px, 1fr))", gap: isMobile ? 16 : 24, padding: isMobile ? "16px" : "24px 24px 40px", maxWidth: 1800, margin: "0 auto", justifyContent: "center" }}>
//                 {loadingProducts ? (
//                   <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>Loading products...</div>
//                 ) : filtered.length > 0 ? (
//                   filtered.map((product) => {
//                     const formatted = formatProduct(product);
//                     return (
//                       <div key={formatted.id} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//                         <ProductCard product={formatted} quantity={quantities[formatted.id] || 0} onUpdateQty={updateQty} isMobile={isMobile} />
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>No products found</div>
//                 )}
//               </div>
//             </>
//           )}

//           {isMobile && !showDashboard && <MobileDrawer />}
//           {isMobile && !showDashboard && (
//             <MobileOrderSummary
//               selectedCount={selectedCount}
//               totalAmount={totalAmount}
//               onGoToCart={handleCartClick}
//               footerOffset={isMobile ? 64 : 0}
//             />
//           )}
//           <MobileCartDrawer
//             isOpen={isMobileCartDrawerOpen} onClose={() => setIsMobileCartDrawerOpen(false)}
//             cartItems={quantities} products={formattedProducts} allProducts={allProducts}
//             onUpdateQty={updateQty} onRemoveItem={handleRemoveItem}
//             isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginPopupOpen(true)}
//             selectedCustomer={selectedCustomer} userType={userType}
//             externalCustomers={customers} onCustomerChange={handleSelectCustomer}
//             footerOffset={isMobile ? 64 : 0}
//           />
//           {isMobile && (
//             <MobileTabBar
//               activeTab={showDashboard ? "dashboard" : "home"}
//               onHome={() => { setShowDashboard(false); setShowSaleOrders(false); }}
//               onDashboard={() => { setShowDashboard(true); setShowSaleOrders(false); }}
//               onCart={handleCartClick}
//               cartCount={selectedCount}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// }

export default function SMTraders() {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [stockGroups, setStockGroups] = useState([]);
  const [posGroups, setPosGroups] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [selectedStockGroup, setSelectedStockGroup] = useState("All");
  const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
  const [showPOSGroups, setShowPOSGroups] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [viewMode, setViewMode] = useState('categories');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileCartDrawerOpen, setIsMobileCartDrawerOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [userType, setUserType] = useState("");

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSaleOrders, setShowSaleOrders] = useState(false);
  const [showDashboard, setShowDashboard] = useState(() => window.innerWidth <= 768);

//  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
const [pendingUsername, setPendingUsername] = useState(""); 

  // const getContactNumberFromURL = useCallback(() => {
  //   try {
  //     const path = window.location.pathname;

  //     const match = path.match(/\/(\d{10,15})\/?$/);
  //     if (match && match[1]) {
  //       return match[1];
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Error extracting contact number from URL:", error);
  //     return null;
  //   }
  // }, []);





  
  const getContactNumberFromURL = useCallback(() => {
  try {
    const path = window.location.pathname;
    const match = path.match(/\/(\d{10,15})\/?$/);
    if (match && match[1]) {
      let number = match[1];
      if (number.length > 10 && number.startsWith('91')) {
        number = number.slice(2);
      }
      return number;
    }
    return null;
  } catch (error) {
    console.error("Error extracting contact number from URL:", error);
    return null;
  }
},[]);

  

  const isProfileRoute = useCallback(() => {
  try {
    return window.location.pathname.includes('/profile/');
  } catch (error) {
    return false;
  }
}, []);

//   const handleAutoLoginWithContact = useCallback(async (contactNumber) => {
//   try {
//     console.log("contactnumber", contactNumber);
//     const data = await fetchLink({
//       address: `authorization/getUserTypeAuth`,
//       method: "POST",
//       bodyData: { username: contactNumber },
//     });

//     if (!data.success) {
//       toast.error("User not found with this contact number");
//       return false;
//     }

//     if (data.requirePassword) {
//       // Don't attempt login with a blank password — it will always fail.
//       // Instead, open the login popup directly on the password step.
//       setPendingUsername(contactNumber);   // NEW state, see below
//       setIsLoginPopupOpen(true);
//       return false;
//     } else {
//       const customer = data.customer || {};
//       const username = customer.A1 || contactNumber;

//       localStorage.setItem("user", JSON.stringify({
//         ...customer,
//         Name: username,
//         Ret_Id: customer.Ret_Id,
//         UserId: customer.Ret_Id
//       }));

//       localStorage.setItem("session", JSON.stringify({
//         username: contactNumber,
//         ...data,
//         retId: customer.Ret_Id,
//         userId: customer.Ret_Id
//       }));

//       localStorage.setItem("loginAt", new Date().toString());
//       localStorage.setItem("username", contactNumber);
//       localStorage.setItem("userType", "customer");
//       localStorage.setItem("retId", customer.Ret_Id || "");

//       toast.success("Auto-login successful!");
//       return true;
//     }
//   } catch (error) {
//     console.error("Auto-login error:", error);
//     toast.error("Auto-login failed. Please try manually.");
//     return false;
//   }
// }, []);

  // const handleAutoLoginWithContact = useCallback(async (contactNumber) => {
  //   try {
  //     console.log("contactnumber",contactNumber)
  //     const data = await fetchLink({
  //       address: `authorization/getUserTypeAuth`,
  //       method: "POST",
  //       bodyData: { username: contactNumber },
  //     });

  //     if (!data.success) {
  //       toast.error("User not found with this contact number");
  //       return false;
  //     }

  //     if (data.requirePassword) {
  //       const passHash = await encryptPasswordFun("");
  //       const loginData = await fetchLink({
  //         address: `authorization/login`,
  //         method: "POST",
  //         bodyData: { 
  //           username: contactNumber, 
  //           password: passHash, 
  //           APP_Type: 2 
  //         },
  //       });

  //       if (loginData.success) {
  //         const { user, sessionInfo } = loginData;
  //         localStorage.setItem("user", JSON.stringify(user));
  //         localStorage.setItem("session", JSON.stringify(sessionInfo));
  //         localStorage.setItem("loginAt", new Date().toString());
  //         localStorage.setItem("userType", "customer");
  //         localStorage.setItem("username", contactNumber);
          
  //         if (user.Ret_Id) {
  //           localStorage.setItem("retId", user.Ret_Id);
  //         }
          
  //         toast.success("Auto-login successful!");
  //         return true;
  //       } else {
  //         toast.error("Please login manually");
  //         return false;
  //       }
  //     } else {
  //       const customer = data.customer || {};
  //       const username = customer.A1 || contactNumber;
        
  //       localStorage.setItem("user", JSON.stringify({ 
  //         ...customer, 
  //         Name: username,
  //         Ret_Id: customer.Ret_Id,
  //         UserId: customer.Ret_Id 
  //       }));
        
  //       localStorage.setItem("session", JSON.stringify({ 
  //         username: contactNumber, 
  //         ...data,
  //         retId: customer.Ret_Id,
  //         userId: customer.Ret_Id 
  //       }));
        
  //       localStorage.setItem("loginAt", new Date().toString());
  //       localStorage.setItem("username", contactNumber);
  //       localStorage.setItem("userType", "customer");
  //       localStorage.setItem("retId", customer.Ret_Id || "");
        
  //       toast.success("Auto-login successful!");
  //       return true;
  //     }
  //   } catch (error) {
  //     console.error("Auto-login error:", error);
  //     toast.error("Auto-login failed. Please try manually.");
  //     return false;
  //   }
  // }, []);


const handleAutoLoginWithContact = useCallback(async (contactNumber) => {
  try {
    const data = await fetchLink({
      address: `authorization/getUserTypeAuth`,
      method: "POST",
      bodyData: { username: contactNumber },
    });

    if (!data.success) {
      toast.error("User not found with this contact number");
      return false;
    }

    if (data.requirePassword) {
      // This account needs a real password — don't attempt a blank-password login.
      // Just open the login popup, prefilled with the number.
      return "requirePassword";
    }

    // No password required — safe to auto-login directly
    const customer = data.customer || {};
    const username = customer.A1 || contactNumber;

    localStorage.setItem("user", JSON.stringify({
      ...customer,
      Name: username,
      Ret_Id: customer.Ret_Id,
      UserId: customer.Ret_Id
    }));

    localStorage.setItem("session", JSON.stringify({
      username: contactNumber,
      ...data,
      retId: customer.Ret_Id,
      userId: customer.Ret_Id
    }));

    localStorage.setItem("loginAt", new Date().toString());
    localStorage.setItem("username", contactNumber);
    localStorage.setItem("userType", "customer");
    localStorage.setItem("retId", customer.Ret_Id || "");

    toast.success("Auto-login successful!");
    return true;
  } catch (error) {
    console.error("Auto-login error:", error);
    toast.error("Auto-login failed. Please try manually.");
    return false;
  }
}, []);


  const proceedWithLogin = useCallback((userData, sessionData, userTypeParam) => {
    setIsLoggedIn(true);
    setUserType(userTypeParam);
    
    let user;
    try {
      user = typeof userData === 'string' ? JSON.parse(userData) : userData;
    } catch (e) {
      user = userData;
    }
    
    const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
    
    let customerList = [];
    if (session?.customer && Array.isArray(session.customer)) {
      customerList = session.customer.map(c => ({
        id: c.Ret_Id,
        name: c.Ledger_Name || c.Party_Mailing_Name || c.A1,
        billName: c.Party_Name || c.Ledger_Name,
        mobile: c.A1 || "",
        city: c.Party_Location || "",
        address: c.Party_Mailing_Address || "",
        brokerId: c.Broker_Id || c.Ref_Brokers || "",
        brokerName: c.Broker_Name || "",
        transporterId: c.Transporter_Id || "",
        transporterName: c.Transporter_Name || "",
        ledgerName: c.Ledger_Name,
        partyMailingAddress: c.Party_Mailing_Address,
        partyMailingName: c.Party_Mailing_Name,
        ledgerTallyId: c.Ledger_Tally_Id,
      }));
    }
    
    if (customerList.length > 0) setCustomers(customerList);
    
    if (userTypeParam === "customer" || userTypeParam === "employee") {
      const savedCustomerId = localStorage.getItem("selectedCustomerId");
      let defaultCustomer = null;
      
      if (savedCustomerId && customerList.length > 0) {
        defaultCustomer = customerList.find(c => c.id === savedCustomerId);
      }
      
      if (!defaultCustomer && customerList.length > 0) {
        defaultCustomer = customerList[0];
      }
      
      if (defaultCustomer) {
        (async () => {
          const details = await fetchCompleteCustomerDetails(defaultCustomer.id);
          const finalCustomer = details
            ? { ...defaultCustomer, 
                brokerId: details.brokerId || defaultCustomer.brokerId, 
                brokerName: details.brokerName || defaultCustomer.brokerName, 
                transporterId: details.transporterId || defaultCustomer.transporterId, 
                transporterName: details.transporterName || defaultCustomer.transporterName 
              }
            : { ...defaultCustomer };
          setSelectedCustomer(finalCustomer);
          localStorage.setItem("selectedCustomerId", finalCustomer.id);
          localStorage.setItem("selectedCustomer", JSON.stringify(finalCustomer));
        })();
      }
      
      const name = session.username || user?.Name || user?.User_Name || "User";
      setUserName(name);
    }
  }, []);

// const checkLoginStatus = useCallback(async () => {
//   try {
//     const user = localStorage.getItem("user");
//     const session = localStorage.getItem("session");
//     const loginAt = localStorage.getItem("loginAt");
//     const storedUserType = localStorage.getItem("userType") || "employee";

//     if (!user || !session || !loginAt) {
//       const contactNumber = getContactNumberFromURL();
//       if (contactNumber) {
//         ["user", "session", "loginAt", "userType", "retId", "selectedCustomerId", "selectedCustomer", "username"].forEach(k => localStorage.removeItem(k));

//         const result = await handleAutoLoginWithContact(contactNumber);

//         if (result === true) {
//           const newUser = localStorage.getItem("user");
//           const newSession = localStorage.getItem("session");
//           if (newUser && newSession) {
//             proceedWithLogin(newUser, newSession, "customer");
//             return;
//           }
//         } else if (result === "requirePassword") {
//           setPendingUsername(contactNumber);
//           setIsLoginPopupOpen(true);
//         } else {
//           setIsLoginPopupOpen(true);
//         }
//       }
//     }

//     if (user && session && loginAt) {
//       proceedWithLogin(user, session, storedUserType);
//     } else {
//       setIsLoggedIn(false);
//       setUserName("");
//       setUserType("");
//       setSelectedCustomer(null);
//       setCustomers([]);
//     }
//   } catch (error) {
//     console.error("Error checking login status:", error);
//     setIsLoggedIn(false);
//     setUserName("");
//     setUserType("");
//     setSelectedCustomer(null);
//     setCustomers([]);
//   }
// }, [getContactNumberFromURL, handleAutoLoginWithContact, proceedWithLogin]);

  

const checkLoginStatus = useCallback(async () => {
  try {
    const user = localStorage.getItem("user");
    const session = localStorage.getItem("session");
    const loginAt = localStorage.getItem("loginAt");
    const storedUserType = localStorage.getItem("userType") || "employee";

    if (!user || !session || !loginAt) {
      const contactNumber = getContactNumberFromURL();
      if (contactNumber) {
        ["user", "session", "loginAt", "userType", "retId", "selectedCustomerId", "selectedCustomer", "username"].forEach(k => localStorage.removeItem(k));

        const result = await handleAutoLoginWithContact(contactNumber);

        if (result === true) {
          const newUser = localStorage.getItem("user");
          const newSession = localStorage.getItem("session");
          if (newUser && newSession) {
            proceedWithLogin(newUser, newSession, "customer");
            if (isProfileRoute()) setShowDashboard(true);   
            return;
          }
        } else if (result === "requirePassword") {
          setPendingUsername(contactNumber);
          setIsLoginPopupOpen(true);
        } else {
          setIsLoginPopupOpen(true);
        }
      }
    }

    if (user && session && loginAt) {
      proceedWithLogin(user, session, storedUserType);
      if (isProfileRoute()) setShowDashboard(true);   
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setUserType("");
      setSelectedCustomer(null);
      setCustomers([]);
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    setIsLoggedIn(false);
    setUserName("");
    setUserType("");
    setSelectedCustomer(null);
    setCustomers([]);
  }
}, [getContactNumberFromURL, handleAutoLoginWithContact, proceedWithLogin, isProfileRoute]);


const fetchCompleteCustomerDetails = async (customerId) => {
    try {
      const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
      if (response?.success && Array.isArray(response.data)) {
        const customer = response.data.find(c => String(c.Customer_Id) === String(customerId));
        if (customer) {
          return {
            brokerId: customer.Broker_Id ? String(customer.Broker_Id).trim() : "",
            brokerName: customer.Broker_Name || customer.Broker || "",
            transporterId: customer.Transporter_Id ? String(customer.Transporter_Id).trim() : "",
            transporterName: customer.Transporter_Name || customer.Transporter || "",
          };
        }
      }
    } catch (error) { console.error("Error fetching customer details:", error); }
    return null;
  };

  const handleSaleOrdersClick = () => setShowSaleOrders(true);
  const handleDashboard = () => setShowDashboard(true);

  const handleBackFromSaleOrders = () => {
    setShowSaleOrders(false);
    const isEditing = localStorage.getItem('isEditingOrder');
    const editData = localStorage.getItem('editOrderData');
    if (isEditing === 'true' && editData) {
      const savedCustomer = localStorage.getItem("selectedCustomer");
      if (savedCustomer && !selectedCustomer) {
        try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
      }
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart && Object.keys(quantities).length === 0) {
        try { setQuantities(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
      toast.info("Edit mode active - make your changes and click Update");
    }
    checkLoginStatus();
  };

  const handleLoginSuccess = useCallback(() => {
    const contactNumber = getContactNumberFromURL();
    if (contactNumber) {
      window.location.reload();
    } else {
      checkLoginStatus();
      if (showSaleOrders) {
        window.location.reload();
      }
    }
  }, [getContactNumberFromURL, checkLoginStatus, showSaleOrders]);

  const handleLogout = () => {
    ["user", "session", "loginAt", "userType", "retId", "selectedCustomerId", "selectedCustomer","username"].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false); setUserName(""); setUserType(""); setSelectedCustomer(null); setCustomers([]);
    toast.success("Logged out successfully");
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=100000&page=1` });
      if (response?.success && Array.isArray(response.data)) {
        setCustomers(response.data.map((c) => ({
          id: c.Customer_Id || c.Ret_Id,
          name: (c.Short_Name || c.Billl_Name || "").replace(/\u0004/g, "").trim(),
          billName: (c.Billl_Name || "").trim(),
          mobile: (c.Mobile_No || "").trim(),
          city: (c.City || "").trim(),
          address: (c.Address || "").trim(),
          brokerId: c.Broker_Id || "",
          brokerName: (c.Broker_Name || c.Broker || "").trim(),
          transporterId: c.Transporter_Id || "",
          transporterName: (c.Transporter_Name || c.Transporter || "").trim(),
          partyMailingName: c.Party_Mailing_Name || c.Billl_Name || "",
          partyMailingAddress: c.Party_Mailing_Address || c.Address || "",
        })));
      }
    } catch (error) { console.error("Error fetching customers:", error); toast.error("Failed to load customers"); }
    finally { setLoadingCustomers(false); }
  };

  const formatProduct = (product) => {
    const uniqueId = String(product.Product_Id);
    const balQty = parseFloat(product.Bal_Qty) || 0;
    const packGet = parseFloat(product.PackGet) || 1;
    const stockInBags = packGet > 0 ? balQty / packGet : 0;
    const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
    return {
      id: uniqueId, name: product.Product_Name || product.Stock_Item || "Unknown",
      fullName: product.Product_Name || "Unknown", shortName: product.Short_Name,
      weight: product.PackGet ? `${product.PackGet}kg` : "N/A",
      stockGroup: product.Stock_Group || "General", posGroup: product.POS_Group || "General",
      price, stock: stockInBags, unit: product.Units || "Bags",
      image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=116&fit=crop",
      coolie: product.Coolie, brokerage: product.NagalBrokerage || product.Brokerage,
      packGet: product.PackGet, hsnCode: product.HSN_Code, balQty,
      originalProduct: product, isInStock: stockInBags > 0,
    };
  };

  const deduplicateProducts = (products) => {
    const map = new Map();
    products.forEach((p) => { if (!map.has(p.Product_Id)) map.set(p.Product_Id, p); });
    return Array.from(map.values());
  };

  const mergeProductData = (productList, stockResponse) => {
    if (!productList?.length) return [];
    let stockData = [];
    if (stockResponse?.success && stockResponse.data?.Pos_Product) {
      const pp = stockResponse.data.Pos_Product;
      stockData = Array.isArray(pp) ? pp[0]?.Product_Entry || [] : pp.Product_Entry || [];
    }
    const stockMap = new Map();
    stockData.forEach((item) => stockMap.set(String(item.Product_Id).trim(), item));
    return productList.map((product) => {
      const si = stockMap.get(String(product.Product_Id).trim());
      return si
        ? { ...product, Bal_Qty: si.Bal_Qty || 0, Price: si.Price || product.Product_Rate || 0, _hasStock: true }
        : { ...product, Bal_Qty: 0, Price: product.Product_Rate || 0, _hasStock: false };
    });
  };

  const fetchAllData = async () => {
    setLoadingProducts(true);
    try {
      const [posResponse, stockResponse] = await Promise.all([
        fetchLink({ address: `pos/posProductList` }),
        fetchLink({ address: `pos/productMaster` }),
      ]);
      let productList = [];
      if (posResponse?.success && posResponse.data) productList = posResponse.data;
      const merged = mergeProductData(productList, stockResponse);
     
      const unique = deduplicateProducts(merged);
    
      const active = unique.filter((p) => p.Active_Deactive === 1 || p.Active_Deactive === 1 || p.Active_Deactive === 1);
      const inStock = active.filter((p) => {
        const bq = parseFloat(p.Bal_Qty) || 0;
        const pg = parseFloat(p.PackGet) || 1;
        return pg > 0 ? bq / pg > 0 : false;
      });
      // setAllProducts(inStock); setDisplayProducts(inStock);
      setAllProducts(active); setDisplayProducts(active);
      localStorage.setItem("products", JSON.stringify(inStock.map(formatProduct)));
      setInitialLoadDone(true);
    } catch (error) { toast.error("Failed to load products"); }
    finally { setLoadingProducts(false); }
  };

  const updateQty = (id, delta) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      if (next === 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: next };
    });
  };

  const handleRemoveItem = (id) => {
    setQuantities(prev => {
      const { [id]: _, ...rest } = prev;
      localStorage.setItem("cartItems", JSON.stringify(rest));
      return rest;
    });
  };

  const selectedCount = Object.values(quantities).reduce((s, q) => s + q, 0);
  const totalAmount = Object.entries(quantities).reduce((s, [id, qty]) => {
    const p = allProducts.find((p) => String(p.Product_Id) === id);
    return p ? s + (parseFloat(p.Price) || parseFloat(p.Product_Rate) || 0) * qty : s;
  }, 0);

  const filtered = displayProducts.filter((p) => {
    // const bq = parseFloat(p.Bal_Qty) || 0;
    // const pg = parseFloat(p.PackGet) || 1;
    // if (pg > 0 ? bq / pg <= 0 : true) return false;
    if (!search) return true;
    const normalize = (str) => (str || "").toLowerCase().replace(/[.\-_\s]+/g, "");
    const sl = normalize(search);
    return (
      normalize(p.Product_Name).includes(sl) || normalize(p.Short_Name).includes(sl) ||
      normalize(p.POS_Group).includes(sl) || normalize(p.Stock_Group).includes(sl) ||
      (p.Product_Name && p.Product_Name.toLowerCase().includes(search.toLowerCase())) ||
      (p.Short_Name && p.Short_Name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const formattedProducts = allProducts.map(formatProduct);

  const handleCartClick = async () => {
    localStorage.setItem('cartItems', JSON.stringify(quantities));
    localStorage.setItem('products', JSON.stringify(formattedProducts));
    if (isMobile) {
      setIsMobileCartDrawerOpen(true);
    } else {
      const navigationState = {};
      if (selectedCustomer) {
        let customerData = { ...selectedCustomer };
        if ((!customerData.brokerName || !customerData.transporterName) && userType === "customer") {
          const details = await fetchCompleteCustomerDetails(customerData.id);
          if (details) {
            customerData = { ...customerData, brokerId: details.brokerId || customerData.brokerId, brokerName: details.brokerName || customerData.brokerName, transporterId: details.transporterId || customerData.transporterId, transporterName: details.transporterName || customerData.transporterName };
            setSelectedCustomer(customerData);
            localStorage.setItem("selectedCustomer", JSON.stringify(customerData));
          }
        }
        navigationState.selectedCustomer = {
          id: customerData.id, name: customerData.name, billName: customerData.billName,
          mobile: customerData.mobile, city: customerData.city, address: customerData.address,
          brokerId: customerData.brokerId, brokerName: customerData.brokerName,
          transporterId: customerData.transporterId, transporterName: customerData.transporterName,
        };
      }
      if (selectedCustomer) localStorage.setItem('selectedCustomerData', JSON.stringify(navigationState.selectedCustomer));
      navigate('/cart', { state: navigationState });
    }
  };

  const handleSelectCustomer = async (customer) => {
    if (!customer || !customer.id) return;
    let updatedCustomer = { ...customer };
    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOptRetailerId?Customer_Id=${customer.id}&limit=10000000&page=1`,
      });
      if (response?.success && Array.isArray(response.data)) {
        const found = response.data.find(c => String(c.Customer_Id) === String(customer.id));
        if (found) {
          updatedCustomer = {
            ...customer,
            brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : customer.brokerId || "",
            brokerName: found.Broker_Name || found.Broker || customer.brokerName || "",
            transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : customer.transporterId || "",
            transporterName: found.Transporter_Name || found.Transporter || customer.transporterName || "",
            partyMailingName: found.Party_Mailing_Name || found.Billl_Name || customer.name || "",
            partyMailingAddress: found.Party_Mailing_Address || found.Address || customer.address || "",
            billName: found.Billl_Name || customer.name || "",
          };
        }
      }
    } catch (error) { console.error("Error fetching complete customer details:", error); }
    setSelectedCustomer(updatedCustomer);
    localStorage.setItem("selectedCustomerId", String(updatedCustomer.id));
    localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
    localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(updatedCustomer));
    localStorage.setItem("cartPageSelectedCustomerId", String(updatedCustomer.id));
  };

  const extractPOSGroups = (list) =>
    [...new Set(list.map((p) => (p.POS_Group || "").trim()))]
      .filter((g) => g && g !== "NULL")
      .map((g) => ({ posGroup: g, itemCount: list.filter((p) => (p.POS_Group || "").trim() === g).length }))
      .sort((a, b) => a.posGroup.localeCompare(b.posGroup));

  const handleStockGroupClick = (group) => {
    setSelectedPOSGroup(null); setSelectedStockGroup(group.id); setViewMode('products');
    if (group.id === "All") {
      setDisplayProducts(allProducts); setShowPOSGroups(false); setPosGroups([]);
    } else {
      const filtered = allProducts.filter((p) => (p.Stock_Group || "").trim() === group.id.trim());
      setDisplayProducts(filtered);
      const pgl = extractPOSGroups(filtered);
      setPosGroups(pgl); setShowPOSGroups(true);
      if (isMobile && pgl.length > 0) setIsDrawerOpen(true);
    }
  };

  const handleBackToCategories = () => { setSelectedStockGroup("All"); setSearch(""); setViewMode('categories'); };
  
  const handlePOSGroupClick = (posGroup) => {
    setSelectedPOSGroup(posGroup);
    setDisplayProducts(allProducts.filter((p) =>
      (p.Stock_Group || "").trim() === selectedStockGroup.trim() &&
      (p.POS_Group || "").trim() === posGroup.trim()
    ));
    if (isMobile) setIsDrawerOpen(false);
  };
  
  const handleAllPOSGroupsClick = () => {
    setSelectedPOSGroup(null);
    setDisplayProducts(allProducts.filter((p) => (p.Stock_Group || "").trim() === selectedStockGroup.trim()));
    if (isMobile) setIsDrawerOpen(false);
  };

  const MobileDrawer = () => (
    <>
      {isDrawerOpen && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setIsDrawerOpen(false)} />}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: "85%", maxWidth: "320px",
        backgroundColor: "#fff", zIndex: 1000,
        transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.1s ease-in-out", overflowY: "auto",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      }}>
        <div style={{
          padding: "20px 16px", backgroundColor: BROWN_DARK, color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FilterListIcon style={{ fontSize: "20px" }} />
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedStockGroup} - POS Groups</span>
          </div>
          <CloseIcon style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setIsDrawerOpen(false)} />
        </div>
        <div style={{ padding: "16px" }}>
          {showPOSGroups && posGroups.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={handleAllPOSGroupsClick}
                style={{
                  padding: "12px 16px", borderRadius: "8px", border: "none",
                  backgroundColor: selectedPOSGroup === null ? BROWN_DARK : "#f5f0eb",
                  color: selectedPOSGroup === null ? "#fff" : BROWN_DARK,
                  fontSize: "14px", cursor: "pointer",
                  fontWeight: selectedPOSGroup === null ? "bold" : "normal",
                  textAlign: "left", width: "100%",
                }}
              >All POS Groups ({displayProducts.length})</button>
              {posGroups.map((group, i) => (
                <button
                  key={i} onClick={() => handlePOSGroupClick(group.posGroup)}
                  style={{
                    padding: "12px 16px", borderRadius: "8px", border: "none",
                    backgroundColor: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#f5f0eb",
                    color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK,
                    fontSize: "14px", cursor: "pointer",
                    fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal",
                    textAlign: "left", width: "100%",
                  }}
                >{group.posGroup} ({group.itemCount})</button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#999", fontSize: "14px" }}>
              No POS groups available for this category
            </div>
          )}
        </div>
      </div>
    </>
  );



  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    if (isLoggedIn && userType === "employee") fetchCustomers();
  }, [isLoggedIn, userType]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isEditing = localStorage.getItem('isEditingOrder');
    const editData = localStorage.getItem('editOrderData');
    const savedCustomer = localStorage.getItem('selectedCustomer');
    if (isEditing === 'true' && editData) {
      try {
        const parsed = JSON.parse(editData);
        if (parsed.cartItems && Object.keys(parsed.cartItems).length > 0) setQuantities(parsed.cartItems);
        if (parsed.customerDetails) {
          setSelectedCustomer(parsed.customerDetails);
          localStorage.setItem('selectedCustomer', JSON.stringify(parsed.customerDetails));
          localStorage.setItem('selectedCustomerId', parsed.customerDetails.id);
        }
        toast.info("Edit mode active - make your changes and click Update");
      } catch (e) { console.error("Error restoring edit state:", e); }
    } else if (savedCustomer && !selectedCustomer) {
      try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("selectedCustomer");
    if (savedCustomer && !selectedCustomer) {
      try { setSelectedCustomer(JSON.parse(savedCustomer)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      localStorage.setItem("selectedCustomer", JSON.stringify(selectedCustomer));
      localStorage.setItem("selectedCustomerId", selectedCustomer.id);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem("cartItems");
        if (saved) setQuantities(JSON.parse(saved));
      } catch (e) { console.error(e); }
    };
    load();
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    const onFocus = () => load();
    const onStorage = (e) => { if (e.key === "cartItems") load(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => { if (initialLoadDone) localStorage.setItem("cartItems", JSON.stringify(quantities)); }, [quantities, initialLoadDone]);
  useEffect(() => { fetchAllData(); }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const groups = [...new Set(allProducts.map((p) => p.Stock_Group))]
        .filter((g) => g && g.trim() && g !== "NOT FOUND" && g !== "NULL").sort()
        .map((g) => ({ id: g, name: g }));
      setStockGroups([{ id: "All", name: "All" }, ...groups]);
    }
  }, [allProducts]);

  const isCategoryReduced = selectedStockGroup !== "All";

  const mediaQueryStyles = `
    @media screen and (max-width: 768px) { .products-grid { grid-template-columns: 1fr !important; gap: 12px !important; padding: 12px !important; } .product-card { width: 100% !important; height: auto !important; min-height: 140px !important; } .category-filters { padding: 8px 12px !important; } }
    @media screen and (max-width: 480px) { .mobile-drawer { width: 85% !important; max-width: 280px !important; } .cart-summary { padding: 10px 16px !important; } }
    @media screen and (min-width: 1600px) { .products-grid { max-width: 1800px !important; margin: 0 auto !important; grid-template-columns: repeat(4, 1fr) !important; } }
  `;

  return (
    <>
      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} initialUsername={pendingUsername} />
      {showDashboard ? (
        <Dashboard
          isMobile={isMobile}
          isLoggedIn={isLoggedIn}
          userName={userName}
          customers={customers}
          allProducts={allProducts}
          onLoginClick={() => setIsLoginPopupOpen(true)}
          onLogout={handleLogout}
          onHome={() => { setShowDashboard(false); setShowSaleOrders(false); }}
          onSaleOrders={() => { setShowDashboard(false); setShowSaleOrders(true); }}
          activeTab="dashboard"
        />
      ) : showSaleOrders ? (
        <SaleOrders onBack={handleBackFromSaleOrders} />
      ) : (
        <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile ? (selectedCount > 0 ? "100px" : "80px") : "0"}}>
          <style>{mediaQueryStyles}</style>

          <CommonHeader
            title="SM Traders" logo="SMT" showSearch={false} showCart={true}
            showBackButton={false} showTitle={true} cartItemCount={selectedCount}
            selectedCount={selectedCount} onCartClick={handleCartClick}
            handleCartClick={handleCartClick} isMobile={isMobile}
            backgroundColor={BROWN_DARK} isLoggedIn={isLoggedIn} userName={userName}
            showCustomerSelector={isLoggedIn && customers.length > 0}
            customers={customers} selectedCustomer={selectedCustomer}
            onCustomerSelect={handleSelectCustomer} loadingCustomers={loadingCustomers}
            userType={userType}
            customActions={
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "auto" }}>
                <ThreeDotMenu
                  isLoggedIn={isLoggedIn} userName={userName}
                  onLogout={handleLogout} onLoginClick={() => setIsLoginPopupOpen(true)}
                  onSaleOrders={handleSaleOrdersClick}
                  onDashboard={handleDashboard}
                />
              </div>
            }
          />

          {isMobile && viewMode === 'categories' && (
            <div style={{ padding: "16px", background: "#f5f0eb", minHeight: "calc(100vh - 120px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {stockGroups.filter((g) => g.id !== "All").map((group) => (
                  <div
                    key={group.id} onClick={() => handleStockGroupClick(group)}
                    style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "180px" }}
                  >
                    <div style={{ height: "130px", position: "relative", overflow: "hidden" }}>
                      <img src={getCategoryImage(group.name)} alt={group.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)" }} />
                    </div>
                    <div style={{ padding: "12px", background: BROWN_DARK, color: "#fff", textAlign: "center", fontSize: "14px", fontWeight: "600" }}>{group.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(viewMode === 'products' || !isMobile) && (
            <>
              {isMobile && (
                <div style={{ padding: "12px 16px", background: "#f5f0eb", borderBottom: "1px solid #ddd" }}>
                  <button
                    onClick={handleBackToCategories}
                    style={{ background: "transparent", border: `1px solid ${BROWN_DARK}`, borderRadius: "20px", padding: "8px 16px", color: BROWN_DARK, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  ><span>←</span> Back to Categories</button>
                </div>
              )}

              {!isMobile && (
                <div className="category-filters" style={{ background: "#f5f0eb", padding: "24px", borderBottom: "1px solid #ddd", position: "sticky", top: 68, zIndex: 90, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  {loadingProducts ? (
                    <div style={{ textAlign: "center", padding: "20px", width: "100%", color: "#999" }}>Loading categories...</div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", gap: "12px", margin: 0, padding: "0 0 12px 0", scrollbarWidth: "thin", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
                      {stockGroups.filter((g) => g.id !== "All").map((group) => (
                        <CategoryCard key={group.id} category={{ name: group.name }} isSelected={selectedStockGroup === group.id} onClick={() => handleStockGroupClick(group)} isMobile={isMobile} isReduced={isCategoryReduced} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isMobile && showPOSGroups && (
                <div className="pos-groups-container" style={{ background: "#f9f4ef", padding: "15px 24px", borderBottom: "1px solid #e8ddd4" }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={handleAllPOSGroupsClick}
                      style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === null ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === null ? BROWN_DARK : "#fff", color: selectedPOSGroup === null ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === null ? "bold" : "normal" }}
                    >All POS Groups ({displayProducts.length})</button>
                    {posGroups.length > 0 ? posGroups.map((group, i) => (
                      <button
                        key={i} onClick={() => handlePOSGroupClick(group.posGroup)}
                        style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === group.posGroup ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#fff", color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal" }}
                      >{group.posGroup} ({group.itemCount})</button>
                    )) : <div style={{ color: "#666", fontStyle: "italic", padding: "8px" }}>No POS groups available</div>}
                  </div>
                </div>
              )}

              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(420px, 1fr))", gap: isMobile ? 16 : 24, padding: isMobile ? "16px" : "24px 24px 40px", maxWidth: 1800, margin: "0 auto", justifyContent: "center" }}>
                {loadingProducts ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>Loading products...</div>
                ) : filtered.length > 0 ? (
                  filtered.map((product) => {
                    const formatted = formatProduct(product);
                    return (
                      <div key={formatted.id} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <ProductCard product={formatted} quantity={quantities[formatted.id] || 0} onUpdateQty={updateQty} isMobile={isMobile} />
                      </div>
                    );
                  })
                ) : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>No products found</div>
                )}
              </div>
            </>
          )}

          {isMobile && !showDashboard && <MobileDrawer />}
          {isMobile && !showDashboard && (
            <MobileOrderSummary
              selectedCount={selectedCount}
              totalAmount={totalAmount}
              onGoToCart={handleCartClick}
              footerOffset={isMobile ? 64 : 0}
            />
          )}
          <MobileCartDrawer
            isOpen={isMobileCartDrawerOpen} onClose={() => setIsMobileCartDrawerOpen(false)}
            cartItems={quantities} products={formattedProducts} allProducts={allProducts}
            onUpdateQty={updateQty} onRemoveItem={handleRemoveItem}
            isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginPopupOpen(true)}
            selectedCustomer={selectedCustomer} userType={userType}
            externalCustomers={customers} onCustomerChange={handleSelectCustomer}
            footerOffset={isMobile ? 64 : 0}
          />
          {isMobile && (
            <MobileTabBar
              activeTab={showDashboard ? "dashboard" : "home"}
              onHome={() => { setShowDashboard(false); setShowSaleOrders(false); }}
              onDashboard={() => { setShowDashboard(true); setShowSaleOrders(false); }}
              onCart={handleCartClick}
              cartCount={selectedCount}
            />
          )}
        </div>
      )}
    </>
  );
}

function SaleOrders({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [brokerFilter, setBrokerFilter] = useState("");
  const [transporterFilter, setTransporterFilter] = useState("");
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 0); return d; });
  const [toDate, setToDate] = useState(new Date());
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);
  const [tempBrokerFilter, setTempBrokerFilter] = useState("");
  const [tempTransporterFilter, setTempTransporterFilter] = useState("");

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const getBrokerName = (order) => {
    if (!order.Staff_Involved_List || !Array.isArray(order.Staff_Involved_List)) return "";
    const broker = order.Staff_Involved_List.find(s => s.Cost_Center_Type_Id === 3 || s.EmpType === "Broker");
    return broker?.EmpName || "";
  };

  const getTransporterName = (order) => {
    if (!order.Staff_Involved_List || !Array.isArray(order.Staff_Involved_List)) return "";
    const transporter = order.Staff_Involved_List.find(s => s.Cost_Center_Type_Id === 2 || s.EmpType === "Load Man");
    return transporter?.EmpName || "";
  };

  const getOrderStatus = (order) => order.OrderStatus || "";

  const uniqueBrokers = useMemo(() => {
    const set = new Set();
    orders.forEach(o => { const n = getBrokerName(o); if (n && n.trim()) set.add(n.trim()); });
    return Array.from(set).sort();
  }, [orders]);

  const uniqueTransporters = useMemo(() => {
    const set = new Set();
    orders.forEach(o => { const n = getTransporterName(o); if (n && n.trim()) set.add(n.trim()); });
    return Array.from(set).sort();
  }, [orders]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { fetchSaleOrders(); }, [fromDate, toDate]);

  // const fetchSaleOrders = async () => {
  //   setLoading(true);
  //   try {
  //     const userData = JSON.parse(localStorage.getItem('user') || '{}');
  //     const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
  //     const userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';
  //     const formattedFromDate = fromDate.toISOString().split('T')[0];
  //     const formattedToDate = toDate.toISOString().split('T')[0];
  //     const response = await fetchLink({
  //       address: `sales/salesOrder/list?Created_by=${userId}&FromDate=${formattedFromDate}&ToDate=${formattedToDate}`,
  //       method: 'GET',
  //     });
  //     if (response?.success) {
  //       const orderData = response.data || response.Data || [];
  //       setOrders(Array.isArray(orderData) ? orderData : []);
  //     } else {
  //       toast.error(response?.message || "Failed to fetch orders"); setOrders([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching sale orders:", error);
  //     toast.error("Failed to load sale orders"); setOrders([]);
  //   } finally { setLoading(false); }
  // };

 
 const fetchSaleOrders = async () => {
  setLoading(true);
  try {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
    const userType = localStorage.getItem('userType');
    
    let userId = null;
    
    // For employee login
    if (userType === 'employee') {
      userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';
    } 
    // For customer login
    else if (userType === 'customer') {
      // Customers should see orders created by them
      // Use Ret_Id or Customer_Id from the user data
      userId = userData.Ret_Id || userData.Customer_Id || userData.id || sessionData?.retId || '';
    }
    
    // If no userId found, try to get from session
    if (!userId) {
      userId = sessionData?.userId || sessionData?.Ret_Id || '';
    }

    const formattedFromDate = fromDate.toISOString().split('T')[0];
    const formattedToDate = toDate.toISOString().split('T')[0];
    const mobileno=JSON.parse(localStorage.getItem('username') || '{}');
    // Build URL with parameters
    let url = `sales/salesOrder/list?Created_by=${userId}&Mobile_No=${mobileno}&FromDate=${formattedFromDate}&ToDate=${formattedToDate}`;
    
    const response = await fetchLink({
      address: url,
      method: 'GET',
    });
    
    if (response?.success) {
      const orderData = response.data || response.Data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } else {
      toast.error(response?.message || "Failed to fetch orders");
      setOrders([]);
    }
  } catch (error) {
    console.error("Error fetching sale orders:", error);
    toast.error("Failed to load sale orders");
    setOrders([]);
  } finally {
    setLoading(false);
  }
};
 
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateString; }
  };

  const handleOpenFilterDialog = () => {
    setTempFromDate(fromDate); setTempToDate(toDate);
    setTempBrokerFilter(brokerFilter); setTempTransporterFilter(transporterFilter);
    setShowFilterDialog(true);
  };

  const handleFilterApply = () => {
    if (tempFromDate && tempToDate) { setFromDate(tempFromDate); setToDate(tempToDate); }
    setBrokerFilter(tempBrokerFilter); setTransporterFilter(tempTransporterFilter);
    setShowFilterDialog(false);
    const activeFilters = [];
    if (tempFromDate && tempToDate) activeFilters.push("date range");
    if (tempBrokerFilter) activeFilters.push("broker");
    if (tempTransporterFilter) activeFilters.push("transporter");
    if (activeFilters.length > 0) toast.success(`Filters applied: ${activeFilters.join(", ")}`);
  };

  const handleFilterClear = () => {
    const d = new Date(); d.setDate(d.getDate() - 0);
    setTempFromDate(d); setTempToDate(new Date());
    setTempBrokerFilter(""); setTempTransporterFilter("");
  };

  const handleFilterReset = () => {
    const d = new Date(); d.setDate(d.getDate() - 0);
    setFromDate(d); setToDate(new Date());
    setBrokerFilter(""); setTransporterFilter("");
    setTempFromDate(d); setTempToDate(new Date());
    setTempBrokerFilter(""); setTempTransporterFilter("");
    setShowFilterDialog(false);
    toast.success("All filters cleared");
  };

  const getTotalBillQty = (productsList) => {
    if (!productsList || !Array.isArray(productsList) || productsList.length === 0) return 0;
    return productsList.reduce((sum, product) => sum + (parseFloat(product.Bill_Qty) || 0), 0);
  };

  const getTotalItems = (productsList) => (!productsList || !Array.isArray(productsList)) ? 0 : productsList.length;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (debouncedSearchTerm) {
        const search = debouncedSearchTerm.toLowerCase();
        const productNames = (order.Products_List || []).map(p => p.Product_Name || '').join(' ').toLowerCase();
        const matchesSearch = (
          (order.Retailer_Name && order.Retailer_Name.toLowerCase().includes(search)) ||
          (order.Customer_Name && order.Customer_Name.toLowerCase().includes(search)) ||
          (order.So_Inv_No && order.So_Inv_No.toLowerCase().includes(search)) ||
          (order.So_No && order.So_No.toString().includes(search)) ||
          (order.Narration && order.Narration.toLowerCase().includes(search)) ||
          (order.OrderStatus && order.OrderStatus.toLowerCase().includes(search)) ||
          productNames.includes(search)
        );
        if (!matchesSearch) return false;
      }
      if (brokerFilter && getBrokerName(order).trim() !== brokerFilter) return false;
      if (transporterFilter && getTransporterName(order).trim() !== transporterFilter) return false;
      return true;
    });
  }, [orders, debouncedSearchTerm, brokerFilter, transporterFilter]);

  const toggleOrderExpansion = (orderId) => setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));

  const getProductPackGet = (productName) => {
    if (productName) {
      const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
      if (packMatch) return parseFloat(packMatch[1]);
    }
    return 1;
  };

const handlePrintOrder = async (e, order) => {
  e.stopPropagation();
  try {
    const productsList = order.Products_List || [];
    const createdOnDate = order.Created_on || order.Created_On || order.created_on;
    const orderDateValue = order.So_Date;

    const originalCustomerName = order.Retailers_Name || order.Customer_Name || order.Party_Name || order.Billl_Name || "";
    const originalCity = order.City || "";
    const originalAddress = order.Shipp_Address || order.Shipping_Address || order.Address || "";
    const originalMobile = order.Ord_Mobile_No || order.Mobile_No || order.Contact_No || "";
    const originalBrokerName = getBrokerName(order);
    const originalTransporterName = getTransporterName(order);

    const printCartItems = productsList.map(p => ({
      Print_Name: p.Product_Short_Name || p.Product_Name || "",
      shortName: p.Short_Name || p.Product_Short_Name || p.Product_Name || "",
      kgs: parseFloat(p.Bill_Qty) || 0,
      price: parseFloat(p.Item_Rate) || parseFloat(p.Price) || 0,
    }));

    let customerData = {
      Billl_Name: originalCustomerName,
      Party_Mailing_Name: originalCustomerName,
      Party_Location: originalCity,
      Party_Mailing_Address: originalAddress,
      City: originalCity,
      Mobile_No: originalMobile,
      Land_Line: originalMobile,
      Transporter: originalTransporterName,
      Broker: originalBrokerName,
    };

    const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
    if (retailerId) {
      const response = await fetchLink({
        address: `pos/retailerMasterOptRetailerId?Customer_Id=${retailerId}&limit=10000000&page=1`
      });
      if (response?.success && Array.isArray(response.data)) {
        const found = response.data.find(c => String(c.Customer_Id) === String(retailerId));
        if (found) {
          customerData = {
            Billl_Name: originalCustomerName,
            Party_Mailing_Name: originalCustomerName,
            Party_Location: originalCity || found.City || "",
            Party_Mailing_Address: originalAddress || found.Address || found.Party_Mailing_Address || "",
            City: originalCity || found.City || "",
            Mobile_No: originalMobile || found.Mobile_No || "",
            Land_Line: found.Land_Line || originalMobile || "",
            Transporter: originalTransporterName || found.Transporter || "",
            Broker: originalBrokerName || found.Broker || "",
          };
        }
      }
    }

    // ── Expense array from the LIST/READ endpoint uses DR/CR columns,
    //    not the single "Expence_Value" field used when creating an order.
    const expenseList = order.Expence_Array || order.Expense_Array || [];
    const normalizedExpenses = expenseList.map(exp => {
      const dr = parseFloat(exp.Expence_Value_DR) || 0;
      const cr = parseFloat(exp.Expence_Value_CR) || 0;
      // Net signed value. Adjust the sign convention here if your
      // ledger treats DR as an addition rather than a deduction.
      const netValue = dr - cr;
      return {
        Account_Name: exp.Expence_Name || exp.Account_Name || "",
        Expence_Value: netValue,
      };
    });

    const totalExpensesValue = normalizedExpenses.reduce(
      (acc, exp) => acc + (parseFloat(exp.Expence_Value) || 0), 0
    );

    // Sum of line items, independent of whatever Total_Invoice_value says
    const totalBeforeTax = productsList.reduce((sum, p) => {
      const amt = parseFloat(p.Amount);
      if (!isNaN(amt) && amt !== 0) return sum + amt;
      const rate = parseFloat(p.Item_Rate) || parseFloat(p.Price) || 0;
      const qty = parseFloat(p.Bill_Qty) || 0;
      return sum + rate * qty;
    }, 0);

    // Recompute total so the expense is guaranteed to be reflected,
    // instead of trusting the stored Total_Invoice_value as-is.
    const totalInvoiceValue = totalBeforeTax + totalExpensesValue;

    const totalKgs = productsList.reduce((sum, p) => sum + (parseFloat(p.Bill_Qty) || 0), 0);

    const totals = {
      subtotal: totalInvoiceValue,
      totalBeforeTax,
      totalExpenses: totalExpensesValue,
      tax: 0,
      total: totalInvoiceValue,
      totalItems: productsList.length,
      totalKgs,
    };

    const storage = JSON.parse(localStorage.getItem('user') || '{}');

    setPrintData({
      customer: customerData,
      cartItems: printCartItems,
      totals,
      expenses: normalizedExpenses,
      storage,
      createdOn: createdOnDate,
      orderDate: orderDateValue,
    });
    setPrintModalOpen(true);
  } catch (error) {
    console.error("Error preparing print data:", error);
    toast.error("Failed to prepare print data");
  }
};

// const handlePrintOrder = async (e, order) => {

//   e.stopPropagation();
//   try {
//     const productsList = order.Products_List || [];
//      const createdOnDate = order.Created_on || order.Created_On || order.created_on;
//     const orderDateValue = order.So_Date;

//     const originalCustomerName = order.Retailers_Name || order.Customer_Name || order.Party_Name || order.Billl_Name || "";
//     const originalCity = order.City || "";
//     const originalAddress = order.Shipp_Address || order.Shipping_Address || order.Address || "";
//     const originalMobile = order.Ord_Mobile_No || order.Mobile_No || order.Contact_No || "";
//     const originalBrokerName = getBrokerName(order);
//     const originalTransporterName = getTransporterName(order);
    



//     const printCartItems = productsList.map(p => ({
//       Print_Name: p.Product_Short_Name || p.Product_Name || "",
//       shortName: p.Short_Name || p.Product_Short_Name || p.Product_Name || "",
//       kgs: parseFloat(p.Bill_Qty) || 0,
//       price: parseFloat(p.Item_Rate) || parseFloat(p.Price) || 0,
//     }));

   
//     let customerData = {
//       Billl_Name: originalCustomerName, 
//       Party_Mailing_Name: originalCustomerName,
//       Party_Location: originalCity,      
//       Party_Mailing_Address: originalAddress,
//       City: originalCity,
//       Mobile_No: originalMobile,
//       Land_Line: originalMobile,
//       Transporter: originalTransporterName,
//       Broker: originalBrokerName,
//     };

//     const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
//     if (retailerId) {
//       const response = await fetchLink({ 
//         address: `pos/retailerMasterOptRetailerId?Customer_Id=${retailerId}&limit=10000000&page=1` 
//       });
//       if (response?.success && Array.isArray(response.data)) {
//         const found = response.data.find(c => String(c.Customer_Id) === String(retailerId));
//         if (found) {
        
//           customerData = {
//             Billl_Name: originalCustomerName,  
//             Party_Mailing_Name: originalCustomerName,
//             Party_Location: originalCity || found.City || "", 
//             Party_Mailing_Address: originalAddress || found.Address || found.Party_Mailing_Address || "",
//             City: originalCity || found.City || "",
//             Mobile_No: originalMobile || found.Mobile_No || "",
//             Land_Line: found.Land_Line || originalMobile || "",
//             Transporter: originalTransporterName || found.Transporter || "",
//             Broker: originalBrokerName || found.Broker || "",
//           };
//         }
//       }
//     }

//     const totalInvoiceValue = parseFloat(order.Total_Invoice_value || 0);
//     const totalKgs = productsList.reduce((sum, p) => sum + (parseFloat(p.Bill_Qty) || 0), 0);
//     const totals = { 
//       subtotal: totalInvoiceValue, 
//       tax: 0, 
//       total: totalInvoiceValue, 
//       totalItems: productsList.length, 
//       totalKgs 
//     };
    
//     const storage = JSON.parse(localStorage.getItem('user') || '{}');
    
//     setPrintData({ 
//       customer: customerData, 
//       cartItems: printCartItems, 
//       totals, 
//       storage,
//       createdOn: createdOnDate,  
//       orderDate: orderDateValue,
//     });
//     setPrintModalOpen(true);
//   } catch (error) {
//     console.error("Error preparing print data:", error);
//     toast.error("Failed to prepare print data");
//   }
// };



const handleEditOrder = async (e, order) => {
 
  e.stopPropagation();
  try {
    const orderId = order.So_Id || order.So_No || order.OrderId;
    localStorage.setItem('editOrderId', orderId);
    localStorage.setItem("selectedCustomerId", order.Retailer_Id);

   
    let actualBrokerId = null;
    let actualBrokerName = "";
    let actualTransporterId = null;
    let actualTransporterName = "";

    if (order.Staff_Involved_List && Array.isArray(order.Staff_Involved_List)) {
   
      const broker = order.Staff_Involved_List.find(
        staff => staff.Cost_Center_Type_Id === 3 || staff.EmpType === "Broker"
      );
      if (broker) {
        actualBrokerId = broker.Involved_Emp_Id || broker.Emp_Id;
        actualBrokerName = broker.EmpName || "";
      
      }

 
      const transporter = order.Staff_Involved_List.find(
        staff => staff.Cost_Center_Type_Id === 2 || staff.EmpType === "Load Man"
      );
      if (transporter) {
        actualTransporterId = transporter.Involved_Emp_Id || transporter.Emp_Id;
        actualTransporterName = transporter.EmpName || "";
     
      }
    }

    
    const originalCustomerName = order.Retailer_Name || order.Customer_Name || order.Party_Name || "";
    const originalCity = order.City || "";
    const originalAddress = order.Shipp_Address || order.Shipping_Address || order.Address || "";
    const originalMobile = order.Ord_Mobile_No || order.Mobile_No || order.Contact_No || "";
    
   
    const response = await fetchLink({ 
      address: `pos/retailerMasterOpt?Customer_Id=${order.Retailer_Id}&limit=10000000&page=1` 
    });
    
    let completeCustomerDetails = null;
    if (response?.success && Array.isArray(response.data)) {
      const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
      completeCustomerDetails = response.data.find(c => String(c.Customer_Id) === String(retailerId));
    }

    const getProductPackGet = (productName) => {
      if (productName) {
        const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
        if (packMatch) return parseFloat(packMatch[1]);
      }
      return 1;
    };

    const cartItemsObj = {};
    const productsList = [];

    if (order.Products_List && Array.isArray(order.Products_List)) {
      order.Products_List.forEach(product => {
        const productId = String(product.Product_Id || product.Item_Id);
        
        const originalProductName = product.Product_Name || product.Item_Name || "";
        const originalShortName = product.Product_Short_Name || product.Short_Name || originalProductName;
        
        let packGet = parseFloat(product.PackGet) || parseFloat(product.Pack_Get) || 1;
        if (packGet === 1 && originalProductName) packGet = getProductPackGet(originalProductName);
        
        const billQty = parseFloat(product.Bill_Qty) || 0;
        const quantity = packGet > 0 && billQty > 0 ? Math.round(billQty / packGet) : 1;
        const pricePerKg = parseFloat(product.Item_Rate) || parseFloat(product.Price) || 0;
        const amount = parseFloat(product.Amount) || (pricePerKg * billQty) || 0;
        
        cartItemsObj[productId] = quantity;
        productsList.push({
          id: productId,
          name: originalProductName, 
          shortName: originalShortName, 
          quantity: quantity,
          kgs: billQty,
          price: pricePerKg,
          packGet: packGet,
          amount: amount,
        });
      });
    }

  
    const editData = {
      customerId: order.Retailer_Id || order.Customer_Id || order.Party_Id,
      customerName: originalCustomerName, 
      customerMobile: originalMobile || completeCustomerDetails?.Mobile_No || "",
      customerAddress: originalAddress || completeCustomerDetails?.Address || "", 
      customerCity: originalCity || completeCustomerDetails?.City || "", 
      orderId: orderId,
      orderNumber: order.So_Inv_No || order.So_No || order.OrderNumber,
      cartItems: cartItemsObj,
      productsList: productsList,
      Expence_Array: order.Expence_Array,
      brokerId: actualBrokerId,
      brokerName: actualBrokerName,
      transporterId: actualTransporterId,
      transporterName: actualTransporterName,
      shippingAddress: originalAddress || completeCustomerDetails?.Address || order.Shipp_Address || order.Shipping_Address || "",
      deliveryAddress: originalAddress || completeCustomerDetails?.Address || order.Deliv_Address || order.Delivery_Address || order.Shipp_Address || "",
      contactNumber: originalMobile || completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
      description: order.Narration || order.Description || order.Note || "",
     
      originalCustomerName: originalCustomerName,
      originalCity: originalCity,
      originalAddress: originalAddress,
      originalMobile: originalMobile,
      originalBillName: completeCustomerDetails?.Billl_Name || originalCustomerName,
      originalPartyMailingName: completeCustomerDetails?.Party_Mailing_Name || originalCustomerName,
      originalPartyMailingAddress: completeCustomerDetails?.Party_Mailing_Address || originalAddress,
      customerDetails: {
        id: order.Retailer_Id || order.Customer_Id || order.Party_Id,
        name: originalCustomerName, // Use original Tamil name
        mobile: originalMobile || completeCustomerDetails?.Mobile_No || "",
        address: originalAddress || completeCustomerDetails?.Address || "",
        city: originalCity || completeCustomerDetails?.City || "",
        brokerId: actualBrokerId,
        brokerName: actualBrokerName,
        transporterId: actualTransporterId,
        transporterName: actualTransporterName,
        billName: completeCustomerDetails?.Billl_Name || originalCustomerName,
        partyMailingName: completeCustomerDetails?.Party_Mailing_Name || originalCustomerName,
        partyMailingAddress: completeCustomerDetails?.Party_Mailing_Address || originalAddress,
      },
    };

  

    localStorage.setItem('editOrderData', JSON.stringify(editData));
    localStorage.setItem('isEditingOrder', 'true');
    
    // Store the actual IDs separately to ensure they're not overwritten
    if (actualBrokerId) localStorage.setItem('editBrokerId', actualBrokerId);
    if (actualBrokerName) localStorage.setItem('editBrokerName', actualBrokerName);
    if (actualTransporterId) localStorage.setItem('editTransporterId', actualTransporterId);
    if (actualTransporterName) localStorage.setItem('editTransporterName', actualTransporterName);
    
    // Store original customer data for print
    localStorage.setItem('editCustomerOriginalName', originalCustomerName);
    localStorage.setItem('editCustomerOriginalCity', originalCity);
    localStorage.setItem('editCustomerOriginalAddress', originalAddress);
    localStorage.setItem('editCustomerOriginalMobile', originalMobile);
    localStorage.setItem('editCustomerBillName', completeCustomerDetails?.Billl_Name || originalCustomerName);
    localStorage.setItem('editCustomerPartyMailingName', completeCustomerDetails?.Party_Mailing_Name || originalCustomerName);
    localStorage.setItem('editCustomerPartyMailingAddress', completeCustomerDetails?.Party_Mailing_Address || originalAddress);
    
    const currentCart = localStorage.getItem('cartItems');
    if (currentCart) localStorage.setItem('previousCartItems', currentCart);
    const productsData = localStorage.getItem('products');
    if (productsData) localStorage.setItem('productsBackup', productsData);

    navigate('/cart', {
      state: {
        editOrderData: editData,
        isEditingOrder: true,
        selectedCustomer: {
          id: editData.customerDetails.id,
          name: originalCustomerName, // Use original Tamil name
          billName: editData.customerDetails.billName,
          mobile: originalMobile || editData.customerDetails.mobile || "",
          city: originalCity || editData.customerDetails.city || "",
          address: originalAddress || editData.customerDetails.address || "",
          brokerId: actualBrokerId,
          brokerName: actualBrokerName,
          transporterId: actualTransporterId,
          transporterName: actualTransporterName,
          partyMailingName: editData.customerDetails.partyMailingName,
          partyMailingAddress: editData.customerDetails.partyMailingAddress,
        },
      },
    });
    toast.info(`Loading order #${order.So_Inv_No || order.So_No} for editing...`);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    toast.error("Failed to load order details for editing");
  }
};

  const productTableHeaderStyle = { padding: "10px 12px", textAlign: "center", color: BROWN, fontSize: "12px", fontWeight: "600" };
  const productTableCellStyle = { padding: "10px 12px", textAlign: "center", fontSize: "12px", color: "#666" };

  const ProductListExpand = ({ products }) => {
    if (!products || products.length === 0) return null;
    return (
      <div style={{ padding: "16px", background: "#f9f4ef", borderTop: "2px solid #e8ddd4" }}>
        <h4 style={{ margin: "0 0 12px 0", color: BROWN, fontSize: "14px", fontWeight: "600" }}>Products ({products.length})</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <thead>
              <tr style={{ background: "#f0e9e2", borderBottom: `2px solid ${ACCENT}` }}>
                <th style={productTableHeaderStyle}>S.No</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "left" }}>Product Name</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Kgs</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Rate (₹/kg)</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fdf8f3"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={productTableCellStyle}>{idx + 1}</td>
                  <td style={{ ...productTableCellStyle, textAlign: "left", fontWeight: "500", color: BROWN_DARK }}>{product.Product_Name || "Unknown Product"}</td>
                  <td style={{ ...productTableCellStyle, textAlign: "right" }}>{parseFloat(product.Bill_Qty || 0).toFixed(2)}</td>
                  <td style={{ ...productTableCellStyle, textAlign: "right" }}>₹{parseFloat(product.Item_Rate || product.Price || 0).toFixed(2)}</td>
                  <td style={{ ...productTableCellStyle, textAlign: "right", fontWeight: "600", color: BROWN_DARK }}>₹{parseFloat(product.Amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const activeFiltersCount = (brokerFilter ? 1 : 0) + (transporterFilter ? 1 : 0);
  const tableHeaderStyle = { padding: "12px 16px", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" };

  return (
    <>
       <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile ? "70px" : "0" }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", backgroundColor: BROWN_DARK, color: "#fff",
          display: "flex", alignItems: "center", gap: "12px",
          position: "sticky", top: 0, zIndex: 100,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Sale Orders</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {filteredOrders.length} of {orders.length} orders
              {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active)`}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: "relative", width: isMobile ? "100%" : "250px", order: isMobile ? 2 : 1 }}>
            <input
              type="text" placeholder="Search orders..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px 8px 32px", borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)",
                color: "#fff", fontSize: "12px", outline: "none",
              }}
            />
            <SearchIcon style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(255,255,255,0.7)" }} />
          </div>

          {/* Filter Button */}
          <button
            onClick={handleOpenFilterDialog}
            style={{
              background: activeFiltersCount > 0 ? ACCENT : "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: "20px",
              padding: "6px 12px", color: activeFiltersCount > 0 ? BROWN_DARK : "#fff",
              cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px",
              order: isMobile ? 1 : 2, fontWeight: activeFiltersCount > 0 ? "600" : "400",
            }}
          >
            <FilterListIcon style={{ fontSize: "16px" }} />
            Filter
            {activeFiltersCount > 0 && (
              <span style={{ background: "#e74c3c", color: "#fff", borderRadius: "10px", padding: "2px 6px", fontSize: "10px", marginLeft: "4px" }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleFilterReset}
              style={{
                background: "#e74c3c", border: "none", borderRadius: "20px", padding: "6px 12px",
                color: "#fff", cursor: "pointer", fontSize: "12px",
                display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, order: isMobile ? 3 : 3,
              }}
            >✕ Clear All</button>
          )}
        </div>

        {/* Filter Dialog */}
        {showFilterDialog && (
          <div
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => setShowFilterDialog(false)}
          >
            <div
              style={{ background: "#fff", borderRadius: "16px", width: isMobile ? "92%" : "500px", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "20px 24px", background: BROWN_DARK, color: "#fff", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Filter Orders</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>Apply filters to narrow down results</p>
                </div>
                <CloseIcon style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => setShowFilterDialog(false)} />
              </div>

              <div style={{ padding: "24px" }}>
                {/* Date Range */}
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` }}>
                    <span style={{ fontSize: "18px" }}>📅</span>
                    <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Date Range</span>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "13px", fontWeight: "500" }}>From Date</label>
                    <DatePicker selected={tempFromDate} onChange={(date) => setTempFromDate(date)} selectsStart startDate={tempFromDate} endDate={tempToDate} dateFormat="dd/MM/yyyy" placeholderText="Select from date" className="date-picker-input" />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "13px", fontWeight: "500" }}>To Date</label>
                    <DatePicker selected={tempToDate} onChange={(date) => setTempToDate(date)} selectsEnd startDate={tempFromDate} endDate={tempToDate} minDate={tempFromDate} dateFormat="dd/MM/yyyy" placeholderText="Select to date" className="date-picker-input" />
                  </div>
                </div>

                {/* Broker Filter */}
                {uniqueBrokers.length > 0 && (
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` }}>
                      <span style={{ fontSize: "18px" }}>👤</span>
                      <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Broker</span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <select
                        value={tempBrokerFilter} onChange={(e) => setTempBrokerFilter(e.target.value)}
                        style={{ width: "100%", padding: "12px 32px 12px 12px", border: `1px solid ${tempBrokerFilter ? BROWN_DARK : ACCENT}`, borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: tempBrokerFilter ? "#f9f4ef" : "#fff", color: tempBrokerFilter ? BROWN_DARK : "#333", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
                      >
                        <option value="">All Brokers</option>
                        {uniqueBrokers.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BROWN_LIGHT, fontSize: "12px" }}>▼</span>
                    </div>
                  </div>
                )}

                {/* Transporter Filter */}
                {uniqueTransporters.length > 0 && (
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` }}>
                      <span style={{ fontSize: "18px" }}>🚚</span>
                      <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Transporter</span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <select
                        value={tempTransporterFilter} onChange={(e) => setTempTransporterFilter(e.target.value)}
                        style={{ width: "100%", padding: "12px 32px 12px 12px", border: `1px solid ${tempTransporterFilter ? BROWN_DARK : ACCENT}`, borderRadius: "8px", fontSize: "14px", outline: "none", backgroundColor: tempTransporterFilter ? "#f9f4ef" : "#fff", color: tempTransporterFilter ? BROWN_DARK : "#333", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
                      >
                        <option value="">All Transporters</option>
                        {uniqueTransporters.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BROWN_LIGHT, fontSize: "12px" }}>▼</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: "16px 24px", borderTop: "1px solid #e8ddd4", display: "flex", gap: "12px", background: "#faf6f2", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
                <Button variant="outlined" onClick={handleFilterClear} style={{ flex: 1 }}>Clear All</Button>
                <Button variant="contained" onClick={handleFilterApply} style={{ flex: 1, backgroundColor: BROWN_DARK, color: "#fff", fontWeight: "600" }}>Apply Filters</Button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: isMobile ? "12px" : "24px", overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <CircularProgress style={{ color: BROWN, marginBottom: "16px" }} />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <h3 style={{ color: "#666", marginBottom: "8px" }}>No Orders Found</h3>
              <p style={{ fontSize: "14px" }}>
                {debouncedSearchTerm || brokerFilter || transporterFilter ? "Try adjusting your search or filters" : "No orders found in selected date range"}
              </p>
            </div>
          ) : isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredOrders.map((order, index) => {
                const totalBillQty = getTotalBillQty(order.Products_List);
                const totalItems = getTotalItems(order.Products_List);
                const orderKey = order.So_Id || order.So_No || index;
                const isExpanded = expandedOrders[orderKey] || false;
                const brokerName = getBrokerName(order);
                const transporterName = getTransporterName(order);
                return (
                  <div key={orderKey} style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e8ddd4", overflow: "hidden" }}>
                    <div onClick={() => toggleOrderExpansion(orderKey)} style={{ padding: "16px", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", fontWeight: "600", color: BROWN_DARK, marginBottom: "4px" }}>{order.Retailer_Name || order.Customer_Name || "Unknown Customer"}</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>Order #{order.So_Inv_No || order.So_No}</div>
                          {brokerName && <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>Broker: {brokerName}</div>}
                          {transporterName && <div style={{ fontSize: "10px", color: "#888" }}>Transporter: {transporterName}</div>}
                        </div>
                        <div style={{ textAlign: "right", marginLeft: "12px" }}>
                          <div style={{ fontSize: "15px", fontWeight: "bold", color: BROWN_DARK }}>₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}</div>
                          <div style={{ fontSize: "11px", color: "#666" }}>{totalItems} items • {totalBillQty.toFixed(2)} kg</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#999" }}>
                        <span>{formatDate(order.So_Date)}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: "10px", background: order.OrderStatus === "pending" ? "#fff3cd" : "#d4edda", color: order.OrderStatus === "pending" ? "#856404" : "#155724", fontSize: "10px", fontWeight: "600" }}>
                            {order.OrderStatus || order.VoucherTypeGet || "N/A"}
                          </span>
                          <span style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", fontSize: "16px" }}>▼</span>
                        </div>
                      </div>
                      {order.Narration && (
                        <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic", padding: "8px", background: "#f9f4ef", borderRadius: "8px", marginTop: "8px" }}>{order.Narration}</div>
                      )}
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" }}>
                        <button
                          onClick={(e) => handlePrintOrder(e, order)}
                          style={{ padding: "8px 16px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#388E3C"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#4CAF50"}
                        >🖨️ Print</button>
                        <button
                          onClick={(e) => handleEditOrder(e, order)}
                          style={{ padding: "8px 16px", background: ACCENT, color: BROWN_DARK, border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#b8956a"}
                          onMouseLeave={(e) => e.currentTarget.style.background = ACCENT}
                        >✏️ Edit</button>
                      </div>
                    </div>
                    {isExpanded && <ProductListExpand products={order.Products_List} />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 0", minWidth: "1200px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9f4ef" }}>
                    <th style={tableHeaderStyle}></th>
                    {["Order #", "Date", "Customer", "Broker", "Transporter", "Items", "Status", "Kgs", "Amount", "Actions"].map((h, i) => (
                      <th key={h} style={{ ...tableHeaderStyle, textAlign: i >= 6 && i <= 8 ? "right" : i === 9 ? "center" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const totalBillQty = getTotalBillQty(order.Products_List);
                    const totalItems = getTotalItems(order.Products_List);
                    const orderKey = order.So_Id || order.So_No || index;
                    const isExpanded = expandedOrders[orderKey] || false;
                    const brokerName = getBrokerName(order);
                    const transporterName = getTransporterName(order);
                    const OrderStatus = getOrderStatus(order);
                    return (
                      <React.Fragment key={orderKey}>
                        <tr
                          onClick={() => toggleOrderExpansion(orderKey)}
                          style={{ backgroundColor: "#fff", cursor: "pointer", transition: "all 0.2s", borderBottom: "1px solid #e8ddd4" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fdf8f3"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                        >
                          <td style={{ padding: "14px 8px 14px 16px", textAlign: "center", color: BROWN_LIGHT, fontSize: "14px" }}>
                            <span style={{ display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>►</span>
                          </td>
                          <td style={{ padding: "14px 16px", color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>{order.So_Inv_No || order.So_No || "N/A"}</td>
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px", textAlign: "center" }}>{order.So_Date ? order.So_Date.split('T')[0] : "N/A"}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>{order.Retailer_Name || order.Customer_Name || "Unknown"}</div>
                            {order.Ord_Mobile_No && <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>📞 {order.Ord_Mobile_No}</div>}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>{brokerName || "-"}</td>
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>{transporterName || "-"}</td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{totalItems}</td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{OrderStatus}</td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{totalBillQty.toFixed(2)} kg</td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: BROWN_DARK, fontWeight: "600", fontSize: "14px" }}>₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}</td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button
                                onClick={(e) => handlePrintOrder(e, order)}
                                style={{ background: "#4CAF50", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", color: "#fff", fontSize: "12px", fontWeight: "600", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#388E3C"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#4CAF50"}
                              >🖨️ Print</button>
                              <button
                                onClick={(e) => handleEditOrder(e, order)}
                                style={{ background: BROWN, border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", color: "#fff", fontSize: "12px", fontWeight: "600", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
                                onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
                              >✏️ Edit</button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={12} style={{ padding: "0" }}>
                              <ProductListExpand products={order.Products_List} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Print Preview Modal for SaleOrders – uses the unified PrintPreviewModal */}
      <PrintPreviewModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        customer={printData?.customer}
        cartItems={printData?.cartItems}
        expenses={printData?.expenses} 
        totals={printData?.totals}
        storage={printData?.storage}
        isReprint={true}
        createdOn={printData?.createdOn}  
        orderDate={printData?.orderDate}  

      />
    </>
  );
}

function Dashboard({
  isMobile,
  isLoggedIn,
  userName,
  customers,
  allProducts,
  onLoginClick,
  onLogout,
  onHome,
  onSaleOrders,
  activeTab = "dashboard",
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockGroupsCount, setStockGroupsCount] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);
  const [transactions, setTransactions] = useState(0);
  const [viewTickets, setViewTickets] = useState(0);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showPendingBills,setShowPendingBills]=useState(false)


  const handleTransactionClick = () => {
    setShowTransactionDetails(true);
  };

  const handlePendingBillsClick=()=>{
    setShowPendingBills(true)
  }

  useEffect(() => {
    fetchTodayOrders();
    fetchDashboardStats();
  }, []);

  const fetchTodayOrders = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
      const userType = localStorage.getItem('userType');
      
      let userId = null;
      
      if (userType === 'employee') {
        userId = userData.UserId || userData.user_id || userData.User_Id || '';
      } else if (userType === 'customer') {
        userId = userData.Ret_Id || userData.Customer_Id || userData.id || sessionData?.retId || '';
      }
      
      if (!userId) {
        userId = sessionData?.userId || sessionData?.Ret_Id || '';
      }
      const mobileno=JSON.parse(localStorage.getItem('username') || '{}');
      const today = new Date().toISOString().split('T')[0];
      const response = await fetchLink({
        address: `sales/salesOrder/list?Created_by=${userId}&Mobile_No=${mobileno}&FromDate=${today}&ToDate=${today}`,
        method: 'GET',
      });
      
      if (response?.success) {
        const orderData = response.data || response.Data || [];
        setOrders(Array.isArray(orderData) ? orderData : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
      const userType = localStorage.getItem('userType');
      
      let userId = null;
      
      if (userType === 'employee') {
        userId = userData.UserId || userData.user_id || userData.User_Id || '';
      } else if (userType === 'customer') {
        userId = userData.Ret_Id || userData.Customer_Id || userData.id || sessionData?.retId || '';
      }
      
      if (!userId) {
        userId = sessionData?.userId || sessionData?.Ret_Id || '';
      }

      
      const pendingResponse = await fetchLink({
        address: `sales/pendingBills?Created_by=${userId}`,
        method: 'GET',
      });
      if (pendingResponse?.success) {
        setPendingBills(pendingResponse.data?.count || 0);
      }

      // Fetch transactions count
      const transactionResponse = await fetchLink({
        address: `sales/transactions/count?Created_by=${userId}`,
        method: 'GET',
      });
      if (transactionResponse?.success) {
        setTransactions(transactionResponse.data?.count || 0);
      }

      // Fetch view tickets
      const ticketResponse = await fetchLink({
        address: `support/tickets?Created_by=${userId}`,
        method: 'GET',
      });
      if (ticketResponse?.success) {
        const tickets = ticketResponse.data || [];
        setViewTickets(tickets.length);
      }

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const groups = new Set(
        allProducts.map((p) => (p.Stock_Group || "").trim()).filter(Boolean)
      );
      setStockGroupsCount(groups.size);
    }
  }, [allProducts]);

  const todaysRevenue = orders.reduce((s, o) => s + (parseFloat(o.Total_Invoice_value) || 0), 0);
  const todaysOrders = orders.length;
  const todaysKgs = orders.reduce((sum, o) => {
    const products = o.Products_List || [];
    return sum + products.reduce((s, p) => s + (parseFloat(p.Bill_Qty) || 0), 0);
  }, 0);
  const totalCustomers = (customers || []).length;

  const rupee = (n) =>
    (Number.isFinite(Number(n)) ? Number(n) : 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  // Updated stat cards with click handlers
  const statCards = [
    { 
      label: "Today's Orders", 
      value: loading ? "—" : todaysOrders, 
      icon: "📦", 
      iconBg: "#f0e9e2",
      color: BROWN_DARK,
      onClick: () => onSaleOrders && onSaleOrders() 
    },
    { 
      label: "Pending Bills", 
       
      icon: "📋", 
      iconBg: "#fef3e2",
      color: "#e67e22",
      onClick: handlePendingBillsClick
    },
    { 
      label: "Transactions",
      icon: "💰", 
      iconBg: "#e2f0f0",
      color: "#2980b9",
      onClick: handleTransactionClick 
    },
    // { 
    //   label: "Total Customers", 
    //   value: totalCustomers || "—", 
    //   icon: "🏪", 
    //   iconBg: "#e8f0e2",
    //   color: BROWN_DARK,
    //   onClick: () => toast.info("Showing customer list...")
    // },
    // { 
    //   label: "Kgs order today", 
    //   value: loading ? "—" : `${todaysKgs.toFixed(0)} kg`, 
    //   icon: "⚖️", 
    //   iconBg: "#f0e6d8",
    //   color: BROWN_DARK,
    //   onClick: () => onSaleOrders && onSaleOrders()
    // },
    { 
      label: "View Ticket", 
      value: loading ? "—" : viewTickets, 
      icon: "🎫", 
      iconBg: "#f0e2ec",
      color: "#8e44ad",
      onClick: () => toast.info("Opening tickets...")
    },
  ];

  const footerTabs = [
    { key: "home", label: "Home", icon: "🏠", onClick: onHome },
    { key: "dashboard", label: "Dashboard", icon: "📊", onClick: () => {} },
    { key: "saleOrders", label: "Sale Orders", icon: "📋", onClick: onSaleOrders },
  ];

 
  if (showTransactionDetails) {
    return <TransactionDetails onBack={() => setShowTransactionDetails(false)} />;
  }

    if (showPendingBills) {
    return <PendingBillDetails onBack={() => setShowPendingBills(false)} />;
  }


return (
  <>
    {/* Desktop Modal for TransactionDetails */}
    {showTransactionDetails && !isMobile && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "relative",
        }}>
          {/* Close Button */}
          <button
            onClick={() => setShowTransactionDetails(false)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "#f0f0f0",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "24px",
              cursor: "pointer",
              color: "#999",
              zIndex: 10001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BROWN_DARK;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f0f0f0";
              e.currentTarget.style.color = "#999";
            }}
          >
            ✕
          </button>
          
          {/* TransactionDetails Content */}
          <div style={{ padding: "24px" }}>
            <TransactionDetails 
              onBack={() => setShowTransactionDetails(false)}
              isMobile={false}
              isModal={true}
            />
          </div>
        </div>
      </div>
    )}

   
    {showTransactionDetails && isMobile && (
      <TransactionDetails 
        onBack={() => setShowTransactionDetails(false)}
        isMobile={true}
        isModal={false}
      />
    )}


    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#f5f0eb",
      minHeight: "100vh",
      paddingBottom: isMobile ? "76px" : "40px",
      opacity: showTransactionDetails && !isMobile ? 0.3 : 1,
      pointerEvents: showTransactionDetails && !isMobile ? "none" : "auto",
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "16px 20px" : "20px 32px",
        backgroundColor: BROWN_DARK,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <div style={{ fontSize: isMobile ? "13px" : "14px", opacity: 0.8 }}>
            Welcome back,
          </div>
          <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "bold" }}>
            {userName || "User"}
          </div>
        </div>

        <ThreeDotMenu
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogout={onLogout}
          onLoginClick={onLoginClick}
          onSaleOrders={onSaleOrders}
          onDashboard={() => {}}
        />
      </div>

      <div style={{
        padding: isMobile ? "16px" : "24px 32px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        {/* Hero card */}
        <div style={{
          background: `linear-gradient(135deg, ${BROWN} 0%, ${BROWN_DARK} 100%)`,
          borderRadius: "20px",
          padding: isMobile ? "20px" : "28px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          marginBottom: isMobile ? "16px" : "24px",
          minHeight: isMobile ? "150px" : "170px",
        }}>
          <div style={{ fontSize: "13px", opacity: 0.85, marginBottom: "8px" }}>
            Today's revenue
          </div>
          <div style={{ fontSize: isMobile ? "30px" : "36px", fontWeight: "bold", marginBottom: "10px" }}>
            ₹{loading ? "—" : rupee(todaysRevenue)}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.15)", borderRadius: "20px",
            padding: "4px 12px", fontSize: "12px",
          }}>
            <span>{todayLabel}</span>
          </div>

          <svg
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute", bottom: 0, left: 0, width: "100%", height: "60px",
              opacity: 0.25,
            }}
          >
            <path
              d="M0,60 C60,10 100,90 160,50 C220,10 260,80 320,40 C360,15 380,40 400,30 L400,100 L0,100 Z"
              fill="#fff"
            />
          </svg>
        </div>

     
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? "12px" : "16px",
        }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              onClick={card.onClick}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "20px",
                border: "1px solid #e8ddd4",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: card.iconBg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "16px", marginBottom: "12px",
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                {card.label}
              </div>
              <div style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: "bold", color: card.color || BROWN_DARK }}>
                {card.value}
              </div>
            
            </div>
          ))}
        </div>
      </div>

      {/* Footer nav (mobile only) */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          backgroundColor: "#fff", borderTop: "1px solid #e8ddd4",
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
          zIndex: 1100, boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
        }}>
          {footerTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={tab.onClick}
                style={{
                  flex: 1, background: "transparent", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                  padding: "4px 0", position: "relative",
                }}
              >
                <span style={{ fontSize: "20px" }}>{tab.icon}</span>
                <span style={{
                  fontSize: "11px",
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? BROWN_DARK : "#999",
                }}>{tab.label}</span>
                <span style={{
                  position: "absolute", bottom: "-8px", width: "24px", height: "3px",
                  borderRadius: "2px", background: isActive ? BROWN_DARK : "transparent",
                }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  </>
);
}


