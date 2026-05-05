import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CommonHeader from './CommonHeader';
import { encryptPasswordFun } from "./functions";

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";

import beansImg from '../assets/images/categoryImages/Beans.jpg';
import desiCpImg from '../assets/images/categoryImages/malda.jpg';
import dhallImg from '../assets/images/categoryImages/dhall.jpg';
import iiItemImg from '../assets/images/categoryImages/moong_dhal.jpg';
import kabuliCpImg from '../assets/images/categoryImages/Kabuli_cp.jpg';
import kanamImg from '../assets/images/categoryImages/Kanam.jpg';
import masoorImg from '../assets/images/categoryImages/Masoor.jpg';
import milletsImg from '../assets/images/categoryImages/Millets.jpg';
import mochaiImg from '../assets/images/categoryImages/Mochai.jpg';
import moongImg from '../assets/images/categoryImages/Moon_Dal.jpg';
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

const getCategoryImage = (categoryName) => {
  return categoryImages[categoryName];
};

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
        width: cardSize,
        height: cardSize,
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
        margin: 0, 
        padding: 0, 
        cursor: "pointer",
        flex: "0 0 auto",
        boxShadow: isSelected 
          ? `0 0 0 3px ${BROWN_DARK}, 0 8px 20px rgba(0,0,0,0.2)`
          : "0 4px 12px rgba(0,0,0,0.1)",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
    >
      <img
        src={imageUrl}
        alt={category.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: fontSize,
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            textAlign: "center",
            padding: "0 8px",
            letterSpacing: "1px",
          }}
        >
          {category.name}
        </span>
      </div>
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: checkmarkTop,
            right: checkmarkRight,
            width: checkmarkSize,
            height: checkmarkSize,
            borderRadius: "50%",
            background: BROWN_DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ color: "#fff", fontSize: checkmarkFontSize }}>✓</span>
        </div>
      )}
    </div>
  );
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

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchLink({
        address: `authorization/getUserTypeAuth`,
        method: "POST",
        bodyData: { username: username.trim() },
      });

      if (!data.success) {
        toast.error(data.message || "User not found");
        return;
      }

      if (data.requirePassword) {
        setStep(2);
      } else {
        const customer = data.customer || {};
        const usename = customer.A1;

        localStorage.setItem("user", JSON.stringify({ ...customer, Name: usename }));
        localStorage.setItem("session", JSON.stringify({ username: username.trim(), ...data }));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("username", username);
        localStorage.setItem("userType", "customer");
        localStorage.setItem("retId", customer.Ret_Id || "");

        toast.success("Login successful!");
        setUsername("");
        setPassword("");
        setStep(1);
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
    if (!password.trim()) {
      toast.error("Please enter your password");
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

      if (data.success) {
        const { user, sessionInfo } = data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("session", JSON.stringify(sessionInfo));
        localStorage.setItem("loginAt", new Date().toString());
        localStorage.setItem("userType", "employee");
        localStorage.removeItem("retId");

        toast.success("Login successful!");
        setUsername("");
        setPassword("");
        setStep(1);
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
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "24px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "12px", right: "12px",
            background: "transparent", border: "none",
            fontSize: "20px", cursor: "pointer",
            color: "#999", padding: "4px 8px", borderRadius: "50%",
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
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required autoFocus
                  style={{
                    width: "100%", padding: "12px",
                    border: "1px solid #ddd", borderRadius: "8px",
                    fontSize: "14px", outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
              <button
                type="submit" disabled={isLoading}
                style={{
                  width: "100%", padding: "14px",
                  background: BROWN_DARK, color: "#fff",
                  border: "none", borderRadius: "25px",
                  fontSize: "16px", fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required autoFocus
                  style={{
                    width: "100%", padding: "12px",
                    border: "1px solid #ddd", borderRadius: "8px",
                    fontSize: "14px", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = BROWN}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>
              <button
                type="submit" disabled={isLoading}
                style={{
                  width: "100%", padding: "14px",
                  background: BROWN_DARK, color: "#fff",
                  border: "none", borderRadius: "25px",
                  fontSize: "16px", fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
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

function ProductCard({ product, quantity, onUpdateQty, isMobile }) {
  const outOfStock = product.stock <= 0;
  const handleIncrease = () => onUpdateQty(product.id, 1);
  const handleDecrease = () => onUpdateQty(product.id, -1);

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
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888", lineHeight: 1.2 }}>
              {product.shortName}
            </p>
          )}
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: outOfStock ? "#e74c3c" : "#555", fontWeight: outOfStock ? "600" : "normal" }}>
            {outOfStock ? "⚠ Out of Stock" : `Stock: ${product.stock.toFixed(1)} Bags`}
            {!outOfStock && product.balQty > 0 && (
              <span style={{ color: "#999", marginLeft: "4px" }}>({product.balQty} kg)</span>
            )}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "17px", fontWeight: "700", color: "#3a1f0e" }}>
              ₹{product.price}
            </span>
            {outOfStock ? (
              <span style={{ fontSize: "11px", color: "#fff", background: "#b0a0a0", borderRadius: "10px", padding: "3px 8px" }}>
                Out of Stock
              </span>
            ) : (
              <div style={{ display: "flex", alignItems: "center", background: "#6b5454", borderRadius: "20px", padding: "3px 8px", gap: "8px" }}>
                <button
                  onClick={handleDecrease} disabled={quantity === 0}
                  style={{
                    background: "transparent", border: "none", color: "#fff",
                    fontWeight: "bold", fontSize: "16px",
                    cursor: quantity === 0 ? "not-allowed" : "pointer",
                    width: "24px", height: "24px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", opacity: quantity === 0 ? 0.4 : 1,
                    lineHeight: 1, padding: 0,
                  }}
                >-</button>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  style={{
                    background: "transparent", border: "none", color: "#fff",
                    fontWeight: "bold", fontSize: "16px", cursor: "pointer",
                    width: "24px", height: "24px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", lineHeight: 1, padding: 0,
                  }}
                >+</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ width: "110px", minWidth: "110px", overflow: "hidden", background: "#f5f0eb" }}>
          <img
            alt={product.name}
            src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=110&h=110&fit=crop"}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=110&h=110&fit=crop"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="product-card bg-white relative rounded-[15px] w-[400px] h-[150px] shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[-12px_10px_8px_-3px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-[4px]">
      <div className="overflow-clip relative rounded-[inherit] size-full" style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "12px 0 12px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[16px] whitespace-nowrap m-0">
            {product.shortName}
          </p>
          <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[13px] whitespace-nowrap m-0">
            {product.name}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="bg-[#6b5454] h-[30px] overflow-clip px-3 flex items-center justify-center rounded">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[20px] text-white m-0">
                ₹{product.price}
              </p>
            </div>
            {outOfStock ? (
              <div className="bg-[#6b5454] h-[26px] rounded-[15px] px-3 opacity-50 flex items-center justify-center">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-white m-0">Out of Stock</p>
              </div>
            ) : (
              <div className="bg-[#6b5454] h-[30px]  flex items-center justify-between px-3 gap-2 rounded">
                <button
                  onClick={handleDecrease}
                  className="text-white font-bold text-base hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
                  disabled={quantity === 0}
                >-</button>
                <span className="text-white text-sm font-medium min-w-[16px] text-center">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="text-white font-bold text-base hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
                >+</button>
              </div>
            )}
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
            src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=130&h=170&fit=crop"}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=130&h=170&fit=crop"; }}
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

function MobileOrderSummary({ selectedCount, totalAmount, onGoToCart }) {
  if (selectedCount === 0) return null;
  return (
    <div className="cart-summary" style={{
      position: "fixed", bottom: 0, right: 0, left: 0,
      backgroundColor: "white", boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
      padding: "12px 16px", zIndex: 1000,
      borderTopLeftRadius: "16px", borderTopRightRadius: "16px",
      borderTop: `2px solid ${BROWN_DARK}`,
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

function ThreeDotMenu({ isLoggedIn, userName, onLogout, onLoginClick, onSaleOrders }) {
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
          padding: "8px", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff", borderRadius: "50%",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <MoreVertIcon style={{ fontSize: isMobile ? "22px" : "24px" }} />
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: "8px",
          backgroundColor: "#fff",
          borderRadius: isMobile ? "16px" : "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          minWidth: "300px", zIndex: 1000, overflow: "hidden",
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
                {/* Sale Orders Button - Only for employees */}
                {localStorage.getItem("userType") === "employee" && (
                  <button
                    onClick={() => { 
                      onSaleOrders(); 
                      setIsOpen(false); 
                    }}
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
                    background: BROWN, border: "none",
                    borderRadius: isMobile ? "8px" : "12px",
                    fontSize: isMobile ? "15px" : "18px", fontWeight: "600",
                    color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
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


function CustomerSelector({ 
  isLoggedIn, 
  userType, 
  customers, 
  selectedCustomer, 
  onSelectCustomer, 
  loading,
  isMobile 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]); 
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef(null);

 
  const removeSplChar = (text = '') => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  };
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
        setFilteredCustomers([]);
        setHasSearched(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && !hasSearched) {
      setFilteredCustomers(customers);
    }
  }, [isOpen, customers, hasSearched]);
 
  if (!isLoggedIn || customers.length === 0) {
    return null;
  }

const performSearch = () => {
    if (!customerSearch.trim()) {
      setFilteredCustomers(customers);
      setHasSearched(false);
      return;
    }
    
    const s = customerSearch.toLowerCase();
    const results = customers.filter((c) => {
      return (
        (c.name && c.name.toLowerCase().includes(s)) ||
        (c.billName && c.billName.toLowerCase().includes(s)) ||
        (c.mobile && c.mobile.includes(customerSearch)) ||
        (c.city && c.city.toLowerCase().includes(s))
      );
    });
    
    setFilteredCustomers(results);
    setHasSearched(true);
};

  const handleSearchClick = (e) => {
    e.stopPropagation();
    performSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
    }
  };
 
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearch("");
            setFilteredCustomers(customers);
            setHasSearched(false);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "#f5ede3",
          border: `1.5px solid ${isOpen ? BROWN : ACCENT}`,
          borderRadius: "25px",
          cursor: "pointer",
          transition: "all 0.2s",
          maxWidth: isMobile ? "180px" : "320px",
        }}
      >
        <span style={{ fontSize: "16px" }}>🏪</span>
        <span style={{
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: "500",
          color: selectedCustomer ? BROWN_DARK : "#666",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}>
          {selectedCustomer ? selectedCustomer.name : "Select outlet..."}
        </span>
        <span style={{
          fontSize: "12px",
          color: BROWN_LIGHT,
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}>▼</span>
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
          overflowY: "auto",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}>
          <div style={{
            padding: "10px 12px",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search (e.g., 999asa finds 999A.S.A)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${ACCENT}`,
                  borderRadius: "8px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  color: BROWN_DARK,
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BROWN;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = ACCENT;
                }}
              />
            </div>
            <button
              onClick={handleSearchClick}
              style={{
                background: BROWN,
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = BROWN_DARK}
              onMouseLeave={(e) => e.currentTarget.style.background = BROWN}
            >
              <SearchIcon style={{ fontSize: "18px", color: "#fff" }} />
            </button>
          </div>
 
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
              <CircularProgress size={20} style={{ color: BROWN }} />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              {hasSearched ? (
                <>
                  <p>No matching outlets found for "{search}".</p>
                  <p style={{ fontSize: "11px", marginTop: "8px" }}>
                    Try searching without dots or spaces (e.g., "999asa" for "999A.S.A")
                  </p>
                </>
              ) : "No outlets found"}
            </div>
          ) : (
            <>
              {hasSearched && (
                <div style={{
                  padding: "8px 14px",
                  fontSize: "11px",
                  color: "#999",
                  borderBottom: "1px solid #f0f0f0",
                  background: "#fafafa"
                }}>
                  Search: "{search}" → {filteredCustomers.length} result(s) found
                </div>
              )}
              {filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCustomer(c);
                    setIsOpen(false);
                    setSearch("");
                    setFilteredCustomers([]);
                    setHasSearched(false);
                  }}
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid #f5f0eb",
                    cursor: "pointer",
                    background: selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCustomer?.id !== c.id) {
                      e.currentTarget.style.background = "#faf6f2";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedCustomer?.id === c.id ? "#f0e9e2" : "transparent";
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "500", color: BROWN_DARK, marginBottom: "3px" }}>
                    {c.name}
                  </div>
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

// =============================================
// MOBILE CART DRAWER
// =============================================
const MobileCartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  products, 
  allProducts,
  onUpdateQty, 
  onRemoveItem,
  isLoggedIn,
  onLoginClick,
  selectedCustomer: headerSelectedCustomer,
  userType,
}) => {
  const [step, setStep] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  
  const selectedCustomer = headerSelectedCustomer;
  
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [availableTransporters, setAvailableTransporters] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
  const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [loadingTransporters, setLoadingTransporters] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBrokers();
      fetchTransporters();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCustomer) {
      setContactNumber(selectedCustomer.mobile || "");
      if (selectedCustomer.address) {
        setShippingAddress(selectedCustomer.address);
        setDeliveryAddress(selectedCustomer.address);
      }
      
      if ((!selectedCustomer.brokerId || !selectedCustomer.transporterId) && isOpen) {
        const savedCustomer = localStorage.getItem("selectedCustomer");
        if (savedCustomer) {
          try {
            const parsed = JSON.parse(savedCustomer);
            if (parsed.brokerId) {
              setSelectedBroker({ id: parsed.brokerId, name: parsed.brokerName || "" });
            }
            if (parsed.transporterId) {
              setSelectedTransporter({ id: parsed.transporterId, name: parsed.transporterName || "" });
            }
            return;
          } catch (e) {
            console.error("Error parsing saved customer:", e);
          }
        }
        
        const fetchMissingDetails = async () => {
          try {
            const response = await fetchLink({
              address: `pos/retailerMasterOpt?limit=10000000&page=1`,
            });
            
            if (response?.success && Array.isArray(response.data)) {
              const customerDetails = response.data.find(c => 
                String(c.Customer_Id) === String(selectedCustomer.id)
              );
              
              if (customerDetails) {
                const brokerId = customerDetails.Broker_Id || "";
                const brokerName = customerDetails.Broker_Name || customerDetails.Broker || "";
                const transporterId = customerDetails.Transporter_Id || "";
                const transporterName = customerDetails.Transporter_Name || customerDetails.Transporter || "";
                
                if (brokerId) {
                  setSelectedBroker({ id: String(brokerId).trim(), name: brokerName.trim() });
                }
                if (transporterId) {
                  setSelectedTransporter({ id: String(transporterId).trim(), name: transporterName.trim() });
                }
              }
            }
          } catch (error) {
            console.error("Error fetching customer details:", error);
          }
        };
        
        fetchMissingDetails();
      } else {
        if (selectedCustomer.brokerId && selectedCustomer.brokerName) {
          setSelectedBroker({ 
            id: selectedCustomer.brokerId, 
            name: selectedCustomer.brokerName 
          });
        } else {
          setSelectedBroker({ id: null, name: "" });
        }
        if (selectedCustomer.transporterId && selectedCustomer.transporterName) {
          setSelectedTransporter({ 
            id: selectedCustomer.transporterId, 
            name: selectedCustomer.transporterName 
          });
        } else {
          setSelectedTransporter({ id: null, name: "" });
        }
      }
    }
  }, [selectedCustomer, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep(1), 300);
    }
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
            id: b.Broker_Id,
            name: b.Broker_Name?.trim() || '',
            code: b.Broker_Code?.trim() || '',
            mobile: b.Mobile_No?.trim() || '',
          })));
        }
      }
    } catch (error) {
      console.error("Failed to load brokers:", error);
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
            name: t.Transporter_Name?.trim() || '',
            code: t.Transporter_Code?.trim() || '',
            mobile: t.Mobile_No?.trim() || '',
          })));
        }
      }
    } catch (error) {
      console.error("Failed to load transporters:", error);
    } finally {
      setLoadingTransporters(false);
    }
  };

  const getProductPackGet = (productId) => {
    const p = allProducts.find(p => String(p.Product_Id) === productId) || 
              products.find(p => p.id === productId);
    return p?.packGet || parseFloat(p?.PackGet) || 1;
  };

  const enhancedCartItems = Object.entries(cartItems)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const product = products.find(p => p.id === productId) || {};
      const packGet = getProductPackGet(productId);
      const kgs = qty * packGet;
      const amount = (product.price || 0) * qty * packGet;
      return { 
        ...product, 
        id: productId, 
        quantity: qty, 
        packGet, 
        kgs, 
        amount, 
        price: product.price || 0
      };
    });

  const totalItems = enhancedCartItems.reduce((s, i) => s + i.quantity, 0);
  const totalKgs = enhancedCartItems.reduce((s, i) => s + i.kgs, 0);
  const subtotalAmount = enhancedCartItems.reduce((s, i) => s + i.amount, 0);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to place an order");
      setIsLoginPopupOpen(true);
      return;
    }

    if (!contactNumber) { toast.error("Please enter contact number"); return; }
    if (!selectedCustomer) { toast.error("Please select a customer"); return; }

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

if (selectedBroker?.id) {
  Staff_Involved_List.push({
    Involved_Emp_Id: parseInt(selectedBroker.id),
    Cost_Center_Type_Id: 3, 
  });
}

if (selectedTransporter?.id) {
  Staff_Involved_List.push({
    Involved_Emp_Id: parseInt(selectedTransporter.id),
    Cost_Center_Type_Id: 4,   
  });
}




    const generalInfo = {
      So_Date: formattedDateOnly,
      Retailer_Id: parseInt(selectedCustomer.id),
      Sales_Person_Id: storage?.user?.SalesPersonId || 0,
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId,
      VoucherType: 200, GST_Inclusive: 2, IS_IGST: 0,
      CSGT_Total: (totalTax / 2).toFixed(2),
      SGST_Total: (totalTax / 2).toFixed(2),
      IGST_Total: "0.00", Round_off: "0.00",
      Total_Before_Tax: totalBeforeTax.toFixed(2),
      Total_Tax: totalTax.toFixed(2),
      Total_Invoice_value: totalInvoiceValue.toFixed(2),
      Narration: description || "",
      isConverted: 0, Cancel_status: 1,
      Created_by: parseData?.UserId || storage?.user?.UserId,
      Created_on: formattedDate, Trans_Type: "INSERT", Alter_Id: 0,
      Customer_Name: selectedCustomer.name || "",
      Ord_Mobile_No: contactNumber,
      Broker_Name: selectedBroker.name || "",
      Broker_Id: selectedBroker.id || null,
      Transporter_Name: selectedTransporter.name || "",
      Transporter_Id: selectedTransporter.id || null,
      Shipp_Address: shippingAddress || selectedCustomer.address || "",
      Deliv_Address: deliveryAddress || shippingAddress || selectedCustomer.address || "",
      Total_Kgs: totalKgsValue.toFixed(2),
      Total_Items: enhancedCartItems.length,
      Staff_Involved_List:Staff_Involved_List
    };

    const stockInfo = enhancedCartItems.map((item, index) => {
      const taxRate = item.taxRate || 12;
      const cgstSgstRate = taxRate / 2;
      const taxableAmount = item.amount;
      const taxAmount = taxableAmount * (taxRate / 100);
      const cgstSgstAmount = taxAmount / 2;
      const finalAmount = taxableAmount + taxAmount;
      return {
        So_Date: formattedDateOnly, S_No: index + 1,
        Item_Id: parseInt(item.id),
        Bill_Qty: item.kgs.toFixed(2),
        Taxable_Rate: item.price.toFixed(2),
        Item_Rate: item.price.toFixed(2),
        Amount: taxableAmount.toFixed(2), Free_Qty: "0.00",
        Total_Qty: item.quantity.toString(),
        Taxble: taxAmount.toFixed(2),
        HSN_Code: item.hsn || "210690",
        Unit_Id: item.unitId, Unit_Name: item.unitName,
        Taxable_Amount: taxableAmount.toFixed(2),
        Tax_Rate: taxRate, Cgst: cgstSgstRate,
        Cgst_Amo: cgstSgstAmount.toFixed(2), Sgst: cgstSgstRate,
        Sgst_Amo: cgstSgstAmount.toFixed(2), Igst: 0,
        Igst_Amo: "0.00", Final_Amo: finalAmount.toFixed(2),
        Created_on: formattedDate,
        Product_Id: parseInt(item.id), Product_Name: item.name,
        Quantity: item.quantity, Price: item.price,
        Total: taxableAmount.toFixed(2), Weight: item.kgs.toString(),
        Unit: item.unit, PackGet: item.packGet,
      };
    });

    const saleData = {
      generalInfo, stockInfo,
      totalAmount: totalInvoiceValue, totalItems: enhancedCartItems.length,
      totalKgs: totalKgsValue.toFixed(2),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name || "",
      contactNumber,
      brokerName: selectedBroker.name,
      transporter: selectedTransporter.name,
      shippingAddress, deliveryAddress, description,
      Created_by: parseData?.UserId || parseData?.user_id || "",
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 2,
    };

    try {
      const loadingToast = toast.loading("Placing order...");
      const response = await fetchLink({
        address: `sales/salesInvoice/Whatsapp`,
        method: 'POST', 
        bodyData: saleData,
      });
      toast.dismiss(loadingToast);
  
      if (response?.success) {
        toast.success(`Order placed successfully!`);
        Object.keys(cartItems).forEach(id => onUpdateQty(id, -cartItems[id]));
        localStorage.removeItem('cartItems');
        localStorage.removeItem('selectedCustomer');
        onClose();
      } else {
        toast.error(response?.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Failed to place order: " + (error.message || "Unknown error"));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999,
        }}
      />

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "100%", maxWidth: "100%",
        backgroundColor: "#fff", zIndex: 1000,
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
        animation: "slideInRight 0.3s ease",
      }}>
        <div style={{
          padding: "16px 20px", backgroundColor: BROWN_DARK, color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                style={{ background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px" }}
              >←</button>
            )}
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {step === 1 ? `Cart (${totalItems})` : "Order Details"}
            </span>
          </div>
          <CloseIcon style={{ cursor: "pointer", fontSize: "24px" }} onClick={onClose} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {step === 1 ? (
            <>
              {enhancedCartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {enhancedCartItems.map(item => (
                    <div key={item.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 0", borderBottom: "1px solid #eee",
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", color: BROWN }}>
                          {item.name}
                        </h4>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          ₹{item.price}/kg • {item.packGet}kg pack
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            style={{
                              width: "28px", height: "28px", borderRadius: "50%",
                              border: `1px solid ${BROWN}`, background: "#fff",
                              color: BROWN, cursor: "pointer", fontSize: "16px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >-</button>
                          <span style={{ fontSize: "14px", fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            style={{
                              width: "28px", height: "28px", borderRadius: "50%",
                              border: `1px solid ${BROWN}`, background: "#fff",
                              color: BROWN, cursor: "pointer", fontSize: "16px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >+</button>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: "12px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "bold", color: BROWN }}>
                          ₹{item.amount.toFixed(2)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#999" }}>
                          ({item.quantity} × {item.packGet}kg = {item.kgs.toFixed(2)}kg)
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          style={{
                            marginTop: "4px", background: "transparent", border: "none",
                            color: "#ff4444", cursor: "pointer", fontSize: "12px",
                          }}
                        >Remove</button>
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: "16px", padding: "16px", background: "#f9f4ef", borderRadius: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                      <span>Total Items:</span><span>{totalItems}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                      <span>Total Kgs:</span><span>{totalKgs.toFixed(2)} kg</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                      <span>Subtotal:</span><span>₹{subtotalAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold", color: BROWN, borderTop: "1px dashed #ddd", paddingTop: "10px", marginTop: "4px" }}>
                      <span>Total:</span><span>₹{subtotalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div>
              {selectedCustomer && (
                <div style={{ marginBottom: "16px", padding: "12px", background: "#f0e9e2", borderRadius: "8px" }}>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}>Selected Customer</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: BROWN }}>
                    {selectedCustomer.name}
                  </div>
                  {selectedCustomer.mobile && (
                    <div style={{ fontSize: "13px", color: "#666" }}>📱 {selectedCustomer.mobile}</div>
                  )}
                  {selectedCustomer.city && (
                    <div style={{ fontSize: "12px", color: "#888" }}>📍 {selectedCustomer.city}</div>
                  )}
                  {selectedBroker.name && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      🏢 Broker: {selectedBroker.name}
                    </div>
                  )}
                  {selectedTransporter.name && (
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      🚚 Transporter: {selectedTransporter.name}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Broker</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedBroker.id || ""}
                    onChange={(e) => {
                      const brokerId = e.target.value;
                      const broker = availableBrokers.find(b => String(b.id) === String(brokerId));
                      setSelectedBroker(broker || { id: null, name: "" });
                    }}
                    style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #ddd",
                      borderRadius: "8px", fontSize: "14px", outline: "none",
                      backgroundColor: "#fff", color: selectedBroker.name ? BROWN : "#999",
                      appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
                    }}
                  >
                    <option value="">Select Broker</option>
                    {availableBrokers.map(broker => (
                      <option key={broker.id} value={broker.id}>
                        {broker.name} {broker.code ? `(${broker.code})` : ''}
                      </option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BROWN_LIGHT }}>▼</span>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Transporter</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedTransporter.id || ""}
                    onChange={(e) => {
                      const transporterId = e.target.value;
                      const transporter = availableTransporters.find(t => String(t.id) === String(transporterId));
                      setSelectedTransporter(transporter || { id: null, name: "" });
                    }}
                    style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #ddd",
                      borderRadius: "8px", fontSize: "14px", outline: "none",
                      backgroundColor: "#fff", color: selectedTransporter.name ? BROWN : "#999",
                      appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
                    }}
                  >
                    <option value="">Select Transporter</option>
                    {availableTransporters.map(transporter => (
                      <option key={transporter.id} value={transporter.id}>
                        {transporter.name} {transporter.code ? `(${transporter.code})` : ''}
                      </option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: BROWN_LIGHT }}>▼</span>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Contact Number *</label>
                <input
                  type="tel" placeholder="Enter contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #ddd",
                    borderRadius: "8px", fontSize: "14px", outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Shipping Address</label>
                <textarea
                  placeholder="Enter shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #ddd",
                    borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Delivery Address</label>
                <textarea
                  placeholder="Enter delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #ddd",
                    borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "4px", display: "block" }}>Description</label>
                <textarea
                  placeholder="Notes or description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #ddd",
                    borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", minHeight: "60px",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {enhancedCartItems.length > 0 && (
          <div style={{
            padding: "16px 20px", borderTop: "1px solid #eee",
            background: "#fff",
          }}>
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                style={{
                  width: "100%", padding: "14px", background: BROWN_DARK,
                  color: "#fff", border: "none", borderRadius: "25px",
                  fontSize: "16px", fontWeight: "600", cursor: "pointer",
                }}
              >
                Proceed to Order Details →
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                style={{
                  width: "100%", padding: "14px", background: BROWN_DARK,
                  color: "#fff", border: "none", borderRadius: "25px",
                  fontSize: "16px", fontWeight: "600", cursor: "pointer",
                }}
              >
                Place Order
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        onLoginSuccess={() => {
          setIsLoginPopupOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
};

// =============================================
// MAIN SMTraders COMPONENT
// =============================================
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



const handleSaleOrdersClick = () => {
  setShowSaleOrders(true);
};

const handleBackFromSaleOrders = () => {
  setShowSaleOrders(false);
};



  const fetchCompleteCustomerDetails = async (customerId) => {
    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOpt?limit=10000000&page=1`,
      });
      
      if (response?.success && Array.isArray(response.data)) {
        const customer = response.data.find(c => 
          String(c.Customer_Id) === String(customerId)
        );
        
        if (customer) {
          return {
            brokerId: customer.Broker_Id ? String(customer.Broker_Id).trim() : "",
            brokerName: customer.Broker_Name || customer.Broker || "",
            transporterId: customer.Transporter_Id ? String(customer.Transporter_Id).trim() : "",
            transporterName: customer.Transporter_Name || customer.Transporter || ""
          };
        }
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
    return null;
  };

  const checkLoginStatus = () => {
    try {
      const user = localStorage.getItem("user");
      const session = localStorage.getItem("session");
      const loginAt = localStorage.getItem("loginAt");
      const storedUserType = localStorage.getItem("userType") || "employee";
      
      if (user && session && loginAt) {
        setIsLoggedIn(true);
        setUserType(storedUserType);
        
        let userData;
        try {
          userData = JSON.parse(user);
        } catch (e) {
          userData = user;
        }
        
        const sessionData = JSON.parse(session);
        
        let customerList = [];
        if (sessionData && sessionData.customer && Array.isArray(sessionData.customer)) {
          customerList = sessionData.customer.map(c => ({
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
            partyMailingName: c.Party_Mailing_Name,
            ledgerTallyId: c.Ledger_Tally_Id
          }));
        }
        
        if (customerList.length > 0) {
          setCustomers(customerList);
        }
        
        if (storedUserType === "customer" || storedUserType === "employee") {
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
              let finalCustomer = { ...defaultCustomer };
              if (details) {
                finalCustomer = {
                  ...defaultCustomer,
                  brokerId: details.brokerId || defaultCustomer.brokerId || "",
                  brokerName: details.brokerName || defaultCustomer.brokerName || "",
                  transporterId: details.transporterId || defaultCustomer.transporterId || "",
                  transporterName: details.transporterName || defaultCustomer.transporterName || ""
                };
              }
              setSelectedCustomer(finalCustomer);
              localStorage.setItem("selectedCustomerId", finalCustomer.id);
              localStorage.setItem("selectedCustomer", JSON.stringify(finalCustomer));
            })();
          }
          
          const name = sessionData.username || userData?.Name || userData?.User_Name || "User";
          setUserName(name);
        }
        
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
  };

  const handleLoginSuccess = () => checkLoginStatus();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    localStorage.removeItem("loginAt");
    localStorage.removeItem("userType");
    localStorage.removeItem("retId");
    localStorage.removeItem("selectedCustomerId");
    localStorage.removeItem("selectedCustomer");
    setIsLoggedIn(false);
    setUserName("");
    setUserType("");
    setSelectedCustomer(null);
    setCustomers([]);
    toast.success("Logged out successfully");
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await fetchLink({
        address: `pos/retailerMasterOpt?limit=10000000&page=1`,
      });
      if (response?.success && Array.isArray(response.data)) {
        const sanitized = response.data.map((c) => ({
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
        }));
        setCustomers(sanitized);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoadingCustomers(false);
    }
  };

  const formatProduct = (product) => {
    const uniqueId = String(product.Product_Id);
    const balQty = parseFloat(product.Bal_Qty) || 0;
    const packGet = parseFloat(product.PackGet) || 1;
    const stockInBags = packGet > 0 ? balQty / packGet : 0;
    const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
    return {
      id: uniqueId,
      name: product.Product_Name || product.Stock_Item || "Unknown",
      fullName: product.Product_Name || "Unknown",
      shortName: product.Short_Name,
      weight: product.Bag || product.PackGet ? `${product.PackGet || ""}kg` : "N/A",
      stockGroup: product.Stock_Group || "General",
      posGroup: product.POS_Group || "General",
      price,
      stock: stockInBags,
      unit: product.Units || "Bags",
      image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=116&fit=crop",
      coolie: product.Coolie,
      brokerage: product.NagalBrokerage || product.Brokerage,
      packGet: product.PackGet,
      hsnCode: product.HSN_Code,
      balQty,
      originalProduct: product,
      isInStock: stockInBags > 0,
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
      const active = unique.filter((p) => p.isActive === 1 || p.IsActive === 1 || p.Is_Active === 1);
      const inStock = active.filter((p) => {
        const bq = parseFloat(p.Bal_Qty) || 0;
        const pg = parseFloat(p.PackGet) || 1;
        return pg > 0 ? bq / pg > 0 : false;
      });

      setAllProducts(inStock);
      setDisplayProducts(inStock);
      localStorage.setItem("products", JSON.stringify(inStock.map(formatProduct)));
      setInitialLoadDone(true);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => { checkLoginStatus(); }, []);

  useEffect(() => {
    if (isLoggedIn && userType === "employee") fetchCustomers();
  }, [isLoggedIn, userType]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if (initialLoadDone) localStorage.setItem("cartItems", JSON.stringify(quantities));
  }, [quantities, initialLoadDone]);

  useEffect(() => { fetchAllData(); }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const groups = [...new Set(allProducts.map((p) => p.Stock_Group))]
        .filter((g) => g && g.trim() && g !== "NOT FOUND" && g !== "NULL")
        .sort()
        .map((g) => ({ id: g, name: g }));
      setStockGroups([{ id: "All", name: "All" }, ...groups]);
    }
  }, [allProducts]);

  const extractPOSGroups = (list) =>
    [...new Set(list.map((p) => (p.POS_Group || "").trim()))]
      .filter((g) => g && g !== "NULL")
      .map((g) => ({ posGroup: g, itemCount: list.filter((p) => (p.POS_Group || "").trim() === g).length }))
      .sort((a, b) => a.posGroup.localeCompare(b.posGroup));

  const handleStockGroupClick = (group) => {
    setSelectedPOSGroup(null);
    setSelectedStockGroup(group.id);
    setViewMode('products');
    if (group.id === "All") {
      setDisplayProducts(allProducts);
      setShowPOSGroups(false);
      setPosGroups([]);
    } else {
      const filtered = allProducts.filter((p) => (p.Stock_Group || "").trim() === group.id.trim());
      setDisplayProducts(filtered);
      const pgl = extractPOSGroups(filtered);
      setPosGroups(pgl);
      setShowPOSGroups(true);
      if (isMobile && pgl.length > 0) setIsDrawerOpen(true);
    }
  };

  const handleBackToCategories = () => {
    setSelectedStockGroup("All");
    setSearch("");
    setViewMode('categories');
  };

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
    const bq = parseFloat(p.Bal_Qty) || 0;
    const pg = parseFloat(p.PackGet) || 1;
    if (pg > 0 ? bq / pg <= 0 : true) return false;
    if (!search) return true;
    const normalize = (str) => (str || "").toLowerCase().replace(/[.\-_\s]+/g, "");
    const sl = normalize(search);
    return (
      normalize(p.Product_Name).includes(sl) ||
      normalize(p.Short_Name).includes(sl) ||
      normalize(p.POS_Group).includes(sl) ||
      normalize(p.Stock_Group).includes(sl) ||
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
        navigationState.selectedCustomer = { id: customerData.id, name: customerData.name, billName: customerData.billName, mobile: customerData.mobile, city: customerData.city, address: customerData.address, brokerId: customerData.brokerId, brokerName: customerData.brokerName, transporterId: customerData.transporterId, transporterName: customerData.transporterName };
      }
      if (selectedCustomer) localStorage.setItem('selectedCustomerData', JSON.stringify(navigationState.selectedCustomer));
      navigate('/cart', { state: navigationState });
    }
  };

  const handleSelectCustomer = async (customer) => {
    let updatedCustomer = { ...customer };
    const details = await fetchCompleteCustomerDetails(customer.id);
    if (details) {
      updatedCustomer = { ...customer, brokerId: details.brokerId || customer.brokerId || "", brokerName: details.brokerName || customer.brokerName || "", transporterId: details.transporterId || customer.transporterId || "", transporterName: details.transporterName || customer.transporterName || "" };
    }
    setSelectedCustomer(updatedCustomer);
    localStorage.setItem("selectedCustomerId", updatedCustomer.id);
    localStorage.setItem("selectedCustomer", JSON.stringify(updatedCustomer));
  };

  const MobileDrawer = () => (
    <>
      {isDrawerOpen && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setIsDrawerOpen(false)} />}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "85%", maxWidth: "320px", backgroundColor: "#fff", zIndex: 1000, transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.1s ease-in-out", overflowY: "auto", boxShadow: "2px 0 10px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: "20px 16px", backgroundColor: BROWN_DARK, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FilterListIcon style={{ fontSize: "20px" }} /><span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedStockGroup} - POS Groups</span></div>
          <CloseIcon style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setIsDrawerOpen(false)} />
        </div>
        <div style={{ padding: "16px" }}>
          {showPOSGroups && posGroups.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={handleAllPOSGroupsClick} style={{ padding: "12px 16px", borderRadius: "8px", border: "none", backgroundColor: selectedPOSGroup === null ? BROWN_DARK : "#f5f0eb", color: selectedPOSGroup === null ? "#fff" : BROWN_DARK, fontSize: "14px", cursor: "pointer", fontWeight: selectedPOSGroup === null ? "bold" : "normal", textAlign: "left", width: "100%" }}>All POS Groups ({displayProducts.length})</button>
              {posGroups.map((group, i) => (
                <button key={i} onClick={() => handlePOSGroupClick(group.posGroup)} style={{ padding: "12px 16px", borderRadius: "8px", border: "none", backgroundColor: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#f5f0eb", color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK, fontSize: "14px", cursor: "pointer", fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal", textAlign: "left", width: "100%" }}>{group.posGroup} ({group.itemCount})</button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#999", fontSize: "14px" }}>No POS groups available for this category</div>
          )}
        </div>
      </div>
    </>
  );

  const mediaQueryStyles = `
    @media screen and (max-width: 768px) { .products-grid { grid-template-columns: 1fr !important; gap: 12px !important; padding: 12px !important; } .product-card { width: 100% !important; height: auto !important; min-height: 140px !important; } .category-filters { padding: 8px 12px !important; } }
    @media screen and (max-width: 480px) { .mobile-drawer { width: 85% !important; max-width: 280px !important; } .cart-summary { padding: 10px 16px !important; } }
    @media screen and (min-width: 1600px) { .products-grid { max-width: 1800px !important; margin: 0 auto !important; grid-template-columns: repeat(4, 1fr) !important; } }
  `;

  const isCategoryReduced = selectedStockGroup !== "All";

 return (
    <>
      {showSaleOrders ? (
        <SaleOrders onBack={handleBackFromSaleOrders} />
      ) : (
        <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh", paddingBottom: isMobile && selectedCount > 0 ? "80px" : "0" }}>
          <style>{mediaQueryStyles}</style>

          <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} onLoginSuccess={handleLoginSuccess} />

          <CommonHeader 
            title="SM Traders" 
            logo="SMT" 
            showSearch={false} 
            showCart={true} 
            showBackButton={false} 
            showTitle={true} 
            cartItemCount={selectedCount} 
            selectedCount={selectedCount} 
            onCartClick={handleCartClick} 
            handleCartClick={handleCartClick} 
            isMobile={isMobile} 
            backgroundColor={BROWN_DARK} 
            isLoggedIn={isLoggedIn} 
            userName={userName} 
            showCustomerSelector={isLoggedIn && customers.length > 0} 
            customers={customers} 
            selectedCustomer={selectedCustomer} 
            onCustomerSelect={handleSelectCustomer} 
            loadingCustomers={loadingCustomers} 
            userType={userType} 
            customActions={
              <div style={{ display: "flex", alignItems: "right", gap: "12px" }}>
                <ThreeDotMenu 
                  isLoggedIn={isLoggedIn} 
                  userName={userName} 
                  onLogout={handleLogout} 
                  onLoginClick={() => setIsLoginPopupOpen(true)} 
                  onSaleOrders={handleSaleOrdersClick} 
                />
              </div>
            } 
          />

          {isMobile && viewMode === 'categories' && (
            <div style={{ padding: "16px", background: "#f5f0eb", minHeight: "calc(100vh - 120px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {stockGroups.filter((g) => g.id !== "All").map((group) => (
                  <div key={group.id} onClick={() => handleStockGroupClick(group)} style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "180px" }}>
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
                  <button onClick={handleBackToCategories} style={{ background: "transparent", border: `1px solid ${BROWN_DARK}`, borderRadius: "20px", padding: "8px 16px", color: BROWN_DARK, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}><span>←</span> Back to Categories</button>
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
                    <button onClick={handleAllPOSGroupsClick} style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === null ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === null ? BROWN_DARK : "#fff", color: selectedPOSGroup === null ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === null ? "bold" : "normal" }}>All POS Groups ({displayProducts.length})</button>
                    {posGroups.length > 0 ? posGroups.map((group, i) => (
                      <button key={i} onClick={() => handlePOSGroupClick(group.posGroup)} style={{ padding: "8px 16px", borderRadius: "20px", border: `2px solid ${selectedPOSGroup === group.posGroup ? BROWN_DARK : ACCENT}`, background: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#fff", color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK, fontSize: 13, cursor: "pointer", fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal" }}>{group.posGroup} ({group.itemCount})</button>
                    )) : (<div style={{ color: "#666", fontStyle: "italic", padding: "8px" }}>No POS groups available</div>)}
                  </div>
                </div>
              )}

              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(420px, 1fr))", gap: isMobile ? 16 : 24, padding: isMobile ? "16px" : "24px 24px 40px", maxWidth: 1800, margin: "0 auto", justifyContent: "center" }}>
                {loadingProducts ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>Loading products...</div>
                ) : filtered.length > 0 ? (
                  filtered.map((product) => {
                    const formatted = formatProduct(product);
                    return (<div key={formatted.id} style={{ display: "flex", justifyContent: "center", width: "100%" }}><ProductCard product={formatted} quantity={quantities[formatted.id] || 0} onUpdateQty={updateQty} isMobile={isMobile} /></div>);
                  })
                ) : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>No products found</div>
                )}
              </div>
            </>
          )}

          {isMobile && <MobileDrawer />}
          {isMobile && <MobileOrderSummary selectedCount={selectedCount} totalAmount={totalAmount} onGoToCart={handleCartClick} />}
          <MobileCartDrawer isOpen={isMobileCartDrawerOpen} onClose={() => setIsMobileCartDrawerOpen(false)} cartItems={quantities} products={formattedProducts} allProducts={allProducts} onUpdateQty={updateQty} onRemoveItem={handleRemoveItem} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginPopupOpen(true)} selectedCustomer={selectedCustomer} userType={userType} />
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
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>Sale Orders</div>
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