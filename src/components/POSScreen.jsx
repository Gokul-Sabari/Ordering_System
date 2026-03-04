import React, { useState, useEffect } from "react";
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';

const BROWN = "#4a2c1a";
const BROWN_DARK = "#3a1f0e";
const BROWN_LIGHT = "#6b3f23";
const ACCENT = "#c8a96e";

export default function SMTraders() {
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  
  // API Data States
  const [allProducts, setAllProducts] = useState([]);
  const [stockGroups, setStockGroups] = useState([]);
  const [posGroups, setPosGroups] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Selection States
  const [selectedStockGroup, setSelectedStockGroup] = useState("All Categories");
  const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
  
  // UI States
  const [showPOSGroups, setShowPOSGroups] = useState(false);
  
  // Loading States
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Extract unique stock groups from products (from Stock_Group field)
  useEffect(() => {
    if (allProducts.length > 0) {
      // Extract unique stock groups from Stock_Group field
      const groups = [...new Set(allProducts.map(p => p.Stock_Group || "General"))]
        .filter(group => group && group.trim() !== "" && group !== "NOT FOUND" && group !== "NULL")
        .sort();
      
      const formattedGroups = groups.map(group => ({
        id: group,
        name: group,
        originalName: group
      }));
      
      setStockGroups([{ id: 'All Categories', name: 'All Categories' }, ...formattedGroups]);
    }
  }, [allProducts]);

  // Handle Stock Group selection
  const handleStockGroupClick = (group) => {
    // Reset POS group when stock group changes
    setSelectedPOSGroup(null);
    setSelectedStockGroup(group.id);
    
    if (group.id === 'All Categories') {
      // Show all products
      setProducts(allProducts);
      setShowPOSGroups(false);
      setPosGroups([]);
    } else {
      // Filter products by selected stock group ONLY
      const filteredByStock = allProducts.filter(p => p.Stock_Group === group.id);
      setProducts(filteredByStock);
      
      // Extract unique POS groups from filtered products
      const posGroupsList = extractPOSGroups(filteredByStock);
      setPosGroups(posGroupsList);
      setShowPOSGroups(true);
    }
  };

  // Handle POS Group selection
  const handlePOSGroupClick = (posGroup) => {
    setSelectedPOSGroup(posGroup);
    
    // Filter products by BOTH stock group AND POS group
    const filtered = allProducts.filter(p => {
      // Must match both conditions
      const stockMatch = p.Stock_Group === selectedStockGroup;
      const posMatch = p.POS_Group === posGroup;
      return stockMatch && posMatch;
    });
    
    console.log(`Filtering for Stock Group: ${selectedStockGroup}, POS Group: ${posGroup}, Found: ${filtered.length} products`);
    setProducts(filtered);
  };

  // Handle "All POS Groups" click
  const handleAllPOSGroupsClick = () => {
    setSelectedPOSGroup(null);
    
    // Show all products for this stock group
    const filteredByStock = allProducts.filter(p => p.Stock_Group === selectedStockGroup);
    setProducts(filteredByStock);
  };

  // Extract unique POS groups from products
  const extractPOSGroups = (productsList) => {
    // Get unique POS groups, filtering out empty/null values
    const uniqueGroups = [...new Set(productsList.map(p => p.POS_Group))]
      .filter(group => group && group.trim() !== "" && group !== "NULL");
    
    const groups = uniqueGroups
      .map(group => ({
        posGroup: group,
        itemCount: productsList.filter(p => p.POS_Group === group).length
      }))
      .sort((a, b) => a.posGroup.localeCompare(b.posGroup));
    
    return groups;
  };

  // API: Fetch all products
  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetchLink({
        address: `pos/posProductList`
      });
      
      if (response?.success && response.data) {
        setAllProducts(response.data);
        setProducts(response.data); // Initially show all products
      } else {
        console.warn("No products found");
        toast.warning("No products found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedCount = Object.values(quantities).filter(q => q > 0).length;

  // Filter products based on search (within already filtered products)
  const filtered = products.filter(p => {
    const searchLower = search.toLowerCase();
    return (
      p.Product_Name?.toLowerCase().includes(searchLower) ||
      p.Short_Name?.toLowerCase().includes(searchLower) ||
      p.POS_Group?.toLowerCase().includes(searchLower) ||
      p.Stock_Group?.toLowerCase().includes(searchLower)
    );
  });

  // Format product for display
  const formatProduct = (product) => ({
    id: product.Product_Id || product.Auto_Id,
    name: product.Product_Name || product.Stock_Item,
    shortName: product.Short_Name,
    weight: product.PackGet ? `${product.PackGet}kg` : product.Bag || "N/A",
    stockGroup: product.Stock_Group || "General",
    posGroup: product.POS_Group || "General",
    price: parseFloat(product.Item_Rate) || parseFloat(product.Product_Rate) || 0,
    stock: 10, // You might want to add stock quantity from another API
    unit: product.Units || "Bags",
    image: product.productImageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=160&fit=crop",
    coolie: product.Coolie,
    brokerage: product.NagalBrokerage || product.Brokerage,
    packGet: product.PackGet,
    hsnCode: product.HSN_Code
  });

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0eb", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: BROWN_DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: ACCENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", color: BROWN_DARK, fontSize: 14, letterSpacing: 1,
          }}>SMT</div>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: "600", letterSpacing: 1 }}>SM Traders</span>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", flex: "0 0 280px" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: "100%", padding: "8px 38px 8px 14px", borderRadius: 6,
              border: "none", fontSize: 14, outline: "none",
            }}
          />
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#888" }}>🔍</span>
        </div>

        {/* Cart icon */}
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: BROWN_LIGHT,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}>
          🛒
          {selectedCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              background: "#e74c3c", color: "#fff",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "bold",
            }}>{selectedCount}</span>
          )}
        </div>
      </header>

      {/* Stock Group Bar - First level filter */}
      <div style={{
        background: "#fff",
        padding: "10px 24px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 64,
        zIndex: 90,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}>
        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "10px" }}>Loading stock groups...</div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {stockGroups.map(group => (
              <button
                key={group.id}
                onClick={() => handleStockGroupClick(group)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 5,
                  border: `1.5px solid ${selectedStockGroup === group.id ? BROWN_DARK : "#ccc"}`,
                  background: selectedStockGroup === group.id ? BROWN_DARK : "#fff",
                  color: selectedStockGroup === group.id ? "#fff" : "#333",
                  fontFamily: "inherit",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: selectedStockGroup === group.id ? "bold" : "normal",
                  transition: "all 0.2s",
                }}
                title={group.originalName}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* POS Groups Section - Shows when a stock group is selected (not All Categories) */}
      {showPOSGroups && (
        <div style={{
          background: "#f9f4ef",
          padding: "15px 24px",
          borderBottom: "1px solid #e8ddd4",
        }}>
          <div style={{ marginBottom: "10px", fontSize: "13px", color: BROWN, fontWeight: "600" }}>
            FILTER BY POS GROUP:
          </div>
          
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* "All POS Groups" option */}
            <button
              onClick={handleAllPOSGroupsClick}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
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
              All POS Groups ({allProducts.filter(p => p.Stock_Group === selectedStockGroup).length})
            </button>
            
            {/* Individual POS Groups */}
            {posGroups.length > 0 ? (
              posGroups.map((group, index) => (
                <button
                  key={index}
                  onClick={() => handlePOSGroupClick(group.posGroup)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
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
                No POS groups available for this stock group
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Filters Indicator */}
      <div style={{
        background: ACCENT,
        padding: "8px 24px",
        color: BROWN_DARK,
        fontWeight: "bold",
        fontSize: 14,
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
      }}>
        <span>Stock Group: {selectedStockGroup}</span>
        {selectedPOSGroup && <span>| POS Group: {selectedPOSGroup}</span>}
        <span>| Products: {filtered.length}</span>
        {search && <span>| Search: "{search}"</span>}
      </div>

      {/* Product Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
        padding: "20px 24px 40px",
        maxWidth: 1400,
        margin: "0 auto",
      }}>
        {loadingProducts ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999" }}>
            Loading products...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(product => {
            const formatted = formatProduct(product);
            const qty = quantities[formatted.id] || 0;
            const outOfStock = formatted.stock === 0;
            
            return (
              <div key={formatted.id} style={{
                background: "#fff",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                border: "1px solid #e8ddd4",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                flexDirection: "column",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(74,44,26,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.09)"; }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#f9f4ef" }}>
                  <img
                    src={formatted.image}
                    alt={formatted.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { 
                      e.target.src = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=160&fit=crop";
                    }}
                  />
                  {outOfStock && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                      background: "rgba(0,0,0,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{
                        background: "#e74c3c", color: "#fff",
                        padding: "4px 12px", borderRadius: 4,
                        fontSize: 12, fontWeight: "bold", letterSpacing: 0.5,
                      }}>Out Of Stock</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "12px 12px 8px" }}>
                  <div style={{ fontWeight: "700", fontSize: 14, color: "#2c1a0e", marginBottom: 2 }}>
                    {formatted.name}
                  </div>
                  {formatted.shortName && (
                    <div style={{ fontSize: 12, color: BROWN, marginBottom: 4 }}>
                      {formatted.shortName}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
                    {formatted.weight} • {formatted.posGroup}
                  </div>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                    Stock Group: {formatted.stockGroup}
                  </div>
                  <div style={{ fontSize: 11, color: outOfStock ? "#e74c3c" : "#666" }}>
                    {outOfStock ? "Out Of Stock" : `HSN: ${formatted.hsnCode || 'N/A'}`}
                  </div>
                  {formatted.coolie > 0 && (
                    <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
                      Coolie: ₹{formatted.coolie}
                    </div>
                  )}
                </div>

                {/* Price + Qty */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px 12px",
                  marginTop: "auto",
                }}>
                  <div style={{
                    background: BROWN_DARK,
                    color: "#fff",
                    borderRadius: 5,
                    padding: "5px 12px",
                    fontWeight: "bold",
                    fontSize: 14,
                    letterSpacing: 0.5,
                  }}>₹{formatted.price}</div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    border: `1.5px solid ${outOfStock ? "#ddd" : BROWN_DARK}`,
                    borderRadius: 5,
                    overflow: "hidden",
                  }}>
                    <button
                      onClick={() => !outOfStock && updateQty(formatted.id, -1)}
                      disabled={outOfStock || qty === 0}
                      style={{
                        width: 28, height: 28,
                        background: outOfStock ? "#f0f0f0" : "#f5ede4",
                        border: "none",
                        cursor: outOfStock ? "not-allowed" : "pointer",
                        fontSize: 16, fontWeight: "bold",
                        color: outOfStock ? "#ccc" : BROWN_DARK,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>−</button>
                    <span style={{
                      width: 28, textAlign: "center",
                      fontSize: 13, fontWeight: "600",
                      color: outOfStock ? "#ccc" : "#333",
                    }}>{qty}</span>
                    <button
                      onClick={() => !outOfStock && updateQty(formatted.id, 1)}
                      disabled={outOfStock}
                      style={{
                        width: 28, height: 28,
                        background: outOfStock ? "#f0f0f0" : "#f5ede4",
                        border: "none",
                        cursor: outOfStock ? "not-allowed" : "pointer",
                        fontSize: 16, fontWeight: "bold",
                        color: outOfStock ? "#ccc" : BROWN_DARK,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>+</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>
            {selectedPOSGroup ? "No products found for this POS group" : 
             selectedStockGroup !== "All Categories" ? "No products found for this stock group" : 
             "No products found"}
          </div>
        )}
      </div>
    </div>
  );
}