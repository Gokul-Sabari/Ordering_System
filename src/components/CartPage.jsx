import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
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
import { useReactToPrint } from 'react-to-print';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { getSessionUser,ISOStrings } from "../components/functions";
import { CenterFocusStrongOutlined } from "@mui/icons-material";
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";


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

function CustomerSelector({ isLoggedIn, userType, customers, selectedCustomer, onSelectCustomer, loading, isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [allFilteredResults, setAllFilteredResults] = useState([]);
  const listContainerRef = useRef(null);
  const dropdownRef = useRef(null);
 
  const INITIAL_LOAD = 10;
  const LOAD_MORE_COUNT = 10;
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
        setDisplayedCustomers([]);
        setHasSearched(false);
        setDisplayCount(INITIAL_LOAD);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  // Initialize with first INITIAL_LOAD customers when dropdown opens
  useEffect(() => {
    if (isOpen && !hasSearched && customers.length > 0) {
      setDisplayCount(INITIAL_LOAD);
      setAllFilteredResults(customers);
    }
  }, [isOpen, customers, hasSearched]);
 
  // Update displayed customers based on displayCount
  useEffect(() => {
    if (hasSearched && allFilteredResults.length > 0) {
      setDisplayedCustomers(allFilteredResults.slice(0, displayCount));
    } else if (!hasSearched && customers.length > 0) {
      setDisplayedCustomers(customers.slice(0, displayCount));
    }
  }, [displayCount, hasSearched, allFilteredResults, customers]);
 
  // Scroll handler for infinite load on scroll
  const handleListScroll = (e) => {
    const container = e.currentTarget;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    const totalResults = hasSearched ? allFilteredResults.length : customers.length;
    if (isNearBottom && displayedCustomers.length < totalResults) {
      setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, totalResults));
    }
  };
 
  if (!isLoggedIn || customers.length === 0) return null;
 
  const performSearch = () => {
    if (!search.trim()) {
      setAllFilteredResults(customers);
      setHasSearched(false);
      setDisplayCount(INITIAL_LOAD);
      return;
    }
    const s = search.toLowerCase();
    const results = customers.filter(c =>
      (c.name && c.name.toLowerCase().includes(s)) ||
      (c.billName && c.billName.toLowerCase().includes(s)) ||
      (c.mobile && c.mobile.includes(search)) ||
      (c.city && c.city.toLowerCase().includes(s))
    );
    setAllFilteredResults(results);
    setHasSearched(true);
    setDisplayCount(INITIAL_LOAD);
  };
 
  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
    setDisplayedCustomers([]);
    setHasSearched(false);
    setDisplayCount(INITIAL_LOAD);
  };
 
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearch("");
            setDisplayedCustomers([]);
            setHasSearched(false);
            setDisplayCount(INITIAL_LOAD);
          }
        }}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 14px", background: "#f5ede3",
          border: `1.5px solid ${isOpen ? "#4a2c1a" : "#c8a96e"}`,
          borderRadius: "25px", cursor: "pointer", transition: "all 0.2s",
          maxWidth: isMobile ? "180px" : "320px",
        }}
      >
        <span style={{ fontSize: "16px" }}>🏪</span>
        <span style={{
          fontSize: isMobile ? "12px" : "14px", fontWeight: "500",
          color: selectedCustomer ? "#3a1f0e" : "#666",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
        }}>
          {selectedCustomer ? selectedCustomer.name : "Select outlet..."}
        </span>
        <span style={{ fontSize: "12px", color: "#6b3f23", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
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
                  border: `1px solid #c8a96e`, borderRadius: "8px",
                  fontSize: "13px", outline: "none", boxSizing: "border-box",
                  color: "#3a1f0e", backgroundColor: "#fff",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#4a2c1a"; }}
                onBlur={(e) => { e.target.style.borderColor = "#c8a96e"; }}
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); performSearch(); }}
              style={{
                background: "#4a2c1a", border: "none", borderRadius: "8px",
                padding: "8px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#3a1f0e"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#4a2c1a"}
            >
              <SearchIcon style={{ fontSize: "18px", color: "#fff" }} />
            </button>
          </div>
 
          {/* Search results count */}
          {hasSearched && search.trim() && (
            <div style={{padding:"8px 16px",fontSize:"12px",
              color:displayedCustomers.length>0?"#4caf50":"#e74c3c",
              background:"#fafafa",borderBottom:"1px solid #f0f0f0",flexShrink:0}}>
              {allFilteredResults.length} result{allFilteredResults.length!==1?"s":""} found for "{search}"
            </div>
          )}
          
          {/* Showing count when no search */}
          {!hasSearched && customers.length > INITIAL_LOAD && (
            <div style={{padding:"8px 16px",fontSize:"12px",color:"#2196F3",
              background:"#fafafa",borderBottom:"1px solid #f0f0f0",flexShrink:0}}>
              Showing {Math.min(displayCount, customers.length)} of {customers.length} customers
            </div>
          )}
 
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <CircularProgress size={20} style={{ color: "#4a2c1a" }} />
            </div>
          ) : displayedCustomers.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              {hasSearched ? "No matching outlets found" : "No outlets found"}
            </div>
          ) : (
            <>
              <div
                ref={listContainerRef}
                onScroll={handleListScroll}
                style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}
              >
                {displayedCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => { onSelectCustomer(c); handleClose(); }}
                    style={{
                      padding: "12px 14px", borderBottom: "1px solid #f5f0eb", cursor: "pointer",
                      background: selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (selectedCustomer?.id !== c.id) e.currentTarget.style.background = "#faf6f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent"; }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#3a1f0e", marginBottom: "3px" }}>{c.name}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {c.mobile && <span>📱 {c.mobile}</span>}
                      {c.city && <span> • {c.city}</span>}
                    </div>
                  </div>
                ))}
              </div>
 
              {/* Load More Button */}
              {!loading && displayedCustomers.length > 0 &&
               displayedCustomers.length < (hasSearched ? allFilteredResults.length : customers.length) && (
                <div style={{padding:"12px 16px",textAlign:"center",borderTop:"1px solid #f0f0f0",background:"#f9f9f9"}}>
                  <button onClick={() => setDisplayCount(prev => prev + LOAD_MORE_COUNT)}
                    style={{background:"transparent",border:`1px solid #6b3f23`,
                      borderRadius:"8px",padding:"8px 16px",color:"#3a1f0e",fontSize:"13px",cursor:"pointer"}}>
                    Load More ({displayedCustomers.length} / {hasSearched ? allFilteredResults.length : customers.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const UserMenuDropdown = ({ isOpen, onClose, isLoggedIn, userName, onLoginClick, onLogout, userType, onSaleOrders,onDashboard  }) => {
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
    <span style={{ fontSize: isMobile ? "18px" : "22px" }}>📊</span>
    <span>Sales Order</span>
  </button>
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


const SearchableCustomerSelect = ({ value, onChange, onCustomerSelect, prefilledCustomer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(prefilledCustomer?.name || "");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(
    prefilledCustomer ? { Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name } : null
  );
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize text - remove special characters and convert to lowercase
  const normalizeText = (text = '') => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')  // Remove all non-alphanumeric chars
      .trim();
  };

  // Check if search term matches ANY PART of the text (partial match)
  const isPartialMatch = (text, searchTerm) => {
    if (!text || !searchTerm) return false;
    
    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(searchTerm);
    
    // Check if search term is contained in the text (partial match)
    if (normalizedText.includes(normalizedSearch)) return true;
    
    // Check original text without normalization
    if (text.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Check word by word (for multi-word searches)
    const searchWords = normalizedSearch.split('');
    let matchCount = 0;
    for (let i = 0; i < searchWords.length; i++) {
      if (normalizedText.includes(searchWords[i])) {
        matchCount++;
      }
    }
    // If more than 70% of characters match, consider it a match
    if (matchCount / searchWords.length > 0.7) return true;
    
    return false;
  };

  useEffect(() => {
    if (prefilledCustomer?.id) {
      setSearchTerm(prefilledCustomer.name || "");
      setSelectedCustomer({ Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name });
    }
  }, [prefilledCustomer]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setHasSearched(false);
        setIsSearchTriggered(false);
        setFilteredCustomers([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetchLink({ 
          address: `pos/retailerMasterOptRetailerId?limit=10000000&page=1` 
        });
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
        }
      } catch (error) {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const performSearch = () => {
    const searchText = searchTerm.trim();
    
    if (!searchText) {
      setFilteredCustomers([]);
      setHasSearched(false);
      setIsSearchTriggered(false);
      setIsOpen(false);
      return;
    }
    
    const searchLower = searchText.toLowerCase();
    const searchNormalized = normalizeText(searchText);
    const searchMobile = searchText.replace(/\D/g, "");
    
  
    
    const results = customers.filter(c => {
      const name = c.Short_Name || "";
      const billName = c.Billl_Name || "";
      const city = c.City || "";
      const mobile = c.Mobile_No || "";
      const address = c.Address || "";
      
      // Normalize all fields
      const nameNorm = normalizeText(name);
      const billNameNorm = normalizeText(billName);
      const cityNorm = normalizeText(city);
      const addressNorm = normalizeText(address);
      const mobileNorm = mobile.replace(/\D/g, "");
      
      // Check for partial matches in multiple fields
      const matchesName = isPartialMatch(name, searchText);
      const matchesBillName = isPartialMatch(billName, searchText);
      const matchesCity = isPartialMatch(city, searchText);
      const matchesAddress = isPartialMatch(address, searchText);
      const matchesMobile = mobileNorm.includes(searchMobile) || 
                           (searchMobile && mobileNorm.includes(searchMobile.substring(0, 3)));
      
      // Special handling for "ASA" to match "A.S.A"
      const searchWithoutDots = searchNormalized.replace(/\./g, '');
      const nameWithoutDots = nameNorm.replace(/\./g, '');
      const matchesWithoutDots = nameWithoutDots.includes(searchWithoutDots);
      
      return matchesName || matchesBillName || matchesCity || matchesAddress || matchesMobile || matchesWithoutDots;
    });
    
 
    
    setFilteredCustomers(results);
    setHasSearched(true);
    setIsSearchTriggered(true);
    setIsOpen(true);
  };

  // Handle search icon click
  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    performSearch();
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset search results when user starts typing new query
    setIsSearchTriggered(false);
    setHasSearched(false);
    setFilteredCustomers([]);
    setIsOpen(true);
  };

const handleSelectCustomer = (c) => {
  setSelectedCustomer(c);
  setSearchTerm(c.Short_Name || "");
  setIsOpen(false);
  setHasSearched(false);
  setIsSearchTriggered(false);
  setFilteredCustomers([]);
  
  onChange(c.Customer_Id);
  if (onCustomerSelect) {
    onCustomerSelect({
      broker: c.Broker_Name || c.Broker?.trim() || "",
      transporter: c.Transporter_Name || c.Transporter?.trim() || "",
      customerId: c.Customer_Id,
      customerName: c.Short_Name || "",
      mobileNo: c.Mobile_No || "",
      // address: c.address || "",
      address: c.Address || c.Party_Mailing_Address || "", // Use Address field
      city: c.City || "",
      Broker_Id: c.Broker_Id || "",
      Transporter_Id: c.Transporter_Id || "",
      partyMailingName: c.Party_Mailing_Name || c.Billl_Name || c.Short_Name || "", 
      partyMailingAddress: c.Party_Mailing_Address || c.Address || "", // This is the correct address field
      billName: c.Billl_Name || c.Party_Mailing_Name || "",
    });
  }
};

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search customer by name, mobile, or city..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          style={{ 
            flex: 1,
            padding: "12px", 
            border: `1px solid ${isOpen ? BROWN : "#ddd"}`, 
            borderRadius: "8px", 
            fontSize: "14px", 
            outline: "none", 
            boxSizing: "border-box",
            transition: "border-color 0.2s"
          }}
          // onFocus={(e) => e.target.style.borderColor = BROWN}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />
        <button
          onClick={handleSearchClick}
          style={{
            background: BROWN,
            border: "none",
            borderRadius: "8px",
            padding: "12px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
          onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
        >
          <SearchIcon style={{ fontSize: "20px", color: "#fff" }} />
        </button>
      </div>

      {/* Show dropdown only after search is triggered */}
      {isOpen && isSearchTriggered && (
        <div style={{
          position: "absolute", 
          top: "100%", 
          left: 0, 
          right: 0,
          maxHeight: "300px", 
          overflowY: "auto", 
          background: "#fff",
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          marginTop: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", 
          zIndex: 1000,
        }}>
          {/* Result count */}
          {searchTerm.trim() && (
            <div style={{
              padding: "8px 12px",
              fontSize: "12px",
              color: filteredCustomers.length > 0 ? "#4caf50" : "#e74c3c",
              background: "#fafafa",
              borderBottom: "1px solid #f0f0f0",
            }}>
              {filteredCustomers.length} result{filteredCustomers.length !== 1 ? "s" : ""} found for "{searchTerm}"
            </div>
          )}

          {loading ? (
            <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>
              <CircularProgress size={20} style={{ color: BROWN }} />
              <div style={{ marginTop: "8px" }}>Loading customers...</div>
            </div>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map(c => (
              <div 
                key={c.Customer_Id} 
                onClick={() => handleSelectCustomer(c)}
                style={{
                  padding: "12px 16px", 
                  cursor: "pointer", 
                  borderBottom: "1px solid #eee",
                  backgroundColor: selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (selectedCustomer?.Customer_Id !== c.Customer_Id)
                    e.currentTarget.style.background = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 
                    selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent";
                }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>
                  {selectedCustomer?.Customer_Id === c.Customer_Id && "✓ "}
                  {c.Short_Name || "Unnamed Customer"}
                </div>
                {c.Billl_Name && c.Billl_Name !== c.Short_Name && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {c.Billl_Name}
                  </div>
                )}
                <div style={{ 
                  display: "flex", 
                  gap: "12px", 
                  fontSize: "11px", 
                  color: "#888", 
                  marginTop: "4px", 
                  flexWrap: "wrap" 
                }}>
                  {c.Mobile_No && (
                    <span style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "4px",
                      background: "#f0e9e2",
                      padding: "2px 8px",
                      borderRadius: "12px",
                    }}>
                      📞 {c.Mobile_No}
                    </span>
                  )}
                  {c.City && <span>📍 {c.City}</span>}
                </div>
              </div>
            ))
          ) : searchTerm.trim() && (
            <div style={{ 
              padding: "24px", 
              textAlign: "center", 
              color: "#999", 
              fontSize: "13px" 
            }}>
              <p>No matching customers found for "{searchTerm}".</p>
              <p style={{ fontSize: "11px", marginTop: "8px" }}>
                Try searching by name, mobile number, or city
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Hint when typing but not searched yet */}
      {isOpen && searchTerm.trim() && !isSearchTriggered && (
        <div style={{
          position: "absolute", 
          top: "100%", 
          left: 0, 
          right: 0,
          background: "#fff",
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          marginTop: "4px",
          padding: "10px 12px",
          fontSize: "12px",
          color: "#999",
          // background: "#fafafa",
          textAlign: "center",
          zIndex: 1000,
        }}>
          🔍 Type and click Search to find customers
        </div>
      )}
    </div>
  );
};

const normalize = (str) =>
  (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
 
const nameParts = (str) =>
  (str || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

const matchName = (name, query) => {
  if (!query.trim()) return true;
  const q     = query.toLowerCase().trim();
  const qNorm = normalize(q);
  const nNorm = normalize(name);
  const parts = nameParts(name);
 
  
  if (nNorm.includes(qNorm)) return true;

  if ((name || "").toLowerCase().includes(q)) return true;

  for (let i = 0; i < parts.length; i++) {
    if (parts.slice(i).join("").includes(qNorm)) return true;
  }
  if (parts.some(p => p.includes(qNorm))) return true;
  return false;
};

const BrokerDropdown = ({ selectedBroker, onSelectBroker, availableBrokers, loading, onOpen }) => {
  const [isOpen, setIsOpen]       = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef    = useRef(null);
 
  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);
 
const filteredBrokers = searchTerm.trim()
  ? availableBrokers.filter(b => {
      const search = searchTerm.toLowerCase().trim();
      const nameMatch = (b.name || "").toLowerCase().includes(search);
      const aliasMatch = (b.alias || "").toLowerCase().includes(search);
      return nameMatch || aliasMatch;
    })
  : availableBrokers;


  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
 
      {/* ── Trigger ── */}
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
        <span style={{ color: selectedBroker.name ? BROWN : "#999", fontSize: "14px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {selectedBroker.name || "Select Broker"}
        </span>
        <span style={{
          color: BROWN_LIGHT, fontSize: "11px", marginLeft: "8px",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
        }}>▼</span>
      </div>
 
      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
          maxHeight: "280px", overflowY: "auto", zIndex: 1000,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}>
 
          {/* Search row with SearchIcon */}
          <div style={{
            padding: "8px", borderBottom: "1px solid #f0f0f0",
            position: "sticky", top: 0, background: "#fff",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <SearchIcon style={{ fontSize: "16px", color: "#999", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search broker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1, border: `1px solid ${ACCENT}`,
                borderRadius: "6px", padding: "6px 8px",
                fontSize: "13px", outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e)  => e.target.style.borderColor = BROWN}
              onBlur={(e)   => e.target.style.borderColor = ACCENT}
            />
            {searchTerm && (
              <button
                onClick={(e) => { e.stopPropagation(); setSearchTerm(""); }}
                style={{ background: "transparent", border: "none", cursor: "pointer",
                  color: "#aaa", fontSize: "16px", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
              >×</button>
            )}
          </div>
 
          {/* Result count */}
          {searchTerm.trim() && (
            <div style={{
              padding: "4px 12px", fontSize: "11px", color: "#999",
              background: "#fafafa", borderBottom: "1px solid #f0f0f0",
            }}>
              {filteredBrokers.length} result{filteredBrokers.length !== 1 ? "s" : ""} for "{searchTerm}"
            </div>
          )}
 
          {/* None option */}
          <div
            onClick={() => { onSelectBroker({ id: null, name: "" }); setIsOpen(false); setSearchTerm(""); }}
            style={{
              padding: "10px 12px", borderBottom: "1px solid #f5f0eb",
              cursor: "pointer", fontSize: "13px", color: "#999", fontStyle: "italic",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#faf6f2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
         
          </div>
 
          {/* List */}
          {loading ? (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <CircularProgress size={16} style={{ color: BROWN }} />
            </div>
          ) : filteredBrokers.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              No brokers found{searchTerm ? ` for "${searchTerm}"` : ""}
            </div>
          ) : (
            filteredBrokers.map(broker => (
              <div
                key={broker.id}
                onClick={() => { onSelectBroker({ id: broker.id, name: broker.name }); setIsOpen(false); setSearchTerm(""); }}
                style={{
                  padding: "10px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
                  background: selectedBroker.id === broker.id ? "#f0e9e2" : "transparent",
                }}
                onMouseEnter={(e) => { if (selectedBroker.id !== broker.id) e.currentTarget.style.background = "#faf6f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedBroker.id === broker.id ? "#f0e9e2" : "transparent"; }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>{broker.name}</div>
                {(broker.code || broker.mobile) && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {broker.code && `Code: ${broker.code}`}
                    {broker.code && broker.mobile && " | "}
                    {broker.mobile}
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


const TransporterDropdown = ({ selectedTransporter, onSelectTransporter, availableTransporters, loading, onOpen }) => {
  const [isOpen, setIsOpen]       = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef    = useRef(null);
 
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
      const aliasMatch = (t.alias || "").toLowerCase().includes(search);
      return nameMatch || aliasMatch;
    })
  : availableTransporters;

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
 
      {/* ── Trigger ── */}
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
        <span style={{ color: selectedTransporter.name ? BROWN : "#999", fontSize: "14px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {selectedTransporter.name || "Select Transporter"}
        </span>
        <span style={{
          color: BROWN_LIGHT, fontSize: "11px", marginLeft: "8px",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
        }}>▼</span>
      </div>
 
      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
          maxHeight: "280px", overflowY: "auto", zIndex: 1000,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}>
 
          {/* Search row with SearchIcon */}
          <div style={{
            padding: "8px", borderBottom: "1px solid #f0f0f0",
            position: "sticky", top: 0, background: "#fff",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <SearchIcon style={{ fontSize: "16px", color: "#999", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search transporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1, border: `1px solid ${ACCENT}`,
                borderRadius: "6px", padding: "6px 8px",
                fontSize: "13px", outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e)  => e.target.style.borderColor = BROWN}
              onBlur={(e)   => e.target.style.borderColor = ACCENT}
            />
            {searchTerm && (
              <button
                onClick={(e) => { e.stopPropagation(); setSearchTerm(""); }}
                style={{ background: "transparent", border: "none", cursor: "pointer",
                  color: "#aaa", fontSize: "16px", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
              >×</button>
            )}
          </div>
 
          {/* Result count */}
          {searchTerm.trim() && (
            <div style={{
              padding: "4px 12px", fontSize: "11px", color: "#999",
              background: "#fafafa", borderBottom: "1px solid #f0f0f0",
            }}>
              {filteredTransporters.length} result{filteredTransporters.length !== 1 ? "s" : ""} for "{searchTerm}"
            </div>
          )}
 
          {/* None option */}
          <div
            onClick={() => { onSelectTransporter({ id: null, name: "" }); setIsOpen(false); setSearchTerm(""); }}
            style={{
              padding: "10px 12px", borderBottom: "1px solid #f5f0eb",
              cursor: "pointer", fontSize: "13px", color: "#999", fontStyle: "italic",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#faf6f2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
          
          </div>
 
          {/* List */}
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


function SaleOrders({ onBack, onEditOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [brokerFilter, setBrokerFilter] = useState("");
  const [transporterFilter, setTransporterFilter] = useState("");
  const navigate = useNavigate();
  
  // Print state
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState(null);

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 0); 
    return date;
  });

  const [toDate, setToDate] = useState(new Date());
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);
  const [tempBrokerFilter, setTempBrokerFilter] = useState("");
  const [tempTransporterFilter, setTempTransporterFilter] = useState("");
  
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Helper function to get broker name from Staff_Involved_List
  const getBrokerName = (order) => {
    if (!order.Staff_Involved_List || !Array.isArray(order.Staff_Involved_List)) {
      return "";
    }
    const broker = order.Staff_Involved_List.find(
      staff => staff.Cost_Center_Type_Id === 3 || staff.EmpType === "Broker"
    );
    return broker?.EmpName || "";
  };

  // Helper function to get transporter name from Staff_Involved_List
  const getTransporterName = (order) => {
    if (!order.Staff_Involved_List || !Array.isArray(order.Staff_Involved_List)) {
      return "";
    }
    const transporter = order.Staff_Involved_List.find(
      staff => staff.Cost_Center_Type_Id === 2 || staff.EmpType === "Load Man"
    );
    return transporter?.EmpName || "";
  };


    const getOrderStatus = (order) => order.OrderStatus || "";


  // Derive unique brokers and transporters from orders
  const uniqueBrokers = useMemo(() => {
    const set = new Set();
    orders.forEach(o => {
      const name = getBrokerName(o);
      if (name && name.trim()) {
        set.add(name.trim());
      }
    });
    return Array.from(set).sort();
  }, [orders]);

  const uniqueTransporters = useMemo(() => {
    const set = new Set();
    orders.forEach(o => {
      const name = getTransporterName(o);
      if (name && name.trim()) {
        set.add(name.trim());
      }
    });
    return Array.from(set).sort();
  }, [orders]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchSaleOrders();
  }, [fromDate, toDate]);

  const fetchSaleOrders = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const sessionData = JSON.parse(localStorage.getItem('session') || '{}');
      const userId = userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || '';
  
      const formattedFromDate = fromDate.toISOString().split('T')[0];
      const formattedToDate = toDate.toISOString().split('T')[0];
      const mobileno=JSON.parse(localStorage.getItem('username') || '{}');
      const response = await fetchLink({
        address: `sales/salesOrder/list?Created_by=${userId}&&Mobile_No=${mobileno}&FromDate=${formattedFromDate}&ToDate=${formattedToDate}`,
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

  const handleOpenFilterDialog = () => {
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setTempBrokerFilter(brokerFilter);
    setTempTransporterFilter(transporterFilter);
    setShowFilterDialog(true);
  };

  const handleFilterApply = () => {
    if (tempFromDate && tempToDate) {
      setFromDate(tempFromDate);
      setToDate(tempToDate);
    }
    setBrokerFilter(tempBrokerFilter);
    setTransporterFilter(tempTransporterFilter);
    setShowFilterDialog(false);
    
    const activeFilters = [];
    if (tempFromDate && tempToDate) activeFilters.push("date range");
    if (tempBrokerFilter) activeFilters.push("broker");
    if (tempTransporterFilter) activeFilters.push("transporter");
    
    if (activeFilters.length > 0) {
      toast.success(`Filters applied: ${activeFilters.join(", ")}`);
    }
  };

  const handleFilterClear = () => {
    const defaultFromDate = new Date();
    defaultFromDate.setDate(defaultFromDate.getDate() - 0);
    setTempFromDate(defaultFromDate);
    setTempToDate(new Date());
    setTempBrokerFilter("");
    setTempTransporterFilter("");
  };

  const handleFilterReset = () => {
    const defaultFromDate = new Date();
    defaultFromDate.setDate(defaultFromDate.getDate() - 0);
    setFromDate(defaultFromDate);
    setToDate(new Date());
    setBrokerFilter("");
    setTransporterFilter("");
    setTempFromDate(defaultFromDate);
    setTempToDate(new Date());
    setTempBrokerFilter("");
    setTempTransporterFilter("");
    setShowFilterDialog(false);
    toast.success("All filters cleared");
  };

  const getTotalBillQty = (productsList) => {
    if (!productsList || !Array.isArray(productsList) || productsList.length === 0) return 0;
    return productsList.reduce((sum, product) => sum + (parseFloat(product.Bill_Qty) || 0), 0);
  };

  const getTotalItems = (productsList) => {
    if (!productsList || !Array.isArray(productsList)) return 0;
    return productsList.length;
  };

  // Filter orders based on search term, broker, and transporter
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
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

      // Broker filter
      if (brokerFilter) {
        const broker = getBrokerName(order).trim();
        if (broker !== brokerFilter) return false;
      }

      // Transporter filter
      if (transporterFilter) {
        const transporter = getTransporterName(order).trim();
        if (transporter !== transporterFilter) return false;
      }

      return true;
    });
  }, [orders, debouncedSearchTerm, brokerFilter, transporterFilter]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getProductPackGet = (productName) => {
    if (productName) {
      const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
      if (packMatch) {
        return parseFloat(packMatch[1]);
      }
    }
    return 1;
  };

  const handlePrintOrder = async (e, order) => {
    e.stopPropagation();
    
    try {
      const productsList = order.Products_List || [];
      
      const printCartItems = productsList.map(p => ({
        Print_Name: p.Product_Short_Name || p.Product_Name || "",
        kgs: parseFloat(p.Bill_Qty) || 0,
        price: parseFloat(p.Item_Rate) || parseFloat(p.Price) || 0,
        packGet: parseFloat(p.PackGet) || 1
      }));

      let customerData = {
        Billl_Name: order.Retailer_Name || order.Customer_Name || "",
        Short_Name: order.Retailer_Name || order.Customer_Name || "",
        Party_Location: order.Address || "",
        City: order.City || "",
        Mobile_No: order.Ord_Mobile_No || order.Mobile_No || "",
        Land_Line: "",
        Transporter: getTransporterName(order),
        Broker: getBrokerName(order),
      };

      const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
      
      if (retailerId) {
        const response = await fetchLink({ 
          address: `pos/retailerMasterOptRetailerId?Customer_Id=${retailerId}&limit=10000000&page=1` 
        });
        
        if (response?.success && Array.isArray(response.data)) {
          const found = response.data.find(
            c => String(c.Customer_Id) === String(retailerId)
          );
          
          if (found) {
            customerData = {
              Billl_Name: found.Billl_Name || found.Short_Name || order.Retailers_Name || "",
              Short_Name: found.Short_Name || order.Retailer_Name || "",
              Party_Location: found.Address || found.Party_Mailing_Address || "",
              City: found.City || "",
              Mobile_No: found.Mobile_No || order.Ord_Mobile_No || "",
              Land_Line: found.Land_Line || "",
              Transporter: getTransporterName(order) || found.Transporter_Name || found.Transporter || "",
              Broker: getBrokerName(order) || found.Broker_Name || found.Broker || "",
            };
          }
        }
      }

      const totalInvoiceValue = parseFloat(order.Total_Invoice_value || 0);
      const totalKgs = productsList.reduce((sum, p) => sum + (parseFloat(p.Bill_Qty) || 0), 0);
      
      const totals = {
        subtotal: totalInvoiceValue,
        tax: 0,
        total: totalInvoiceValue,
        totalItems: productsList.length,
        totalKgs: totalKgs,
      };
      
      const storage = JSON.parse(localStorage.getItem('user') || '{}');
      
      setPrintData({
        customer: customerData,
        cartItems: printCartItems,
        totals: totals,
        storage: storage,
        createdOn: order.Created_on || order.Created_On || order.created_on, // Add this line
        orderDate: order.So_Date, // Also capture the order date
      });
      
      setPrintModalOpen(true);
      
    } catch (error) {
      console.error("Error preparing print data:", error);
      toast.error("Failed to prepare print data");
    }
  };

const handleEditOrder = async (e, order) => {
  e.stopPropagation();
  
  try {
    const orderId = order.So_Id || order.So_No || order.OrderId;
    localStorage.setItem('editOrderId', String(orderId));
    localStorage.setItem("selectedCustomerId", order.Retailer_Id);
    
    // Get actual broker and transporter IDs from Staff_Involved_List
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
    
    // Get customer details
    const response = await fetchLink({ 
      address: `pos/retailerMasterOptRetailerId?Customer_Id=${order.Retailer_Id}&limit=10000000&page=1` 
    });
    
    let completeCustomerDetails = null;
    
    if (response?.success && Array.isArray(response.data)) {
      const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
      completeCustomerDetails = response.data.find(
        c => String(c.Customer_Id) === String(retailerId)
      );
    }
    
    const originalCustomerName = order.Retailer_Name || order.Customer_Name || order.Party_Name || "";
    
    const cartItemsObj = {};
    const productsList = [];
    
    if (order.Products_List && Array.isArray(order.Products_List)) {
      order.Products_List.forEach(product => {
        const productId = String(product.Product_Id || product.Item_Id);
        const originalProductName = product.Product_Name || product.Item_Name || "";
        const originalShortName = product.Short_Name || product.Product_Short_Name || originalProductName;
        
        let packGet = parseFloat(product.PackGet) || parseFloat(product.Pack_Get) || 1;
        if (packGet === 1 && originalProductName) {
          const packMatch = originalProductName.match(/(\d+(?:\.\d+)?)\s*KG/i);
          if (packMatch) {
            packGet = parseFloat(packMatch[1]);
          }
        }
        
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
          originalName: originalProductName,
        });
      });
    }
    
    const editData = {
      customerId: order.Retailer_Id || order.Customer_Id || order.Party_Id,
      customerName: originalCustomerName,
      customerMobile: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
      customerAddress: completeCustomerDetails?.Address || order.Shipp_Address || "",
      customerCity: completeCustomerDetails?.City || order.City || "",
      orderId: orderId,
      orderNumber: order.So_Inv_No || order.So_No,
      cartItems: cartItemsObj,
      productsList: productsList,
      brokerId: actualBrokerId,
      brokerName: actualBrokerName,
      transporterId: actualTransporterId,
      transporterName: actualTransporterName,
      shippingAddress: completeCustomerDetails?.Address || order.Shipp_Address || "",
      deliveryAddress: completeCustomerDetails?.Address || order.Deliv_Address || order.Shipp_Address || "",
      contactNumber: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
      description: order.Narration || "",
      customerDetails: {
        id: order.Retailer_Id || order.Customer_Id,
        name: originalCustomerName,
        mobile: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
        address: completeCustomerDetails?.Address || order.Shipp_Address || "",
        city: completeCustomerDetails?.City || order.City || "",
        brokerId: actualBrokerId,
        brokerName: actualBrokerName,
        transporterId: actualTransporterId,
        transporterName: actualTransporterName,
        billName: completeCustomerDetails?.Billl_Name || originalCustomerName,
        partyMailingName: completeCustomerDetails?.Party_Mailing_Name || originalCustomerName,
      }
    };
    
    localStorage.setItem('editOrderData', JSON.stringify(editData));
    localStorage.setItem('isEditingOrder', 'true');
    localStorage.setItem('cartItems', JSON.stringify(cartItemsObj));
    localStorage.setItem('editProductsList', JSON.stringify(productsList));
    localStorage.setItem('editCustomerOriginalName', originalCustomerName);
    localStorage.setItem('editBrokerId', actualBrokerId);
    localStorage.setItem('editBrokerName', actualBrokerName);
    localStorage.setItem('editTransporterId', actualTransporterId);
    localStorage.setItem('editTransporterName', actualTransporterName);
    
    // ✅ FIXED: Don't navigate — we're already on /cart, and navigating to the
    // same route doesn't remount CartPage, so its `showSaleOrders` state never
    // resets and the edit form never shows. Instead, hand the parsed order
    // straight to the parent via the onEditOrder prop, which switches views
    // (setShowSaleOrders(false)) and populates the cart form directly.
    if (onEditOrder) {
      onEditOrder(editData);
    }
    
  } catch (error) {
    console.error("Error fetching order details:", error);
    toast.error("Failed to load order details for editing");
  }
};
// const handleEditOrder = async (e, order) => {
//   e.stopPropagation();
  
//   try {
//     const orderId = order.So_Id || order.So_No || order.OrderId;
//     localStorage.setItem('editOrderId', String(orderId));
//     localStorage.setItem("selectedCustomerId", order.Retailer_Id);
    
//     // Get actual broker and transporter IDs from Staff_Involved_List
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
    
//     // Get customer details
//     const response = await fetchLink({ 
//       address: `pos/retailerMasterOptRetailerId?Customer_Id=${order.Retailer_Id}&limit=10000000&page=1` 
//     });
    
//     let completeCustomerDetails = null;
    
//     if (response?.success && Array.isArray(response.data)) {
//       const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
//       completeCustomerDetails = response.data.find(
//         c => String(c.Customer_Id) === String(retailerId)
//       );
//     }
    
//     const originalCustomerName = order.Retailer_Name || order.Customer_Name || order.Party_Name || "";
    
//     const cartItemsObj = {};
//     const productsList = [];
    
//     if (order.Products_List && Array.isArray(order.Products_List)) {
//       order.Products_List.forEach(product => {
//         const productId = String(product.Product_Id || product.Item_Id);
//         const originalProductName = product.Product_Name || product.Item_Name || "";
//         const originalShortName = product.Short_Name || product.Product_Short_Name || originalProductName;
        
//         let packGet = parseFloat(product.PackGet) || parseFloat(product.Pack_Get) || 1;
//         if (packGet === 1 && originalProductName) {
//           const packMatch = originalProductName.match(/(\d+(?:\.\d+)?)\s*KG/i);
//           if (packMatch) {
//             packGet = parseFloat(packMatch[1]);
//           }
//         }
        
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
//           originalName: originalProductName,
//         });
//       });
//     }
    
//     const editData = {
//       customerId: order.Retailer_Id || order.Customer_Id || order.Party_Id,
//       customerName: originalCustomerName,
//       customerMobile: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
//       customerAddress: completeCustomerDetails?.Address || order.Shipp_Address || "",
//       customerCity: completeCustomerDetails?.City || order.City || "",
//       orderId: orderId,
//       orderNumber: order.So_Inv_No || order.So_No,
//       cartItems: cartItemsObj,
//       productsList: productsList,
//       brokerId: actualBrokerId,
//       brokerName: actualBrokerName,
//       transporterId: actualTransporterId,
//       transporterName: actualTransporterName,
//       shippingAddress: completeCustomerDetails?.Address || order.Shipp_Address || "",
//       deliveryAddress: completeCustomerDetails?.Address || order.Deliv_Address || order.Shipp_Address || "",
//       contactNumber: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
//       description: order.Narration || "",
//       customerDetails: {
//         id: order.Retailer_Id || order.Customer_Id,
//         name: originalCustomerName,
//         mobile: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
//         address: completeCustomerDetails?.Address || order.Shipp_Address || "",
//         city: completeCustomerDetails?.City || order.City || "",
//         brokerId: actualBrokerId,
//         brokerName: actualBrokerName,
//         transporterId: actualTransporterId,
//         transporterName: actualTransporterName,
//         billName: completeCustomerDetails?.Billl_Name || originalCustomerName,
//         partyMailingName: completeCustomerDetails?.Party_Mailing_Name || originalCustomerName,
//       }
//     };
    
//     localStorage.setItem('editOrderData', JSON.stringify(editData));
//     localStorage.setItem('isEditingOrder', 'true');
//     localStorage.setItem('cartItems', JSON.stringify(cartItemsObj));
//     localStorage.setItem('editProductsList', JSON.stringify(productsList));
//     localStorage.setItem('editCustomerOriginalName', originalCustomerName);
//     localStorage.setItem('editBrokerId', actualBrokerId);
//     localStorage.setItem('editBrokerName', actualBrokerName);
//     localStorage.setItem('editTransporterId', actualTransporterId);
//     localStorage.setItem('editTransporterName', actualTransporterName);
    
//     // ✅ FIXED: removed `setShowSaleOrders(false);` — that setter doesn't exist
//     // in this component's scope. Navigation below is all that's needed;
//     // CartPage will mount fresh at /cart and read location.state.

//     // Use navigate directly with state
//     navigate('/cart', { 
//       state: { 
//         editOrderData: editData,
//         isEditingOrder: true,
//         selectedCustomer: {
//           id: editData.customerDetails.id,
//           name: originalCustomerName,
//           mobile: editData.customerDetails.mobile || "",
//           city: editData.customerDetails.city || "",
//           address: editData.customerDetails.address || "",
//           brokerId: actualBrokerId,
//           brokerName: actualBrokerName,
//           transporterId: actualTransporterId,
//           transporterName: actualTransporterName,
//         }
//       } 
//     });
    
//     toast.info(`Loading order #${order.So_Inv_No || order.So_No} for editing...`);
    
//   } catch (error) {
//     console.error("Error fetching order details:", error);
//     toast.error("Failed to load order details for editing");
//   }
// };

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
                {/* <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Qty (Bags)</th> */}
                <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Kgs</th>
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
                  {/* <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                    {parseFloat(product.Total_Qty || product.Quantity || 0).toFixed(0)}
                  </td> */}
                  <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                    {parseFloat(product.Bill_Qty || 0).toFixed(2)}
                  </td>
                  <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                    ₹{parseFloat(product.Item_Rate || product.Price || 0).toFixed(2)}
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

  // Get active filters count
  const activeFiltersCount = (brokerFilter ? 1 : 0) + (transporterFilter ? 1 : 0);

  return (
    <>
      <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile ? "70px" : "0" }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", 
          backgroundColor: BROWN_DARK, 
          color: "#fff",
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          position: "sticky", 
          top: 0, 
          zIndex: 100,
          flexWrap: isMobile ? "wrap" : "nowrap"
        }}>
          <button onClick={onBack} style={{ 
            background: "transparent", border: "none", color: "#fff", 
            fontSize: "20px", cursor: "pointer", padding: "4px" 
          }}>←</button>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Sale Orders</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {filteredOrders.length} of {orders.length} orders
              {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active)`}
            </div>
          </div>
          
          {/* Search Bar */}
          <div style={{ position: "relative", width: isMobile ? "150px" : "250px" }}>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <SearchIcon style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(255,255,255,0.7)" }} />
          </div>
          
          {/* Filter Button - Opens the combined dialog */}
          <button
            onClick={handleOpenFilterDialog}
            style={{
              background: activeFiltersCount > 0 ? ACCENT : "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "20px",
              padding: "6px 12px",
              color: activeFiltersCount > 0 ? BROWN_DARK : "#fff",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: activeFiltersCount > 0 ? "600" : "400",
            }}
          >
            <FilterListIcon style={{ fontSize: "16px" }} />
            Filter
            {activeFiltersCount > 0 && (
              <span style={{
                background: "#e74c3c",
                color: "#fff",
                borderRadius: "10px",
                padding: "2px 6px",
                fontSize: "10px",
                marginLeft: "4px"
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear all filters button - only when filters active */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleFilterReset}
              style={{
                background: "#e74c3c",
                border: "none",
                borderRadius: "20px",
                padding: "6px 12px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              ✕ Clear All
            </button>
          )}
        </div>

        {/* Combined Filter Dialog - Date Range + Broker + Transporter */}
        {showFilterDialog && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }} onClick={() => setShowFilterDialog(false)}>
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              width: isMobile ? "92%" : "500px",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Dialog Header */}
              <div style={{
                padding: "20px 24px",
                background: BROWN_DARK,
                color: "#fff",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Filter Orders</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>Apply filters to narrow down results</p>
                </div>
                <CloseIcon 
                  style={{ cursor: "pointer", fontSize: "24px" }} 
                  onClick={() => setShowFilterDialog(false)} 
                />
              </div>

              {/* Dialog Content */}
              <div style={{ padding: "24px" }}>
                {/* Date Range Section */}
                <div style={{ marginBottom: "28px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: `2px solid ${ACCENT}`
                  }}>
                    <span style={{ fontSize: "18px" }}>📅</span>
                    <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>Date Range</span>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "13px", fontWeight: "500" }}>
                      From Date
                    </label>
                    <DatePicker
                      selected={tempFromDate}
                      onChange={(date) => setTempFromDate(date)}
                      selectsStart
                      startDate={tempFromDate}
                      endDate={tempToDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select from date"
                      className="date-picker-input"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${ACCENT}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "13px", fontWeight: "500" }}>
                      To Date
                    </label>
                    <DatePicker
                      selected={tempToDate}
                      onChange={(date) => setTempToDate(date)}
                      selectsEnd
                      startDate={tempFromDate}
                      endDate={tempToDate}
                      minDate={tempFromDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select to date"
                      className="date-picker-input"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${ACCENT}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Broker Filter Section */}
                {uniqueBrokers.length > 0 && (
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ position: "relative" }}>
                      <select
                        value={tempBrokerFilter}
                        onChange={(e) => setTempBrokerFilter(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 32px 12px 12px",
                          border: `1px solid ${tempBrokerFilter ? BROWN_DARK : ACCENT}`,
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: tempBrokerFilter ? "#f9f4ef" : "#fff",
                          color: tempBrokerFilter ? BROWN_DARK : "#333",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                        }}
                      >
                        <option value="">All Brokers</option>
                        {uniqueBrokers.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <span style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: BROWN_LIGHT,
                        fontSize: "12px"
                      }}>▼</span>
                    </div>
                  </div>
                )}

                {/* Transporter Filter Section */}
                {uniqueTransporters.length > 0 && (
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ position: "relative" }}>
                      <select
                        value={tempTransporterFilter}
                        onChange={(e) => setTempTransporterFilter(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 32px 12px 12px",
                          border: `1px solid ${tempTransporterFilter ? BROWN_DARK : ACCENT}`,
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: tempTransporterFilter ? "#f9f4ef" : "#fff",
                          color: tempTransporterFilter ? BROWN_DARK : "#333",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                        }}
                      >
                        <option value="">All Transporters</option>
                        {uniqueTransporters.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: BROWN_LIGHT,
                        fontSize: "12px"
                      }}>▼</span>
                    </div>
                  </div>
                )}

                {/* No filters available message */}
                {uniqueBrokers.length === 0 && uniqueTransporters.length === 0 && (
                  <div style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    background: "#f9f4ef",
                    borderRadius: "12px",
                    color: "#999"
                  }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>🔍</span>
                    <p style={{ margin: 0, fontSize: "14px" }}>
                      No broker or transporter data available
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: "12px" }}>
                      You can still filter by date range
                    </p>
                  </div>
                )}
              </div>

              {/* Dialog Actions */}
              <div style={{
                padding: "16px 24px",
                borderTop: "1px solid #e8ddd4",
                display: "flex",
                gap: "12px",
                background: "#faf6f2",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px"
              }}>
                <Button
                  variant="outlined"
                  onClick={handleFilterClear}
                  style={{ flex: 1 }}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  onClick={handleFilterApply}
                  style={{ 
                    flex: 1, 
                    backgroundColor: BROWN_DARK, 
                    color: "#fff",
                    fontWeight: "600"
                  }}
                >
                  Apply Filters
                </Button>
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
                {debouncedSearchTerm || brokerFilter || transporterFilter
                  ? "Try adjusting your search or filters"
                  : "No orders found in selected date range"}
              </p>
            </div>
          ) : isMobile ? (
            // Mobile Card View (same as before)
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredOrders.map((order, index) => {
                const totalBillQty = getTotalBillQty(order.Products_List);
                const totalItems = getTotalItems(order.Products_List);
                const orderKey = order.So_Id || order.So_No || index;
                const isExpanded = expandedOrders[orderKey] || false;
                const brokerName = getBrokerName(order);
                const transporterName = getTransporterName(order);
                
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
                           {order.OrderStatus}
                          </div>
                          {brokerName && (
                            <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>
                              Broker: {brokerName}
                            </div>
                          )}
                          {transporterName && (
                            <div style={{ fontSize: "10px", color: "#888" }}>
                              Transporter: {transporterName}
                            </div>
                          )}
                        </div>
                         <div style={{ fontSize: "12px", color: "#666" }}>
                         {order.OrderStatus }
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
                          onClick={(e) => handlePrintOrder(e, order)}
                          style={{ 
                            padding: "6px 12px", background: "#4CAF50", 
                            color: "#fff", border: "none", 
                            borderRadius: "15px", fontSize: "11px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "4px"
                          }}
                        >
                          🖨️ Print
                        </button>
                        <button 
                          onClick={(e) => handleEditOrder(e, order)}
                          style={{ 
                            padding: "6px 12px", background: ACCENT, 
                            color: BROWN_DARK, border: "none", 
                            borderRadius: "15px", fontSize: "11px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "4px"
                          }}
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && <ProductListExpand products={order.Products_List} />}
                  </div>
                );
              })}
            </div>
          ) : (
            // Desktop Table View
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "separate", 
                borderSpacing: "0 0", 
                minWidth: "1200px" 
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9f4ef" }}>
                    <th style={tableHeaderStyle}></th>
                    {["Order #", "Date", "Customer", "Broker", "Transporter","Status", "Items", "Kgs", "Amount", "Actions"].map((h, i) => (
                      <th key={h} style={{
                        ...tableHeaderStyle, 
                        textAlign: i >= 5 && i <= 7 ? "right" : i === 8 ? "center" : "left"
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
                    const brokerName = getBrokerName(order);
                    const transporterName = getTransporterName(order);
                     const OrderStatus = getOrderStatus(order);
      
                    return (
                      <React.Fragment key={orderKey}>
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
                            fontSize: "14px"
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
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px", textAlign: "center" }}>
                            {order.So_Date ? order.So_Date.split('T')[0] : "N/A"}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>
                              {order.Retailer_Name || order.Customer_Name || "Unknown"}
                            </div>
                            {order.Ord_Mobile_No && (
                              <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>
                                📞 {order.Ord_Mobile_No}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>
                            {brokerName || "-"}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>
                            {transporterName || "-"}
                          </td>
                            <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>{OrderStatus}</td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                            {totalItems}
                          </td>
                        
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                            {totalBillQty.toFixed(2)} kg
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: BROWN_DARK, fontWeight: "600", fontSize: "14px" }}>
                            ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button
                                onClick={(e) => handlePrintOrder(e, order)}
                                title="Print Order"
                                style={{ 
                                  background: "#4CAF50", 
                                  border: "none", 
                                  borderRadius: "8px", 
                                  padding: "8px 12px", 
                                  cursor: "pointer", 
                                  color: "#fff", 
                                  fontSize: "11px", 
                                  fontWeight: "600",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#388E3C"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#4CAF50"}
                              >
                                🖨️ Print
                              </button>
                              <button
                                onClick={(e) => handleEditOrder(e, order)}
                                title="Edit Order"
                                style={{ 
                                  background: BROWN, 
                                  border: "none", 
                                  borderRadius: "8px", 
                                  padding: "8px 12px", 
                                  cursor: "pointer", 
                                  color: "#fff", 
                                  fontSize: "11px", 
                                  fontWeight: "600",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
                                onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
                              >
                                ✏️ Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {isExpanded && (
                          <tr>
                            <td colSpan={10} style={{ padding: "0" }}>
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
      
      {/* Print Preview Modal */}
      {/* Print Preview Modal */}
      {printModalOpen && (
        <PrintPreviewModal 
          open={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          customer={printData?.customer}
          cartItems={printData?.cartItems}
          totals={printData?.totals}
          onPrintAndSave={async () => true}
          storage={printData?.storage}
          isReprint={true}
          createdOn={printData?.createdOn} // Add this
          orderDate={printData?.orderDate} // Add this
        />
      )}
      {isMobile && <MobileTabBar activeTab="saleOrders" onSaleOrders={() => {}} cartCount={0} />}
  
    </>
  );
}
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

 

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);
  const [showSaleOrders, setShowSaleOrders] = useState(false);
  const handleDashboard = () => setShowDashboard(true);
   const [showDashboard, setShowDashboard] = useState(() => window.innerWidth <= 768);

const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
const [loadingBrokers, setLoadingBrokers] = useState(false);
const [loadingTransporters, setLoadingTransporters] = useState(false);
const [creditInfo, setCreditInfo] = useState(null);
   const [cartHeaderMenuOpen, setCartHeaderMenuOpen] = useState(false);

const handleBackFromDashboard = () => setShowDashboard(false);

 
useEffect(() => {
  const editProductsStr = localStorage.getItem('editProductsList');
  if (editProductsStr) {
    const editProducts = JSON.parse(editProductsStr);
  }
}, []);

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

// Add this useEffect to handle navigation from SaleOrders
useEffect(() => {
  const isEditing = localStorage.getItem('isEditingOrder') === 'true';
  const editDataStr = localStorage.getItem('editOrderData');
  
  // Check if we came from SaleOrders with edit intent
  if (isEditing && editDataStr) {
    try {
      const editData = JSON.parse(editDataStr);
      
      // Set all the state from the edit data
      if (editData.customerId) {
        setCustomer(String(editData.customerId));
        setContactNumber(editData.contactNumber || "");
        setShippingAddress(editData.shippingAddress || "");
        setDeliveryAddress(editData.deliveryAddress || "");
        setDescription(editData.description || "");
        
        if (editData.customerDetails) {
          const originalCustomerName = localStorage.getItem('editCustomerOriginalName') || editData.customerName;
          const customerWithOriginalName = {
            ...editData.customerDetails,
            name: originalCustomerName,
            billName: editData.customerDetails.billName || originalCustomerName,
          };
          setHeaderSelectedCustomer(customerWithOriginalName);
          setPrefilledCustomer({ 
            id: editData.customerDetails.id, 
            name: originalCustomerName 
          });
          
          setSelectedDetails({
            customerId: String(editData.customerDetails.id),
            customerName: originalCustomerName,
            mobileNo: editData.customerDetails.mobile || "",
            address: editData.customerDetails.address || "",
            city: editData.customerDetails.city || "",
            broker: editData.brokerName || "",
            Broker_Id: editData.brokerId || "",
            transporter: editData.transporterName || "",
            Transporter_Id: editData.transporterId || "",
          });
        }
      }
      

      if (editData.brokerId && editData.brokerId !== 0 && editData.brokerId !== "0") {
        const brokerIdNum = parseInt(editData.brokerId);
        if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
          setSelectedBroker({ 
            id: brokerIdNum, 
            name: editData.brokerName || "" 
          });
          setBrokerName(editData.brokerName || "");
        }
      }
      
 
      if (editData.transporterId && editData.transporterId !== 0 && editData.transporterId !== "0") {
        const transporterIdNum = parseInt(editData.transporterId);
        if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
          setSelectedTransporter({ 
            id: transporterIdNum, 
            name: editData.transporterName || "" 
          });
          setTransporter(editData.transporterName || "");
        }
      }
      
   
      if (editData.productsList && editData.productsList.length > 0) {
        const restoredCartItems = {};
        editData.productsList.forEach(product => {
          if (product.id && product.quantity > 0) {
            restoredCartItems[product.id] = product.quantity;
          }
        });
        setCartItems(restoredCartItems);
        localStorage.setItem('cartItems', JSON.stringify(restoredCartItems));
      }
      
    
      if (isMobile) {
        setStep(2);
      }
      
    } catch (error) {
      console.error("Error processing edit data from navigation:", error);
    }
  }
}, [isMobile]); 



useEffect(() => {
  const isEditing = localStorage.getItem('isEditingOrder');
  
  if (isEditing === 'true') {

    const editDataStr = localStorage.getItem('editOrderData');
    
    if (editDataStr) {
      try {
        const editData = JSON.parse(editDataStr);
        
      
        if (editData.brokerId && editData.brokerId !== 0 && editData.brokerId !== "0" && editData.brokerId !== null) {
          const brokerIdNum = parseInt(editData.brokerId);
          if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
            setSelectedBroker({ 
              id: brokerIdNum, 
              name: editData.brokerName || "" 
            });
            setBrokerName(editData.brokerName || "");
          
          }
        }
        
      
        if (editData.transporterId && editData.transporterId !== 0 && editData.transporterId !== "0" && editData.transporterId !== null) {
          const transporterIdNum = parseInt(editData.transporterId);
          if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
            setSelectedTransporter({ 
              id: transporterIdNum, 
              name: editData.transporterName || "" 
            });
            setTransporter(editData.transporterName || "");
         
          }
        }
      } catch (error) {
        console.error("Error parsing editOrderData:", error);
      }
    }
    
    const savedBrokerId = localStorage.getItem('editBrokerId');
    const savedBrokerName = localStorage.getItem('editBrokerName');
    const savedTransporterId = localStorage.getItem('editTransporterId');
    const savedTransporterName = localStorage.getItem('editTransporterName');
    
    if (savedBrokerId && savedBrokerId !== '0' && savedBrokerId !== 'null') {
      const brokerIdNum = parseInt(savedBrokerId);
      if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
        setSelectedBroker({ 
          id: brokerIdNum, 
          name: savedBrokerName || "" 
        });
        setBrokerName(savedBrokerName || "");
      }
    }
    
    if (savedTransporterId && savedTransporterId !== '0' && savedTransporterId !== 'null') {
      const transporterIdNum = parseInt(savedTransporterId);
      if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
        setSelectedTransporter({ 
          id: transporterIdNum, 
          name: savedTransporterName || "" 
        });
        setTransporter(savedTransporterName || "");
      }
    }
  }
}, []);



const handleBackFromSaleOrders = async () => {
  setShowSaleOrders(false);
  
  
  const savedCustomer = localStorage.getItem('cartPageSelectedCustomer');
  const savedCustomerId = localStorage.getItem('selectedCustomerId');
  const editOrderId = localStorage.getItem('editOrderId');

  if (savedCustomerId && !savedCustomer) {
    try {
      const selectedCustomerData = localStorage.getItem('selectedCustomer');
      if (selectedCustomerData) {
        const parsedCustomer = JSON.parse(selectedCustomerData);
        localStorage.setItem('cartPageSelectedCustomer', JSON.stringify(parsedCustomer));
       
      }
    } catch (e) {
      console.error("Error parsing selected customer:", e);
    }
  }
  

  const refreshedSavedCustomer = localStorage.getItem('cartPageSelectedCustomer');
  
  if (refreshedSavedCustomer) {
    try {
      const restoredCustomer = JSON.parse(refreshedSavedCustomer);
      
      
      setHeaderSelectedCustomer(restoredCustomer);
      setPrefilledCustomer({ id: restoredCustomer.id, name: restoredCustomer.name });
      

      const savedCustomerId2 = localStorage.getItem('cartPageCustomer');
      if (savedCustomerId2) {
        setCustomer(savedCustomerId2);
      } else {
        setCustomer(String(restoredCustomer.id || ""));
      }
      
      setContactNumber(localStorage.getItem('cartPageContactNumber') || restoredCustomer.mobile || '');
      

      const savedBroker = localStorage.getItem('cartPageBroker');
      if (savedBroker) {
        try {
          const broker = JSON.parse(savedBroker);
          setSelectedBroker(broker);
          setBrokerName(broker.name || '');
        } catch (e) {
          console.error("Error parsing saved broker:", e);
        }
      } else if (restoredCustomer.brokerId && restoredCustomer.brokerName) {
        setSelectedBroker({ id: restoredCustomer.brokerId, name: restoredCustomer.brokerName });
        setBrokerName(restoredCustomer.brokerName);
      }
      
     
      const savedTransporter = localStorage.getItem('cartPageTransporter');
      if (savedTransporter) {
        try {
          const transporter = JSON.parse(savedTransporter);
          setSelectedTransporter(transporter);
          setTransporter(transporter.name || '');
        } catch (e) {
          console.error("Error parsing saved transporter:", e);
        }
      } else if (restoredCustomer.transporterId && restoredCustomer.transporterName) {
        setSelectedTransporter({ id: restoredCustomer.transporterId, name: restoredCustomer.transporterName });
        setTransporter(restoredCustomer.transporterName);
      }
      
  
      setShippingAddress(localStorage.getItem('cartPageShippingAddress') || restoredCustomer.address || '');
      setDeliveryAddress(localStorage.getItem('cartPageDeliveryAddress') || restoredCustomer.address || '');
      setDescription(localStorage.getItem('cartPageDescription') || '');
      
     
      setSelectedDetails({
        customerId: String(restoredCustomer.id),
        customerName: restoredCustomer.name,
        mobileNo: restoredCustomer.mobile || '',
        address: restoredCustomer.address || '',
        city: restoredCustomer.city || '',
        broker: restoredCustomer.brokerName || '',
        Broker_Id: restoredCustomer.brokerId || '',
        transporter: restoredCustomer.transporterName || '',
        Transporter_Id: restoredCustomer.transporterId || '',
      });
      
    } catch (error) {
      console.error("Error restoring customer data:", error);
    }
  }
  

  loadCartData();
  
  
  if (editOrderId) {
    setTimeout(() => {
      const isEditing = localStorage.getItem('isEditingOrder');
      const storedEditData = localStorage.getItem('editOrderData');
      
      if (isEditing === 'true' && storedEditData) {
        try {
          localStorage.removeItem('isEditingOrder');
          localStorage.removeItem('editOrderData');
          
          const orderToEdit = JSON.parse(storedEditData);
          
      
          if (orderToEdit.cartItems && Object.keys(orderToEdit.cartItems).length > 0) {
            setCartItems(orderToEdit.cartItems);
            localStorage.setItem('cartItems', JSON.stringify(orderToEdit.cartItems));
          }
          
        
          if (orderToEdit.customerId && !refreshedSavedCustomer) {
            setCustomer(String(orderToEdit.customerId));
            setContactNumber(orderToEdit.contactNumber || "");
            setBrokerName(orderToEdit.brokerName || "");
            setTransporter(orderToEdit.transporterName || "");
            setShippingAddress(orderToEdit.shippingAddress || "");
            setDeliveryAddress(orderToEdit.deliveryAddress || "");
            setDescription(orderToEdit.description || "");
            
            if (orderToEdit.brokerId && orderToEdit.brokerName) {
              setSelectedBroker({ id: orderToEdit.brokerId, name: orderToEdit.brokerName });
            }
            
            if (orderToEdit.transporterId && orderToEdit.transporterName) {
              setSelectedTransporter({ id: orderToEdit.transporterId, name: orderToEdit.transporterName });
            }
            
            if (orderToEdit.customerDetails) {
              setHeaderSelectedCustomer(orderToEdit.customerDetails);
              setPrefilledCustomer({ 
                id: orderToEdit.customerDetails.id, 
                name: orderToEdit.customerDetails.name 
              });
            }
          }
          
          const orderNumber = orderToEdit.orderNumber || 'Unknown';
          toast.success(`Order #${orderNumber} loaded for editing`);
        } catch (error) {
          console.error("Error processing edit order data:", error);
        }
      }
    }, 300);
  }
};

// Update the useEffect that restores edit data
useEffect(() => {
  const isEditing = localStorage.getItem('isEditingOrder');
  const editDataStr = localStorage.getItem('editOrderData');
  
  if (isEditing === 'true' && editDataStr) {
    try {
      const editData = JSON.parse(editDataStr);
      
      // Restore customer name from original stored value
      const originalCustomerName = localStorage.getItem('editCustomerOriginalName') || editData.customerName;
      
      // Set customer with original name
      if (editData.customerId) {
        setCustomer(String(editData.customerId));
        setContactNumber(editData.contactNumber || "");
        setShippingAddress(editData.shippingAddress || "");
        setDeliveryAddress(editData.deliveryAddress || "");
        setDescription(editData.description || "");
        
        if (editData.customerDetails) {
          // Preserve original name
          const customerWithOriginalName = {
            ...editData.customerDetails,
            name: originalCustomerName,
            billName: editData.customerDetails.billName || originalCustomerName,
          };
          setHeaderSelectedCustomer(customerWithOriginalName);
          setPrefilledCustomer({ 
            id: editData.customerDetails.id, 
            name: originalCustomerName 
          });
        }
      }
      
      // Restore broker with actual ID
      if (editData.brokerId && editData.brokerId !== 0 && editData.brokerId !== "0") {
        const brokerIdNum = parseInt(editData.brokerId);
        if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
          setSelectedBroker({ 
            id: brokerIdNum, 
            name: editData.brokerName || "" 
          });
          setBrokerName(editData.brokerName || "");
        }
      }
      
      // Restore transporter with actual ID
      if (editData.transporterId && editData.transporterId !== 0 && editData.transporterId !== "0") {
        const transporterIdNum = parseInt(editData.transporterId);
        if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
          setSelectedTransporter({ 
            id: transporterIdNum, 
            name: editData.transporterName || "" 
          });
          setTransporter(editData.transporterName || "");
        }
      }
      
      // Restore cart items with original product names
      if (editData.productsList && editData.productsList.length > 0) {
        const restoredCartItems = {};
        editData.productsList.forEach(product => {
          if (product.id && product.quantity > 0) {
            restoredCartItems[product.id] = product.quantity;
          }
        });
        setCartItems(restoredCartItems);
        localStorage.setItem('cartItems', JSON.stringify(restoredCartItems));
      }
      
      const orderNumber = editData.orderNumber || 'Unknown';
      toast.success(`Order #${orderNumber} loaded for editing`);
      
    } catch (error) {
      console.error("Error processing edit order data:", error);
    }
  }
}, []);


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


  useEffect(() => {

  if (!headerSelectedCustomer) {
    const savedCustomer = localStorage.getItem('cartPageSelectedCustomer');
    if (savedCustomer) {
      try {
        const restoredCustomer = JSON.parse(savedCustomer);
        setHeaderSelectedCustomer(restoredCustomer);
        setPrefilledCustomer({ id: restoredCustomer.id, name: restoredCustomer.name });
       
      } catch (e) {
        console.error("Error restoring customer from recovery:", e);
      }
    }
  }
}, [headerSelectedCustomer]);



  const handleLogout = () => {
 
  const keysToRemove = [
 
    'user',
    'session', 
    'loginAt',
    'userType',
    'username',
    'retId',
    
 
    'cartItems',
    'cartItemsBackup',
    'previousCartItems',
    'products',
    'productsBackup',
    'productMapping',
    
    
    'editOrderId',
    'editOrderData',
    'editProductsList',
    'isEditingOrder',
    
   
    'selectedCustomer',
    'selectedCustomerId',
    'selectedCustomerData',
    'cartPageSelectedCustomer',
    'cartPageSelectedCustomerId',
    'cartPageCustomer',
    'cartPageContactNumber',
    'cartPageBroker',
    'cartPageTransporter',
    'cartPageShippingAddress',
    'cartPageDeliveryAddress',
    'cartPageDescription',
    
    
    'userData',
    'sessionData'
  ];
  
 
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
    localStorage.removeItem("user"); localStorage.removeItem("session");  localStorage.removeItem("username");
    localStorage.removeItem("loginAt"); localStorage.removeItem("userType");
    localStorage.removeItem("selectedCustomerId"); localStorage.removeItem("selectedCustomer");
    setIsLoggedIn(false); setUserName(""); setUserType("");
    setCustomers([]); setHeaderSelectedCustomer(null);
   
  
  toast.success('Logged out successfully');
  navigate('/', { replace: true });
  if (onLogout) onLogout();
};

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetchLink({ address: `pos/retailerMasterOptRetailerId?limit=10000000&page=1` });
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

const handleHeaderCustomerSelect = async (customer) => {
  let updatedCustomer = { ...customer };

 
  
  // Check if we're in edit mode
  const isEditing = localStorage.getItem('isEditingOrder') === 'true';
  const editOrderData = isEditing ? JSON.parse(localStorage.getItem('editOrderData') || '{}') : null;
  
  try {
   
    const response = await fetchLink({ 
      address: `pos/retailerMasterOptRetailerId?Customer_Id=${customer.id}&limit=10000000&page=1` 
    });
    
    if (response?.success && Array.isArray(response.data)) {
    
      const found = response.data.find(c => String(c.Retailer_Id || c.Customer_Id) === String(customer.id));
      if (found) {
        updatedCustomer = {
          ...customer,
          brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : customer.brokerId || "",
          brokerName: (found.Broker_Name || found.Broker || customer.brokerName || "").trim(),
          transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : customer.transporterId || "",
          transporterName: (found.Transporter_Name || found.Transporter || customer.transporterName || "").trim(),
          partyMailingAddress: found.Party_Mailing_Address || found.Address || customer.address || "",
          partyMailingName: found.Party_Mailing_Name || found.Billl_Name || customer.name || "",
          billName: found.Billl_Name || customer.name || "",
          originalAddress: found.Address || customer.address || "",
          originalCity: found.City || customer.city || "",
          mobile: found.Mobile_No || customer.mobile || "",
        };
      }
    }
  } catch (e) {
    console.error("Error fetching complete customer details:", e);
  }

  // Rest of the function remains the same...
  setHeaderSelectedCustomer(updatedCustomer);
  setCustomer(String(updatedCustomer.id || ""));
  setContactNumber(updatedCustomer.mobile || "");

  const displayAddress = updatedCustomer.partyMailingAddress || updatedCustomer.originalAddress || updatedCustomer.address || "";
  if (displayAddress) { 
    setShippingAddress(displayAddress); 
    setDeliveryAddress(displayAddress); 
  }

  // CRITICAL FIX: Don't overwrite broker/transporter if in edit mode
  if (isEditing && editOrderData) {
    // Keep the edit mode broker and transporter
    if (editOrderData.brokerId && editOrderData.brokerId !== 0 && editOrderData.brokerId !== "0") {
      setSelectedBroker({ 
        id: parseInt(editOrderData.brokerId), 
        name: editOrderData.brokerName || "" 
      });
      setBrokerName(editOrderData.brokerName || "");
    }
    if (editOrderData.transporterId && editOrderData.transporterId !== 0 && editOrderData.transporterId !== "0") {
      setSelectedTransporter({ 
        id: parseInt(editOrderData.transporterId), 
        name: editOrderData.transporterName || "" 
      });
      setTransporter(editOrderData.transporterName || "");
    }
  } else {
    // Only set from customer master if not in edit mode
    if (updatedCustomer.brokerId && updatedCustomer.brokerName) {
      setSelectedBroker({ id: updatedCustomer.brokerId, name: updatedCustomer.brokerName });
      setBrokerName(updatedCustomer.brokerName);
    } else {
      setSelectedBroker({ id: null, name: "" });
      setBrokerName("");
    }
    if (updatedCustomer.transporterId && updatedCustomer.transporterName) {
      setSelectedTransporter({ id: updatedCustomer.transporterId, name: updatedCustomer.transporterName });
      setTransporter(updatedCustomer.transporterName);
    } else {
      setSelectedTransporter({ id: null, name: "" });
      setTransporter("");
    }
  }
  
  setPrefilledCustomer({ id: updatedCustomer.id, name: updatedCustomer.name });
  
  setSelectedDetails({
    customerId: String(updatedCustomer.id), 
    customerName: updatedCustomer.name,
    mobileNo: updatedCustomer.mobile || "",   
    address: displayAddress,
    city: updatedCustomer.city || "", 
    broker: isEditing && editOrderData ? editOrderData.brokerName || "" : updatedCustomer.brokerName || "",
    Broker_Id: isEditing && editOrderData ? editOrderData.brokerId || null : updatedCustomer.brokerId || "",
    transporter: isEditing && editOrderData ? editOrderData.transporterName || "" : updatedCustomer.transporterName || "",
    Transporter_Id: isEditing && editOrderData ? editOrderData.transporterId || null : updatedCustomer.transporterId || "",
    billName: updatedCustomer.billName || updatedCustomer.name || "",
    partyMailingName: updatedCustomer.partyMailingName || "",
  });

  localStorage.setItem("selectedCustomerId", String(updatedCustomer.id));
  localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
  localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(updatedCustomer));
  localStorage.setItem("cartPageSelectedCustomerId", String(updatedCustomer.id));
  localStorage.setItem("cartPageCustomer", String(updatedCustomer.id));
};


const fetchBrokers = async () => {
  if (availableBrokers.length > 0) return;
  setLoadingBrokers(true);
  try {
    const response = await fetchLink({ address: `pos/brokers` });
    if (response?.success) {
      const data = response.data?.Brokers || response.data || [];
      if (Array.isArray(data)) {
        setAvailableBrokers(data.map(b => ({
          id: b.Broker_Id,
          name: (b.Broker_Name || "").trim(),
          code: (b.Broker_Code || "").trim(),
          mobile: (b.Mobile_No || "").trim(),
          alias: (b.Allias_Name || b.Alias || "").trim()  
        })));
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
        setAvailableTransporters(data.map(t => ({
          id: t.Transporter_Id,
          name: (t.Transporter_Name || "").trim(),
          code: (t.Transporter_Code || "").trim(),
          mobile: (t.Mobile_No || "").trim(),
          alias: (t.Allias_Name || t.Alias || "").trim()  
        })));
      }
    }
  } catch (error) {
    toast.error("Failed to load transporters");
  } finally {
    setLoadingTransporters(false);
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
  if (customer) {
    fetchCreditInfo(customer);
  } else {
    setCreditInfo(null);
  }
}, [customer]);

const loadAllProducts = async () => {
  try {
    const response = await fetchLink({ address: 'products?limit=1000' });
    if (response?.success && Array.isArray(response.data)) {
      const productsWithShortName = response.data.map(p => ({
        ...p,
        shortName: p.Short_Name || p.name, // Map Short_Name to shortName
      }));
      setAllProducts(productsWithShortName);
    }
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
  style.innerHTML = `
    @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes blinker { 50% { opacity: 0; } }
  `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}, []);

  const handleCancelEdit = () => {
  if (window.confirm("Are you sure you want to cancel the edit? All changes will be lost.")) {
    localStorage.removeItem('editOrderId');
    localStorage.removeItem('editOrderData');
    localStorage.removeItem('isEditingOrder');
    localStorage.removeItem('cartItemsBackup');
    localStorage.removeItem('productsBackup');
    
    setCartItems({});
    localStorage.removeItem('cartItems');
    
    setCustomer("");
    setContactNumber("");
    setBrokerName("");
    setTransporter("");
    setShippingAddress("");
    setDeliveryAddress("");
    setDescription("");
    setSelectedBroker({ id: null, name: "" });
    setSelectedTransporter({ id: null, name: "" });
    setHeaderSelectedCustomer(null);
    setPrefilledCustomer(null);
    setSelectedDetails(null);
    
    const keysToRemove = [
      'selectedCustomerId', 'selectedCustomer', 'selectedCustomerData',
      'cartPageSelectedCustomer', 'cartPageSelectedCustomerId',
      'cartPageCustomer', 'cartPageContactNumber', 'cartPageBroker',
      'cartPageTransporter', 'cartPageShippingAddress',
      'cartPageDeliveryAddress', 'cartPageDescription'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    toast.success("Edit cancelled successfully");
    navigate('/');
  }
};



useEffect(() => {
  const loadProductsForEditing = async () => {
    const isEditing = localStorage.getItem('isEditingOrder');
    const editData = localStorage.getItem('editOrderData');
    
    if (isEditing === 'true' && editData) {
    
      if (products.length === 0 && allProducts.length === 0) {
        try {
          const response = await fetchLink({ address: 'products?limit=1000' });
          if (response?.success && Array.isArray(response.data)) {
            setAllProducts(response.data);
            setProducts(response.data);
            localStorage.setItem('products', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Error loading products for editing:", error);
        }
      }
    }
  };
  
  loadProductsForEditing();
}, [products.length, allProducts.length]);



  const getProductPackGet = (productId) => {

  const p = allProducts.find(p => p.id === productId || p.Product_Id === productId) || 
           products.find(p => p.id === productId);
  
  if (p?.packGet) return p.packGet;
  

  if (p?.name) {
    const packMatch = p.name.match(/(\d+(?:\.\d+)?)\s*KG/i);
    if (packMatch) {
      return parseFloat(packMatch[1]);
    }
  }
  
  return 1;
};


const enhancedCartItems = useMemo(() => {
  let editProductsList = [];
  let editCartItems = null;
  
  try {
    const editDataStr = localStorage.getItem('editOrderData');
    if (editDataStr) {
      const editData = JSON.parse(editDataStr);
      editCartItems = editData.cartItems;
      if (editData.productsList && Array.isArray(editData.productsList)) {
        editProductsList = editData.productsList;
      }
    }
  } catch (e) {}
  
  if (editProductsList.length === 0) {
    try {
      const str = localStorage.getItem('editProductsList');
      if (str) editProductsList = JSON.parse(str);
    } catch (e) {}
  }

  const editProductsMap = new Map();
  editProductsList.forEach(p => {
    if (p.id) {
      editProductsMap.set(String(p.id), p);
      editProductsMap.set(String(parseInt(p.id)), p);
    }
  });

  const isEditing = localStorage.getItem('isEditingOrder') === 'true';
  let activeCartItems = cartItems;
  if (isEditing && editCartItems && Object.keys(editCartItems).length > 0) {
    activeCartItems = editCartItems;
  } else if (isEditing && editProductsList.length > 0) {
    activeCartItems = {};
    editProductsList.forEach(p => {
      if (p.id && p.quantity > 0) activeCartItems[p.id] = p.quantity;
    });
  }

  return Object.entries(activeCartItems)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const sid = String(productId);

      // Priority 1: Use product from editProductsList (preserves original Tamil name)
      const editP = editProductsMap.get(sid);
      if (editP && editP.name) {
        const packGet = editP.packGet || 1;
        const kgs = qty * packGet;
        return {
          id: productId,
          name: editP.name, // Original Tamil name
          shortName: editP.shortName || editP.name,
          quantity: qty,
          kgs: kgs,
          price: editP.price || 0,
          packGet: packGet,
          amount: (editP.price || 0) * kgs,
          Print_Name: editP.name,
          hsn: editP.hsn || "",
          taxRate: editP.taxRate || 0,
          unitId: editP.unitId,
          unitName: editP.unitName,
          unit: editP.unit,
          image: editP.image || "",
        };
      }

      // Priority 2: Use from products state
      const product = products.find(p => String(p.id) === sid);
      if (product && product.name) {
        const packGet = parseFloat(product.packGet) || 1;
        const price = parseFloat(product.price) || 0;
        const kgs = qty * packGet;
        return {
          id: productId,
          name: product.name,
          shortName: product.shortName || product.name,
          quantity: qty,
          kgs: kgs,
          price: price,
          packGet: packGet,
          amount: price * kgs,
          Print_Name: product.name,
          hsn: product.hsnCode || product.hsn || "",
          taxRate: 0,
          unitId: product.unitId,
          unitName: product.unitName,
          unit: product.unit,
          image: product.image || "",
        };
      }

      // Fallback
      return {
        id: productId,
        name: `Product ${productId}`,
        quantity: qty,
        kgs: qty,
        price: 0,
        packGet: 1,
        amount: 0,
        Print_Name: `Product ${productId}`,
        hsn: "", 
        taxRate: 0,
      };
    });
}, [cartItems, products]);




useEffect(() => {


  Object.keys(cartItems).forEach(id => {
    const inProducts = products.find(p => String(p.id) === String(id));
    const inAllProducts = allProducts.find(p => 
      String(p.Product_Id) === String(id) || String(p.id) === String(id)
    );
   
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


  const handleCustomerSelect = (customerData) => {
   
    setCustomer(String(customerData.customerId || ""));
    setContactNumber(customerData.mobileNo || "");
   
      const displayAddress = customerData.partyMailingAddress || customerData.address || "";

    setSelectedDetails({   ...customerData,
    partyMailingName: customerData.partyMailingName, 
    // address:customerData.Party_Mailing_Address,
    address:displayAddress,
    billName: customerData.billName,});
    if (customerData.address) { setShippingAddress(customerData.shippingAddress); setDeliveryAddress(customerData.deliveryAddress); }
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
        address: displayAddress || "", brokerId: customerData.Broker_Id || "",
      brokerName: customerData.broker || "", transporterId: customerData.Transporter_Id || "",
      transporterName: customerData.transporter || "",
    });
  };


const handleCheckout = async () => {
  if (!isLoggedIn) { 
    toast.error("Please sign in to place an order"); 
    setIsLoginPopupOpen(true); 
    return; 
  }
  
  if (!contactNumber) { 
    toast.error("Please enter contact number"); 
    return; 
  }
  
  if (!customer) { 
    toast.error("Please select a customer"); 
    return; 
  }

  const now = new Date();
  const formattedDateTime = ISOStrings(new Date(), true);  // Returns: "2026-05-22 17:08:00"
  const formattedDateOnly = ISOStrings(new Date(), false); // Returns: "2026-05-22"
  const parseData = JSON.parse(localStorage.getItem('user') || '{}');
  const storage = JSON.parse(localStorage.getItem('user') || '{}');

  const totalBeforeTax = enhancedCartItems.reduce((s, i) => s + i.amount, 0);
  const totalTax = enhancedCartItems.reduce((s, i) => {
    const taxRate = i.taxRate || 12;
    return s + (i.amount * (taxRate / 100));
  }, 0);
  const totalInvoiceValue = totalBeforeTax + totalTax;
  const totalKgsValue = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);

  // IMPORTANT: Get current values from state - these should be the actual selected broker/transporter
  const currentBrokerId = selectedBroker?.id;
  const currentBrokerName = selectedBroker?.name;
  const currentTransporterId = selectedTransporter?.id;
  const currentTransporterName = selectedTransporter?.name;
  
  // Create Staff_Involved_List with proper validation
  const Staff_Involved_List = [];
  
  // Add broker to Staff_Involved_List only if ID is valid (not 0, not null, not undefined)
  let finalBrokerId = null;
  if (currentBrokerId && currentBrokerId !== 0 && currentBrokerId !== "0" && currentBrokerId !== null && currentBrokerId !== "null") {
    const brokerIdNum = typeof currentBrokerId === 'number' ? currentBrokerId : parseInt(currentBrokerId);
    if (!isNaN(brokerIdNum) && brokerIdNum > 0) {
      finalBrokerId = brokerIdNum;
      Staff_Involved_List.push({ 
        Involved_Emp_Id: brokerIdNum, 
        Cost_Center_Type_Id: 3 
      });
    }
  }
  
  // Add transporter to Staff_Involved_List only if ID is valid
  let finalTransporterId = null;
  if (currentTransporterId && currentTransporterId !== 0 && currentTransporterId !== "0" && currentTransporterId !== null && currentTransporterId !== "null") {
    const transporterIdNum = typeof currentTransporterId === 'number' ? currentTransporterId : parseInt(currentTransporterId);
    if (!isNaN(transporterIdNum) && transporterIdNum > 0) {
      finalTransporterId = transporterIdNum;
      Staff_Involved_List.push({ 
        Involved_Emp_Id: transporterIdNum, 
        Cost_Center_Type_Id: 2
      });
    }
  }

  const editOrderId = localStorage.getItem('editOrderId');
  const isEditing = Boolean(editOrderId);
  
  const customerName = selectedDetails?.customerName || 
                       headerSelectedCustomer?.name || 
                       selectedDetails?.billName || 
                       "";

  const generalInfo = {
    So_Date: formattedDateOnly, 
    Retailer_Id: parseInt(customer),
    Sales_Person_Id: storage?.user?.SalesPersonId || 0,
    Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 1,
    VoucherType: 200, 
    GST_Inclusive: 2, 
    IS_IGST: 0,
    CSGT_Total: (totalTax / 2).toFixed(2), 
    SGST_Total: (totalTax / 2).toFixed(2),
    IGST_Total: "0.00", 
    Round_off: "0.00",
    Total_Before_Tax: totalBeforeTax.toFixed(2), 
    Total_Tax: totalTax.toFixed(2),
    Total_Invoice_value: totalInvoiceValue.toFixed(2),
    Narration: description || "", 
    isConverted: 0, 
    Cancel_status: 1,
    Created_by: parseData?.UserId || storage?.user?.UserId || "0",
    Created_on: formattedDateTime, 
    Trans_Type: isEditing ? "UPDATE" : "INSERT", 
    Alter_Id: isEditing ? parseInt(editOrderId) : 0,
    ...(isEditing && { So_Id: parseInt(editOrderId) }),
    Customer_Name: customerName,
    Ord_Mobile_No: contactNumber,
    Broker_Name: currentBrokerName || "", 
    Broker_Id: finalBrokerId,
    Transporter_Name: currentTransporterName || "", 
    Transporter_Id: finalTransporterId,
    Shipp_Address: shippingAddress || selectedDetails?.address || "",
    Deliv_Address: deliveryAddress || shippingAddress || selectedDetails?.address || "",
    Total_Kgs: totalKgsValue.toFixed(2), 
    Total_Items: enhancedCartItems.length,
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
      So_Date: formattedDateOnly, 
      S_No: index + 1, 
      Item_Id: parseInt(item.id),
      Bill_Qty: item.kgs.toFixed(2), 
      Taxable_Rate: item.price.toFixed(2),
      Item_Rate: item.price.toFixed(2), 
      Amount: taxableAmount.toFixed(2), 
      Free_Qty: "0.00",
      Total_Qty: item.quantity.toString(), 
      Taxble: taxAmount.toFixed(2),
      HSN_Code: item.hsn || "", 
      Unit_Id: item.unitId || null, 
      Unit_Name: item.unitName || "",
      Taxable_Amount: taxableAmount.toFixed(2), 
      Tax_Rate: taxRate, 
      Cgst: cgstSgstRate,
      Cgst_Amo: cgstSgstAmount.toFixed(2), 
      Sgst: cgstSgstRate,
      Sgst_Amo: cgstSgstAmount.toFixed(2), 
      Igst: 0, 
      Igst_Amo: "0.00",
      Final_Amo: finalAmount.toFixed(2), 
      Created_on: formattedDateTime,
      Product_Id: parseInt(item.id), 
      Product_Name: item.name,
      Quantity: item.quantity, 
      Price: item.price,
      Total: taxableAmount.toFixed(2), 
      Weight: item.kgs.toString(),
      Unit: item.unit || "", 
      PackGet: item.packGet || 1,
      ...(isEditing && { So_Id: parseInt(editOrderId) }),
    };
  });

  const saleData = {
    generalInfo, 
    stockInfo,
    totalAmount: totalInvoiceValue, 
    totalItems: enhancedCartItems.length,
    totalKgs: totalKgsValue.toFixed(2), 
    customerId: customer,
    customerName: customerName,
    contactNumber, 
    brokerName: currentBrokerName || "",
    transporter: currentTransporterName || "",
    shippingAddress, 
    deliveryAddress, 
    description,
    Created_by: parseData?.UserId || parseData?.user_id || "0",
    Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 1,
  };

  try {
    const loadingToast = toast.loading(isEditing ? "Updating order..." : "Placing order...");
    
    const response = await fetchLink({ 
      address: `sales/salesInvoice/Whatsapp`,
      method: isEditing ? 'PUT' : 'POST', 
      bodyData: saleData 
    });

    toast.dismiss(loadingToast);

    if (response?.success) {
      toast.success(isEditing ? `Order #${editOrderId} updated successfully!` : `Order placed successfully!`);
    
   
      let partyMailingName = selectedDetails?.partyMailingName || selectedDetails?.billName || "";
      let partyMailingAddress = selectedDetails?.partyMailingAddress || selectedDetails?.address || shippingAddress || "";
      
      if (!partyMailingName && headerSelectedCustomer?.partyMailingName) {
        partyMailingName = headerSelectedCustomer.partyMailingName;
      }
      
      if (!partyMailingAddress && headerSelectedCustomer?.partyMailingAddress) {
        partyMailingAddress = headerSelectedCustomer.partyMailingAddress;
      }
      
      if (!partyMailingName) {
        partyMailingName = customerName;
      }
      
      const customerData = {
        Billl_Name: selectedDetails?.billName || customerName,
        Short_Name: headerSelectedCustomer?.name || customerName,
        Party_Location: selectedDetails?.partyMailingAddress || selectedDetails?.address || headerSelectedCustomer?.address || "",
        City: headerSelectedCustomer?.city || selectedDetails?.city || "",
        Mobile_No: contactNumber || headerSelectedCustomer?.mobile || selectedDetails?.mobileNo || "",
        Land_Line: "",
        Transporter: currentTransporterName || "",
        Broker: currentBrokerName || "",
        Party_Mailing_Name: selectedDetails?.billName || selectedDetails?.partyMailingName || headerSelectedCustomer?.billName || customerName,
        Party_Mailing_Address: partyMailingAddress,
        billName: selectedDetails?.billName || "",
      };
      
      const printCartItems = enhancedCartItems.map(item => ({
        ...item,
        Print_Name: item.name || item.Short_Name,
        kgs: item.kgs || 0,
        price: item.price || 0,
        packGet: item.packGet || 1,  
      }));

      const totals = {
        subtotal: subtotalAmount,
        tax: totalTax,
        total: totalInvoiceValue,
        totalItems: enhancedCartItems.length,
        totalKgs: totalKgsValue,
      };
      
      // Set data for print modal
      setLastOrderData({
        saleData,
        responseData: response.data,
        cartSnapshot: [...enhancedCartItems],
        totals: totals,
        customerData: customerData,
        printCartItems: printCartItems,
      });
      
    
      setIsPrintModalOpen(true);
      
     
      const clearAllDataAndRedirect = () => {
     
        const keysToClearOnSuccess = [
          // cart
          'cartItems',
          'cartItemsBackup',
          'previousCartItems',
          'products',
          'productsBackup',
          'productMapping',
          // edit-order specific
          'editOrderId',
          'editOrderData',
          'editProductsList',
          'isEditingOrder',
          'editCustomerOriginalName',
          'editBrokerId',
          'editBrokerName',
          'editTransporterId',
          'editTransporterName',
          // selected customer / cart page persisted state
          'selectedCustomer',
          'selectedCustomerId',
          'selectedCustomerData',
          'cartPageSelectedCustomer',
          'cartPageSelectedCustomerId',
          'cartPageCustomer',
          'cartPageContactNumber',
          'cartPageBroker',
          'cartPageTransporter',
          'cartPageShippingAddress',
          'cartPageDeliveryAddress',
          'cartPageDescription',
        ];

        keysToClearOnSuccess.forEach(key => localStorage.removeItem(key));

        // Reset all state
        setCartItems({});
        setContactNumber("");
        setCustomer("");
        setSelectedDetails(null);
        setBrokerName("");
        setTransporter("");
        setShippingAddress("");
        setDeliveryAddress("");
        setDescription("");
        setSelectedBroker({ id: null, name: "" });
        setSelectedTransporter({ id: null, name: "" });
        setHeaderSelectedCustomer(null);
        setPrefilledCustomer(null);
        
        // Close print modal
        setIsPrintModalOpen(false);
        
        // Remove event listener to prevent multiple redirects
        window.removeEventListener('afterprint', afterPrintHandler);
        
        // ✅ REDIRECT TO HOME PAGE
        window.location.href = "/";
      };

      // Define after print handler
      const afterPrintHandler = () => {
        clearAllDataAndRedirect();
      };

      // Add event listener for after print (fires when user prints or cancels)
      window.addEventListener('afterprint', afterPrintHandler);

      // Store the handler in a ref or variable to clean up if needed
      // This will automatically redirect when print dialog closes
      
      // Optional: Auto-trigger print dialog after 1 second
      setTimeout(() => {
        window.print();
      }, 1000);

      // ================== END OF PRINT HANDLING ==================
      
    } else {
      toast.error(response?.message || `Failed to ${isEditing ? 'update' : 'place'} order`);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error(`Failed to ${isEditing ? 'update' : 'place'} order: ` + (error.message || "Unknown error"));
  }
};


  const handleSaleOrdersClick = () => setShowSaleOrders(true);
  // const handleBackFromSaleOrders = () => setShowSaleOrders(false);



useEffect(() => {
  const savedCustomer = localStorage.getItem('cartPageSelectedCustomer');
  if (savedCustomer && !prefilledCustomer && !location.state?.selectedCustomer) {
    const restoredCustomer = JSON.parse(savedCustomer);
    setHeaderSelectedCustomer(restoredCustomer);
    setPrefilledCustomer({ id: restoredCustomer.id, name: restoredCustomer.name });
    setCustomer(localStorage.getItem('cartPageCustomer') || '');
    setContactNumber(localStorage.getItem('cartPageContactNumber') || '');
    
    const savedBroker = localStorage.getItem('cartPageBroker');
    if (savedBroker) {
      setSelectedBroker(JSON.parse(savedBroker));
    }
    
    const savedTransporter = localStorage.getItem('cartPageTransporter');
    if (savedTransporter) {
      setSelectedTransporter(JSON.parse(savedTransporter));
    }
    
    setShippingAddress(localStorage.getItem('cartPageShippingAddress') || '');
    setDeliveryAddress(localStorage.getItem('cartPageDeliveryAddress') || '');
    setDescription(localStorage.getItem('cartPageDescription') || '');
  }
}, []);



const clearSavedState = () => {
  const keysToRemove = [
    'selectedCustomerId',
    'selectedCustomer',
    'selectedCustomerData',
    'cartPageSelectedCustomer',
    'cartPageSelectedCustomerId',
    'cartPageCustomer',
    'cartPageContactNumber',
    'cartPageBroker',
    'cartPageTransporter',
    'cartPageShippingAddress',
    'cartPageDeliveryAddress',
    'cartPageDescription',
    'cartItemsBackup'
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

const renderThreeDotsMenu = () => (
   <div style={{ position: "relative" }}>
  <button
    onClick={() => setCartHeaderMenuOpen(prev => !prev)}
    style={{
      background: "transparent", border: "none", color: "#fff", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: isMobile ? "8px" : "12px", borderRadius: "50%",
    }}
  >
    <MoreVertIcon style={{ fontSize: isMobile ? "24px" : "32px" }} />
  </button>
  <UserMenuDropdown
    isOpen={cartHeaderMenuOpen}
    onClose={() => setCartHeaderMenuOpen(false)}
    isLoggedIn={isLoggedIn}
    userName={userName}
    onLogout={handleLogout}
    onLoginClick={() => setIsLoginPopupOpen(true)}
    userType={userType}
    onSaleOrders={handleSaleOrdersClick}
    onDashboard={handleDashboard}
  />
</div>
);

//   const renderThreeDotsMenu = () => (
//    <div style={{ position: "relative" }}>
//   <button
//     onClick={() => setDashboardMenuOpen(prev => !prev)}
//     style={{
//       background: "transparent", border: "none", color: "#fff", cursor: "pointer",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: isMobile ? "8px" : "12px", borderRadius: "50%",
//     }}
//   >
//     <MoreVertIcon style={{ fontSize: isMobile ? "24px" : "32px" }} />
//   </button>
//   <UserMenuDropdown
//     isOpen={dashboardMenuOpen}
//     onClose={() => setDashboardMenuOpen(false)}
//     isLoggedIn={isLoggedIn}
//     userName={userName}
//     onLogout={onLogout}
//     onLoginClick={onLoginClick}
//     userType={userType}
//     onSaleOrders={onSaleOrders}
//     onDashboard={() => {}}
//   />
// </div>
//   );
useEffect(() => {
  if (showSaleOrders) {

    if (headerSelectedCustomer) {
      localStorage.setItem('cartPageSelectedCustomer', JSON.stringify(headerSelectedCustomer));
      localStorage.setItem('cartPageSelectedCustomerId', String(headerSelectedCustomer.id));
    }
    if (customer) {
      localStorage.setItem('cartPageCustomer', String(customer));
    }
    if (contactNumber) {
      localStorage.setItem('cartPageContactNumber', contactNumber);
    }
    if (selectedBroker?.id) {
      localStorage.setItem('cartPageBroker', JSON.stringify(selectedBroker));
    }
    if (selectedTransporter?.id) {
      localStorage.setItem('cartPageTransporter', JSON.stringify(selectedTransporter));
    }
    if (shippingAddress) {
      localStorage.setItem('cartPageShippingAddress', shippingAddress);
    }
    if (deliveryAddress) {
      localStorage.setItem('cartPageDeliveryAddress', deliveryAddress);
    }
    if (description) {
      localStorage.setItem('cartPageDescription', description);
    }
    
    localStorage.setItem('cartItemsBackup', JSON.stringify(cartItems));
  }
}, [showSaleOrders]);


useEffect(() => {

  if (showSaleOrders) { /* save state to localStorage */ }
}, [showSaleOrders]);

useEffect(() => {
  const restoreCustomerFromId = async () => {

    const savedCustomerId = localStorage.getItem('selectedCustomerId');
    const cartPageCustomerId = localStorage.getItem('cartPageCustomer');
    const cartPageSelectedCustomerId = localStorage.getItem('cartPageSelectedCustomerId');
    
    
    const customerIdToUse = savedCustomerId || cartPageCustomerId || cartPageSelectedCustomerId;
    

    if (customerIdToUse && (!headerSelectedCustomer || headerSelectedCustomer.id !== customerIdToUse)) {
      try {
        const response = await fetchLink({ 
          address: `pos/retailerMasterOptRetailerId?Customer_Id=${customerIdToUse}&limit=10000000&page=1` 
        });
        
        if (response?.success && Array.isArray(response.data)) {
          const found = response.data.find(
            c => String(c.Customer_Id) === String(customerIdToUse)
          );
          
          if (found) {
            const completeCustomer = {
              id: String(found.Customer_Id),
              name: (found.Short_Name || found.Billl_Name || "").replace(/\u0004/g, "").trim(),
              billName: (found.Billl_Name || "").trim(),
              mobile: (found.Mobile_No || "").trim(),
              address: (found.Address || "").trim(),
              city: (found.City || "").trim(),
              brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : "",
              brokerName: (found.Broker_Name || found.Broker || "").trim(),
              transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : "",
              transporterName: (found.Transporter_Name || found.Transporter || "").trim(),
            };
            
   
            setHeaderSelectedCustomer(completeCustomer);
            setPrefilledCustomer({ id: completeCustomer.id, name: completeCustomer.name });
            setCustomer(String(completeCustomer.id));
            setContactNumber(completeCustomer.mobile || "");
            
            if (completeCustomer.address) {
              setShippingAddress(completeCustomer.address);
              setDeliveryAddress(completeCustomer.address);
            }
            
            if (completeCustomer.brokerId && completeCustomer.brokerName) {
              setSelectedBroker({ id: completeCustomer.brokerId, name: completeCustomer.brokerName });
              setBrokerName(completeCustomer.brokerName);
            }
            
            if (completeCustomer.transporterId && completeCustomer.transporterName) {
              setSelectedTransporter({ id: completeCustomer.transporterId, name: completeCustomer.transporterName });
              setTransporter(completeCustomer.transporterName);
            }
            
            setSelectedDetails({
              customerId: String(completeCustomer.id),
              customerName: completeCustomer.name,
              mobileNo: completeCustomer.mobile || "",
              address: completeCustomer.address || "",
              city: completeCustomer.city || "",
              broker: completeCustomer.brokerName || "",
              Broker_Id: completeCustomer.brokerId || "",
              transporter: completeCustomer.transporterName || "",
              Transporter_Id: completeCustomer.transporterId || "",
            });
            
           
            localStorage.setItem("selectedCustomer", JSON.stringify(completeCustomer));
            localStorage.setItem("selectedCustomerId", String(completeCustomer.id));
            localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(completeCustomer));
            localStorage.setItem("cartPageSelectedCustomerId", String(completeCustomer.id));
            localStorage.setItem("cartPageCustomer", String(completeCustomer.id));
            
          
          }
        }
      } catch (error) {
        console.error("Error restoring customer from ID:", error);
      }
    }
  };
  
  restoreCustomerFromId();
}, []); 


if (showSaleOrders) {
  return <SaleOrders onBack={handleBackFromSaleOrders} onEditOrder={(editData) => {
    localStorage.setItem('editOrderData', JSON.stringify(editData));
    localStorage.setItem('isEditingOrder', 'true');
    
    if (editData.customerDetails) {

      const customerData = editData.customerDetails;
      localStorage.setItem('selectedCustomer', JSON.stringify(customerData));
      localStorage.setItem('selectedCustomerId', String(customerData.id));
      localStorage.setItem('cartPageSelectedCustomer', JSON.stringify(customerData));
      localStorage.setItem('cartPageSelectedCustomerId', String(customerData.id));
      localStorage.setItem('cartPageCustomer', String(customerData.id));
    }
    
    setShowSaleOrders(false);

    setTimeout(() => {
      const isEditing = localStorage.getItem('isEditingOrder');
      const storedEditData = localStorage.getItem('editOrderData');
      
      if (isEditing === 'true' && storedEditData) {

        localStorage.removeItem('isEditingOrder');
        localStorage.removeItem('editOrderData');
        
        const orderToEdit = JSON.parse(storedEditData);
        
      
        if (orderToEdit.cartItems && Object.keys(orderToEdit.cartItems).length > 0) {
          setCartItems(orderToEdit.cartItems);
          localStorage.setItem('cartItems', JSON.stringify(orderToEdit.cartItems));
        }
        
        if (orderToEdit.customerId) {
          setCustomer(String(orderToEdit.customerId));
          setContactNumber(orderToEdit.contactNumber || "");
          setBrokerName(orderToEdit.brokerName || "");
          setTransporter(orderToEdit.transporterName || "");
          setShippingAddress(orderToEdit.shippingAddress || "");
          setDeliveryAddress(orderToEdit.deliveryAddress || "");
          setDescription(orderToEdit.description || "");
          
          if (orderToEdit.brokerId && orderToEdit.brokerName) {
            setSelectedBroker({ id: orderToEdit.brokerId, name: orderToEdit.brokerName });
          }
          
          if (orderToEdit.transporterId && orderToEdit.transporterName) {
            setSelectedTransporter({ id: orderToEdit.transporterId, name: orderToEdit.transporterName });
          }
          
          if (orderToEdit.customerDetails) {
            setHeaderSelectedCustomer(orderToEdit.customerDetails);
            setPrefilledCustomer({ 
              id: orderToEdit.customerDetails.id, 
              name: orderToEdit.customerDetails.name 
            });
            
            setSelectedDetails({
              customerId: String(orderToEdit.customerDetails.id),
              customerName: orderToEdit.customerDetails.name,
              mobileNo: orderToEdit.customerDetails.mobile || "",
              address: orderToEdit.customerDetails.address || "",
              city: orderToEdit.customerDetails.city || "",
              broker: orderToEdit.brokerName || "",
              Broker_Id: orderToEdit.brokerId || "",
              transporter: orderToEdit.transporterName || "",
              Transporter_Id: orderToEdit.transporterId || "",
            });
          }
          
          toast.success(`Order #${orderToEdit.orderNumber} loaded for editing`);
        }
      }
    }, 200);
  }} />;
}


if (showDashboard) {
  return (
    <Dashboard
      isMobile={isMobile}
      isLoggedIn={isLoggedIn}
      userName={userName}
      customers={customers}
      allProducts={allProducts}
      onLoginClick={() => setIsLoginPopupOpen(true)}
      onLogout={handleLogout}
      onHome={handleBackFromDashboard}
      onSaleOrders={() => { setShowDashboard(false); setShowSaleOrders(true); }}
      activeTab="dashboard"
    />
  );
}

const commonHeaderCustomerProps = {
  showCustomerSelector: isLoggedIn && customers.length > 0,
  customers: customers,
  selectedCustomer: headerSelectedCustomer,
  onCustomerSelect: handleHeaderCustomerSelect,
  loadingCustomers: loadingCustomers,
  userType: userType,
};

 const CartItemRow = ({ item }) => {
  
  const fullProduct = useMemo(() => {
  
    let found = products.find(p => p.id === item.id);
    

    if (!found && allProducts.length > 0) {
      found = allProducts.find(p => 
        String(p.id) === String(item.id) || 
        String(p.Product_Id) === String(item.id) ||
        p.id === item.id
      );
    }
    
   
    if (!found) {
      return {
        ...item,
        price: item.price || 0,
        name: item.name || "Unknown Product",
        packGet: item.packGet || 1,
        image: item.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop"
      };
    }
    
    return found;
  }, [item, products, allProducts]);
  
  const packGet = fullProduct.packGet || getProductPackGet(item.id) || 1;
  const kgs = item.quantity * packGet;
  const amount = (fullProduct.price || 0) * item.quantity * packGet;
  
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: isMobile ? "10px 0" : "12px 0", borderBottom: "1px dashed #ddd",
    }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1 }}>
        <img
          src={fullProduct.image} alt={fullProduct.name}
          style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop"; }}
        />
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: BROWN, margin: "0 0 2px 0" }}>
            {fullProduct.name?.length > 20 ? fullProduct.name.substring(0, 20) + '...' : fullProduct.name}
          </h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: "#f0e9e2", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", color: BROWN }}>
              ₹{(fullProduct.price || 0).toFixed(2)}/kg
            </span>
            <span style={{ fontSize: "11px", color: "#666" }}>Pack: {packGet}kg</span>
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
            <span style={{ fontSize: "14px", fontWeight: "600", color: BROWN, minWidth: "60px", display: "block" }}>₹{amount.toFixed(2)}</span>
            <span style={{ fontSize: "10px", color: "#999", display: "block" }}>({item.quantity} × {packGet}kg)</span>
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
};


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


  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: BG_COLOR }}>
        <div style={{ color: BROWN, fontSize: "18px" }}>Loading cart...</div>
      </div>
    );
  }


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


   <div style={{ padding: "20px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "264px" }}>
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

       <div style={{ 
  display: "flex", 
  flexDirection: "column", 
  gap: "12px", 
  marginTop: "24px",
  paddingBottom: "80px" // 👈 adjust to match your footer's height + a little buffer
}}>
  <button
    onClick={handleCheckout}
    style={{ 
      width: "100%", padding: "18px 12px", 
      background: localStorage.getItem('editOrderId') ? ACCENT : BROWN, 
      color: localStorage.getItem('editOrderId') ? BROWN_DARK : "#fff", 
      border: "none", borderRadius: "50px", 
      fontSize: "18px", fontWeight: "700", cursor: "pointer", 
      boxShadow: "0 4px 12px rgba(74,44,26,0.2)" 
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = localStorage.getItem('editOrderId') ? "#b8986a" : BROWN_DARK}
    onMouseLeave={(e) => e.currentTarget.style.background = localStorage.getItem('editOrderId') ? ACCENT : BROWN}
  >
    {localStorage.getItem('editOrderId') ? 'Update Order' : 'Order Now'}
  </button>

  {localStorage.getItem('editOrderId') && (
    <button
      onClick={handleCancelEdit}
      style={{ 
        width: "100%", padding: "14px", 
        background: "#e74c3c", 
        color: "#fff", 
        border: "none", borderRadius: "50px", 
        fontSize: "16px", fontWeight: "600", cursor: "pointer",
        boxShadow: "0 4px 12px rgba(231,76,60,0.2)"
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#c0392b"}
      onMouseLeave={(e) => e.currentTarget.style.background = "#e74c3c"}
    >
      Cancel Edit
    </button>
  )}
</div>

 <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
       <MobileTabBar activeTab="home" onSaleOrders={handleSaleOrdersClick} onDashboard={handleDashboard} cartCount={totalItems} />
      </>
    );
  }



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

       <div style={{ padding: "12px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "194px" }}>
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
    <div style={{ display: "flex", gap: "12px" }}>
      <button onClick={() => setStep(2)} style={{ flex: 1, padding: "14px", background: BROWN_DARK, color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        Proceed <span>→</span>
      </button>
      {localStorage.getItem('editOrderId') && (
        <button onClick={handleCancelEdit} style={{ padding: "14px 20px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "25px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
          Cancel
        </button>
      )}
    </div>
  </div>
)}

        <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }


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
<PrintPreviewModal 
  open={isPrintModalOpen}
  onClose={() => setIsPrintModalOpen(false)}
  customer={lastOrderData?.customerData}
  cartItems={lastOrderData?.printCartItems}
  totals={lastOrderData?.totals}
  onPrintAndSave={async () => {
  
    return true;
  }}
  storage={JSON.parse(localStorage.getItem('user') || '{}')}
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
    
    <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "24px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
  <h2 style={{ fontSize: "22px", fontWeight: "700", color: BROWN, margin: "0 0 20px 0", paddingBottom: "14px", borderBottom: `3px solid ${ACCENT}` }}>
    Order Summary
  </h2>
  {enhancedCartItems.map(item => <CartItemRow key={item.id} item={item} />)}



<div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", gap: "12px", marginTop: "24px" }}>
    <button
      onClick={handleCheckout}
      style={{ flex: 2, padding: "18px", background: localStorage.getItem('editOrderId') ? ACCENT : BROWN, color: localStorage.getItem('editOrderId') ? BROWN_DARK : "#fff", border: "none", borderRadius: "50px", fontSize: "18px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(74,44,26,0.2)" }}
      onMouseEnter={(e) => e.currentTarget.style.background = localStorage.getItem('editOrderId') ? "#b8986a" : BROWN_DARK}
      onMouseLeave={(e) => e.currentTarget.style.background = localStorage.getItem('editOrderId') ? ACCENT : BROWN}
    >
      {localStorage.getItem('editOrderId') ? 'Update Order' : 'Order Now'}
    </button>
    {localStorage.getItem('editOrderId') && (
      <button
        onClick={handleCancelEdit}
        style={{
          flex: 1, padding: "14px",
          background: "#e74c3c",
          color: "#fff",
          border: "none", borderRadius: "50px",
          fontSize: "16px", fontWeight: "600", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(231,76,60,0.2)",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#c0392b"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#e74c3c"}
      >
        Cancel Edit
      </button>
    )}
  </div>
</div>

       
            <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "32px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: BROWN, margin: "0 0 24px 0", paddingBottom: "14px", borderBottom: `3px solid ${ACCENT}` }}>
                Order Details
{creditInfo && (
  <div style={{
    marginBottom: "16px",
    padding: "10px 12px",
    background: "#fff3f3",
    border: "1px solid #e0b8b8",
    borderRadius: "8px",
    display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "100px",
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
 
const QuotationPrint = forwardRef(({ customer, cartItems, totals, storage, createdOn, orderDate }, ref) => {
  
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const rupee = (n) =>
    safeNum(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalKgs = cartItems?.length
    ? cartItems.reduce((sum, item) => sum + safeNum(item.kgs), 0)
    : 0;
  
  const totalBags = cartItems?.length
    ? cartItems.reduce((sum, item) => {
        const packWeight = parseFloat(item.Print_Name?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
        return sum + (packWeight ? safeNum(item.kgs) / packWeight : 0);
      }, 0)
    : 0;

  const formatCreatedDate = () => {
    // First try to use createdOn from the order
    let dateToUse = createdOn || orderDate;
    
    if (dateToUse) {
      try {
        let dateObj;
        
        // Handle different date formats
        if (typeof dateToUse === 'string') {
          // Check if it's in "YYYY-MM-DD HH:MM:SS" format
          if (dateToUse.includes(' ') && dateToUse.includes('-')) {
            const [datePart, timePart] = dateToUse.split(' ');
            const [year, month, day] = datePart.split('-');
            
            if (timePart) {
              const [hours, minutes] = timePart.split(':');
              // Create date object with these parts
              dateObj = new Date(year, parseInt(month) - 1, day, parseInt(hours), parseInt(minutes));
            } else {
              dateObj = new Date(year, parseInt(month) - 1, day);
            }
          } 
          // Check if it's ISO format with T
          else if (dateToUse.includes('T')) {
            dateObj = new Date(dateToUse);
          }
          // Try parsing as regular date string
          else {
            dateObj = new Date(dateToUse);
          }
          
          // Check if date is valid
          if (!isNaN(dateObj.getTime())) {
            // Format to DD/MM/YYYY HH:MM AM/PM
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
    return formatCreatedDate().split(' ')[0]; // Return just the date part
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: 80mm auto;
              margin: 0mm;
            }
            body * {
              visibility: hidden;
            }
            #print-section, #print-section * {
              visibility: visible;
            }
            #print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm;
              margin: 0;
              padding: 2mm;
            }
            .print-container {
              width: 80mm !important;
              margin: 0 auto !important;
            }
            table {
              width: 100% !important;
              page-break-inside: avoid;
            }
            tr, td, th {
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      <div 
        id="print-section"
        ref={ref}
        className="print-container"
        style={{
          width: "80mm",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "14px",
          padding: "2mm",
          lineHeight: 1.4,
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ marginBottom: "2mm", whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 1000, fontSize: "14px" }}>
            {formatCreatedDate()}
          </span>
          <span style={{ fontWeight: 1000, fontSize: "14px", marginLeft: "8px" }}>TAKEN:</span>
          <span style={{ fontSize: "14px", fontWeight: 1000 }}>
            {storage?.Created_BY_Name || storage?.Name || storage?.username || "—"}
          </span>
        </div>
        
        <div
          style={{
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            padding: "1mm 0",
            marginBottom: "2mm",
          }}
        >
          <div style={{ 
            fontWeight: 900, 
            marginBottom: "2px",
            fontSize: "14px", 
            display: "flex", 
            alignItems: "flex-start",
            wordBreak: "break-word"
          }}>
            <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>PARTY NAME : </span>
            <span style={{ flex: 1, wordBreak: "break-word" }}>
              {customer?.Party_Mailing_Name || customer?.billName || customer?.Billl_Name || "—"}
            </span>
          </div>

          <div style={{ 
            fontWeight: 800, 
            marginBottom: "2px", 
            display: "flex", 
            alignItems: "flex-start",
            wordBreak: "break-word"
          }}>
            <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>LOCATION  : </span>
            <span style={{ flex: 1, wordBreak: "break-word" }}>
              {customer?.Party_Location || "—"}
            </span>
          </div>

          <div style={{ 
            fontWeight: 800, 
            marginBottom: "2px", 
            display: "flex", 
            alignItems: "flex-start"
          }}>
            <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>PH.NO     : </span>
            <span style={{ flex: 1 }}>
              {customer?.Mobile_No || customer?.Land_Line || "—"}
            </span>
          </div>

          <div style={{ 
            fontWeight: 800, 
            marginBottom: "2px", 
            display: "flex", 
            alignItems: "flex-start",
            wordBreak: "break-word"
          }}>
            <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>TRANSPORT : </span>
            <span style={{ flex: 1 }}>
              {customer?.Transporter || "—"}
            </span>
          </div>

          <div style={{ 
            fontWeight: 800, 
            display: "flex", 
            alignItems: "flex-start",
            wordBreak: "break-word"
          }}>
            <span style={{ minWidth: "13ch", whiteSpace: "pre" }}>BROKER    : </span>
            <span style={{ flex: 1 }}>
              {customer?.Broker || "—"}
            </span>
          </div>
        </div>

        <div style={{ border: "0.5px solid #000" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "0.5mm",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 900,
                    background: "#f5f5f5",
                    width: "25mm"
                  }}
                >
                  RATE
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "0.5mm",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 900,
                    background: "#f5f5f5",
                    width: "45mm"
                  }}
                >
                  ITEM NAME
                </th>
                <th
                  style={{
                    border: "0.5px solid #000",
                    padding: "0.5mm",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 900,
                    background: "#f5f5f5",
                    width: "10mm"
                  }}
                >
                  BAGS
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item, i) => {
                  const packWeight =
                    parseFloat(
                      item.Print_Name?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]
                    ) || 0;
                  const bags =
                    packWeight > 0 ? safeNum(item.kgs) / packWeight : 0;
                 
                  return (
                    <tr key={i} style={{ minHeight: "8mm" }}>
                      <td
                        style={{
                          border: "0.5px solid #000",
                          padding: "2mm 1mm",
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontSize: "14px",
                          fontWeight: 500
                        }}
                      >
                        ₹{rupee(item.price)}
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #000",
                          textAlign: "left",
                          paddingLeft: "1.5mm",
                          paddingRight: "1.5mm",
                          verticalAlign: "middle",
                          fontSize: "12px",
                          fontWeight: 500,
                          wordBreak: "break-word"
                        }}
                      >
                        {item.shortName || item.Print_Name || item.name || "—"}
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #000",
                          textAlign: "center",
                          padding: "0.3mm",
                          verticalAlign: "middle",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        {bags > 0 ? bags.toFixed(0) : "0"}
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

          <div
            style={{
              background: "#f0f0f0",
              borderTop: "1px solid #000",
              padding: "1mm",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            <span>₹{rupee(totals?.subtotal)}</span>
            <span>{totalKgs.toFixed(2)} KGS</span>
            <span>{totalBags.toFixed(0)} BAGS</span>
          </div>
        </div>
      </div>
    </>
  );
});

QuotationPrint.displayName = "QuotationPrint";


function MobileTabBar({ activeTab, onSaleOrders, cartCount, onDashboard }) {
  const navigate = useNavigate();

  const tabs = [
    { key: "home", label: "Home", icon: "🏠", onClick: () => navigate('/') },
    { key: "dashboard", label: "Dashboard", icon: "📊", onClick: onDashboard },
    { key: "saleOrders", label: "Sale Orders", icon: "📋", onClick: onSaleOrders },
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
            onClick={() => {
              // Clear any pending edit state when navigating to home
              if (tab.key === 'home') {
                localStorage.removeItem('isEditingOrder');
                localStorage.removeItem('editOrderData');
                localStorage.removeItem('editOrderId');
              }
              tab.onClick();
            }}
            style={{
              flex: 1, background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              padding: "4px 0", position: "relative",
            }}
          >
            <span style={{ fontSize: "20px", position: "relative" }}>
              {tab.icon}
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


const PrintPreviewModal = ({ open, onClose, customer, cartItems, totals, onPrintAndSave, storage, isReprint = false, createdOn, orderDate }) => {
  const printRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);

  const handleReactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QuotationBill",
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .print-content {
          margin: 0;
          padding: 0;
        }
      }
    `,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast.success("Print completed successfully");
    },
    onPrintError: (error) => {
      setIsPrinting(false);
      console.error("Print Error:", error);
      toast.error("Print failed");
    },
  });

  const handlePrintAndSaveWrapper = async () => {
    setIsPrinting(true);
    try {
      if (isReprint) {
        handleReactPrint();
        return;
      }

      const saveResult = await onPrintAndSave();
      if (saveResult) {
        handleReactPrint();
      } else {
        setIsPrinting(false);
      }
    } catch (error) {
      console.error('Error in print operation:', error);
      toast.error('Error processing order');
      setIsPrinting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' || !isPrinting) {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          margin: '10px',
          width: 'calc(100% - 20px)',
          maxWidth: '500px',
        }
      }}
    >
      <DialogTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
        {isReprint ? 'Reprint Quotation' : 'Print Preview - Quotation'}
      </DialogTitle>

      <DialogContent 
        style={{ 
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          backgroundColor: '#f5f5f5'
        }}
      >
        <div style={{ 
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'inline-block'
        }}>
          <QuotationPrint
            ref={printRef}
            customer={customer}
            cartItems={cartItems}
            totals={totals}
            storage={storage}
             createdOn={createdOn} // Pass this
            orderDate={orderDate} // Pass this
          />
        </div>
      </DialogContent>
      <DialogActions style={{ padding: '16px' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isPrinting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePrintAndSaveWrapper}
          disabled={isPrinting}
          style={{ fontWeight: "bold", backgroundColor: BROWN_DARK }}
        >
          {isPrinting ? 'Processing...' : (isReprint ? 'Print' : 'Print & Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.UserId || userData.user_id || userData.User_Id || '';
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

  const statCards = [
    { label: "Today's Orders", value: loading ? "—" : todaysOrders, icon: "📦", iconBg: "#f0e9e2" },
    { label: "Total Customers", value: totalCustomers || "—", icon: "🏪", iconBg: "#e8f0e2" },
    { label: "Kgs Sold Today", value: loading ? "—" : `${todaysKgs.toFixed(0)} kg`, icon: "⚖️", iconBg: "#f0e6d8" },
    { label: "Categories", value: stockGroupsCount || "—", icon: "🗂️", iconBg: "#ece2f0" },
  ];

  const footerTabs = [
    { key: "home", label: "Home", icon: "🏠", onClick: onHome },
    { key: "dashboard", label: "Dashboard", icon: "📊", onClick: () => {} },
    { key: "saleOrders", label: "Sale Orders", icon: "📋", onClick: onSaleOrders },
  ];

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#f5f0eb",
      minHeight: "100vh",
      paddingBottom: isMobile ? "76px" : "40px",
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

        {/* Stat grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: isMobile ? "12px" : "16px",
        }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "20px",
                border: "1px solid #e8ddd4",
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
              <div style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: "bold", color: BROWN_DARK }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "8px" }}>
                Updated {todayLabel}
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
  );
}