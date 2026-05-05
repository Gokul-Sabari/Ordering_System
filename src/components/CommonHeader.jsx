import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';

const BROWN_DARK = "#3a1f0e";
const BROWN = "#4a2c1a";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";

const CommonHeader = ({ 
  title, 
  logo, 
  showSearch = true, 
  showCart = true, 
  showBackButton = false,
  showTitle = true,
  cartItemCount = 0,
  onSearchClick,
  onCartClick,
  onBackClick,
  customActions,
  isMobile = false,
  backgroundColor = BROWN_DARK,
  showLogout = false,
  onLogout,
  userName = "",
  isLoggedIn = false,
  selectedCount = 0,
  handleCartClick,
  // Customer selector props
  showCustomerSelector = false,
  customers = [],
  selectedCustomer = null,
  onCustomerSelect = null,
  loadingCustomers = false,
  userType = ""
}) => {
  const navigate = useNavigate();
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const customerDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const isSelectingRef = useRef(false);

 const removeSplChar = (text = '') => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  };

useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSelectingRef.current) return;
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
        setCustomerDropdownOpen(false);
        setCustomerSearch("");
        setFilteredCustomers([]);
        setHasSearched(false);
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
    if (customerDropdownOpen && searchInputRef.current && isMobile) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 500);
    }
  }, [customerDropdownOpen, isMobile]);


  useEffect(() => {
    if (customerDropdownOpen && !hasSearched) {
      setFilteredCustomers(customers);
    }
  }, [customerDropdownOpen, customers, hasSearched]);

 const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('loginAt');
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
    if (onLogout) onLogout();
  };

  const handleBackClick = () => {
    if (onBackClick) onBackClick();
    else navigate(-1);
  };

  const handleCustomerSelect = (customer) => {
  
    isSelectingRef.current = true;
    
    
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
    
  
    setCustomerDropdownOpen(false);
    setCustomerSearch("");
    setFilteredCustomers([]);
    setHasSearched(false);
    

    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  };

   const handleSearchChange = (e) => {
    setCustomerSearch(e.target.value);
  };

 
  const performSearch = () => {
    if (!customerSearch.trim()) {
      setFilteredCustomers(customers);
      setHasSearched(false);
      return;
    }
    
    const normalizedSearch = removeSplChar(customerSearch);
    
    if (!normalizedSearch) {
      setFilteredCustomers(customers);
      setHasSearched(false);
      return;
    }
    
    const results = customers.filter((c) => {
      const allFields = [];
      

      if (c.name) allFields.push(String(c.name));
      if (c.billName) allFields.push(String(c.billName));
      if (c.mobile) allFields.push(String(c.mobile));
      if (c.city) allFields.push(String(c.city));
      if (c.id) allFields.push(String(c.id));
      if (c.address) allFields.push(String(c.address));
      if (c.ledgerName) allFields.push(String(c.ledgerName));
      if (c.partyMailingName) allFields.push(String(c.partyMailingName));
      if (c.ledgerTallyId) allFields.push(String(c.ledgerTallyId));
      if (c.brokerName) allFields.push(String(c.brokerName));
      if (c.brokerId) allFields.push(String(c.brokerId));
      if (c.transporterName) allFields.push(String(c.transporterName));
      if (c.transporterId) allFields.push(String(c.transporterId));
      
     
      Object.keys(c).forEach(key => {
        const value = c[key];
        if (value !== null && value !== undefined && value !== '' && 
            typeof value !== 'object' && !allFields.includes(String(value))) {
          allFields.push(String(value));
        }
      });
      
 
      return allFields.some(field => {
        const normalizedField = removeSplChar(field);
        return normalizedField.includes(normalizedSearch);
      });
    });
    
    setFilteredCustomers(results);
    setHasSearched(true);
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
    performSearch();
  };

   const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  const handleDropdownToggle = () => {
    if (!customerDropdownOpen) {
      setCustomerSearch("");
      setFilteredCustomers(customers);
      setHasSearched(false);
    }
    setCustomerDropdownOpen(!customerDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setCustomerDropdownOpen(false);
    setCustomerSearch("");
    setFilteredCustomers([]);
    setHasSearched(false);
  };

  const headerStyle = {
    backgroundColor: BROWN_DARK,
    color: "#fff",
    padding: isMobile ? "10px 16px" : "12px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1400,
    margin: "0 auto",
    gap: isMobile ? 8 : 16,
  };

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 8 : 16,
    flex: showCustomerSelector ? "0 0 auto" : 1,
  };

  const logoStyle = {
    width: isMobile ? 36 : 44,
    height: isMobile ? 36 : 44,
    borderRadius: "50%",
    backgroundColor: ACCENT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: isMobile ? 14 : 18,
    color: BROWN_DARK,
    flexShrink: 0,
  };

  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? 16 : 20,
    fontWeight: "bold",
    color: "#fff",
  };

const customerSelectorStyle = {
    position: "relative",
    flex: 1,
    maxWidth: isMobile ? "200px" : "500px",
    minWidth: isMobile ? "150px" : "400px",
  };
  const customerSelectorButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "8px 12px" : "8px 14px",
    border: `1.5px solid ${ACCENT}`,
    borderRadius: "25px",
    background: selectedCustomer ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    userSelect: "none",
  };

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 8 : 16,
  };

  const iconButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    borderRadius: '50%',
    transition: 'background 0.2s',
  };

  const userNameBadgeStyle = {
    fontSize: isMobile ? 12 : 14,
    color: "#fff",
    opacity: 0.9,
    background: "rgba(255,255,255,0.15)",
    padding: isMobile ? "3px 8px" : "4px 12px",
    borderRadius: "20px",
    maxWidth: isMobile ? "100px" : "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  };


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
  };


  const desktopDropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    maxHeight: '400px',
    overflowY: 'auto',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 9999,
  };

  const dropdownStyle = isMobile ? mobileDropdownStyle : desktopDropdownStyle;


  const customerItemStyle = (customer) => ({
    padding: isMobile ? "16px" : "12px 14px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    background: selectedCustomer?.id === customer.id ? "#f0e9e2" : "transparent",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    userSelect: "none",
  });

  return (
    <>
      <header style={headerStyle}>
        <div style={containerStyle}>
          <div style={leftSectionStyle}>
            {showBackButton && (
              <button
                onClick={handleBackClick}
                style={iconButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <ArrowBackIcon style={{ fontSize: isMobile ? '20px' : '24px' }} />
              </button>
            )}
            
            <div style={logoStyle}>
              {logo || "SMT"}
            </div>
            
            {showTitle && (
              <h2 style={titleStyle}>{title || "SM Traders"}</h2>
            )}
        
            {showCustomerSelector && isLoggedIn && customers.length > 0 && (
              <div style={customerSelectorStyle} ref={customerDropdownRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDropdownToggle();
                  }}
                  style={customerSelectorButtonStyle}
                  type="button"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                    <span style={{ fontSize: isMobile ? "14px" : "14px" }}>🏪</span>
                    <span style={{
                      fontSize: isMobile ? "12px" : "18px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#fff",
                    }}>
                      {selectedCustomer ? selectedCustomer.name : (userType === "customer" ? "Select Retailer" : "Select Customer")}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "10px",
                    transform: customerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>▼</span>
                </button>

                {customerDropdownOpen && (
                  <div style={dropdownStyle}>
                   
                    {isMobile && (
                      <div style={{
                        padding: "16px",
                        background: BROWN_DARK,
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {userType === "customer" ? "Select Retailer" : "Select Customer"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCloseDropdown();
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: "24px",
                            cursor: "pointer",
                            padding: "8px 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            WebkitTapHighlightColor: "transparent",
                          }}
                          type="button"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    
                    {/* Search bar */}
                    <div style={{ 
                      padding: isMobile ? "12px 16px" : "15px 12px", 
                      borderBottom: "1px solid #f0f0f0", 
                      background: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}>
                      <div style={{ flex: 1 }}>
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search by name, mobile, city..."
                          value={customerSearch}
                          onChange={handleSearchChange}
                          onKeyDown={handleKeyDown}
                          autoComplete="off"
                          autoCorrect="off"
                          style={{
                            width: "150%",
                            padding: isMobile ? "14px 16px" : "8px 12px",
                            border: `1px solid ${ACCENT}`,
                            color: BROWN_DARK,
                            borderRadius: "8px",
                            fontSize: isMobile ? "16px" : "13px",
                            outline: "none",
                            boxSizing: "border-box",
                            WebkitAppearance: "none",
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
                        onClick={(e) => {
                          e.preventDefault();
                          performSearch();
                        }}
                        style={{
                          background: BROWN,
                          border: "none",
                          borderRadius: "8px",
                          padding: isMobile ? "14px 16px" : "8px 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          WebkitTapHighlightColor: "transparent",
                        }}
                        type="button"
                      >
                        <SearchIcon style={{ fontSize: isMobile ? "22px" : "18px", color: "#fff" }} />
                      </button>
                    </div>
                    
                    {/* Scrollable content */}
                    <div style={{ 
                      flex: 1, 
                      overflowY: "auto",
                      WebkitOverflowScrolling: "touch",
                    }}>
                      {loadingCustomers ? (
                        <div style={{ padding: "80px", textAlign: "center", color: "#999" }}>
                          <CircularProgress size={30} style={{ color: BROWN }} />
                          <div style={{ marginTop: "16px", fontSize: "14px" }}>Loading customers...</div>
                        </div>
                      ) : filteredCustomers.length === 0 ? (
                        <div style={{ padding: "80px", textAlign: "center", color: "#999", fontSize: "14px" }}>
                          {hasSearched ? "No matching customers found" : "No customers/outlets found"}
                        </div>
                      ) : (
                        <>
                          {hasSearched && (
                            <div style={{ 
                              padding: "10px 16px", 
                              fontSize: "12px", 
                              color: "#999", 
                              borderBottom: "1px solid #f0f0f0",
                              background: "#fafafa"
                            }}>
                              {/* Search results for: "{customerSearch}" */}
                            </div>
                          )}
                          
                          {filteredCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => handleCustomerSelect(customer)}
                              style={customerItemStyle(customer)}
                            >
                              <div style={{ 
                                fontWeight: selectedCustomer?.id === customer.id ? "600" : "500", 
                                color: BROWN, 
                                fontSize: isMobile ? "16px" : "13px", 
                                marginBottom: "4px" 
                              }}>
                                {selectedCustomer?.id === customer.id && "✓ "}
                                {customer.name}
                              </div>
                              {customer.mobile && (
                                <div style={{ fontSize: isMobile ? "13px" : "11px", color: "#666" }}>
                                  📱 {customer.mobile}
                                </div>
                                
                              )}
                             
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={rightSectionStyle}>
            {isLoggedIn && userName && !showCustomerSelector && (
              <span style={userNameBadgeStyle}>
                {userName}
              </span>
            )}

            {showCart && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleCartClick || onCartClick}
                  style={iconButtonStyle}
                  type="button"
                >
                  <ShoppingCartIcon style={{ fontSize: isMobile ? '22px' : '24px' }} />
                </button>

                {(cartItemCount > 0 || selectedCount > 0) && (
                  <span style={cartBadgeStyle}>
                    {selectedCount || cartItemCount}
                  </span>
                )}
              </div>
            )}

            {customActions}
          </div>
        </div>
      </header>
    </>
  );
};

export default CommonHeader;