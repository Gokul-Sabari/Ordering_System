// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';

// const BROWN = "#4a2c1a";
// const BROWN_DARK = "#3a1f0e";
// const BROWN_LIGHT = "#6b3f23";
// const ACCENT = "#c8a96e";

// export default function CartPage() {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState({});
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCartData();

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         console.log("Cart page became visible, reloading cart...");
//         loadCartData();
//       }
//     };

//     const handleFocus = () => {
//       console.log("Cart page focused, reloading cart...");
//       loadCartData();
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('focus', handleFocus);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('focus', handleFocus);
//     };
//   }, []);

//   const loadCartData = () => {
//     setLoading(true);
//     try {
//       const savedCart = localStorage.getItem('cartItems');
//       const savedProducts = localStorage.getItem('products');
      
//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         setCartItems(parsedCart);
//         console.log("✅ Cart page loaded cart:", parsedCart);
//       } else {
//         console.log("ℹ️ No cart found in localStorage");
//         setCartItems({});
//       }
      
//       if (savedProducts) {
//         setProducts(JSON.parse(savedProducts));
//       }
//     } catch (error) {
//       console.error("❌ Error loading cart data:", error);
//       toast.error("Failed to load cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = (id, delta) => {
//     setCartItems(prev => {
//       const current = prev[id] || 0;
//       const next = Math.max(0, current + delta);
      
//       let newCart;
//       if (next === 0) {
//         const { [id]: _, ...rest } = prev;
//         newCart = rest;
//       } else {
//         newCart = { ...prev, [id]: next };
//       }
      
     
//       localStorage.setItem('cartItems', JSON.stringify(newCart));
      
//       const product = products.find(p => p.id === id);
//       if (product) {
//         if (delta > 0) {
//           toast.success(`Increased ${product.name} quantity`);
//         } else if (delta < 0 && current > 0) {
//           if (current - 1 === 0) {
//             toast.info(`Removed ${product.name} from cart`);
//           } else {
//             toast.info(`Decreased ${product.name} quantity`);
//           }
//         }
//       }
      
//       return newCart;
//     });
//   };

//   const handleCheckout = () => {
//     toast.success("Processing checkout...");
//     setTimeout(() => {
//       toast.info("Checkout functionality will be implemented here");
//     }, 1000);
//   };

//   const clearCart = () => {
//     if (window.confirm('Are you sure you want to clear your cart?')) {
//       setCartItems({});
//       localStorage.removeItem('cartItems');
//       toast.info("Cart cleared");
//       console.log("🗑️ Cart cleared");
//     }
//   };

//   const continueShopping = () => {
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
   
//     navigate('/pos');
//   };

//   const getProductDetails = (productId) => {
//     return products.find(p => p.id === productId) || {};
//   };

//   const cartItemsList = Object.entries(cartItems)
//     .filter(([_, qty]) => qty > 0)
//     .map(([productId, qty]) => {
//       const product = getProductDetails(productId);
//       return { 
//         ...product, 
//         quantity: qty, 
//         total: (product.price || 0) * qty 
//       };
//     });

//   const totalAmount = cartItemsList.reduce((sum, item) => sum + item.total, 0);
//   const totalItems = cartItemsList.reduce((sum, item) => sum + item.quantity, 0);

//   if (loading) {
//     return (
//       <div style={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         alignItems: "center", 
//         height: "100vh",
//         background: "#f5f0eb"
//       }}>
//         <div style={{ color: BROWN, fontSize: "18px" }}>Loading cart...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       fontFamily: "'Georgia', serif", 
//       background: "#f5f0eb", 
//       minHeight: "100vh" 
//     }}>
//       {/* Header */}
//       <header style={{
//         background: BROWN_DARK,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "10px 24px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
//         position: "sticky",
//         top: 0,
//         zIndex: 100,
//       }}>
//         <div 
//           onClick={() => continueShopping()}
//           style={{ 
//             display: "flex", 
//             alignItems: "center", 
//             gap: 10,
//             cursor: "pointer"
//           }}
//         >
//           <div style={{
//             width: 44, height: 44, borderRadius: "50%",
//             background: ACCENT,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontWeight: "bold", color: BROWN_DARK, fontSize: 14, letterSpacing: 1,
//           }}>SMT</div>
//           <span style={{ color: "#fff", fontSize: 18, fontWeight: "600", letterSpacing: 1 }}>
//             SM Traders - Cart
//           </span>
//         </div>

//         <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//           <button
//             onClick={continueShopping}
//             style={{
//               padding: "8px 16px",
//               background: "transparent",
//               border: "1px solid #fff",
//               color: "#fff",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontSize: "14px",
//               transition: "all 0.3s",
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.background = "rgba(255,255,255,0.1)";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.background = "transparent";
//             }}
//           >
//             ← Continue Shopping
//           </button>
//           <div style={{
//             width: 40, height: 40, borderRadius: "50%",
//             background: BROWN_LIGHT,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             position: "relative",
//           }}>
//             🛒
//             {totalItems > 0 && (
//               <span style={{
//                 position: "absolute", top: -4, right: -4,
//                 background: "#e74c3c", color: "#fff",
//                 borderRadius: "50%", width: 18, height: 18,
//                 fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
//                 fontWeight: "bold",
//               }}>{totalItems}</span>
//             )}
//           </div>
//         </div>
//       </header>

      
//       <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 24px" }}>
//         <div style={{ 
//           background: "#fff", 
//           borderRadius: "15px", 
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           overflow: "hidden"
//         }}>

//           <div style={{ 
//             padding: "20px 24px", 
//             borderBottom: "1px solid #eee",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             background: "#faf7f2"
//           }}>
//             <h2 style={{ 
//               fontSize: "24px", 
//               fontWeight: "bold", 
//               color: BROWN,
//               margin: 0
//             }}>
//               Your Shopping Cart
//             </h2>
//             {cartItemsList.length > 0 && (
//               <button
//                 onClick={clearCart}
//                 style={{
//                   padding: "6px 12px",
//                   background: "#fee",
//                   border: "1px solid #fcc",
//                   color: "#c00",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   fontSize: "13px",
//                   transition: "all 0.3s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = "#fdd";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = "#fee";
//                 }}
//               >
//                 Clear Cart
//               </button>
//             )}
//           </div>

       
//           <div style={{ padding: "24px" }}>
//             {cartItemsList.length === 0 ? (
//               <div style={{ textAlign: "center", padding: "60px 20px" }}>
//                 <div style={{ fontSize: "48px", marginBottom: "20px" }}>🛒</div>
//                 <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
//                   Your cart is empty
//                 </p>
//                 <button
//                   onClick={continueShopping}
//                   style={{
//                     padding: "12px 24px",
//                     background: BROWN,
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "5px",
//                     fontSize: "16px",
//                     cursor: "pointer",
//                     transition: "background 0.3s",
//                   }}
//                   onMouseEnter={(e) => e.target.style.background = BROWN_DARK}
//                   onMouseLeave={(e) => e.target.style.background = BROWN}
//                 >
//                   Start Shopping
//                 </button>
//               </div>
//             ) : (
//               <>
                
//                 <div style={{ marginBottom: "30px" }}>
//                   {cartItemsList.map((item) => (
//                     <div 
//                       key={item.id} 
//                       style={{
//                         display: "flex",
//                         gap: "20px",
//                         padding: "20px 0",
//                         borderBottom: "1px solid #eee"
//                       }}
//                     >

//                       <img 
//                         src={item.image}
//                         alt={item.name}
//                         style={{
//                           width: "100px",
//                           height: "100px",
//                           objectFit: "cover",
//                           borderRadius: "8px"
//                         }}
//                         onError={(e) => {
//                           e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop";
//                         }}
//                       />
                      
           
//                       <div style={{ flex: 1 }}>
//                         <h3 style={{ 
//                           fontSize: "18px", 
//                           fontWeight: "600", 
//                           color: BROWN,
//                           margin: "0 0 8px 0"
//                         }}>
//                           {item.name}
//                         </h3>
//                         <p style={{ 
//                           fontSize: "14px", 
//                           color: "#666",
//                           margin: "0 0 4px 0"
//                         }}>
//                           Weight: {item.weight}
//                         </p>
//                         <p style={{ 
//                           fontSize: "14px", 
//                           color: "#666",
//                           margin: "0 0 12px 0"
//                         }}>
//                           Price: ₹{item.price} per {item.unit?.toLowerCase() || 'item'}
//                         </p>
                        
                      
//                         <div style={{ 
//                           display: "flex", 
//                           alignItems: "center",
//                           gap: "12px",
//                           marginTop: "10px"
//                         }}>
//                           <button 
//                             onClick={() => updateQty(item.id, -1)}
//                             style={{
//                               width: "32px",
//                               height: "32px",
//                               borderRadius: "50%",
//                               background: "#f0f0f0",
//                               border: "1px solid #ddd",
//                               cursor: "pointer",
//                               fontSize: "18px",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               transition: "all 0.2s",
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = "#e0e0e0";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = "#f0f0f0";
//                             }}
//                           >
//                             -
//                           </button>
                          
//                           <span style={{ 
//                             fontSize: "16px", 
//                             fontWeight: "500",
//                             minWidth: "30px",
//                             textAlign: "center"
//                           }}>
//                             {item.quantity}
//                           </span>
                          
//                           <button 
//                             onClick={() => updateQty(item.id, 1)}
//                             style={{
//                               width: "32px",
//                               height: "32px",
//                               borderRadius: "50%",
//                               background: "#f0f0f0",
//                               border: "1px solid #ddd",
//                               cursor: "pointer",
//                               fontSize: "18px",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               transition: "all 0.2s",
//                             }}
//                             onMouseEnter={(e) => {
//                               e.target.style.background = "#e0e0e0";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.background = "#f0f0f0";
//                             }}
//                           >
//                             +
//                           </button>
                          
//                           {item.stock && (
//                             <span style={{ 
//                               fontSize: "12px", 
//                               color: "#888",
//                               marginLeft: "10px"
//                             }}>
//                               Stock: {item.stock.toFixed(1)} {item.unit}
//                             </span>
//                           )}
//                         </div>
//                       </div>
                      
//                       {/* Item Total */}
//                       <div style={{ 
//                         minWidth: "120px",
//                         textAlign: "right"
//                       }}>
//                         <p style={{ 
//                           fontSize: "14px", 
//                           color: "#666",
//                           margin: "0 0 5px 0"
//                         }}>
//                           Subtotal:
//                         </p>
//                         <p style={{ 
//                           fontSize: "20px", 
//                           fontWeight: "bold",
//                           color: BROWN,
//                           margin: 0
//                         }}>
//                           ₹{item.total.toFixed(2)}
//                         </p>
//                         <p style={{ 
//                           fontSize: "12px", 
//                           color: "#888",
//                           margin: "5px 0 0 0"
//                         }}>
//                           (₹{item.price} × {item.quantity})
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

             
//                 <div style={{ 
//                   background: "#f9f4ef",
//                   borderRadius: "10px",
//                   padding: "24px",
//                   marginTop: "20px"
//                 }}>
//                   <h3 style={{ 
//                     fontSize: "18px", 
//                     fontWeight: "600", 
//                     color: BROWN,
//                     margin: "0 0 20px 0"
//                   }}>
//                     Order Summary
//                   </h3>
                  
//                   <div style={{ 
//                     display: "flex", 
//                     justifyContent: "space-between",
//                     marginBottom: "12px",
//                     fontSize: "16px",
//                     color: "#666"
//                   }}>
//                     <span>Total Items:</span>
//                     <span>{totalItems}</span>
//                   </div>
                  
//                   <div style={{ 
//                     display: "flex", 
//                     justifyContent: "space-between",
//                     marginBottom: "12px",
//                     fontSize: "16px",
//                     color: "#666"
//                   }}>
//                     <span>Total Products:</span>
//                     <span>{cartItemsList.length}</span>
//                   </div>
                  
//                   <div style={{ 
//                     display: "flex", 
//                     justifyContent: "space-between",
//                     marginBottom: "20px",
//                     paddingTop: "12px",
//                     borderTop: "2px dashed #d4c5b5",
//                     fontSize: "24px",
//                     fontWeight: "bold",
//                     color: BROWN
//                   }}>
//                     <span>Total Amount:</span>
//                     <span>₹{totalAmount.toFixed(2)}</span>
//                   </div>

//                   <button 
//                     onClick={handleCheckout}
//                     style={{
//                       width: "100%",
//                       padding: "16px",
//                       background: BROWN,
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "8px",
//                       fontSize: "18px",
//                       fontWeight: "600",
//                       cursor: "pointer",
//                       transition: "background 0.3s",
//                       marginBottom: "12px"
//                     }}
//                     onMouseEnter={(e) => e.target.style.background = BROWN_DARK}
//                     onMouseLeave={(e) => e.target.style.background = BROWN}
//                   >
//                     Proceed to Checkout
//                   </button>
                  
//                   <button 
//                     onClick={continueShopping}
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       background: "transparent",
//                       border: `2px solid ${BROWN}`,
//                       color: BROWN,
//                       borderRadius: "8px",
//                       fontSize: "16px",
//                       fontWeight: "500",
//                       cursor: "pointer",
//                       transition: "all 0.3s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = "#f0e9e2";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = "transparent";
//                     }}
//                   >
//                     Continue Shopping
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {cartItemsList.length > 0 && (
//         <div style={{
//           maxWidth: "1000px",
//           margin: "20px auto 40px",
//           padding: "0 24px",
//           textAlign: "center",
//           color: "#888",
//           fontSize: "13px"
//         }}>
//           <p>
//             Need help? Contact us at support@smtraders.com or call +91 1234567890
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { fetchLink } from "./fetchComponent";
const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";
const BG_COLOR = "#fdf8f3";

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
            Broker: customer.Broker ? customer.Broker.trim() : '',
            Transporter: customer.Transporter ? customer.Transporter.trim() : ''
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
        broker: customer.Broker?.trim() || "",
        transporter: customer.Transporter?.trim() || "",
        customerId: customer.Customer_Id,
        customerName: customer.Short_Name || "",
        mobileNo: customer.Mobile_No || "",
        address: customer.Address || "",
        city: customer.City || ""
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
        {/* {loading && (
          <div style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)"
          }}>
            <span style={{ color: BROWN }}>Loading...</span>
          </div>
        )} */}
      </div>

      {/* Dropdown Results */}
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
                  {customer.Broker?.trim() && <span>🤝 Broker: {customer.Broker}</span>}
                  {customer.Transporter?.trim() && <span>🚚 Trans: {customer.Transporter}</span>}
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

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Form states
  const [contactNumber, setContactNumber] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [customer, setCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");

  // Handle customer selection
  const handleCustomerSelect = (customerData) => {
    setCustomer(customerData.customerId);
    setBrokerName(customerData.broker || "");
    setTransporter(customerData.transporter || "");
    setContactNumber(customerData.mobileNo || "");
    
    // Auto-fill addresses if available
    if (customerData.address) {
      setShippingAddress(customerData.address);
      setDeliveryAddress(customerData.address);
    }
    
  };

  // Rest of your existing useEffect hooks and functions remain the same...
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadCartData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCartData();
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
    navigate('/pos');
  };

  const handleProceed = () => {
    setStep(2);
  };

  const handleBackToSelection = () => {
    setStep(1);
  };

  const handleCheckout = () => {
    // Validate required fields
    if (!contactNumber) {
      toast.error("Please enter contact number");
      return;
    }
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }
    
    // Create order object with all details
    const orderData = {
      customerId: customer,
      brokerName,
      transporter,
      contactNumber,
      shippingAddress,
      deliveryAddress,
      description,
      items: cartItemsList,
      totalAmount,
      totalItems,
      orderDate: new Date().toISOString()
    };
    console.log("customer",customer)
    toast.success("Order placed successfully!");
  };

  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId) || {};
  };

  const cartItemsList = Object.entries(cartItems)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const product = getProductDetails(productId);
      return { 
        ...product, 
        quantity: qty, 
        total: (product.price || 0) * qty 
      };
    });

  const totalAmount = cartItemsList.reduce((sum, item) => sum + item.total, 0);
  const totalItems = cartItemsList.reduce((sum, item) => sum + item.quantity, 0);

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

  // Styles remain the same...
  const mobileStyles = {
    container: {
      maxWidth: "100%",
      margin: "0 auto",
      padding: "12px 16px",
      background: BG_COLOR,
      minHeight: "100vh",
      paddingBottom: isMobile && step === 1 && cartItemsList.length > 0 ? '100px' : '20px',
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      position: "sticky",
      top: 0,
      background: BG_COLOR,
      padding: "10px 0",
      zIndex: 10,
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
    continueBtn: {
      padding: "8px 12px",
      background: "transparent",
      border: `1.5px solid ${BROWN}`,
      color: BROWN,
      borderRadius: "20px",
      fontSize: "13px",
      cursor: "pointer",
      fontWeight: "500",
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
      padding: "20px 24px",
      background: BG_COLOR,
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      color: BROWN,
      margin: 0,
    },
    continueBtn: {
      padding: "5px 5px",
      background: "transparent",
      border: `2px solid ${BROWN}`,
      color: BROWN,
      borderRadius: "8px",
      fontSize: "15px",
      cursor: "pointer",
      transition: "all 0.3s",
      fontWeight: "500",
    },
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1.8fr",
      gap: "24px",
    },
    leftSection: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    rightSection: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      padding: "24px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: BROWN,
      margin: "0 0 20px 0",
      paddingBottom: "12px",
      borderBottom: `2px solid ${ACCENT}`,
    },
    productItem: {
      display: "flex",
      padding: "20px",
      borderBottom: "1px solid #eee",
      position: "relative",
    },
    productImage: {
      width: "80px",
      height: "80px",
      borderRadius: "8px",
      objectFit: "cover",
      marginRight: "16px",
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: "18px",
      fontWeight: "600",
      color: BROWN,
      margin: "0 0 4px 0",
    },
    productTamil: {
      fontSize: "14px",
      color: "#666",
      margin: "0 0 8px 0",
      fontStyle: "italic",
    },
    productPrice: {
      display: "flex",
      gap: "16px",
      marginBottom: "12px",
    },
    priceTag: {
      background: "#f0e9e2",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      color: BROWN,
    },
    quantityControl: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginTop: "8px",
    },
    qtyBtn: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: `1px solid ${BROWN_LIGHT}`,
      background: "#fff",
      color: BROWN,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      transition: "all 0.2s",
    },
    qtyValue: {
      fontSize: "16px",
      fontWeight: "600",
      color: BROWN,
      minWidth: "30px",
      textAlign: "center",
    },
    itemTotal: {
      fontSize: "16px",
      fontWeight: "600",
      color: BROWN,
      marginLeft: "20px",
    },
    deleteBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      color: "#999",
      cursor: "pointer",
      transition: "color 0.2s",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#666",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s",
      boxSizing: "border-box"
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      background: "#fff",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      minHeight: "80px",
      resize: "vertical",
      boxSizing: "border-box",
      fontFamily: "inherit"
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      fontSize: "16px",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "2px dashed #ddd",
      fontSize: "20px",
      fontWeight: "bold",
      color: BROWN,
    },
    checkoutBtn: {
      width: "100%",
      padding: "16px",
      background: BROWN,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "18px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "24px",
      transition: "background 0.3s",
    },
    emptyCart: {
      textAlign: "center",
      padding: "60px 20px",
      background: "#fff",
      borderRadius: "16px",
    },
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  // Mobile Step 2 with Searchable Customer Select
  if (isMobile && step === 2) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <button onClick={handleBackToSelection} style={styles.backBtn}>
              <ArrowBackIcon />
            </button>
            <span>Order Details</span>
          </h1>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: "20px" }}>
          {/* Searchable Customer Select */}
          <div style={styles.formGroup}>
            <SearchableCustomerSelect 
              value={customer}
              onChange={setCustomer}
              onCustomerSelect={handleCustomerSelect}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="tel"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Broker Name"
              value={brokerName}
              onChange={(e) => setBrokerName(e.target.value)}
              style={styles.input}
              readOnly // Make it read-only since it's auto-filled
              // style={{
              //   ...styles.input,
              //   backgroundColor: brokerName ? "#f5f0eb" : "#fff"
              // }}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Transporter"
              value={transporter}
              onChange={(e) => setTransporter(e.target.value)}
              style={styles.input}
              readOnly // Make it read-only since it's auto-filled
              // style={{
              //   ...styles.input,
              //   backgroundColor: transporter ? "#f5f0eb" : "#fff"
              // }}
            />
          </div>

          <div style={styles.formGroup}>
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
              {cartItemsList.map(item => (
                <div key={item.id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: "4px",
                  fontSize: "12px"
                }}>
                  <span>• {item.name} x {item.quantity}</span>
                  <span>₹{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <textarea
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <textarea
              placeholder="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>
        </div>

        {/* Total and Order Now Button */}
        <div style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          padding: "16px 0",
          borderTop: `2px solid ${ACCENT}`,
          marginTop: "10px",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "bold",
            color: BROWN,
          }}>
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>

          <button 
            onClick={handleCheckout}
            style={styles.checkoutBtn}
          >
            Order Now
          </button>
        </div>
      </div>
    );
  }

  // Mobile Step 1
  if (isMobile && step === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span>🛒</span> SM Traders
          </h1>
          <button 
            onClick={continueShopping}
            style={styles.continueBtn}
          >
            ← Back
          </button>
        </div>

        <h2 style={{ 
          fontSize: "16px", 
          fontWeight: "600", 
          color: BROWN,
          marginBottom: "12px" 
        }}>
          Selection List
        </h2>

        {/* Product Items */}
        <div style={{ marginBottom: "20px" }}>
          {cartItemsList.map((item) => (
            <div key={item.id} style={styles.productItem}>
              <img 
                src={item.image}
                alt={item.name}
                style={styles.productImage}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=70&h=70&fit=crop";
                }}
              />
              
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{item.name}</h3>
                <p style={styles.productTamil}>
                  {item.name}
                </p>
                
                <div style={styles.quantityControl}>
                  <button 
                    onClick={() => updateQty(item.id, -1)}
                    style={styles.qtyBtn}
                  >
                    <RemoveIcon style={{ fontSize: "16px" }} />
                  </button>
                  
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  
                  <button 
                    onClick={() => updateQty(item.id, 1)}
                    style={styles.qtyBtn}
                  >
                    <AddIcon style={{ fontSize: "16px" }} />
                  </button>
                  
                  <span style={styles.priceTag}>RS.{item.price}</span>
                </div>
              </div>
              
              <div 
                style={styles.deleteBtn}
                onClick={() => removeItem(item.id)}
              >
                <DeleteOutlineIcon style={{ fontSize: "18px" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.summaryRow}>
            <span>{totalItems} Products Selected</span>
            <span style={{ fontWeight: "bold", color: BROWN }}>
              Total: ₹{totalAmount}
            </span>
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
    );
  }

  // Desktop view
  return (
    <div style={desktopStyles.container}>
      <div style={desktopStyles.header}>
        <h1 style={desktopStyles.title}>SM Traders</h1>
        <button 
          onClick={continueShopping}
          style={desktopStyles.continueBtn}
          onMouseEnter={(e) => {
            e.target.style.background = BROWN;
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = BROWN;
          }}
        >
          ← Continue Shopping
        </button>
      </div>

      {cartItemsList.length === 0 ? (
        <div style={desktopStyles.emptyCart}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
            Your selection list is empty
          </p>
          <button 
            onClick={continueShopping}
            style={{
              ...desktopStyles.continueBtn,
              background: BROWN,
              color: "#fff",
              border: "none",
              padding: "12px 30px",
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div style={desktopStyles.mainContent}>
          {/* Left Section - Selection List */}
          <div style={desktopStyles.leftSection}>
            <div style={{ padding: "20px" }}>
              <h2 style={desktopStyles.sectionTitle}>Selection List</h2>
              
              {cartItemsList.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px dashed #ddd",
                }}>
                  {/* Left side - Product Info */}
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
                      <span style={{
                        background: "#f0e9e2",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: BROWN,
                        display: "inline-block",
                      }}>
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Right side - Quantity Controls and Total */}
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
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: BROWN,
                        minWidth: "60px",
                        textAlign: "right",
                      }}>
                        ₹{item.total}
                      </span>
                      
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
                          e.target.style.background = "#fee";
                          e.target.style.color = "#ff4444";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#999";
                        }}
                      >
                        <DeleteOutlineIcon style={{ fontSize: "18px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Order Details */}
          <div style={desktopStyles.rightSection}>
            <h2 style={desktopStyles.sectionTitle}>Order Details</h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}>
              {/* Left Column */}
              <div>
                <div style={desktopStyles.formGroup}>
                  <SearchableCustomerSelect 
                    value={customer}
                    onChange={setCustomer}
                    onCustomerSelect={handleCustomerSelect}
                  />
                </div>
                
                <div style={desktopStyles.formGroup}>
                  <input
                    type="text"
                    placeholder="Broker Name"
                    value={brokerName}
                    onChange={(e) => setBrokerName(e.target.value)}
                    style={{
                      ...desktopStyles.input,
                      backgroundColor: brokerName ? "#f5f0eb" : "#fff"
                    }}
                    readOnly
                  />
                </div>
                
                <div style={desktopStyles.formGroup}>
                  <textarea
                    placeholder="Enter shipping address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    style={desktopStyles.textarea}
                  />
                </div>
                
                <div style={desktopStyles.formGroup}>
                  <textarea
                    placeholder="Add any notes or description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={desktopStyles.textarea}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div style={desktopStyles.formGroup}>
                  <input
                    type="text"
                    placeholder="Transporter"
                    value={transporter}
                    onChange={(e) => setTransporter(e.target.value)}
                    style={{
                      ...desktopStyles.input,
                      backgroundColor: transporter ? "#f5f0eb" : "#fff"
                    }}
                    readOnly
                  />
                </div>
                
                <div style={desktopStyles.formGroup}>
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    style={desktopStyles.input}
                  />
                </div>
                
                <div style={desktopStyles.formGroup}>
                  <textarea
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={desktopStyles.textarea}
                  />
                </div>
              </div>
            </div>

            {/* Product Summary */}
            <div style={desktopStyles.formGroup}>
              <div style={{
                background: "#f9f4ef",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "14px",
                color: BROWN,
              }}>
                {cartItemsList.map(item => (
                  <div key={item.id} style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}>
                    <span>• {item.name} x {item.quantity}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ marginTop: "20px" }}>
              <div style={desktopStyles.summaryRow}>
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              
              <div style={desktopStyles.totalRow}>
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Order Now Button */}
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
  );
}