// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchLink } from './fetchComponent';
// import { toast } from 'react-toastify';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import FilterListIcon from '@mui/icons-material/FilterList';

// const BROWN = "#4a2c1a";
// const BROWN_DARK = "#3a1f0e";
// const BROWN_LIGHT = "#6b3f23";
// const ACCENT = "#c8a96e";

// function QuantityControl({ quantity, onIncrease, onDecrease, outOfStock }) {
//   if (outOfStock) {
//     return (
//       <div className="absolute bg-[#6b5454] h-[22px] left-[238px] rounded-[15px] top-[135px] w-[110px] opacity-50">
//         <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[28px] not-italic text-[10px] text-white top-[5px] whitespace-nowrap">
//           Out of Stock
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="absolute bg-[#6b5454] h-[22px] left-[238px] rounded-[15px] top-[135px] w-[110px] flex items-center justify-between px-2">
//       <button 
//         onClick={onDecrease}
//         className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
//         disabled={quantity === 0}
//       >
//         -
//       </button>
      
//       <span className="text-white text-xs font-medium">
//         {quantity}
//       </span>
      
//       <button 
//         onClick={onIncrease}
//         className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
//       >
//         +
//       </button>
//     </div>
//   );
// }

// function PriceTag({ price }) {
//   return (
//     <div className="absolute bg-[#6b5454] h-[25px] left-0 overflow-clip top-[132.95px] w-[115px]">
//   <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-[14px] not-italic text-[22px] text-white top-[2.05px] w-[70px]">
//     ₹{price}
//   </p>
// </div>
//   );
// }

// function CartIconComponent() {
//   return (
//     <div className="absolute bg-white border border-[#6b5454] border-solid left-[210px] overflow-clip rounded-[50px] size-[23px] top-[135px] cursor-pointer hover:bg-gray-100 transition-colors">
//       <div className="absolute left-[5px] size-[11px] top-[5px] flex items-center justify-center">
//         <ShoppingCartIcon 
//           style={{ 
//             fontSize: '11px', 
//             color: '#6b5454'
//           }} 
//         />
//       </div>
//     </div>
//   );
// }

// function ProductCard({ product, quantity, onUpdateQty, isMobile }) {
//   const outOfStock = product.stock <= 0;

//   const handleIncrease = () => onUpdateQty(product.id, 1);
//   const handleDecrease = () => onUpdateQty(product.id, -1);


//  if (isMobile) {
//   return (
//     <div style={{
//       display: 'flex',
//       background: '#fff',
//       borderRadius: '12px',
//       width: '100%',
//       minHeight: '120px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//       border: '1px solid #e8ddd4',
//       overflow: 'hidden',
//       transition: 'box-shadow 0.2s',
//     }}>
//       {/* LEFT COLUMN - Product Info */}
//       <div style={{
//         flex: 1,
//         padding: '12px',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//       }}>
//         {/* Product Name */}
//         <p style={{
//           margin: 0,
//           fontWeight: '600',
//           fontSize: '14px',
//           color: '#6b5454',
//           lineHeight: 1.3,
//         }}>
//           {product.name}
//         </p>
        
//         {/* Short Name */}
//         {product.shortName && (
//           <p style={{
//             margin: '4px 0 0',
//             fontSize: '11px',
//             color: '#888',
//             lineHeight: 1.2,
//           }}>
//             {product.shortName}
//           </p>
//         )}
        
//         {/* Stock Details */}
//         <p style={{
//           margin: '8px 0 0',
//           fontSize: '10px',
//           color: outOfStock ? '#e74c3c' : '#555',
//           fontWeight: outOfStock ? '600' : 'normal',
//         }}>
//           {outOfStock
//             ? '⚠ Out of Stock'
//             : `Stock: ${product.stock.toFixed(1)} Bags`}
//           {!outOfStock && product.balQty > 0 && (
//             <span style={{ color: '#999', marginLeft: '4px' }}>
//               ({product.balQty} kg)
//             </span>
//           )}
//         </p>
        
//         {/* Price */}
//         <span style={{
//           marginTop: '8px',
//           fontSize: '16px',
//           fontWeight: '700',
//           color: '#3a1f0e',
//         }}>
//           ₹{product.price}
//         </span>
//       </div>

//       {/* RIGHT COLUMN - Image and Quantity Control */}
//       <div style={{
//         width: '120px',
//         minWidth: '120px',
//         display: 'flex',
//         flexDirection: 'column',
//         borderLeft: '1px solid #f0e8e0',
//         background: '#faf6f2',
//       }}>
//         {/* Image */}
//         <div style={{
//           width: '100%',
//           height: '80px',
//           overflow: 'hidden',
//           background: '#f5f0eb',
//         }}>
//           <img
//             alt={product.name}
//             src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=80&fit=crop"}
//             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=80&fit=crop"; }}
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//         </div>

//         {/* Quantity Control */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '8px',
//         }}>
//           {outOfStock ? (
//             <span style={{
//               fontSize: '10px',
//               color: '#fff',
//               background: '#b0a0a0',
//               borderRadius: '10px',
//               padding: '4px 8px',
//             }}>
//               Out of Stock
//             </span>
//           ) : (
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               background: '#6b5454',
//               borderRadius: '20px',
//               padding: '4px 8px',
//               gap: '8px',
//             }}>
//               <button
//                 onClick={handleDecrease}
//                 disabled={quantity === 0}
//                 style={{
//                   background: 'transparent',
//                   border: 'none',
//                   color: '#fff',
//                   fontWeight: 'bold',
//                   fontSize: '16px',
//                   cursor: quantity === 0 ? 'not-allowed' : 'pointer',
//                   width: '24px',
//                   height: '24px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   borderRadius: '50%',
//                   opacity: quantity === 0 ? 0.4 : 1,
//                   lineHeight: 1,
//                   padding: 0,
//                 }}
//               >
//                 -
//               </button>
//               <span style={{
//                 color: '#fff',
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 minWidth: '20px',
//                 textAlign: 'center',
//               }}>
//                 {quantity}
//               </span>
//               <button
//                 onClick={handleIncrease}
//                 style={{
//                   background: 'transparent',
//                   border: 'none',
//                   color: '#fff',
//                   fontWeight: 'bold',
//                   fontSize: '16px',
//                   cursor: 'pointer',
//                   width: '24px',
//                   height: '24px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   borderRadius: '50%',
//                   lineHeight: 1,
//                   padding: 0,
//                 }}
//               >
//                 +
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//   // ─── DESKTOP: original card layout ───
//   return (
//     <div className="bg-white relative rounded-[15px] w-[360px] h-[170px] shadow-[0_2px_8px_rgba(0,0,0,0.09)] hover:shadow-[-10px_8px_5px_-2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-[3px]">
//       <div className="overflow-clip relative rounded-[inherit] size-full" style={{ display: 'flex' }}>
//         {/* LEFT SIDE - All Product Details */}
//         <div style={{ 
//           flex: 1, 
//           padding: '12px 0 12px 14px',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'space-between',
//           width: '70%'
//         }}>
//        <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[15px] whitespace-nowrap m-0">
//             {product.shortName}
//           </p>

//           {/* Product Name */}
//           <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[12px] whitespace-nowrap m-0">
//             {product.name}
//           </p>
          
//           {/* Short Name */}
   
          
//           {/* Stock Details */}
         
//             <div className="bg-[#6b5454] h-[25px] overflow-clip w-[85px] flex items-center justify-center rounded">
//               <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[20px] text-white">
//                 ₹{product.price}
//               </p>
//             </div>
            
//             {/* Quantity Control */}
//             {outOfStock ? (
//               <div className="bg-[#6b5454] h-[22px] rounded-[15px] w-[90px] opacity-50 flex items-center justify-center">
//                 <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-white">
//                   Out of Stock
//                 </p>
//               </div>
//             ) : (
//               <div className="bg-[#6b5454] h-[22px] rounded-[15px] w-[90px] flex items-center justify-between px-2">
//                 <button 
//                   onClick={handleDecrease}
//                   className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
//                   disabled={quantity === 0}
//                 >
//                   -
//                 </button>
                
//                 <span className="text-white text-xs font-medium">
//                   {quantity}
//                 </span>
                
//                 <button 
//                   onClick={handleIncrease}
//                   className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
//                 >
//                   +
//                 </button>
//               </div>
//             )}
//              <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap m-0 ${
//             outOfStock ? 'text-red-500' : 'text-[#403f3d]'
//           }`}>
//             Stock: {outOfStock ? 'Out of Stock' : `${product.stock.toFixed(1)} Bags`}
//             {!outOfStock && product.balQty > 0 && (
//               <span className="text-[#666] ml-1 text-[8px]">
//                 ({product.balQty} kg)
//               </span>
//             )}
//           </p>
          
//           {/* Price and Quantity Control Row */}
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginTop: '4px',
//             paddingRight: '8px'
//           }}>
//             {/* Price Tag */}
          
//           </div>
//         </div>

//         {/* RIGHT SIDE - Only Image */}
//         <div style={{
//           width: '120px',
//           height: '100%',
//           position: 'relative',
//           overflow: 'hidden',
//           borderTopRightRadius: '15px',
//           borderBottomRightRadius: '15px',
//         }}>
//           <img 
//             alt={product.name}
//             className="w-full h-full object-cover"
//             src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=170&fit=crop"}
//             onError={(e) => {
//               e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=170&fit=crop";
//             }}
//           />
          
//           {/* Cart Icon and Quantity Badge - Positioned absolutely on the image */}
//           <div style={{
//             position: 'absolute',
//             top: '8px',
//             right: '8px',
//             zIndex: 10,
//           }}>
//             <div className="bg-white border border-[#6b5454] border-solid rounded-[50px] size-[23px] cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center">
//               <ShoppingCartIcon 
//                 style={{ 
//                   fontSize: '11px', 
//                   color: '#6b5454'
//                 }} 
//               />
//             </div>
//             {quantity > 0 && (
//               <span className="absolute bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
//                     style={{ top: '-4px', right: '-4px' }}>
//                 {quantity}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div aria-hidden="true" className="absolute border border-[#6b5454] border-solid inset-[-1px] pointer-events-none rounded-[16px] shadow-[-10px_8px_5px_-2px_rgba(0,0,0,0.1)]" />
//     </div>
//   );
// }



// function MobileOrderSummary({ selectedCount, totalAmount, onGoToCart }) {
//   if (selectedCount === 0) return null;

//   return (
//     <div style={{
//       position: 'fixed',
//       bottom: 0,
//       right: 0,
//       left: 0,
//       backgroundColor: 'white',
//       boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
//       padding: '12px 16px',
//       zIndex: 1000,
//       borderTopLeftRadius: '16px',
//       borderTopRightRadius: '16px',
//       borderTop: `2px solid ${BROWN_DARK}`,
//     }}>
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}>
//         <div>
//           <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
//             {/* Selected Items: <span style={{ fontWeight: 'bold', color: BROWN_DARK }}>{selectedCount}</span> */}
//           </div>
//           <div style={{ fontSize: '16px', fontWeight: 'bold', color: BROWN_DARK }}>
//             {/* Total: ₹{totalAmount.toFixed(2)} */}
//           </div>
//         </div>

//         <button
//           onClick={onGoToCart}
//           style={{
//             backgroundColor: BROWN_DARK,
//             color: 'white',
//             border: 'none',
//             borderRadius: '25px',
//             padding: '12px 24px',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//             transition: 'all 0.2s',
//           }}
//           onMouseEnter={(e) => e.target.style.backgroundColor = BROWN_LIGHT}
//           onMouseLeave={(e) => e.target.style.backgroundColor = BROWN_DARK}
//         >
//           <ShoppingCartIcon style={{ fontSize: '18px' }} />
//           Go to Cart
//           {selectedCount > 0 && (
//             <span style={{
//               backgroundColor: '#e74c3c',
//               borderRadius: '50%',
//               width: '20px',
//               height: '20px',
//               fontSize: '12px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               marginLeft: '4px',
//             }}>
//               {selectedCount}
//             </span>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function SMTraders() {
//   const navigate = useNavigate();
//   const [quantities, setQuantities] = useState({});
//   const [search, setSearch] = useState("");
//   const [allProducts, setAllProducts] = useState([]);
//   const [stockGroups, setStockGroups] = useState([]);
//   const [posGroups, setPosGroups] = useState([]);
//   const [displayProducts, setDisplayProducts] = useState([]);
//   const [selectedStockGroup, setSelectedStockGroup] = useState("All Categories");
//   const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
//   const [showPOSGroups, setShowPOSGroups] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
  
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const loadCartFromStorage = () => {
//       try {
//         const savedCart = localStorage.getItem('cartItems');
//         if (savedCart) {
//           const parsedCart = JSON.parse(savedCart);
//           setQuantities(parsedCart);
//         } else {
//         }
//       } catch (error) {
//         console.error("❌ Error parsing cart from localStorage:", error);
//       }
//     };


//     loadCartFromStorage();

 
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         loadCartFromStorage();
//       }
//     };

//     const handleFocus = () => {
//       loadCartFromStorage();
//     };

//     const handleStorageChange = (e) => {
//       if (e.key === 'cartItems') {
//         loadCartFromStorage();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('focus', handleFocus);
//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('focus', handleFocus);
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []); 

//   useEffect(() => {
//     if (initialLoadDone) {
//       localStorage.setItem('cartItems', JSON.stringify(quantities));
//     }
//   }, [quantities, initialLoadDone]);

//   const deduplicateProducts = (products) => {
//     const uniqueProducts = new Map();
    
//     products.forEach(product => {
//       const uniqueKey = product.Product_Id;
      
//       if (!uniqueProducts.has(uniqueKey)) {
//         uniqueProducts.set(uniqueKey, product);
//       }
//     });
    
//     return Array.from(uniqueProducts.values());
//   };

//   const mergeProductData = (productList, stockResponse) => {
//     if (!productList || !productList.length) {
//       return [];
//     }
    
//     let stockData = [];
//     if (stockResponse?.success && stockResponse.data && stockResponse.data.Pos_Product) {
     
//       const posProduct = stockResponse.data.Pos_Product;
//       if (Array.isArray(posProduct)) {
       
//         stockData = posProduct[0]?.Product_Entry || [];
//       } else {

//         stockData = posProduct.Product_Entry || [];
//       }
//     }
    
    
//     const stockMap = new Map();
//     if (stockData.length) {
//       stockData.forEach(item => {

//         const productId = String(item.Product_Id).trim();
//         stockMap.set(productId, item);
//       });
//     }


//     const merged = productList.map(product => {
//       const productId = String(product.Product_Id).trim();
//       const stockItem = stockMap.get(productId);
      
//       if (stockItem) {
    
//         return {
//           ...product,
//           Bal_Qty: stockItem.Bal_Qty || 0,
//           Price: stockItem.Price || product.Product_Rate || 0,
//           _hasStock: true
//         };
//       } else {
    
//         return {
//           ...product,
//           Bal_Qty: 0,
//           Price: product.Product_Rate || 0,
//           _hasStock: false
//         };
//       }
//     });

//     return merged;
//   };

// const fetchAllData = async () => {
//   setLoadingProducts(true);
//   try {
//     const [posResponse, stockResponse] = await Promise.all([
//       fetchLink({ address: `pos/posProductList` }),
//       fetchLink({ address: `pos/productMaster` })
//     ]);

//     let productList = [];
    
//     if (posResponse?.success && posResponse.data) {
//       productList = posResponse.data;
//     }

//     const mergedProducts = mergeProductData(productList, stockResponse);
//     const uniqueProducts = deduplicateProducts(mergedProducts);
    
//     const activeProducts = uniqueProducts.filter(product => 
//       product.isActive === 1 || product.IsActive === 1 || product.Is_Active === 1
//     );
    
//     setAllProducts(activeProducts);
//     setDisplayProducts(activeProducts);
    
//     const formattedProducts = activeProducts.map(formatProduct);
//     localStorage.setItem('products', JSON.stringify(formattedProducts));
    
//     setInitialLoadDone(true);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     toast.error("Failed to load products");
//   } finally {
//     setLoadingProducts(false);
//   }
// };
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const uniqueGroups = [...new Set(allProducts.map(p => p.Stock_Group))]
//         .filter(group => group && group.trim() !== "" && group !== "NOT FOUND" && group !== "NULL")
//         .sort();
      
//       const formattedGroups = uniqueGroups.map(group => ({
//         id: group,
//         name: group,
//       }));
      
//       setStockGroups([{ id: 'All Categories', name: 'All Categories' }, ...formattedGroups]);
//     }
//   }, [allProducts]);

//   const handleStockGroupClick = (group) => {
//     setSelectedPOSGroup(null);
//     setSelectedStockGroup(group.id);
    
//     if (group.id === 'All Categories') {
//       setDisplayProducts(allProducts);
//       setShowPOSGroups(false);
//       setPosGroups([]);
//     } else {
//       const filteredByStock = allProducts.filter(p => {
//         const productGroup = (p.Stock_Group || "").trim();
//         const selectedGroup = group.id.trim();
//         return productGroup === selectedGroup;
//       });
      
//       setDisplayProducts(filteredByStock);
      
//       const posGroupsList = extractPOSGroups(filteredByStock);
//       setPosGroups(posGroupsList);
//       setShowPOSGroups(true);
      
     
//       if (isMobile && posGroupsList.length > 0) {
//         setIsDrawerOpen(true);
//       }
//     }
//   };

//   const handlePOSGroupClick = (posGroup) => {
//     setSelectedPOSGroup(posGroup);
    
//     const filtered = allProducts.filter(p => {
//       const stockMatch = (p.Stock_Group || "").trim() === selectedStockGroup.trim();
//       const posMatch = (p.POS_Group || "").trim() === posGroup.trim();
//       return stockMatch && posMatch;
//     });
    
//     setDisplayProducts(filtered);
    
 
//     if (isMobile) {
//       setIsDrawerOpen(false);
//     }
//   };

//   const handleAllPOSGroupsClick = () => {
//     setSelectedPOSGroup(null);
    
//     const filteredByStock = allProducts.filter(p => 
//       (p.Stock_Group || "").trim() === selectedStockGroup.trim()
//     );
    
//     setDisplayProducts(filteredByStock);
    
 
//     if (isMobile) {
//       setIsDrawerOpen(false);
//     }
//   };

//   const extractPOSGroups = (productsList) => {
//     const uniqueGroups = [...new Set(productsList.map(p => (p.POS_Group || "").trim()))]
//       .filter(group => group && group !== "" && group !== "NULL");
    
//     const groups = uniqueGroups
//       .map(group => ({
//         posGroup: group,
//         itemCount: productsList.filter(p => (p.POS_Group || "").trim() === group).length
//       }))
//       .sort((a, b) => a.posGroup.localeCompare(b.posGroup));
    
//     return groups;
//   };

//   const updateQty = (id, delta) => {
//     setQuantities(prev => {
//       const current = prev[id] || 0;
//       const next = Math.max(0, current + delta);
      
//       let newQuantities;
//       if (next === 0) {
//         const { [id]: _, ...rest } = prev;
//         newQuantities = rest;
//       } else {
//         newQuantities = { ...prev, [id]: next };
//       }
      
//       return newQuantities;
//     });
    
   
//     const product = allProducts.find(p => {
//       return String(p.Product_Id) === id;
//     });
    
//     // if (product) {
//     //   if (delta > 0) {
//     //     toast.success(`Added ${product.Product_Name} to cart`);
//     //   } else if (delta < 0) {
//     //     const currentQty = quantities[id] || 0;
//     //     if (currentQty - 1 === 0) {
//     //       toast.info(`Removed ${product.Product_Name} from cart`);
//     //     } else {
//     //       toast.info(`Decreased ${product.Product_Name} quantity`);
//     //     }
//     //   }
//     // }
//   };

//   const selectedCount = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);


//   const totalAmount = Object.entries(quantities).reduce((sum, [id, qty]) => {
//     const product = allProducts.find(p => String(p.Product_Id) === id);
//     if (product) {
//       const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
//       return sum + (price * qty);
//     }
//     return sum;
//   }, 0);

//   const filtered = displayProducts.filter(p => {
//     if (!search) return true;
    
//     const searchLower = search.toLowerCase();
//     return (
//       (p.Product_Name && p.Product_Name.toLowerCase().includes(searchLower)) ||
//       (p.Short_Name && p.Short_Name.toLowerCase().includes(searchLower)) ||
//       (p.POS_Group && p.POS_Group.toLowerCase().includes(searchLower)) ||
//       (p.Stock_Group && p.Stock_Group.toLowerCase().includes(searchLower))
//     );
//   });

//   const formatProduct = (product) => {
//     const uniqueId = String(product.Product_Id);
 
//     const balQty = parseFloat(product.Bal_Qty) || 0;
    

//     const packGet = parseFloat(product.PackGet) || 1;
    

//     const stockInBags = packGet > 0 ? balQty / packGet : 0;
    

//     const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
    
//     return {
//       id: uniqueId,
//       name: product.Product_Name || product.Stock_Item || "Unknown",
//       fullName: product.Product_Name || "Unknown",
//       shortName: product.Short_Name,
//       weight: product.Bag || product.PackGet ? `${product.PackGet || ''}kg` : "N/A",
//       stockGroup: product.Stock_Group || "General",
//       posGroup: product.POS_Group || "General",
//       price: price,
//       stock: stockInBags,
//       unit: product.Units || "Bags",
//       image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=116&fit=crop",
//       coolie: product.Coolie,
//       brokerage: product.NagalBrokerage || product.Brokerage,
//       packGet: product.PackGet,
//       hsnCode: product.HSN_Code,
//       balQty: balQty,
//       originalProduct: product
//     };
//   };

//   const formattedProducts = allProducts.map(formatProduct);

//   const handleCartClick = () => {
  
//     localStorage.setItem('cartItems', JSON.stringify(quantities));
//     localStorage.setItem('products', JSON.stringify(formattedProducts));
//     navigate('/cart');
//   };


//   const MobileDrawer = () => (
//     <>

//       {isDrawerOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 999,
//             animation: 'fadeIn 0.3s ease',
//           }}
//           onClick={() => setIsDrawerOpen(false)}
//         />
//       )}


//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           bottom: 0,
//           width: '85%',
//           maxWidth: '320px',
//           backgroundColor: '#fff',
//           zIndex: 1000,
//           transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
//           transition: 'transform 0.3s ease-in-out',
//           overflowY: 'auto',
//           boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
//         }}
//       >

//         <div
//           style={{
//             padding: '20px 16px',
//             backgroundColor: BROWN_DARK,
//             color: '#fff',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             position: 'sticky',
//             top: 0,
//             zIndex: 10,
//           }}
//         >
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <FilterListIcon style={{ fontSize: '20px' }} />
//             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//               {selectedStockGroup} - POS Groups
//             </span>
//           </div>
//           <CloseIcon 
//             style={{ cursor: 'pointer', fontSize: '20px' }}
//             onClick={() => setIsDrawerOpen(false)}
//           />
//         </div>

      
//         <div style={{ padding: '16px' }}>
//           {showPOSGroups && posGroups.length > 0 ? (
//             <div>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
//                 <button
//                   onClick={handleAllPOSGroupsClick}
//                   style={{
//                     padding: '12px 16px',
//                     borderRadius: '8px',
//                     border: 'none',
//                     backgroundColor: selectedPOSGroup === null ? BROWN_DARK : '#f5f0eb',
//                     color: selectedPOSGroup === null ? '#fff' : BROWN_DARK,
//                     fontFamily: 'inherit',
//                     fontSize: '14px',
//                     cursor: 'pointer',
//                     fontWeight: selectedPOSGroup === null ? 'bold' : 'normal',
//                     textAlign: 'left',
//                     transition: 'all 0.2s',
//                     width: '100%',
//                   }}
//                 >
//                   All POS Groups ({displayProducts.length})
//                 </button>
                

//                 {posGroups.map((group, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handlePOSGroupClick(group.posGroup)}
//                     style={{
//                       padding: '12px 16px',
//                       borderRadius: '8px',
//                       border: 'none',
//                       backgroundColor: selectedPOSGroup === group.posGroup ? BROWN_DARK : '#f5f0eb',
//                       color: selectedPOSGroup === group.posGroup ? '#fff' : BROWN_DARK,
//                       fontFamily: 'inherit',
//                       fontSize: '14px',
//                       cursor: 'pointer',
//                       fontWeight: selectedPOSGroup === group.posGroup ? 'bold' : 'normal',
//                       textAlign: 'left',
//                       transition: 'all 0.2s',
//                       width: '100%',
//                     }}
//                   >
//                     {group.posGroup} ({group.itemCount})
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div style={{ 
//               textAlign: 'center', 
//               padding: '40px 20px',
//               color: '#999',
//               fontSize: '14px'
//             }}>
//               No POS groups available for this category
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );

//   return (
//     <div style={{ 
//       fontFamily: "'Georgia', serif", 
//       background: "#f5f0eb", 
//       minHeight: "100vh",
//       paddingBottom: isMobile && selectedCount > 0 ? '80px' : '0',
//     }}>

// <header style={{
//   background: BROWN_DARK,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "10px 16px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
//   position: "sticky",
//   top: 0,
//   zIndex: 100,
// }}>

//   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//     <div style={{
//       width: 40, height: 40, borderRadius: "50%",
//       background: ACCENT,
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontWeight: "bold", color: BROWN_DARK, fontSize: 14, letterSpacing: 1,
//     }}>SMT</div>
    
//     <span style={{ color: "#fff", fontSize: 16, fontWeight: "600", letterSpacing: 1 }}>
//       SM Traders
//     </span>
//   </div>


//   <div style={{ 
//     display: "flex", 
//     alignItems: "center", 
//     gap: "16px",
//   }}>
   
//     {!isMobile && (
//       <div style={{ width: "250px" }}>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{
//             width: "100%",
//             padding: "8px 16px",
//             borderRadius: 25,
//             border: "none",
//             backgroundColor: "rgba(255,255,255,0.15)",
//             color: "#fff",
//             fontSize: 14,
//             outline: "none",
//             "::placeholder": {
//               color: "rgba(255,255,255,0.7)",
//             },
//           }}
//         />
//       </div>
//     )}


//     {isMobile && (
//       <div style={{ flex: 1, maxWidth: 200, margin: "0 8px" }}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{
//             width: "100%",
//             padding: "6px 10px",
//             borderRadius: 20,
//             border: "none",
//             backgroundColor: "rgba(255,255,255,0.15)",
//             color: "#fff",
//             fontSize: 13,
//             outline: "none",
//           }}
//         />
//       </div>
//     )}

    
//     <div 
//       onClick={handleCartClick}
//       style={{
//         width: 36, height: 36, borderRadius: "50%",
//         background: BROWN_LIGHT,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         cursor: "pointer", position: "relative",
//       }}
//     >
//       🛒
//       {selectedCount > 0 && (
//         <span style={{
//           position: "absolute", top: -4, right: -4,
//           background: "#e74c3c", color: "#fff",
//           borderRadius: "50%", width: 18, height: 18,
//           fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
//           fontWeight: "bold",
//         }}>{selectedCount}</span>
//       )}
//     </div>
//   </div>
// </header>

     
//       <div style={{
//         background: "#fff",
//         padding: "12px 16px",
//         borderBottom: "1px solid #ddd",
//         position: "sticky",
//         top: isMobile ? 60 : 64,
//         zIndex: 90,
//         boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//         overflowX: 'auto',
//         whiteSpace: 'nowrap',
//         WebkitOverflowScrolling: 'touch',
//         scrollbarWidth: 'none',
//         msOverflowStyle: 'none',
//       }}>
//         <style>
//           {`
//             div::-webkit-scrollbar {
//               display: none;
//             }
//           `}
//         </style>
//         {loadingProducts ? (
//           <div style={{ textAlign: "center", padding: "10px" }}>Loading categories...</div>
//         ) : (
//           <div style={{ display: "flex", gap: "8px" }}>
//             {stockGroups.map(group => (
//               <button
//                 key={group.id}
//                 onClick={() => handleStockGroupClick(group)}
//                 style={{
//                   padding: "8px 16px",
//                   borderRadius: "20px",
//                   border: `1.5px solid ${selectedStockGroup === group.id ? BROWN_DARK : "#ccc"}`,
//                   background: selectedStockGroup === group.id ? BROWN_DARK : "#fff",
//                   color: selectedStockGroup === group.id ? "#fff" : "#333",
//                   fontFamily: "inherit",
//                   fontSize: isMobile ? 13 : 14,
//                   cursor: "pointer",
//                   fontWeight: selectedStockGroup === group.id ? "bold" : "normal",
//                   transition: "all 0.2s",
//                   flexShrink: 0,
//                 }}
//               >
//                 {group.name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {!isMobile && showPOSGroups && (
//         <div style={{
//           background: "#f9f4ef",
//           padding: "15px 24px",
//           borderBottom: "1px solid #e8ddd4",
//         }}>
//           <div style={{ marginBottom: "10px", fontSize: "13px", color: BROWN, fontWeight: "600" }}>
//             FILTER BY POS GROUP:
//           </div>
          
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
   
//             <button
//               onClick={handleAllPOSGroupsClick}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: "20px",
//                 border: `2px solid ${selectedPOSGroup === null ? BROWN_DARK : ACCENT}`,
//                 background: selectedPOSGroup === null ? BROWN_DARK : "#fff",
//                 color: selectedPOSGroup === null ? "#fff" : BROWN_DARK,
//                 fontFamily: "inherit",
//                 fontSize: 13,
//                 cursor: "pointer",
//                 fontWeight: selectedPOSGroup === null ? "bold" : "normal",
//                 transition: "all 0.2s",
//               }}
//             >
//               All POS Groups ({displayProducts.length})
//             </button>
            
          
//             {posGroups.length > 0 ? (
//               posGroups.map((group, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handlePOSGroupClick(group.posGroup)}
//                   style={{
//                     padding: "8px 16px",
//                     borderRadius: "20px",
//                     border: `2px solid ${selectedPOSGroup === group.posGroup ? BROWN_DARK : ACCENT}`,
//                     background: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#fff",
//                     color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK,
//                     fontFamily: "inherit",
//                     fontSize: 13,
//                     cursor: "pointer",
//                     fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal",
//                     transition: "all 0.2s",
//                   }}
//                 >
//                   {group.posGroup} ({group.itemCount})
//                 </button>
//               ))
//             ) : (
//               <div style={{ color: "#666", fontStyle: "italic", padding: "8px" }}>
//                 No POS groups available
//               </div>
//             )}
//           </div>
//         </div>
//       )}

     
//       {isMobile && <MobileDrawer />}

    
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(360px, 1fr))",
//         gap: isMobile ? 16 : 20,
//         padding: isMobile ? "16px" : "20px 24px 40px",
//         maxWidth: 1400,
//         margin: "0 auto",
//         justifyContent: "center",
//       }}>
//         {loadingProducts ? (
//           <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>
//             Loading products...
//           </div>
//         ) : filtered.length > 0 ? (
//           filtered.map(product => {
//             const formatted = formatProduct(product);
//             const qty = quantities[formatted.id] || 0;
            
//             return (
//               <div key={formatted.id} style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center',
//                 width: '100%'
//               }}>
//                 <ProductCard
//                   product={formatted}
//                   quantity={qty}
//                   onUpdateQty={updateQty}
//                   isMobile={isMobile}
//                 />
//               </div>
//             );
//           })
//         ) : (
//           <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>
//             No products found
//           </div>
//         )}
//       </div>

     
//       {isMobile && (
//         <MobileOrderSummary
//           selectedCount={selectedCount}
//           totalAmount={totalAmount}
//           onGoToCart={handleCartClick}
//         />
//       )}

 
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }














import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CommonHeader from './CommonHeader';

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";

function QuantityControl({ quantity, onIncrease, onDecrease, outOfStock }) {
  if (outOfStock) {
    return (
      <div className="absolute bg-[#6b5454] h-[22px] left-[238px] rounded-[15px] top-[135px] w-[110px] opacity-50">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[28px] not-italic text-[10px] text-white top-[5px] whitespace-nowrap">
          Out of Stock
        </p>
      </div>
    );
  }

  return (
    <div className="absolute bg-[#6b5454] h-[22px] left-[238px] rounded-[15px] top-[135px] w-[110px] flex items-center justify-between px-2">
      <button 
        onClick={onDecrease}
        className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
        disabled={quantity === 0}
      >
        -
      </button>
      
      <span className="text-white text-xs font-medium">
        {quantity}
      </span>
      
      <button 
        onClick={onIncrease}
        className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}

function PriceTag({ price }) {
  return (
    <div className="absolute bg-[#6b5454] h-[25px] left-0 overflow-clip top-[132.95px] w-[115px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[normal] left-[14px] not-italic text-[22px] text-white top-[2.05px] w-[70px]">
        ₹{price}
      </p>
    </div>
  );
}

function CartIconComponent() {
  return (
    <div className="absolute bg-white border border-[#6b5454] border-solid left-[210px] overflow-clip rounded-[50px] size-[23px] top-[135px] cursor-pointer hover:bg-gray-100 transition-colors">
      <div className="absolute left-[5px] size-[11px] top-[5px] flex items-center justify-center">
        <ShoppingCartIcon 
          style={{ 
            fontSize: '11px', 
            color: '#6b5454'
          }} 
        />
      </div>
    </div>
  );
}

function ProductCard({ product, quantity, onUpdateQty, isMobile }) {
  const outOfStock = product.stock <= 0;

  const handleIncrease = () => onUpdateQty(product.id, 1);
  const handleDecrease = () => onUpdateQty(product.id, -1);

  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        background: '#fff',
        borderRadius: '12px',
        width: '100%',
        minHeight: '120px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e8ddd4',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}>
        
        <div style={{
          flex: 1,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
      
          <p style={{
            margin: 0,
            fontWeight: '600',
            fontSize: '14px',
            color: '#6b5454',
            lineHeight: 1.3,
          }}>
            {product.name}
          </p>
          
      
          {product.shortName && (
            <p style={{
              margin: '4px 0 0',
              fontSize: '11px',
              color: '#888',
              lineHeight: 1.2,
            }}>
              {product.shortName}
            </p>
          )}
          

          <p style={{
            margin: '8px 0 0',
            fontSize: '10px',
            color: outOfStock ? '#e74c3c' : '#555',
            fontWeight: outOfStock ? '600' : 'normal',
          }}>
            {outOfStock
              ? '⚠ Out of Stock'
              : `Stock: ${product.stock.toFixed(1)} Bags`}
            {!outOfStock && product.balQty > 0 && (
              <span style={{ color: '#999', marginLeft: '4px' }}>
                ({product.balQty} kg)
              </span>
            )}
          </p>
          
        
          <span style={{
            marginTop: '8px',
            fontSize: '16px',
            fontWeight: '700',
            color: '#3a1f0e',
          }}>
            ₹{product.price}
          </span>
        </div>

     
        <div style={{
          width: '120px',
          minWidth: '120px',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #f0e8e0',
          background: '#faf6f2',
        }}>
    
          <div style={{
            width: '100%',
            height: '80px',
            overflow: 'hidden',
            background: '#f5f0eb',
          }}>
            <img
              alt={product.name}
              src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=80&fit=crop"}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=80&fit=crop"; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>


          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
          }}>
            {outOfStock ? (
              <span style={{
                fontSize: '10px',
                color: '#fff',
                background: '#b0a0a0',
                borderRadius: '10px',
                padding: '4px 8px',
              }}>
                Out of Stock
              </span>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#6b5454',
                borderRadius: '20px',
                padding: '4px 8px',
                gap: '8px',
              }}>
                <button
                  onClick={handleDecrease}
                  disabled={quantity === 0}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: quantity === 0 ? 'not-allowed' : 'pointer',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    opacity: quantity === 0 ? 0.4 : 1,
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  -
                </button>
                <span style={{
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  minWidth: '20px',
                  textAlign: 'center',
                }}>
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card bg-white relative rounded-[15px] w-[360px] h-[170px] shadow-[0_2px_8px_rgba(0,0,0,0.09)] hover:shadow-[-10px_8px_5px_-2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-[3px]">
      <div className="overflow-clip relative rounded-[inherit] size-full" style={{ display: 'flex' }}>
    
        <div style={{ 
          flex: 1, 
          padding: '12px 0 12px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '70%'
        }}>
          <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[15px] whitespace-nowrap m-0">
            {product.shortName}
          </p>


          <p className="font-['Inter:Medium',sans-serif] font-normal leading-[normal] not-italic text-[#6b5454] text-[12px] whitespace-nowrap m-0">
            {product.name}
          </p>
          
          <div className="bg-[#6b5454] h-[25px] overflow-clip w-[85px] flex items-center justify-center rounded">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[20px] text-white">
              ₹{product.price}
            </p>
          </div>
          
        
          {outOfStock ? (
            <div className="bg-[#6b5454] h-[22px] rounded-[15px] w-[90px] opacity-50 flex items-center justify-center">
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-white">
                Out of Stock
              </p>
            </div>
          ) : (
            <div className="bg-[#6b5454] h-[22px] rounded-[15px] w-[90px] flex items-center justify-between px-2">
              <button 
                onClick={handleDecrease}
                className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
                disabled={quantity === 0}
              >
                -
              </button>
              
              <span className="text-white text-xs font-medium">
                {quantity}
              </span>
              
              <button 
                onClick={handleIncrease}
                className="text-white font-bold text-sm hover:bg-[#7b6464] w-5 h-5 rounded-full flex items-center justify-center"
              >
                +
              </button>
            </div>
          )}
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap m-0 ${
            outOfStock ? 'text-red-500' : 'text-[#403f3d]'
          }`}>
            Stock: {outOfStock ? 'Out of Stock' : `${product.stock.toFixed(1)} Bags`}
            {!outOfStock && product.balQty > 0 && (
              <span className="text-[#666] ml-1 text-[8px]">
                ({product.balQty} kg)
              </span>
            )}
          </p>
        </div>

   
        <div style={{
          width: '120px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderTopRightRadius: '15px',
          borderBottomRightRadius: '15px',
        }}>
          <img 
            alt={product.name}
            className="w-full h-full object-cover"
            src={product.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=170&fit=crop"}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=170&fit=crop";
            }}
          />
          
     
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
          }}>
            <div className="bg-white border border-[#6b5454] border-solid rounded-[50px] size-[23px] cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center">
              <ShoppingCartIcon 
                style={{ 
                  fontSize: '11px', 
                  color: '#6b5454'
                }} 
              />
            </div>
            {quantity > 0 && (
              <span className="absolute bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ top: '-4px', right: '-4px' }}>
                {quantity}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div aria-hidden="true" className="absolute border border-[#6b5454] border-solid inset-[-1px] pointer-events-none rounded-[16px] shadow-[-10px_8px_5px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function MobileOrderSummary({ selectedCount, totalAmount, onGoToCart }) {
  if (selectedCount === 0) return null;

  return (
    <div className="cart-summary" style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: 'white',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      padding: '12px 16px',
      zIndex: 1000,
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      borderTop: `2px solid ${BROWN_DARK}`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
        
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: BROWN_DARK }}>
            {/* Total: ₹{totalAmount.toFixed(2)} */}
          </div>
        </div>

        <button
          onClick={onGoToCart}
          className="cart-summary-button"
          style={{
            backgroundColor: BROWN_DARK,
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = BROWN_LIGHT}
          onMouseLeave={(e) => e.target.style.backgroundColor = BROWN_DARK}
        >
          <ShoppingCartIcon style={{ fontSize: '18px' }} />
          Go to Cart
          {selectedCount > 0 && (
            <span style={{
              backgroundColor: '#e74c3c',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '4px',
            }}>
              {selectedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function SMTraders() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [stockGroups, setStockGroups] = useState([]);
  const [posGroups, setPosGroups] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [selectedStockGroup, setSelectedStockGroup] = useState("All");
  const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
  const [showPOSGroups, setShowPOSGroups] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // New state for login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Check login status on component mount
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
        
        // Parse user data to get the name
        const userData = JSON.parse(user);
        const name = userData?.Full_Name || userData?.name || userData?.username || userData?.User_Name || "User";
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setQuantities(parsedCart);
        }
      } catch (error) {
        console.error("❌ Error parsing cart from localStorage:", error);
      }
    };

    loadCartFromStorage();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCartFromStorage();
      }
    };

    const handleFocus = () => {
      loadCartFromStorage();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        loadCartFromStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 

  useEffect(() => {
    if (initialLoadDone) {
      localStorage.setItem('cartItems', JSON.stringify(quantities));
    }
  }, [quantities, initialLoadDone]);

  const deduplicateProducts = (products) => {
    const uniqueProducts = new Map();
    
    products.forEach(product => {
      const uniqueKey = product.Product_Id;
      
      if (!uniqueProducts.has(uniqueKey)) {
        uniqueProducts.set(uniqueKey, product);
      }
    });
    
    return Array.from(uniqueProducts.values());
  };

  const mergeProductData = (productList, stockResponse) => {
    if (!productList || !productList.length) {
      return [];
    }
    
    let stockData = [];
    if (stockResponse?.success && stockResponse.data && stockResponse.data.Pos_Product) {
      const posProduct = stockResponse.data.Pos_Product;
      if (Array.isArray(posProduct)) {
        stockData = posProduct[0]?.Product_Entry || [];
      } else {
        stockData = posProduct.Product_Entry || [];
      }
    }
    
    const stockMap = new Map();
    if (stockData.length) {
      stockData.forEach(item => {
        const productId = String(item.Product_Id).trim();
        stockMap.set(productId, item);
      });
    }

    const merged = productList.map(product => {
      const productId = String(product.Product_Id).trim();
      const stockItem = stockMap.get(productId);
      
      if (stockItem) {
        return {
          ...product,
          Bal_Qty: stockItem.Bal_Qty || 0,
          Price: stockItem.Price || product.Product_Rate || 0,
          _hasStock: true
        };
      } else {
        return {
          ...product,
          Bal_Qty: 0,
          Price: product.Product_Rate || 0,
          _hasStock: false
        };
      }
    });

    return merged;
  };

  const fetchAllData = async () => {
    setLoadingProducts(true);
    try {
      const [posResponse, stockResponse] = await Promise.all([
        fetchLink({ address: `pos/posProductList` }),
        fetchLink({ address: `pos/productMaster` })
      ]);

      let productList = [];
      
      if (posResponse?.success && posResponse.data) {
        productList = posResponse.data;
      }

      const mergedProducts = mergeProductData(productList, stockResponse);
      const uniqueProducts = deduplicateProducts(mergedProducts);
      
      const activeProducts = uniqueProducts.filter(product => 
        product.isActive === 1 || product.IsActive === 1 || product.Is_Active === 1
      );
      
      setAllProducts(activeProducts);
      setDisplayProducts(activeProducts);
      
      const formattedProducts = activeProducts.map(formatProduct);
      localStorage.setItem('products', JSON.stringify(formattedProducts));
      
      setInitialLoadDone(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const uniqueGroups = [...new Set(allProducts.map(p => p.Stock_Group))]
        .filter(group => group && group.trim() !== "" && group !== "NOT FOUND" && group !== "NULL")
        .sort();
      
      const formattedGroups = uniqueGroups.map(group => ({
        id: group,
        name: group,
      }));
      
      setStockGroups([{ id: 'All', name: 'All' }, ...formattedGroups]);
    }
  }, [allProducts]);

  const handleStockGroupClick = (group) => {
    setSelectedPOSGroup(null);
    setSelectedStockGroup(group.id);
    
    if (group.id === 'All') {
      setDisplayProducts(allProducts);
      setShowPOSGroups(false);
      setPosGroups([]);
    } else {
      const filteredByStock = allProducts.filter(p => {
        const productGroup = (p.Stock_Group || "").trim();
        const selectedGroup = group.id.trim();
        return productGroup === selectedGroup;
      });
      
      setDisplayProducts(filteredByStock);
      
      const posGroupsList = extractPOSGroups(filteredByStock);
      setPosGroups(posGroupsList);
      setShowPOSGroups(true);
      
      if (isMobile && posGroupsList.length > 0) {
        setIsDrawerOpen(true);
      }
    }
  };

  const handlePOSGroupClick = (posGroup) => {
    setSelectedPOSGroup(posGroup);
    
    const filtered = allProducts.filter(p => {
      const stockMatch = (p.Stock_Group || "").trim() === selectedStockGroup.trim();
      const posMatch = (p.POS_Group || "").trim() === posGroup.trim();
      return stockMatch && posMatch;
    });
    
    setDisplayProducts(filtered);
    
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleAllPOSGroupsClick = () => {
    setSelectedPOSGroup(null);
    
    const filteredByStock = allProducts.filter(p => 
      (p.Stock_Group || "").trim() === selectedStockGroup.trim()
    );
    
    setDisplayProducts(filteredByStock);
    
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const extractPOSGroups = (productsList) => {
    const uniqueGroups = [...new Set(productsList.map(p => (p.POS_Group || "").trim()))]
      .filter(group => group && group !== "" && group !== "NULL");
    
    const groups = uniqueGroups
      .map(group => ({
        posGroup: group,
        itemCount: productsList.filter(p => (p.POS_Group || "").trim() === group).length
      }))
      .sort((a, b) => a.posGroup.localeCompare(b.posGroup));
    
    return groups;
  };

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      
      let newQuantities;
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        newQuantities = rest;
      } else {
        newQuantities = { ...prev, [id]: next };
      }
      
      return newQuantities;
    });
  };

  const selectedCount = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const totalAmount = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const product = allProducts.find(p => String(p.Product_Id) === id);
    if (product) {
      const price = parseFloat(product.Price) || parseFloat(product.Product_Rate) || 0;
      return sum + (price * qty);
    }
    return sum;
  }, 0);

  const filtered = displayProducts.filter(p => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      (p.Product_Name && p.Product_Name.toLowerCase().includes(searchLower)) ||
      (p.Short_Name && p.Short_Name.toLowerCase().includes(searchLower)) ||
      (p.POS_Group && p.POS_Group.toLowerCase().includes(searchLower)) ||
      (p.Stock_Group && p.Stock_Group.toLowerCase().includes(searchLower))
    );
  });

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
      weight: product.Bag || product.PackGet ? `${product.PackGet || ''}kg` : "N/A",
      stockGroup: product.Stock_Group || "General",
      posGroup: product.POS_Group || "General",
      price: price,
      stock: stockInBags,
      unit: product.Units || "Bags",
      image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=140&h=116&fit=crop",
      coolie: product.Coolie,
      brokerage: product.NagalBrokerage || product.Brokerage,
      packGet: product.PackGet,
      hsnCode: product.HSN_Code,
      balQty: balQty,
      originalProduct: product
    };
  };

  const formattedProducts = allProducts.map(formatProduct);

  const handleCartClick = () => {
    localStorage.setItem('cartItems', JSON.stringify(quantities));
    localStorage.setItem('products', JSON.stringify(formattedProducts));
    navigate('/cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('loginAt');
    setIsLoggedIn(false);
    setUserName("");
    toast.success("Logged out successfully");
    navigate('/', { replace: true });
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on search input when opened
      setTimeout(() => {
        const searchInput = document.getElementById('category-search');
        if (searchInput) searchInput.focus();
      }, 300); // Increased timeout to match animation duration
    } else {
      setSearch(""); // Clear search when closing
    }
  };

  const MobileDrawer = () => (
    <>
      {isDrawerOpen && (
        <div
          className="drawer-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div
        className="mobile-drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '320px',
          backgroundColor: '#fff',
          zIndex: 1000,
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <div
          className="drawer-header"
          style={{
            padding: '20px 16px',
            backgroundColor: BROWN_DARK,
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilterListIcon style={{ fontSize: '20px' }} />
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {selectedStockGroup} - POS Groups
            </span>
          </div>
          <CloseIcon 
            style={{ cursor: 'pointer', fontSize: '20px' }}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div style={{ padding: '16px' }}>
          {showPOSGroups && posGroups.length > 0 ? (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleAllPOSGroupsClick}
                  className="drawer-item"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: selectedPOSGroup === null ? BROWN_DARK : '#f5f0eb',
                    color: selectedPOSGroup === null ? '#fff' : BROWN_DARK,
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: selectedPOSGroup === null ? 'bold' : 'normal',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    width: '100%',
                  }}
                >
                  All POS Groups ({displayProducts.length})
                </button>

                {posGroups.map((group, index) => (
                  <button
                    key={index}
                    onClick={() => handlePOSGroupClick(group.posGroup)}
                    className="drawer-item"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedPOSGroup === group.posGroup ? BROWN_DARK : '#f5f0eb',
                      color: selectedPOSGroup === group.posGroup ? '#fff' : BROWN_DARK,
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: selectedPOSGroup === group.posGroup ? 'bold' : 'normal',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                  >
                    {group.posGroup} ({group.itemCount})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#999',
              fontSize: '14px'
            }}>
              No POS groups available for this category
            </div>
          )}
        </div>
      </div>
    </>
  );

  const mediaQueryStyles = `
    /* Base responsive styles */
    @media screen and (max-width: 768px) {
      .header-title {
        font-size: 14px !important;
      }
      
      .category-filters {
        padding: 8px 12px !important;
      }
      
      .products-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        padding: 12px !important;
      }
      
      .product-card {
        width: 100% !important;
        height: auto !important;
        min-height: 140px !important;
      }
      
      .search-input {
        font-size: 13px !important;
        padding: 6px 12px !important;
      }
      
      .cart-button {
        width: 32px !important;
        height: 32px !important;
      }
      
      .pos-groups-container {
        padding: 10px 16px !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      
      .pos-group-button {
        padding: 6px 12px !important;
        font-size: 12px !important;
        white-space: nowrap !important;
      }
    }

    /* Small phones */
    @media screen and (max-width: 480px) {
      .header-container {
        padding: 8px 12px !important;
      }
      
      .header-logo {
        width: 32px !important;
        height: 32px !important;
        font-size: 12px !important;
      }
      
      .header-title {
        font-size: 13px !important;
      }
      
      .search-input-mobile {
        max-width: 150px !important;
        font-size: 12px !important;
      }
      
      .product-card {
        min-height: 120px !important;
      }
      
      .product-name {
        font-size: 13px !important;
      }
      
      .product-shortname {
        font-size: 10px !important;
      }
      
      .product-price {
        font-size: 14px !important;
      }
      
      .quantity-control {
        padding: 2px 6px !important;
        gap: 4px !important;
      }
      
      .quantity-button {
        width: 20px !important;
        height: 20px !important;
        font-size: 14px !important;
      }
      
      .quantity-value {
        font-size: 12px !important;
        min-width: 16px !important;
      }
      
      .mobile-drawer {
        width: 85% !important;
        max-width: 280px !important;
      }
      
      .drawer-header {
        padding: 16px !important;
      }
      
      .drawer-item {
        padding: 10px 14px !important;
        font-size: 13px !important;
      }
      
      .cart-summary {
        padding: 10px 16px !important;
      }
      
      .cart-summary-button {
        padding: 10px 20px !important;
        font-size: 14px !important;
      }
    }

    /* Landscape mode on phones */
    @media screen and (max-width: 768px) and (orientation: landscape) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      
      .mobile-drawer {
        width: 70% !important;
        max-width: 300px !important;
      }
    }

    /* Tablets */
    @media screen and (min-width: 769px) and (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
        padding: 16px 20px !important;
      }
      
      .product-card {
        width: 100% !important;
        max-width: 400px !important;
      }
      
      .category-filters {
        padding: 10px 20px !important;
      }
      
      .category-button {
        padding: 6px 14px !important;
        font-size: 13px !important;
      }
    }

    /* Large tablets and small desktops */
    @media screen and (min-width: 1025px) and (max-width: 1280px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }

    /* High-resolution screens */
    @media screen and (min-width: 1600px) {
      .products-grid {
        max-width: 1600px !important;
        margin: 0 auto !important;
      }
    }

    /* Print styles */
    @media print {
      .header,
      .category-filters,
      .pos-groups-container,
      .cart-summary,
      .mobile-drawer {
        display: none !important;
      }
      
      .products-grid {
        display: block !important;
      }
      
      .product-card {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        border: 1px solid #ccc !important;
        margin-bottom: 20px !important;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      /* Add dark mode styles if needed */
    }

    /* Accessibility - Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      .category-button,
      .pos-group-button,
      .quantity-button,
      .cart-button {
        min-height: 44px !important;
        min-width: 44px !important;
      }
      
      .product-card {
        cursor: default !important;
      }
    }

    /* Notched devices (iPhone X and newer) */
    @supports (padding: max(0px)) {
      .header {
        padding-left: max(16px, env(safe-area-inset-left)) !important;
        padding-right: max(16px, env(safe-area-inset-right)) !important;
      }
      
      .cart-summary {
        padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
      }
    }

    /* Loading states */
    @media screen and (max-width: 768px) {
      .loading-skeleton {
        height: 120px !important;
      }
    }

    /* Empty states */
    @media screen and (max-width: 768px) {
      .empty-state {
        padding: 40px 20px !important;
        font-size: 14px !important;
      }
    }

    /* Search animation styles */
    .search-container {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      transition: width 0.3s ease-in-out;
    }

    .search-input {
      width: 100%;
      padding: 8px 16px;
      border: 1px solid ${BROWN_LIGHT};
      border-radius: 25px;
      font-size: 14px;
      outline: none;
      background-color: #fff;
      color: #333;
      transition: opacity 0.2s ease-in-out;
    }

    .search-input:focus {
      border-color: ${BROWN_DARK};
      box-shadow: 0 0 0 2px rgba(74, 44, 26, 0.1);
    }

    /* Animations */
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-100%);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;

  return (
    <div style={{ 
      fontFamily: "'Georgia', serif", 
      background: "#f5f0eb", 
      minHeight: "100vh",
      paddingBottom: isMobile && selectedCount > 0 ? '80px' : '0',
    }}>
      <style>{mediaQueryStyles}</style>

      {/* CommonHeader with no search */}
      <CommonHeader
        title="SM Traders"
        logo="SMT"
        showCart={true}
        showBackButton={false}
        showTitle={true}
        cartItemCount={selectedCount}
        onCartClick={handleCartClick}
        customActions={null}
        isMobile={isMobile}
        backgroundColor={BROWN_DARK}
        // showLogout={isLoggedIn}
        userName={userName}
        // onLogout={handleLogout}
      />

      <div className="category-filters" style={{
        background: "#fff",
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: isMobile ? 60 : 64,
        zIndex: 90,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Categories with search icon */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            minWidth: isMobile ? '100%' : 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '4px',
              background: selectedStockGroup === 'All' ? BROWN_DARK : 'transparent',
              padding: '4px 8px',
              borderRadius: '20px',
            }}>
              <button
                onClick={() => handleStockGroupClick({ id: 'All', name: 'All' })}
                className="category-button"
                style={{
                  padding: "8px 12px",
                  borderRadius: "20px",
                  border: 'none',
                  background: selectedStockGroup === 'All' ? BROWN_DARK : "transparent",
                  color: selectedStockGroup === 'All' ? "#fff" : "#333",
                  fontFamily: "inherit",
                  fontSize: isMobile ? 13 : 14,
                  cursor: "pointer",
                  fontWeight: selectedStockGroup === 'All' ? "bold" : "normal",
                  transition: "all 0.2s",
                }}
              >
                All
              </button>
              
              {/* Search Icon - Always visible */}
              <button
                onClick={toggleSearch}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedStockGroup === 'All' ? '#fff' : BROWN_DARK,
                  borderRadius: '50%',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <SearchIcon style={{ fontSize: '18px' }} />
              </button>
            </div>

            {/* Search Input - Improved animation */}
            <div className="search-container" style={{
              overflow: 'hidden',
              transition: 'width 0.3s ease-in-out',
              width: isSearchOpen ? (isMobile ? '180px' : '250px') : '0px',
            }}>
              <input
                id="category-search"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                style={{
                  width: '100%',
                  opacity: isSearchOpen ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                  transitionDelay: isSearchOpen ? '0.1s' : '0s',
                }}
              />
            </div>

            {/* Other category buttons */}
            {!loadingProducts && stockGroups.filter(g => g.id !== 'All').map(group => (
              <button
                key={group.id}
                onClick={() => handleStockGroupClick(group)}
                className="category-button"
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: `1.5px solid ${selectedStockGroup === group.id ? BROWN_DARK : "#ccc"}`,
                  background: selectedStockGroup === group.id ? BROWN_DARK : "#fff",
                  color: selectedStockGroup === group.id ? "#fff" : "#333",
                  fontFamily: "inherit",
                  fontSize: isMobile ? 13 : 14,
                  cursor: "pointer",
                  fontWeight: selectedStockGroup === group.id ? "bold" : "normal",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {group.name}
              </button>
            ))}
          </div>

          {loadingProducts && (
            <div style={{ textAlign: "center", padding: "10px", width: '100%' }}>
              Loading categories...
            </div>
          )}
        </div>
      </div>

      {!isMobile && showPOSGroups && (
        <div className="pos-groups-container" style={{
          background: "#f9f4ef",
          padding: "15px 24px",
          borderBottom: "1px solid #e8ddd4",
        }}>
          <div style={{ marginBottom: "10px", fontSize: "13px", color: BROWN, fontWeight: "600" }}>
            FILTER BY POS GROUP:
          </div>
          
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleAllPOSGroupsClick}
              className="pos-group-button"
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: `2px solid ${selectedPOSGroup === null ? BROWN_DARK : ACCENT}`,
                background: selectedPOSGroup === null ? BROWN_DARK : "#fff",
                color: selectedPOSGroup === null ? "#fff" : BROWN_DARK,
                fontFamily: "inherit",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: selectedPOSGroup === null ? "bold" : "normal",
                transition: "all 0.2s",
              }}
            >
              All POS Groups ({displayProducts.length})
            </button>
            
            {posGroups.length > 0 ? (
              posGroups.map((group, index) => (
                <button
                  key={index}
                  onClick={() => handlePOSGroupClick(group.posGroup)}
                  className="pos-group-button"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: `2px solid ${selectedPOSGroup === group.posGroup ? BROWN_DARK : ACCENT}`,
                    background: selectedPOSGroup === group.posGroup ? BROWN_DARK : "#fff",
                    color: selectedPOSGroup === group.posGroup ? "#fff" : BROWN_DARK,
                    fontFamily: "inherit",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: selectedPOSGroup === group.posGroup ? "bold" : "normal",
                    transition: "all 0.2s",
                  }}
                >
                  {group.posGroup} ({group.itemCount})
                </button>
              ))
            ) : (
              <div style={{ color: "#666", fontStyle: "italic", padding: "8px" }}>
                No POS groups available
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && <MobileDrawer />}

      <div className="products-grid" style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(360px, 1fr))",
        gap: isMobile ? 16 : 20,
        padding: isMobile ? "16px" : "20px 24px 40px",
        maxWidth: 1400,
        margin: "0 auto",
        justifyContent: "center",
      }}>
        {loadingProducts ? (
          <div className="loading-skeleton" style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>
            Loading products...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(product => {
            const formatted = formatProduct(product);
            const qty = quantities[formatted.id] || 0;
            
            return (
              <div key={formatted.id} style={{ 
                display: 'flex', 
                justifyContent: 'center',
                width: '100%'
              }}>
                <ProductCard
                  product={formatted}
                  quantity={qty}
                  onUpdateQty={updateQty}
                  isMobile={isMobile}
                />
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>
            No products found
          </div>
        )}
      </div>

      {isMobile && (
        <MobileOrderSummary
          selectedCount={selectedCount}
          totalAmount={totalAmount}
          onGoToCart={handleCartClick}
        />  
      )}
    </div>
  );
}