// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from 'react-toastify';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import SearchIcon from '@mui/icons-material/Search';
// import CircularProgress from "@mui/material/CircularProgress";
// import { fetchLink } from "./fetchComponent";
// import CommonHeader from './CommonHeader';
// import { encryptPasswordFun } from "./functions";

// const BROWN = "#4a2c1a";
// const BROWN_DARK = "#3a1f0e";
// const BROWN_LIGHT = "#6b3f23";
// const ACCENT = "#c8a96e";
// const BG_COLOR = "#fdf8f3";

// // ─────────────────────────────────────────────
// // LOGIN POPUP
// // ─────────────────────────────────────────────
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
//         localStorage.setItem("user", JSON.stringify({ ...customer, Name: usename }));
//         localStorage.setItem("session", JSON.stringify({ username: username.trim(), ...data }));
//         localStorage.setItem("loginAt", new Date().toString());
//         localStorage.setItem("username", usename);
//         localStorage.setItem("userType", "customer");
//         localStorage.setItem("retId", customer.Ret_Id || "");
//         toast.success("Login successful!");
//         setUsername(""); setPassword(""); setStep(1);
//         if (onLoginSuccess) onLoginSuccess();
//         onClose();
//       }
//     } catch (error) {
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
//       toast.error("Something went wrong! Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div style={{
//       position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
//       backgroundColor: "rgba(0,0,0,0.5)",
//       display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999,
//     }}>
//       <div style={{
//         backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
//         maxWidth: "400px", width: "90%",
//         boxShadow: "0 10px 40px rgba(0,0,0,0.2)", position: "relative",
//       }}>
//         <button onClick={onClose} style={{
//           position: "absolute", top: "12px", right: "12px",
//           background: "transparent", border: "none", fontSize: "20px",
//           cursor: "pointer", color: "#999", padding: "4px 8px", borderRadius: "50%",
//         }}
//           onMouseEnter={(e) => { e.target.style.background = "#f0f0f0"; e.target.style.color = "#666"; }}
//           onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#999"; }}
//         >✕</button>

//         <div style={{ background: "#f9f4ef", borderRadius: "12px", padding: "20px" }}>
//           <div style={{
//             fontSize: "18px", fontWeight: "600", color: BROWN,
//             marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}`,
//             display: "flex", alignItems: "center", gap: "8px",
//           }}>
//             {step === 2 && (
//               <button onClick={() => { setStep(1); setPassword(""); }}
//                 style={{ background: "transparent", border: "none", cursor: "pointer", color: BROWN, fontSize: "18px", padding: 0 }}>←</button>
//             )}
//             <span>{step === 1
//               ? <><span style={{ color: BROWN_DARK }}>Sign</span> In</>
//               : <><span style={{ color: BROWN_DARK }}>Enter</span> Password</>}
//             </span>
//           </div>

//           {step === 1 && (
//             <form onSubmit={handleUsernameSubmit}>
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Username</div>
//                 <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Enter your username" required autoFocus
//                   style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>
//               <button type="submit" disabled={isLoading} style={{
//                 width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff",
//                 border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600",
//                 cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
//               }}
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
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password" required autoFocus
//                   style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
//                   onFocus={(e) => e.target.style.borderColor = BROWN}
//                   onBlur={(e) => e.target.style.borderColor = "#ddd"}
//                 />
//               </div>
//               <button type="submit" disabled={isLoading} style={{
//                 width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff",
//                 border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600",
//                 cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
//               }}
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

// // ─────────────────────────────────────────────
// // CUSTOMER SELECTOR (header dropdown — same as SMTraders)
// // ─────────────────────────────────────────────
// function CustomerSelector({ isLoggedIn, userType, customers, selectedCustomer, onSelectCustomer, loading, isMobile }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [hasSearched, setHasSearched] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false); setSearch(""); setFilteredCustomers([]); setHasSearched(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (isOpen && !hasSearched) setFilteredCustomers(customers);
//   }, [isOpen, customers, hasSearched]);

//   if (!isLoggedIn || customers.length === 0) return null;

//   const performSearch = () => {
//     if (!search.trim()) { setFilteredCustomers(customers); setHasSearched(false); return; }
//     const s = search.toLowerCase();
//     setFilteredCustomers(customers.filter(c =>
//       (c.name && c.name.toLowerCase().includes(s)) ||
//       (c.billName && c.billName.toLowerCase().includes(s)) ||
//       (c.mobile && c.mobile.includes(search)) ||
//       (c.city && c.city.toLowerCase().includes(s))
//     ));
//     setHasSearched(true);
//   };

//   return (
//     <div ref={dropdownRef} style={{ position: "relative" }}>
//       <div
//         onClick={() => {
//           setIsOpen(!isOpen);
//           if (!isOpen) { setSearch(""); setFilteredCustomers(customers); setHasSearched(false); }
//         }}
//         style={{
//           display: "flex", alignItems: "center", gap: "8px",
//           padding: "8px 14px", background: "#f5ede3",
//           border: `1.5px solid ${isOpen ? BROWN : ACCENT}`,
//           borderRadius: "25px", cursor: "pointer", transition: "all 0.2s",
//           maxWidth: isMobile ? "180px" : "320px",
//         }}
//       >
//         <span style={{ fontSize: "16px" }}>🏪</span>
//         <span style={{
//           fontSize: isMobile ? "12px" : "14px", fontWeight: "500",
//           color: selectedCustomer ? BROWN_DARK : "#666",
//           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
//         }}>
//           {selectedCustomer ? selectedCustomer.name : "Select outlet..."}
//         </span>
//         <span style={{ fontSize: "12px", color: BROWN_LIGHT, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
//       </div>

//       {isOpen && (
//         <div style={{
//           position: "fixed",
//           top: isMobile ? "50%" : "calc(100% + 8px)",
//           left: isMobile ? "50%" : "auto",
//           right: isMobile ? "auto" : 0,
//           transform: isMobile ? "translate(-50%, -50%)" : "none",
//           minWidth: "300px",
//           width: isMobile ? "calc(100vw - 32px)" : "380px",
//           maxWidth: "500px",
//           maxHeight: isMobile ? "70vh" : "350px",
//           overflowY: "auto", background: "#fff",
//           border: "1px solid #ddd", borderRadius: "12px",
//           boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 9999,
//         }}>
//           <div style={{
//             padding: "10px 12px", borderBottom: "1px solid #f0f0f0",
//             position: "sticky", top: 0, background: "#fff", zIndex: 1,
//             display: "flex", alignItems: "center", gap: "8px",
//           }}>
//             <div style={{ flex: 1 }}>
//               <input
//                 type="text" placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(); } }}
//                 autoFocus
//                 style={{
//                   width: "100%", padding: "8px 12px",
//                   border: `1px solid ${ACCENT}`, borderRadius: "8px",
//                   fontSize: "13px", outline: "none", boxSizing: "border-box",
//                   color: BROWN_DARK, backgroundColor: "#fff",
//                 }}
//                 onFocus={(e) => { e.target.style.borderColor = BROWN; }}
//                 onBlur={(e) => { e.target.style.borderColor = ACCENT; }}
//               />
//             </div>
//             <button
//               onClick={(e) => { e.stopPropagation(); performSearch(); }}
//               style={{
//                 background: BROWN, border: "none", borderRadius: "8px",
//                 padding: "8px 12px", cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
//               onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
//             >
//               <SearchIcon style={{ fontSize: "18px", color: "#fff" }} />
//             </button>
//           </div>

//           {loading ? (
//             <div style={{ padding: "20px", textAlign: "center" }}>
//               <CircularProgress size={20} style={{ color: BROWN }} />
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div style={{ padding: "20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
//               {hasSearched ? "No matching outlets found" : "No outlets found"}
//             </div>
//           ) : (
//             <>
//               {hasSearched && (
//                 <div style={{ padding: "8px 14px", fontSize: "11px", color: "#999", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
//                   Search results for: "{search}"
//                 </div>
//               )}
//               {filteredCustomers.map((c) => (
//                 <div
//                   key={c.id}
//                   onClick={() => { onSelectCustomer(c); setIsOpen(false); setSearch(""); setFilteredCustomers([]); setHasSearched(false); }}
//                   style={{
//                     padding: "12px 14px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
//                     background: selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent",
//                     transition: "background 0.15s",
//                   }}
//                   onMouseEnter={(e) => { if (selectedCustomer?.id !== c.id) e.currentTarget.style.background = "#faf6f2"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent"; }}
//                 >
//                   <div style={{ fontSize: "14px", fontWeight: "500", color: BROWN_DARK, marginBottom: "3px" }}>{c.name}</div>
//                   <div style={{ fontSize: "12px", color: "#999" }}>
//                     {c.mobile && <span>📱 {c.mobile}</span>}
//                     {c.city && <span> • {c.city}</span>}
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // USER MENU DROPDOWN
// // ─────────────────────────────────────────────
// const UserMenuDropdown = ({ isOpen, onClose, isLoggedIn, userName, onLoginClick, onLogout,userType, onSaleOrders }) => {
//   const dropdownRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
//     };
//     if (isOpen) document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div ref={dropdownRef} style={{
//       position: "absolute", top: "calc(100% + 8px)", right: 0,
//       minWidth: isMobile ? "250px" : "320px",
//       background: "#fff", borderRadius: isMobile ? "12px" : "20px",
//       boxShadow: "0 8px 30px rgba(0,0,0,0.2)", zIndex: 1000, overflow: "hidden",
//       animation: "slideDown 0.2s ease",
//     }}>
//       {isLoggedIn ? (
//         <>
//             <div style={{
//             padding: isMobile ? "20px 16px" : "28px 24px",
//             background: "linear-gradient(135deg, #4a2c1a 0%, #3a1f0e 100%)",
//             borderBottom: `1px solid ${ACCENT}`,
//           }}>
//             <div style={{
//               width: isMobile ? "48px" : "64px", height: isMobile ? "48px" : "64px",
//               borderRadius: "50%", background: "#c8a96e",
//               display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px",
//             }}>
//               <span style={{ color: "#4a2c1a", fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>
//                 {userName?.charAt(0) || ""}
//               </span>
//             </div>
//             <div style={{ fontSize: isMobile ? "18px" : "20px", color: "#fff" }}>{userName || ""}</div>
//             <div style={{ fontSize: isMobile ? "13px" : "15px", color: "rgba(255,255,255,0.8)" }}>Signed In • {userType}</div>
//           </div>
//           <div style={{ padding: isMobile ? "8px" : "12px" }}>
//             {/* Show Sale Orders button only for employees */}
//             {userType === "employee" && (
//               <button
//                 onClick={() => { onSaleOrders(); onClose(); }}
//                 style={{
//                   width: "100%", padding: isMobile ? "14px 16px" : "18px 24px",
//                   background: "transparent", border: "none", textAlign: "left",
//                   fontSize: isMobile ? "15px" : "17px", color: BROWN, cursor: "pointer",
//                   display: "flex", alignItems: "center", gap: isMobile ? "12px" : "16px",
//                   borderRadius: isMobile ? "8px" : "12px",
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = "#f5f0eb"}
//                 onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//               >
//                 <span style={{ fontSize: isMobile ? "18px" : "22px" }}>📋</span>
//                 <span>My Sale Orders</span>
//               </button>
//             )}
            
//             <button
//               onClick={() => { onLogout(); onClose(); }}
//               style={{
//                 width: "100%", padding: isMobile ? "14px 16px" : "18px 24px",
//                 background: "transparent", border: "none", textAlign: "left",
//                 fontSize: isMobile ? "15px" : "17px", color: "#d32f2f", cursor: "pointer",
//                 display: "flex", alignItems: "center", gap: isMobile ? "12px" : "16px",
//                 borderRadius: isMobile ? "8px" : "12px", marginTop: "4px",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
//               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//             >
//               <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🚪</span>
//               <span>Logout</span>
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <div style={{ padding: isMobile ? "20px 16px" : "28px 24px", background: "#f9f4ef", textAlign: "center" }}>
//             <div style={{
//               width: isMobile ? "48px" : "64px", height: isMobile ? "48px" : "64px",
//               borderRadius: "50%", background: "#e0d5cc",
//               display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
//             }}>
//               <span style={{ color: BROWN, fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>?</span>
//             </div>
//             <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "600", color: BROWN, marginBottom: "4px" }}>Not Signed In</div>
//             <div style={{ fontSize: isMobile ? "13px" : "15px", color: "#666" }}>Sign in to place orders</div>
//           </div>
//           <div style={{ padding: isMobile ? "12px" : "20px" }}>
//             <button
//               onClick={() => { onLoginClick(); onClose(); }}
//               style={{
//                 width: "100%", padding: isMobile ? "14px 16px" : "16px 24px",
//                 background: BROWN, border: "none", borderRadius: isMobile ? "8px" : "12px",
//                 fontSize: isMobile ? "15px" : "18px", fontWeight: "600", color: "#fff", cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? "8px" : "12px",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
//               onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
//             >
//               <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🔑</span>
//               <span>Sign In</span>
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // SEARCHABLE CUSTOMER SELECT (form field inside order form)
// // ─────────────────────────────────────────────
// const SearchableCustomerSelect = ({ value, onChange, onCustomerSelect, prefilledCustomer }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(prefilledCustomer?.name || "");
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(
//     prefilledCustomer ? { Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name } : null
//   );
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     if (prefilledCustomer?.id) {
//       setSearchTerm(prefilledCustomer.name || "");
//       setSelectedCustomer({ Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name });
//     }
//   }, [prefilledCustomer]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
//         if (response?.success && Array.isArray(response.data)) {
//           setCustomers(response.data.map(c => ({
//             ...c,
//             Short_Name: c.Short_Name ? c.Short_Name.replace(/\u0004/g, '').trim() : '',
//             Billl_Name: c.Billl_Name ? c.Billl_Name.trim() : '',
//             Mobile_No: c.Mobile_No ? c.Mobile_No.trim() : '',
//             Address: c.Address ? c.Address.trim() : '',
//             City: c.City ? c.City.trim() : '',
//             Broker_Name: c.Broker_Name?.trim() || c.Broker?.trim() || '',
//             Transporter_Name: c.Transporter_Name?.trim() || c.Transporter?.trim() || '',
//           })));
//         } else {
//           toast.error(response?.message || "Failed to load customers");
//         }
//       } catch (error) {
//         toast.error("Failed to load customers: " + (error.message || "Unknown error"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   const filteredCustomers = customers.filter(c => {
//     if (!c) return false;
//     const s = searchTerm.toLowerCase();
//     return (
//       c.Short_Name?.toLowerCase().includes(s) ||
//       c.Billl_Name?.toLowerCase().includes(s) ||
//       c.Mobile_No?.includes(searchTerm)
//     );
//   });

//   const handleSelectCustomer = (c) => {
//     setSelectedCustomer(c);
//     setSearchTerm(c.Short_Name || "");
//     setIsOpen(false);
//     onChange(c.Customer_Id);
//     if (onCustomerSelect) {
//       onCustomerSelect({
//         broker: c.Broker_Name || c.Broker?.trim() || "",
//         transporter: c.Transporter_Name || c.Transporter?.trim() || "",
//         customerId: c.Customer_Id,
//         customerName: c.Short_Name || "",
//         mobileNo: c.Mobile_No || "",
//         address: c.Address || "",
//         city: c.City || "",
//         Broker_Id: c.Broker_Id || "",
//         Transporter_Id: c.Transporter_Id || "",
//       });
//     }
//   };

//   return (
//     <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
//       <input
//         type="text"
//         placeholder="Search customer by name or mobile..."
//         value={searchTerm}
//         onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
//         onFocus={() => setIsOpen(true)}
//         style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
//       />
//       {isOpen && searchTerm && (
//         <div style={{
//           position: "absolute", top: "100%", left: 0, right: 0,
//           maxHeight: "300px", overflowY: "auto", background: "#fff",
//           border: "1px solid #ddd", borderRadius: "8px", marginTop: "4px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 1000,
//         }}>
//           {loading ? (
//             <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>Loading customers...</div>
//           ) : filteredCustomers.length > 0 ? (
//             filteredCustomers.map(c => (
//               <div key={c.Customer_Id} onClick={() => handleSelectCustomer(c)}
//                 style={{
//                   padding: "12px", cursor: "pointer", borderBottom: "1px solid #eee",
//                   backgroundColor: selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent",
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
//                 onMouseLeave={(e) => e.currentTarget.style.background = selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent"}
//               >
//                 <div style={{ fontWeight: "600", color: BROWN }}>{c.Short_Name || "Unnamed Customer"}</div>
//                 {c.Billl_Name && <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{c.Billl_Name}</div>}
//                 <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#888", marginTop: "4px", flexWrap: "wrap" }}>
//                   {c.Mobile_No && <span>📞 {c.Mobile_No}</span>}
//                   {c.City && <span>📍 {c.City}</span>}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>No customers found</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // BROKER DROPDOWN
// // ─────────────────────────────────────────────
// const BrokerDropdown = ({ selectedBroker, onSelectBroker, availableBrokers, loading, onOpen }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const filteredBrokers = availableBrokers.filter(b =>
//     b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (b.code && b.code.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
//       <div onClick={() => { setIsOpen(!isOpen); onOpen && onOpen(); }}
//         style={{
//           padding: "12px", border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
//           borderRadius: "8px", background: "#fff", cursor: "pointer",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//         }}>
//         <span style={{ color: selectedBroker.name ? BROWN : "#999" }}>
//           {selectedBroker.name || "Select Broker"}
//         </span>
//         <span style={{ color: BROWN_LIGHT }}>▼</span>
//       </div>
//       {isOpen && (
//         <div style={{
//           position: "absolute", top: "100%", left: 0, right: 0, background: "#fff",
//           border: "1px solid #ddd", borderRadius: "8px", marginTop: "4px",
//           maxHeight: "250px", overflowY: "auto", zIndex: 1000,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         }}>
//           <div style={{ padding: "8px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
//             <input type="text" placeholder="Search broker..." value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()}
//               style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
//             />
//           </div>
//           {loading ? (
//             <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading brokers...</div>
//           ) : filteredBrokers.length > 0 ? (
//             filteredBrokers.map(broker => (
//               <div key={broker.id}
//                 onClick={() => { onSelectBroker({ id: broker.id, name: broker.name }); setIsOpen(false); setSearchTerm(""); }}
//                 style={{
//                   padding: "12px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
//                   background: selectedBroker.id === broker.id ? "#f0e9e2" : "transparent",
//                 }}
//                 onMouseEnter={(e) => { if (selectedBroker.id !== broker.id) e.currentTarget.style.background = "#f5f5f5"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = selectedBroker.id === broker.id ? "#f0e9e2" : "transparent"; }}
//               >
//                 <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{broker.name}</div>
//                 {(broker.code || broker.mobile) && (
//                   <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
//                     {broker.code && `Code: ${broker.code}`}{broker.code && broker.mobile && " | "}{broker.mobile}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>No brokers found</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // TRANSPORTER DROPDOWN
// // ─────────────────────────────────────────────
// const TransporterDropdown = ({ selectedTransporter, onSelectTransporter, availableTransporters, loading, onOpen }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const filteredTransporters = availableTransporters.filter(t =>
//     t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (t.code && t.code.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
//       <div onClick={() => { setIsOpen(!isOpen); onOpen && onOpen(); }}
//         style={{
//           padding: "12px", border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
//           borderRadius: "8px", background: "#fff", cursor: "pointer",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//         }}>
//         <span style={{ color: selectedTransporter.name ? BROWN : "#999" }}>
//           {selectedTransporter.name || "Select Transporter"}
//         </span>
//         <span style={{ color: BROWN_LIGHT }}>▼</span>
//       </div>
//       {isOpen && (
//         <div style={{
//           position: "absolute", top: "100%", left: 0, right: 0, background: "#fff",
//           border: "1px solid #ddd", borderRadius: "8px", marginTop: "4px",
//           maxHeight: "250px", overflowY: "auto", zIndex: 1000,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         }}>
//           <div style={{ padding: "8px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
//             <input type="text" placeholder="Search transporter..." value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()}
//               style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
//             />
//           </div>
//           {loading ? (
//             <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading transporters...</div>
//           ) : filteredTransporters.length > 0 ? (
//             filteredTransporters.map(transporter => (
//               <div key={transporter.id}
//                 onClick={() => { onSelectTransporter({ id: transporter.id, name: transporter.name }); setIsOpen(false); setSearchTerm(""); }}
//                 style={{
//                   padding: "12px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
//                   background: selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent",
//                 }}
//                 onMouseEnter={(e) => { if (selectedTransporter.id !== transporter.id) e.currentTarget.style.background = "#f5f5f5"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent"; }}
//               >
//                 <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{transporter.name}</div>
//                 {(transporter.code || transporter.mobile) && (
//                   <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
//                     {transporter.code && `Code: ${transporter.code}`}{transporter.code && transporter.mobile && " | "}{transporter.mobile}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>No transporters found</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────
// // MAIN CART PAGE
// // ─────────────────────────────────────────────
// export default function CartPage() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Cart & product state
//   const [cartItems, setCartItems] = useState({});
//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState(1);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   // Auth state
//   const [userName, setUserName] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userType, setUserType] = useState("");

//   // Customer selector state (header dropdown — same pattern as SMTraders)
//   const [customers, setCustomers] = useState([]);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [headerSelectedCustomer, setHeaderSelectedCustomer] = useState(null);

//   // Order form state
//   const [contactNumber, setContactNumber] = useState("");
//   const [brokerName, setBrokerName] = useState("");
//   const [customer, setCustomer] = useState("");
//   const [transporter, setTransporter] = useState("");
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedDetails, setSelectedDetails] = useState(null);
//   const [prefilledCustomer, setPrefilledCustomer] = useState(null);

//   // Broker / transporter dropdown state
//   const [availableBrokers, setAvailableBrokers] = useState([]);
//   const [availableTransporters, setAvailableTransporters] = useState([]);
//   const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
//   const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
//   const [loadingBrokers, setLoadingBrokers] = useState(false);
//   const [loadingTransporters, setLoadingTransporters] = useState(false);
//   const [showSaleOrders, setShowSaleOrders] = useState(false);
//   // ─────────────────────────────────────────────
//   // POPULATE FROM NAVIGATION STATE
//   // ─────────────────────────────────────────────
//   useEffect(() => {
//     const passed = location.state?.selectedCustomer;
//     if (!passed) return;

//     setPrefilledCustomer(passed);

//     // Also set as the header selected customer so the selector shows it
//     setHeaderSelectedCustomer({
//       id: passed.id,
//       name: passed.name,
//       mobile: passed.mobile || "",
//       city: passed.city || "",
//       address: passed.address || "",
//       brokerId: passed.brokerId || "",
//       brokerName: passed.brokerName || "",
//       transporterId: passed.transporterId || "",
//       transporterName: passed.transporterName || "",
//     });

//     setCustomer(String(passed.id || ""));
//     setContactNumber(passed.mobile || "");

//     if (passed.address) {
//       setShippingAddress(passed.address);
//       setDeliveryAddress(passed.address);
//     }
//     if (passed.brokerId && passed.brokerName) {
//       setSelectedBroker({ id: passed.brokerId, name: passed.brokerName });
//       setBrokerName(passed.brokerName);
//     }
//     if (passed.transporterId && passed.transporterName) {
//       setSelectedTransporter({ id: passed.transporterId, name: passed.transporterName });
//       setTransporter(passed.transporterName);
//     }
//     setSelectedDetails({
//       customerId: String(passed.id || ""),
//       customerName: passed.name || "",
//       mobileNo: passed.mobile || "",
//       address: passed.address || "",
//       city: passed.city || "",
//       broker: passed.brokerName || "",
//       Broker_Id: passed.brokerId || "",
//       transporter: passed.transporterName || "",
//       Transporter_Id: passed.transporterId || "",
//     });
//   }, [location.state]);

//   // ─────────────────────────────────────────────
//   // AUTH
//   // ─────────────────────────────────────────────
//   const checkLoginStatus = () => {
//     try {
//       const user = localStorage.getItem("user");
//       const session = localStorage.getItem("session");
//       const loginAt = localStorage.getItem("loginAt");
//       const storedUserType = localStorage.getItem("userType") || "employee";

//       if (user && session && loginAt) {
//         setIsLoggedIn(true);
//         setUserType(storedUserType);

//         const userData = JSON.parse(user);
//         setUserName(userData?.name || userData?.Name || "");

//         // Load customers from session for customer-type users
//         const sessionData = JSON.parse(session);
//         if (sessionData?.customer && Array.isArray(sessionData.customer)) {
//           const customerList = sessionData.customer.map(c => ({
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
//           }));
//           if (customerList.length > 0) setCustomers(customerList);
//         }
//       } else {
//         setIsLoggedIn(false);
//         setUserName("");
//         setUserType("");
//       }
//     } catch (error) {
//       setIsLoggedIn(false);
//       setUserName("");
//       setUserType("");
//     }
//   };

//   useEffect(() => { checkLoginStatus(); }, []);

//   // Fetch full customer list for employees
//   useEffect(() => {
//     if (isLoggedIn && userType === "employee") fetchCustomers();
//   }, [isLoggedIn, userType]);

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true);
//     try {
//       const user = localStorage.getItem("user");
//       if (user) {
//         const userData = JSON.parse(user);
//         setUserName(userData?.Name || userData?.name || "");
//       }
//     } catch (error) { console.error(error); }
//     checkLoginStatus();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("session");
//     localStorage.removeItem("loginAt");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("selectedCustomerId");
//     localStorage.removeItem("selectedCustomer");
//     setIsLoggedIn(false);
//     setUserName("");
//     setUserType("");
//     setCustomers([]);
//     setHeaderSelectedCustomer(null);
//     toast.success("Logged out successfully");
//   };

//   // ─────────────────────────────────────────────
//   // FETCH CUSTOMERS (for header selector)
//   // ─────────────────────────────────────────────
//   const fetchCustomers = async () => {
//     setLoadingCustomers(true);
//     try {
//       const response = await fetchLink({
//         address: `pos/retailerMasterOpt?limit=10000000&page=1`,
//       });
//       if (response?.success && Array.isArray(response.data)) {
//         const sanitized = response.data.map((c) => ({
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
//         }));
//         setCustomers(sanitized);
//       }
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     } finally {
//       setLoadingCustomers(false);
//     }
//   };

//   // ─────────────────────────────────────────────
//   // HEADER CUSTOMER SELECTOR HANDLER
//   // Syncs header dropdown selection → all order form fields
//   // ─────────────────────────────────────────────
//   const handleHeaderCustomerSelect = async (customer) => {
//     let updatedCustomer = { ...customer };

   
//     try {
//       const response = await fetchLink({
//         address: `pos/retailerMasterOpt?limit=10000000&page=1`,
//       });
//       if (response?.success && Array.isArray(response.data)) {
//         const found = response.data.find(c => String(c.Customer_Id) === String(customer.id));
//         if (found) {
//           updatedCustomer = {
//             ...customer,
//             brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : customer.brokerId || "",
//             brokerName: (found.Broker_Name || found.Broker || customer.brokerName || "").trim(),
//             transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : customer.transporterId || "",
//             transporterName: (found.Transporter_Name || found.Transporter || customer.transporterName || "").trim(),
//           };
//         }
//       }
//     } catch (e) {
//       console.error("Error fetching complete customer details:", e);
//     }

//     // Update header selector display
//     setHeaderSelectedCustomer(updatedCustomer);

//     // Sync into order form fields
//     setCustomer(String(updatedCustomer.id || ""));
//     setContactNumber(updatedCustomer.mobile || "");

//     if (updatedCustomer.address) {
//       setShippingAddress(updatedCustomer.address);
//       setDeliveryAddress(updatedCustomer.address);
//     }
//     if (updatedCustomer.brokerId && updatedCustomer.brokerName) {
//       setSelectedBroker({ id: updatedCustomer.brokerId, name: updatedCustomer.brokerName });
//       setBrokerName(updatedCustomer.brokerName);
//     } else {
//       setSelectedBroker({ id: null, name: "" });
//       setBrokerName("");
//     }
//     if (updatedCustomer.transporterId && updatedCustomer.transporterName) {
//       setSelectedTransporter({ id: updatedCustomer.transporterId, name: updatedCustomer.transporterName });
//       setTransporter(updatedCustomer.transporterName);
//     } else {
//       setSelectedTransporter({ id: null, name: "" });
//       setTransporter("");
//     }

//     // Update the SearchableCustomerSelect in the form to reflect the same customer
//     setPrefilledCustomer({ id: updatedCustomer.id, name: updatedCustomer.name });

//     setSelectedDetails({
//       customerId: String(updatedCustomer.id),
//       customerName: updatedCustomer.name,
//       mobileNo: updatedCustomer.mobile || "",
//       address: updatedCustomer.address || "",
//       city: updatedCustomer.city || "",
//       broker: updatedCustomer.brokerName || "",
//       Broker_Id: updatedCustomer.brokerId || "",
//       transporter: updatedCustomer.transporterName || "",
//       Transporter_Id: updatedCustomer.transporterId || "",
//     });

//     localStorage.setItem("selectedCustomerId", updatedCustomer.id);
//     localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
//   };

//   // ─────────────────────────────────────────────
//   // DATA FETCHING
//   // ─────────────────────────────────────────────
//   const fetchBrokers = async () => {
//     if (availableBrokers.length > 0) return;
//     setLoadingBrokers(true);
//     try {
//       const response = await fetchLink({ address: `pos/brokers` });
//       if (response?.success) {
//         const data = response.data?.Brokers || response.data || [];
//         if (Array.isArray(data)) {
//           setAvailableBrokers(data.map(b => ({
//             id: b.Broker_Id,
//             name: b.Broker_Name?.trim() || '',
//             code: b.Broker_Code?.trim() || '',
//             mobile: b.Mobile_No?.trim() || '',
//           })));
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to load brokers");
//     } finally {
//       setLoadingBrokers(false);
//     }
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
//             id: t.Transporter_Id,
//             name: t.Transporter_Name?.trim() || '',
//             code: t.Transporter_Code?.trim() || '',
//             mobile: t.Mobile_No?.trim() || '',
//           })));
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to load transporters");
//     } finally {
//       setLoadingTransporters(false);
//     }
//   };

//   const loadAllProducts = async () => {
//     try {
//       const response = await fetchLink({ address: 'products?limit=1000' });
//       if (response?.success && Array.isArray(response.data)) setAllProducts(response.data);
//     } catch (error) {
//       console.error("Error loading all products:", error);
//     }
//   };

//   const loadCartData = () => {
//     setLoading(true);
//     try {
//       const savedCart = localStorage.getItem('cartItems');
//       const savedProducts = localStorage.getItem('products');
//       if (savedCart) setCartItems(JSON.parse(savedCart));
//       if (savedProducts) setProducts(JSON.parse(savedProducts));
//     } catch (error) {
//       toast.error("Failed to load cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCartData();
//     loadAllProducts();
//     fetchBrokers();
//     fetchTransporters();
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') loadCartData();
//     };
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, []);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   // ─────────────────────────────────────────────
//   // CART HELPERS
//   // ─────────────────────────────────────────────
//   const getProductPackGet = (productId) => {
//     const p = allProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
//     return p?.packGet || 1;
//   };

//   const enhancedCartItems = useMemo(() => {
//     return Object.entries(cartItems)
//       .filter(([_, qty]) => qty > 0)
//       .map(([productId, qty]) => {
//         const product = products.find(p => p.id === productId) || {};
//         const packGet = getProductPackGet(productId);
//         const kgs = qty * packGet;
//         const amount = (product.price || 0) * qty * packGet;
//         return { ...product, id: productId, quantity: qty, packGet, kgs, amount, price: product.price || 0, total: amount };
//       });
//   }, [cartItems, products, allProducts]);

//   const totalItems = enhancedCartItems.reduce((s, i) => s + i.quantity, 0);
//   const totalKgs = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);
//   const subtotalAmount = enhancedCartItems.reduce((s, i) => s + i.amount, 0);
//   const totalAmountWithTax = subtotalAmount;

//   const updateQty = (id, delta) => {
//     setCartItems(prev => {
//       const next = Math.max(0, (prev[id] || 0) + delta);
//       let newCart;
//       if (next === 0) { const { [id]: _, ...rest } = prev; newCart = rest; }
//       else newCart = { ...prev, [id]: next };
//       localStorage.setItem('cartItems', JSON.stringify(newCart));
//       return newCart;
//     });
//   };

//   const removeItem = (id) => {
//     const product = products.find(p => p.id === id);
//     setCartItems(prev => {
//       const { [id]: _, ...rest } = prev;
//       localStorage.setItem('cartItems', JSON.stringify(rest));
//       return rest;
//     });
//     if (product) toast.info(`Removed ${product.name} from cart`);
//   };

//   // ─────────────────────────────────────────────
//   // CUSTOMER SELECT HANDLER (form field search)
//   // ─────────────────────────────────────────────
//   const handleCustomerSelect = (customerData) => {
//     setCustomer(String(customerData.customerId || ""));
//     setContactNumber(customerData.mobileNo || "");
//     setSelectedDetails(customerData);

//     if (customerData.address) {
//       setShippingAddress(customerData.address);
//       setDeliveryAddress(customerData.address);
//     }
//     if (customerData.Broker_Id && customerData.broker) {
//       setSelectedBroker({ id: customerData.Broker_Id, name: customerData.broker });
//       setBrokerName(customerData.broker);
//     } else {
//       setSelectedBroker({ id: null, name: "" });
//       setBrokerName("");
//     }
//     if (customerData.Transporter_Id && customerData.transporter) {
//       setSelectedTransporter({ id: customerData.Transporter_Id, name: customerData.transporter });
//       setTransporter(customerData.transporter);
//     } else {
//       setSelectedTransporter({ id: null, name: "" });
//       setTransporter("");
//     }

//     // Sync back to header selector as well
//     setHeaderSelectedCustomer({
//       id: customerData.customerId,
//       name: customerData.customerName,
//       mobile: customerData.mobileNo || "",
//       city: customerData.city || "",
//       address: customerData.address || "",
//       brokerId: customerData.Broker_Id || "",
//       brokerName: customerData.broker || "",
//       transporterId: customerData.Transporter_Id || "",
//       transporterName: customerData.transporter || "",
//     });
//   };

//   // ─────────────────────────────────────────────
//   // CHECKOUT
//   // ─────────────────────────────────────────────
//   const handleCheckout = async () => {
//     if (!isLoggedIn) {
//       toast.error("Please sign in to place an order");
//       setIsLoginPopupOpen(true);
//       return;
//     }
//     if (!contactNumber) { toast.error("Please enter contact number"); return; }
//     if (!customer) { toast.error("Please select a customer"); return; }

//     const now = new Date();
//     const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
//     const formattedDateOnly = now.toISOString().split('T')[0];
//     const parseData = JSON.parse(localStorage.getItem('user') || '{}');
//     const storage = JSON.parse(localStorage.getItem('user') || '{}');

//     const totalBeforeTax = enhancedCartItems.reduce((s, i) => s + i.amount, 0);
//     const totalTax = enhancedCartItems.reduce((s, i) => {
//       const taxRate = i.taxRate || 12;
//       return s + (i.amount * (taxRate / 100));
//     }, 0);
//     const totalInvoiceValue = totalBeforeTax + totalTax;
//     const totalKgsValue = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);


//   const Staff_Involved_List = [];

// if (selectedBroker?.id) {
//   Staff_Involved_List.push({
//     Involved_Emp_Id: parseInt(selectedBroker.id),
//     Cost_Center_Type_Id: 3, 
//   });
// }

// if (selectedTransporter?.id) {
//   Staff_Involved_List.push({
//     Involved_Emp_Id: parseInt(selectedTransporter.id),
//     Cost_Center_Type_Id: 4,   
//   });
// }



//     const generalInfo = {
//       So_Date: formattedDateOnly,
//       Retailer_Id: parseInt(customer),
//       Sales_Person_Id: storage?.user?.SalesPersonId || 0,
//       Branch_Id: storage?.user?.BranchId || parseData?.BranchId,
//       VoucherType: 200, GST_Inclusive: 2, IS_IGST: 0,
//       CSGT_Total: (totalTax / 2).toFixed(2),
//       SGST_Total: (totalTax / 2).toFixed(2),
//       IGST_Total: "0.00", Round_off: "0.00",
//       Total_Before_Tax: totalBeforeTax.toFixed(2),
//       Total_Tax: totalTax.toFixed(2),
//       Total_Invoice_value: totalInvoiceValue.toFixed(2),
//       Narration: description || "",
//       isConverted: 0, Cancel_status: 1,
//       Created_by: parseData?.UserId || storage?.user?.UserId,
//       Created_on: formattedDate, Trans_Type: "INSERT", Alter_Id: 0,
//       Customer_Name: selectedDetails?.customerName || "",
//       Ord_Mobile_No: contactNumber,
//       Broker_Name: selectedBroker.name || "",
//       Broker_Id: selectedBroker.id || null,
//       Transporter_Name: selectedTransporter.name || "",
//       Transporter_Id: selectedTransporter.id || null,
//       Shipp_Address: shippingAddress || selectedDetails?.address || "",
//       Deliv_Address: deliveryAddress || shippingAddress || selectedDetails?.address || "",
//       Total_Kgs: totalKgsValue.toFixed(2),
//       Total_Items: enhancedCartItems.length,
//       Staff_Involved_List:Staff_Involved_List
//     };

//     const stockInfo = enhancedCartItems.map((item, index) => {
//       const taxRate = item.taxRate || 12;
//       const cgstSgstRate = taxRate / 2;
//       const taxableAmount = item.amount;
//       const taxAmount = taxableAmount * (taxRate / 100);
//       const cgstSgstAmount = taxAmount / 2;
//       const finalAmount = taxableAmount + taxAmount;
//       return {
//         So_Date: formattedDateOnly, S_No: index + 1,
//         Item_Id: parseInt(item.id),
//         Bill_Qty: item.kgs.toFixed(2),
//         Taxable_Rate: item.price.toFixed(2),
//         Item_Rate: item.price.toFixed(2),
//         Amount: taxableAmount.toFixed(2), Free_Qty: "0.00",
//         Total_Qty: item.quantity.toString(),
//         Taxble: taxAmount.toFixed(2),
//         HSN_Code: item.hsn || "210690",
//         Unit_Id: item.unitId, Unit_Name: item.unitName,
//         Taxable_Amount: taxableAmount.toFixed(2),
//         Tax_Rate: taxRate, Cgst: cgstSgstRate,
//         Cgst_Amo: cgstSgstAmount.toFixed(2), Sgst: cgstSgstRate,
//         Sgst_Amo: cgstSgstAmount.toFixed(2), Igst: 0,
//         Igst_Amo: "0.00", Final_Amo: finalAmount.toFixed(2),
//         Created_on: formattedDate,
//         Product_Id: parseInt(item.id), Product_Name: item.name,
//         Quantity: item.quantity, Price: item.price,
//         Total: taxableAmount.toFixed(2), Weight: item.kgs.toString(),
//         Unit: item.unit, PackGet: item.packGet,
//       };
//     });

//     const saleData = {
//       generalInfo, stockInfo,
//       totalAmount: totalInvoiceValue, totalItems: enhancedCartItems.length,
//       totalKgs: totalKgsValue.toFixed(2),
//       customerId: customer,
//       customerName: selectedDetails?.customerName || "",
//       contactNumber, brokerName: selectedBroker.name,
//       transporter: selectedTransporter.name,
//       shippingAddress, deliveryAddress, description,
//       Created_by: parseData?.UserId || parseData?.user_id || "",
//       Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 2,
//     };

//     try {
//       const loadingToast = toast.loading("Placing order...");
//       const response = await fetchLink({
//         address: `sales/salesInvoice/Whatsapp`,
//         method: 'POST',
//         bodyData: saleData,
//       });
//       toast.dismiss(loadingToast);

//       if (response?.success) {
//         toast.success(`Order placed successfully!`);
//         setCartItems({});
//         localStorage.removeItem('cartItems');
//         localStorage.removeItem('selectedCustomer');
//         const orderId = response.data?.Sales_Order_Id || response.data?.So_Id || response.data?.Pre_Ord_Id;
//         navigate('/', {
//           state: { orderId, customerName: saleData.customerName, orderData: response.data, success: true, message: "Order created successfully" }
//         });
//       } else {
//         toast.error(response?.message || "Failed to place order");
//       }
//     } catch (error) {
//       toast.error("Failed to place order: " + (error.message || "Unknown error"));
//     } finally {
//       setContactNumber(""); setCustomer(""); setSelectedDetails(null);
//       setBrokerName(""); setTransporter("");
//       setShippingAddress(""); setDeliveryAddress(""); setDescription("");
//     }
//   };

//   // ─────────────────────────────────────────────
//   // THREE DOTS MENU
//   // ─────────────────────────────────────────────
//   const renderThreeDotsMenu = () => (
//     <div style={{ position: "relative" }}>
//       <button
//         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         style={{
//           background: "transparent", border: "none", color: "#fff", cursor: "pointer",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           padding: isMobile ? "8px" : "12px", borderRadius: "50%",
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
//         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//       >
//         <MoreVertIcon style={{ fontSize: isMobile ? "24px" : "32px" }} />
//       </button>
//      <UserMenuDropdown
//       isOpen={isDropdownOpen} 
//       onClose={() => setIsDropdownOpen(false)}
//       isLoggedIn={isLoggedIn} 
//       userName={userName}
//       userType={userType}
//       onLoginClick={() => setIsLoginPopupOpen(true)}
//       onLogout={handleLogout}
//       onSaleOrders={handleSaleOrdersClick}
//     />
//   </div>
//   );


//   const handleSaleOrdersClick = () => {
//   setShowSaleOrders(true);
// };

// const handleBackFromSaleOrders = () => {
//   setShowSaleOrders(false);
// };


//   // ─────────────────────────────────────────────
//   // SHARED COMMON HEADER PROPS (customer selector included)
//   // ─────────────────────────────────────────────
//   const commonHeaderCustomerProps = {
//     showCustomerSelector: isLoggedIn && customers.length > 0,
//     customers: customers,
//     selectedCustomer: headerSelectedCustomer,
//     onCustomerSelect: handleHeaderCustomerSelect,
//     loadingCustomers: loadingCustomers,
//     userType: userType,
//   };

//   // ─────────────────────────────────────────────
//   // CART ITEM ROW
//   // ─────────────────────────────────────────────
//   const CartItemRow = ({ item }) => (
//     <div style={{
//       display: "flex", justifyContent: "space-between", alignItems: "center",
//       padding: isMobile ? "10px 0" : "12px 0", borderBottom: "1px dashed #ddd",
//     }}>
//       <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1 }}>
//         <img
//           src={item.image}
//           alt={item.name}
//           style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }}
//           onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop"; }}
//         />
//         <div>
//           <h3 style={{ fontSize: "15px", fontWeight: "600", color: BROWN, margin: "0 0 2px 0" }}>
//             {item.name?.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
//           </h3>
//           <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
//             <span style={{ background: "#f0e9e2", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", color: BROWN }}>
//               ₹{item.price}/kg
//             </span>
//             <span style={{ fontSize: "11px", color: "#666" }}>Pack: {item.packGet || 1}kg</span>
//           </div>
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f5f0eb", padding: "2px 6px", borderRadius: "25px" }}>
//           <button onClick={() => updateQty(item.id, -1)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "#fff", color: BROWN, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>-</button>
//           <span style={{ fontSize: "14px", fontWeight: "600", color: BROWN, minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
//           <button onClick={() => updateQty(item.id, 1)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "#fff", color: BROWN, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>+</button>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <div style={{ textAlign: "right" }}>
//             <span style={{ fontSize: "14px", fontWeight: "600", color: BROWN, minWidth: "60px", display: "block" }}>
//               ₹{item.amount.toFixed(2)}
//             </span>
//             <span style={{ fontSize: "10px", color: "#999", display: "block" }}>
//               ({item.quantity} × {item.packGet || 1}kg)
//             </span>
//           </div>
//           <div
//             onClick={() => removeItem(item.id)}
//             style={{ color: "#999", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%" }}
//             onMouseEnter={(e) => { e.currentTarget.style.background = "#fee"; e.currentTarget.style.color = "#ff4444"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#999"; }}
//           >
//             <DeleteOutlineIcon style={{ fontSize: "18px" }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────
//   // ORDER FORM (shared between mobile step 2 and desktop)
//   // ─────────────────────────────────────────────
//   const labelStyle = { display: "block", fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#333", marginBottom: "6px" };
//   const inputStyle = { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: isMobile ? "10px" : "12px", fontSize: "14px", outline: "none", background: "#fff", boxSizing: "border-box" };
//   const textareaStyle = { ...inputStyle, minHeight: isMobile ? "70px" : "100px", resize: "vertical", fontFamily: "inherit" };
//   const fgStyle = { marginBottom: isMobile ? "16px" : "20px" };

//   const OrderForm = () => (
//     <>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Customer</label>
//         <SearchableCustomerSelect
//           value={customer}
//           onChange={setCustomer}
//           onCustomerSelect={handleCustomerSelect}
//           prefilledCustomer={prefilledCustomer}
//         />
//       </div>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Broker</label>
//         <BrokerDropdown
//           selectedBroker={selectedBroker}
//           onSelectBroker={(b) => { setSelectedBroker(b); setBrokerName(b.name); }}
//           availableBrokers={availableBrokers}
//           loading={loadingBrokers}
//           onOpen={fetchBrokers}
//         />
//       </div>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Transporter</label>
//         <TransporterDropdown
//           selectedTransporter={selectedTransporter}
//           onSelectTransporter={(t) => { setSelectedTransporter(t); setTransporter(t.name); }}
//           availableTransporters={availableTransporters}
//           loading={loadingTransporters}
//           onOpen={fetchTransporters}
//         />
//       </div>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Contact Number</label>
//         <input type="tel" placeholder="Contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={inputStyle} />
//       </div>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Shipping Address</label>
//         <textarea placeholder="Shipping address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={textareaStyle} />
//       </div>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Delivery Address</label>
//         <textarea placeholder="Delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={textareaStyle} />
//       </div>
//       <div style={fgStyle}>
//         <label style={labelStyle}>Description</label>
//         <textarea placeholder="Notes or description" value={description} onChange={(e) => setDescription(e.target.value)} style={textareaStyle} />
//       </div>
//     </>
//   );

//   // ─────────────────────────────────────────────
//   // LOADING
//   // ─────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: BG_COLOR }}>
//         <div style={{ color: BROWN, fontSize: "18px" }}>Loading cart...</div>
//       </div>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // MOBILE STEP 2
//   // ─────────────────────────────────────────────
//   if (isMobile && step === 2) {
//     return (
//       <>
//         <CommonHeader
//           title="Order Details" logo="SMT"
//           showSearch={false} showCart={false}
//           showBackButton={true} showTitle={true}
//           cartItemCount={0} onBackClick={() => setStep(1)}
//           isMobile={isMobile} backgroundColor={BROWN_DARK}
//           isLoggedIn={isLoggedIn} userName={userName}
//            onSaleOrders={handleSaleOrdersClick} 
//           {...commonHeaderCustomerProps}
//           customActions={
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               {renderThreeDotsMenu()}
//             </div>
//           }
//         />

//         <div style={{ padding: "20px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "200px" }}>
//           <OrderForm />

//           <div style={{ background: "#f9f4ef", padding: "12px", borderRadius: "10px", fontSize: "13px", color: BROWN, marginBottom: "16px" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px dashed #ccc" }}>
//               <span style={{ fontWeight: "bold" }}>Product List</span>
//               <span style={{ color: BROWN, cursor: "pointer" }} onClick={() => { setCartItems({}); localStorage.removeItem('cartItems'); setStep(1); }}>Clear ▼</span>
//             </div>
//             {enhancedCartItems.map(item => (
//               <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
//                 <span>• {item.name} x {item.quantity} ({item.kgs.toFixed(2)} kg)</span>
//                 <span>₹{item.amount.toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sticky bottom bar */}
//         <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "16px", borderTop: `2px solid ${ACCENT}`, zIndex: 20 }}>
//           <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
//               <span>Total Items:</span><span>{totalItems}</span>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
//               <span>Total Kgs:</span><span>{totalKgs.toFixed(2)} kg</span>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
//               <span>Subtotal:</span><span>₹{subtotalAmount.toFixed(2)}</span>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "8px" }}>
//               <span>Total Amount:</span><span>₹{totalAmountWithTax.toFixed(2)}</span>
//             </div>
//           </div>
//           <button onClick={handleCheckout} style={{ width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
//             Order Now
//           </button>
//         </div>

//         <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
//       </>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // MOBILE STEP 1
//   // ─────────────────────────────────────────────
//   if (isMobile && step === 1) {
//     return (
//       <>
//         <CommonHeader
//           title="SM Traders" logo="SMT"
//           showSearch={false} showCart={false}
//           showBackButton={true} showTitle={true}
//           cartItemCount={0} onBackClick={() => navigate('/')}
//           isMobile={isMobile} backgroundColor={BROWN_DARK}
//           isLoggedIn={isLoggedIn} userName={userName}
//           {...commonHeaderCustomerProps}
//           customActions={
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               {renderThreeDotsMenu()}
//             </div>
//           }
//         />

//         <div style={{ padding: "12px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "130px" }}>
//           {enhancedCartItems.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px", marginTop: "20px" }}>
//               <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
//               <p style={{ color: "#666", fontSize: "16px", marginBottom: "16px" }}>Your cart is empty</p>
//               <button onClick={() => navigate('/')} style={{ background: BROWN, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Browse Products</button>
//             </div>
//           ) : (
//             enhancedCartItems.map(item => <CartItemRow key={item.id} item={item} />)
//           )}
//         </div>

//         {enhancedCartItems.length > 0 && (
//           <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", boxShadow: "0 -4px 12px rgba(0,0,0,0.1)", padding: "12px 16px", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", borderTop: `2px solid ${BROWN_DARK}`, zIndex: 1000 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
//               <div>
//                 <div>{totalItems} Items</div>
//                 <div style={{ fontSize: "12px", color: "#666" }}>Total: {totalKgs.toFixed(2)} kg</div>
//               </div>
//               <div style={{ textAlign: "right", fontWeight: "bold", color: BROWN }}>
//                 ₹{subtotalAmount.toFixed(2)}
//               </div>
//             </div>
//             <button onClick={() => setStep(2)} style={{ width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
//               Proceed <span>→</span>
//             </button>
//           </div>
//         )}

//         <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
//       </>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // DESKTOP VIEW
//   // ─────────────────────────────────────────────
//   return (
//     <>
//       <CommonHeader
//         title="SM Traders" logo="SMT"
//         showSearch={false} showCart={false}
//         showBackButton={true} showTitle={true}
//         cartItemCount={0} onBackClick={() => navigate('/')}
//         isMobile={isMobile} backgroundColor={BROWN_DARK}
//         userName={userName} isLoggedIn={isLoggedIn}
//         {...commonHeaderCustomerProps}
//         customActions={
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             {renderThreeDotsMenu()}
//           </div>
//         }
//       />

//       <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px 40px", background: BG_COLOR, minHeight: "100vh" }}>
//         {enhancedCartItems.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "80px 40px", background: "#fff", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
//             <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
//             <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>Your selection list is empty</p>
//             <button onClick={() => navigate('/')} style={{ background: BROWN, color: "#fff", border: "none", padding: "12px 30px", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}>
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "32px" }}>
//             {/* LEFT: Cart items + summary */}
//             <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "24px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
//               <h2 style={{ fontSize: "22px", fontWeight: "700", color: BROWN, margin: "0 0 20px 0", paddingBottom: "14px", borderBottom: `3px solid ${ACCENT}` }}>
//                Order Summary
//               </h2>
//               {enhancedCartItems.map(item => <CartItemRow key={item.id} item={item} />)}

//               {/* <div style={{ background: "#f9f4ef", padding: "24px", borderRadius: "16px", marginTop: "8px" }}> */}
           
              
              
//                 <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "2px dashed #ccc" }}>
//                   {[["Total Items:", totalItems], ["Total Kgs:", `${totalKgs.toFixed(2)} kg`], ["Subtotal:", `₹${subtotalAmount.toFixed(2)}`]].map(([label, val]) => (
//                     <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#666", marginBottom: "8px" }}>
//                       <span>{label}</span><span style={{ fontWeight: "600", color: BROWN }}>{val}</span>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "12px", marginTop: "4px" }}>
//                     <span>Total Amount:</span><span>₹{totalAmountWithTax.toFixed(2)}</span>
//                   </div>
//                 </div>
//               {/* </div> */}

//               <button
//                 onClick={handleCheckout}
//                 style={{ width: "100%", padding: "18px", background: BROWN, color: "#fff", border: "none", borderRadius: "50px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginTop: "24px", boxShadow: "0 4px 12px rgba(74,44,26,0.2)" }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
//                 onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
//               >
//                 Order Now
//               </button>
//             </div>

//             {/* RIGHT: Order form */}
//             <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "32px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
//               <h2 style={{ fontSize: "22px", fontWeight: "700", color: BROWN, margin: "0 0 24px 0", paddingBottom: "14px", borderBottom: `3px solid ${ACCENT}` }}>
//                 Order Details
//               </h2>

//               {/* Show currently selected customer from header if any */}
//               {/* {headerSelectedCustomer && (
//                 <div style={{ marginBottom: "20px", padding: "12px 16px", background: "#f0e9e2", borderRadius: "10px", border: `1px solid ${ACCENT}` }}>
//                   <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>Selected from header</div>
//                   <div style={{ fontSize: "15px", fontWeight: "600", color: BROWN }}>{headerSelectedCustomer.name}</div>
//                   <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#666", marginTop: "4px", flexWrap: "wrap" }}>
//                     {headerSelectedCustomer.mobile && <span>📱 {headerSelectedCustomer.mobile}</span>}
//                     {headerSelectedCustomer.city && <span>📍 {headerSelectedCustomer.city}</span>}
//                     {headerSelectedCustomer.brokerName && <span>🏢 {headerSelectedCustomer.brokerName}</span>}
//                     {headerSelectedCustomer.transporterName && <span>🚚 {headerSelectedCustomer.transporterName}</span>}
//                   </div>
//                 </div>
//               )} */}

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
//                 <div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Customer</label>
//                     <SearchableCustomerSelect value={customer} onChange={setCustomer} onCustomerSelect={handleCustomerSelect} prefilledCustomer={prefilledCustomer} />
//                   </div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Broker</label>
//                     <BrokerDropdown selectedBroker={selectedBroker} onSelectBroker={(b) => { setSelectedBroker(b); setBrokerName(b.name); }} availableBrokers={availableBrokers} loading={loadingBrokers} onOpen={fetchBrokers} />
//                   </div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Shipping Address</label>
//                     <textarea placeholder="Shipping address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={textareaStyle} />
//                   </div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Description</label>
//                     <textarea placeholder="Notes" value={description} onChange={(e) => setDescription(e.target.value)} style={textareaStyle} />
//                   </div>
//                 </div>
//                 <div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Transporter</label>
//                     <TransporterDropdown selectedTransporter={selectedTransporter} onSelectTransporter={(t) => { setSelectedTransporter(t); setTransporter(t.name); }} availableTransporters={availableTransporters} loading={loadingTransporters} onOpen={fetchTransporters} />
//                   </div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Contact Number</label>
//                     <input type="tel" placeholder="Contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={inputStyle} />
//                   </div>
//                   <div style={fgStyle}>
//                     <label style={labelStyle}>Delivery Address</label>
//                     <textarea placeholder="Delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={textareaStyle} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
//     </>
//   );
// }


// function SaleOrders({ onBack }) {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showDetail, setShowDetail] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchSaleOrders();
//   }, []);

//   const fetchSaleOrders = async () => {
//     setLoading(true);
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
      
//       const userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';

//       const response = await fetchLink({
//         address: `sales/salesOrder/list?Created_by=${userId}`,
//         method: 'GET',
//       });

//          if (response?.success) {
//         const orderData = response.data || response.Data || [];
//         setOrders(Array.isArray(orderData) ? orderData : []);
//       } else {
//         toast.error(response?.message || "Failed to fetch orders");
//         setOrders([]);
//       }
//     } catch (error) {
//       console.error("Error fetching sale orders:", error);
//       toast.error("Failed to load sale orders");
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return dateString;
//     }
//   };


//   const getTotalBillQty = (productsList) => {
//     if (!productsList || !Array.isArray(productsList) || productsList.length === 0) {
//       return 0;
//     }
//     return productsList.reduce((sum, product) => {
//       return sum + (parseFloat(product.Bill_Qty) || 0);
//     }, 0);
//   };


//   const getTotalItems = (productsList) => {
//     if (!productsList || !Array.isArray(productsList)) {
//       return 0;
//     }
//     return productsList.length;
//   };

//   const filteredOrders = orders.filter(order => {
//     if (!searchTerm) return true;
//     const search = searchTerm.toLowerCase();
    

//     const productNames = (order.Products_List || [])
//       .map(p => p.Product_Name || '')
//       .join(' ')
//       .toLowerCase();
    
//     return (
//       (order.Retailer_Name && order.Retailer_Name.toLowerCase().includes(search)) ||
//       (order.Customer_Name && order.Customer_Name.toLowerCase().includes(search)) ||
//       (order.So_Inv_No && order.So_Inv_No.toLowerCase().includes(search)) ||
//       (order.So_No && order.So_No.toString().includes(search)) ||
//       (order.So_Date && order.So_Date.includes(search)) ||
//       (order.Narration && order.Narration.toLowerCase().includes(search)) ||
//       (order.OrderStatus && order.OrderStatus.toLowerCase().includes(search)) ||
//       productNames.includes(search)
//     );
//   });

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order);
//     setShowDetail(true);
//   };

//   const handleEditOrder = (e, order) => {
//     e.stopPropagation(); 
//     toast.info(`Edit order #${order.So_Inv_No || order.So_No}`);
//   };

//   const handleBackToList = () => {
//     setSelectedOrder(null);
//     setShowDetail(false);
//   };

//   if (showDetail && selectedOrder) {
//     return (
//       <div style={{ 
//         fontFamily: "'Georgia', serif", 
//         background: "#f5f0eb", 
//         minHeight: "100vh",
//         padding: isMobile ? "0" : "24px"
//       }}>
//         {/* Header */}
//         <div style={{
//           padding: "16px 20px",
//           backgroundColor: BROWN_DARK,
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           gap: "12px",
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}>
//           <button
//             onClick={handleBackToList}
//             style={{
//               background: "transparent",
//               border: "none",
//               color: "#fff",
//               fontSize: "20px",
//               cursor: "pointer",
//               padding: "4px",
//             }}
//           >
//             ←
//           </button>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: "18px", fontWeight: "bold" }}>
//               Order #{selectedOrder.So_Inv_No || selectedOrder.So_No}
//             </div>
//             <div style={{ fontSize: "12px", opacity: 0.8 }}>
//               {formatDate(selectedOrder.So_Date)}
//             </div>
//           </div>
//         </div>

//         {/* Order Details */}
//         <div style={{ 
//           padding: isMobile ? "16px" : "24px",
//           maxWidth: "800px",
//           margin: "0 auto"
//         }}>
//           {/* Customer Info Card */}
//           <div style={{
//             background: "#fff",
//             borderRadius: "12px",
//             padding: "20px",
//             marginBottom: "16px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           }}>
//             <h3 style={{ margin: "0 0 12px 0", color: BROWN, fontSize: "16px" }}>
//               Customer Details
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
//               <div>
//                 <div style={{ color: "#666", fontSize: "12px", marginBottom: "2px" }}>Name</div>
//                 <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                   {selectedOrder.Retailer_Name || selectedOrder.Customer_Name || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ color: "#666", fontSize: "12px", marginBottom: "2px" }}>Contact</div>
//                 <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                   {selectedOrder.Ord_Mobile_No || "N/A"}
//                 </div>
//               </div>
//               {selectedOrder.Shipp_Address && (
//                 <div style={{ gridColumn: "1/-1" }}>
//                   <div style={{ color: "#666", fontSize: "12px", marginBottom: "2px" }}>Shipping Address</div>
//                   <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                     {selectedOrder.Shipp_Address}
//                   </div>
//                 </div>
//               )}
//               {selectedOrder.Broker_Name && (
//                 <div>
//                   <div style={{ color: "#666", fontSize: "12px", marginBottom: "2px" }}>Broker</div>
//                   <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                     {selectedOrder.Broker_Name}
//                   </div>
//                 </div>
//               )}
//               {selectedOrder.Transporter_Name && (
//                 <div>
//                   <div style={{ color: "#666", fontSize: "12px", marginBottom: "2px" }}>Transporter</div>
//                   <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                     {selectedOrder.Transporter_Name}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Products List Card */}
//           {selectedOrder.Products_List && selectedOrder.Products_List.length > 0 && (
//             <div style={{
//               background: "#fff",
//               borderRadius: "12px",
//               padding: "20px",
//               marginBottom: "16px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}>
//               <h3 style={{ margin: "0 0 12px 0", color: BROWN, fontSize: "16px" }}>
//                 Products ({selectedOrder.Products_List.length})
//               </h3>
//               <div style={{ overflowX: "auto" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
//                   <thead>
//                     <tr style={{ borderBottom: "2px solid #e8ddd4" }}>
//                       <th style={{ padding: "8px", textAlign: "left", color: "#666", fontSize: "11px" }}>Product</th>
//                       <th style={{ padding: "8px", textAlign: "right", color: "#666", fontSize: "11px" }}>Qty (kg)</th>
//                       <th style={{ padding: "8px", textAlign: "right", color: "#666", fontSize: "11px" }}>Rate</th>
//                       <th style={{ padding: "8px", textAlign: "right", color: "#666", fontSize: "11px" }}>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedOrder.Products_List.map((product, idx) => (
//                       <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
//                         <td style={{ padding: "8px", color: BROWN_DARK }}>
//                           {product.Product_Name || "Unknown Product"}
//                         </td>
//                         <td style={{ padding: "8px", textAlign: "right", color: "#666" }}>
//                           {parseFloat(product.Bill_Qty || 0).toFixed(2)}
//                         </td>
//                         <td style={{ padding: "8px", textAlign: "right", color: "#666" }}>
//                           ₹{parseFloat(product.Item_Rate || 0).toFixed(2)}
//                         </td>
//                         <td style={{ padding: "8px", textAlign: "right", color: BROWN_DARK, fontWeight: "500" }}>
//                           ₹{parseFloat(product.Amount || 0).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Amount Summary Card */}
//           <div style={{
//             background: "#fff",
//             borderRadius: "12px",
//             padding: "20px",
//             marginBottom: "16px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           }}>
//             <h3 style={{ margin: "0 0 12px 0", color: BROWN, fontSize: "16px" }}>
//               Amount Summary
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
//               <div>
//                 <div style={{ color: "#666", fontSize: "12px" }}>Total Before Tax</div>
//                 <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                   ₹{parseFloat(selectedOrder.Total_Before_Tax || 0).toFixed(2)}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ color: "#666", fontSize: "12px" }}>Total Tax</div>
//                 <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                   ₹{parseFloat(selectedOrder.Total_Tax || 0).toFixed(2)}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ color: "#666", fontSize: "12px" }}>Total Kgs</div>
//                 <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                   {getTotalBillQty(selectedOrder.Products_List).toFixed(2)} kg
//                 </div>
//               </div>
//               <div>
//                 <div style={{ color: "#666", fontSize: "12px" }}>Total Items</div>
//                 <div style={{ color: BROWN_DARK, fontWeight: "500" }}>
//                   {selectedOrder.Products_List?.length || 0}
//                 </div>
//               </div>
//             </div>
//             <div style={{
//               marginTop: "16px",
//               paddingTop: "16px",
//               borderTop: "2px solid #e8ddd4",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}>
//               <span style={{ fontSize: "16px", fontWeight: "bold", color: BROWN }}>Total Invoice Value</span>
//               <span style={{ fontSize: "20px", fontWeight: "bold", color: BROWN_DARK }}>
//                 ₹{parseFloat(selectedOrder.Total_Invoice_value || 0).toFixed(2)}
//               </span>
//             </div>
//           </div>

//           {/* Narration */}
//           {selectedOrder.Narration && (
//             <div style={{
//               background: "#fff",
//               borderRadius: "12px",
//               padding: "20px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}>
//               <h3 style={{ margin: "0 0 8px 0", color: BROWN, fontSize: "16px" }}>
//                 Notes
//               </h3>
//               <p style={{ margin: 0, color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
//                 {selectedOrder.Narration}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Order List View
//   return (
//     <div style={{ 
//       fontFamily: "'Georgia', serif", 
//       background: "#f5f0eb", 
//       minHeight: "100vh" 
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: "16px 20px",
//         backgroundColor: BROWN_DARK,
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         position: "sticky",
//         top: 0,
//         zIndex: 100,
//       }}>
//         <button
//           onClick={onBack}
//           style={{
//             background: "transparent",
//             border: "none",
//             color: "#fff",
//             fontSize: "20px",
//             cursor: "pointer",
//             padding: "4px",
//           }}
//         >
//           ←
//         </button>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: "18px", fontWeight: "bold" }}>My Sale Orders</div>
//           <div style={{ fontSize: "12px", opacity: 0.8 }}>{orders.length} orders found</div>
//         </div>
//       </div>

     
//       <div style={{ padding: isMobile ? "12px" : "24px", overflowX: "auto" }}>
//         {loading ? (
//           <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
//             <CircularProgress style={{ color: BROWN, marginBottom: "16px" }} />
//             <p>Loading orders...</p>
//           </div>
//         ) : filteredOrders.length === 0 ? (
//           <div style={{ 
//             textAlign: "center", 
//             padding: "60px 20px", 
//             color: "#999" 
//           }}>
//             <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
//             <h3 style={{ color: "#666", marginBottom: "8px" }}>No Orders Found</h3>
//             <p style={{ fontSize: "14px" }}>
//               {searchTerm ? "Try adjusting your search terms" : "You haven't created any orders yet"}
//             </p>
//           </div>
//         ) : isMobile ? (
//           // Mobile Card View
//           <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             {filteredOrders.map((order, index) => {
//               const totalBillQty = getTotalBillQty(order.Products_List);
//               const totalItems = getTotalItems(order.Products_List);
              
//               return (
//                 <div
//                   key={order.So_Id || order.So_No || index}
//                   style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "16px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     border: "1px solid #e8ddd4",
//                   }}
//                 >
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: "15px", fontWeight: "600", color: BROWN_DARK, marginBottom: "4px" }}>
//                         {order.Retailer_Name || order.Customer_Name || "Unknown Customer"}
//                       </div>
//                       <div style={{ fontSize: "12px", color: "#666" }}>
//                         Order #{order.So_Inv_No || order.So_No}
//                       </div>
//                     </div>
//                     <div style={{ textAlign: "right", marginLeft: "12px" }}>
//                       <div style={{ fontSize: "15px", fontWeight: "bold", color: BROWN_DARK }}>
//                         ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
//                       </div>
//                       <div style={{ fontSize: "11px", color: "#666" }}>
//                         {totalItems} items • {totalBillQty.toFixed(2)} kg
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#999", marginBottom: "8px" }}>
//                     <span>{formatDate(order.So_Date)}</span>
//                     <span style={{ 
//                       padding: "2px 8px", 
//                       borderRadius: "10px", 
//                       background: order.OrderStatus === "pending" ? "#fff3cd" : "#d4edda",
//                       color: order.OrderStatus === "pending" ? "#856404" : "#155724",
//                       fontSize: "10px",
//                       fontWeight: "600"
//                     }}>
//                       {order.OrderStatus || order.VoucherTypeGet || "N/A"}
//                     </span>
//                   </div>
                  
//                   {order.Narration && (
//                     <div style={{ 
//                       fontSize: "11px",
//                       color: "#888",
//                       fontStyle: "italic",
//                       padding: "8px",
//                       background: "#f9f4ef",
//                       borderRadius: "8px",
//                       marginBottom: "8px"
//                     }}>
//                       {order.Narration}
//                     </div>
//                   )}
                  
//                   <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
//                     <button
//                       onClick={() => handleViewOrder(order)}
//                       style={{
//                         padding: "6px 12px",
//                         background: BROWN,
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "15px",
//                         fontSize: "11px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={(e) => handleEditOrder(e, order)}
//                       style={{
//                         padding: "6px 12px",
//                         background: ACCENT,
//                         color: BROWN_DARK,
//                         border: "none",
//                         borderRadius: "15px",
//                         fontSize: "11px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       ✏️ Edit
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           // Desktop Table View
//           <table style={{
//             width: "100%",
//             borderCollapse: "separate",
//             borderSpacing: "0 8px",
//             maxWidth: "1200px",
//             margin: "0 auto",
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f9f4ef" }}>
//                 <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Order #</th>
//                 <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Date</th>
//                 <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Customer</th>
//                 <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Items</th>
//                 <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Kgs</th>
//                 <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Amount</th>
//                 <th style={{ padding: "12px 16px", textAlign: "center", color: BROWN, fontSize: "13px", fontWeight: "600", borderBottom: "2px solid #e8ddd4" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order, index) => {
//                 const totalBillQty = getTotalBillQty(order.Products_List);
//                 const totalItems = getTotalItems(order.Products_List);
                
//                 return (
//                   <tr
//                     key={order.So_Id || order.So_No || index}
//                     onClick={() => handleViewOrder(order)}
//                     style={{
//                       backgroundColor: "#fff",
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = "#fdf8f3";
//                       e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = "#fff";
//                       e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.06)";
//                     }}
//                   >
//                     <td style={{ padding: "14px 16px", color: BROWN_DARK, fontWeight: "500", fontSize: "13px", borderRadius: "8px 0 0 8px" }}>
//                       {order.So_Inv_No || order.So_No || "N/A"}
//                     </td>
//                     <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>
//                       {order.So_Date ? order.So_Date.split('T')[0] : "N/A"}
//                     </td>
//                     <td style={{ padding: "14px 16px" }}>
//                       <div style={{ color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>
//                         {order.Retailer_Name || order.Customer_Name || "Unknown"}
//                       </div>
//                       {order.Narration && (
//                         <div style={{ fontSize: "11px", color: "#999", marginTop: "2px", fontStyle: "italic" }}>
//                           {order.Narration.substring(0, 50)}{order.Narration.length > 50 ? "..." : ""}
//                         </div>
//                       )}
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
//                       {totalItems}
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
//                       {totalBillQty.toFixed(2)} kg
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", color: BROWN_DARK, fontWeight: "600", fontSize: "14px" }}>
//                       ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "center", borderRadius: "0 8px 8px 0" }}>
//                       <button
//                         onClick={(e) => handleEditOrder(e, order)}
//                         title="Edit Order"
//                         style={{
//                           background: "transparent",
//                           border: `1px solid ${ACCENT}`,
//                           borderRadius: "6px",
//                           padding: "6px 10px",
//                           cursor: "pointer",
//                           color: BROWN,
//                           fontSize: "14px",
//                           transition: "all 0.2s",
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = ACCENT;
//                           e.currentTarget.style.color = "#fff";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = "transparent";
//                           e.currentTarget.style.color = BROWN;
//                         }}
//                       >
//                         ✏️
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from "@mui/material/CircularProgress";
import { fetchLink } from "./fetchComponent";
import CommonHeader from './CommonHeader';
import { encryptPasswordFun } from "./functions";

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";

// ─────────────────────────────────────────────
// LOGIN POPUP
// ─────────────────────────────────────────────
const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) { setStep(1); setUsername(""); setPassword(""); }
  }, [isOpen]);

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
        localStorage.setItem("user", JSON.stringify({ ...customer, Name: usename }));
        localStorage.setItem("session", JSON.stringify({ username: username.trim(), ...data }));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("username", usename);
        localStorage.setItem("userType", "customer");
        localStorage.setItem("retId", customer.Ret_Id || "");
        toast.success("Login successful!");
        setUsername(""); setPassword(""); setStep(1);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (error) {
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
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
        maxWidth: "400px", width: "90%",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          background: "transparent", border: "none", fontSize: "20px",
          cursor: "pointer", color: "#999", padding: "4px 8px", borderRadius: "50%",
        }}
          onMouseEnter={(e) => { e.target.style.background = "#f0f0f0"; e.target.style.color = "#666"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#999"; }}
        >✕</button>

        <div style={{ background: "#f9f4ef", borderRadius: "12px", padding: "20px" }}>
          <div style={{
            fontSize: "18px", fontWeight: "600", color: BROWN,
            marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}`,
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            {step === 2 && (
              <button onClick={() => { setStep(1); setPassword(""); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: BROWN, fontSize: "18px", padding: 0 }}>←</button>
            )}
            <span>{step === 1
              ? <><span style={{ color: BROWN_DARK }}>Sign</span> In</>
              : <><span style={{ color: BROWN_DARK }}>Enter</span> Password</>}
            </span>
          </div>

          {step === 1 && (
            <form onSubmit={handleUsernameSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>Username</div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username" required autoFocus
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
              <button type="submit" disabled={isLoading} style={{
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
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" required autoFocus
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
              <button type="submit" disabled={isLoading} style={{
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

// ─────────────────────────────────────────────
// CUSTOMER SELECTOR (header dropdown)
// ─────────────────────────────────────────────
function CustomerSelector({ isLoggedIn, userType, customers, selectedCustomer, onSelectCustomer, loading, isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false); setSearch(""); setFilteredCustomers([]); setHasSearched(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && !hasSearched) setFilteredCustomers(customers);
  }, [isOpen, customers, hasSearched]);

  if (!isLoggedIn || customers.length === 0) return null;

  const performSearch = () => {
    if (!search.trim()) { setFilteredCustomers(customers); setHasSearched(false); return; }
    const s = search.toLowerCase();
    setFilteredCustomers(customers.filter(c =>
      (c.name && c.name.toLowerCase().includes(s)) ||
      (c.billName && c.billName.toLowerCase().includes(s)) ||
      (c.mobile && c.mobile.includes(search)) ||
      (c.city && c.city.toLowerCase().includes(s))
    ));
    setHasSearched(true);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) { setSearch(""); setFilteredCustomers(customers); setHasSearched(false); }
        }}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 14px", background: "#f5ede3",
          border: `1.5px solid ${isOpen ? BROWN : ACCENT}`,
          borderRadius: "25px", cursor: "pointer", transition: "all 0.2s",
          maxWidth: isMobile ? "180px" : "320px",
        }}
      >
        <span style={{ fontSize: "16px" }}>🏪</span>
        <span style={{
          fontSize: isMobile ? "12px" : "14px", fontWeight: "500",
          color: selectedCustomer ? BROWN_DARK : "#666",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
        }}>
          {selectedCustomer ? selectedCustomer.name : "Select outlet..."}
        </span>
        <span style={{ fontSize: "12px", color: BROWN_LIGHT, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: "fixed",
          top: isMobile ? "50%" : "calc(100% + 8px)",
          left: isMobile ? "50%" : "auto",
          right: isMobile ? "auto" : 0,
          transform: isMobile ? "translate(-50%, -50%)" : "none",
          minWidth: "300px",
          width: isMobile ? "calc(100vw - 32px)" : "380px",
          maxWidth: "500px",
          maxHeight: isMobile ? "70vh" : "350px",
          overflowY: "auto", background: "#fff",
          border: "1px solid #ddd", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 9999,
        }}>
          <div style={{
            padding: "10px 12px", borderBottom: "1px solid #f0f0f0",
            position: "sticky", top: 0, background: "#fff", zIndex: 1,
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <div style={{ flex: 1 }}>
              <input
                type="text" placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(); } }}
                autoFocus
                style={{
                  width: "100%", padding: "8px 12px",
                  border: `1px solid ${ACCENT}`, borderRadius: "8px",
                  fontSize: "13px", outline: "none", boxSizing: "border-box",
                  color: BROWN_DARK, backgroundColor: "#fff",
                }}
                onFocus={(e) => { e.target.style.borderColor = BROWN; }}
                onBlur={(e) => { e.target.style.borderColor = ACCENT; }}
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); performSearch(); }}
              style={{
                background: BROWN, border: "none", borderRadius: "8px",
                padding: "8px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
              onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
            >
              <SearchIcon style={{ fontSize: "18px", color: "#fff" }} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <CircularProgress size={20} style={{ color: BROWN }} />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              {hasSearched ? "No matching outlets found" : "No outlets found"}
            </div>
          ) : (
            <>
              {hasSearched && (
                <div style={{ padding: "8px 14px", fontSize: "11px", color: "#999", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                  Search results for: "{search}"
                </div>
              )}
              {filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => { onSelectCustomer(c); setIsOpen(false); setSearch(""); setFilteredCustomers([]); setHasSearched(false); }}
                  style={{
                    padding: "12px 14px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
                    background: selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (selectedCustomer?.id !== c.id) e.currentTarget.style.background = "#faf6f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent"; }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "500", color: BROWN_DARK, marginBottom: "3px" }}>{c.name}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {c.mobile && <span>📱 {c.mobile}</span>}
                    {c.city && <span> • {c.city}</span>}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// USER MENU DROPDOWN
// ─────────────────────────────────────────────
const UserMenuDropdown = ({ isOpen, onClose, isLoggedIn, userName, onLoginClick, onLogout, userType, onSaleOrders }) => {
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} style={{
      position: "absolute", top: "calc(100% + 8px)", right: 0,
      minWidth: isMobile ? "250px" : "320px",
      background: "#fff", borderRadius: isMobile ? "12px" : "20px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)", zIndex: 1000, overflow: "hidden",
      animation: "slideDown 0.2s ease",
    }}>
      {isLoggedIn ? (
        <>
          <div style={{
            padding: isMobile ? "20px 16px" : "28px 24px",
            background: "linear-gradient(135deg, #4a2c1a 0%, #3a1f0e 100%)",
            borderBottom: `1px solid ${ACCENT}`,
          }}>
            <div style={{
              width: isMobile ? "48px" : "64px", height: isMobile ? "48px" : "64px",
              borderRadius: "50%", background: "#c8a96e",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px",
            }}>
              <span style={{ color: "#4a2c1a", fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>
                {userName?.charAt(0) || ""}
              </span>
            </div>
            <div style={{ fontSize: isMobile ? "18px" : "20px", color: "#fff" }}>{userName || ""}</div>
            <div style={{ fontSize: isMobile ? "13px" : "15px", color: "rgba(255,255,255,0.8)" }}>Signed In • {userType}</div>
          </div>
          <div style={{ padding: isMobile ? "8px" : "12px" }}>
            {userType === "employee" && (
              <button
                onClick={() => { onSaleOrders(); onClose(); }}
                style={{
                  width: "100%", padding: isMobile ? "14px 16px" : "18px 24px",
                  background: "transparent", border: "none", textAlign: "left",
                  fontSize: isMobile ? "15px" : "17px", color: BROWN, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: isMobile ? "12px" : "16px",
                  borderRadius: isMobile ? "8px" : "12px",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f5f0eb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: isMobile ? "18px" : "22px" }}>📋</span>
                <span> Sale Orders</span>
              </button>
            )}

            <button
              onClick={() => { onLogout(); onClose(); }}
              style={{
                width: "100%", padding: isMobile ? "14px 16px" : "18px 24px",
                background: "transparent", border: "none", textAlign: "left",
                fontSize: isMobile ? "15px" : "17px", color: "#d32f2f", cursor: "pointer",
                display: "flex", alignItems: "center", gap: isMobile ? "12px" : "16px",
                borderRadius: isMobile ? "8px" : "12px", marginTop: "4px",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ padding: isMobile ? "20px 16px" : "28px 24px", background: "#f9f4ef", textAlign: "center" }}>
            <div style={{
              width: isMobile ? "48px" : "64px", height: isMobile ? "48px" : "64px",
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
              onClick={() => { onLoginClick(); onClose(); }}
              style={{
                width: "100%", padding: isMobile ? "14px 16px" : "16px 24px",
                background: BROWN, border: "none", borderRadius: isMobile ? "8px" : "12px",
                fontSize: isMobile ? "15px" : "18px", fontWeight: "600", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? "8px" : "12px",
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
  );
};

// ─────────────────────────────────────────────
// SEARCHABLE CUSTOMER SELECT (form field)
// ─────────────────────────────────────────────
const SearchableCustomerSelect = ({ value, onChange, onCustomerSelect, prefilledCustomer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(prefilledCustomer?.name || "");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(
    prefilledCustomer ? { Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name } : null
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (prefilledCustomer?.id) {
      setSearchTerm(prefilledCustomer.name || "");
      setSelectedCustomer({ Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name });
    }
  }, [prefilledCustomer]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
        if (response?.success && Array.isArray(response.data)) {
          setCustomers(response.data.map(c => ({
            ...c,
            Short_Name: c.Short_Name ? c.Short_Name.replace(/\u0004/g, '').trim() : '',
            Billl_Name: c.Billl_Name ? c.Billl_Name.trim() : '',
            Mobile_No: c.Mobile_No ? c.Mobile_No.trim() : '',
            Address: c.Address ? c.Address.trim() : '',
            City: c.City ? c.City.trim() : '',
            Broker_Name: c.Broker_Name?.trim() || c.Broker?.trim() || '',
            Transporter_Name: c.Transporter_Name?.trim() || c.Transporter?.trim() || '',
          })));
        } else {
          toast.error(response?.message || "Failed to load customers");
        }
      } catch (error) {
        toast.error("Failed to load customers: " + (error.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    if (!c) return false;
    const s = searchTerm.toLowerCase();
    return (
      c.Short_Name?.toLowerCase().includes(s) ||
      c.Billl_Name?.toLowerCase().includes(s) ||
      c.Mobile_No?.includes(searchTerm)
    );
  });

  const handleSelectCustomer = (c) => {
    setSelectedCustomer(c);
    setSearchTerm(c.Short_Name || "");
    setIsOpen(false);
    onChange(c.Customer_Id);
    if (onCustomerSelect) {
      onCustomerSelect({
        broker: c.Broker_Name || c.Broker?.trim() || "",
        transporter: c.Transporter_Name || c.Transporter?.trim() || "",
        customerId: c.Customer_Id,
        customerName: c.Short_Name || "",
        mobileNo: c.Mobile_No || "",
        address: c.Address || "",
        city: c.City || "",
        Broker_Id: c.Broker_Id || "",
        Transporter_Id: c.Transporter_Id || "",
      });
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Search customer by name or mobile..."
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      />
      {isOpen && searchTerm && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          maxHeight: "300px", overflowY: "auto", background: "#fff",
          border: "1px solid #ddd", borderRadius: "8px", marginTop: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 1000,
        }}>
          {loading ? (
            <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>Loading customers...</div>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map(c => (
              <div key={c.Customer_Id} onClick={() => handleSelectCustomer(c)}
                style={{
                  padding: "12px", cursor: "pointer", borderBottom: "1px solid #eee",
                  backgroundColor: selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={(e) => e.currentTarget.style.background = selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent"}
              >
                <div style={{ fontWeight: "600", color: BROWN }}>{c.Short_Name || "Unnamed Customer"}</div>
                {c.Billl_Name && <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{c.Billl_Name}</div>}
                <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#888", marginTop: "4px", flexWrap: "wrap" }}>
                  {c.Mobile_No && <span>📞 {c.Mobile_No}</span>}
                  {c.City && <span>📍 {c.City}</span>}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>No customers found</div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// BROKER DROPDOWN
// ─────────────────────────────────────────────
const BrokerDropdown = ({ selectedBroker, onSelectBroker, availableBrokers, loading, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBrokers = availableBrokers.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.code && b.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div onClick={() => { setIsOpen(!isOpen); onOpen && onOpen(); }}
        style={{
          padding: "12px", border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
          borderRadius: "8px", background: "#fff", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
        <span style={{ color: selectedBroker.name ? BROWN : "#999" }}>
          {selectedBroker.name || "Select Broker"}
        </span>
        <span style={{ color: BROWN_LIGHT }}>▼</span>
      </div>
      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, background: "#fff",
          border: "1px solid #ddd", borderRadius: "8px", marginTop: "4px",
          maxHeight: "250px", overflowY: "auto", zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          <div style={{ padding: "8px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
            <input type="text" placeholder="Search broker..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {loading ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading brokers...</div>
          ) : filteredBrokers.length > 0 ? (
            filteredBrokers.map(broker => (
              <div key={broker.id}
                onClick={() => { onSelectBroker({ id: broker.id, name: broker.name }); setIsOpen(false); setSearchTerm(""); }}
                style={{
                  padding: "12px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
                  background: selectedBroker.id === broker.id ? "#f0e9e2" : "transparent",
                }}
                onMouseEnter={(e) => { if (selectedBroker.id !== broker.id) e.currentTarget.style.background = "#f5f5f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedBroker.id === broker.id ? "#f0e9e2" : "transparent"; }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{broker.name}</div>
                {(broker.code || broker.mobile) && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {broker.code && `Code: ${broker.code}`}{broker.code && broker.mobile && " | "}{broker.mobile}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>No brokers found</div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// TRANSPORTER DROPDOWN
// ─────────────────────────────────────────────
const TransporterDropdown = ({ selectedTransporter, onSelectTransporter, availableTransporters, loading, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTransporters = availableTransporters.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.code && t.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div onClick={() => { setIsOpen(!isOpen); onOpen && onOpen(); }}
        style={{
          padding: "12px", border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
          borderRadius: "8px", background: "#fff", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
        <span style={{ color: selectedTransporter.name ? BROWN : "#999" }}>
          {selectedTransporter.name || "Select Transporter"}
        </span>
        <span style={{ color: BROWN_LIGHT }}>▼</span>
      </div>
      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, background: "#fff",
          border: "1px solid #ddd", borderRadius: "8px", marginTop: "4px",
          maxHeight: "250px", overflowY: "auto", zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          <div style={{ padding: "8px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
            <input type="text" placeholder="Search transporter..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {loading ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading transporters...</div>
          ) : filteredTransporters.length > 0 ? (
            filteredTransporters.map(transporter => (
              <div key={transporter.id}
                onClick={() => { onSelectTransporter({ id: transporter.id, name: transporter.name }); setIsOpen(false); setSearchTerm(""); }}
                style={{
                  padding: "12px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
                  background: selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent",
                }}
                onMouseEnter={(e) => { if (selectedTransporter.id !== transporter.id) e.currentTarget.style.background = "#f5f5f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent"; }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{transporter.name}</div>
                {(transporter.code || transporter.mobile) && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {transporter.code && `Code: ${transporter.code}`}{transporter.code && transporter.mobile && " | "}{transporter.mobile}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>No transporters found</div>
          )}
        </div>
      )}
    </div>
  );
};


function SaleOrders({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchSaleOrders();
  }, []);

  const fetchSaleOrders = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
      const userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';

      const response = await fetchLink({
        address: `sales/salesOrder/list?Created_by=${userId}`,
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
      return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getTotalBillQty = (productsList) => {
    if (!productsList || !Array.isArray(productsList) || productsList.length === 0) return 0;
    return productsList.reduce((sum, product) => sum + (parseFloat(product.Bill_Qty) || 0), 0);
  };

  const getTotalItems = (productsList) => {
    if (!productsList || !Array.isArray(productsList)) return 0;
    return productsList.length;
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const productNames = (order.Products_List || []).map(p => p.Product_Name || '').join(' ').toLowerCase();
    return (
      (order.Retailer_Name && order.Retailer_Name.toLowerCase().includes(search)) ||
      (order.Customer_Name && order.Customer_Name.toLowerCase().includes(search)) ||
      (order.So_Inv_No && order.So_Inv_No.toLowerCase().includes(search)) ||
      (order.So_No && order.So_No.toString().includes(search)) ||
      (order.So_Date && order.So_Date.includes(search)) ||
      (order.Narration && order.Narration.toLowerCase().includes(search)) ||
      (order.OrderStatus && order.OrderStatus.toLowerCase().includes(search)) ||
      productNames.includes(search)
    );
  });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleEditOrder = (e, order) => {
    e.stopPropagation();
    toast.info(`Edit order #${order.So_Inv_No || order.So_No}`);
  };

  // ── Expandable Product List Component ──
  const ProductListExpand = ({ products }) => {
    if (!products || products.length === 0) return null;
    
    return (
      <div style={{ 
        padding: "16px", 
        background: "#f9f4ef", 
        borderTop: "2px solid #e8ddd4",
        animation: "slideDown 0.3s ease"
      }}>
        <h4 style={{ 
          margin: "0 0 12px 0", 
          color: BROWN, 
          fontSize: "14px", 
          fontWeight: "600" 
        }}>
          Products ({products.length})
        </h4>
        
        {/* Product Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            fontSize: "13px",
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
          }}>
            <thead>
              <tr style={{ 
                background: "#f0e9e2", 
                borderBottom: `2px solid ${ACCENT}`
              }}>
                <th style={productTableHeaderStyle}>S.No</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "left" }}>Product Name</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Qty (kg)</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Rate (₹/kg)</th>
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr 
                  key={idx} 
                  style={{ 
                    borderBottom: "1px solid #f0f0f0",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fdf8f3"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={productTableCellStyle}>{idx + 1}</td>
                  <td style={{ ...productTableCellStyle, textAlign: "left", fontWeight: "500", color: BROWN_DARK }}>
                    {product.Product_Name || "Unknown Product"}
                  </td>
                  <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                    {parseFloat(product.Bill_Qty || 0).toFixed(2)}
                  </td>
                  <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                    ₹{parseFloat(product.Item_Rate || 0).toFixed(2)}
                  </td>
                  <td style={{ ...productTableCellStyle, textAlign: "right", fontWeight: "600", color: BROWN_DARK }}>
                    ₹{parseFloat(product.Amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const productTableHeaderStyle = {
    padding: "10px 12px",
    textAlign: "center",
    color: BROWN,
    fontSize: "12px",
    fontWeight: "600"
  };

  const productTableCellStyle = {
    padding: "10px 12px",
    textAlign: "center",
    fontSize: "12px",
    color: "#666"
  };

  // ── Main Render ──
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", backgroundColor: BROWN_DARK, color: "#fff",
        display: "flex", alignItems: "center", gap: "12px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={onBack} style={{ 
          background: "transparent", border: "none", color: "#fff", 
          fontSize: "20px", cursor: "pointer", padding: "4px" 
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}> Sale Orders</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>{orders.length} orders found</div>
        </div>
      </div>

      

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
              {searchTerm ? "Try adjusting your search terms" : "You haven't created any orders yet"}
            </p>
          </div>
        ) : isMobile ? (
       
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredOrders.map((order, index) => {
              const totalBillQty = getTotalBillQty(order.Products_List);
              const totalItems = getTotalItems(order.Products_List);
              const orderKey = order.So_Id || order.So_No || index;
              const isExpanded = expandedOrders[orderKey] || false;
              
              return (
                <div
                  key={orderKey}
                  style={{ 
                    background: "#fff", borderRadius: "12px", 
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", 
                    border: "1px solid #e8ddd4",
                    overflow: "hidden"
                  }}
                >
                  <div 
                    onClick={() => toggleOrderExpansion(orderKey)}
                    style={{ padding: "16px", cursor: "pointer" }}
                  >
                    <div style={{ 
                      display: "flex", justifyContent: "space-between", 
                      alignItems: "flex-start", marginBottom: "8px" 
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: "15px", fontWeight: "600", 
                          color: BROWN_DARK, marginBottom: "4px" 
                        }}>
                          {order.Retailer_Name || order.Customer_Name || "Unknown Customer"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Order #{order.So_Inv_No || order.So_No}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: "12px" }}>
                        <div style={{ 
                          fontSize: "15px", fontWeight: "bold", color: BROWN_DARK 
                        }}>
                          ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#666" }}>
                          {totalItems} items • {totalBillQty.toFixed(2)} kg
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: "flex", justifyContent: "space-between", 
                      alignItems: "center", fontSize: "11px", color: "#999" 
                    }}>
                      <span>{formatDate(order.So_Date)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: "10px",
                          background: order.OrderStatus === "pending" ? "#fff3cd" : "#d4edda",
                          color: order.OrderStatus === "pending" ? "#856404" : "#155724",
                          fontSize: "10px", fontWeight: "600"
                        }}>
                          {order.OrderStatus || order.VoucherTypeGet || "N/A"}
                        </span>
                        <span style={{ 
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                          fontSize: "16px"
                        }}>
                          ▼
                        </span>
                      </div>
                    </div>
                    
                    {order.Narration && (
                      <div style={{ 
                        fontSize: "11px", color: "#888", fontStyle: "italic", 
                        padding: "8px", background: "#f9f4ef", borderRadius: "8px", 
                        marginTop: "8px" 
                      }}>
                        {order.Narration}
                      </div>
                    )}
                    
                    <div style={{ 
                      display: "flex", gap: "8px", justifyContent: "flex-end", 
                      marginTop: "8px" 
                    }}>
                      <button 
                        onClick={(e) => handleEditOrder(e, order)}
                        style={{ 
                          padding: "6px 12px", background: ACCENT, 
                          color: BROWN_DARK, border: "none", 
                          borderRadius: "15px", fontSize: "11px", cursor: "pointer" 
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Product List */}
                  {isExpanded && <ProductListExpand products={order.Products_List} />}
                </div>
              );
            })}
          </div>
        ) : (
          // ── Desktop Table View with Expandable Rows ──
          <table style={{ 
            width: "100%", borderCollapse: "separate", 
            borderSpacing: "0 0", maxWidth: "1200px", 
            margin: "0 auto" 
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f9f4ef" }}>
                <th style={tableHeaderStyle}></th>
                {["Order #", "Date", "Customer", "Items", "Kgs", "Amount",
                //  "Actions"
                ].map((h, i) => (
                  <th key={h} style={{
                    ...tableHeaderStyle, 
                    textAlign: i >= 3 && i <= 5 ? "right" : i === 6 ? "center" : "left"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const totalBillQty = getTotalBillQty(order.Products_List);
                const totalItems = getTotalItems(order.Products_List);
                const orderKey = order.So_Id || order.So_No || index;
                const isExpanded = expandedOrders[orderKey] || false;
                
                return (
                  <React.Fragment key={orderKey}>
                    {/* Main Order Row */}
                    <tr
                      onClick={() => toggleOrderExpansion(orderKey)}
                      style={{ 
                        backgroundColor: "#fff", 
                        cursor: "pointer", 
                        transition: "all 0.2s",
                        borderBottom: "1px solid #e8ddd4"
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.backgroundColor = "#fdf8f3"; 
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.backgroundColor = "#fff"; 
                      }}
                    >
                      <td style={{ 
                        padding: "14px 8px 14px 16px", 
                        textAlign: "center",
                        color: BROWN_LIGHT,
                        fontSize: "14px",
                        transition: "transform 0.3s ease"
                      }}>
                        <span style={{ 
                          display: "inline-block",
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease"
                        }}>
                          ►
                        </span>
                      </td>
                      <td style={{ 
                        padding: "14px 16px", color: BROWN_DARK, 
                        fontWeight: "500", fontSize: "13px" 
                      }}>
                        {order.So_Inv_No || order.So_No || "N/A"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>
                        {order.So_Date ? order.So_Date.split('T')[0] : "N/A"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>
                          {order.Retailer_Name || order.Customer_Name || "Unknown"}
                        </div>
                        {order.Narration && !isExpanded && (
                          <div style={{ 
                            fontSize: "11px", color: "#999", marginTop: "2px", 
                            fontStyle: "italic" 
                          }}>
                            {order.Narration.substring(0, 50)}
                            {order.Narration.length > 50 ? "..." : ""}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                        {totalItems}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                        {totalBillQty.toFixed(2)} kg
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: BROWN_DARK, fontWeight: "600", fontSize: "14px" }}>
                        ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
                      </td>
                      {/* <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <button
                          onClick={(e) => handleEditOrder(e, order)}
                          title="Edit Order"
                          style={{ 
                            background: "transparent", 
                            border: `1px solid ${ACCENT}`, 
                            borderRadius: "6px", padding: "6px 10px", 
                            cursor: "pointer", color: BROWN, fontSize: "14px", 
                            transition: "all 0.2s" 
                          }}
                          onMouseEnter={(e) => { 
                            e.currentTarget.style.backgroundColor = ACCENT; 
                            e.currentTarget.style.color = "#fff"; 
                          }}
                          onMouseLeave={(e) => { 
                            e.currentTarget.style.backgroundColor = "transparent"; 
                            e.currentTarget.style.color = BROWN; 
                          }}
                        >✏️</button>
                      </td> */}
                    </tr>
                    
                    {/* Expanded Product List Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} style={{ padding: "0" }}>
                          <ProductListExpand products={order.Products_List} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  padding: "12px 16px",
  color: BROWN,
  fontSize: "13px",
  fontWeight: "600",
  borderBottom: "2px solid #e8ddd4"
};


export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cart & product state
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Auth state
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userType, setUserType] = useState("");

  // Customer selector state
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [headerSelectedCustomer, setHeaderSelectedCustomer] = useState(null);

  // Order form state
  const [contactNumber, setContactNumber] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [customer, setCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [prefilledCustomer, setPrefilledCustomer] = useState(null);

  // Broker / transporter dropdown state
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [availableTransporters, setAvailableTransporters] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
  const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [loadingTransporters, setLoadingTransporters] = useState(false);

  // ── Sale Orders view toggle ──
  const [showSaleOrders, setShowSaleOrders] = useState(false);

  // ─────────────────────────────────────────────
  // POPULATE FROM NAVIGATION STATE
  // ─────────────────────────────────────────────
  useEffect(() => {
    const passed = location.state?.selectedCustomer;
    if (!passed) return;

    setPrefilledCustomer(passed);
    setHeaderSelectedCustomer({
      id: passed.id, name: passed.name, mobile: passed.mobile || "",
      city: passed.city || "", address: passed.address || "",
      brokerId: passed.brokerId || "", brokerName: passed.brokerName || "",
      transporterId: passed.transporterId || "", transporterName: passed.transporterName || "",
    });
    setCustomer(String(passed.id || ""));
    setContactNumber(passed.mobile || "");
    if (passed.address) { setShippingAddress(passed.address); setDeliveryAddress(passed.address); }
    if (passed.brokerId && passed.brokerName) {
      setSelectedBroker({ id: passed.brokerId, name: passed.brokerName });
      setBrokerName(passed.brokerName);
    }
    if (passed.transporterId && passed.transporterName) {
      setSelectedTransporter({ id: passed.transporterId, name: passed.transporterName });
      setTransporter(passed.transporterName);
    }
    setSelectedDetails({
      customerId: String(passed.id || ""), customerName: passed.name || "",
      mobileNo: passed.mobile || "", address: passed.address || "",
      city: passed.city || "", broker: passed.brokerName || "",
      Broker_Id: passed.brokerId || "", transporter: passed.transporterName || "",
      Transporter_Id: passed.transporterId || "",
    });
  }, [location.state]);

  // ─────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────
  const checkLoginStatus = () => {
    try {
      const user = localStorage.getItem("user");
      const session = localStorage.getItem("session");
      const loginAt = localStorage.getItem("loginAt");
      const storedUserType = localStorage.getItem("userType") || "employee";

      if (user && session && loginAt) {
        setIsLoggedIn(true);
        setUserType(storedUserType);
        const userData = JSON.parse(user);
        setUserName(userData?.name || userData?.Name || "");

        const sessionData = JSON.parse(session);
        if (sessionData?.customer && Array.isArray(sessionData.customer)) {
          const customerList = sessionData.customer.map(c => ({
            id: c.Ret_Id, name: c.Ledger_Name || c.Party_Mailing_Name || c.A1,
            billName: c.Party_Name || c.Ledger_Name, mobile: c.A1 || "",
            city: c.Party_Location || "", address: c.Party_Mailing_Address || "",
            brokerId: c.Broker_Id || c.Ref_Brokers || "", brokerName: c.Broker_Name || "",
            transporterId: c.Transporter_Id || "", transporterName: c.Transporter_Name || "",
          }));
          if (customerList.length > 0) setCustomers(customerList);
        }
      } else {
        setIsLoggedIn(false); setUserName(""); setUserType("");
      }
    } catch (error) {
      setIsLoggedIn(false); setUserName(""); setUserType("");
    }
  };

  useEffect(() => { checkLoginStatus(); }, []);

  useEffect(() => {
    if (isLoggedIn && userType === "employee") fetchCustomers();
  }, [isLoggedIn, userType]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData?.Name || userData?.name || "");
      }
    } catch (error) { console.error(error); }
    checkLoginStatus();
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); localStorage.removeItem("session");
    localStorage.removeItem("loginAt"); localStorage.removeItem("userType");
    localStorage.removeItem("selectedCustomerId"); localStorage.removeItem("selectedCustomer");
    setIsLoggedIn(false); setUserName(""); setUserType("");
    setCustomers([]); setHeaderSelectedCustomer(null);
    toast.success("Logged out successfully");
  };

  // ─────────────────────────────────────────────
  // FETCH CUSTOMERS
  // ─────────────────────────────────────────────
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
      if (response?.success && Array.isArray(response.data)) {
        const sanitized = response.data.map((c) => ({
          id: c.Customer_Id || c.Ret_Id,
          name: (c.Short_Name || c.Billl_Name || "").replace(/\u0004/g, "").trim(),
          billName: (c.Billl_Name || "").trim(), mobile: (c.Mobile_No || "").trim(),
          city: (c.City || "").trim(), address: (c.Address || "").trim(),
          brokerId: c.Broker_Id || "", brokerName: (c.Broker_Name || c.Broker || "").trim(),
          transporterId: c.Transporter_Id || "", transporterName: (c.Transporter_Name || c.Transporter || "").trim(),
        }));
        setCustomers(sanitized);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // ─────────────────────────────────────────────
  // HEADER CUSTOMER SELECTOR HANDLER
  // ─────────────────────────────────────────────
  const handleHeaderCustomerSelect = async (customer) => {
    let updatedCustomer = { ...customer };
    try {
      const response = await fetchLink({ address: `pos/retailerMasterOpt?limit=10000000&page=1` });
      if (response?.success && Array.isArray(response.data)) {
        const found = response.data.find(c => String(c.Customer_Id) === String(customer.id));
        if (found) {
          updatedCustomer = {
            ...customer,
            brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : customer.brokerId || "",
            brokerName: (found.Broker_Name || found.Broker || customer.brokerName || "").trim(),
            transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : customer.transporterId || "",
            transporterName: (found.Transporter_Name || found.Transporter || customer.transporterName || "").trim(),
          };
        }
      }
    } catch (e) {
      console.error("Error fetching complete customer details:", e);
    }

    setHeaderSelectedCustomer(updatedCustomer);
    setCustomer(String(updatedCustomer.id || ""));
    setContactNumber(updatedCustomer.mobile || "");
    if (updatedCustomer.address) { setShippingAddress(updatedCustomer.address); setDeliveryAddress(updatedCustomer.address); }
    if (updatedCustomer.brokerId && updatedCustomer.brokerName) {
      setSelectedBroker({ id: updatedCustomer.brokerId, name: updatedCustomer.brokerName });
      setBrokerName(updatedCustomer.brokerName);
    } else {
      setSelectedBroker({ id: null, name: "" }); setBrokerName("");
    }
    if (updatedCustomer.transporterId && updatedCustomer.transporterName) {
      setSelectedTransporter({ id: updatedCustomer.transporterId, name: updatedCustomer.transporterName });
      setTransporter(updatedCustomer.transporterName);
    } else {
      setSelectedTransporter({ id: null, name: "" }); setTransporter("");
    }
    setPrefilledCustomer({ id: updatedCustomer.id, name: updatedCustomer.name });
    setSelectedDetails({
      customerId: String(updatedCustomer.id), customerName: updatedCustomer.name,
      mobileNo: updatedCustomer.mobile || "", address: updatedCustomer.address || "",
      city: updatedCustomer.city || "", broker: updatedCustomer.brokerName || "",
      Broker_Id: updatedCustomer.brokerId || "", transporter: updatedCustomer.transporterName || "",
      Transporter_Id: updatedCustomer.transporterId || "",
    });
    localStorage.setItem("selectedCustomerId", updatedCustomer.id);
    localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
  };

  // ─────────────────────────────────────────────
  // DATA FETCHING
  // ─────────────────────────────────────────────
  const fetchBrokers = async () => {
    if (availableBrokers.length > 0) return;
    setLoadingBrokers(true);
    try {
      const response = await fetchLink({ address: `pos/brokers` });
      if (response?.success) {
        const data = response.data?.Brokers || response.data || [];
        if (Array.isArray(data)) {
          setAvailableBrokers(data.map(b => ({ id: b.Broker_Id, name: b.Broker_Name?.trim() || '', code: b.Broker_Code?.trim() || '', mobile: b.Mobile_No?.trim() || '' })));
        }
      }
    } catch (error) {
      toast.error("Failed to load brokers");
    } finally {
      setLoadingBrokers(false);
    }
  };

  const fetchTransporters = async () => {
    if (availableTransporters.length > 0) return;
    setLoadingTransporters(true);
    try {
      const response = await fetchLink({ address: `pos/transporters` });
      if (response?.success) {
        const data = response.data?.Transporters || response.data || [];
        if (Array.isArray(data)) {
          setAvailableTransporters(data.map(t => ({ id: t.Transporter_Id, name: t.Transporter_Name?.trim() || '', code: t.Transporter_Code?.trim() || '', mobile: t.Mobile_No?.trim() || '' })));
        }
      }
    } catch (error) {
      toast.error("Failed to load transporters");
    } finally {
      setLoadingTransporters(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const response = await fetchLink({ address: 'products?limit=1000' });
      if (response?.success && Array.isArray(response.data)) setAllProducts(response.data);
    } catch (error) {
      console.error("Error loading all products:", error);
    }
  };

  const loadCartData = () => {
    setLoading(true);
    try {
      const savedCart = localStorage.getItem('cartItems');
      const savedProducts = localStorage.getItem('products');
      if (savedCart) setCartItems(JSON.parse(savedCart));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
    loadAllProducts();
    fetchBrokers();
    fetchTransporters();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') loadCartData();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ─────────────────────────────────────────────
  // CART HELPERS
  // ─────────────────────────────────────────────
  const getProductPackGet = (productId) => {
    const p = allProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
    return p?.packGet || 1;
  };

  const enhancedCartItems = useMemo(() => {
    return Object.entries(cartItems)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, qty]) => {
        const product = products.find(p => p.id === productId) || {};
        const packGet = getProductPackGet(productId);
        const kgs = qty * packGet;
        const amount = (product.price || 0) * qty * packGet;
        return { ...product, id: productId, quantity: qty, packGet, kgs, amount, price: product.price || 0, total: amount };
      });
  }, [cartItems, products, allProducts]);

  const totalItems = enhancedCartItems.reduce((s, i) => s + i.quantity, 0);
  const totalKgs = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);
  const subtotalAmount = enhancedCartItems.reduce((s, i) => s + i.amount, 0);
  const totalAmountWithTax = subtotalAmount;

  const updateQty = (id, delta) => {
    setCartItems(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      let newCart;
      if (next === 0) { const { [id]: _, ...rest } = prev; newCart = rest; }
      else newCart = { ...prev, [id]: next };
      localStorage.setItem('cartItems', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItem = (id) => {
    const product = products.find(p => p.id === id);
    setCartItems(prev => {
      const { [id]: _, ...rest } = prev;
      localStorage.setItem('cartItems', JSON.stringify(rest));
      return rest;
    });
    if (product) toast.info(`Removed ${product.name} from cart`);
  };

  // ─────────────────────────────────────────────
  // CUSTOMER SELECT HANDLER (form field)
  // ─────────────────────────────────────────────
  const handleCustomerSelect = (customerData) => {
    setCustomer(String(customerData.customerId || ""));
    setContactNumber(customerData.mobileNo || "");
    setSelectedDetails(customerData);
    if (customerData.address) { setShippingAddress(customerData.address); setDeliveryAddress(customerData.address); }
    if (customerData.Broker_Id && customerData.broker) {
      setSelectedBroker({ id: customerData.Broker_Id, name: customerData.broker });
      setBrokerName(customerData.broker);
    } else {
      setSelectedBroker({ id: null, name: "" }); setBrokerName("");
    }
    if (customerData.Transporter_Id && customerData.transporter) {
      setSelectedTransporter({ id: customerData.Transporter_Id, name: customerData.transporter });
      setTransporter(customerData.transporter);
    } else {
      setSelectedTransporter({ id: null, name: "" }); setTransporter("");
    }
    setHeaderSelectedCustomer({
      id: customerData.customerId, name: customerData.customerName,
      mobile: customerData.mobileNo || "", city: customerData.city || "",
      address: customerData.address || "", brokerId: customerData.Broker_Id || "",
      brokerName: customerData.broker || "", transporterId: customerData.Transporter_Id || "",
      transporterName: customerData.transporter || "",
    });
  };

  // ─────────────────────────────────────────────
  // CHECKOUT
  // ─────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!isLoggedIn) { toast.error("Please sign in to place an order"); setIsLoginPopupOpen(true); return; }
    if (!contactNumber) { toast.error("Please enter contact number"); return; }
    if (!customer) { toast.error("Please select a customer"); return; }

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    const formattedDateOnly = now.toISOString().split('T')[0];
    const parseData = JSON.parse(localStorage.getItem('user') || '{}');
    const storage = JSON.parse(localStorage.getItem('user') || '{}');

    const totalBeforeTax = enhancedCartItems.reduce((s, i) => s + i.amount, 0);
    const totalTax = enhancedCartItems.reduce((s, i) => {
      const taxRate = i.taxRate || 12;
      return s + (i.amount * (taxRate / 100));
    }, 0);
    const totalInvoiceValue = totalBeforeTax + totalTax;
    const totalKgsValue = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);

    const Staff_Involved_List = [];
    if (selectedBroker?.id) Staff_Involved_List.push({ Involved_Emp_Id: parseInt(selectedBroker.id), Cost_Center_Type_Id: 3 });
    if (selectedTransporter?.id) Staff_Involved_List.push({ Involved_Emp_Id: parseInt(selectedTransporter.id), Cost_Center_Type_Id: 4 });

    const generalInfo = {
      So_Date: formattedDateOnly, Retailer_Id: parseInt(customer),
      Sales_Person_Id: storage?.user?.SalesPersonId || 0,
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId,
      VoucherType: 200, GST_Inclusive: 2, IS_IGST: 0,
      CSGT_Total: (totalTax / 2).toFixed(2), SGST_Total: (totalTax / 2).toFixed(2),
      IGST_Total: "0.00", Round_off: "0.00",
      Total_Before_Tax: totalBeforeTax.toFixed(2), Total_Tax: totalTax.toFixed(2),
      Total_Invoice_value: totalInvoiceValue.toFixed(2),
      Narration: description || "", isConverted: 0, Cancel_status: 1,
      Created_by: parseData?.UserId || storage?.user?.UserId,
      Created_on: formattedDate, Trans_Type: "INSERT", Alter_Id: 0,
      Customer_Name: selectedDetails?.customerName || "",
      Ord_Mobile_No: contactNumber,
      Broker_Name: selectedBroker.name || "", Broker_Id: selectedBroker.id || null,
      Transporter_Name: selectedTransporter.name || "", Transporter_Id: selectedTransporter.id || null,
      Shipp_Address: shippingAddress || selectedDetails?.address || "",
      Deliv_Address: deliveryAddress || shippingAddress || selectedDetails?.address || "",
      Total_Kgs: totalKgsValue.toFixed(2), Total_Items: enhancedCartItems.length,
      Staff_Involved_List,
    };

    const stockInfo = enhancedCartItems.map((item, index) => {
      const taxRate = item.taxRate || 12;
      const cgstSgstRate = taxRate / 2;
      const taxableAmount = item.amount;
      const taxAmount = taxableAmount * (taxRate / 100);
      const cgstSgstAmount = taxAmount / 2;
      const finalAmount = taxableAmount + taxAmount;
      return {
        So_Date: formattedDateOnly, S_No: index + 1, Item_Id: parseInt(item.id),
        Bill_Qty: item.kgs.toFixed(2), Taxable_Rate: item.price.toFixed(2),
        Item_Rate: item.price.toFixed(2), Amount: taxableAmount.toFixed(2), Free_Qty: "0.00",
        Total_Qty: item.quantity.toString(), Taxble: taxAmount.toFixed(2),
        HSN_Code: item.hsn || "210690", Unit_Id: item.unitId, Unit_Name: item.unitName,
        Taxable_Amount: taxableAmount.toFixed(2), Tax_Rate: taxRate, Cgst: cgstSgstRate,
        Cgst_Amo: cgstSgstAmount.toFixed(2), Sgst: cgstSgstRate,
        Sgst_Amo: cgstSgstAmount.toFixed(2), Igst: 0, Igst_Amo: "0.00",
        Final_Amo: finalAmount.toFixed(2), Created_on: formattedDate,
        Product_Id: parseInt(item.id), Product_Name: item.name,
        Quantity: item.quantity, Price: item.price,
        Total: taxableAmount.toFixed(2), Weight: item.kgs.toString(),
        Unit: item.unit, PackGet: item.packGet,
      };
    });

    const saleData = {
      generalInfo, stockInfo,
      totalAmount: totalInvoiceValue, totalItems: enhancedCartItems.length,
      totalKgs: totalKgsValue.toFixed(2), customerId: customer,
      customerName: selectedDetails?.customerName || "",
      contactNumber, brokerName: selectedBroker.name,
      transporter: selectedTransporter.name,
      shippingAddress, deliveryAddress, description,
      Created_by: parseData?.UserId || parseData?.user_id || "",
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 2,
    };

    try {
      const loadingToast = toast.loading("Placing order...");
      const response = await fetchLink({ address: `sales/salesInvoice/Whatsapp`, method: 'POST', bodyData: saleData });
      toast.dismiss(loadingToast);

      if (response?.success) {
        toast.success(`Order placed successfully!`);
        setCartItems({});
        localStorage.removeItem('cartItems');
        localStorage.removeItem('selectedCustomer');
        const orderId = response.data?.Sales_Order_Id || response.data?.So_Id || response.data?.Pre_Ord_Id;
        navigate('/', { state: { orderId, customerName: saleData.customerName, orderData: response.data, success: true, message: "Order created successfully" } });
      } else {
        toast.error(response?.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Failed to place order: " + (error.message || "Unknown error"));
    } finally {
      setContactNumber(""); setCustomer(""); setSelectedDetails(null);
      setBrokerName(""); setTransporter("");
      setShippingAddress(""); setDeliveryAddress(""); setDescription("");
    }
  };

  // ─────────────────────────────────────────────
  // SALE ORDERS HANDLERS
  // ─────────────────────────────────────────────
  const handleSaleOrdersClick = () => setShowSaleOrders(true);
  const handleBackFromSaleOrders = () => setShowSaleOrders(false);

  // ─────────────────────────────────────────────
  // THREE DOTS MENU
  // ─────────────────────────────────────────────
  const renderThreeDotsMenu = () => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          background: "transparent", border: "none", color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: isMobile ? "8px" : "12px", borderRadius: "50%",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <MoreVertIcon style={{ fontSize: isMobile ? "24px" : "32px" }} />
      </button>
      <UserMenuDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userType={userType}
        onLoginClick={() => setIsLoginPopupOpen(true)}
        onLogout={handleLogout}
        onSaleOrders={handleSaleOrdersClick}
      />
    </div>
  );

  // ─────────────────────────────────────────────
  // SHARED COMMON HEADER PROPS
  // ─────────────────────────────────────────────
  const commonHeaderCustomerProps = {
    showCustomerSelector: isLoggedIn && customers.length > 0,
    customers, selectedCustomer: headerSelectedCustomer,
    onCustomerSelect: handleHeaderCustomerSelect,
    loadingCustomers, userType,
  };

  // ─────────────────────────────────────────────
  // CART ITEM ROW
  // ─────────────────────────────────────────────
  const CartItemRow = ({ item }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: isMobile ? "10px 0" : "12px 0", borderBottom: "1px dashed #ddd",
    }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1 }}>
        <img
          src={item.image} alt={item.name}
          style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop"; }}
        />
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: BROWN, margin: "0 0 2px 0" }}>
            {item.name?.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
          </h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: "#f0e9e2", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", color: BROWN }}>₹{item.price}/kg</span>
            <span style={{ fontSize: "11px", color: "#666" }}>Pack: {item.packGet || 1}kg</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f5f0eb", padding: "2px 6px", borderRadius: "25px" }}>
          <button onClick={() => updateQty(item.id, -1)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "#fff", color: BROWN, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>-</button>
          <span style={{ fontSize: "14px", fontWeight: "600", color: BROWN, minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
          <button onClick={() => updateQty(item.id, 1)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "#fff", color: BROWN, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>+</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: BROWN, minWidth: "60px", display: "block" }}>₹{item.amount.toFixed(2)}</span>
            <span style={{ fontSize: "10px", color: "#999", display: "block" }}>({item.quantity} × {item.packGet || 1}kg)</span>
          </div>
          <div
            onClick={() => removeItem(item.id)}
            style={{ color: "#999", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee"; e.currentTarget.style.color = "#ff4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#999"; }}
          >
            <DeleteOutlineIcon style={{ fontSize: "18px" }} />
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // ORDER FORM
  // ─────────────────────────────────────────────
  const labelStyle = { display: "block", fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#333", marginBottom: "6px" };
  const inputStyle = { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: isMobile ? "10px" : "12px", fontSize: "14px", outline: "none", background: "#fff", boxSizing: "border-box" };
  const textareaStyle = { ...inputStyle, minHeight: isMobile ? "70px" : "100px", resize: "vertical", fontFamily: "inherit" };
  const fgStyle = { marginBottom: isMobile ? "16px" : "20px" };

  const OrderForm = () => (
    <>
      <div style={fgStyle}>
        <label style={labelStyle}>Customer</label>
        <SearchableCustomerSelect value={customer} onChange={setCustomer} onCustomerSelect={handleCustomerSelect} prefilledCustomer={prefilledCustomer} />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Broker</label>
        <BrokerDropdown selectedBroker={selectedBroker} onSelectBroker={(b) => { setSelectedBroker(b); setBrokerName(b.name); }} availableBrokers={availableBrokers} loading={loadingBrokers} onOpen={fetchBrokers} />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Transporter</label>
        <TransporterDropdown selectedTransporter={selectedTransporter} onSelectTransporter={(t) => { setSelectedTransporter(t); setTransporter(t.name); }} availableTransporters={availableTransporters} loading={loadingTransporters} onOpen={fetchTransporters} />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Contact Number</label>
        <input type="tel" placeholder="Contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={inputStyle} />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Shipping Address</label>
        <textarea placeholder="Shipping address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={textareaStyle} />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Delivery Address</label>
        <textarea placeholder="Delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={textareaStyle} />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Description</label>
        <textarea placeholder="Notes or description" value={description} onChange={(e) => setDescription(e.target.value)} style={textareaStyle} />
      </div>
    </>
  );

  // ─────────────────────────────────────────────
  // ✅ SALE ORDERS VIEW — renders before everything else
  // ─────────────────────────────────────────────
  if (showSaleOrders) {
    return <SaleOrders onBack={handleBackFromSaleOrders} />;
  }

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: BG_COLOR }}>
        <div style={{ color: BROWN, fontSize: "18px" }}>Loading cart...</div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // MOBILE STEP 2
  // ─────────────────────────────────────────────
  if (isMobile && step === 2) {
    return (
      <>
        <CommonHeader
          title="Order Details" logo="SMT"
          showSearch={false} showCart={false}
          showBackButton={true} showTitle={true}
          cartItemCount={0} onBackClick={() => setStep(1)}
          isMobile={isMobile} backgroundColor={BROWN_DARK}
          isLoggedIn={isLoggedIn} userName={userName}
          onSaleOrders={handleSaleOrdersClick}
          {...commonHeaderCustomerProps}
          customActions={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderThreeDotsMenu()}
            </div>
          }
        />

        <div style={{ padding: "20px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "200px" }}>
          <OrderForm />
          <div style={{ background: "#f9f4ef", padding: "12px", borderRadius: "10px", fontSize: "13px", color: BROWN, marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px dashed #ccc" }}>
              <span style={{ fontWeight: "bold" }}>Product List</span>
              <span style={{ color: BROWN, cursor: "pointer" }} onClick={() => { setCartItems({}); localStorage.removeItem('cartItems'); setStep(1); }}>Clear ▼</span>
            </div>
            {enhancedCartItems.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
                <span>• {item.name} x {item.quantity} ({item.kgs.toFixed(2)} kg)</span>
                <span>₹{item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "16px", borderTop: `2px solid ${ACCENT}`, zIndex: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}><span>Total Items:</span><span>{totalItems}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}><span>Total Kgs:</span><span>{totalKgs.toFixed(2)} kg</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}><span>Subtotal:</span><span>₹{subtotalAmount.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "8px" }}>
              <span>Total Amount:</span><span>₹{totalAmountWithTax.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} style={{ width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            Order Now
          </button>
        </div>

        <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // MOBILE STEP 1
  // ─────────────────────────────────────────────
  if (isMobile && step === 1) {
    return (
      <>
        <CommonHeader
          title="SM Traders" logo="SMT"
          showSearch={false} showCart={false}
          showBackButton={true} showTitle={true}
          cartItemCount={0} onBackClick={() => navigate('/')}
          isMobile={isMobile} backgroundColor={BROWN_DARK}
          isLoggedIn={isLoggedIn} userName={userName}
          {...commonHeaderCustomerProps}
          customActions={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderThreeDotsMenu()}
            </div>
          }
        />

        <div style={{ padding: "12px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "130px" }}>
          {enhancedCartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px", marginTop: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
              <p style={{ color: "#666", fontSize: "16px", marginBottom: "16px" }}>Your cart is empty</p>
              <button onClick={() => navigate('/')} style={{ background: BROWN, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Browse Products</button>
            </div>
          ) : (
            enhancedCartItems.map(item => <CartItemRow key={item.id} item={item} />)
          )}
        </div>

        {enhancedCartItems.length > 0 && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", boxShadow: "0 -4px 12px rgba(0,0,0,0.1)", padding: "12px 16px", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", borderTop: `2px solid ${BROWN_DARK}`, zIndex: 1000 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
              <div>
                <div>{totalItems} Items</div>
                <div style={{ fontSize: "12px", color: "#666" }}>Total: {totalKgs.toFixed(2)} kg</div>
              </div>
              <div style={{ textAlign: "right", fontWeight: "bold", color: BROWN }}>₹{subtotalAmount.toFixed(2)}</div>
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              Proceed <span>→</span>
            </button>
          </div>
        )}

        <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // DESKTOP VIEW
  // ─────────────────────────────────────────────
  return (
    <>
      <CommonHeader
        title="SM Traders" logo="SMT"
        showSearch={false} showCart={false}
        showBackButton={true} showTitle={true}
        cartItemCount={0} onBackClick={() => navigate('/')}
        isMobile={isMobile} backgroundColor={BROWN_DARK}
        userName={userName} isLoggedIn={isLoggedIn}
        {...commonHeaderCustomerProps}
        customActions={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {renderThreeDotsMenu()}
          </div>
        }
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px 40px", background: BG_COLOR, minHeight: "100vh" }}>
        {enhancedCartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 40px", background: "#fff", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>Your selection list is empty</p>
            <button onClick={() => navigate('/')} style={{ background: BROWN, color: "#fff", border: "none", padding: "12px 30px", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "32px" }}>
            {/* LEFT: Cart items + summary */}
            <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "24px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: BROWN, margin: "0 0 20px 0", paddingBottom: "14px", borderBottom: `3px solid ${ACCENT}` }}>
                Order Summary
              </h2>
              {enhancedCartItems.map(item => <CartItemRow key={item.id} item={item} />)}

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "2px dashed #ccc" }}>
                {[["Total Items:", totalItems], ["Total Kgs:", `${totalKgs.toFixed(2)} kg`], ["Subtotal:", `₹${subtotalAmount.toFixed(2)}`]].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#666", marginBottom: "8px" }}>
                    <span>{label}</span><span style={{ fontWeight: "600", color: BROWN }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "12px", marginTop: "4px" }}>
                  <span>Total Amount:</span><span>₹{totalAmountWithTax.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                style={{ width: "100%", padding: "18px", background: BROWN, color: "#fff", border: "none", borderRadius: "50px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginTop: "24px", boxShadow: "0 4px 12px rgba(74,44,26,0.2)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
                onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
              >
                Order Now
              </button>
            </div>

            {/* RIGHT: Order form */}
            <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "32px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: BROWN, margin: "0 0 24px 0", paddingBottom: "14px", borderBottom: `3px solid ${ACCENT}` }}>
                Order Details
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Customer</label>
                    <SearchableCustomerSelect value={customer} onChange={setCustomer} onCustomerSelect={handleCustomerSelect} prefilledCustomer={prefilledCustomer} />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Broker</label>
                    <BrokerDropdown selectedBroker={selectedBroker} onSelectBroker={(b) => { setSelectedBroker(b); setBrokerName(b.name); }} availableBrokers={availableBrokers} loading={loadingBrokers} onOpen={fetchBrokers} />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Shipping Address</label>
                    <textarea placeholder="Shipping address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={textareaStyle} />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Description</label>
                    <textarea placeholder="Notes" value={description} onChange={(e) => setDescription(e.target.value)} style={textareaStyle} />
                  </div>
                </div>
                <div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Transporter</label>
                    <TransporterDropdown selectedTransporter={selectedTransporter} onSelectTransporter={(t) => { setSelectedTransporter(t); setTransporter(t.name); }} availableTransporters={availableTransporters} loading={loadingTransporters} onOpen={fetchTransporters} />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Contact Number</label>
                    <input type="tel" placeholder="Contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Delivery Address</label>
                    <textarea placeholder="Delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={textareaStyle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}