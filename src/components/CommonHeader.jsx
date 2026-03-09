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
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

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
  backgroundColor = "#3a1f0e",
  showLogout = false,
  onLogout,
  userName = "" // New prop for user name
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('loginAt');
    
    toast.success('Logged out successfully');
    
    // Redirect to home page
    navigate('/', { replace: true });
    
    // Call custom onLogout if provided
    if (onLogout) {
      onLogout();
    }
  };

  const headerStyle = {
    background: backgroundColor,
    color: '#fff',
    padding: isMobile ? '12px 16px' : '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '12px' : '20px',
  };

  const logoStyle = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    background: '#fff',
    color: backgroundColor,
    width: isMobile ? '36px' : '44px',
    height: isMobile ? '36px' : '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle = {
    fontSize: isMobile ? '16px' : '20px',
    fontWeight: '600',
    margin: 0,
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '12px' : '20px',
  };

  const iconButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background 0.3s',
    position: 'relative',
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    background: '#c8a96e',
    color: '#3a1f0e',
    fontSize: '10px',
    fontWeight: 'bold',
    minWidth: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.1)',
    padding: isMobile ? '4px 8px' : '6px 12px',
    borderRadius: '20px',
    marginRight: '8px',
  };

  const userNameStyle = {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    color: '#fff',
    maxWidth: isMobile ? '100px' : '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const logoutButtonStyle = {
    background: 'transparent',
    border: '1.5px solid #fff',
    color: '#fff',
    borderRadius: '20px',
    padding: isMobile ? '6px 12px' : '8px 16px',
    fontSize: isMobile ? '13px' : '14px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s',
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={leftSectionStyle}>
          {showBackButton && (
            <button
              onClick={onBackClick}
              style={iconButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ←
            </button>
          )}
          
          <div style={logoStyle}>
            {logo}
          </div>
          
          {showTitle && (
            <h1 style={titleStyle}>{title}</h1>
          )}
        </div>

        <div style={rightSectionStyle}>
          {/* Show user info if logged in */}
          {showLogout && userName && (
            <div style={userInfoStyle}>
              <PersonIcon style={{ fontSize: isMobile ? '16px' : '18px', color: '#fff' }} />
              <span style={userNameStyle}>{userName}</span>
            </div>
          )}

          {/* Show logout button if user is logged in */}
          {showLogout && (
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <LogoutIcon style={{ fontSize: isMobile ? '16px' : '18px' }} />
              {!isMobile && 'Logout'}
            </button>
          )}

          {showSearch && (
            <button
              onClick={onSearchClick}
              style={iconButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              🔍
            </button>
          )}

          {showCart && (
            <button
              onClick={onCartClick}
              style={iconButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              🛒
              {cartItemCount > 0 && (
                <span style={cartBadgeStyle}>
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {customActions}
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;