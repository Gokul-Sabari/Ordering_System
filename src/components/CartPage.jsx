import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useReactToPrint } from "react-to-print";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fetchLink } from "./fetchComponent";
import CommonHeader from "./CommonHeader";
import { encryptPasswordFun } from "./functions";
import { ISOStrings, Multiplication, isEqualNumber } from "../components/functions";
import TransactionDetails from './TransactionDetails';
import PendingBillDetails from './PendingBillDetails';

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const RoundNumber = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
};




const calculateCoolieExpense = (product, quantity) => {

  const coolieRate = product.coolieRate || 0;
  const packGet = product.packGet || 1;
  const totalKgs = quantity * packGet;
  return coolieRate * totalKgs;
};

const getPercentage = (total, percent) =>
  RoundNumber(((Number(total) || 0) * (Number(percent) || 0)) / 100);

const Addition = (...args) =>
  RoundNumber(args.reduce((s, v) => s + (Number(v) || 0), 0));


const toLocalYMD = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (!d || Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};


const getStoredUsername = () => {
  const raw = localStorage.getItem("username");
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? "" : String(parsed);
  } catch {
    return raw;
  }
};

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setOrRemove = (key, value) => {
  if (value === null || value === undefined || value === "") {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, String(value));
  }
};


const mapOrderExpenses = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .filter((e) => e && (e.Expense_Id || e.Acc_Id))
    .map((e) => ({
      Expense_Id: e.Expense_Id ?? e.Acc_Id,
      Account_Name: e.Expence_Name || e.Account_Name || "",
      Group_Name: e.Group_Name || "",
      percentageValue: Number(e.percentageValue) || 0,
      Expence_Value: RoundNumber(
        (Number(e.Expence_Value_DR) || 0) - (Number(e.Expence_Value_CR) || 0)
      ),
    }));


const productTableHeaderStyle = {
  padding: "10px 12px",
  textAlign: "center",
  color: BROWN,
  fontSize: "12px",
  fontWeight: "600",
};

const productTableCellStyle = {
  padding: "10px 12px",
  textAlign: "center",
  fontSize: "12px",
  color: "#666",
};

const tableHeaderStyle = {
  padding: "12px 16px",
  color: BROWN,
  fontSize: "13px",
  fontWeight: "600",
  borderBottom: "2px solid #e8ddd4",
};






const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUsername("");
      setPassword("");
    }
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen || localStorage.getItem('isEditingOrder') !== 'true') return;
    try {
      const d = JSON.parse(localStorage.getItem('editOrderData') || '{}');
      setInvoiceExpenses(
        Array.isArray(d.expenses) ? d.expenses : mapOrderExpenses(d.Expence_Array)
      );
    } catch (e) { }
  }, [isOpen]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Enter your username");
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchLink({
        address: `authorization/getUserTypeAuth`,
        method: "POST",
        bodyData: { username: username.trim() },
      });
      if (!data?.success) {
        toast.error(data?.message || "User not found");
        return;
      }
      if (data.requirePassword) {
        setStep(2);
      } else {
        const customer = data.customer || {};
        const displayName = customer.A1;
        localStorage.setItem("user", JSON.stringify({ ...customer, Name: displayName }));
        localStorage.setItem("session", JSON.stringify({ username: username.trim(), ...data }));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("username", displayName || username.trim());
        localStorage.setItem("userType", "customer");
        localStorage.setItem("retId", customer.Ret_Id || "");
        localStorage.setItem("userTypeId", String(customer.UserTypeId ?? data.UserTypeId ?? ""));
        toast.success("Signed in");
        setUsername("");
        setPassword("");
        setStep(1);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Couldn't reach the server. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Enter your password");
      return;
    }
    setIsLoading(true);
    try {
      const passHash = await encryptPasswordFun(password);
      const data = await fetchLink({
        address: `authorization/login`,
        method: "POST",
        bodyData: { username: username.trim(), password: passHash, APP_Type: 2 },
      });
      if (data?.success) {
        const { user, sessionInfo } = data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("session", JSON.stringify(sessionInfo));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("username", user?.Name || user?.name || username.trim());
        localStorage.setItem("userType", "employee");
        localStorage.setItem("userTypeId", String(user?.UserTypeId ?? user?.User_Type_Id ?? ""));  // ADD
        localStorage.removeItem("retId");
        toast.success("Signed in");
        setUsername("");
        setPassword("");
        setStep(1);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      } else {
        toast.error(data?.message || "Sign in failed");
      }
    } catch (error) {
      toast.error("Couldn't reach the server. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#999",
            padding: "4px 8px",
            borderRadius: "50%",
          }}
        >
          ✕
        </button>

        <div style={{ background: "#f9f4ef", borderRadius: "12px", padding: "20px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: BROWN,
              marginBottom: "16px",
              paddingBottom: "8px",
              borderBottom: `2px solid ${ACCENT}`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {step === 2 && (
              <button
                onClick={() => {
                  setStep(1);
                  setPassword("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: BROWN,
                  fontSize: "18px",
                  padding: 0,
                }}
              >
                ←
              </button>
            )}
            <span>{step === 1 ? "Sign in" : "Enter password"}</span>
          </div>

          {step === 1 && (
            <form onSubmit={handleUsernameSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>
                  Username
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: BROWN_DARK,
                  color: "#fff",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <CircularProgress size={20} style={{ color: "#fff" }} />
                    <span>Checking…</span>
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>
                  Username
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "#e8e0d8",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: BROWN_DARK,
                    fontWeight: "500",
                  }}
                >
                  {username}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#666", marginBottom: "4px" }}>
                  Password
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: BROWN_DARK,
                  color: "#fff",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <CircularProgress size={20} style={{ color: "#fff" }} />
                    <span>Signing in…</span>
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: "#999" }}>
            Sign in to place an order
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Header menus                                                        */
/* ------------------------------------------------------------------ */

const UserMenuDropdown = ({
  isOpen,
  onClose,
  isLoggedIn,
  userName,
  onLoginClick,
  onLogout,
  userType,
  onSaleOrders,
  onDashboard,
}) => {
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const itemStyle = (color) => ({
    width: "100%",
    padding: isMobile ? "14px 16px" : "18px 24px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    fontSize: isMobile ? "15px" : "17px",
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "16px",
    borderRadius: isMobile ? "8px" : "12px",
  });

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        minWidth: isMobile ? "250px" : "320px",
        background: "#fff",
        borderRadius: isMobile ? "12px" : "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        zIndex: 1000,
        overflow: "hidden",
        animation: "slideDown 0.2s ease",
      }}
    >
      {isLoggedIn ? (
        <>
          <div
            style={{
              padding: isMobile ? "20px 16px" : "28px 24px",
              background: `linear-gradient(135deg, ${BROWN} 0%, ${BROWN_DARK} 100%)`,
              borderBottom: `1px solid ${ACCENT}`,
            }}
          >
            <div
              style={{
                width: isMobile ? "48px" : "64px",
                height: isMobile ? "48px" : "64px",
                borderRadius: "50%",
                background: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <span style={{ color: BROWN, fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>
                {userName?.charAt(0) || ""}
              </span>
            </div>
            <div style={{ fontSize: isMobile ? "18px" : "20px", color: "#fff" }}>{userName || ""}</div>
            <div style={{ fontSize: isMobile ? "13px" : "15px", color: "rgba(255,255,255,0.8)" }}>
              Signed in • {userType}
            </div>
          </div>
          <div style={{ padding: isMobile ? "8px" : "12px" }}>
            {onDashboard && (
              <button
                onClick={() => {
                  onDashboard();
                  onClose();
                }}
                style={itemStyle(BROWN)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f0eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: isMobile ? "18px" : "22px" }}>📊</span>
                <span>Dashboard</span>
              </button>
            )}
            {onSaleOrders && (
              <button
                onClick={() => {
                  onSaleOrders();
                  onClose();
                }}
                style={itemStyle(BROWN)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f0eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: isMobile ? "18px" : "22px" }}>📋</span>
                <span>Sale orders</span>
              </button>
            )}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              style={{ ...itemStyle("#d32f2f"), marginTop: "4px" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🚪</span>
              <span>Sign out</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ padding: isMobile ? "20px 16px" : "28px 24px", background: "#f9f4ef", textAlign: "center" }}>
            <div
              style={{
                width: isMobile ? "48px" : "64px",
                height: isMobile ? "48px" : "64px",
                borderRadius: "50%",
                background: "#e0d5cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <span style={{ color: BROWN, fontSize: isMobile ? "20px" : "28px", fontWeight: "bold" }}>?</span>
            </div>
            <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "600", color: BROWN, marginBottom: "4px" }}>
              Not signed in
            </div>
            <div style={{ fontSize: isMobile ? "13px" : "15px", color: "#666" }}>Sign in to place orders</div>
          </div>
          <div style={{ padding: isMobile ? "12px" : "20px" }}>
            <button
              onClick={() => {
                onLoginClick();
                onClose();
              }}
              style={{
                width: "100%",
                padding: isMobile ? "14px 16px" : "16px 24px",
                background: BROWN,
                border: "none",
                borderRadius: isMobile ? "8px" : "12px",
                fontSize: isMobile ? "15px" : "18px",
                fontWeight: "600",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? "8px" : "12px",
              }}
            >
              <span style={{ fontSize: isMobile ? "18px" : "22px" }}>🔑</span>
              <span>Sign in</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

function ThreeDotMenu({ isLoggedIn, userName, onLogout, onLoginClick, onSaleOrders, onDashboard, userType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          borderRadius: "50%",
          flexShrink: 0,
          minWidth: "36px",
          minHeight: "36px",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <MoreVertIcon style={{ fontSize: isMobile ? "22px" : "24px" }} />
      </button>

      <UserMenuDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userType={userType}
        onLogout={onLogout}
        onLoginClick={onLoginClick}
        onSaleOrders={onSaleOrders}
        onDashboard={onDashboard}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Customer search                                                     */
/* ------------------------------------------------------------------ */

const normalizeText = (text = "") =>
  (text ?? "").toString().toLowerCase().replace(/[^a-z0-9]/g, "").trim();

/** Plain substring match on the normalised text. The previous version also
 *  accepted a row when 70% of the *characters* of the query appeared anywhere
 *  in the field, which matched almost every customer. */
const isPartialMatch = (text, term) => {
  if (!text || !term) return false;
  if (String(text).toLowerCase().includes(String(term).toLowerCase())) return true;
  const t = normalizeText(text);
  const q = normalizeText(term);
  return Boolean(q) && t.includes(q);
};

const SearchableCustomerSelect = ({ value, onChange, onCustomerSelect, prefilledCustomer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(prefilledCustomer?.name || "");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(
    prefilledCustomer ? { Customer_Id: prefilledCustomer.id, Short_Name: prefilledCustomer.name } : null
  );
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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
        setIsSearchTriggered(false);
        setFilteredCustomers([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetchLink({
          address: `pos/retailerMasterOptRetailerId?limit=10000000&page=1`,
        });
        if (!cancelled && response?.success && Array.isArray(response.data)) {
          setCustomers(
            response.data.map((c) => ({
              ...c,
              Short_Name: c.Short_Name ? c.Short_Name.replace(/\u0004/g, "").trim() : "",
              Billl_Name: c.Billl_Name ? c.Billl_Name.trim() : "",
              Mobile_No: c.Mobile_No ? c.Mobile_No.trim() : "",
              Address: c.Address ? c.Address.trim() : "",
              City: c.City ? c.City.trim() : "",
              Broker_Name: c.Broker_Name?.trim() || c.Broker?.trim() || "",
              Transporter_Name: c.Transporter_Name?.trim() || c.Transporter?.trim() || "",
            }))
          );
        }
      } catch (error) {
        if (!cancelled) toast.error("Couldn't load customers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCustomers();
    return () => {
      cancelled = true;
    };
  }, []);

  const performSearch = () => {
    const searchText = searchTerm.trim();
    if (!searchText) {
      setFilteredCustomers([]);
      setIsSearchTriggered(false);
      setIsOpen(false);
      return;
    }

    const searchMobile = searchText.replace(/\D/g, "");

    const results = customers.filter((c) => {
      const mobileNorm = (c.Mobile_No || "").replace(/\D/g, "");
      return (
        isPartialMatch(c.Short_Name, searchText) ||
        isPartialMatch(c.Billl_Name, searchText) ||
        isPartialMatch(c.City, searchText) ||
        isPartialMatch(c.Address, searchText) ||
        (searchMobile.length >= 3 && mobileNorm.includes(searchMobile))
      );
    });

    const startsWithName = (c, text) => {
      const s = text.toLowerCase().trim();
      const name = (c.Short_Name || "").toLowerCase().trim();
      const bill = (c.Billl_Name || "").toLowerCase().trim();
      return name.startsWith(s) || bill.startsWith(s);
    };

    const prefixMatches = [];
    const otherMatches = [];
    results.forEach((c) => {
      if (startsWithName(c, searchText)) {
        prefixMatches.push(c);
      } else {
        otherMatches.push(c);
      }
    });

    const getCustName = (c) => String(c.Short_Name || c.Billl_Name || c.Customer_Name || "").trim();
    prefixMatches.sort((a, b) => getCustName(a).localeCompare(getCustName(b), undefined, { sensitivity: "base" }));
    otherMatches.sort((a, b) => getCustName(a).localeCompare(getCustName(b), undefined, { sensitivity: "base" }));

    setFilteredCustomers([...prefixMatches, ...otherMatches]);
    setIsSearchTriggered(true);
    setIsOpen(true);
  };

  const handleSelectCustomer = (c) => {
    setSelectedCustomer(c);
    setSearchTerm(c.Short_Name || "");
    setIsOpen(false);
    setIsSearchTriggered(false);
    setFilteredCustomers([]);

    onChange(c.Customer_Id);
    if (onCustomerSelect) {
      onCustomerSelect({
        broker: c.Broker_Name || "",
        transporter: c.Transporter_Name || "",
        customerId: c.Customer_Id,
        customerName: c.Short_Name || "",
        mobileNo: c.Mobile_No || "",
        address: c.Address || c.Party_Mailing_Address || "",
        city: c.City || "",
        Broker_Id: c.Broker_Id || "",
        Transporter_Id: c.Transporter_Id || "",
        partyMailingName: c.Party_Mailing_Name || c.Billl_Name || c.Short_Name || "",
        partyMailingAddress: c.Party_Mailing_Address || c.Address || "",
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
          placeholder="Search by name, mobile or city"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearchTriggered(false);
            setFilteredCustomers([]);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              performSearch();
            }
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            flex: 1,
            padding: "12px",
            border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            performSearch();
          }}
          style={{
            background: BROWN,
            border: "none",
            borderRadius: "8px",
            padding: "12px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BROWN_DARK)}
          onMouseLeave={(e) => (e.currentTarget.style.background = BROWN)}
        >
          <SearchIcon style={{ fontSize: "20px", color: "#fff" }} />
        </button>
      </div>

      {isOpen && isSearchTriggered && (
        <div
          style={{
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
          }}
        >
          {searchTerm.trim() && (
            <div
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                color: filteredCustomers.length > 0 ? "#4caf50" : "#e74c3c",
                background: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {filteredCustomers.length} result{filteredCustomers.length !== 1 ? "s" : ""} for "{searchTerm}"
            </div>
          )}

          {loading ? (
            <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>
              <CircularProgress size={20} style={{ color: BROWN }} />
              <div style={{ marginTop: "8px" }}>Loading customers…</div>
            </div>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((c) => (
              <div
                key={c.Customer_Id}
                onClick={() => handleSelectCustomer(c)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  backgroundColor: selectedCustomer?.Customer_Id === c.Customer_Id ? "#f0e9e2" : "transparent",
                }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>
                  {selectedCustomer?.Customer_Id === c.Customer_Id && "✓ "}
                  {c.Short_Name || "Unnamed customer"}
                </div>
                {c.Billl_Name && c.Billl_Name !== c.Short_Name && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{c.Billl_Name}</div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "11px",
                    color: "#888",
                    marginTop: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  {c.Mobile_No && (
                    <span style={{ background: "#f0e9e2", padding: "2px 8px", borderRadius: "12px" }}>
                      📞 {c.Mobile_No}
                    </span>
                  )}
                  {c.City && <span>📍 {c.City}</span>}
                </div>
              </div>
            ))
          ) : (
            searchTerm.trim() && (
              <div style={{ padding: "24px", textAlign: "center", color: "#999", fontSize: "13px" }}>
                <p>No customers match "{searchTerm}".</p>
                <p style={{ fontSize: "11px", marginTop: "8px" }}>Try a name, mobile number or city.</p>
              </div>
            )
          )}
        </div>
      )}

      {isOpen && searchTerm.trim() && !isSearchTriggered && (
        <div
          style={{
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
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          Press Enter or tap search to find customers
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Broker / Transporter dropdowns                                      */
/* ------------------------------------------------------------------ */

const PartyDropdown = ({
  label,
  selected,
  onSelect,
  options,
  loading,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = searchTerm.trim()
    ? options.filter((o) => {
      const s = searchTerm.toLowerCase().trim();
      return (o.name || "").toLowerCase().includes(s) || (o.alias || "").toLowerCase().includes(s);
    })
    : options;

  const displayValue = isOpen ? searchTerm : (selected?.name || "");

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          padding: "10px 12px",
          border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
          borderRadius: "8px",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          placeholder={selected?.name || `Select ${label.toLowerCase()}`}
          value={displayValue}
          onFocus={() => {
            setIsOpen(true);
            if (onOpen) onOpen();
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          style={{
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: (isOpen && searchTerm) || selected?.name ? BROWN_DARK : "#999",
            background: "transparent",
            width: "100%",
            padding: 0,
          }}
        />
        {searchTerm ? (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#aaa",
              fontSize: "16px",
              lineHeight: 1,
              padding: "0 2px",
              marginLeft: "4px",
            }}
          >
            ×
          </button>
        ) : (
          <span
            onClick={() => {
              setIsOpen((v) => !v);
              if (!isOpen && onOpen) onOpen();
            }}
            style={{
              color: BROWN_LIGHT,
              fontSize: "11px",
              marginLeft: "8px",
              cursor: "pointer",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        )}
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            maxHeight: "280px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {searchTerm.trim() && (
            <div
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                color: "#999",
                background: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchTerm}"
            </div>
          )}

          <div
            onClick={() => {
              onSelect({ id: null, name: "" });
              setIsOpen(false);
              setSearchTerm("");
            }}
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #f5f0eb",
              cursor: "pointer",
              fontSize: "13px",
              color: "#999",
              fontStyle: "italic",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#faf6f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            — None —
          </div>

          {loading ? (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <CircularProgress size={16} style={{ color: BROWN }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              No {label.toLowerCase()}s found
            </div>
          ) : (
            filtered.map((o) => (
              <div
                key={o.id}
                onClick={() => {
                  onSelect(o);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #f5f0eb",
                  cursor: "pointer",
                  background: selected?.id === o.id ? "#f0e9e2" : "transparent",
                  fontSize: "13px",
                  color: BROWN_DARK,
                }}
                onMouseEnter={(e) => {
                  if (selected?.id !== o.id) e.currentTarget.style.background = "#faf6f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selected?.id === o.id ? "#f0e9e2" : "transparent";
                }}
              >
                <div style={{ fontWeight: "500" }}>{o.name}</div>
                {o.alias && <div style={{ fontSize: "11px", color: "#888" }}>{o.alias}</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Cart row (hoisted: defining it inside CartPage remounted every row  */
/* on each render, which dropped focus while editing price/qty)        */
/* ------------------------------------------------------------------ */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop";

const CartItemRow = ({
  item,
  isMobile,
  products,
  allProducts,
  setProducts,
  setAllProducts,
  updateQty,
  setItemQty,
  removeItem,
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState("");
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [tempQty, setTempQty] = useState("");

  const fullProduct = useMemo(() => {
    let found = products.find((p) => String(p.id) === String(item.id));
    if (!found && allProducts.length > 0) {
      found = allProducts.find(
        (p) => String(p.id) === String(item.id) || String(p.Product_Id) === String(item.id)
      );
    }
    if (!found) {
      return {
        ...item,
        price: item.price || 0,
        name: item.name || "Unknown product",
        packGet: item.packGet || 1,
        image: item.image || FALLBACK_IMAGE,
      };
    }
    return { ...found, image: found.image || FALLBACK_IMAGE };
  }, [item, products, allProducts]);

  const packGet = Number(item.packGet) || Number(fullProduct.packGet) || 1;
  const currentPrice = Number(item.price) || 0;
  const amount = currentPrice * item.quantity * packGet;

  const handleQtySave = () => {
    const newQty = parseInt(tempQty, 10);
    if (tempQty === "" || newQty === 0) {
      removeItem(item.id);
    } else if (!Number.isNaN(newQty) && newQty > 0) {
      setItemQty(item.id, newQty);
    } else {
      toast.error("Enter a valid quantity");
    }
    setIsEditingQty(false);
    setTempQty("");
  };

  const handlePriceSave = (valToSave) => {
    const targetVal = valToSave !== undefined ? valToSave : tempPrice;
    const newPrice = parseFloat(targetVal);
    if (Number.isNaN(newPrice) || newPrice < 0) {
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(item.id) ? { ...p, price: newPrice } : p))
    );
    setAllProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(item.id) || String(p.Product_Id) === String(item.id)
          ? { ...p, price: newPrice }
          : p
      )
    );

    try {
      const stored = safeParse("products", []);
      localStorage.setItem(
        "products",
        JSON.stringify(stored.map((p) => (String(p.id) === String(item.id) ? { ...p, price: newPrice } : p)))
      );
    } catch (e) {
      console.error("Couldn't update products in storage:", e);
    }

    const editData = safeParse("editOrderData", null);
    if (editData?.productsList) {
      editData.productsList = editData.productsList.map((p) =>
        String(p.id) === String(item.id) ? { ...p, price: newPrice, amount: (p.kgs || 0) * newPrice } : p
      );
      localStorage.setItem("editOrderData", JSON.stringify(editData));
    }

    const editProducts = safeParse("editProductsList", null);
    if (Array.isArray(editProducts)) {
      localStorage.setItem(
        "editProductsList",
        JSON.stringify(
          editProducts.map((p) =>
            String(p.id) === String(item.id) ? { ...p, price: newPrice, amount: (p.kgs || 0) * newPrice } : p
          )
        )
      );
    }
  };

  const handlePriceStep = (delta) => {
    const newPrice = Math.max(0, Math.round((currentPrice + delta) * 100) / 100);
    handlePriceSave(newPrice);
    setTempPrice(String(newPrice));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "10px 0" : "12px 0",
        borderBottom: "1px dashed #ddd",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: isMobile ? "8px" : "0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flex: 1,
          minWidth: isMobile ? "60%" : "auto",
        }}
      >
        <img
          src={fullProduct.image}
          alt={fullProduct.name}
          style={{
            width: isMobile ? "40px" : "50px",
            height: isMobile ? "40px" : "50px",
            borderRadius: "6px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: isMobile ? "12px" : "15px",
              fontWeight: "600",
              color: BROWN,
              margin: "0 0 2px 0",
              wordBreak: "break-word",
            }}
            title={item.name}
          >
            {item.name?.length > (isMobile ? 15 : 20)
              ? `${item.name.substring(0, isMobile ? 15 : 20)}…`
              : item.name}
          </h3>

          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              {isEditingPrice ? (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={tempPrice}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || /^\d*\.?\d*$/.test(v)) {
                        setTempPrice(v);
                        const parsed = parseFloat(v);
                        if (!Number.isNaN(parsed) && parsed >= 0) {
                          handlePriceSave(v);
                        }
                      }
                    }}
                    onBlur={() => setIsEditingPrice(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") setIsEditingPrice(false);
                    }}
                    autoFocus
                    style={{
                      width: isMobile ? "70px" : "80px",
                      padding: isMobile ? "2px 6px" : "4px 8px",
                      border: `2px solid ${BROWN}`,
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "18px",
                      fontWeight: "600",
                      color: BROWN,
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: isMobile ? "14px" : "18px", fontWeight: "600", color: BROWN }}>
                    /kg
                  </span>
                </div>
              ) : (
                <span
                  onClick={() => {
                    setIsEditingPrice(true);
                    setTempPrice(String(currentPrice));
                  }}
                  style={{
                    background: "#f0e9e2",
                    padding: isMobile ? "2px 6px" : "4px 8px",
                    borderRadius: "12px",
                    fontSize: isMobile ? "15px" : "18px",
                    color: BROWN,
                    cursor: "pointer",
                    fontWeight: "800",
                    border: "1px solid transparent",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  title="Tap to change the rate"
                >
                  ₹{currentPrice.toFixed(2)}/kg ✎
                </span>
              )}

              {/* Up & Down arrow buttons to change product rate */}
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: "1px",
                  verticalAlign: "middle",
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePriceStep(1);
                  }}
                  title="Increase rate by ₹1"
                  style={{
                    width: "24px",
                    height: "16px",
                    padding: 0,
                    borderRadius: "4px 4px 1px 1px",
                    border: `1.5px solid ${BROWN}`,
                    background: "#fff",
                    color: BROWN,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "900",
                    lineHeight: 1,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f5ece4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePriceStep(-1);
                  }}
                  disabled={currentPrice <= 0}
                  title="Decrease rate by ₹1"
                  style={{
                    width: "24px",
                    height: "16px",
                    padding: 0,
                    borderRadius: "1px 1px 4px 4px",
                    border: `1.5px solid ${BROWN}`,
                    background: "#fff",
                    color: BROWN,
                    cursor: currentPrice <= 0 ? "not-allowed" : "pointer",
                    opacity: currentPrice <= 0 ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "900",
                    lineHeight: 1,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPrice > 0) e.currentTarget.style.background = "#f5ece4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  ▼
                </button>
              </div>
            </div>

            <span style={{ fontSize: isMobile ? "9px" : "11px", color: "#666", whiteSpace: "nowrap" }}>
              Pack: {packGet}kg
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "6px" : "16px",
          flexShrink: 0,
          marginLeft: isMobile ? "auto" : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "2px" : "4px",
            background: "#f5f0eb",
            padding: isMobile ? "2px 3px" : "2px 4px",
            borderRadius: "25px",
          }}
        >
          <button
            onClick={() => updateQty(item.id, -1)}
            style={{
              width: isMobile ? "28px" : "24px",
              height: isMobile ? "28px" : "24px",
              borderRadius: "50%",
              border: "none",
              background: "#fff",
              color: BROWN,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "16px" : "12px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            −
          </button>

          {isEditingQty ? (
            <input
              type="text"
              inputMode="numeric"
              value={tempQty}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) setTempQty(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleQtySave();
                }
                if (e.key === "Escape") {
                  setIsEditingQty(false);
                  setTempQty("");
                }
              }}
              onBlur={handleQtySave}
              autoFocus
              style={{
                width: "40px",
                padding: isMobile ? "4px 2px" : "2px 4px",
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
              onClick={() => {
                setIsEditingQty(true);
                setTempQty(String(item.quantity));
              }}
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: BROWN,
                minWidth: isMobile ? "32px" : "30px",
                textAlign: "center",
                cursor: "pointer",
                padding: isMobile ? "4px" : "2px 4px",
                borderRadius: "4px",
              }}
              title="Tap to type a quantity"
            >
              {item.quantity}
            </span>
          )}

          <button
            onClick={() => updateQty(item.id, 1)}
            style={{
              width: isMobile ? "28px" : "24px",
              height: isMobile ? "28px" : "24px",
              borderRadius: "50%",
              border: "none",
              background: "#fff",
              color: BROWN,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "16px" : "12px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            +
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "2px" : "4px" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: BROWN, display: "block" }}>
              ₹{amount.toFixed(2)}
            </span>
            <span style={{ fontSize: isMobile ? "8px" : "10px", color: "#999", display: "block" }}>
              ({item.quantity} × {packGet}kg)
            </span>
          </div>
          <div
            onClick={() => removeItem(item.id)}
            style={{
              color: "#999",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
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

/* ------------------------------------------------------------------ */
/* Sale orders list                                                    */
/* ------------------------------------------------------------------ */

const getBrokerName = (order) => {
  if (!Array.isArray(order?.Staff_Involved_List)) return "";
  const broker = order.Staff_Involved_List.find(
    (s) => s.Cost_Center_Type_Id === 3 || s.EmpType === "Broker"
  );
  return broker?.EmpName || "";
};

const getTransporterName = (order) => {
  if (!Array.isArray(order?.Staff_Involved_List)) return "";
  const transporter = order.Staff_Involved_List.find(
    (s) => s.Cost_Center_Type_Id === 2 || s.EmpType === "Load Man"
  );
  return transporter?.EmpName || "";
};

const ProductListExpand = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ padding: "16px", background: "#f9f4ef", borderTop: "2px solid #e8ddd4" }}>
      <h4 style={{ margin: "0 0 12px 0", color: BROWN, fontSize: "14px", fontWeight: "600" }}>
        Products ({products.length})
      </h4>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr style={{ background: "#f0e9e2", borderBottom: `2px solid ${ACCENT}` }}>
              <th style={productTableHeaderStyle}>S.No</th>
              <th style={{ ...productTableHeaderStyle, textAlign: "left" }}>Product</th>
              <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Kgs</th>
              <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Rate (₹/kg)</th>
              <th style={{ ...productTableHeaderStyle, textAlign: "right" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={productTableCellStyle}>{idx + 1}</td>
                <td
                  style={{
                    ...productTableCellStyle,
                    textAlign: "left",
                    fontWeight: "500",
                    color: BROWN_DARK,
                  }}
                >
                  {product.Product_Name || "Unknown product"}
                </td>
                <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.Bill_Qty || 0).toFixed(2)}
                </td>
                <td style={{ ...productTableCellStyle, textAlign: "right" }}>
                  ₹{parseFloat(product.Item_Rate || product.Price || 0).toFixed(2)}
                </td>
                <td
                  style={{
                    ...productTableCellStyle,
                    textAlign: "right",
                    fontWeight: "600",
                    color: BROWN_DARK,
                  }}
                >
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

function SaleOrders({ onBack, onEditOrder, onDashboard }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [brokerFilter, setBrokerFilter] = useState("");
  const [transporterFilter, setTransporterFilter] = useState("");

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState(null);

  const [fromDate, setFromDate] = useState(() => new Date());
  const [toDate, setToDate] = useState(() => new Date());
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);
  const [tempBrokerFilter, setTempBrokerFilter] = useState("");
  const [tempTransporterFilter, setTempTransporterFilter] = useState("");
  const [originalProductIds, setOriginalProductIds] = useState(new Set());

  const uniqueBrokers = useMemo(() => {
    const set = new Set();
    orders.forEach((o) => {
      const name = getBrokerName(o).trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [orders]);

  const uniqueTransporters = useMemo(() => {
    const set = new Set();
    orders.forEach((o) => {
      const name = getTransporterName(o).trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [orders]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;

    const fetchSaleOrders = async () => {
      setLoading(true);
      try {
        const userData = safeParse("user", {});
        const sessionData = safeParse("session", {});
        const userId =
          userData.UserId || userData.user_id || userData.User_Id || sessionData?.userId || "";
        const mobileNo = getStoredUsername();
        const usertypeid = userData.UserTypeId || userData.user_type_id || userData.User_Type_Id || sessionData?.userTypeId || "";
        console.log("usertypeid", usertypeid)
        const response = await fetchLink({
          address: `sales/salesOrder/list?Created_by=${encodeURIComponent(
            userId
          )}&Mobile_No=${encodeURIComponent(mobileNo)}&FromDate=${toLocalYMD(
            fromDate
          )}&ToDate=${toLocalYMD(toDate)}&UserTypeId=${encodeURIComponent(usertypeid)}`,
          method: "GET",
        });

        if (cancelled) return;

        if (response?.success) {
          const orderData = response.data || response.Data || [];
          setOrders(Array.isArray(orderData) ? orderData : []);
        } else {
          toast.error(response?.message || "Couldn't load orders");
          setOrders([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching sale orders:", error);
          toast.error("Couldn't load sale orders");
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSaleOrders();
    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
  };

  /* Previously only reset the temp values, so "Clear all" inside the dialog
     looked like it did nothing until Apply was pressed. */
  const handleFilterReset = () => {
    const today = new Date();
    setFromDate(today);
    setToDate(today);
    setBrokerFilter("");
    setTransporterFilter("");
    setTempFromDate(today);
    setTempToDate(today);
    setTempBrokerFilter("");
    setTempTransporterFilter("");
    setShowFilterDialog(false);
  };

  const getTotalBillQty = (productsList) =>
    Array.isArray(productsList)
      ? productsList.reduce((sum, p) => sum + (parseFloat(p.Bill_Qty) || 0), 0)
      : 0;

  const getTotalItems = (productsList) => (Array.isArray(productsList) ? productsList.length : 0);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (debouncedSearchTerm) {
        const search = debouncedSearchTerm.toLowerCase();
        const productNames = (order.Products_List || [])
          .map((p) => p.Product_Name || "")
          .join(" ")
          .toLowerCase();
        const matchesSearch =
          (order.Retailer_Name && order.Retailer_Name.toLowerCase().includes(search)) ||
          (order.Customer_Name && order.Customer_Name.toLowerCase().includes(search)) ||
          (order.So_Inv_No && String(order.So_Inv_No).toLowerCase().includes(search)) ||
          (order.So_No && String(order.So_No).includes(search)) ||
          (order.Narration && order.Narration.toLowerCase().includes(search)) ||
          (order.OrderStatus && order.OrderStatus.toLowerCase().includes(search)) ||
          productNames.includes(search);
        if (!matchesSearch) return false;
      }
      if (brokerFilter && getBrokerName(order).trim() !== brokerFilter) return false;
      if (transporterFilter && getTransporterName(order).trim() !== transporterFilter) return false;
      return true;
    });
  }, [orders, debouncedSearchTerm, brokerFilter, transporterFilter]);

  const toggleOrderExpansion = (orderId) =>
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  const handlePrintOrder = async (e, order) => {
    e.stopPropagation();
    try {
      const productsList = order.Products_List || [];

      const printCartItems = productsList.map((p) => ({
        Print_Name: p.Product_Short_Name || p.Product_Name || "",
        shortName: p.Product_Short_Name || p.Short_Name || "",
        name: p.Product_Name || "",
        kgs: parseFloat(p.Bill_Qty) || 0,
        price: parseFloat(p.Item_Rate) || parseFloat(p.Price) || 0,
        packGet: parseFloat(p.PackGet) || 1,
      }));

      let customerData = {
        Billl_Name: order.Retailer_Name || order.Customer_Name || "",
        Short_Name: order.Retailer_Name || order.Customer_Name || "",
        Party_Mailing_Name: order.Retailer_Name || order.Customer_Name || "",
        Party_Location: order.Shipp_Address || order.Address || "",
        City: order.City || "",
        Mobile_No: order.Ord_Mobile_No || order.Mobile_No || "",
        Land_Line: "",
        Transporter: getTransporterName(order),
        Broker: getBrokerName(order),
      };

      const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;

      if (retailerId) {
        const response = await fetchLink({
          address: `pos/retailerMasterOptRetailerId?Customer_Id=${retailerId}&limit=10000000&page=1`,
        });
        if (response?.success && Array.isArray(response.data)) {
          const found = response.data.find((c) => String(c.Customer_Id) === String(retailerId));
          if (found) {
            customerData = {
              Billl_Name: found.Billl_Name || found.Short_Name || customerData.Billl_Name,
              Short_Name: found.Short_Name || customerData.Short_Name,
              Party_Mailing_Name:
                found.Party_Mailing_Name || found.Billl_Name || customerData.Party_Mailing_Name,
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

      // Expenses: reuse mapOrderExpenses() (reads Expence_Value_DR / _CR correctly).
      const normalizedExpenses = mapOrderExpenses(order.Expence_Array);
      const totalExpensesValue = normalizedExpenses.reduce(
        (sum, exp) => sum + (parseFloat(exp.Expence_Value) || 0),
        0
      );

      const subtotal = productsList.reduce((sum, p) => sum + (parseFloat(p.Amount) || 0), 0);
      const totalKgs = productsList.reduce((sum, p) => sum + (parseFloat(p.Bill_Qty) || 0), 0);

      // Recompute the total locally so the expense is guaranteed to show,
      // rather than trusting order.Total_Invoice_value as-is.
      const computedTotal = Addition(subtotal, totalExpensesValue);

      setPrintData({
        customer: customerData,
        cartItems: printCartItems,
        totals: {
          subtotal,
          totalExpenses: totalExpensesValue,
          tax: 0,
          total: computedTotal,
          totalItems: productsList.length,
          totalKgs,
        },
        expenses: normalizedExpenses,
        storage: safeParse("user", {}),
        createdOn: order.Created_on || order.Created_On || order.created_on,
        orderDate: order.So_Date,
      });

      setPrintModalOpen(true);
    } catch (error) {
      console.error("Error preparing print data:", error);
      toast.error("Couldn't prepare the print preview");
    }
  };

  const handleEditOrder = async (e, order) => {
    e.stopPropagation();

    try {
      const orderId = order.So_Id || order.So_No || order.OrderId;
      localStorage.setItem("editOrderId", String(orderId));
      setOrRemove("selectedCustomerId", order.Retailer_Id);

      let actualBrokerId = null;
      let actualBrokerName = "";
      let actualTransporterId = null;
      let actualTransporterName = "";

      if (Array.isArray(order.Staff_Involved_List)) {
        const broker = order.Staff_Involved_List.find(
          (s) => s.Cost_Center_Type_Id === 3 || s.EmpType === "Broker"
        );
        if (broker) {
          actualBrokerId = broker.Involved_Emp_Id || broker.Emp_Id;
          actualBrokerName = broker.EmpName || "";
        }
        const transporter = order.Staff_Involved_List.find(
          (s) => s.Cost_Center_Type_Id === 2 || s.EmpType === "Load Man"
        );
        if (transporter) {
          actualTransporterId = transporter.Involved_Emp_Id || transporter.Emp_Id;
          actualTransporterName = transporter.EmpName || "";
        }
      }

      const retailerId = order.Retailer_Id || order.Customer_Id || order.Party_Id;
      let completeCustomerDetails = null;

      if (retailerId) {
        const response = await fetchLink({
          address: `pos/retailerMasterOptRetailerId?Customer_Id=${retailerId}&limit=10000000&page=1`,
        });
        if (response?.success && Array.isArray(response.data)) {
          completeCustomerDetails = response.data.find(
            (c) => String(c.Customer_Id) === String(retailerId)
          );
        }
      }

      const originalCustomerName =
        order.Retailer_Name || order.Customer_Name || order.Party_Name || "";

      const cartItemsObj = {};
      const productsList = [];

      (order.Products_List || []).forEach((product) => {
        const productId = String(product.Product_Id || product.Item_Id);
        const productName = product.Product_Name || product.Item_Name || "";
        const shortName = product.Short_Name || product.Product_Short_Name || productName;
        const pricePerKg = parseFloat(product.Item_Rate) || parseFloat(product.Price) || 0;

        let packGet = parseFloat(product.PackGet) || parseFloat(product.Pack_Get) || 1;
        if (packGet === 1 && productName) {
          const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
          if (packMatch) packGet = parseFloat(packMatch[1]);
        }

        const billQty = parseFloat(product.Bill_Qty) || 0;
        const quantity = packGet > 0 && billQty > 0 ? Math.round(billQty / packGet) : 1;
        const amount = parseFloat(product.Amount) || pricePerKg * billQty || 0;

        cartItemsObj[productId] = quantity;

        productsList.push({
          id: productId,
          name: productName,
          shortName,
          quantity,
          kgs: billQty,
          price: pricePerKg,
          packGet,
          amount,
          originalName: productName,
          savedPrice: pricePerKg,
        });
      });

      const editData = {
        customerId: retailerId,
        customerName: originalCustomerName,
        customerMobile: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
        customerAddress: completeCustomerDetails?.Address || order.Shipp_Address || "",
        customerCity: completeCustomerDetails?.City || order.City || "",
        orderId,
        orderNumber: order.So_Inv_No || order.So_No,
        cartItems: cartItemsObj,
        productsList,
        expenses: mapOrderExpenses(order.Expence_Array),
        brokerId: actualBrokerId,
        brokerName: actualBrokerName,
        transporterId: actualTransporterId,
        transporterName: actualTransporterName,
        shippingAddress: completeCustomerDetails?.Address || order.Shipp_Address || "",
        deliveryAddress:
          completeCustomerDetails?.Address || order.Deliv_Address || order.Shipp_Address || "",
        contactNumber: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || "",
        description: order.Narration || "",
        customerDetails: {
          id: retailerId,
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
        },
      };

      localStorage.setItem("editOrderData", JSON.stringify(editData));
      localStorage.setItem("isEditingOrder", "true");
      localStorage.setItem("cartItems", JSON.stringify(cartItemsObj));
      localStorage.setItem("editProductsList", JSON.stringify(productsList));
      localStorage.setItem("editCustomerOriginalName", originalCustomerName);
      /* These used to be written as the literal string "null" when absent,
         which later parsed back as a truthy broker/transporter. */
      setOrRemove("editBrokerId", actualBrokerId);
      setOrRemove("editBrokerName", actualBrokerName);
      setOrRemove("editTransporterId", actualTransporterId);
      setOrRemove("editTransporterName", actualTransporterName);

      if (onEditOrder) onEditOrder(editData);
    } catch (error) {
      console.error("Error preparing order for edit:", error);
      toast.error("Couldn't open that order for editing");
    }
  };

  const activeFiltersCount = (brokerFilter ? 1 : 0) + (transporterFilter ? 1 : 0);

  return (
    <>
      <div
        style={{
          fontFamily: "'Georgia', serif",
          background: "#f5f0eb",
          minHeight: "100vh",
          paddingBottom: isMobile ? "76px" : "0",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: BROWN_DARK,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ←
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Sale orders</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {filteredOrders.length} of {orders.length} orders
              {activeFiltersCount > 0 &&
                ` · ${activeFiltersCount} filter${activeFiltersCount > 1 ? "s" : ""} on`}
            </div>
          </div>

          <div style={{ position: "relative", width: isMobile ? "150px" : "250px" }}>
            <input
              type="text"
              placeholder="Search orders"
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
            <SearchIcon
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
              }}
            />
          </div>

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
              <span
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "2px 6px",
                  fontSize: "10px",
                  marginLeft: "4px",
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

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
              }}
            >
              ✕ Clear all
            </button>
          )}
        </div>

        {showFilterDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setShowFilterDialog(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                width: isMobile ? "92%" : "500px",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "20px 24px",
                  background: BROWN_DARK,
                  color: "#fff",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Filter orders</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>
                    Narrow the list by date, broker or transporter
                  </p>
                </div>
                <CloseIcon
                  style={{ cursor: "pointer", fontSize: "24px" }}
                  onClick={() => setShowFilterDialog(false)}
                />
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "28px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                      paddingBottom: "8px",
                      borderBottom: `2px solid ${ACCENT}`,
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>📅</span>
                    <span style={{ fontWeight: "600", color: BROWN_DARK, fontSize: "15px" }}>
                      Date range
                    </span>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#666",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      From
                    </label>
                    <DatePicker
                      selected={tempFromDate}
                      onChange={(date) => setTempFromDate(date)}
                      selectsStart
                      startDate={tempFromDate}
                      endDate={tempToDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a start date"
                      className="date-picker-input"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#666",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      To
                    </label>
                    <DatePicker
                      selected={tempToDate}
                      onChange={(date) => setTempToDate(date)}
                      selectsEnd
                      startDate={tempFromDate}
                      endDate={tempToDate}
                      minDate={tempFromDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select an end date"
                      className="date-picker-input"
                    />
                  </div>
                </div>

                {uniqueBrokers.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#666",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Broker
                    </label>
                    <select
                      value={tempBrokerFilter}
                      onChange={(e) => setTempBrokerFilter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${tempBrokerFilter ? BROWN_DARK : ACCENT}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: tempBrokerFilter ? "#f9f4ef" : "#fff",
                        color: tempBrokerFilter ? BROWN_DARK : "#333",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">All brokers</option>
                      {uniqueBrokers.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {uniqueTransporters.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#666",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Transporter
                    </label>
                    <select
                      value={tempTransporterFilter}
                      onChange={(e) => setTempTransporterFilter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${tempTransporterFilter ? BROWN_DARK : ACCENT}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: tempTransporterFilter ? "#f9f4ef" : "#fff",
                        color: tempTransporterFilter ? BROWN_DARK : "#333",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">All transporters</option>
                      {uniqueTransporters.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {uniqueBrokers.length === 0 && uniqueTransporters.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px 20px",
                      background: "#f9f4ef",
                      borderRadius: "12px",
                      color: "#999",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "14px" }}>
                      These orders have no broker or transporter recorded.
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: "12px" }}>Filter by date range instead.</p>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid #e8ddd4",
                  display: "flex",
                  gap: "12px",
                  background: "#faf6f2",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
              >
                <Button variant="outlined" onClick={handleFilterReset} style={{ flex: 1 }}>
                  Clear all
                </Button>
                <Button
                  variant="contained"
                  onClick={handleFilterApply}
                  style={{ flex: 1, backgroundColor: BROWN_DARK, color: "#fff", fontWeight: "600" }}
                >
                  Apply filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: isMobile ? "12px" : "24px", overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <CircularProgress style={{ color: BROWN, marginBottom: "16px" }} />
              <p>Loading orders…</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <h3 style={{ color: "#666", marginBottom: "8px" }}>No orders here</h3>
              <p style={{ fontSize: "14px" }}>
                {debouncedSearchTerm || brokerFilter || transporterFilter
                  ? "Change the search or filters to see more."
                  : "Nothing was ordered in this date range."}
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
                  <div
                    key={orderKey}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #e8ddd4",
                      overflow: "hidden",
                    }}
                  >
                    <div onClick={() => toggleOrderExpansion(orderKey)} style={{ padding: "16px", cursor: "pointer" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: BROWN_DARK,
                              marginBottom: "4px",
                            }}
                          >
                            {order.Retailer_Name || order.Customer_Name || "Unknown customer"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {order.So_Inv_No || order.So_No || ""}
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
                        <div style={{ textAlign: "right", marginLeft: "12px" }}>
                          <div style={{ fontSize: "15px", fontWeight: "bold", color: BROWN_DARK }}>
                            ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
                          </div>
                          <div style={{ fontSize: "11px", color: "#666" }}>
                            {totalItems} items • {totalBillQty.toFixed(2)} kg
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "11px",
                          color: "#999",
                        }}
                      >
                        <span>{formatDate(order.So_Date)}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background:
                                String(order.OrderStatus).toLowerCase() === "pending"
                                  ? "#fff3cd"
                                  : "#d4edda",
                              color:
                                String(order.OrderStatus).toLowerCase() === "pending"
                                  ? "#856404"
                                  : "#155724",
                              fontSize: "10px",
                              fontWeight: "600",
                            }}
                          >
                            {order.OrderStatus || order.VoucherTypeGet || "N/A"}
                          </span>
                          <span
                            style={{
                              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                              fontSize: "16px",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>

                      {order.Narration && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#888",
                            fontStyle: "italic",
                            padding: "8px",
                            background: "#f9f4ef",
                            borderRadius: "8px",
                            marginTop: "8px",
                          }}
                        >
                          {order.Narration}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
                        <button
                          onClick={(e) => handlePrintOrder(e, order)}
                          style={{
                            padding: "6px 12px",
                            background: "#4CAF50",
                            color: "#fff",
                            border: "none",
                            borderRadius: "15px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          🖨️ Print
                        </button>
                        {order.convertedto == 1 || order.Cancel_status == 4 ? '' : <button
                          onClick={(e) => handleEditOrder(e, order)}
                          style={{
                            padding: "6px 12px",
                            background: ACCENT,
                            color: BROWN_DARK,
                            border: "none",
                            borderRadius: "15px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        }
                      </div>
                    </div>

                    {isExpanded && <ProductListExpand products={order.Products_List} />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "1200px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9f4ef" }}>
                    <th style={tableHeaderStyle} />
                    {[
                      { label: "Order #", align: "left" },
                      { label: "Date", align: "left" },
                      { label: "Customer", align: "left" },
                      { label: "Broker", align: "left" },
                      { label: "Transporter", align: "left" },
                      { label: "Status", align: "left" },
                      { label: "Items", align: "right" },
                      { label: "Kgs", align: "right" },
                      { label: "Amount", align: "right" },
                      { label: "Actions", align: "center" },
                    ].map((h) => (
                      <th key={h.label} style={{ ...tableHeaderStyle, textAlign: h.align }}>
                        {h.label}
                      </th>
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

                    return (
                      <React.Fragment key={orderKey}>
                        <tr
                          onClick={() => toggleOrderExpansion(orderKey)}
                          style={{
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            borderBottom: "1px solid #e8ddd4",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fdf8f3")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                        >
                          <td
                            style={{
                              padding: "14px 8px 14px 16px",
                              textAlign: "center",
                              color: BROWN_LIGHT,
                              fontSize: "14px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            >
                              ►
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: BROWN_DARK, fontWeight: "500", fontSize: "13px" }}>
                            {order.So_Inv_No || order.So_No || "N/A"}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "12px" }}>
                            {order.So_Date ? String(order.So_Date).split("T")[0] : "N/A"}
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
                          <td style={{ padding: "14px 16px", color: "#666", fontSize: "13px" }}>
                            {order.OrderStatus || "-"}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                            {totalItems}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                            {totalBillQty.toFixed(2)} kg
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              textAlign: "right",
                              color: BROWN_DARK,
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            ₹{parseFloat(order.Total_Invoice_value || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button
                                onClick={(e) => handlePrintOrder(e, order)}
                                title="Print order"
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
                              >
                                🖨️ Print
                              </button>
                              {order.convertedto == 1 || order.Cancel_status == 4 ? '' : <button
                                onClick={(e) => handleEditOrder(e, order)}
                                title="Edit order"
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
                              >
                                ✏️ Edit
                              </button>
                              }
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            {/* 11 columns, not 10 — the caret column was being clipped */}
                            <td colSpan={11} style={{ padding: 0 }}>
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

      {printModalOpen && (
        <PrintPreviewModal
          open={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          customer={printData?.customer}
          cartItems={printData?.cartItems}
          totals={printData?.totals}
          expenses={printData?.expenses}
          onPrintAndSave={async () => true}
          storage={printData?.storage}
          isReprint
          createdOn={printData?.createdOn}
          orderDate={printData?.orderDate}
        />
      )}

      {isMobile && (
        <MobileTabBar
          activeTab="saleOrders"
          onSaleOrders={() => { }}
          onDashboard={onDashboard}
          onHome={onBack}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Cart page                                                           */
/* ------------------------------------------------------------------ */

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Auth
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [userType, setUserType] = useState("");

  // Customers
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [headerSelectedCustomer, setHeaderSelectedCustomer] = useState(null);

  // Order form
  const [contactNumber, setContactNumber] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [customer, setCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [prefilledCustomer, setPrefilledCustomer] = useState(null);

  // Brokers / transporters
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [availableTransporters, setAvailableTransporters] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
  const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [loadingTransporters, setLoadingTransporters] = useState(false);

  // Screens / modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);
  const [showSaleOrders, setShowSaleOrders] = useState(false);

  const [showDashboard, setShowDashboard] = useState(false);
  const [cartHeaderMenuOpen, setCartHeaderMenuOpen] = useState(false);
  const [originalProductIds, setOriginalProductIds] = useState(new Set());


  const [creditInfo, setCreditInfo] = useState(null);
  const [expenseMaster, setExpenseMaster] = useState([]);
  const [loadingExpenseMaster, setLoadingExpenseMaster] = useState(false);
  const [invoiceExpenses, setInvoiceExpenses] = useState([]);

  const [manualExpenseEdits, setManualExpenseEdits] = useState({});

  const handleDashboard = () => setShowDashboard(true);
  const handleBackFromDashboard = () => setShowDashboard(false);
  const handleSaleOrdersClick = () => setShowSaleOrders(true);
  const restoredEditExpensesRef = useRef(false);

  const isEditingOrder = Boolean(localStorage.getItem("editOrderId"));

  /* ---------------- Customer passed in via router state ---------------- */

  useEffect(() => {
    const passed = location.state?.selectedCustomer;
    if (!passed) return;

    setPrefilledCustomer(passed);
    setHeaderSelectedCustomer({
      id: passed.id,
      name: passed.name,
      mobile: passed.mobile || "",
      city: passed.city || "",
      address: passed.address || "",
      brokerId: passed.brokerId || "",
      brokerName: passed.brokerName || "",
      transporterId: passed.transporterId || "",
      transporterName: passed.transporterName || "",
    });
    setCustomer(String(passed.id || ""));
    setContactNumber(passed.mobile || "");
    if (passed.address) {
      setShippingAddress(passed.address);
      setDeliveryAddress(passed.address);
    }
    if (passed.brokerId && passed.brokerName) {
      setSelectedBroker({ id: passed.brokerId, name: passed.brokerName });
      setBrokerName(passed.brokerName);
    }
    if (passed.transporterId && passed.transporterName) {
      setSelectedTransporter({ id: passed.transporterId, name: passed.transporterName });
      setTransporter(passed.transporterName);
    }
    setSelectedDetails({
      customerId: String(passed.id || ""),
      customerName: passed.name || "",
      mobileNo: passed.mobile || "",
      address: passed.address || "",
      city: passed.city || "",
      broker: passed.brokerName || "",
      Broker_Id: passed.brokerId || "",
      transporter: passed.transporterName || "",
      Transporter_Id: passed.transporterId || "",
    });
  }, [location.state]);

  const buildRestoredExpenses = (rawArr, masterList) => {
    // Get original products from edit data for coolie calculation
    const editData = safeParse("editOrderData", null);
    const originalProductsList = editData?.productsList || [];

    // Build a map of original product IDs and their quantities for reference
    const originalProductMap = new Map();
    originalProductsList.forEach(p => {
      if (p.id) {
        originalProductMap.set(String(p.id), {
          quantity: parseInt(p.quantity) || 0,
          coolieRate: parseFloat(p.coolieRate) || 0,
          kgs: parseFloat(p.kgs) || 0,
        });
      }
    });

    // Store both the IDs and the map for later use
    setOriginalProductIds(new Set(originalProductMap.keys()));

    // Calculate original coolie total from saved order
    const originalCoolieTotal = originalProductsList.reduce((sum, item) => {
      const coolieRate = parseFloat(item.coolieRate) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (coolieRate * quantity);
    }, 0);

    // Also look for existing Coolie expense in the order
    let savedCoolieValue = 0;
    const existingCoolie = (Array.isArray(rawArr) ? rawArr : []).find(
      e => (e.Account_Name || e.Expence_Name || "").trim().toUpperCase() === "COOLIE EXPENSES"
    );
    if (existingCoolie) {
      savedCoolieValue = existingCoolie.Expence_Value !== undefined && existingCoolie.Expence_Value !== null && existingCoolie.Expence_Value !== ''
        ? parseFloat(existingCoolie.Expence_Value)
        : (parseFloat(existingCoolie.Expence_Value_DR) || 0) - (parseFloat(existingCoolie.Expence_Value_CR) || 0);
    }

    return mapOrderExpenses(rawArr).map((row) => {
      const master = masterList.find(
        (m) =>
          String(m.Acc_Id) === String(row.Expense_Id) ||
          (m.Account_Name || "").trim().toUpperCase() === (row.Account_Name || "").trim().toUpperCase()
      );

      const isCoolie = (row.Account_Name || "").trim().toUpperCase() === "COOLIE EXPENSES";
      const pct = master ? Number(master.percentageValue) || 0 : row.percentageValue || 0;

      if (isCoolie) {
        return {
          ...row,
          percentageValue: 0,
          baseCoolieValue: savedCoolieValue || row.Expence_Value || 0,
          originalCoolieTotal: originalCoolieTotal,
          Expense_Id: row.Expense_Id,
          originalProductMap: originalProductMap, // Store the original product map for delta calculation
          isRestored: true,
        };
      }

      // For all other expenses (including percentage-based), store the percentage but allow editing
      return {
        ...row,
        percentageValue: pct,
        baseValue: row.Expence_Value || 0,
        isRestored: true,
      };
    });
  };

  useEffect(() => {
    const isEditing = localStorage.getItem("isEditingOrder") === "true";
    const editData = safeParse("editOrderData", null);
    if (!isEditing || !editData) {
      restoredEditExpensesRef.current = false;
      setOriginalProductIds(new Set()); // Reset on exit
      return;
    }

    // Capture original product IDs for coolie calculation
    const ids = new Set();
    (editData.productsList || []).forEach(p => {
      if (p.id) ids.add(String(p.id));
    });
    setOriginalProductIds(ids);

    const originalCustomerName =
      localStorage.getItem("editCustomerOriginalName") || editData.customerName;

    if (editData.customerId) {
      setCustomer(String(editData.customerId));
      setContactNumber(editData.contactNumber || "");
      setShippingAddress(editData.shippingAddress || "");
      setDeliveryAddress(editData.deliveryAddress || "");
      setDescription(editData.description || "");

      if (editData.customerDetails) {
        setHeaderSelectedCustomer({
          ...editData.customerDetails,
          name: originalCustomerName,
          billName: editData.customerDetails.billName || originalCustomerName,
        });
        setPrefilledCustomer({ id: editData.customerDetails.id, name: originalCustomerName });
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

    const brokerIdNum = parseInt(editData.brokerId, 10);
    if (!Number.isNaN(brokerIdNum) && brokerIdNum > 0) {
      setSelectedBroker({ id: brokerIdNum, name: editData.brokerName || "" });
      setBrokerName(editData.brokerName || "");
    }

    const transporterIdNum = parseInt(editData.transporterId, 10);
    if (!Number.isNaN(transporterIdNum) && transporterIdNum > 0) {
      setSelectedTransporter({ id: transporterIdNum, name: editData.transporterName || "" });
      setTransporter(editData.transporterName || "");
    }


    if (!restoredEditExpensesRef.current && expenseMaster.length > 0) {
      const raw =
        Array.isArray(editData.expenses) && editData.expenses.length
          ? editData.expenses
          : editData.Expence_Array;
      const restored = buildRestoredExpenses(raw, expenseMaster);
      setInvoiceExpenses(restored);

      // DO NOT protect ANY expenses from auto-recalculation in edit mode
      // This allows Coolie and percentage-based expenses to recalculate when quantity changes
      setManualExpenseEdits({});
      restoredEditExpensesRef.current = true;
    }

    const existingCart = safeParse("cartItems", {});
    const hasExistingCart = existingCart && Object.keys(existingCart).length > 0;

    if (hasExistingCart) {
      setCartItems(existingCart);
    } else if (Array.isArray(editData.productsList) && editData.productsList.length > 0) {
      const restored = {};
      editData.productsList.forEach((p) => {
        if (p.id && p.quantity > 0) restored[p.id] = p.quantity;
      });
      setCartItems(restored);
      localStorage.setItem("cartItems", JSON.stringify(restored));
      localStorage.setItem("editProductsList", JSON.stringify(editData.productsList));
    } else if (editData.cartItems && Object.keys(editData.cartItems).length > 0) {
      setCartItems(editData.cartItems);
      localStorage.setItem("cartItems", JSON.stringify(editData.cartItems));
    }

    if (isMobile) setStep(2);
  }, [isMobile, expenseMaster]);

  /* ---------------- Session ---------------- */

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
        if (Array.isArray(sessionData?.customer)) {
          const customerList = sessionData.customer.map((c) => ({
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
          }));
          if (customerList.length > 0) setCustomers(customerList);
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserType("");
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserName("");
      setUserType("");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = () => {
    checkLoginStatus();
  };

  const handleLogout = () => {
    const keysToRemove = [
      "user",
      "session",
      "loginAt",
      "userType",
      "username",
      "retId",
      "cartItems",
      "cartItemsBackup",
      "previousCartItems",
      "products",
      "productsBackup",
      "productMapping",
      "editOrderId",
      "editOrderData",
      "editProductsList",
      "isEditingOrder",
      "editCustomerOriginalName",
      "editBrokerId",
      "editBrokerName",
      "editTransporterId",
      "editTransporterName",
      "selectedCustomer",
      "selectedCustomerId",
      "selectedCustomerData",
      "cartPageSelectedCustomer",
      "cartPageSelectedCustomerId",
      "cartPageCustomer",
      "cartPageContactNumber",
      "cartPageBroker",
      "cartPageTransporter",
      "cartPageShippingAddress",
      "cartPageDeliveryAddress",
      "cartPageDescription",
      "userData",
      "sessionData",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    setIsLoggedIn(false);
    setUserName("");
    setUserType("");
    setCustomers([]);
    setHeaderSelectedCustomer(null);
    setCartItems({});

    toast.success("Signed out");
    navigate("/", { replace: true });
    /* The old code ended with `if (onLogout) onLogout();` — CartPage has no
       such prop, so this threw a ReferenceError on every sign-out. */
  };

  /* ---------------- Data loading ---------------- */

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOptRetailerId?limit=10000000&page=1`,
      });
      if (response?.success && Array.isArray(response.data)) {
        setCustomers(
          response.data.map((c) => ({
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
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userType === "employee") fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userType]);

  const fetchBrokers = async () => {
    if (availableBrokers.length > 0) return;
    setLoadingBrokers(true);
    try {
      const response = await fetchLink({ address: `pos/brokers` });
      if (response?.success) {
        const data = response.data?.Brokers || response.data || [];
        if (Array.isArray(data)) {
          setAvailableBrokers(
            data.map((b) => ({
              id: b.Broker_Id,
              name: (b.Broker_Name || "").trim(),
              code: (b.Broker_Code || "").trim(),
              mobile: (b.Mobile_No || "").trim(),
              alias: (b.Allias_Name || b.Alias || "").trim(),
            }))
          );
        }
      }
    } catch (error) {
      console.error("Couldn't load brokers:", error);
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
          setAvailableTransporters(
            data.map((t) => ({
              id: t.Transporter_Id,
              name: (t.Transporter_Name || "").trim(),
              code: (t.Transporter_Code || "").trim(),
              mobile: (t.Mobile_No || "").trim(),
              alias: (t.Allias_Name || t.Alias || "").trim(),
            }))
          );
        }
      }
    } catch (error) {
      console.error("Couldn't load transporters:", error);
    } finally {
      setLoadingTransporters(false);
    }
  };

  const fetchExpenseMaster = async () => {
    if (expenseMaster.length > 0) return;
    setLoadingExpenseMaster(true);
    try {
      const response = await fetchLink({ address: `masters/defaultAccountMaster?Type=SALE_ORDER` });
      if (response?.success && Array.isArray(response.data)) setExpenseMaster(response.data);
    } catch (error) {
      console.error("Failed to load expense master:", error);
    } finally {
      setLoadingExpenseMaster(false);
    }
  };

  const fetchCreditInfo = async (retailerId) => {
    if (!retailerId) {
      setCreditInfo(null);
      return;
    }
    try {
      const response = await fetchLink({
        address: `receipt/receiptMaster/pendingSalesInvoiceReceipt/amount?Retailer_Id=${retailerId}`,
        method: "GET",
      });
      setCreditInfo(response?.success ? response.others || null : null);
    } catch (error) {
      console.error("Error fetching credit info:", error);
      setCreditInfo(null);
    }
  };

  useEffect(() => {
    fetchCreditInfo(customer);

  }, [customer]);

  const loadAllProducts = async () => {
    try {
      const response = await fetchLink({ address: "products?limit=1000" });
      if (response?.success && Array.isArray(response.data)) {
        setAllProducts(response.data.map((p) => ({
          ...p,
          shortName: p.Short_Name || p.name,
          coolieRate: p.Coolie_Rate || 0
        })));
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadCartData = () => {
    setLoading(true);
    try {
      const savedCart = safeParse("cartItems", null);
      const savedProducts = safeParse("products", null);
      if (savedCart) setCartItems(savedCart);
      if (savedProducts) setProducts(savedProducts);
    } catch (error) {
      toast.error("Couldn't load the cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
    loadAllProducts();
    fetchBrokers();
    fetchTransporters();
    fetchExpenseMaster();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") loadCartData();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes blinker { 50% { opacity: 0; } }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  /* Restore a previously selected customer by id (once, on mount) */
  useEffect(() => {
    const restoreCustomerFromId = async () => {
      const customerIdToUse =
        localStorage.getItem("selectedCustomerId") ||
        localStorage.getItem("cartPageCustomer") ||
        localStorage.getItem("cartPageSelectedCustomerId");

      if (!customerIdToUse) return;

      try {
        const response = await fetchLink({
          address: `pos/retailerMasterOptRetailerId?Customer_Id=${customerIdToUse}&limit=10000000&page=1`,
        });
        if (!response?.success || !Array.isArray(response.data)) return;

        const found = response.data.find((c) => String(c.Customer_Id) === String(customerIdToUse));
        if (!found) return;

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

        setHeaderSelectedCustomer((prev) => prev || completeCustomer);
        setPrefilledCustomer((prev) => prev || { id: completeCustomer.id, name: completeCustomer.name });
        setCustomer((prev) => prev || String(completeCustomer.id));
        setContactNumber((prev) => prev || completeCustomer.mobile || "");
        setShippingAddress((prev) => prev || completeCustomer.address || "");
        setDeliveryAddress((prev) => prev || completeCustomer.address || "");

        if (completeCustomer.brokerId && completeCustomer.brokerName) {
          setSelectedBroker((prev) =>
            prev.id ? prev : { id: completeCustomer.brokerId, name: completeCustomer.brokerName }
          );
          setBrokerName((prev) => prev || completeCustomer.brokerName);
        }
        if (completeCustomer.transporterId && completeCustomer.transporterName) {
          setSelectedTransporter((prev) =>
            prev.id
              ? prev
              : { id: completeCustomer.transporterId, name: completeCustomer.transporterName }
          );
          setTransporter((prev) => prev || completeCustomer.transporterName);
        }

        setSelectedDetails((prev) =>
          prev || {
            customerId: String(completeCustomer.id),
            customerName: completeCustomer.name,
            mobileNo: completeCustomer.mobile || "",
            address: completeCustomer.address || "",
            city: completeCustomer.city || "",
            broker: completeCustomer.brokerName || "",
            Broker_Id: completeCustomer.brokerId || "",
            transporter: completeCustomer.transporterName || "",
            Transporter_Id: completeCustomer.transporterId || "",
          }
        );

        localStorage.setItem("selectedCustomer", JSON.stringify(completeCustomer));
        localStorage.setItem("selectedCustomerId", String(completeCustomer.id));
        localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(completeCustomer));
        localStorage.setItem("cartPageSelectedCustomerId", String(completeCustomer.id));
        localStorage.setItem("cartPageCustomer", String(completeCustomer.id));
      } catch (error) {
        console.error("Error restoring customer:", error);
      }
    };

    restoreCustomerFromId();
  }, []);

  /* Persist form state before leaving for the sale orders screen */
  useEffect(() => {
    if (!showSaleOrders) return;
    if (headerSelectedCustomer) {
      localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(headerSelectedCustomer));
      localStorage.setItem("cartPageSelectedCustomerId", String(headerSelectedCustomer.id));
    }
    setOrRemove("cartPageCustomer", customer);
    setOrRemove("cartPageContactNumber", contactNumber);
    if (selectedBroker?.id) localStorage.setItem("cartPageBroker", JSON.stringify(selectedBroker));
    if (selectedTransporter?.id)
      localStorage.setItem("cartPageTransporter", JSON.stringify(selectedTransporter));
    setOrRemove("cartPageShippingAddress", shippingAddress);
    setOrRemove("cartPageDeliveryAddress", deliveryAddress);
    setOrRemove("cartPageDescription", description);
    localStorage.setItem("cartItemsBackup", JSON.stringify(cartItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSaleOrders]);

  const handleBackFromSaleOrders = () => {
    setShowSaleOrders(false);

    const restoredCustomer = safeParse("cartPageSelectedCustomer", null);
    if (restoredCustomer) {
      setHeaderSelectedCustomer(restoredCustomer);
      setPrefilledCustomer({ id: restoredCustomer.id, name: restoredCustomer.name });
      setCustomer(localStorage.getItem("cartPageCustomer") || String(restoredCustomer.id || ""));
      setContactNumber(localStorage.getItem("cartPageContactNumber") || restoredCustomer.mobile || "");

      const savedBroker = safeParse("cartPageBroker", null);
      if (savedBroker) {
        setSelectedBroker(savedBroker);
        setBrokerName(savedBroker.name || "");
      } else if (restoredCustomer.brokerId && restoredCustomer.brokerName) {
        setSelectedBroker({ id: restoredCustomer.brokerId, name: restoredCustomer.brokerName });
        setBrokerName(restoredCustomer.brokerName);
      }

      const savedTransporter = safeParse("cartPageTransporter", null);
      if (savedTransporter) {
        setSelectedTransporter(savedTransporter);
        setTransporter(savedTransporter.name || "");
      } else if (restoredCustomer.transporterId && restoredCustomer.transporterName) {
        setSelectedTransporter({
          id: restoredCustomer.transporterId,
          name: restoredCustomer.transporterName,
        });
        setTransporter(restoredCustomer.transporterName);
      }

      setShippingAddress(localStorage.getItem("cartPageShippingAddress") || restoredCustomer.address || "");
      setDeliveryAddress(localStorage.getItem("cartPageDeliveryAddress") || restoredCustomer.address || "");
      setDescription(localStorage.getItem("cartPageDescription") || "");

      setSelectedDetails({
        customerId: String(restoredCustomer.id),
        customerName: restoredCustomer.name,
        mobileNo: restoredCustomer.mobile || "",
        address: restoredCustomer.address || "",
        city: restoredCustomer.city || "",
        broker: restoredCustomer.brokerName || "",
        Broker_Id: restoredCustomer.brokerId || "",
        transporter: restoredCustomer.transporterName || "",
        Transporter_Id: restoredCustomer.transporterId || "",
      });
    }

    loadCartData();
  };

  /* ---------------- Customer selection ---------------- */

  const handleHeaderCustomerSelect = async (selected) => {
    let updatedCustomer = { ...selected };

    const isEditing = localStorage.getItem("isEditingOrder") === "true";
    const editOrderData = isEditing ? safeParse("editOrderData", null) : null;

    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOptRetailerId?Customer_Id=${selected.id}&limit=10000000&page=1`,
      });
      if (response?.success && Array.isArray(response.data)) {
        const found = response.data.find(
          (c) => String(c.Retailer_Id || c.Customer_Id) === String(selected.id)
        );
        if (found) {
          updatedCustomer = {
            ...selected,
            brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : selected.brokerId || "",
            brokerName: (found.Broker_Name || found.Broker || selected.brokerName || "").trim(),
            transporterId: found.Transporter_Id
              ? String(found.Transporter_Id).trim()
              : selected.transporterId || "",
            transporterName: (
              found.Transporter_Name ||
              found.Transporter ||
              selected.transporterName ||
              ""
            ).trim(),
            partyMailingAddress: found.Party_Mailing_Address || found.Address || selected.address || "",
            partyMailingName: found.Party_Mailing_Name || found.Billl_Name || selected.name || "",
            billName: found.Billl_Name || selected.name || "",
            originalAddress: found.Address || selected.address || "",
            originalCity: found.City || selected.city || "",
            mobile: found.Mobile_No || selected.mobile || "",
          };
        }
      }
    } catch (e) {
      console.error("Error fetching customer details:", e);
    }

    setHeaderSelectedCustomer(updatedCustomer);
    setCustomer(String(updatedCustomer.id || ""));
    setContactNumber(updatedCustomer.mobile || "");

    const displayAddress =
      updatedCustomer.partyMailingAddress || updatedCustomer.originalAddress || updatedCustomer.address || "";
    if (displayAddress) {
      setShippingAddress(displayAddress);
      setDeliveryAddress(displayAddress);
    }

    if (isEditing && editOrderData) {
      const brokerIdNum = parseInt(editOrderData.brokerId, 10);
      if (!Number.isNaN(brokerIdNum) && brokerIdNum > 0) {
        setSelectedBroker({ id: brokerIdNum, name: editOrderData.brokerName || "" });
        setBrokerName(editOrderData.brokerName || "");
      }
      const transporterIdNum = parseInt(editOrderData.transporterId, 10);
      if (!Number.isNaN(transporterIdNum) && transporterIdNum > 0) {
        setSelectedTransporter({ id: transporterIdNum, name: editOrderData.transporterName || "" });
        setTransporter(editOrderData.transporterName || "");
      }
    } else {
      if (updatedCustomer.brokerId && updatedCustomer.brokerName) {
        setSelectedBroker({ id: updatedCustomer.brokerId, name: updatedCustomer.brokerName });
        setBrokerName(updatedCustomer.brokerName);
      } else {
        setSelectedBroker({ id: null, name: "" });
        setBrokerName("");
      }
      if (updatedCustomer.transporterId && updatedCustomer.transporterName) {
        setSelectedTransporter({
          id: updatedCustomer.transporterId,
          name: updatedCustomer.transporterName,
        });
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
      transporter:
        isEditing && editOrderData ? editOrderData.transporterName || "" : updatedCustomer.transporterName || "",
      Transporter_Id:
        isEditing && editOrderData ? editOrderData.transporterId || null : updatedCustomer.transporterId || "",
      billName: updatedCustomer.billName || updatedCustomer.name || "",
      partyMailingName: updatedCustomer.partyMailingName || "",
    });

    localStorage.setItem("selectedCustomerId", String(updatedCustomer.id));
    localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
    localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(updatedCustomer));
    localStorage.setItem("cartPageSelectedCustomerId", String(updatedCustomer.id));
    localStorage.setItem("cartPageCustomer", String(updatedCustomer.id));
  };

  const handleCustomerSelect = (customerData) => {
    setCustomer(String(customerData.customerId || ""));
    setContactNumber(customerData.mobileNo || "");

    const displayAddress = customerData.partyMailingAddress || customerData.address || "";

    setSelectedDetails({
      ...customerData,
      partyMailingName: customerData.partyMailingName,
      address: displayAddress,
      billName: customerData.billName,
    });

    if (displayAddress) {
      setShippingAddress(displayAddress);
      setDeliveryAddress(displayAddress);
    }

    if (customerData.Broker_Id && customerData.broker) {
      setSelectedBroker({ id: customerData.Broker_Id, name: customerData.broker });
      setBrokerName(customerData.broker);
    } else {
      setSelectedBroker({ id: null, name: "" });
      setBrokerName("");
    }

    if (customerData.Transporter_Id && customerData.transporter) {
      setSelectedTransporter({ id: customerData.Transporter_Id, name: customerData.transporter });
      setTransporter(customerData.transporter);
    } else {
      setSelectedTransporter({ id: null, name: "" });
      setTransporter("");
    }

    setHeaderSelectedCustomer({
      id: customerData.customerId,
      name: customerData.customerName,
      mobile: customerData.mobileNo || "",
      city: customerData.city || "",
      address: displayAddress || "",
      brokerId: customerData.Broker_Id || "",
      brokerName: customerData.broker || "",
      transporterId: customerData.Transporter_Id || "",
      transporterName: customerData.transporter || "",
    });
  };

  /* ---------------- Cart maths ---------------- */

  const getEditedPrice = (productId) => {
    const editData = safeParse("editOrderData", null);
    const fromEditData = editData?.productsList?.find((p) => String(p.id) === String(productId));
    if (fromEditData?.price) return fromEditData.price;

    const editProducts = safeParse("editProductsList", null);
    if (Array.isArray(editProducts)) {
      const found = editProducts.find((p) => String(p.id) === String(productId));
      if (found?.price) return found.price;
    }
    return null;
  };

  const enhancedCartItems = useMemo(() => {
    let editProductsList = [];
    const editData = safeParse("editOrderData", null);
    if (Array.isArray(editData?.productsList)) editProductsList = editData.productsList;
    if (editProductsList.length === 0) {
      const fallback = safeParse("editProductsList", null);
      if (Array.isArray(fallback)) editProductsList = fallback;
    }

    const editProductsMap = new Map();
    editProductsList.forEach((p) => {
      if (p.id) {
        editProductsMap.set(String(p.id), {
          ...p,
          originalQuantity: parseInt(p.quantity) || 0,
          originalCoolieRate: parseFloat(p.coolieRate) || 0,
        });
      }
    });

    let cartOrder = [];
    try {
      cartOrder = JSON.parse(localStorage.getItem("cartItemOrder")) || [];
    } catch (e) {}

    return Object.entries(cartItems)
      .filter(([, qty]) => qty > 0)
      .sort(([idA], [idB]) => {
        const indexA = cartOrder.indexOf(String(idA));
        const indexB = cartOrder.indexOf(String(idB));
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      })
      .map(([productId, qty]) => {
        const sid = String(productId);
        const editP = editProductsMap.get(sid);

        // Get the live product for coolie rate
        const liveProduct =
          products.find((p) => String(p.id) === sid) ||
          allProducts.find((p) => String(p.id) === sid || String(p.Product_Id) === sid);

        // Priority: live product coolie rate > edit data coolie rate > 0
        const coolieRate = liveProduct
          ? liveProduct.coolie ?? liveProduct.coolieRate ?? liveProduct.Coolie_Rate ?? liveProduct.Coolie ?? 0
          : editP?.coolieRate || 0;

        if (editP && editP.name) {
          const packGet = Number(editP.packGet) || 1;
          const kgs = qty * packGet;
          const price = Number(editP.price) || 0;

          return {
            id: productId,
            name: editP.name,
            shortName: editP.shortName || editP.name,
            quantity: qty,
            originalQuantity: editP.originalQuantity || 0,
            kgs,
            price,
            packGet,
            amount: price * kgs,
            Print_Name: editP.name,
            coolieRate,
            hsn: editP.hsn || "",
            taxRate: Number(editP.taxRate) || 0,
            unitId: editP.unitId,
            unitName: editP.unitName,
            unit: editP.unit,
            image: editP.image || "",
            isNew: !editP.originalQuantity || editP.originalQuantity === 0,
          };
        }

        const product =
          products.find((p) => String(p.id) === sid || String(p.Product_Id) === sid) ||
          allProducts.find((p) => String(p.id) === sid || String(p.Product_Id) === sid);
        if (product && product.name) {
          const packGet = parseFloat(product.packGet) || 1;
          const editedPrice = getEditedPrice(productId);
          const price = editedPrice !== null ? editedPrice : parseFloat(product.price) || 0;
          const kgs = qty * packGet;
          return {
            id: productId,
            name: product.name,
            shortName: product.shortName || product.Short_Name || product.name,
            quantity: qty,
            originalQuantity: 0,
            kgs,
            price,
            packGet,
            amount: price * kgs,
            Print_Name: product.name,
            coolieRate: liveProduct?.coolie ?? liveProduct?.coolieRate ?? liveProduct?.Coolie_Rate ?? liveProduct?.Coolie ?? product.coolie ?? product.coolieRate ?? product.Coolie_Rate ?? product.Coolie ?? 0,
            hsn: product.hsnCode || product.hsn || "",
            taxRate: Number(product.taxRate) || 0,
            unitId: product.unitId,
            unitName: product.unitName,
            unit: product.unit,
            image: product.image || "",
            isNew: true,
          };
        }

        return {
          id: productId,
          name: `Product ${productId}`,
          shortName: `Product ${productId}`,
          quantity: qty,
          originalQuantity: 0,
          kgs: qty,
          price: 0,
          packGet: 1,
          amount: 0,
          Print_Name: `Product ${productId}`,
          coolieRate: liveProduct?.coolie ?? liveProduct?.coolieRate ?? liveProduct?.Coolie_Rate ?? liveProduct?.Coolie ?? 0,
          hsn: "",
          taxRate: 0,
          isNew: true,
        };
      });
  }, [cartItems, products, allProducts]);

  const totalItems = enhancedCartItems.reduce((s, i) => s + i.quantity, 0);
  const totalKgs = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);
  const subtotalAmount = RoundNumber(enhancedCartItems.reduce((s, i) => s + i.amount, 0));

  const coolieExp = useMemo(() => {
    return enhancedCartItems.reduce((sum, item) => {
      const quantity = item.quantity || 0;


      const coolieRatePerKg = item.coolieRate || 0;
      return Addition(sum, Multiplication(coolieRatePerKg, quantity));
    }, 0);
  }, [enhancedCartItems]);


  const totalExpensesValue = useMemo(
    () => invoiceExpenses.reduce((acc, exp) => Addition(acc, parseFloat(exp.Expence_Value) || 0), 0),
    [invoiceExpenses]
  );


  const flatExpensesTotal = useMemo(
    () =>
      invoiceExpenses.reduce(
        (acc, exp) =>
          Number(exp.percentageValue) === 0 ? Addition(acc, parseFloat(exp.Expence_Value) || 0) : acc,
        0
      ),
    [invoiceExpenses]
  );

  const percentageBase = subtotalAmount;

  const grandTotal = useMemo(
    () => Addition(subtotalAmount, totalExpensesValue),
    [subtotalAmount, totalExpensesValue]
  );

  const handleSelectExpense = (index, expenseId) => {
    const prevExpId = invoiceExpenses[index]?.Expense_Id;
    if (prevExpId) {
      setManualExpenseEdits((prev) => {
        if (!(prevExpId in prev)) return prev;
        const next = { ...prev };
        delete next[prevExpId];
        return next;
      });
    }

    if (!expenseId) {
      setInvoiceExpenses((prev) =>
        prev.map((item, i) =>
          i === index
            ? { Expense_Id: "", Account_Name: "", Group_Name: "", percentageValue: 0, Expence_Value: "" }
            : item
        )
      );
      return;
    }

    const selected = expenseMaster.find((exp) => String(exp.Acc_Id) === String(expenseId));
    if (!selected) return;

    const accNameUpper = (selected.Account_Name || "").trim().toUpperCase();
    const groupNameUpper = (selected.Group_Name || "").trim().toUpperCase();
    const isCoolie = accNameUpper === "COOLIE EXPENSES";
    const isDiscount = accNameUpper.includes("DISCOUNT") || groupNameUpper.includes("DISCOUNT");

    const percentValue = Number(
      selected.percentageValue ??
      selected.percentage ??
      selected.Percentage ??
      selected.Percentage_Value ??
      selected.percentValue ??
      selected.Discount_Percentage ??
      0
    );

    setInvoiceExpenses((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        let value = "";

        if (isCoolie) {
          // Always use the directly computed coolie from current cart items
          value = RoundNumber(coolieExp);
        } else if (percentValue !== 0) {
          const calcVal = RoundNumber(getPercentage(percentageBase, Math.abs(percentValue)));
          value = isDiscount || percentValue < 0 ? -calcVal : calcVal;
        }

        return {
          ...item,
          Expense_Id: selected.Acc_Id,
          Account_Name: selected.Account_Name,
          Group_Name: selected.Group_Name,
          percentageValue: percentValue,
          Expence_Value: value,
        };
      })
    );
  };
  const handleExpenseValueChange = (index, value) => {
    if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) return;

    setInvoiceExpenses((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newItem = { ...item, Expence_Value: value };

          const isCoolie = (item.Account_Name || "").trim().toUpperCase() === "COOLIE EXPENSES";
          if (isCoolie) {
            newItem.baseCoolieValue = parseFloat(value) || 0;
          }
          return newItem;
        }
        return item;
      })
    );

    const expId = invoiceExpenses[index]?.Expense_Id;

    const isCoolie = (invoiceExpenses[index]?.Account_Name || "").trim().toUpperCase() === "COOLIE EXPENSES";
    if (expId && !isCoolie) {
      setManualExpenseEdits((prev) => ({ ...prev, [expId]: true }));
    }
  };


  // Force recalculation of expenses when cart items change in normal or edit mode
  useEffect(() => {
    if (Object.keys(cartItems).length === 0 && enhancedCartItems.length === 0) return;

    // Recalculate expenses based on current cart items
    setInvoiceExpenses((prev) => {
      let changed = false;
      let next = [...prev];

      // Find the existing Coolie row
      const coolieRowIndex = prev.findIndex(
        (row) => (row.Account_Name || "").trim().toUpperCase() === "COOLIE EXPENSES"
      );

      const totalCoolie = RoundNumber(coolieExp);

      if (coolieRowIndex >= 0) {
        const existingRow = next[coolieRowIndex];

        if (Number(existingRow.Expence_Value) !== totalCoolie) {
          next[coolieRowIndex] = {
            ...existingRow,
            Expence_Value: totalCoolie,
          };
          changed = true;
        }
      }

      // Recalculate percentage-based expenses (Discount, etc.) based on new subtotal
      next = next.map((row) => {
        if (!row.Expense_Id) return row;

        const accNameUpper = (row.Account_Name || "").trim().toUpperCase();
        const groupNameUpper = (row.Group_Name || "").trim().toUpperCase();
        const isCoolie = accNameUpper === "COOLIE EXPENSES";
        if (isCoolie) return row;

        const isDiscount = accNameUpper.includes("DISCOUNT") || groupNameUpper.includes("DISCOUNT");
        const pct = Number(row.percentageValue) || 0;
        const isPercentageExp = pct !== 0;

        if (!isPercentageExp && manualExpenseEdits[row.Expense_Id]) return row;

        if (pct === 0) return row;

        const calcVal = RoundNumber(getPercentage(percentageBase, Math.abs(pct)));
        const value = isDiscount || pct < 0 ? -calcVal : calcVal;
        if (Number(row.Expence_Value) === value) return row;
        changed = true;
        return { ...row, Expence_Value: value };
      });

      return changed ? next : prev;
    });
  }, [cartItems, enhancedCartItems, coolieExp, percentageBase, isEditingOrder, expenseMaster, manualExpenseEdits]);
  const addExpenseRow = () =>
    setInvoiceExpenses((prev) => [
      ...prev,
      { Expense_Id: "", Account_Name: "", Group_Name: "", percentageValue: 0, Expence_Value: "" },
    ]);

  const removeExpenseRow = (index) =>
    setInvoiceExpenses((prev) => prev.filter((_, i) => i !== index));

  const getAvailableOptionsForRow = (rowIndex) =>
    expenseMaster.filter((exp) => {
      if (String(exp.Acc_Id) === String(invoiceExpenses[rowIndex]?.Expense_Id)) return true;
      return !invoiceExpenses.some(
        (inv, idx) => idx !== rowIndex && String(inv.Expense_Id) === String(exp.Acc_Id)
      );
    });

  /* ---------------- Cart mutations ---------------- */

  const updateQty = (id, delta) => {
    const sid = String(id);
    setCartItems((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      let newCart;
      if (next === 0) {
        const { [id]: _removed, ...rest } = prev;
        newCart = rest;
      } else {
        newCart = { ...prev, [id]: next };
      }
      localStorage.setItem("cartItems", JSON.stringify(newCart));

      let cartOrder = [];
      try { cartOrder = JSON.parse(localStorage.getItem("cartItemOrder")) || []; } catch(e) {}
      const exists = cartOrder.includes(sid);
      if (next > 0 && !exists) {
        cartOrder.push(sid);
      } else if (next === 0 && exists) {
        cartOrder = cartOrder.filter(item => item !== sid);
      }
      localStorage.setItem("cartItemOrder", JSON.stringify(cartOrder));

      return newCart;
    });
  };

  const setItemQty = (id, qty) => {
    const sid = String(id);
    setCartItems((prev) => {
      const next = Math.max(0, qty);
      let newCart;
      if (next === 0) {
        const { [id]: _removed, ...rest } = prev;
        newCart = rest;
      } else {
        newCart = { ...prev, [id]: next };
      }
      localStorage.setItem("cartItems", JSON.stringify(newCart));

      let cartOrder = [];
      try { cartOrder = JSON.parse(localStorage.getItem("cartItemOrder")) || []; } catch(e) {}
      const exists = cartOrder.includes(sid);
      if (next > 0 && !exists) {
        cartOrder.push(sid);
      } else if (next === 0 && exists) {
        cartOrder = cartOrder.filter(item => item !== sid);
      }
      localStorage.setItem("cartItemOrder", JSON.stringify(cartOrder));

      return newCart;
    });
  };

  const removeItem = (id) => {
    const sid = String(id);
    const product = enhancedCartItems.find((p) => String(p.id) === sid);
    setCartItems((prev) => {
      const { [id]: _removed, ...rest } = prev;
      localStorage.setItem("cartItems", JSON.stringify(rest));

      let cartOrder = [];
      try { cartOrder = JSON.parse(localStorage.getItem("cartItemOrder")) || []; } catch(e) {}
      cartOrder = cartOrder.filter(item => item !== sid);
      localStorage.setItem("cartItemOrder", JSON.stringify(cartOrder));

      return rest;
    });
    if (product) toast.info(`Removed ${product.name}`);
  };

  const handleCancelEdit = () => {
    if (!window.confirm("Cancel this edit? Your changes will be lost.")) return;

    [
      "editOrderId",
      "editOrderData",
      "isEditingOrder",
      "editProductsList",
      "editCustomerOriginalName",
      "editBrokerId",
      "editBrokerName",
      "editTransporterId",
      "editTransporterName",
      "cartItemsBackup",
      "productsBackup",
      "cartItems",
      "selectedCustomerId",
      "selectedCustomer",
      "selectedCustomerData",
      "cartPageSelectedCustomer",
      "cartPageSelectedCustomerId",
      "cartPageCustomer",
      "cartPageContactNumber",
      "cartPageBroker",
      "cartPageTransporter",
      "cartPageShippingAddress",
      "cartPageDeliveryAddress",
      "cartPageDescription",
    ].forEach((key) => localStorage.removeItem(key));
    setOriginalProductIds(new Set());
    setCartItems({});
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
    setInvoiceExpenses([]);
    // FIX (Block 9): reset the manual-edit tracker when leaving edit mode.
    setManualExpenseEdits({});

    toast.success("Edit cancelled");
    navigate("/");
  };

  /* ---------------- Checkout ---------------- */

  const finishOrderCleanup = () => {
    [
      "cartItems",
      "cartItemsBackup",
      "previousCartItems",
      "products",
      "productsBackup",
      "productMapping",
      "editOrderId",
      "editOrderData",
      "editProductsList",
      "isEditingOrder",
      "editCustomerOriginalName",
      "editBrokerId",
      "editBrokerName",
      "editTransporterId",
      "editTransporterName",
      "selectedCustomer",
      "selectedCustomerId",
      "selectedCustomerData",
      "cartPageSelectedCustomer",
      "cartPageSelectedCustomerId",
      "cartPageCustomer",
      "cartPageContactNumber",
      "cartPageBroker",
      "cartPageTransporter",
      "cartPageShippingAddress",
      "cartPageDeliveryAddress",
      "cartPageDescription",
    ].forEach((key) => localStorage.removeItem(key));

    setCartItems({});
    setContactNumber("");
    setCustomer("");
    setSelectedDetails(null);
    setBrokerName("");
    setTransporter("");
    setShippingAddress("");
    setDeliveryAddress("");
    setDescription("");
    setInvoiceExpenses([]);
    // FIX (Block 10): reset the manual-edit tracker after checkout too.
    setManualExpenseEdits({});
    setSelectedBroker({ id: null, name: "" });
    setSelectedTransporter({ id: null, name: "" });
    setHeaderSelectedCustomer(null);
    setPrefilledCustomer(null);
    setIsPrintModalOpen(false);
    setLastOrderData(null);
    setStep(1);
    setOriginalProductIds(new Set());
    navigate("/", { replace: true });
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Sign in to place an order");
      setIsLoginPopupOpen(true);
      return;
    }
    if (enhancedCartItems.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    if (!customer) {
      toast.error("Select a customer");
      return;
    }
    if (!contactNumber) {
      toast.error("Enter a contact number");
      return;
    }

    const formattedDateTime = ISOStrings(new Date(), true);
    const formattedDateOnly = ISOStrings(new Date(), false);
    const parseData = safeParse("user", {});
    const storage = safeParse("user", {});

    const editOrderId = localStorage.getItem("editOrderId");
    const isEditing = Boolean(editOrderId);

    /* Tax was previously forced to 12% by `item.taxRate || 12`, so a 0% item
       posted an invoice 12% higher than the total shown on screen. A stated
       rate of 0 now means 0. */
    const lineTotals = enhancedCartItems.map((item) => {
      const taxRate = Number(item.taxRate) || 0;
      const taxableAmount = RoundNumber(item.kgs * item.price);
      const taxAmount = RoundNumber(taxableAmount * (taxRate / 100));
      return { item, taxRate, taxableAmount, taxAmount };
    });

    const totalBeforeTax = RoundNumber(lineTotals.reduce((s, l) => s + l.taxableAmount, 0));
    const totalTax = RoundNumber(lineTotals.reduce((s, l) => s + l.taxAmount, 0));
    const totalKgsValue = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);

    // FIX (Block 7): stop force-recomputing Coolie here — use exactly what's
    // on screen (invoiceExpenses), which the sync effect above now keeps
    // correct without clobbering manual edits.
    const Expence_Array = invoiceExpenses
      .filter((e) => e.Expense_Id)
      .map((e) => {
        const master = expenseMaster.find((m) => String(m.Acc_Id) === String(e.Expense_Id));
        return {
          Expense_Id: e.Expense_Id,
          Account_Name: e.Account_Name || master?.Account_Name || "",
          Group_Name: e.Group_Name || master?.Group_Name || "",
          Expence_Value: RoundNumber(e.Expence_Value),
        };
      });

    const expensesTotal = RoundNumber(
      Expence_Array.reduce((s, e) => s + (Number(e.Expence_Value) || 0), 0)
    );

    /* Expenses now reach the posted invoice value — the summary panel added
       them but the payload didn't. */
    const totalInvoiceValue = RoundNumber(totalBeforeTax + totalTax + expensesTotal);

    const Staff_Involved_List = [];

    const brokerIdNum = parseInt(selectedBroker?.id, 10);
    const finalBrokerId = !Number.isNaN(brokerIdNum) && brokerIdNum > 0 ? brokerIdNum : null;
    if (finalBrokerId) {
      Staff_Involved_List.push({ Involved_Emp_Id: finalBrokerId, Cost_Center_Type_Id: 3 });
    }

    const transporterIdNum = parseInt(selectedTransporter?.id, 10);
    const finalTransporterId =
      !Number.isNaN(transporterIdNum) && transporterIdNum > 0 ? transporterIdNum : null;
    if (finalTransporterId) {
      Staff_Involved_List.push({ Involved_Emp_Id: finalTransporterId, Cost_Center_Type_Id: 2 });
    }

    const customerName =
      selectedDetails?.customerName || headerSelectedCustomer?.name || selectedDetails?.billName || "";

    const generalInfo = {
      So_Date: formattedDateOnly,
      Retailer_Id: parseInt(customer, 10),
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
      Alter_Id: isEditing ? parseInt(editOrderId, 10) : 0,
      ...(isEditing && { So_Id: parseInt(editOrderId, 10) }),
      Customer_Name: customerName,
      Ord_Mobile_No: contactNumber,
      Broker_Name: selectedBroker?.name || "",
      Broker_Id: finalBrokerId,
      Transporter_Name: selectedTransporter?.name || "",
      Transporter_Id: finalTransporterId,
      Shipp_Address: shippingAddress || selectedDetails?.address || "",
      Deliv_Address: deliveryAddress || shippingAddress || selectedDetails?.address || "",
      Total_Kgs: totalKgsValue.toFixed(2),
      Total_Items: enhancedCartItems.length,
      Staff_Involved_List,
      Expence_Array,
    };

    const stockInfo = lineTotals.map(({ item, taxRate, taxableAmount, taxAmount }, index) => {
      const cgstSgstRate = taxRate / 2;
      const cgstSgstAmount = RoundNumber(taxAmount / 2);
      return {
        So_Date: formattedDateOnly,
        S_No: index + 1,
        Item_Id: parseInt(item.id, 10),
        Bill_Qty: item.kgs.toFixed(2),
        Taxable_Rate: item.price.toFixed(2),
        Item_Rate: item.price.toFixed(2),
        Amount: taxableAmount.toFixed(2),
        Free_Qty: "0.00",
        Total_Qty: String(item.quantity),
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
        Final_Amo: RoundNumber(taxableAmount + taxAmount).toFixed(2),
        Created_on: formattedDateTime,
        Product_Id: parseInt(item.id, 10),
        Product_Name: item.name,
        Quantity: item.quantity,
        Price: item.price,
        Total: taxableAmount.toFixed(2),
        Weight: String(item.kgs),
        Unit: item.unit || "",
        PackGet: item.packGet || 1,
        ...(isEditing && { So_Id: parseInt(editOrderId, 10) }),
      };
    });

    const saleData = {
      generalInfo,
      stockInfo,
      totalAmount: totalInvoiceValue,
      totalItems: enhancedCartItems.length,
      totalKgs: totalKgsValue.toFixed(2),
      customerId: customer,
      customerName,
      contactNumber,
      brokerName: selectedBroker?.name || "",
      transporter: selectedTransporter?.name || "",
      shippingAddress,
      deliveryAddress,
      description,
      Created_by: parseData?.UserId || parseData?.user_id || "0",
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 1,
    };

    const loadingToast = toast.loading(isEditing ? "Updating order…" : "Placing order…");

    try {
      const response = await fetchLink({
        address: `sales/salesInvoice/Whatsapp`,
        method: isEditing ? "PUT" : "POST",
        bodyData: saleData,
      });

      toast.dismiss(loadingToast);

      if (!response?.success) {
        toast.error(response?.message || `Couldn't ${isEditing ? "update" : "place"} the order`);
        return;
      }

      toast.success(isEditing ? `Order #${editOrderId} updated` : "Order placed");

      const partyMailingAddress =
        selectedDetails?.partyMailingAddress ||
        selectedDetails?.address ||
        shippingAddress ||
        headerSelectedCustomer?.partyMailingAddress ||
        "";

      const customerData = {
        Billl_Name: selectedDetails?.billName || customerName,
        Short_Name: headerSelectedCustomer?.name || customerName,
        Party_Location:
          selectedDetails?.partyMailingAddress ||
          selectedDetails?.address ||
          headerSelectedCustomer?.address ||
          "",
        City: headerSelectedCustomer?.city || selectedDetails?.city || "",
        Mobile_No: contactNumber || headerSelectedCustomer?.mobile || selectedDetails?.mobileNo || "",
        Land_Line: "",
        Transporter: selectedTransporter?.name || "",
        Broker: selectedBroker?.name || "",
        Party_Mailing_Name:
          selectedDetails?.billName ||
          selectedDetails?.partyMailingName ||
          headerSelectedCustomer?.billName ||
          customerName,
        Party_Mailing_Address: partyMailingAddress,
        billName: selectedDetails?.billName || "",
      };

      setLastOrderData({
        saleData,
        responseData: response.data,
        customerData,
        printCartItems: enhancedCartItems.map((item) => ({
          ...item,
          Print_Name: item.name,
          kgs: item.kgs || 0,
          price: item.price || 0,
          packGet: item.packGet || 1,
        })),
        totals: {
          subtotal: subtotalAmount,
          tax: totalTax,
          total: totalInvoiceValue,
          totalItems: enhancedCartItems.length,
          totalKgs: totalKgsValue,
        },
        // FIX (Block 8): stop force-recomputing Coolie in the print payload —
        // use exactly what's on screen, same as Block 7.
        expenses: invoiceExpenses
          .filter((e) => e.Expense_Id && e.Account_Name)
          .map((e) => ({
            Account_Name: e.Account_Name,
            Expence_Value: RoundNumber(e.Expence_Value),
          })),
      });


      setIsPrintModalOpen(true);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", error);
      toast.error(`Couldn't ${isEditing ? "update" : "place"} the order: ${error.message || "unknown error"}`);
    }
  };

  /* ---------------- Screens ---------------- */

  if (showSaleOrders) {
    return (
      <SaleOrders
        onBack={handleBackFromSaleOrders}
        onDashboard={() => {
          setShowSaleOrders(false);
          setShowDashboard(true);
        }}
        onEditOrder={(editData) => {
          localStorage.setItem("editOrderData", JSON.stringify(editData));
          localStorage.setItem("isEditingOrder", "true");

          if (editData.customerDetails) {
            const customerData = editData.customerDetails;
            localStorage.setItem("selectedCustomer", JSON.stringify(customerData));
            localStorage.setItem("selectedCustomerId", String(customerData.id));
            localStorage.setItem("cartPageSelectedCustomer", JSON.stringify(customerData));
            localStorage.setItem("cartPageSelectedCustomerId", String(customerData.id));
            localStorage.setItem("cartPageCustomer", String(customerData.id));
          }

          // Apply directly instead of racing a setTimeout against React state.
          setCartItems(editData.cartItems || {});
          localStorage.setItem("cartItems", JSON.stringify(editData.cartItems || {}));
          localStorage.setItem("editProductsList", JSON.stringify(editData.productsList || []));

          setCustomer(String(editData.customerId || ""));
          setContactNumber(editData.contactNumber || "");
          setBrokerName(editData.brokerName || "");
          setTransporter(editData.transporterName || "");
          setShippingAddress(editData.shippingAddress || "");
          setDeliveryAddress(editData.deliveryAddress || "");
          setDescription(editData.description || "");
          setInvoiceExpenses(Array.isArray(editData.expenses) ? editData.expenses : []);
          setManualExpenseEdits({});

          if (editData.brokerId && editData.brokerName) {
            setSelectedBroker({ id: editData.brokerId, name: editData.brokerName });
          }
          if (editData.transporterId && editData.transporterName) {
            setSelectedTransporter({ id: editData.transporterId, name: editData.transporterName });
          }
          if (editData.customerDetails) {
            setHeaderSelectedCustomer(editData.customerDetails);
            setPrefilledCustomer({
              id: editData.customerDetails.id,
              name: editData.customerDetails.name,
            });
            setSelectedDetails({
              customerId: String(editData.customerDetails.id),
              customerName: editData.customerDetails.name,
              mobileNo: editData.customerDetails.mobile || "",
              address: editData.customerDetails.address || "",
              city: editData.customerDetails.city || "",
              broker: editData.brokerName || "",
              Broker_Id: editData.brokerId || "",
              transporter: editData.transporterName || "",
              Transporter_Id: editData.transporterId || "",
            });
          }

          setShowSaleOrders(false);
          if (isMobile) setStep(2);
          toast.success(`Order #${editData.orderNumber} opened for editing`);
        }}
      />
    );
  }

  if (showDashboard) {
    return (
      <Dashboard
        isMobile={isMobile}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userType={userType}
        customers={customers}
        allProducts={allProducts}
        onLoginClick={() => setIsLoginPopupOpen(true)}
        onLogout={handleLogout}
        onHome={handleBackFromDashboard}
        onSaleOrders={() => {
          setShowDashboard(false);
          setShowSaleOrders(true);
        }}
        activeTab="dashboard"
      />
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: BG_COLOR,
        }}
      >
        <div style={{ color: BROWN, fontSize: "18px" }}>Loading cart…</div>
      </div>
    );
  }

  /* ---------------- Shared render pieces ---------------- */

  const commonHeaderCustomerProps = {
    showCustomerSelector: isLoggedIn && customers.length > 0,
    customers,
    selectedCustomer: headerSelectedCustomer,
    onCustomerSelect: handleHeaderCustomerSelect,
    loadingCustomers,
    userType,
  };

  const labelStyle = {
    display: "block",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "6px",
  };
  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: isMobile ? "10px" : "12px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  };
  const textareaStyle = {
    ...inputStyle,
    minHeight: isMobile ? "70px" : "100px",
    resize: "vertical",
    fontFamily: "inherit",
  };
  const fgStyle = { marginBottom: isMobile ? "16px" : "20px" };

  const renderThreeDotsMenu = () => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setCartHeaderMenuOpen((prev) => !prev)}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "8px" : "12px",
          borderRadius: "50%",
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

  /* Called as a function, not rendered as <OrderForm />. Rendering it as a
     component recreated the type on every keystroke, so React unmounted and
     remounted the inputs and focus was lost after each character. */
  const renderOrderForm = () => (
    <>
      <div style={fgStyle}>
        <label style={labelStyle}>Customer</label>
        <SearchableCustomerSelect
          value={customer}
          onChange={setCustomer}
          onCustomerSelect={handleCustomerSelect}
          prefilledCustomer={prefilledCustomer}
        />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Broker</label>
        <PartyDropdown
          label="Broker"
          selected={selectedBroker}
          onSelect={(b) => {
            setSelectedBroker(b);
            setBrokerName(b.name);
          }}
          options={availableBrokers}
          loading={loadingBrokers}
          onOpen={fetchBrokers}
        />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Transporter</label>
        <PartyDropdown
          label="Transporter"
          selected={selectedTransporter}
          onSelect={(t) => {
            setSelectedTransporter(t);
            setTransporter(t.name);
          }}
          options={availableTransporters}
          loading={loadingTransporters}
          onOpen={fetchTransporters}
        />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Contact number</label>
        <input
          type="tel"
          placeholder="Contact number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Shipping address</label>
        <textarea
          placeholder="Shipping address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          style={textareaStyle}
        />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Delivery address</label>
        <textarea
          placeholder="Delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          style={textareaStyle}
        />
      </div>
      <div style={fgStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          placeholder="Notes for this order"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={textareaStyle}
        />
      </div>
    </>
  );

  const renderExpenseRow = (row, index) => {
    // Remove the isDisabledInput check - allow all expenses to be editable
    return (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          padding: "10px",
          background: "#f9f4ef",
          borderRadius: "8px",
          border: "1px solid #e8ddd4",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={row.Expense_Id}
          onChange={(e) => handleSelectExpense(index, e.target.value)}
          style={{
            flex: "1 1 160px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "13px",
            outline: "none",
            background: "#fff",
          }}
        >
          <option value="">Select an expense</option>
          {getAvailableOptionsForRow(index).map((exp) => (
            <option key={exp.Acc_Id} value={exp.Acc_Id}>
              {exp.Account_Name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={row.Expence_Value}
          // REMOVE: disabled={isDisabledInput}
          onChange={(e) => handleExpenseValueChange(index, e.target.value)}
          placeholder="0.00"
          style={{
            width: "90px",
            padding: "8px",
            border: `1px solid ${BROWN}`,
            borderRadius: "6px",
            fontSize: "13px",
            textAlign: "right",
            outline: "none",
            background: "#fff",
          }}
        />

        <button
          onClick={() => removeExpenseRow(index)}
          style={{
            background: "transparent",
            border: "none",
            color: "#e74c3c",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ✕
        </button>
      </div>
    );
  };

  const cartRowProps = {
    isMobile,
    products,
    allProducts,
    setProducts,
    setAllProducts,
    updateQty,
    setItemQty,
    removeItem,
  };

  /* Rendered in every branch — on mobile the modal used to be missing, so the
     order posted and nothing printed. */
  const printModal = (
    <PrintPreviewModal
      open={isPrintModalOpen}
      onClose={() => {
        if (lastOrderData) finishOrderCleanup();
        else setIsPrintModalOpen(false);
      }}
      customer={lastOrderData?.customerData}
      cartItems={lastOrderData?.printCartItems}
      totals={lastOrderData?.totals}
      expenses={lastOrderData?.expenses}
      storage={safeParse("user", {})}
      onPrintAndSave={async () => true}
      onPrinted={finishOrderCleanup}
      autoPrint={Boolean(lastOrderData)}
    />
  );

  /* ---------------- Mobile: order details ---------------- */

  // Mobile: order details
  if (isMobile && step === 2) {
    return (
      <>
        <CommonHeader
          title="Order details"
          logo="SMT"
          showSearch={false}
          showCart={false}
          showBackButton
          showTitle
          cartItemCount={0}
          onBackClick={() => setStep(1)}
          isMobile={isMobile}
          backgroundColor={BROWN_DARK}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onSaleOrders={handleSaleOrdersClick}
          {...commonHeaderCustomerProps}
          customActions={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderThreeDotsMenu()}
            </div>
          }
        />

        <div style={{ padding: "20px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "120px" }}>
          {renderOrderForm()}

          {/* Expense Section - Added for mobile view */}
          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Expenses</label>
              <button
                onClick={addExpenseRow}
                disabled={expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length}
                style={{
                  background: BROWN,
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length
                    ? "not-allowed"
                    : "pointer",
                  opacity: expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length ? 0.5 : 1,
                }}
              >
                + Add expense
              </button>
            </div>

            {loadingExpenseMaster && (
              <div style={{ padding: "8px", textAlign: "center" }}>
                <CircularProgress size={16} style={{ color: BROWN }} />
              </div>
            )}

            {invoiceExpenses.map((row, index) => renderExpenseRow(row, index))}

            {invoiceExpenses.length === 0 && (
              <div style={{
                padding: "12px",
                textAlign: "center",
                color: "#999",
                fontSize: "13px",
                background: "#f9f4ef",
                borderRadius: "8px",
                border: "1px dashed #ddd",
              }}>
                No expenses added
              </div>
            )}
          </div>

          <div
            style={{
              background: "#f9f4ef",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              color: BROWN,
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                paddingBottom: "8px",
                borderBottom: "1px dashed #ccc",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Products</span>
              <span
                style={{ color: BROWN, cursor: "pointer" }}
                onClick={() => {
                  setCartItems({});
                  localStorage.removeItem("cartItems");
                  localStorage.removeItem("cartItemOrder");
                  setStep(1);
                }}
              >
                Clear
              </span>
            </div>
            {enhancedCartItems.map((item) => (
              <CartItemRow key={item.id} item={item} {...cartRowProps} />
            ))}

            {/* Expense breakdown in summary */}
            {invoiceExpenses.filter(e => e.Account_Name && e.Expence_Value).length > 0 && (
              <>
                <div
                  style={{
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px dashed #ccc",
                  }}
                >

                  {/* FIX (Block 11): show the row's actual Expence_Value directly —
    the previous version force-displayed `coolieExp` for the Coolie row,
    which could differ from what was actually stored/about to be saved. */}
                  {invoiceExpenses
                    .filter(e => e.Account_Name && e.Expence_Value)
                    .map((e, idx) => {
                      const displayValue = Number(e.Expence_Value) || 0;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ color: "#666" }}>{e.Account_Name}</span>
                          <span style={{ color: Number(displayValue) < 0 ? "#e74c3c" : "#2ecc71" }}>
                            {Number(displayValue) < 0 ? "-" : ""}₹{Math.abs(Number(displayValue) || 0).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px dashed #ccc",
                fontWeight: "bold",
              }}
            >
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                padding: "18px 12px",
                background: isEditingOrder ? ACCENT : BROWN,
                color: isEditingOrder ? BROWN_DARK : "#fff",
                border: "none",
                borderRadius: "50px",
                fontSize: "18px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(74,44,26,0.2)",
              }}
            >
              {isEditingOrder ? "Update order" : "Place order"}
            </button>

            {isEditingOrder && (
              <button
                onClick={handleCancelEdit}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </div>

        {printModal}
        <LoginPopup
          isOpen={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        <MobileTabBar
          activeTab="home"
          onHome={() => navigate("/")}
          onSaleOrders={handleSaleOrdersClick}
          onDashboard={handleDashboard}
        />
      </>
    );
  }

  /* ---------------- Mobile: cart ---------------- */

  if (isMobile && step === 1) {
    return (
      <>
        <CommonHeader
          title="SM Traders"
          logo="SMT"
          showSearch={false}
          showCart={false}
          showBackButton
          showTitle
          cartItemCount={0}
          onBackClick={() => navigate("/")}
          isMobile={isMobile}
          backgroundColor={BROWN_DARK}
          isLoggedIn={isLoggedIn}
          userName={userName}
          {...commonHeaderCustomerProps}
          customActions={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderThreeDotsMenu()}
            </div>
          }
        />

        <div style={{ padding: "12px 16px", background: BG_COLOR, minHeight: "100vh", paddingBottom: "194px" }}>
          {enhancedCartItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: "16px",
                marginTop: "20px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
              <p style={{ color: "#666", fontSize: "16px", marginBottom: "16px" }}>Nothing in the cart yet</p>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: BROWN,
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Browse products
              </button>
            </div>
          ) : (
            enhancedCartItems.map((item) => <CartItemRow key={item.id} item={item} {...cartRowProps} />)
          )}
        </div>

        {enhancedCartItems.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#fff",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
              padding: "12px 16px",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              borderTop: `2px solid ${BROWN_DARK}`,
              zIndex: 1000,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
              <div>
                <div>{totalItems} items</div>
                <div style={{ fontSize: "12px", color: "#666" }}>Total: {totalKgs.toFixed(2)} kg</div>
              </div>
              <div style={{ textAlign: "right", fontWeight: "bold", color: BROWN }}>
                ₹{subtotalAmount.toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: BROWN_DARK,
                  color: "#fff",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Continue →
              </button>
              {isEditingOrder && (
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: "14px 20px",
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {printModal}
        <LoginPopup
          isOpen={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  /* ---------------- Desktop ---------------- */

  return (
    <>
      <CommonHeader
        title="SM Traders"
        logo="SMT"
        showSearch={false}
        showCart={false}
        showBackButton
        showTitle
        cartItemCount={0}
        onBackClick={() => navigate("/")}
        isMobile={isMobile}
        backgroundColor={BROWN_DARK}
        userName={userName}
        isLoggedIn={isLoggedIn}
        {...commonHeaderCustomerProps}
        customActions={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{renderThreeDotsMenu()}</div>
        }
      />

      {printModal}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px 40px",
          background: BG_COLOR,
          minHeight: "100vh",
        }}
      >
        {enhancedCartItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>Nothing in the cart yet</p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: BROWN,
                color: "#fff",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Browse products
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "32px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                padding: "24px",
                overflowY: "auto",
                maxHeight: "calc(100vh - 140px)",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: BROWN,
                  margin: "0 0 20px 0",
                  paddingBottom: "14px",
                  borderBottom: `3px solid ${ACCENT}`,
                }}
              >
                Order summary
              </h2>

              {enhancedCartItems.map((item) => (
                <CartItemRow key={item.id} item={item} {...cartRowProps} />
              ))}

              <div style={{ marginTop: "16px", marginBottom: "4px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Expenses</label>
                  <button
                    onClick={addExpenseRow}
                    disabled={expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length}
                    style={{
                      background: BROWN,
                      color: "#fff",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor:
                        expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        expenseMaster.length === 0 || invoiceExpenses.length >= expenseMaster.length ? 0.5 : 1,
                    }}
                  >
                    + Add expense
                  </button>
                </div>

                {loadingExpenseMaster && (
                  <div style={{ padding: "8px", textAlign: "center" }}>
                    <CircularProgress size={16} style={{ color: BROWN }} />
                  </div>
                )}

                {invoiceExpenses.map((row, index) => renderExpenseRow(row, index))}
              </div>

              <div
                style={{
                  marginTop: "12px",
                  padding: "16px",
                  background: "#f9f4ef",
                  borderRadius: "12px",
                  border: "1px solid #e8ddd4",
                }}
              >
                {[
                  ["Total items", totalItems],
                  ["Total kgs", `${totalKgs.toFixed(2)} kg`],
                  ["Subtotal", `₹${subtotalAmount.toFixed(2)}`],
                  ...invoiceExpenses
                    .filter((e) => e.Account_Name)
                    .map((e) => [
                      e.Account_Name,
                      `${Number(e.Expence_Value) < 0 ? "-" : ""}₹${Math.abs(
                        Number(e.Expence_Value) || 0
                      ).toFixed(2)}`,
                    ]),
                  ["Total", `₹${grandTotal.toFixed(2)}`],
                ].map(([label, value], idx) => (
                  <div
                    key={`${label}-${idx}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: label === "Total" ? "15px" : "13px",
                      color: label === "Total" ? BROWN_DARK : "#666",
                      marginBottom: "6px",
                      fontWeight: label === "Total" ? "bold" : "normal",
                    }}
                  >
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  onClick={handleCheckout}
                  style={{
                    flex: 2,
                    padding: "18px",
                    background: isEditingOrder ? ACCENT : BROWN,
                    color: isEditingOrder ? BROWN_DARK : "#fff",
                    border: "none",
                    borderRadius: "50px",
                    fontSize: "18px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(74,44,26,0.2)",
                  }}
                >
                  {isEditingOrder ? "Update order" : "Place order"}
                </button>
                {isEditingOrder && (
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                padding: "32px",
                overflowY: "auto",
                maxHeight: "calc(100vh - 140px)",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: BROWN,
                  margin: "0 0 24px 0",
                  paddingBottom: "14px",
                  borderBottom: `3px solid ${ACCENT}`,
                }}
              >
                Order details
              </h2>

              {creditInfo && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "10px 12px",
                    background: "#fff3f3",
                    border: "1px solid #e0b8b8",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "24px",
                  }}
                >
                  <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px" }}>
                    Outstanding: ₹{parseFloat(creditInfo.outstanding || 0).toFixed(2)}
                  </div>
                  <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px" }}>
                    Credit limit:{" "}
                    {parseFloat(creditInfo.creditLimit || 0) === 0
                      ? "Unlimited"
                      : `₹${parseFloat(creditInfo.creditLimit).toFixed(2)}`}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Customer</label>
                    <SearchableCustomerSelect
                      value={customer}
                      onChange={setCustomer}
                      onCustomerSelect={handleCustomerSelect}
                      prefilledCustomer={prefilledCustomer}
                    />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Broker</label>
                    <PartyDropdown
                      label="Broker"
                      selected={selectedBroker}
                      onSelect={(b) => {
                        setSelectedBroker(b);
                        setBrokerName(b.name);
                      }}
                      options={availableBrokers}
                      loading={loadingBrokers}
                      onOpen={fetchBrokers}
                    />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Shipping address</label>
                    <textarea
                      placeholder="Shipping address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      style={textareaStyle}
                    />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      placeholder="Notes for this order"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={textareaStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Transporter</label>
                    <PartyDropdown
                      label="Transporter"
                      selected={selectedTransporter}
                      onSelect={(t) => {
                        setSelectedTransporter(t);
                        setTransporter(t.name);
                      }}
                      options={availableTransporters}
                      loading={loadingTransporters}
                      onOpen={fetchTransporters}
                    />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Contact number</label>
                    <input
                      type="tel"
                      placeholder="Contact number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={fgStyle}>
                    <label style={labelStyle}>Delivery address</label>
                    <textarea
                      placeholder="Delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      style={textareaStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Print                                                               */
/* ------------------------------------------------------------------ */

const QuotationPrint = forwardRef(({ customer, cartItems, totals, storage, createdOn, orderDate, expenses }, ref) => {
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const rupee = (n) =>
    safeNum(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const items = Array.isArray(cartItems) ? cartItems : [];
  const expenseRows = (Array.isArray(expenses) ? expenses : []).filter(
    (e) => e && (e.Account_Name || e.Expence_Name) && Number(e.Expence_Value) !== 0
  );

  const packWeight = parseFloat(items.Print_Name?.match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]) || 0;
  const bags = packWeight > 0 ? safeNum(items.kgs) / packWeight : 0;

  const packWeightOf = (item) => {
    const fromName = parseFloat(
      String(item.shortName || item.Print_Name || item.name || "").match(/(\d+(?:\.\d+)?)\s*KG/i)?.[1]
    );
    return fromName || safeNum(item.packGet) || 0;
  };
  const totalKgs = items.reduce((sum, item) => sum + safeNum(item.kgs), 0);
  const totalBags = items.reduce((sum, item) => {
    const pw = packWeightOf(item);
    return sum + (pw ? safeNum(item.kgs) / pw : 0);
  }, 0);

  const formatStamp = (value) => {
    const pad = (n) => String(n).padStart(2, "0");
    const render = (d) => {
      let hours = d.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${hours}:${pad(
        d.getMinutes()
      )} ${ampm}`;
    };

    if (value instanceof Date && !Number.isNaN(value.getTime())) return render(value);

    if (typeof value === "string" && value.trim()) {
      // "YYYY-MM-DD HH:MM:SS" is parsed manually — Safari rejects it.
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
      if (match) {
        const [, y, m, d, hh = "0", mm = "0"] = match;
        const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm));
        if (!Number.isNaN(parsed.getTime())) return render(parsed);
      }
      const fallback = new Date(value);
      if (!Number.isNaN(fallback.getTime())) return render(fallback);
    }
    return render(new Date());
  };

  const stamp = formatStamp(createdOn || orderDate);

  const labelRowStyle = {
    fontWeight: 800,
    marginBottom: "2px",
    display: "flex",
    alignItems: "flex-start",
    wordBreak: "break-word",
  };
  const labelStyle = { minWidth: "13ch", whiteSpace: "pre" };

  return (
    <>
      <style>
        {`
          @media print {
            @page { size: 80mm auto; margin: 0mm; }
            body * { visibility: hidden; }
            #print-section, #print-section * { visibility: visible; }
            #print-section {
              position: absolute; left: 0; top: 0;
              width: 80mm; margin: 0; padding: 2mm;
            }
            .print-container { width: 80mm !important; margin: 0 auto !important; }
            table { width: 100% !important; page-break-inside: avoid; }
            tr, td, th { page-break-inside: avoid; }
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
          <span style={{ fontWeight: 1000, fontSize: "14px" }}>{stamp}</span>
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
          <div style={{ ...labelRowStyle, fontWeight: 900 }}>
            <span style={labelStyle}>PARTY NAME : </span>
            <span style={{ flex: 1, wordBreak: "break-word" }}>
              {customer?.Party_Mailing_Name || customer?.billName || customer?.Billl_Name || "—"}
            </span>
          </div>
          <div style={labelRowStyle}>
            <span style={labelStyle}>LOCATION  : </span>
            <span style={{ flex: 1 }}>{customer?.Party_Location || "—"}</span>
          </div>
          <div style={labelRowStyle}>
            <span style={labelStyle}>PH.NO     : </span>
            <span style={{ flex: 1 }}>{customer?.Mobile_No || customer?.Land_Line || "—"}</span>
          </div>
          <div style={labelRowStyle}>
            <span style={labelStyle}>TRANSPORT : </span>
            <span style={{ flex: 1 }}>{customer?.Transporter || "—"}</span>
          </div>
          <div style={{ ...labelRowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>BROKER    : </span>
            <span style={{ flex: 1 }}>{customer?.Broker || "—"}</span>
          </div>
        </div>

        <div style={{ border: "0.5px solid #000" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    width: "25mm",
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
                    width: "45mm",
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
                    width: "10mm",
                  }}
                >
                  BAGS
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0
                ? [...items].sort((a, b) => (b.shortName || b.Print_Name || "").localeCompare(a.shortName || a.Print_Name || "")).map((item, i) => {
                  const pw = packWeightOf(item);
                  const bags = pw > 0 ? safeNum(item.kgs) / pw : 0;
                  return (
                    <tr key={i}>
                      <td
                        style={{
                          border: "0.5px solid #000",
                          padding: "2mm 1mm",
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontSize: "14px",
                        }}
                      >
                        ₹{rupee(item.price)}
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #000",
                          textAlign: "left",
                          padding: "0 1.5mm",
                          verticalAlign: "middle",
                          fontSize: "12px",
                          wordBreak: "break-word",
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
                        }}
                      >
                        {bags > 0 ? bags.toFixed(0) : "0"}
                      </td>
                    </tr>
                  );
                })
                : Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td style={{ border: "0.5px solid #000", padding: "2px" }} />
                    <td style={{ border: "0.5px solid #000", padding: "2px" }} />
                    <td style={{ border: "0.5px solid #000", padding: "2px" }} />
                  </tr>
                ))}

            </tbody>

          </table>
          {expenseRows.length > 0 && (
            <div style={{ padding: "1mm" }}>
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
            <span>₹{rupee(totals?.total ?? totals?.subtotal)}</span>
            <span>{totalKgs.toFixed(2)} KGS</span>
            <span>{totalBags.toFixed(0)} BAGS</span>
          </div>
        </div>
      </div>
    </>
  );
});

QuotationPrint.displayName = "QuotationPrint";

const PrintPreviewModal = ({
  open,
  onClose,
  customer,
  cartItems,
  totals,
  expenses,
  onPrintAndSave,
  storage,
  isReprint = false,
  createdOn,
  orderDate,
  onPrinted,
}) => {
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleReactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QuotationBill",
    pageStyle: `
      @page { size: 80mm auto; margin: 0mm; }
      @media print { body { margin: 0; padding: 0; } }
    `,
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast.success("Sent to the printer");
      if (onPrinted) onPrinted();
    },
    onPrintError: (error) => {
      setIsPrinting(false);
      console.error("Print error:", error);
      toast.error("Printing failed");
    },
  });

  const handlePrintClick = async () => {
    setIsPrinting(true);
    try {
      if (isReprint) {
        handleReactPrint();
        return;
      }
      const saved = await onPrintAndSave();
      if (saved) handleReactPrint();
      else setIsPrinting(false);
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Couldn't print this order");
      setIsPrinting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" || !isPrinting) onClose();
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{ style: { margin: "10px", width: "calc(100% - 20px)", maxWidth: "500px" } }}
    >
      <DialogTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
        {isReprint ? "Reprint quotation" : "Quotation preview"}
      </DialogTitle>

      <DialogContent
        style={{
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "inline-block" }}>
          <QuotationPrint
            ref={printRef}
            customer={customer}
            cartItems={cartItems}
            totals={totals}
            expenses={expenses}
            storage={storage}
            createdOn={createdOn}
            orderDate={orderDate}
          />
        </div>
      </DialogContent>

      <DialogActions style={{ padding: "16px" }}>
        <Button onClick={onClose} variant="outlined" disabled={isPrinting}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handlePrintClick}
          disabled={isPrinting}
          style={{ fontWeight: "bold", backgroundColor: BROWN_DARK }}
        >
          {isPrinting ? "Printing…" : "Print"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ */
/* Mobile tab bar                                                      */
/* ------------------------------------------------------------------ */

function MobileTabBar({ activeTab, onSaleOrders, onDashboard, onHome }) {
  const navigate = useNavigate();

  const tabs = [
    { key: "home", label: "Home", icon: "🏠", onClick: onHome || (() => navigate("/")) },
    { key: "dashboard", label: "Dashboard", icon: "📊", onClick: onDashboard },
    { key: "saleOrders", label: "Sale orders", icon: "📋", onClick: onSaleOrders },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTop: "1px solid #e8ddd4",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
        zIndex: 1100,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => {
              if (tab.key === "home") {
                localStorage.removeItem("isEditingOrder");
                localStorage.removeItem("editOrderData");
                localStorage.removeItem("editOrderId");
              }
              // Guard: a missing handler used to throw on tap.
              if (typeof tab.onClick === "function") tab.onClick();
            }}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "4px 0",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "20px" }}>{tab.icon}</span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? BROWN_DARK : "#999",
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                position: "absolute",
                bottom: "-8px",
                width: "24px",
                height: "3px",
                borderRadius: "2px",
                background: isActive ? BROWN_DARK : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard({
  isMobile,
  isLoggedIn,
  userName,
  userType,
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
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showPendingBills, setShowPendingBills] = useState(false);

  const handleTransactionClick = () => {
    setShowTransactionDetails(true);
  };

  const handlePendingBillsClick = () => {
    setShowPendingBills(true);
  };

  const fetchDashboardStats = async () => {
    try {
      const userData = safeParse("user", {});
      const sessionData = safeParse("session", {});
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

      const transactionResponse = await fetchLink({
        address: `sales/transactions/count?Created_by=${userId}`,
        method: 'GET',
      });
      if (transactionResponse?.success) {
        setTransactions(transactionResponse.data?.count || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchTodayOrders = async () => {
      setLoading(true);
      try {
        const userData = safeParse("user", {});
        const sessionData = safeParse("session", {});
        const userId = userData.UserId || userData.user_id || userData.User_Id || "";
        const mobileNo = getStoredUsername();
        const usertypeid =
          userData.UserTypeId || userData.user_type_id || userData.User_Type_Id || sessionData?.userTypeId || "";
        const today = toLocalYMD(new Date());

        const response = await fetchLink({
          address: `sales/salesOrder/list?Created_by=${encodeURIComponent(
            userId
          )}&Mobile_No=${encodeURIComponent(mobileNo)}&FromDate=${today}&ToDate=${today}&UserTypeId=${encodeURIComponent(
            usertypeid
          )}`,
          method: "GET",
        });

        if (cancelled) return;
        const orderData = response?.success ? response.data || response.Data || [] : [];
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching dashboard orders:", error);
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTodayOrders();
    fetchDashboardStats();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const groups = new Set(allProducts.map((p) => (p.Stock_Group || "").trim()).filter(Boolean));
      setStockGroupsCount(groups.size);
    }
  }, [allProducts]);

  const todaysRevenue = orders.reduce((s, o) => s + (parseFloat(o.Total_Invoice_value) || 0), 0);
  const todaysOrders = orders.length;
  const todaysKgs = orders.reduce(
    (sum, o) =>
      sum + (o.Products_List || []).reduce((s, p) => s + (parseFloat(p.Bill_Qty) || 0), 0),
    0
  );
  const totalCustomers = (customers || []).length;

  const rupee = (n) =>
    (Number.isFinite(Number(n)) ? Number(n) : 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const statCards = [
    { label: "Orders today", value: loading ? "—" : todaysOrders, icon: "📦", iconBg: "#f0e9e2", color: BROWN_DARK },
    { label: "Pending Bills", value: loading ? "—" : pendingBills, icon: "📋", iconBg: "#fef3e2", color: "#e67e22", onClick: handlePendingBillsClick },
    { label: "Transactions", value: loading ? "—" : transactions, icon: "💰", iconBg: "#e2f0f0", color: "#2980b9", onClick: handleTransactionClick },
    { label: "Kgs sold today", value: loading ? "—" : `${todaysKgs.toFixed(0)} kg`, icon: "⚖️", iconBg: "#f0e6d8", color: BROWN_DARK },
  ];

  if (showTransactionDetails) {
    return <TransactionDetails onBack={() => setShowTransactionDetails(false)} isMobile={isMobile} isModal={!isMobile} />;
  }

  if (showPendingBills) {
    return <PendingBillDetails onBack={() => setShowPendingBills(false)} />;
  }

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: "#f5f0eb",
        minHeight: "100vh",
        paddingBottom: isMobile ? "76px" : "40px",
      }}
    >
      <div
        style={{
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
        }}
      >
        <div>
          <div style={{ fontSize: isMobile ? "13px" : "14px", opacity: 0.8 }}>Welcome back,</div>
          <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "bold" }}>{userName || "User"}</div>
        </div>

        <ThreeDotMenu
          isLoggedIn={isLoggedIn}
          userName={userName}
          userType={userType}
          onLogout={onLogout}
          onLoginClick={onLoginClick}
          onSaleOrders={onSaleOrders}
        />
      </div>

      <div style={{ padding: isMobile ? "16px" : "24px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${BROWN} 0%, ${BROWN_DARK} 100%)`,
            borderRadius: "20px",
            padding: isMobile ? "20px" : "28px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            marginBottom: isMobile ? "16px" : "24px",
            minHeight: isMobile ? "150px" : "170px",
          }}
        >
          <div style={{ fontSize: "13px", opacity: 0.85, marginBottom: "8px" }}>Revenue today</div>
          <div style={{ fontSize: isMobile ? "30px" : "36px", fontWeight: "bold", marginBottom: "10px" }}>
            ₹{loading ? "—" : rupee(todaysRevenue)}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "12px",
            }}
          >
            <span>{todayLabel}</span>
          </div>

          <svg
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "60px", opacity: 0.25 }}
          >
            <path
              d="M0,60 C60,10 100,90 160,50 C220,10 260,80 320,40 C360,15 380,40 400,30 L400,100 L0,100 Z"
              fill="#fff"
            />
          </svg>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: isMobile ? "12px" : "16px" }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              onClick={card.onClick}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "20px",
                border: "1px solid #e8ddd4",
                cursor: card.onClick ? "pointer" : "default",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (card.onClick) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (card.onClick) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                }
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                {card.icon}
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>{card.label}</div>
              <div style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: "bold", color: card.color || BROWN_DARK }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "8px" }}>Updated {todayLabel}</div>
            </div>
          ))}
        </div>
      </div>

      {isMobile && (
        <MobileTabBar
          activeTab={activeTab}
          onHome={onHome}
          onDashboard={() => { }}
          onSaleOrders={onSaleOrders}
        />
      )}
    </div>
  );
}