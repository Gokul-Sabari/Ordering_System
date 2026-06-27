// PendingBillDetails.js
import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetchLink } from "./fetchComponent";
import { toast } from 'react-toastify';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";

function PendingBillDetails({ onBack, isMobile = true, isModal = false }) {
  const [loading, setLoading] = useState(true);
  const [pendingBills, setPendingBills] = useState([]);
  const [totalPending, setTotalPending] = useState(0);

  
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [toDate, setToDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [fetchingAccountId, setFetchingAccountId] = useState(false);

  const isFirstLoad = useRef(true);
  const userType = localStorage.getItem('userType');
  const isEmployee = userType === 'employee';


  useEffect(() => {
    if (userDropdownOpen && users.length === 0) {
      fetchUsers();
    }
  }, [userDropdownOpen]);

  
  useEffect(() => {
    if (selectedUser && selectedUser.customerId && !selectedUser.accountId) {
      fetchUserAccountId(selectedUser.customerId);
    }
  }, [selectedUser?.customerId]);


  useEffect(() => {
    if (selectedUser && selectedUser.accountId) {
      fetchPendingBills(selectedUser.accountId);
    }
  }, [selectedUser?.accountId, fromDate, toDate]);


useEffect(() => {
  if (!isEmployee && isFirstLoad.current) {
    isFirstLoad.current = false;
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const customerId = userData.Ret_Id || userData.Customer_Id || userData.id;
    if (customerId) {
      setSelectedUser({ id: customerId, customerId: customerId });
    }
  }
}, [isEmployee]);
  const fetchUserAccountId = async (customerId) => {
    if (!customerId || fetchingAccountId) return;
    setFetchingAccountId(true);
    setLoading(true);
    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOptRetailerId?Customer_Id=${customerId}&limit=100000&page=1`,
        method: 'GET'
      });
      
      if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
        const user = response.data[0];
        const accountId = user.AC_Id || user.Account_Id;
        const name = user.Ledger_Name || user.Billl_Name || user.Short_Name || "Unknown";
        const location = user.Address || user.City || "";
        
        if (accountId) {
          setAccountName(`${name}${location ? ` / ${location}` : ''}`);
          setSelectedUser(prev => ({
            ...prev,
            accountId: accountId,
            name: name,
            ledgerName: user.Ledger_Name,
            location: location,
            city: user.City || "",
            mobile: user.Mobile_No || "",
          }));
        } else {
          toast.error("Account ID not found for this customer");
          setLoading(false);
        }
      } else {
        toast.error("Customer not found");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching customer account ID:", error);
      toast.error("Failed to load customer account details");
      setLoading(false);
    } finally {
      setFetchingAccountId(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const loginUser = JSON.parse(localStorage.getItem("user") || "{}");
      const isAdminUser = loginUser?.UserTypeId === "0" || loginUser?.UserType === "DEVELOPER";

      if (isAdminUser) {
        const response = await fetchLink({
          address: `pos/retailerMasterOptRetailerId?limit=100000&page=1`,
          method: "GET",
        });

        if (response?.success && Array.isArray(response.data)) {
          const userList = response.data.map((user) => ({
            id: user.Customer_Id || user.Ret_Id,
            customerId: user.Customer_Id || user.Ret_Id,
            name: user.Ledger_Name || user.Billl_Name || "Unknown",
            ledgerName: user.Ledger_Name,
            billName: user.Billl_Name,
            location: user.Address || user.City || "",
            city: user.City || "",
            mobile: user.Mobile_No || "",
          }));
          setUsers(userList);
        }
      } else {
        const localData = JSON.parse(localStorage.getItem("user") || "{}");
        const retailerArray = Array.isArray(localData) ? localData : Object.values(localData);
        const userList = retailerArray.map((user) => ({
          id: user.Ret_Id,
          customerId: user.Ret_Id,
          name: user.Ledger_Name || "",
          ledgerName: user.Ledger_Name || "",
          billName: user.Party_Mailing_Name || "",
          location: user.Party_Location || "",
          city: user.Party_District || "",
          mobile: user.Party_Mobile_1 || "",
        }));
        setUsers(userList);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSelect = React.useCallback((user) => {
    setSelectedUser({
      ...user,
      accountId: null
    });
    setAccountName("");
    setUserDropdownOpen(false);
    setUserSearch("");
  }, []);

  const fetchPendingBills = async (accountId) => {
    if (!accountId) return;
    setLoading(true);
    try {
      const fromDateStr = fromDate.toISOString().split('T')[0];
      const toDateStr = toDate.toISOString().split('T')[0];

      const response = await fetchLink({
        address: `journal/accountPendingReference?Acc_Id=${accountId}&Fromdate=${fromDateStr}&Todate=${toDateStr}`,
        method: "GET",
      });

      if (response?.success) {
        const data = response.data || [];
        setPendingBills(Array.isArray(data) ? data : []);

        const total = data.reduce(
          (sum, item) => sum + Number(item.Pending || item.Pending_Amt || 0),
          0
        );
        setTotalPending(total);
      } else {
        toast.error(response?.message || "Failed to fetch pending bills");
        setPendingBills([]);
        setTotalPending(0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending bills");
      setPendingBills([]);
      setTotalPending(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) {
      return users.slice(0, 100);
    }
    const search = userSearch.toLowerCase().trim();
    return users
      .filter(user =>
        (user.name || '').toLowerCase().includes(search) ||
        (user.ledgerName || '').toLowerCase().includes(search) ||
        (user.billName || '').toLowerCase().includes(search) ||
        (user.location || '').toLowerCase().includes(search) ||
        (user.mobile || '').toLowerCase().includes(search) ||
        (user.city || '').toLowerCase().includes(search)
      )
      .slice(0, 100);
  }, [users, userSearch]);

  const formatDateRange = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return date;
    }
  };

  const formatAmount = (amt) => {
    return Number(amt || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
  const loginUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdminUser =
    loginUser?.UserTypeId === "0" ||
    loginUser?.UserType === "DEVELOPER";

  if (!isAdminUser) {
    fetchUsers();
  }
}, []);


useEffect(() => {
  if (users.length > 0 && !selectedUser) {
    const loginUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const customerId =
      loginUser.Customer_Id ||
      loginUser.Ret_Id;

    const matchedUser = users.find(
      u => String(u.customerId) === String(customerId)
    );

    if (matchedUser) {
      handleUserSelect(matchedUser);
    } else {
      handleUserSelect(users[0]);
    }
  }
}, [users]);

  const getUserDisplayName = () => {
    if (!selectedUser) return "Select User";
    return selectedUser.ledgerName || selectedUser.name || "User";
  };

  const getUserLocation = () => {
    if (!selectedUser) return "";
    return selectedUser.location || selectedUser.city || "";
  };

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: isModal ? "transparent" : "#f5f0eb",
      minHeight: isModal ? "auto" : "100vh",
      paddingBottom: isModal ? "0" : isMobile ? "20px" : "40px",
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "16px 20px" : "20px 24px",
        backgroundColor: BROWN_DARK,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        position: isModal ? "relative" : "sticky",
        top: isModal ? "auto" : 0,
        zIndex: isModal ? "auto" : 100,
        flexWrap: isMobile ? "wrap" : "nowrap",
        borderBottom: isModal ? `1px solid ${ACCENT}` : "none",
        borderTopLeftRadius: isModal ? "16px" : "0",
        borderTopRightRadius: isModal ? "16px" : "0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isMobile && !isModal && (
            <button
              onClick={onBack}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon style={{ fontSize: isMobile ? "20px" : "24px" }} />
            </button>
          )}
          <div>
            <div style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "bold" }}>
              Pending Bills
            </div>
            {!isModal && (
              <div style={{ fontSize: isMobile ? "11px" : "12px", opacity: 0.8 }}>
                {accountName || (selectedUser ? `${getUserDisplayName()}${getUserLocation() ? ` / ${getUserLocation()}` : ''}` : "Select an account")}
              </div>
            )}
          </div>
        </div>

  <div style={{
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "12px",
    flexWrap: isMobile && !isModal ? "wrap" : "nowrap",
    width: isMobile && !isModal ? "100%" : isModal ? "auto" : "100%",
    maxWidth: isModal ? "600px" : "auto",
  }}>
    {/* User Dropdown - Only for Employees */}

 <div
  style={{
    position: "relative",
    minWidth: isMobile ? "100%" : "220px",
    width: isMobile ? "100%" : "auto",
    flex: isMobile ? "0 0 100%" : "0 0 auto",
  }}
>
              <div
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  padding: isMobile ? "8px 12px" : "8px 14px",
                  background: "rgba(255,255,255,0.15)",
                  border: `1px solid ${userDropdownOpen ? ACCENT : "rgba(255,255,255,0.3)"}`,
                  borderRadius: "20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: isMobile ? "12px" : "13px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedUser ? getUserDisplayName() : "Select User"}
                </span>
                <span style={{ fontSize: "10px", marginLeft: "8px", flexShrink: 0 }}>▼</span>
              </div>

              {userDropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  zIndex: 2000,
                  maxHeight: "320px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  width: isModal ? "300px" : "100%",
                  minWidth: isModal ? "300px" : "auto",
                }}>
                  <div style={{
                    padding: "12px",
                    borderBottom: "1px solid #f0f0f0",
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: `1px solid ${ACCENT}`,
                      borderRadius: "8px",
                      padding: "4px 8px",
                      background: "#fff",
                    }}>
                      <SearchIcon style={{ fontSize: "18px", color: "#999" }} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        autoFocus
                        style={{
                          flex: 1,
                          border: "none",
                          padding: "8px 4px",
                          fontSize: "14px",
                          outline: "none",
                           color: "#000",         
                           caretColor: "#000", 
                          background: "transparent",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {userSearch && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setUserSearch(""); }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#000",
                            fontSize: "16px",
                            padding: "4px",
                          }}
                        >✕</button>
                      )}
                    </div>
                  </div>

                  {loadingUsers ? (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      <CircularProgress size={24} style={{ color: BROWN }} />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                      No users found
                    </div>
                  ) : (
                    <div style={{
                      overflowY: "auto",
                      flex: 1,
                      WebkitOverflowScrolling: "touch",
                      contain: "content",
                    }}>
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #f5f0eb",
                            cursor: "pointer",
                            background: selectedUser?.id === user.id ? "#f0e9e2" : "transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedUser?.id !== user.id) {
                              e.currentTarget.style.background = "#faf6f2";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = selectedUser?.id === user.id ? "#f0e9e2" : "transparent";
                          }}
                        >
                          <div style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "14px" }}>
                            {user.ledgerName || user.name || user.billName}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                            {user.mobile && <span>📱 {user.mobile}</span>}
                            {user.city && <span> 📍 {user.city}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

       <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: isMobile ? "100%" : "auto",
          flexWrap: "nowrap",
        }}
      >
           <div
        style={{
          flex: 1,
          width: isMobile ? "50%" : "auto",
        }}
      >
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className="date-picker-input"
              />
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", whiteSpace: "nowrap" }}>to</span>
           <div
        style={{
          flex: 1,
          width: isMobile ? "50%" : "auto",
        }}
      >
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className="date-picker-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-header - only show on mobile or when not in modal */}
      {!isModal && (
        <div style={{
          padding: isMobile ? "8px 16px" : "12px 24px",
          background: "#f9f4ef",
          borderBottom: "1px solid #e8ddd4",
        }}>
          <div style={{
            fontSize: isMobile ? "13px" : "15px",
            fontWeight: "600",
            color: BROWN_DARK,
          }}>
            {accountName || (selectedUser ? `${getUserDisplayName()}${getUserLocation() ? ` / ${getUserLocation()}` : ''}` : "Select an account")}
            {selectedUser?.id && <span style={{ fontSize: "12px", color: "#888", marginLeft: "8px" }}>({selectedUser.id})</span>}
          </div>
          <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#888" }}>
            From: {formatDateRange(fromDate)} To: {formatDateRange(toDate)}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{
        padding: isMobile ? "12px 16px" : "20px 24px",
        maxWidth: isModal ? "100%" : "1400px",
        margin: isModal ? "0" : "0 auto",
      }}>
        {/* Summary Card */}
        <div style={{
          background: "#fff",
          padding: isMobile ? "16px" : "20px",
          borderRadius: "12px",
          marginBottom: isMobile ? "16px" : "24px",
          border: "1px solid #e8ddd4",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
            Total Pending Amount
          </div>
          <div style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", color: BROWN_DARK }}>
             ₹{formatAmount(pendingBills.reduce((s, i) => s + Number(i.totalValue || i.Total_Amt || 0), 0))}
          </div>
        </div>

        {/* Pending Bills Table */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e8ddd4",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            padding: isMobile ? "12px 16px" : "16px 24px",
            borderBottom: "1px solid #e8ddd4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "bold", color: BROWN_DARK }}>
              Pending Bills ({pendingBills.length})
            </div>
            {loading && <CircularProgress size={20} style={{ color: BROWN }} />}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <CircularProgress style={{ color: BROWN, marginBottom: "16px" }} />
              <p style={{ color: "#999" }}>Loading pending bills...</p>
            </div>
          ) : pendingBills.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
              <p>No pending bills for the selected period</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: isMobile ? "12px" : "13px",
              }}>
                <thead>
                  <tr style={{
                    background: "#f9f4ef",
                    borderBottom: `2px solid ${ACCENT}`,
                  }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600" }}>S.No</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600" }}>Voucher No</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600" }}>Date</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600" }}>Source</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontWeight: "600" }}>Pending Balance</th>
                    {/* <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontWeight: "600" }}>Pending</th> */}
                    <th style={{ padding: "12px 16px", textAlign: "center", color: BROWN, fontWeight: "600" }}>Days</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBills.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: index < pendingBills.length - 1 ? "1px solid #f0f0f0" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fdf8f3"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "10px 16px", color: "#666" }}>{index + 1}</td>
                      <td style={{ padding: "10px 16px", color: BROWN_DARK, fontWeight: "500" }}>
                        {item.voucherNumber || item.invoice_no || "N/A"}
                      </td>
                      <td style={{ padding: "10px 16px", color: "#666" }}>
                        {item.eventDate ? item.eventDate.split('T')[0] : item.Date || "N/A"}
                      </td>
                      <td style={{ padding: "10px 16px", color: "#666" }}>
                        {item.Source || "SALES"}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", color: BROWN_DARK, fontWeight: "500" }}>
                        ₹{formatAmount(item.totalValue || item.Total_Amt || 0)}
                      </td>
                      {/* <td style={{ padding: "10px 16px", textAlign: "right", color: "#e74c3c", fontWeight: "600" }}>
                        ₹{formatAmount(item.BalanceAmount || item.Pending_Amt || 0)}
                      </td> */}
                      <td style={{ padding: "10px 16px", textAlign: "center", color: "#666" }}>
                            {(() => {
                              const eventDate = item.eventDate || item.Date;
                          
                              if (!eventDate) return 0;
                          
                              const today = new Date();
                              const billDate = new Date(eventDate);
                          
                              today.setHours(0, 0, 0, 0);
                              billDate.setHours(0, 0, 0, 0);
                          
                              const diffTime = today - billDate;
                              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                          
                              return diffDays >= 0 ? diffDays : 0;
                            })()}
                       </td>
                    </tr>
                  ))}
            
                  <tr style={{
                    background: "#f9f4ef",
                    borderTop: `2px solid ${BROWN}`,
                    fontWeight: "bold",
                  }}>
                    <td colSpan="4" style={{ padding: "12px 16px", color: BROWN_DARK, textAlign: "right" }}>
                      Total
                    </td>
                    <td style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: BROWN_DARK,
                      fontWeight: "bold",
                    }}>
                      ₹{formatAmount(pendingBills.reduce((s, i) => s + Number(i.totalValue || i.Total_Amt || 0), 0))}
                    </td>
                    {/* <td style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: "#e74c3c",
                      fontWeight: "bold",
                    }}>
                      ₹{formatAmount(totalPending)}
                    </td> */}
                    <td style={{ padding: "12px 16px" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .date-picker-input {
          width: 100% !important;
          padding: 6px 12px !important;
          border-radius: 16px !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          background: rgba(255,255,255,0.15) !important;
          color: #fff !important;
          font-size: 12px !important;
          outline: none !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
        }
        .date-picker-input::placeholder {
          color: rgba(255,255,255,0.5) !important;
        }
        .date-picker-input:focus {
          border-color: ${ACCENT} !important;
          background: rgba(255,255,255,0.2) !important;
        }
        .react-datepicker-wrapper {
          width: 100% !important;
        }
        .react-datepicker__input-container {
          width: 100% !important;
        }
      `}</style>
    </div>
  );
}

export default PendingBillDetails;