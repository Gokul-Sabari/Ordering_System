// // components/CommonHeader.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import MenuIcon from '@mui/icons-material/Menu';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import FilterListIcon from '@mui/icons-material/FilterList';

// const BROWN = "#4a2c1a";
// const BROWN_DARK = "#3a1f0e";
// const BROWN_LIGHT = "#6b3f23";
// const ACCENT = "#c8a96e";

// const CommonHeader = ({

//   title = "SM Traders",
//   logo = "SMT",
//   showLogo = true,
//   showTitle = true,
//   showSearch = true,
//   showCart = true,
//   showBackButton = false,
//   showMenuButton = false,
//   showFilterButton = false,
  
 
//   searchValue = "",
//   onSearchChange,
//   searchPlaceholder = "Search products...",
//   mobileSearchPlaceholder = "Search...",
  

//   cartItemCount = 0,
//   onCartClick,
  
 
//   onBackClick,
//   onMenuClick,
//   onFilterClick,
  
 
//   customActions,
  
//   backgroundColor = BROWN_DARK,
//   textColor = "#fff",
//   sticky = true,
  
//   isMobile: propIsMobile,
  
//   className = "",
//   style = {},
// }) => {
//   const navigate = useNavigate();
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);
//   const [internalIsMobile, setInternalIsMobile] = useState(window.innerWidth <= 768);
  
//   // Use prop isMobile if provided, otherwise use internal detection
//   const isMobile = propIsMobile !== undefined ? propIsMobile : internalIsMobile;

//   useEffect(() => {
//     if (propIsMobile === undefined) {
//       const handleResize = () => {
//         setInternalIsMobile(window.innerWidth <= 768);
//       };
      
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }
//   }, [propIsMobile]);

//   const handleCartClick = () => {
//     if (onCartClick) {
//       onCartClick();
//     } else {
//       navigate('/cart');
//     }
//   };

//   const handleBackClick = () => {
//     if (onBackClick) {
//       onBackClick();
//     } else {
//       navigate(-1);
//     }
//   };

//   const handleSearchChange = (e) => {
//     onSearchChange?.(e.target.value);
//   };

//   const clearSearch = () => {
//     onSearchChange?.('');
//   };

//   return (
//     <header 
//       className={`common-header ${className}`}
//       style={{
//         background: backgroundColor,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: isMobile ? "8px 12px" : "10px 16px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
//         position: sticky ? "sticky" : "relative",
//         top: 0,
//         zIndex: 100,
//         ...style,
//       }}
//     >
//       {/* Left Section - Logo, Title, Back Button, Menu Button */}
//       <div style={{ 
//         display: "flex", 
//         alignItems: "center", 
//         gap: isMobile ? 8 : 12,
//         flex: isMobile && isSearchExpanded ? 0 : 1,
//         transition: 'all 0.3s ease',
//       }}>
//         {/* Back Button */}
//         {showBackButton && (
//           <ArrowBackIcon 
//             style={{ 
//               fontSize: isMobile ? 20 : 24, 
//               color: textColor,
//               cursor: 'pointer',
//               marginRight: 4,
//             }}
//             onClick={handleBackClick}
//           />
//         )}

//         {/* Menu Button for Mobile */}
//         {isMobile && showMenuButton && onMenuClick && (
//           <MenuIcon 
//             style={{ 
//               fontSize: 24, 
//               color: textColor,
//               cursor: 'pointer',
//             }}
//             onClick={onMenuClick}
//           />
//         )}

//         {/* Logo */}
//         {showLogo && (!isMobile || !isSearchExpanded) && (
//           <div 
//             className="header-logo"
//             style={{
//               width: isMobile ? 36 : 40, 
//               height: isMobile ? 36 : 40, 
//               borderRadius: "50%",
//               background: ACCENT,
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "center",
//               fontWeight: "bold", 
//               color: BROWN_DARK, 
//               fontSize: isMobile ? 12 : 14, 
//               letterSpacing: 1,
//               flexShrink: 0,
//               cursor: 'pointer',
//             }}
//             onClick={() => navigate('/')}
//           >
//             {logo}
//           </div>
//         )}
        
//         {/* Title */}
//         {showTitle && (!isMobile || !isSearchExpanded) && (
//           <span 
//             className="header-title"
//             style={{ 
//               color: textColor, 
//               fontSize: isMobile ? 14 : 16, 
//               fontWeight: "600", 
//               letterSpacing: 1,
//               whiteSpace: 'nowrap',
//               cursor: 'pointer',
//             }}
//             onClick={() => navigate('/')}
//           >
//             {title}
//           </span>
//         )}
//       </div>

//       {/* Right Section - Search, Custom Actions, Cart */}
//       <div style={{ 
//         display: "flex", 
//         alignItems: "center", 
//         gap: isMobile ? 8 : 16,
//         flex: isMobile && isSearchExpanded ? 1 : 'none',
//         justifyContent: 'flex-end',
//       }}>
//         {/* Desktop Search - Exactly as in your original design */}
//         {showSearch && !isMobile && (
//           <div style={{ width: "250px" }}>
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               value={searchValue}
//               onChange={handleSearchChange}
//               className="search-input"
//               style={{
//                 width: "100%",
//                 padding: "8px 16px",
//                 borderRadius: 25,
//                 border: "none",
//                 backgroundColor: "rgba(255,255,255,0.15)",
//                 color: textColor,
//                 fontSize: 14,
//                 outline: "none",
//                 transition: 'all 0.2s',
//               }}
//             />
//           </div>
//         )}

//         {/* Mobile Search - Exactly as in your original design */}
//         {showSearch && isMobile && (
//           <div style={{ 
//             flex: 1, 
//             maxWidth: isSearchExpanded ? '100%' : 200, 
//             margin: "0 8px",
//             transition: 'all 0.3s ease',
//           }}>
//             <input
//               type="text"
//               placeholder={mobileSearchPlaceholder}
//               value={searchValue}
//               onChange={handleSearchChange}
//               className="search-input-mobile"
//               style={{
//                 width: "100%",
//                 padding: "6px 10px",
//                 borderRadius: 20,
//                 border: "none",
//                 backgroundColor: "rgba(255,255,255,0.15)",
//                 color: textColor,
//                 fontSize: 13,
//                 outline: "none",
//               }}
//             />
//           </div>
//         )}

//         {/* Filter Button (optional) */}
//         {showFilterButton && onFilterClick && (
//           <FilterListIcon 
//             style={{ 
//               fontSize: isMobile ? 22 : 20, 
//               color: textColor,
//               cursor: 'pointer',
//             }}
//             onClick={onFilterClick}
//           />
//         )}

//         {/* Custom Actions */}
//         {customActions && (
//           <div style={{ display: 'flex', gap: isMobile ? 6 : 8 }}>
//             {customActions}
//           </div>
//         )}

//         {/* Cart - Exactly as in your original design */}
//         {showCart && (
//           <div 
//             onClick={handleCartClick}
//             className="cart-button"
//             style={{
//               width: 36, 
//               height: 36, 
//               borderRadius: "50%",
//               background: BROWN_LIGHT,
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "center",
//               cursor: "pointer", 
//               position: "relative",
//               transition: 'all 0.2s',
//               flexShrink: 0,
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = BROWN}
//             onMouseLeave={(e) => e.currentTarget.style.background = BROWN_LIGHT}
//           >
//             <ShoppingCartIcon style={{ fontSize: 18, color: '#fff' }} />
//             {cartItemCount > 0 && (
//               <span style={{
//                 position: "absolute", 
//                 top: -4, 
//                 right: -4,
//                 background: "#e74c3c", 
//                 color: "#fff",
//                 borderRadius: "50%", 
//                 width: 18, 
//                 height: 18,
//                 fontSize: 10, 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center",
//                 fontWeight: "bold",
//                 border: '2px solid #fff',
//               }}>
//                 {cartItemCount > 99 ? '99+' : cartItemCount}
//               </span>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default CommonHeader;





import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BROWN_DARK = "#3a1f0e";
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
  handleCartClick
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('loginAt');
    
    toast.success('Logged out successfully');
    
    navigate('/', { replace: true });
    
    if (onLogout) {
      onLogout();
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
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
  };

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 8 : 16,
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
  };

  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? 16 : 20,
    fontWeight: "bold",
    color: "#fff",
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

  return (
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
        </div>

        <div style={rightSectionStyle}>
          {/* Show username when logged in - SINGLE INSTANCE */}
          {isLoggedIn && userName && (
            <span style={userNameBadgeStyle}>
              {userName}
            </span>
          )}

          {/* Cart Icon with badge */}
          {showCart && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleCartClick || onCartClick}
                style={iconButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
  );
};

export default CommonHeader;