// import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import SearchIcon from '@mui/icons-material/Search';
// import CircularProgress from '@mui/material/CircularProgress';

// const BROWN_DARK = "#3a1f0e";
// const BROWN = "#4a2c1a";
// const BROWN_LIGHT = "#6b3f23";
// const ACCENT = "#c8a96e";

// const CommonHeader = memo(({ 
//   title, 
//   logo, 
//   showSearch = true, 
//   showCart = true, 
//   showBackButton = false,
//   showTitle = true,
//   cartItemCount = 0,
//   onSearchClick,
//   onCartClick,
//   onBackClick,
//   customActions,
//   isMobile = false,
//   backgroundColor = BROWN_DARK,
//   showLogout = false,
//   onLogout,
//   userName = "",
//   isLoggedIn = false,
//   selectedCount = 0,
//   handleCartClick,
//   // Customer selector props
//   showCustomerSelector = false,
//   customers = [],
//   selectedCustomer = null,
//   onCustomerSelect = null,
//   loadingCustomers = false,
//   userType = ""
// }) => {
//   const navigate = useNavigate();
//   const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
//   const [customerSearch, setCustomerSearch] = useState("");
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [hasSearched, setHasSearched] = useState(false);
//   const customerDropdownRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const isSelectingRef = useRef(false);



  
//   const removeSplChar = (text = '') => {
//     if (!text) return '';
//     return text
//       .toString()
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, '');
//   };

// useEffect(() => {
//   const handleClickOutside = (e) => {
//     // Don't close if we're in the middle of selecting
//     if (isSelectingRef.current) return;
    
//     // Check if click is inside the dropdown or on the button
//     if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
//       // Also check if click target might be a child of the button
//       const isButtonClick = e.target.closest('[data-customer-selector-button]');
//       if (!isButtonClick) {
//         setCustomerDropdownOpen(false);
//         setCustomerSearch("");
//         setFilteredCustomers([]);
//         setHasSearched(false);
//       }
//     }
//   };
  
//   document.addEventListener("mousedown", handleClickOutside);
//   document.addEventListener("touchstart", handleClickOutside);
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//     document.removeEventListener("touchstart", handleClickOutside);
//   };
// }, []);

//   useEffect(() => {
//     if (customerDropdownOpen && searchInputRef.current && isMobile) {
//       setTimeout(() => {
//         if (searchInputRef.current) {
//           searchInputRef.current.focus();
//         }
//       }, 500);
//     }
//   }, [customerDropdownOpen, isMobile]);

//   useEffect(() => {
//     if (customerDropdownOpen && !hasSearched) {
//       setFilteredCustomers(customers);
//     }
//   }, [customerDropdownOpen, customers, hasSearched]);

//   // Reset search when customers list changes
//   useEffect(() => {
//     if (customerDropdownOpen) {
//       setFilteredCustomers(customers);
//       setHasSearched(false);
//       setCustomerSearch("");
//     }
//   }, [customers]); // Only run when customers array changes

// const handleLogout = () => {
//   // List of all keys to remove (cart, order, customer related)
//   const keysToRemove = [
//     // User session
//     'user',
//     'session', 
//     'loginAt',
//     'userType',
//     'username',
//     'retId',
    
//     // Cart related
//     'cartItems',
//     'cartItemsBackup',
//     'previousCartItems',
//     'products',
//     'productsBackup',
//     'productMapping',
    
//     // Order edit related
//     'editOrderId',
//     'editOrderData',
//     'editProductsList',
//     'isEditingOrder',
    
//     // Customer selection related
//     'selectedCustomer',
//     'selectedCustomerId',
//     'selectedCustomerData',
//     'cartPageSelectedCustomer',
//     'cartPageSelectedCustomerId',
//     'cartPageCustomer',
//     'cartPageContactNumber',
//     'cartPageBroker',
//     'cartPageTransporter',
//     'cartPageShippingAddress',
//     'cartPageDeliveryAddress',
//     'cartPageDescription',
    
//     // Any other app-specific keys
//     'userData',
//     'sessionData'
//   ];
  
//   // Remove all keys
//   keysToRemove.forEach(key => {
//     localStorage.removeItem(key);
//   });
  
//   // Optional: Clear all localStorage (if you want to be thorough)
//   // localStorage.clear();
  
//   toast.success('Logged out successfully');
//   navigate('/', { replace: true });
//   if (onLogout) onLogout();
// };


//   const handleBackClick = () => {
//     if (onBackClick) onBackClick();
//     else navigate(-1);
//   };

//   const handleCustomerSelect = (customer) => {
//     isSelectingRef.current = true;
    
//     if (onCustomerSelect) {
//       onCustomerSelect(customer);
//     }
    
//     setCustomerDropdownOpen(false);
//     setCustomerSearch("");
//     setFilteredCustomers([]);
//     setHasSearched(false);
    
//     setTimeout(() => {
//       isSelectingRef.current = false;
//     }, 100);
//   };

//   const handleSearchChange = (e) => {
//     setCustomerSearch(e.target.value);
//   };

//   const performSearch = () => {
//     if (!customerSearch.trim()) {
//       setFilteredCustomers(customers);
//       setHasSearched(false);
//       return;
//     }
    
//     const normalizedSearch = removeSplChar(customerSearch);
    
//     if (!normalizedSearch) {
//       setFilteredCustomers(customers);
//       setHasSearched(false);
//       return;
//     }
    
//     const results = customers.filter((c) => {
//       const allFields = [];
      
//       if (c.name) allFields.push(String(c.name));
//       if (c.billName) allFields.push(String(c.billName));
//       if (c.mobile) allFields.push(String(c.mobile));
//       if (c.city) allFields.push(String(c.city));
//       if (c.id) allFields.push(String(c.id));
//       if (c.address) allFields.push(String(c.address));
//       if (c.ledgerName) allFields.push(String(c.ledgerName));
//       if (c.partyMailingName) allFields.push(String(c.partyMailingName));
//       if (c.ledgerTallyId) allFields.push(String(c.ledgerTallyId));
//       if (c.brokerName) allFields.push(String(c.brokerName));
//       if (c.brokerId) allFields.push(String(c.brokerId));
//       if (c.transporterName) allFields.push(String(c.transporterName));
//       if (c.transporterId) allFields.push(String(c.transporterId));
      
//       Object.keys(c).forEach(key => {
//         const value = c[key];
//         if (value !== null && value !== undefined && value !== '' && 
//             typeof value !== 'object' && !allFields.includes(String(value))) {
//           allFields.push(String(value));
//         }
//       });
      
//       return allFields.some(field => {
//         const normalizedField = removeSplChar(field);
//         return normalizedField.includes(normalizedSearch);
//       });
//     });
    
//     setFilteredCustomers(results);
//     setHasSearched(true);
//   };

//   const handleSearchClick = (e) => {
//     e.stopPropagation();
//     performSearch();
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       performSearch();
//     }
//   };

//   const handleDropdownToggle = () => {
//   setCustomerDropdownOpen(prev => {
//     if (!prev) {
//       // Opening: reset search state
//       setCustomerSearch("");
//       setFilteredCustomers(customers);
//       setHasSearched(false);
//     }
//     return !prev;
//   });
// };

//   const handleCloseDropdown = () => {
//     setCustomerDropdownOpen(false);
//     setCustomerSearch("");
//     setFilteredCustomers([]);
//     setHasSearched(false);
//   };

//   // Memoized styles to prevent unnecessary re-renders
//   const memoizedHeaderStyle = useMemo(() => ({
//     backgroundColor: BROWN_DARK,
//     color: "#fff",
//     padding: isMobile ? "10px 16px" : "12px 24px",
//     position: "sticky",
//     top: 0,
//     zIndex: 100,
//     boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//     minHeight: isMobile ? '56px' : '68px',
//     transition: 'none',
//   }), [isMobile]);

// const memoizedContainerStyle = useMemo(() => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   maxWidth: 1400,
//   margin: "0 auto",
//   gap: isMobile ? 6 : 16,
//   minHeight: isMobile ? '40px' : '48px',
//   width: '100%',
// }), [isMobile]);

// const leftSectionStyle = useMemo(() => ({
//   display: "flex",
//   alignItems: "center",
//   gap: isMobile ? 6 : 16,
//   flex: 1, // Allow left section to take available space but not push right section
//   minWidth: 0, // Allow flex child to shrink
//   overflow: 'hidden', // Prevent overflow
// }), [isMobile, showCustomerSelector]);

//   const logoStyle = useMemo(() => ({
//     width: isMobile ? 36 : 44,
//     height: isMobile ? 36 : 44,
//     borderRadius: "50%",
//     backgroundColor: ACCENT,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: "bold",
//     fontSize: isMobile ? 14 : 18,
//     color: BROWN_DARK,
//     flexShrink: 0,
//   }), [isMobile]);

//   const titleStyle = useMemo(() => ({
//     margin: 0,
//     fontSize: isMobile ? 16 : 20,
//     fontWeight: "bold",
//     color: "#fff",
//     minWidth: isMobile ? '120px' : '180px',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//   }), [isMobile]);

//   const customerSelectorStyle = useMemo(() => ({
//     position: "relative",
//     flex: 1,
//     maxWidth: isMobile ? "200px" : "500px",
//     minWidth: isMobile ? "150px" : "400px",
//   }), [isMobile]);

//   const customerSelectorButtonStyle = useMemo(() => ({
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: isMobile ? "8px 12px" : "8px 14px",
//     border: `1.5px solid ${ACCENT}`,
//     borderRadius: "25px",
//     background: selectedCustomer ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
//     cursor: "pointer",
//     width: "100%",
//     transition: "all 0.2s",
//     WebkitTapHighlightColor: "transparent",
//     touchAction: "manipulation",
//     userSelect: "none",
//   }), [isMobile, selectedCustomer]);

// const rightSectionStyle = useMemo(() => ({
//   display: "flex",
//   alignItems: "center",
//   gap: isMobile ? 8 : 16,
//   flexShrink: 0, // Prevent right section from shrinking
//   marginLeft: "auto", // Push to the far right
// }), [isMobile]);

//   const iconButtonStyle = useMemo(() => ({
//   background: 'transparent',
//   border: 'none',
//   cursor: 'pointer',
//   padding: isMobile ? '6px' : '8px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: '#fff',
//   borderRadius: '50%',
//   transition: 'background 0.2s',
//   minWidth: isMobile ? '36px' : '44px', // Ensure minimum touch target
//   minHeight: isMobile ? '36px' : '44px',
//   flexShrink: 0,
// }), [isMobile]);


//   const userNameBadgeStyle = useMemo(() => ({
//     fontSize: isMobile ? 12 : 14,
//     color: "#fff",
//     opacity: 0.9,
//     background: "rgba(255,255,255,0.15)",
//     padding: isMobile ? "3px 8px" : "4px 12px",
//     borderRadius: "20px",
//     maxWidth: isMobile ? "100px" : "200px",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   }), [isMobile]);

//   const cartBadgeStyle = useMemo(() => ({
//     position: 'absolute',
//     top: '2px',
//     right: '2px',
//     backgroundColor: '#e74c3c',
//     color: '#fff',
//     borderRadius: '50%',
//     width: '18px',
//     height: '18px',
//     fontSize: '11px',
//     fontWeight: 'bold',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     pointerEvents: 'none',
//   }), []);

//   const mobileDropdownStyle = useMemo(() => ({
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
//   }), []);

//   const desktopDropdownStyle = useMemo(() => ({
//     position: 'absolute',
//     top: 'calc(100% + 8px)',
//     left: 0,
//     right: 0,
//     maxHeight: '400px',
//     overflowY: 'auto',
//     background: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '12px',
//     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
//     zIndex: 9999,
//   }), []);

//   const dropdownStyle = isMobile ? mobileDropdownStyle : desktopDropdownStyle;

//   const customerItemStyle = (customer) => ({
//     padding: isMobile ? "16px" : "12px 14px",
//     borderBottom: "1px solid #f0f0f0",
//     cursor: "pointer",
//     background: selectedCustomer?.id === customer.id ? "#f0e9e2" : "transparent",
//     WebkitTapHighlightColor: "transparent",
//     touchAction: "manipulation",
//     userSelect: "none",
//   });

//   // Back button container style
//   const backButtonContainerStyle = useMemo(() => ({
//     width: isMobile ? '36px' : '44px',
//     height: isMobile ? '36px' : '44px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     visibility: showBackButton ? 'visible' : 'hidden',
//     flexShrink: 0,
//   }), [isMobile, showBackButton]);

//   return (
//     <>
//       <header style={memoizedHeaderStyle}>
//         <div style={memoizedContainerStyle}>
//           {/* Left Section */}
//           <div style={leftSectionStyle}>
//             {/* Back Button with consistent space */}
//             <div style={backButtonContainerStyle}>
//               {showBackButton && (
//                 <button
//                   onClick={handleBackClick}
//                   style={iconButtonStyle}
//                   onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
//                   onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//                   aria-label="Go back"
//                 >
//                   <ArrowBackIcon style={{ fontSize: isMobile ? '20px' : '24px' }} />
//                 </button>
//               )}
//             </div>
            
//             {/* Logo */}
//             <div style={logoStyle}>
//               {logo || "SMT"}
//             </div>
            
//             {/* Title */}
//             {/* {showTitle && (
//               <h2 style={titleStyle}>{title || "SM Traders"}</h2>
//             )}
//          */}
//             {/* Customer Selector */}
//             {showCustomerSelector && isLoggedIn && customers.length > 0 && (
//               <div 
//                 style={customerSelectorStyle} 
//                 ref={customerDropdownRef}
//                 key={`customer-selector-${selectedCustomer?.id || 'none'}`}
//               >
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleDropdownToggle();
//                   }}
//                   style={customerSelectorButtonStyle}
//                   type="button"
//                 >
//                   <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
//                     <span style={{ fontSize: isMobile ? "14px" : "14px" }}>🏪</span>
//                     <span style={{
//                       fontSize: isMobile ? "12px" : "18px",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                       color: "#fff",
//                     }}>
//                       {selectedCustomer ? selectedCustomer.name : (userType === "customer" ? "Select Retailer" : "Select Customer")}
//                     </span>
//                   </div>
//                   <span style={{
//                     fontSize: "10px",
//                     transform: customerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
//                     transition: "transform 0.2s",
//                   }}>▼</span>
//                 </button>

//                 {customerDropdownOpen && (
//                   <div style={dropdownStyle}>
//                     {/* Mobile close button */}
//                     {isMobile && (
//                       <div style={{
//                         padding: "16px",
//                         background: BROWN_DARK,
//                         color: "#fff",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "left",
//                         flexShrink: 0,
//                       }}>
//                         <span style={{ fontSize: "18px", fontWeight: "bold" }}>
//                           {userType === "customer" ? "Select Retailer" : "Select Customer"}
//                         </span>
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             handleCloseDropdown();
//                           }}
//                           style={{
//                             background: "transparent",
//                             border: "none",
//                             color: "#fff",
//                             fontSize: "24px",
//                             cursor: "pointer",
//                             padding: "8px 12px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             WebkitTapHighlightColor: "transparent",
//                           }}
//                           type="button"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     )}
                    
//                     {/* Search bar */}
//                     <div style={{ 
//                       padding: isMobile ? "12px 16px" : "15px 12px", 
//                       borderBottom: "1px solid #f0f0f0", 
//                       background: "#f9f9f9",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       flexShrink: 0,
//                     }}>
//                       <div style={{ flex: 1 }}>
//                         <input
//                           ref={searchInputRef}
//                           type="text"
//                           placeholder="Search by name, mobile, city..."
//                           value={customerSearch}
//                           onChange={handleSearchChange}
//                           onKeyDown={handleKeyDown}
//                           autoComplete="off"
//                           autoCorrect="off"
//                           style={{
//                             width: "100%",
//                             padding: isMobile ? "14px 16px" : "8px 12px",
//                             border: `1px solid ${ACCENT}`,
//                             color: BROWN_DARK,
//                             borderRadius: "8px",
//                             fontSize: isMobile ? "16px" : "13px",
//                             outline: "none",
//                             boxSizing: "border-box",
//                             WebkitAppearance: "none",
//                             backgroundColor: "#fff",
//                             WebkitTapHighlightColor: "transparent",
//                           }}
//                           onFocus={(e) => {
//                             e.target.style.borderColor = BROWN;
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = ACCENT;
//                           }}
//                         />
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           performSearch();
//                         }}
//                         style={{
//                           background: BROWN,
//                           border: "none",
//                           borderRadius: "8px",
//                           padding: isMobile ? "14px 16px" : "8px 12px",
//                           cursor: "pointer",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                           WebkitTapHighlightColor: "transparent",
//                         }}
//                         type="button"
//                       >
//                         <SearchIcon style={{ fontSize: isMobile ? "22px" : "18px", color: "#fff" }} />
//                       </button>
//                     </div>
                    
//                     {/* Scrollable content */}
//                     <div style={{ 
//                       flex: 1, 
//                       overflowY: "auto",
//                       WebkitOverflowScrolling: "touch",
//                     }}>
//                       {loadingCustomers ? (
//                         <div style={{ padding: "80px", textAlign: "center", color: "#999" }}>
//                           <CircularProgress size={30} style={{ color: BROWN }} />
//                           <div style={{ marginTop: "16px", fontSize: "14px" }}>Loading customers...</div>
//                         </div>
//                       ) : filteredCustomers.length === 0 ? (
//                         <div style={{ padding: "80px", textAlign: "center", color: "#999", fontSize: "14px" }}>
//                           {hasSearched ? "No matching customers found" : "No customers/outlets found"}
//                         </div>
//                       ) : (
//                         <>
//                           {hasSearched && (
//                             <div style={{ 
//                               padding: "10px 16px", 
//                               fontSize: "12px", 
//                               color: "#999", 
//                               borderBottom: "1px solid #f0f0f0",
//                               background: "#fafafa"
//                             }}>
//                               Search results: {filteredCustomers.length} found
//                             </div>
//                           )}
                          
//                           {filteredCustomers.map((customer) => (
//                             <div
//                               key={customer.id}
//                               onClick={() => handleCustomerSelect(customer)}
//                               style={customerItemStyle(customer)}
//                             >
//                               <div style={{ 
//                                 fontWeight: selectedCustomer?.id === customer.id ? "600" : "500", 
//                                 color: BROWN, 
//                                 fontSize: isMobile ? "16px" : "13px", 
//                                 marginBottom: "4px" 
//                               }}>
//                                 {selectedCustomer?.id === customer.id && "✓ "}
//                                 {customer.name}
//                               </div>
//                               {customer.mobile && (
//                                 <div style={{ fontSize: isMobile ? "13px" : "11px", color: "#666" }}>
//                                   📱 {customer.mobile}
//                                 </div>
//                               )}
//                               {customer.city && (
//                                 <div style={{ fontSize: isMobile ? "11px" : "10px", color: "#999" }}>
//                                   📍 {customer.city}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Right Section */}
//           <div style={rightSectionStyle}>
//             {/* User Name Badge */}
//             {isLoggedIn && userName && !showCustomerSelector && (
//               <span style={userNameBadgeStyle}>
//                 {userName}
//               </span>
//             )}

//             {/* Cart Button */}
//             {showCart && (
//               <div style={{ position: 'relative' }}>
//                 <button
//                   onClick={handleCartClick || onCartClick}
//                   style={iconButtonStyle}
//                   type="button"
//                   aria-label="Shopping cart"
//                 >
//                   <ShoppingCartIcon style={{ fontSize: isMobile ? '22px' : '24px' }} />
//                 </button>

//                 {(cartItemCount > 0 || selectedCount > 0) && (
//                   <span style={cartBadgeStyle}>
//                     {selectedCount || cartItemCount}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Custom Actions */}
//             {customActions}
//           </div>
//         </div>
//       </header>
//     </>
//   );
// }, (prevProps, nextProps) => {
//   // Custom comparison function for memo
//   // Return true if props ARE EQUAL (skip re-render)
//   // Return false if props ARE DIFFERENT (allow re-render)
  
//   // CRITICAL: Always re-render if these customer-related props change
//   if (prevProps.selectedCustomer?.id !== nextProps.selectedCustomer?.id) {
//     return false; // Props changed, re-render
//   }
  
//   if (prevProps.selectedCustomer?.name !== nextProps.selectedCustomer?.name) {
//     return false; // Props changed, re-render
//   }
  
//   if (prevProps.customers !== nextProps.customers) {
//     return false; // Props changed, re-render
//   }
  
//   if (prevProps.loadingCustomers !== nextProps.loadingCustomers) {
//     return false; // Props changed, re-render
//   }
  
//   if (prevProps.showCustomerSelector !== nextProps.showCustomerSelector) {
//     return false; // Props changed, re-render
//   }
  
//   // For all other props, check if they're equal
//   return (
//     prevProps.isMobile === nextProps.isMobile &&
//     prevProps.isLoggedIn === nextProps.isLoggedIn &&
//     prevProps.selectedCount === nextProps.selectedCount &&
//     prevProps.cartItemCount === nextProps.cartItemCount &&
//     prevProps.showBackButton === nextProps.showBackButton &&
//     prevProps.userName === nextProps.userName &&
//     prevProps.customers?.length === nextProps.customers?.length &&
//     prevProps.title === nextProps.title &&
//     prevProps.showTitle === nextProps.showTitle
//   );
// });

// CommonHeader.displayName = "CommonHeader";

// export default CommonHeader;




// // import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// // import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// // import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// // import SearchIcon from '@mui/icons-material/Search';
// // import CircularProgress from '@mui/material/CircularProgress';

// // const BROWN_DARK = "#3a1f0e";
// // const BROWN = "#4a2c1a";
// // const BROWN_LIGHT = "#6b3f23";
// // const ACCENT = "#c8a96e";

// // const CommonHeader = memo(({ 
// //   title, 
// //   logo, 
// //   showSearch = true, 
// //   showCart = true, 
// //   showBackButton = false,
// //   showTitle = true,
// //   cartItemCount = 0,
// //   onSearchClick,
// //   onCartClick,
// //   onBackClick,
// //   customActions,
// //   isMobile = false,
// //   backgroundColor = BROWN_DARK,
// //   showLogout = false,
// //   onLogout,
// //   userName = "",
// //   isLoggedIn = false,
// //   selectedCount = 0,
// //   handleCartClick,
// //   // Customer selector props
// //   showCustomerSelector = false,
// //   customers = [],
// //   selectedCustomer = null,
// //   onCustomerSelect = null,
// //   loadingCustomers = false,
// //   userType = ""
// // }) => {
// //   const navigate = useNavigate();
// //   const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
// //   const [customerSearch, setCustomerSearch] = useState("");
// //   const [filteredCustomers, setFilteredCustomers] = useState([]);
// //   const [hasSearched, setHasSearched] = useState(false);
// //   const customerDropdownRef = useRef(null);
// //   const searchInputRef = useRef(null);
// //   const isSelectingRef = useRef(false);

// //   const removeSplChar = (text = '') => {
// //     if (!text) return '';
// //     return text
// //       .toString()
// //       .toLowerCase()
// //       .replace(/[^a-z0-9]/g, '');
// //   };

// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (isSelectingRef.current) return;
// //       if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
// //         setCustomerDropdownOpen(false);
// //         setCustomerSearch("");
// //         setFilteredCustomers([]);
// //         setHasSearched(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     document.addEventListener("touchstart", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //       document.removeEventListener("touchstart", handleClickOutside);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (customerDropdownOpen && searchInputRef.current && isMobile) {
// //       setTimeout(() => {
// //         if (searchInputRef.current) {
// //           searchInputRef.current.focus();
// //         }
// //       }, 500);
// //     }
// //   }, [customerDropdownOpen, isMobile]);

// //   useEffect(() => {
// //     if (customerDropdownOpen && !hasSearched) {
// //       setFilteredCustomers(customers);
// //     }
// //   }, [customerDropdownOpen, customers, hasSearched]);

// //   useEffect(() => {
// //     if (customerDropdownOpen) {
// //       setFilteredCustomers(customers);
// //       setHasSearched(false);
// //       setCustomerSearch("");
// //     }
// //   }, [customers]);

// //   const handleLogout = () => {
// //     localStorage.removeItem('user');
// //     localStorage.removeItem('session');
// //     localStorage.removeItem('loginAt');
// //     toast.success('Logged out successfully');
// //     navigate('/', { replace: true });
// //     if (onLogout) onLogout();
// //   };

// //   const handleBackClick = () => {
// //     if (onBackClick) onBackClick();
// //     else navigate(-1);
// //   };

// //   const handleCustomerSelect = (customer) => {
// //     isSelectingRef.current = true;
    
// //     if (onCustomerSelect) {
// //       onCustomerSelect(customer);
// //     }
    
// //     setCustomerDropdownOpen(false);
// //     setCustomerSearch("");
// //     setFilteredCustomers([]);
// //     setHasSearched(false);
    
// //     setTimeout(() => {
// //       isSelectingRef.current = false;
// //     }, 100);
// //   };

// //   const handleSearchChange = (e) => {
// //     setCustomerSearch(e.target.value);
// //   };

// //   const performSearch = () => {
// //     if (!customerSearch.trim()) {
// //       setFilteredCustomers(customers);
// //       setHasSearched(false);
// //       return;
// //     }
    
// //     const normalizedSearch = removeSplChar(customerSearch);
    
// //     if (!normalizedSearch) {
// //       setFilteredCustomers(customers);
// //       setHasSearched(false);
// //       return;
// //     }
    
// //     const results = customers.filter((c) => {
// //       const allFields = [];
      
// //       if (c.name) allFields.push(String(c.name));
// //       if (c.billName) allFields.push(String(c.billName));
// //       if (c.mobile) allFields.push(String(c.mobile));
// //       if (c.city) allFields.push(String(c.city));
// //       if (c.id) allFields.push(String(c.id));
// //       if (c.address) allFields.push(String(c.address));
// //       if (c.ledgerName) allFields.push(String(c.ledgerName));
// //       if (c.partyMailingName) allFields.push(String(c.partyMailingName));
// //       if (c.ledgerTallyId) allFields.push(String(c.ledgerTallyId));
// //       if (c.brokerName) allFields.push(String(c.brokerName));
// //       if (c.brokerId) allFields.push(String(c.brokerId));
// //       if (c.transporterName) allFields.push(String(c.transporterName));
// //       if (c.transporterId) allFields.push(String(c.transporterId));
      
// //       Object.keys(c).forEach(key => {
// //         const value = c[key];
// //         if (value !== null && value !== undefined && value !== '' && 
// //             typeof value !== 'object' && !allFields.includes(String(value))) {
// //           allFields.push(String(value));
// //         }
// //       });
      
// //       return allFields.some(field => {
// //         const normalizedField = removeSplChar(field);
// //         return normalizedField.includes(normalizedSearch);
// //       });
// //     });
    
// //     setFilteredCustomers(results);
// //     setHasSearched(true);
// //   };

// //   const handleSearchClick = (e) => {
// //     e.stopPropagation();
// //     performSearch();
// //   };

// //   const handleKeyDown = (e) => {
// //     if (e.key === 'Enter') {
// //       e.preventDefault();
// //       performSearch();
// //     }
// //   };

// //   const handleDropdownToggle = () => {
// //     if (!customerDropdownOpen) {
// //       setCustomerSearch("");
// //       setFilteredCustomers(customers);
// //       setHasSearched(false);
// //     }
// //     setCustomerDropdownOpen(!customerDropdownOpen);
// //   };

// //   const handleCloseDropdown = () => {
// //     setCustomerDropdownOpen(false);
// //     setCustomerSearch("");
// //     setFilteredCustomers([]);
// //     setHasSearched(false);
// //   };

// //   const memoizedHeaderStyle = useMemo(() => ({
// //     backgroundColor: BROWN_DARK,
// //     color: "#fff",
// //     padding: isMobile ? "8px 12px" : "12px 24px", // Reduced padding on mobile
// //     position: "sticky",
// //     top: 0,
// //     zIndex: 100,
// //     boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
// //     minHeight: isMobile ? '48px' : '68px',
// //     transition: 'none',
// //     width: '100%',
// //     overflowX: 'hidden', // Prevent horizontal scroll
// //   }), [isMobile]);

// //   const memoizedContainerStyle = useMemo(() => ({
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     maxWidth: 1400,
// //     margin: "0 auto",
// //     gap: isMobile ? 6 : 16, // Reduced gap on mobile
// //     minHeight: isMobile ? '40px' : '48px',
// //     width: '100%',
// //     overflow: 'hidden', // Prevent overflow
// //   }), [isMobile]);

// //   const leftSectionStyle = useMemo(() => ({
// //     display: "flex",
// //     alignItems: "center",
// //     gap: isMobile ? 6 : 16,
// //     flex: showCustomerSelector ? 1 : "0 0 auto", // Changed: allow left section to take space when customer selector is shown
// //     minWidth: 0, // Allow flex child to shrink below content size
// //     overflow: 'hidden',
// //   }), [isMobile, showCustomerSelector]);

// //   const logoStyle = useMemo(() => ({
// //     width: isMobile ? 32 : 44, // Reduced logo size
// //     height: isMobile ? 32 : 44,
// //     borderRadius: "50%",
// //     backgroundColor: ACCENT,
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     fontWeight: "bold",
// //     fontSize: isMobile ? 12 : 18,
// //     color: BROWN_DARK,
// //     flexShrink: 0,
// //   }), [isMobile]);

// //   const titleStyle = useMemo(() => ({
// //     margin: 0,
// //     fontSize: isMobile ? 14 : 20,
// //     fontWeight: "bold",
// //     color: "#fff",
// //     minWidth: isMobile ? '80px' : '180px',
// //     whiteSpace: 'nowrap',
// //     overflow: 'hidden',
// //     textOverflow: 'ellipsis',
// //     flexShrink: 0,
// //   }), [isMobile]);

// //   const customerSelectorStyle = useMemo(() => ({
// //     position: "relative",
// //     flex: 1,
// //     minWidth: 0, // Allow shrinking
// //     maxWidth: isMobile ? "160px" : "500px", // Reduced max width on mobile
// //   }), [isMobile]);

// //   const customerSelectorButtonStyle = useMemo(() => ({
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     padding: isMobile ? "6px 10px" : "8px 14px", // Reduced padding on mobile
// //     border: `1.5px solid ${ACCENT}`,
// //     borderRadius: "25px",
// //     background: selectedCustomer ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
// //     cursor: "pointer",
// //     width: "100%",
// //     transition: "all 0.2s",
// //     WebkitTapHighlightColor: "transparent",
// //     touchAction: "manipulation",
// //     userSelect: "none",
// //     gap: "4px",
// //   }), [isMobile, selectedCustomer]);

// //   const rightSectionStyle = useMemo(() => ({
// //     display: "flex",
// //     alignItems: "center",
// //     gap: isMobile ? 4 : 16, // Reduced gap on mobile
// //     flexShrink: 0, // Prevent right section from shrinking
// //   }), [isMobile]);

// //   const iconButtonStyle = useMemo(() => ({
// //     background: 'transparent',
// //     border: 'none',
// //     cursor: 'pointer',
// //     padding: isMobile ? '6px' : '8px', // Reduced padding on mobile
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     color: '#fff',
// //     borderRadius: '50%',
// //     transition: 'background 0.2s',
// //     minWidth: isMobile ? '36px' : '44px', // Ensure minimum touch target
// //     minHeight: isMobile ? '36px' : '44px',
// //     flexShrink: 0,
// //   }), [isMobile]);

// //   const userNameBadgeStyle = useMemo(() => ({
// //     fontSize: isMobile ? 11 : 14,
// //     color: "#fff",
// //     opacity: 0.9,
// //     background: "rgba(255,255,255,0.15)",
// //     padding: isMobile ? "4px 8px" : "4px 12px",
// //     borderRadius: "20px",
// //     maxWidth: isMobile ? "80px" : "200px",
// //     overflow: "hidden",
// //     textOverflow: "ellipsis",
// //     whiteSpace: "nowrap",
// //     flexShrink: 0,
// //   }), [isMobile]);

// //   const cartBadgeStyle = useMemo(() => ({
// //     position: 'absolute',
// //     top: '0px',
// //     right: '0px',
// //     backgroundColor: '#e74c3c',
// //     color: '#fff',
// //     borderRadius: '50%',
// //     width: '18px',
// //     height: '18px',
// //     fontSize: '10px',
// //     fontWeight: 'bold',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     pointerEvents: 'none',
// //   }), []);

// //   const mobileDropdownStyle = useMemo(() => ({
// //     position: 'fixed',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     width: '100%',
// //     height: '100%',
// //     backgroundColor: '#fff',
// //     zIndex: 9999,
// //     display: 'flex',
// //     flexDirection: 'column',
// //     overflow: 'hidden',
// //   }), []);

// //   const desktopDropdownStyle = useMemo(() => ({
// //     position: 'absolute',
// //     top: 'calc(100% + 8px)',
// //     left: 0,
// //     right: 0,
// //     maxHeight: '400px',
// //     overflowY: 'auto',
// //     background: '#fff',
// //     border: '1px solid #ddd',
// //     borderRadius: '12px',
// //     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
// //     zIndex: 9999,
// //   }), []);

// //   const dropdownStyle = isMobile ? mobileDropdownStyle : desktopDropdownStyle;

// //   const customerItemStyle = (customer) => ({
// //     padding: isMobile ? "16px" : "12px 14px",
// //     borderBottom: "1px solid #f0f0f0",
// //     cursor: "pointer",
// //     background: selectedCustomer?.id === customer.id ? "#f0e9e2" : "transparent",
// //     WebkitTapHighlightColor: "transparent",
// //     touchAction: "manipulation",
// //     userSelect: "none",
// //   });

// //   const backButtonContainerStyle = useMemo(() => ({
// //     width: isMobile ? '32px' : '44px',
// //     height: isMobile ? '32px' : '44px',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     visibility: showBackButton ? 'visible' : 'hidden',
// //     flexShrink: 0,
// //   }), [isMobile, showBackButton]);

// //   return (
// //     <>
// //       <header style={memoizedHeaderStyle}>
// //         <div style={memoizedContainerStyle}>
// //           {/* Left Section - Now takes available space when customer selector is shown */}
// //           <div style={leftSectionStyle}>
// //             {/* Back Button with consistent space */}
// //             <div style={backButtonContainerStyle}>
// //               {showBackButton && (
// //                 <button
// //                   onClick={handleBackClick}
// //                   style={iconButtonStyle}
// //                   onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
// //                   onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
// //                   aria-label="Go back"
// //                 >
// //                   <ArrowBackIcon style={{ fontSize: isMobile ? '20px' : '24px' }} />
// //                 </button>
// //               )}
// //             </div>
            
// //             {/* Logo */}
// //             <div style={logoStyle}>
// //               {logo || "SMT"}
// //             </div>
            
// //             {/* Title - Hide title on mobile when customer selector is shown to save space */}
// //             {showTitle && (!isMobile || !showCustomerSelector) && (
// //               <h2 style={titleStyle}>{title || "SM Traders"}</h2>
// //             )}
        
// //             {/* Customer Selector */}
// //             {showCustomerSelector && isLoggedIn && customers.length > 0 && (
// //               <div 
// //                 style={customerSelectorStyle} 
// //                 ref={customerDropdownRef}
// //                 key={`customer-selector-${selectedCustomer?.id || 'none'}`}
// //               >
// //                 <button
// //                   onClick={(e) => {
// //                     e.preventDefault();
// //                     e.stopPropagation();
// //                     handleDropdownToggle();
// //                   }}
// //                   style={customerSelectorButtonStyle}
// //                   type="button"
// //                 >
// //                   <div style={{ display: "flex", alignItems: "center", gap: "4px", overflow: "hidden", flex: 1 }}>
// //                     <span style={{ fontSize: isMobile ? "12px" : "14px", flexShrink: 0 }}>🏪</span>
// //                     <span style={{
// //                       fontSize: isMobile ? "11px" : "18px",
// //                       overflow: "hidden",
// //                       textOverflow: "ellipsis",
// //                       whiteSpace: "nowrap",
// //                       color: "#fff",
// //                       flex: 1,
// //                     }}>
// //                       {selectedCustomer ? selectedCustomer.name : (userType === "customer" ? "Select Retailer" : "Select Customer")}
// //                     </span>
// //                   </div>
// //                   <span style={{
// //                     fontSize: "10px",
// //                     transform: customerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
// //                     transition: "transform 0.2s",
// //                     flexShrink: 0,
// //                   }}>▼</span>
// //                 </button>

// //                 {customerDropdownOpen && (
// //                   <div style={dropdownStyle}>
// //                     {/* Mobile close button */}
// //                     {isMobile && (
// //                       <div style={{
// //                         padding: "16px",
// //                         background: BROWN_DARK,
// //                         color: "#fff",
// //                         display: "flex",
// //                         justifyContent: "space-between",
// //                         alignItems: "center",
// //                         flexShrink: 0,
// //                       }}>
// //                         <span style={{ fontSize: "18px", fontWeight: "bold" }}>
// //                           {userType === "customer" ? "Select Retailer" : "Select Customer"}
// //                         </span>
// //                         <button
// //                           onClick={(e) => {
// //                             e.preventDefault();
// //                             e.stopPropagation();
// //                             handleCloseDropdown();
// //                           }}
// //                           style={{
// //                             background: "transparent",
// //                             border: "none",
// //                             color: "#fff",
// //                             fontSize: "24px",
// //                             cursor: "pointer",
// //                             padding: "8px 12px",
// //                             display: "flex",
// //                             alignItems: "center",
// //                             justifyContent: "center",
// //                             WebkitTapHighlightColor: "transparent",
// //                           }}
// //                           type="button"
// //                         >
// //                           ✕
// //                         </button>
// //                       </div>
// //                     )}
                    
// //                     {/* Search bar */}
// //                     <div style={{ 
// //                       padding: isMobile ? "12px 16px" : "15px 12px", 
// //                       borderBottom: "1px solid #f0f0f0", 
// //                       background: "#f9f9f9",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "8px",
// //                       flexShrink: 0,
// //                     }}>
// //                       <div style={{ flex: 1 }}>
// //                         <input
// //                           ref={searchInputRef}
// //                           type="text"
// //                           placeholder="Search by name, mobile, city..."
// //                           value={customerSearch}
// //                           onChange={handleSearchChange}
// //                           onKeyDown={handleKeyDown}
// //                           autoComplete="off"
// //                           autoCorrect="off"
// //                           style={{
// //                             width: "100%",
// //                             padding: isMobile ? "14px 16px" : "8px 12px",
// //                             border: `1px solid ${ACCENT}`,
// //                             color: BROWN_DARK,
// //                             borderRadius: "8px",
// //                             fontSize: isMobile ? "16px" : "13px",
// //                             outline: "none",
// //                             boxSizing: "border-box",
// //                             WebkitAppearance: "none",
// //                             backgroundColor: "#fff",
// //                             WebkitTapHighlightColor: "transparent",
// //                           }}
// //                           onFocus={(e) => {
// //                             e.target.style.borderColor = BROWN;
// //                           }}
// //                           onBlur={(e) => {
// //                             e.target.style.borderColor = ACCENT;
// //                           }}
// //                         />
// //                       </div>
// //                       <button
// //                         onClick={(e) => {
// //                           e.preventDefault();
// //                           performSearch();
// //                         }}
// //                         style={{
// //                           background: BROWN,
// //                           border: "none",
// //                           borderRadius: "8px",
// //                           padding: isMobile ? "14px 16px" : "8px 12px",
// //                           cursor: "pointer",
// //                           display: "flex",
// //                           alignItems: "center",
// //                           justifyContent: "center",
// //                           flexShrink: 0,
// //                           WebkitTapHighlightColor: "transparent",
// //                         }}
// //                         type="button"
// //                       >
// //                         <SearchIcon style={{ fontSize: isMobile ? "22px" : "18px", color: "#fff" }} />
// //                       </button>
// //                     </div>
                    
// //                     {/* Scrollable content */}
// //                     <div style={{ 
// //                       flex: 1, 
// //                       overflowY: "auto",
// //                       WebkitOverflowScrolling: "touch",
// //                     }}>
// //                       {loadingCustomers ? (
// //                         <div style={{ padding: "80px", textAlign: "center", color: "#999" }}>
// //                           <CircularProgress size={30} style={{ color: BROWN }} />
// //                           <div style={{ marginTop: "16px", fontSize: "14px" }}>Loading customers...</div>
// //                         </div>
// //                       ) : filteredCustomers.length === 0 ? (
// //                         <div style={{ padding: "80px", textAlign: "center", color: "#999", fontSize: "14px" }}>
// //                           {hasSearched ? "No matching customers found" : "No customers/outlets found"}
// //                         </div>
// //                       ) : (
// //                         <>
// //                           {hasSearched && (
// //                             <div style={{ 
// //                               padding: "10px 16px", 
// //                               fontSize: "12px", 
// //                               color: "#999", 
// //                               borderBottom: "1px solid #f0f0f0",
// //                               background: "#fafafa"
// //                             }}>
// //                               Search results: {filteredCustomers.length} found
// //                             </div>
// //                           )}
                          
// //                           {filteredCustomers.map((customer) => (
// //                             <div
// //                               key={customer.id}
// //                               onClick={() => handleCustomerSelect(customer)}
// //                               style={customerItemStyle(customer)}
// //                             >
// //                               <div style={{ 
// //                                 fontWeight: selectedCustomer?.id === customer.id ? "600" : "500", 
// //                                 color: BROWN, 
// //                                 fontSize: isMobile ? "16px" : "13px", 
// //                                 marginBottom: "4px" 
// //                               }}>
// //                                 {selectedCustomer?.id === customer.id && "✓ "}
// //                                 {customer.name}
// //                               </div>
// //                               {customer.mobile && (
// //                                 <div style={{ fontSize: isMobile ? "13px" : "11px", color: "#666" }}>
// //                                   📱 {customer.mobile}
// //                                 </div>
// //                               )}
// //                               {customer.city && (
// //                                 <div style={{ fontSize: isMobile ? "11px" : "10px", color: "#999" }}>
// //                                   📍 {customer.city}
// //                                 </div>
// //                               )}
// //                             </div>
// //                           ))}
// //                         </>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {/* Right Section - Fixed width, stays at the end */}
// //           <div style={rightSectionStyle}>
// //             {/* User Name Badge - Hide on mobile when space is tight */}
// //             {isLoggedIn && userName && !showCustomerSelector && (!isMobile || !showCustomerSelector) && (
// //               <span style={userNameBadgeStyle}>
// //                 {userName}
// //               </span>
// //             )}

// //             {/* Cart Button */}
// //             {showCart && (
// //               <div style={{ position: 'relative' }}>
// //                 <button
// //                   onClick={handleCartClick || onCartClick}
// //                   style={iconButtonStyle}
// //                   type="button"
// //                   aria-label="Shopping cart"
// //                 >
// //                   <ShoppingCartIcon style={{ fontSize: isMobile ? '20px' : '24px' }} />
// //                 </button>

// //                 {(cartItemCount > 0 || selectedCount > 0) && (
// //                   <span style={cartBadgeStyle}>
// //                     {selectedCount || cartItemCount}
// //                   </span>
// //                 )}
// //               </div>
// //             )}

// //             {/* Custom Actions - This is your three-dot menu */}
// //             <div style={{ flexShrink: 0 }}>
// //               {customActions}
// //             </div>
// //           </div>
// //         </div>
// //       </header>
// //     </>
// //   );
// // }, (prevProps, nextProps) => {
// //   // Custom comparison function for memo
// //   return (
// //     prevProps.isMobile === nextProps.isMobile &&
// //     prevProps.isLoggedIn === nextProps.isLoggedIn &&
// //     prevProps.selectedCount === nextProps.selectedCount &&
// //     prevProps.cartItemCount === nextProps.cartItemCount &&
// //     prevProps.showBackButton === nextProps.showBackButton &&
// //     prevProps.userName === nextProps.userName &&
// //     prevProps.selectedCustomer?.id === nextProps.selectedCustomer?.id &&
// //     prevProps.customers?.length === nextProps.customers?.length &&
// //     prevProps.title === nextProps.title &&
// //     prevProps.showTitle === nextProps.showTitle &&
// //     prevProps.loadingCustomers === nextProps.loadingCustomers &&
// //     prevProps.showCustomerSelector === nextProps.showCustomerSelector
// //   );
// // });

// // CommonHeader.displayName = "CommonHeader";

// // export default CommonHeader;







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
  const [displayCount, setDisplayCount] = useState(15);
  const customerDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const isSelectingRef = useRef(false);
  const listContainerRef = useRef(null);

  const INITIAL_LOAD = 15;
  const LOAD_MORE_COUNT = 20;

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
        setDisplayCount(INITIAL_LOAD);
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
      }, 300);
    }
  }, [customerDropdownOpen, isMobile]);

  useEffect(() => {
    if (customerDropdownOpen && !hasSearched) {
      setFilteredCustomers(customers.slice(0, INITIAL_LOAD));
      setDisplayCount(INITIAL_LOAD);
    }
  }, [customerDropdownOpen, customers, hasSearched, INITIAL_LOAD]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('username');
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
    setDisplayCount(INITIAL_LOAD);
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  };

  const startsWithSearch = (c, search) => {
    if (!search) return false;
    const s = search.toLowerCase().trim();
    const normS = removeSplChar(search);
    const name = (c.name || '').toLowerCase().trim();
    const normName = removeSplChar(c.name || '');
    const billName = (c.billName || '').toLowerCase().trim();
    const normBill = removeSplChar(c.billName || '');
    const partyName = (c.partyMailingName || '').toLowerCase().trim();
    const normParty = removeSplChar(c.partyMailingName || '');
    
    return name.startsWith(s) || normName.startsWith(normS) ||
           billName.startsWith(s) || normBill.startsWith(normS) ||
           partyName.startsWith(s) || normParty.startsWith(normS);
  };

  const filterAndSortCustomers = (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      return customers;
    }
    const normalizedSearch = removeSplChar(searchQuery);
    if (!normalizedSearch) {
      return customers;
    }

    const matched = customers.filter((c) => {
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

    const prefixMatches = [];
    const otherMatches = [];
    matched.forEach(c => {
      if (startsWithSearch(c, searchQuery)) {
        prefixMatches.push(c);
      } else {
        otherMatches.push(c);
      }
    });

    return [...prefixMatches, ...otherMatches];
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setCustomerSearch(val);
    if (!customerDropdownOpen) {
      setCustomerDropdownOpen(true);
    }
    performSearch(val);
  };

  const performSearch = (searchTerm = customerSearch) => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers.slice(0, INITIAL_LOAD));
      setHasSearched(false);
      setDisplayCount(INITIAL_LOAD);
      return;
    }
    
    const results = filterAndSortCustomers(searchTerm);
    setFilteredCustomers(results.slice(0, INITIAL_LOAD));
    setHasSearched(true);
    setDisplayCount(INITIAL_LOAD);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(customerSearch);
    }
  };

  const handleDropdownToggle = () => {
    if (!customerDropdownOpen) {
      setCustomerSearch("");
      setFilteredCustomers(customers.slice(0, INITIAL_LOAD));
      setHasSearched(false);
      setDisplayCount(INITIAL_LOAD);
    }
    setCustomerDropdownOpen(!customerDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setCustomerDropdownOpen(false);
    setCustomerSearch("");
    setFilteredCustomers([]);
    setHasSearched(false);
    setDisplayCount(INITIAL_LOAD);
  };

  const handleLoadMore = () => {
    const totalResults = hasSearched ? filterAndSortCustomers(customerSearch) : customers;
    const nextCount = Math.min(displayCount + LOAD_MORE_COUNT, totalResults.length);
    setDisplayCount(nextCount);
    setFilteredCustomers(totalResults.slice(0, nextCount));
  };

  const headerStyle = {
    backgroundColor: BROWN_DARK,
    color: "#fff",
    padding: isMobile ? "10px 12px" : "12px 24px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1400,
    margin: "0 auto",
    gap: isMobile ? 6 : 16,
  };

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 6 : 16,
    flex: showCustomerSelector ? "1" : "0 0 auto",
    minWidth: 0,
    width: showCustomerSelector ? "100%" : "auto",
  };

  const logoStyle = {
    width: isMobile ? 32 : 44,
    height: isMobile ? 32 : 44,
    borderRadius: "50%",
    backgroundColor: ACCENT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: isMobile ? 12 : 18,
    color: BROWN_DARK,
    flexShrink: 0,
  };

  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? 14 : 20,
    fontWeight: "bold",
    color: "#fff",
  };

  // FIXED: Customer selector - full width on mobile
  const customerSelectorStyle = {
    position: "relative",
    flex: 1,
    minWidth: 0,
    width: "100%",
    maxWidth: isMobile ? "100%" : "400px",
  };

  const customerSelectorButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "6px 10px" : "8px 14px",
    border: `1.5px solid ${ACCENT}`,
    borderRadius: "25px",
    background: selectedCustomer ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
    cursor: "pointer",
    width: "100%",
    minHeight: isMobile ? "32px" : "40px",
    transition: "all 0.2s",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    userSelect: "none",
    boxSizing: "border-box",
  };

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 6 : 16,
    flexShrink: 0,
  };

  const iconButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: isMobile ? '4px' : '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    borderRadius: '50%',
    transition: 'background 0.2s',
    WebkitTapHighlightColor: 'transparent',
  };

  const userNameBadgeStyle = {
    fontSize: isMobile ? 11 : 14,
    color: "#fff",
    opacity: 0.9,
    background: "rgba(255,255,255,0.15)",
    padding: isMobile ? "2px 8px" : "4px 12px",
    borderRadius: "20px",
    maxWidth: isMobile ? "80px" : "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  };

  // Mobile dropdown - positioned below the header search box
  const mobileDropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    width: '100%',
    maxHeight: 'calc(100vh - 120px)',
    backgroundColor: '#fff',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    margin: 0,
    padding: 0,
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
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
    padding: isMobile ? "14px 16px" : "12px 14px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    background: selectedCustomer?.id === customer.id ? "#f0e9e2" : "transparent",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    userSelect: "none",
    width: "100%",
    boxSizing: "border-box",
  });

  const handleListScroll = (e) => {
    const container = e.currentTarget;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    if (isNearBottom) {
      const totalResults = hasSearched ? 
        customers.filter(c => {
          const normalizedSearch = removeSplChar(customerSearch);
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
        }) : customers;
      
      if (displayCount < totalResults.length) {
        handleLoadMore();
      }
    }
  };

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
            
            {showTitle && !showCustomerSelector && (
              <h2 style={titleStyle}>{title || "SM Traders"}</h2>
            )}
        
            {showCustomerSelector && isLoggedIn && customers.length > 0 && (
              <div style={customerSelectorStyle} ref={customerDropdownRef}>
                <div
                  style={customerSelectorButtonStyle}
                  onClick={() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    overflow: "hidden",
                    minWidth: 0,
                    flex: 1,
                  }}>
                    <span style={{ fontSize: isMobile ? "12px" : "14px", flexShrink: 0 }}>🏪</span>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={selectedCustomer ? selectedCustomer.name : (userType === "customer" ? "Select Retailer..." : "Select Customer...")}
                      value={customerDropdownOpen ? customerSearch : (selectedCustomer ? selectedCustomer.name : "")}
                      onFocus={() => {
                        if (!customerDropdownOpen) {
                          setCustomerDropdownOpen(true);
                          if (!customerSearch) {
                            setFilteredCustomers(customers.slice(0, INITIAL_LOAD));
                          }
                        }
                      }}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      autoComplete="off"
                      autoCorrect="off"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "#fff",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "500",
                        width: "100%",
                        padding: "2px 0",
                        boxSizing: "border-box",
                        textOverflow: "ellipsis",
                      }}
                    />
                  </div>
                  {customerSearch ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomerSearch("");
                        performSearch("");
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        padding: "0 4px",
                        fontSize: "14px",
                        lineHeight: 1,
                      }}
                      type="button"
                    >
                      ✕
                    </button>
                  ) : (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownToggle();
                      }}
                      style={{
                        fontSize: "10px",
                        flexShrink: 0,
                        marginLeft: "4px",
                        color: "#fff",
                        cursor: "pointer",
                        transform: customerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      ▼
                    </span>
                  )}
                </div>

                {customerDropdownOpen && (
                  <div style={dropdownStyle}>
                    {/* Scrollable content - FIXED: full width */}
                    <div 
                      ref={listContainerRef}
                      onScroll={handleListScroll}
                      style={{ 
                        flex: 1, 
                        overflowY: "auto",
                        WebkitOverflowScrolling: "touch",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {loadingCustomers ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                          <CircularProgress size={24} style={{ color: BROWN }} />
                          <div style={{ marginTop: "12px", fontSize: "13px" }}>Loading customers...</div>
                        </div>
                      ) : filteredCustomers.length === 0 ? (
                        <div style={{ padding: "60px 20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
                          {hasSearched && customerSearch.trim() ? "No matching customers found" : "No customers/outlets found"}
                        </div>
                      ) : (
                        <>
                          {hasSearched && customerSearch.trim() && (
                            <div style={{ 
                              padding: "8px 16px", 
                              fontSize: "11px", 
                              color: filteredCustomers.length > 0 ? "#4caf50" : "#e74c3c",
                              borderBottom: "1px solid #f0f0f0",
                              background: "#fafafa",
                              width: "100%",
                              boxSizing: "border-box",
                            }}>
                              {filteredCustomers.length} result{filteredCustomers.length !== 1 ? "s" : ""} found
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
                                fontSize: isMobile ? "15px" : "13px", 
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}>
                                {selectedCustomer?.id === customer.id && (
                                  <span style={{ color: "#4caf50", fontSize: "14px" }}>✓</span>
                                )}
                                <span style={{ wordBreak: "break-word" }}>{customer.name}</span>
                              </div>
                              {customer.mobile && (
                                <div style={{ 
                                  fontSize: isMobile ? "13px" : "11px", 
                                  color: "#666",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}>
                                  <span>📱</span> {customer.mobile}
                                </div>
                              )}
                              {customer.city && (
                                <div style={{ 
                                  fontSize: isMobile ? "12px" : "10px", 
                                  color: "#888",
                                  marginTop: "2px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}>
                                  <span>📍</span> {customer.city}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Load More */}
                          {filteredCustomers.length > 0 && (
                            <div style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              borderTop: "1px solid #f0f0f0",
                              background: "#f9f9f9",
                              width: "100%",
                              boxSizing: "border-box",
                            }}>
                              <button
                                onClick={handleLoadMore}
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
                                Load More
                              </button>
                            </div>
                          )}
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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={handleCartClick || onCartClick}
                  style={iconButtonStyle}
                  type="button"
                >
                  <ShoppingCartIcon style={{ fontSize: isMobile ? '20px' : '24px' }} />
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