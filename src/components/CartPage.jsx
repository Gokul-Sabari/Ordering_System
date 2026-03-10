import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from "@mui/material/CircularProgress";
import { fetchLink } from "./fetchComponent";
import CommonHeader from './CommonHeader'
import { encryptPasswordFun } from "./functions";

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";


const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    const APP_Type = 2;
    
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const passHash = encryptPasswordFun(password);
      const data = await fetchLink({
        address: `authorization/login`,
        method: 'POST',
        bodyData: { username: username, password: passHash, APP_Type }
      });

      if (data.success) {
        const { user, sessionInfo } = data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("session", JSON.stringify(sessionInfo));
        localStorage.setItem('loginAt', new Date().toString());

        toast.success("Login successful!");
        
        setUsername("");
        setPassword("");
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
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
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
        <div style={{
          textAlign: "center",
          marginBottom: "20px",
        }}>
          <h2 style={{
            color: BROWN,
            fontSize: "24px",
            margin: "0 0 8px 0",
          }}> </h2>
          <p style={{
            color: "#666",
            fontSize: "14px",
            margin: 0,
          }}></p>
        </div>

        <div style={{
          background: "#f9f4ef",
          borderRadius: "12px",
          padding: "20px",
        }}>
          <div style={{
            fontSize: "18px",
            fontWeight: "600",
            color: BROWN,
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: `2px solid ${ACCENT}`,
          }}>
            <span style={{ color: BROWN_DARK }}>Sign</span> In
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#666",
                marginBottom: "4px",
              }}>Username</div>
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
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = BROWN}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#666",
                marginBottom: "4px",
              }}>Password</div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                required 
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = BROWN}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
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
                position: "relative",
                opacity: isLoading ? 0.7 : 1,
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.background = BROWN)}
              onMouseLeave={(e) => !isLoading && (e.target.style.background = BROWN_DARK)}
            >
              {isLoading ? (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}>
                  <CircularProgress size={20} style={{ color: "#fff" }} />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "12px",
            color: "#999",
          }}>
            <p>Enter your credentials to place order</p>
          </div>
        </div>

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
          onMouseEnter={(e) => {
            e.target.style.background = "#f0f0f0";
            e.target.style.color = "#666";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#999";
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};


const UserMenuDropdown = ({ isOpen, onClose, isLoggedIn, userName, onLoginClick, onLogout }) => {
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const handleLogin = () => {
    onLoginClick();
    onClose();
  };

  const desktopCardStyles = {
    minWidth: "320px", 
    padding: "0",
  };

  const desktopHeaderStyles = {
    padding: "28px 24px", 
  };

  const desktopAvatarStyles = {
    width: "64px", 
    height: "64px", 
    fontSize: "28px", 
  };

  const desktopNameStyles = {
    fontSize: "22px", 
  };

  const desktopUserTypeStyles = {
    padding: "16px 24px",
    fontSize: "15px", 
  };

  const desktopButtonStyles = {
    padding: "18px 24px", 
    fontSize: "17px", 
    gap: "16px", 
  };

  const desktopIconStyles = {
    fontSize: "22px", 
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        ...(isMobile ? {
          minWidth: "250px",
        } : desktopCardStyles),
        background: "#fff",
        borderRadius: isMobile ? "12px" : "20px",
        boxShadow: isMobile 
          ? "0 4px 20px rgba(0,0,0,0.15)" 
          : "0 8px 30px rgba(0,0,0,0.2)", 
        zIndex: 1000,
        overflow: "hidden",
        animation: "slideDown 0.2s ease",
      }}
    >
      {isLoggedIn ? (
    
        <>
          <div style={{
            padding: isMobile ? "20px 16px" : desktopHeaderStyles.padding,
            background: "linear-gradient(135deg, #4a2c1a 0%, #3a1f0e 100%)",
            borderBottom: `1px solid ${ACCENT}`,
          }}>
            <div style={{
              width: isMobile ? "48px" : desktopAvatarStyles.width,
              height: isMobile ? "48px" : desktopAvatarStyles.height,
              borderRadius: "50%",
              background: "#c8a96e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{
                color: "#4a2c1a",
                fontSize: isMobile ? "20px" : desktopAvatarStyles.fontSize,
                fontWeight: "bold",
              }}>
                {userName?.charAt(0) || ""}
              </span>
            </div>
              <div style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: "#fff",
                }}>{userName || ""}</div>

            <div style={{
              fontSize: isMobile ? "18px" : desktopNameStyles.fontSize,
              fontWeight: "600",
              color: "#fff",
              marginBottom: "4px",
            }}>{userName?.Name || ""}</div>
            <div style={{
              fontSize: isMobile ? "13px" : "15px",
              color: "rgba(255,255,255,0.8)",
            }}>Signed In</div>
          </div>
          
          <div style={{
            padding: isMobile ? "8px" : "12px",
          }}>
            <div style={{
              padding: isMobile ? "12px 16px" : desktopUserTypeStyles.padding,
              borderBottom: "1px solid #f0f0f0",
            }}>
            
            
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: isMobile ? "14px 16px" : desktopButtonStyles.padding,
                background: "transparent",
                border: "none",
                textAlign: "left",
                fontSize: isMobile ? "15px" : desktopButtonStyles.fontSize,
                color: "#d32f2f",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "12px" : desktopButtonStyles.gap,
                transition: "background 0.2s",
                borderRadius: isMobile ? "8px" : "12px",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => e.target.style.background = "#fff5f5"}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              <span style={{ fontSize: isMobile ? "18px" : desktopIconStyles.fontSize }}>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
    
        <>
          <div style={{
            padding: isMobile ? "20px 16px" : desktopHeaderStyles.padding,
            background: "#f9f4ef",
            textAlign: "center",
          }}>
            <div style={{
              width: isMobile ? "20px" : desktopAvatarStyles.width,
              height: isMobile ? "48px" : desktopAvatarStyles.height,
              borderRadius: "50%",
              background: "#e0d5cc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <span style={{
                color: BROWN,
                fontSize: isMobile ? "20px" : desktopAvatarStyles.fontSize,
                fontWeight: "bold",
              }}>?</span>
            </div>
            <div style={{
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: "600",
              color: BROWN,
              marginBottom: "4px",
            }}>Not Signed In</div>
            <div style={{
              fontSize: isMobile ? "13px" : "15px",
              color: "#666",
            }}>Sign in to place orders</div>
          </div>
          
          <div style={{
            padding: isMobile ? "12px" : "20px",
          }}>
            <button
              onClick={handleLogin}
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
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.background = BROWN_DARK}
              onMouseLeave={(e) => e.target.style.background = BROWN}
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


const SearchableCustomerSelect = ({ value, onChange, onCustomerSelect }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetchLink({ 
          address: `pos/retailerMasterOpt?limit=10000000&page=1` 
        });
        
        if (response?.success && Array.isArray(response.data)) {
          const sanitizedData = response.data.map(customer => ({
            ...customer,
            Short_Name: customer.Short_Name ? customer.Short_Name.replace(/\u0004/g, '').trim() : '',
            Billl_Name: customer.Billl_Name ? customer.Billl_Name.trim() : '',
            Mobile_No: customer.Mobile_No ? customer.Mobile_No.trim() : '',
            Address: customer.Address ? customer.Address.trim() : '',
            City: customer.City ? customer.City.trim() : '',
            Broker_Name: customer.Broker_Name?.trim() || customer.Broker?.trim() || '',
            Transporter_Name: customer.Transporter_Name?.trim() || customer.Transporter?.trim() || ''
          }));
          
          setCustomers(sanitizedData);
        } else {
          console.error("API returned invalid data structure:", response);
          toast.error(response?.message || "Failed to load customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers: " + (error.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); 

  const filteredCustomers = customers.filter(customer => {
    if (!customer) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (customer.Short_Name?.toLowerCase().includes(searchLower)) ||
      (customer.Billl_Name?.toLowerCase().includes(searchLower)) ||
      (customer.Mobile_No?.includes(searchTerm))
    );
  });

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.Short_Name || "");
    setIsOpen(false);
    onChange(customer.Customer_Id);

    if (onCustomerSelect) {
      onCustomerSelect({
        broker: customer.Broker_Name || customer.Broker?.trim() || "",
        transporter: customer.Transporter_Name || customer.Transporter?.trim() || "",
        customerId: customer.Customer_Id,
        customerName: customer.Short_Name || "",
        mobileNo: customer.Mobile_No || "",
        address: customer.Address || "",
        city: customer.City || "",
        Broker_Id: customer.Broker_Id || "",
        Transporter_Id: customer.Transporter_Id || ""
      });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search customer by name or mobile..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {isOpen && searchTerm && (
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
          zIndex: 1000
        }}>
          {loading ? (
            <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>
              Loading customers...
            </div>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.Customer_Id}
                onClick={() => handleSelectCustomer(customer)}
                style={{
                  padding: "12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                  backgroundColor: selectedCustomer?.Customer_Id === customer.Customer_Id ? "#f0e9e2" : "transparent"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={(e) => e.currentTarget.style.background = selectedCustomer?.Customer_Id === customer.Customer_Id ? "#f0e9e2" : "transparent"}
              >
                <div style={{ fontWeight: "600", color: BROWN }}>
                  {customer.Short_Name || "Unnamed Customer"}
                </div>
                {customer.Billl_Name && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {customer.Billl_Name}
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
                  {customer.Mobile_No && <span>📞 {customer.Mobile_No}</span>}
                  {customer.City && <span>📍 {customer.City}</span>}
                  {(customer.Broker_Name || customer.Broker?.trim()) && <span>🤝 Broker: {customer.Broker_Name || customer.Broker}</span>}
                  {(customer.Transporter_Name || customer.Transporter?.trim()) && <span>🚚 Trans: {customer.Transporter_Name || customer.Transporter}</span>}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "12px", color: "#666", textAlign: "center" }}>
              No customers found
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const BrokerDropdown = ({ 
  selectedBroker, 
  onSelectBroker, 
  availableBrokers, 
  loading,
  onOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBrokers = availableBrokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (broker.code && broker.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectBroker = (broker) => {
    onSelectBroker({ id: broker.id, name: broker.name });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          onOpen && onOpen();
        }}
        style={{
          padding: "12px",
          border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
          borderRadius: "8px",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        <span style={{ color: selectedBroker.name ? BROWN : "#999" }}>
          {selectedBroker.name || "Select Broker"}
        </span>
        <span style={{ color: BROWN_LIGHT }}>▼</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: `1px solid #ddd`,
            borderRadius: "8px",
            marginTop: "4px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ padding: "8px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
            <input
              type="text"
              placeholder="Search broker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {loading ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
              Loading brokers...
            </div>
          ) : availableBrokers.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
              No brokers available
            </div>
          ) : filteredBrokers.length > 0 ? (
            filteredBrokers.map((broker) => (
              <div
                key={broker.id}
                onClick={() => handleSelectBroker(broker)}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: selectedBroker.id === broker.id ? "#f0e9e2" : "transparent",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedBroker.id !== broker.id) {
                    e.currentTarget.style.background = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedBroker.id === broker.id ? "#f0e9e2" : "transparent";
                }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>
                  {broker.name}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  {broker.code && `Code: ${broker.code}`}
                  {broker.code && broker.mobile && ` | `}
                  {broker.mobile && `${broker.mobile}`}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
              No brokers found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TransporterDropdown = ({ 
  selectedTransporter, 
  onSelectTransporter, 
  availableTransporters, 
  loading,
  onOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTransporters = availableTransporters.filter(transporter =>
    transporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transporter.code && transporter.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectTransporter = (transporter) => {
    onSelectTransporter({ id: transporter.id, name: transporter.name });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          onOpen && onOpen();
        }}
        style={{
          padding: "12px",
          border: `1px solid ${isOpen ? BROWN : "#ddd"}`,
          borderRadius: "8px",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        <span style={{ color: selectedTransporter.name ? BROWN : "#999" }}>
          {selectedTransporter.name || "Select Transporter"}
        </span>
        <span style={{ color: BROWN_LIGHT }}>▼</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: `1px solid #ddd`,
            borderRadius: "8px",
            marginTop: "4px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ padding: "8px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
            <input
              type="text"
              placeholder="Search transporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {loading ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
              Loading transporters...
            </div>
          ) : availableTransporters.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
              No transporters available
            </div>
          ) : filteredTransporters.length > 0 ? (
            filteredTransporters.map((transporter) => (
              <div
                key={transporter.id}
                onClick={() => handleSelectTransporter(transporter)}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedTransporter.id !== transporter.id) {
                    e.currentTarget.style.background = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedTransporter.id === transporter.id ? "#f0e9e2" : "transparent";
                }}
              >
                <div style={{ fontWeight: "600", color: BROWN, fontSize: "14px" }}>
                  {transporter.name}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  {transporter.code && `Code: ${transporter.code}`}
                  {transporter.code && transporter.mobile && ` | `}
                  {transporter.mobile && `${transporter.mobile}`}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
              No transporters found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userName, setUserName] = useState(""); 
  const [contactNumber, setContactNumber] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [customer, setCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [availableTransporters, setAvailableTransporters] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState({ id: null, name: "" });
  const [selectedTransporter, setSelectedTransporter] = useState({ id: null, name: "" });
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    try {
      const user = localStorage.getItem("user");
      const session = localStorage.getItem("session");
      const loginAt = localStorage.getItem("loginAt");

      if (user && session && loginAt) {
        setIsLoggedIn(true);
        const userData = JSON.parse(user);
        const name = userData?.name || userData?.Name || "";
        setUserName(name);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        const name = userData?.Name || userData?.name || "";
        setUserName(name);
      }
    } catch (error) {
      console.error("Error getting user name:", error);
    }
  };

  const fetchBrokers = async () => {
    setLoadingBrokers(true);
    try {
      const response = await fetchLink({
        address: `pos/brokers`
      });
      
     if (response?.success) {
      // Handle the nested data structure
      const brokersData = response.data?.Brokers || response.data || [];
      
      if (Array.isArray(brokersData)) {
        const brokersList = brokersData.map(broker => ({
          id: broker.Broker_Id,
          name: broker.Broker_Name?.trim() || '',
          code: broker.Broker_Code?.trim() || '',
          mobile: broker.Mobile_No?.trim() || ''
        }));
        setAvailableBrokers(brokersList);
      } else {
        console.error("Brokers data is not an array:", brokersData);
        toast.error("Invalid brokers data format");
      }
    } else {
      console.error("Failed to fetch brokers:", response?.message);
      toast.error(response?.message || "Failed to load brokers");
    }
  } catch (error) {
    console.error("Error fetching brokers:", error);
    toast.error("Failed to load brokers: " + error.message);
  } finally {
    setLoadingBrokers(false);
  }
};

  const fetchTransporters = async () => {
    setLoadingTransporters(true);
    try {
      const response = await fetchLink({
        address: `pos/transporters`
      });
      
      if (response?.success) {
      // Handle the nested data structure
      const transportersData = response.data?.Transporters || response.data || [];
      
      if (Array.isArray(transportersData)) {
        const transportersList = transportersData.map(transporter => ({
          id: transporter.Transporter_Id,
          name: transporter.Transporter_Name?.trim() || '',
          code: transporter.Transporter_Code?.trim() || '',
          mobile: transporter.Mobile_No?.trim() || ''
        }));
        setAvailableTransporters(transportersList);
      } else {
        console.error("Transporters data is not an array:", transportersData);
        toast.error("Invalid transporters data format");
      }
    } else {
      console.error("Failed to fetch transporters:", response?.message);
      toast.error(response?.message || "Failed to load transporters");
    }
  } catch (error) {
    console.error("Error fetching transporters:", error);
    toast.error("Failed to load transporters: " + error.message);
  } finally {
    setLoadingTransporters(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    localStorage.removeItem("loginAt");
    setIsLoggedIn(false);
    setUserName("");
    toast.success("Logged out successfully");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const getProductPackGet = (productId) => {
    const product = allProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
    return product?.packGet || 1;
  };

  const loadAllProducts = async () => {
    try {
      const response = await fetchLink({
        address: 'products?limit=1000'
      });
      
      if (response?.success && Array.isArray(response.data)) {
        setAllProducts(response.data);
      }
    } catch (error) {
      console.error("Error loading all products:", error);
    }
  };

  const enhancedCartItems = useMemo(() => {
    return Object.entries(cartItems)
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
          price: product.price || 0,
          total: amount
        };
      });
  }, [cartItems, products, allProducts]);

  const totalItems = enhancedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalKgs = enhancedCartItems.reduce((sum, item) => sum + item.kgs, 0);
  const subtotalAmount = enhancedCartItems.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 12;
  const taxAmount = subtotalAmount * (taxRate / 100);
  const totalAmountWithTax = subtotalAmount;

  const handleCustomerSelect = (customerData) => {
    setCustomer(customerData.customerId);
    setContactNumber(customerData.mobileNo || "");
    setSelectedDetails(customerData);
    
    if (customerData.address) {
      setShippingAddress(customerData.address);
      setDeliveryAddress(customerData.address);
    }

    if (customerData.Broker_Id && customerData.broker) {
      setSelectedBroker({ 
        id: customerData.Broker_Id, 
        name: customerData.broker 
      });
      setBrokerName(customerData.broker);
    } else {
      setSelectedBroker({ id: null, name: "" });
      setBrokerName("");
    }

    if (customerData.Transporter_Id && customerData.transporter) {
      setSelectedTransporter({ 
        id: customerData.Transporter_Id, 
        name: customerData.transporter 
      });
      setTransporter(customerData.transporter);
    } else {
      setSelectedTransporter({ id: null, name: "" });
      setTransporter("");
    }
  };

  const handleBrokerSelect = (broker) => {
    setSelectedBroker(broker);
    setBrokerName(broker.name);
  };

  const handleTransporterSelect = (transporter) => {
    setSelectedTransporter(transporter);
    setTransporter(transporter.name);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadCartData();
    loadAllProducts();
    fetchBrokers();
    fetchTransporters();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCartData();
        loadAllProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadCartData = () => {
    setLoading(true);
    try {
      const savedCart = localStorage.getItem('cartItems');
      const savedProducts = localStorage.getItem('products');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (id, delta) => {
    setCartItems(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      
      let newCart;
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        newCart = rest;
      } else {
        newCart = { ...prev, [id]: next };
      }
      
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
    if (product) {
      toast.info(`Removed ${product.name} from cart`);
    }
  };

  const continueShopping = () => {
    navigate('/');
  };

  const handleProceed = () => {
    setStep(2);
  };

  const handleBackToSelection = () => {
    setStep(1);
  };

  const handleCheckout = async () => {
   

    if (!contactNumber) {
      toast.error("Please enter contact number");
      return;
    }
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    const formattedDateOnly = now.toISOString().split('T')[0];

    const parseData = JSON.parse(localStorage.getItem('user') || '{}');
    const storage = JSON.parse(localStorage.getItem('user') || '{}');

    const totalBeforeTax = enhancedCartItems.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = enhancedCartItems.reduce((sum, item) => {
      const taxRate = item.taxRate || 12;
      return sum + (item.amount * (taxRate / 100));
    }, 0);
    const totalInvoiceValue = totalBeforeTax + totalTax;
    const totalKgsValue = enhancedCartItems.reduce((sum, item) => sum + item.kgs, 0);

    const generalInfo = {
      So_Date: formattedDateOnly,
      Retailer_Id: parseInt(customer),
      Sales_Person_Id: storage?.user?.SalesPersonId || 0,
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId,
      VoucherType: 0,
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
      Created_by: parseData?.UserId || storage?.user?.UserId,
      Created_on: formattedDate,
      Trans_Type: "INSERT",
      Alter_Id: 0,
      
      Customer_Name: selectedDetails?.customerName || "",
      Ord_Mobile_No: contactNumber,
      Broker_Name: selectedBroker.name || "",
      Broker_Id: selectedBroker.id || null,
      Transporter_Name: selectedTransporter.name || "",
      Transporter_Id: selectedTransporter.id || null,
      Shipp_Address: shippingAddress || selectedDetails?.Address || "",
      Deliv_Address: deliveryAddress || shippingAddress || selectedDetails?.Address || "",
      Total_Kgs: totalKgsValue.toFixed(2),
      Total_Items: enhancedCartItems.length
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
        HSN_Code: item.hsn || "210690",
        Unit_Id: item.unitId,
        Unit_Name: item.unitName,
        Taxable_Amount: taxableAmount.toFixed(2),
        Tax_Rate: taxRate,
        Cgst: cgstSgstRate,
        Cgst_Amo: cgstSgstAmount.toFixed(2),
        Sgst: cgstSgstRate,
        Sgst_Amo: cgstSgstAmount.toFixed(2),
        Igst: 0,
        Igst_Amo: "0.00",
        Final_Amo: finalAmount.toFixed(2),
        Created_on: formattedDate,
        
        Product_Id: parseInt(item.id),
        Product_Name: item.name,
        Quantity: item.quantity,
        Price: item.price,
        Total: taxableAmount.toFixed(2),
        Weight: item.kgs.toString(),
        Unit: item.unit,
        PackGet: item.packGet
      };
    });

    const saleData = {
      generalInfo: generalInfo,
      stockInfo: stockInfo,
      totalAmount: totalInvoiceValue,
      totalItems: enhancedCartItems.length,
      totalKgs: totalKgsValue.toFixed(2),
      customerId: customer,
      customerName: selectedDetails?.customerName || "",
      contactNumber: contactNumber,
      brokerName: selectedBroker.name,
      transporter: selectedTransporter.name,
      shippingAddress: shippingAddress,
      deliveryAddress: deliveryAddress,
      description: description,
      Created_by: parseData?.UserId || parseData?.user_id || "",
      Branch_Id: storage?.user?.BranchId || parseData?.BranchId || 2
    };

    try {
      const loadingToast = toast.loading("Placing order...");

      const response = await fetchLink({
        address: `sales/salesInvoice/Whatsapp`,
        method: 'POST',
        bodyData: saleData  
      });

      toast.dismiss(loadingToast);

      if (response?.success) {
        toast.success(`Order placed successfully!`);
        
        setCartItems([]);
        localStorage.removeItem('cartItems');
        localStorage.removeItem('selectedCustomer');
        
        const orderId = response.data?.Sales_Order_Id || response.data?.So_Id || response.data?.Pre_Ord_Id;
        
        if (orderId) {
          navigate(`/`, { 
            state: { 
              orderId: orderId,
              customerName: saleData.customerName,
              orderData: response.data,
              success: true,
              message: `Order created successfully`
            } 
          });
        } else {
          navigate('/', { 
            state: { 
              success: true,
              message: "Order created successfully" 
            } 
          });
        }
      } else {
        toast.error(response?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order: " + (error.message || "Unknown error"));
    } finally {
      setContactNumber("");
      setCustomer("");
      setSelectedDetails(null);
      setBrokerName("");
      setTransporter("");
      setShippingAddress("");
      setDeliveryAddress("");
      setDescription("");
    }
  };

  const renderThreeDotsMenu = () => {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={toggleDropdown}
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
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
          }}
        >
          <MoreVertIcon style={{ fontSize: isMobile ? "24px" : "32px" }} />
        </button>
        
        <UserMenuDropdown 
          isOpen={isDropdownOpen}
          onClose={closeDropdown}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLoginClick={() => setIsLoginPopupOpen(true)}
          onLogout={handleLogout}
        />
      </div>
    );
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: BG_COLOR
      }}>
        <div style={{ color: BROWN, fontSize: "18px" }}>Loading cart...</div>
      </div>
    );
  }

  const mobileStyles = {
    container: {
      maxWidth: "100%",
      margin: "0 auto",
      padding: "12px 16px",
      background: BG_COLOR,
      minHeight: "100vh",
      paddingBottom: isMobile && step === 1 && enhancedCartItems.length > 0 ? '100px' : '20px',
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      color: BROWN,
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    backBtn: {
      background: "transparent",
      border: "none",
      color: BROWN,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "4px",
    },
    productItem: {
      display: "flex",
      padding: "16px 12px",
      borderBottom: "1px solid #eee",
      position: "relative",
      background: "#fff",
      borderRadius: "12px",
      marginBottom: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    productImage: {
      width: "70px",
      height: "70px",
      borderRadius: "8px",
      objectFit: "cover",
      marginRight: "12px",
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: "15px",
      fontWeight: "600",
      color: BROWN,
      margin: "0 0 2px 0",
    },
    productTamil: {
      fontSize: "12px",
      color: "#666",
      margin: "0 0 6px 0",
      fontStyle: "italic",
    },
    productPrice: {
      display: "flex",
      gap: "10px",
      marginBottom: "8px",
    },
    priceTag: {
      background: "#f0e9e2",
      padding: "3px 8px",
      borderRadius: "16px",
      fontSize: "12px",
      color: BROWN,
    },
    quantityControl: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "6px",
    },
    qtyBtn: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      border: `1px solid ${BROWN_LIGHT}`,
      background: "#fff",
      color: BROWN,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
    },
    qtyValue: {
      fontSize: "14px",
      fontWeight: "600",
      color: BROWN,
      minWidth: "25px",
      textAlign: "center",
    },
    itemTotal: {
      fontSize: "14px",
      fontWeight: "600",
      color: BROWN,
      marginLeft: "12px",
    },
    deleteBtn: {
      position: "absolute",
      top: "12px",
      right: "12px",
      color: "#999",
      cursor: "pointer",
    },
    bottomBar: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#fff",
      boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
      padding: "16px",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      borderTop: `2px solid ${BROWN_DARK}`,
      zIndex: 20,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      fontSize: "14px",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px",
      paddingTop: "8px",
      borderTop: "2px dashed #ddd",
      fontSize: "18px",
      fontWeight: "bold",
      color: BROWN,
    },
    proceedBtn: {
      width: "100%",
      padding: "14px",
      background: BROWN_DARK,
      color: "#fff",
      border: "none",
      borderRadius: "25px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "500",
      color: "#666",
      marginBottom: "4px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      background: "#fff",
      boxSizing: "border-box"
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      background: "#fff",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      minHeight: "70px",
      background: "#fff",
      boxSizing: "border-box",
      fontFamily: "inherit"
    },
    productListSummary: {
      background: "#f9f4ef",
      padding: "12px",
      borderRadius: "10px",
      fontSize: "13px",
      color: BROWN,
    },
    checkoutBtn: {
      width: "100%",
      padding: "16px",
      background: BROWN_DARK,
      color: "#fff",
      border: "none",
      borderRadius: "25px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "20px",
      marginBottom: "20px",
    },
    emptyCart: {
      textAlign: "center",
      padding: "60px 20px",
      background: "#fff",
      borderRadius: "16px",
    },
  };

  const desktopStyles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "30px 40px",
      background: BG_COLOR,
      minHeight: "100vh",
    },
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1.8fr",
      gap: "32px",
    },
    leftSection: {
      background: "#fff",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    rightSection: {
      background: "#fff",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      padding: "32px",
    },
    sectionTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: BROWN,
      margin: "0 0 24px 0",
      paddingBottom: "16px",
      borderBottom: `3px solid ${ACCENT}`,
    },
    formGroup: {
      marginBottom: "24px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "14px 16px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      fontSize: "16px",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      boxSizing: "border-box",
      fontFamily: "inherit",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "16px",
      fontSize: "18px",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "3px dashed #ddd",
      fontSize: "24px",
      fontWeight: "bold",
      color: BROWN,
    },
    checkoutBtn: {
      width: "100%",
      padding: "18px",
      background: BROWN,
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      fontSize: "20px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "32px",
      transition: "all 0.3s",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 12px rgba(74, 44, 26, 0.2)",
    },
    emptyCart: {
      textAlign: "center",
      padding: "80px 40px",
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  // MOBILE STEP 2 VIEW
  if (isMobile && step === 2) {
    return (
      <>   
        <CommonHeader
          title="Order Details"
          logo="SMT"
          showSearch={false}
          showCart={false}
          showBackButton={true}
          showTitle={true}
          cartItemCount={0}
          onBackClick={handleBackToSelection}
          isMobile={isMobile}
          backgroundColor={BROWN_DARK}
          isLoggedIn={isLoggedIn}
          showLogout={isLoggedIn}
          userName={userName}
          customActions={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderThreeDotsMenu()}
            </div>
          }
        />

        <div style={{ marginTop: "20px", marginBottom: "20px", padding: "0 16px" }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer</label>
            <SearchableCustomerSelect 
              value={customer}
              onChange={setCustomer}
              onCustomerSelect={handleCustomerSelect}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Broker</label>
            <BrokerDropdown
              selectedBroker={selectedBroker}
              onSelectBroker={handleBrokerSelect}
              availableBrokers={availableBrokers}
              loading={loadingBrokers}
              onOpen={fetchBrokers}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Transporter</label>
            <TransporterDropdown
              selectedTransporter={selectedTransporter}
              onSelectTransporter={handleTransporterSelect}
              availableTransporters={availableTransporters}
              loading={loadingTransporters}
              onOpen={fetchTransporters}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Number</label>
            <input
              type="tel"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Shipping Address</label>
            <textarea
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Address</label>
            <textarea
              placeholder="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.productListSummary}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              marginBottom: "8px",
              paddingBottom: "8px",
              borderBottom: "1px dashed #ccc"
            }}>
              <span style={{ fontWeight: "bold" }}>Product List</span>
              <span 
                style={{ color: BROWN, cursor: "pointer" }}
                onClick={() => {
                  setCartItems({});
                  localStorage.removeItem('cartItems');
                  setStep(1);
                }}
              >
                Clear ▼
              </span>
            </div>
            {enhancedCartItems.map(item => (
              <div key={item.id} style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "4px",
                fontSize: "12px"
              }}>
                <span>• {item.name} x {item.quantity} ({item.kgs.toFixed(2)} kg)</span>
                <span>₹{item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          padding: "16px",
          borderTop: `2px solid ${ACCENT}`,
          marginTop: "10px",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "16px",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#666",
            }}>
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#666",
            }}>
              <span>Total Kgs:</span>
              <span>{totalKgs.toFixed(2)} kg</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#666",
            }}>
              <span>Subtotal:</span>
              <span>₹{subtotalAmount.toFixed(2)}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: BROWN,
              borderTop: "1px dashed #ddd",
              paddingTop: "8px",
            }}>
              <span>Total Amount:</span>
              <span>₹{totalAmountWithTax.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            style={styles.checkoutBtn}
          >
            Order Now
          </button>
        </div>

        <LoginPopup 
          isOpen={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // MOBILE STEP 1 VIEW
  if (isMobile && step === 1) {
    return (
      <>
        <CommonHeader
          title="SM Traders"
          logo="SMT"
          showSearch={false}
          showCart={false} 
          showBackButton={true}
          showTitle={true}
          cartItemCount={0} 
          onBackClick={continueShopping}
          isMobile={isMobile}
          backgroundColor={BROWN_DARK}
          isLoggedIn={isLoggedIn}
          showLogout={isLoggedIn}
          userName={userName}
          customActions={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {renderThreeDotsMenu()}
            </div>
          }
        />

        <div style={styles.container}>
          
          <div style={{ marginBottom: "20px" }}>
            {enhancedCartItems.map((item) => {
              return (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px dashed #ddd",
                }}>
                  <div style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flex: 1,
                  }}>
                    <img 
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop";
                      }}
                    />
                    
                    <div>
                      <h3 style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: BROWN,
                        margin: "0 0 2px 0",
                      }}>
                        {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                      </h3>
                      <div style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}>
                        <span style={{
                          background: "#f0e9e2",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: BROWN,
                          display: "inline-block",
                        }}>
                          ₹{item.price}/kg
                        </span>
                        <span style={{
                          fontSize: "11px",
                          color: "#666",
                        }}>
                          Pack: {item.packGet || 1}kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#f5f0eb",
                      padding: "2px 6px",
                      borderRadius: "25px",
                    }}>
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        style={{
                          width: "24px",
                          height: "24px",
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
                        }}
                      >
                        -
                      </button>
                      
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: BROWN,
                        minWidth: "20px",
                        textAlign: "center",
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        style={{
                          width: "24px",
                          height: "24px",
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
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      <div style={{
                        textAlign: "right",
                      }}>
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: BROWN,
                          minWidth: "60px",
                          display: "block",
                        }}>
                          ₹{item.amount.toFixed(2)}
                        </span>
                        <span style={{
                          fontSize: "10px",
                          color: "#999",
                          display: "block",
                        }}>
                          ({item.quantity} × {item.packGet || 1}kg)
                        </span>
                      </div>
                      
                      <div 
                        style={{
                          color: "#999",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          transition: "all 0.2s",
                        }}
                        onClick={() => removeItem(item.id)}
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
            })}
          </div>

          <div style={styles.bottomBar}>
            <div style={styles.summaryRow}>
              <div>
                <div>{totalItems} Items Selected</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Total Weight: {totalKgs.toFixed(2)} kg
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", color: BROWN }}>
                  Subtotal: ₹{subtotalAmount.toFixed(2)}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleProceed}
              style={styles.proceedBtn}
            >
              Proceed
              <span>→</span>
            </button>
          </div>
        </div>

        <LoginPopup 
          isOpen={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // DESKTOP VIEW
  return (
    <>
      <CommonHeader
        title="SM Traders"
        logo="SMT"
        showSearch={false}
        showCart={false} 
        showBackButton={true}
        showTitle={true}
        cartItemCount={0}  
        onBackClick={continueShopping}
        customActions={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {renderThreeDotsMenu()}
          </div>
        }
        isMobile={isMobile}
        backgroundColor={BROWN_DARK}
        userName={userName}
        isLoggedIn={isLoggedIn}
      />

      <div style={desktopStyles.container}>
        {enhancedCartItems.length === 0 ? (
          <div style={desktopStyles.emptyCart}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
              Your selection list is empty
            </p>
            <button 
              onClick={continueShopping}
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
              Browse Products
            </button>
          </div>
        ) : (
          <div style={desktopStyles.mainContent}>
            <div style={desktopStyles.leftSection}>
              <div style={{ padding: "20px" }}>
                <h2 style={desktopStyles.sectionTitle}>Selection List</h2>
                
                {enhancedCartItems.map((item) => {
                  return (
                    <div key={item.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px dashed #ddd",
                    }}>
                      <div style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        flex: 1,
                      }}>
                        <img 
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=50&h=50&fit=crop";
                          }}
                        />
                        
                        <div>
                          <h3 style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: BROWN,
                            margin: "0 0 2px 0",
                          }}>
                            {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                          </h3>
                          <div style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}>
                            <span style={{
                              background: "#f0e9e2",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              color: BROWN,
                              display: "inline-block",
                            }}>
                              ₹{item.price}/kg
                            </span>
                            <span style={{
                              fontSize: "11px",
                              color: "#666",
                            }}>
                              Pack: {item.packGet || 1}kg
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#f5f0eb",
                          padding: "2px 6px",
                          borderRadius: "25px",
                        }}>
                          <button 
                            onClick={() => updateQty(item.id, -1)}
                            style={{
                              width: "24px",
                              height: "24px",
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
                            }}
                          >
                            -
                          </button>
                          
                          <span style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: BROWN,
                            minWidth: "20px",
                            textAlign: "center",
                          }}>
                            {item.quantity}
                          </span>
                          
                          <button 
                            onClick={() => updateQty(item.id, 1)}
                            style={{
                              width: "24px",
                              height: "24px",
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
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}>
                          <div style={{
                            textAlign: "right",
                          }}>
                            <span style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: BROWN,
                              minWidth: "60px",
                              display: "block",
                            }}>
                              ₹{item.amount.toFixed(2)}
                            </span>
                            <span style={{
                              fontSize: "10px",
                              color: "#999",
                              display: "block",
                            }}>
                              ({item.quantity} × {item.packGet || 1}kg)
                            </span>
                          </div>
                          
                          <div 
                            style={{
                              color: "#999",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              transition: "all 0.2s",
                            }}
                            onClick={() => removeItem(item.id)}
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
                })}
              </div>
            </div>

            <div style={desktopStyles.rightSection}>
              <h2 style={desktopStyles.sectionTitle}>Order Details</h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}>
                <div>
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Customer
                    </label>
                    <SearchableCustomerSelect 
                      value={customer}
                      onChange={setCustomer}
                      onCustomerSelect={handleCustomerSelect}
                    />
                  </div>
                  
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Broker
                    </label>
                    <BrokerDropdown
                      selectedBroker={selectedBroker}
                      onSelectBroker={handleBrokerSelect}
                      availableBrokers={availableBrokers}
                      loading={loadingBrokers}
                      onOpen={fetchBrokers}
                    />
                  </div>
                  
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Shipping Address
                    </label>
                    <textarea
                      placeholder="Enter shipping address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      style={desktopStyles.textarea}
                    />
                  </div>
                  
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Description
                    </label>
                    <textarea
                      placeholder="Add any notes or description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={desktopStyles.textarea}
                    />
                  </div>
                </div>

                <div>
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Transporter
                    </label>
                    <TransporterDropdown
                      selectedTransporter={selectedTransporter}
                      onSelectTransporter={handleTransporterSelect}
                      availableTransporters={availableTransporters}
                      loading={loadingTransporters}
                      onOpen={fetchTransporters}
                    />
                  </div>
                  
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter contact number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      style={desktopStyles.input}
                    />
                  </div>
                  
                  <div style={desktopStyles.formGroup}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Delivery Address
                    </label>
                    <textarea
                      placeholder="Enter delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      style={desktopStyles.textarea}
                    />
                  </div>
                </div>
              </div>

              <div style={desktopStyles.formGroup}>
                <div style={{
                  background: "#f9f4ef",
                  padding: "24px",
                  borderRadius: "16px",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                }}>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: BROWN,
                    margin: "0 0 16px 0",
                    paddingBottom: "12px",
                    borderBottom: `2px solid ${ACCENT}`,
                  }}>
                    Order Summary
                  </h3>
                  
                  {enhancedCartItems.map(item => (
                    <div key={item.id} style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "15px",
                      lineHeight: "1.5",
                    }}>
                      <div>
                        <span style={{ fontWeight: "500" }}>• {item.name}</span>
                        <span style={{ color: "#666", marginLeft: "6px", fontSize: "14px" }}>
                          ({item.quantity} × {item.packGet}kg = {item.kgs.toFixed(2)}kg)
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "600" }}>₹{item.amount.toFixed(2)}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          ₹{item.price}/kg
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div style={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "2px dashed #ccc",
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "16px",
                      color: "#666",
                      marginBottom: "8px",
                    }}>
                      <span>Total Items:</span>
                      <span style={{ fontWeight: "600", color: BROWN }}>{totalItems}</span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "16px",
                      color: "#666",
                      marginBottom: "8px",
                    }}>
                      <span>Total Kgs:</span>
                      <span style={{ fontWeight: "600", color: BROWN }}>{totalKgs.toFixed(2)} kg</span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "16px",
                      color: "#666",
                      marginBottom: "12px",
                      paddingBottom: "12px",
                      borderBottom: "1px dashed #ddd",
                    }}>
                      <span>Subtotal:</span>
                      <span style={{ fontWeight: "600", color: BROWN }}>₹{subtotalAmount.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: BROWN,
                      marginTop: "8px",
                    }}>
                      <span>Total Amount:</span>
                      <span>₹{totalAmountWithTax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                style={desktopStyles.checkoutBtn}
                onMouseEnter={(e) => e.target.style.background = BROWN_DARK}
                onMouseLeave={(e) => e.target.style.background = BROWN}
              >
                Order Now
              </button>
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