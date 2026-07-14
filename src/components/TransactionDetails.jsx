// TransactionDetails.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";

function TransactionDetails({ onBack, isMobile = true, isModal = false }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [totals, setTotals] = useState({
    totalDebit: 0,
    totalCredit: 0,
    netBalance: 0
  });
  const [fetchingAccountId, setFetchingAccountId] = useState(false);
  const [accountName, setAccountName] = useState("");

  const isFirstLoad = useRef(true);
  const userType = localStorage.getItem('userType');
  const isEmployee = userType === 'employee';

  // useEffect(() => {
  //   if (isEmployee && isFirstLoad.current) {
  //     isFirstLoad.current = false;
  //     fetchUsers();
  //   } else if (!isEmployee && isFirstLoad.current) {
  //     isFirstLoad.current = false;
  //     const userData = JSON.parse(localStorage.getItem('user') || '{}');
  //     const customerId = userData.Ret_Id || userData.Customer_Id || userData.id;
  //     if (customerId) {
  //       setSelectedUser({ id: customerId, customerId: customerId });
  //     }
  //   }
  // }, [isEmployee]);

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
      fetchTransactions(selectedUser.accountId);
    }
  }, [selectedUser?.accountId, fromDate, toDate]);

  const fetchUserAccountId = async (customerId) => {
    if (!customerId || fetchingAccountId) return;
    setFetchingAccountId(true);
    setLoading(true);
    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOptRetailerId?Customer_Id=${customerId}&limit=10000000&page=1`,
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

const fetchUsers = async () => {
  setLoadingUsers(true);
  try {
    if (isEmployee) {
      
      const response = await fetchLink({
        address: `pos/retailerMasterOpt?limit=100000&page=1`,
        method: "GET",
      });

      if (response?.success && Array.isArray(response.data)) {
        const userList = response.data.map((user) => ({
          id: user.Customer_Id || user.Ret_Id,
          customerId: user.Customer_Id || user.Ret_Id,
          name: user.Ledger_Name || user.Billl_Name || user.Short_Name || "Unknown",
          ledgerName: user.Ledger_Name,
          billName: user.Billl_Name,
          location: user.Address || user.City || "",
          city: user.City || "",
          mobile: user.Mobile_No || "",
        }));
        setUsers(userList);
      } else {
        toast.error(response?.message || "Failed to fetch customer list");
        setUsers([]);
      }
    } else {
      // Customer login: only their own account, no dropdown needed
      const loginUser = JSON.parse(localStorage.getItem("user") || "{}");
      const customerId = loginUser.Ret_Id || loginUser.Customer_Id || loginUser.id;
      if (customerId) {
        setUsers([{
          id: customerId,
          customerId,
          name: loginUser.Ledger_Name || loginUser.Name || "You",
        }]);
      }
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to load users");
  } finally {
    setLoadingUsers(false);
  }
};

  // const handleUserSelect = (user) => {
  //   setSelectedUser({
  //     ...user,
  //     accountId: null
  //   });
  //   setAccountName("");
  //   setUserDropdownOpen(false);
  //   setUserSearch("");
  // };


const handleUserSelect = React.useCallback((user) => {
  setSelectedUser({
    ...user,
    accountId: null
  });

  setAccountName("");
  setUserDropdownOpen(false);
  setUserSearch("");
}, []);

  const fetchTransactions = async (accountId) => {
    if (!accountId) return;
    setLoading(true);
    try {
      const fromDateStr = fromDate.toISOString().split('T')[0];
      const toDateStr = toDate.toISOString().split('T')[0];
      
      const response = await fetchLink({
        address: `payment/transactions?Acc_Id=${accountId}&fromDate=${fromDateStr}&toDate=${toDateStr}`,
        method: 'GET'
      });

      if (response?.success) {
        const data = response.data || [];
        setTransactions(Array.isArray(data) ? data : []);
        calculateTotals(data);
        
        // Set account name from first transaction if available
        if (data.length > 0 && data[0].Account_name) {
          setAccountName(data[0].Account_name);
        }
      } else {
        toast.error(response?.message || "Failed to fetch transactions");
        setTransactions([]);
        setTotals({ totalDebit: 0, totalCredit: 0, netBalance: 0 });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
      setTransactions([]);
      setTotals({ totalDebit: 0, totalCredit: 0, netBalance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    if (!data || !Array.isArray(data)) {
      setTotals({ totalDebit: 0, totalCredit: 0, netBalance: 0 });
      return;
    }
    let totalDebit = 0;
    let totalCredit = 0;
    
    data.forEach(transaction => {
      const debit = parseFloat(transaction.Debit_Amt || transaction.Debit_Amount || 0);
      const credit = parseFloat(transaction.Credit_Amt || transaction.Credit_Amount || 0);
      totalDebit += debit;
      totalCredit += credit;
    });
    
    const netBalance = totalDebit - totalCredit;
    setTotals({
      totalDebit: totalDebit,
      totalCredit: totalCredit,
      netBalance: netBalance
    });
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

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

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getLedgerDescription = (transaction) => {
    return transaction.Ledger_Desc || 
           transaction.Ledger_Description || 
           transaction.Narration || 
           transaction.Line_Naration ||
           "-";
  };

  const getInvoiceNo = (transaction) => {
    return transaction.invoice_no || 
           transaction.Invoice_No || 
           transaction.Voucher_No || 
           "-";
  };

  const getParticulars = (transaction) => {
    return transaction.Particulars || 
           transaction.Particular || 
           "-";
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
        Transaction Details
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
                      color: "#aaa",
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
    
    {/* Date Pickers */}
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
      {/* Sub-header with account name - only show on mobile or when not in modal */}
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

      {/* Summary Cards */}
      <div style={{
        padding: isMobile ? "12px 16px" : "20px 24px",
        maxWidth: isModal ? "100%" : "1400px",
        margin: isModal ? "0" : "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
          gap: isMobile ? "10px" : "16px",
          marginBottom: isMobile ? "16px" : "24px",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: isMobile ? "12px 16px" : "16px 20px",
            border: "1px solid #e8ddd4",
            textAlign: "center",
          }}>
            <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#888", marginBottom: "4px" }}>
              Total Debit
            </div>
            <div style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "bold", color: "#e74c3c" }}>
              ₹{formatCurrency(totals.totalDebit)}
            </div>
          </div>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: isMobile ? "12px 16px" : "16px 20px",
            border: "1px solid #e8ddd4",
            textAlign: "center",
          }}>
            <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#888", marginBottom: "4px" }}>
              Total Credit
            </div>
            <div style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "bold", color: "#2ecc71" }}>
              ₹{formatCurrency(totals.totalCredit)}
            </div>
          </div>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: isMobile ? "12px 16px" : "16px 20px",
            border: "1px solid #e8ddd4",
            textAlign: "center",
          }}>
            <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#888", marginBottom: "4px" }}>
              Net Balance
            </div>
            <div style={{
              fontSize: isMobile ? "18px" : "24px",
              fontWeight: "bold",
              color: totals.netBalance >= 0 ? BROWN_DARK : "#e74c3c",
            }}>
              ₹{formatCurrency(Math.abs(totals.netBalance))} {totals.netBalance >= 0 ? "DR" : "CR"}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
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
            flexWrap: "wrap",
            gap: "8px",
          }}>
         
            {loading && <CircularProgress size={20} style={{ color: BROWN }} />}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <CircularProgress style={{ color: BROWN, marginBottom: "16px" }} />
              <p style={{ color: "#999" }}>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p>No transactions found for the selected period</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
             <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "11px",
    tableLayout: "auto"
  }}
>
                <thead>
                  <tr style={{
                    background: "#f9f4ef",
                    borderBottom: `2px solid ${ACCENT}`,
                  }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600", fontSize: isMobile ? "11px" : "12px" }}>
                      Date
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600", fontSize: isMobile ? "11px" : "12px" }}>
                      Invoice No
                    </th>
                    {/* <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600", fontSize: isMobile ? "11px" : "12px" }}>
                      Particulars
                    </th> */}
                    <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontWeight: "600", fontSize: isMobile ? "11px" : "12px" }}>
                      Debit 
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "right", color: BROWN, fontWeight: "600", fontSize: isMobile ? "11px" : "12px" }}>
                      Credit
                    </th>
                    {/* <th style={{ padding: "12px 16px", textAlign: "left", color: BROWN, fontWeight: "600", fontSize: isMobile ? "11px" : "12px" }}>
                      Ledger Description
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => {
                    const debit = parseFloat(transaction.Debit_Amt || transaction.Debit_Amount || 0);
                    const credit = parseFloat(transaction.Credit_Amt || transaction.Credit_Amount || 0);
                    return (
                      <tr
                        key={index}
                        style={{
                          borderBottom: index < transactions.length - 1 ? "1px solid #f0f0f0" : "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fdf8f3"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                       <td
  style={{
    padding: "8px 4px",
    color: "#666",
    whiteSpace: "nowrap"
  }}
>
  {formatDateDisplay(transaction.Ledger_Date || transaction.Date)}
</td>

<td
  style={{
    padding: "8px 4px",
    color: BROWN_DARK,
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px"
  }}
>
  {getInvoiceNo(transaction)}
</td>

<td
  style={{
    padding: "8px 4px",
    textAlign: "right"
  }}
>
  {debit > 0 ? formatCurrency(debit) : "0.00"}
</td>

<td
  style={{
    padding: "8px 4px",
    textAlign: "right"
  }}
>
  {credit > 0 ? formatCurrency(credit) : "0.00"}
</td>
                     
                      </tr>
                    );
                  })}
                  {/* Total Row */}
                  <tr style={{
                    background: "#f9f4ef",
                    borderTop: `2px solid ${BROWN}`,
                    fontWeight: "bold",
                  }}>
                    <td colSpan="2" style={{ padding: "12px 16px", color: BROWN_DARK, textAlign: "right" }}>
                      Total
                    </td>
                    <td style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: "#e74c3c",
                      fontWeight: "bold",
                    }}>
                      {formatCurrency(totals.totalDebit)} DR
                    </td>
                    <td style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: "#2ecc71",
                      fontWeight: "bold",
                    }}>
                      {formatCurrency(totals.totalCredit)} CR
                    </td>
                    <td style={{ padding: "12px 16px" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile-friendly card view (alternative for small screens) */}
   
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

export default TransactionDetails;