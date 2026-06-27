// EditOrderHandler.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchLink } from './fetchComponent';

export const useEditOrderHandler = (
  setQuantities,           // For SMTraders: setQuantities for cart
  setSelectedCustomer,     // For SMTraders: setSelectedCustomer
  navigate
) => {
  
  const getProductPackGet = (productName) => {
    if (productName) {
      const packMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
      if (packMatch) {
        return parseFloat(packMatch[1]);
      }
    }
    return 1;
  };

  const fetchCompleteCustomerDetails = async (retailerId) => {
    try {
      const response = await fetchLink({ 
        address: `pos/retailerMasterOpt?limit=10000000&page=1` 
      });
      
      if (response?.success && Array.isArray(response.data)) {
        const found = response.data.find(
          c => String(c.Customer_Id) === String(retailerId)
        );
        
        if (found) {
          return {
            id: found.Customer_Id,
            name: (found.Short_Name || found.Billl_Name || "").replace(/\u0004/g, "").trim(),
            mobile: (found.Mobile_No || "").trim(),
            address: (found.Address || "").trim(),
            city: (found.City || "").trim(),
            brokerId: found.Broker_Id ? String(found.Broker_Id).trim() : "",
            brokerName: (found.Broker_Name || found.Broker || "").trim(),
            transporterId: found.Transporter_Id ? String(found.Transporter_Id).trim() : "",
            transporterName: (found.Transporter_Name || found.Transporter || "").trim(),
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching customer details:", error);
      return null;
    }
  };

  const loadEditOrder = async () => {
    const isEditing = localStorage.getItem('isEditingOrder');
    const editData = localStorage.getItem('editOrderData');
    const savedCustomer = localStorage.getItem('selectedCustomer');
    
    if (isEditing === 'true' && editData) {
      try {
        const parsed = JSON.parse(editData);
        
        // Restore cart items
        if (parsed.cartItems && Object.keys(parsed.cartItems).length > 0) {
          setQuantities(parsed.cartItems);
          localStorage.setItem('cartItems', JSON.stringify(parsed.cartItems));
        }
        
        // Restore customer
        let customerToSet = null;
        if (parsed.customerDetails) {
          customerToSet = parsed.customerDetails;
        } else if (parsed.customerId) {
          // Fetch complete customer details if missing
          const details = await fetchCompleteCustomerDetails(parsed.customerId);
          if (details) {
            customerToSet = {
              ...details,
              brokerName: parsed.brokerName || details.brokerName,
              transporterName: parsed.transporterName || details.transporterName,
            };
          } else {
            customerToSet = {
              id: parsed.customerId,
              name: parsed.customerName || "",
              mobile: parsed.customerMobile || "",
              address: parsed.customerAddress || "",
              city: parsed.customerCity || "",
              brokerId: parsed.brokerId || "",
              brokerName: parsed.brokerName || "",
              transporterId: parsed.transporterId || "",
              transporterName: parsed.transporterName || "",
            };
          }
        }
        
        if (customerToSet) {
          setSelectedCustomer(customerToSet);
          localStorage.setItem('selectedCustomer', JSON.stringify(customerToSet));
          localStorage.setItem('selectedCustomerId', customerToSet.id);
        }
        
        // Show a toast to indicate edit mode
        toast.info(`Edit mode active - editing order #${parsed.orderNumber || 'Unknown'}`);
        
      } catch (e) {
        console.error("Error restoring edit state:", e);
        toast.error("Failed to load edit order data");
      }
    } else if (savedCustomer && !localStorage.getItem('selectedCustomer')) {
      // Fallback: restore saved customer if no edit mode
      try {
        const parsed = JSON.parse(savedCustomer);
        setSelectedCustomer(parsed);
      } catch (e) {
        console.error("Error restoring customer:", e);
      }
    }
  };

  const prepareEditFromOrder = async (order, orderId, retailerId, onEditComplete) => {
    try {
      // Save edit order ID
      localStorage.setItem('editOrderId', String(orderId));
      localStorage.setItem("selectedCustomerId", retailerId);
      
      // Fetch complete customer details
      const response = await fetchLink({ 
        address: `pos/retailerMasterOpt?limit=10000000&page=1` 
      });
      
      let completeCustomerDetails = null;
      
      if (response?.success && Array.isArray(response.data)) {
        completeCustomerDetails = response.data.find(
          c => String(c.Customer_Id) === String(retailerId)
        );
      }
      
      // Build edit data
      const editData = {
        customerId: order.Retailer_Id || order.Customer_Id || order.Party_Id,
        customerName: order.Retailer_Name || order.Customer_Name || order.Party_Name,
        customerMobile: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || order.Mobile_No || "",
        customerAddress: completeCustomerDetails?.Address || order.Shipp_Address || order.Shipping_Address || "",
        customerCity: completeCustomerDetails?.City || order.City || "",
        orderId: orderId,
        orderNumber: order.So_Inv_No || order.So_No || order.OrderNumber,
        cartItems: {},
        productsList: [],
        brokerId: completeCustomerDetails?.Broker_Id || order.Broker_Id || order.BrokerId || "",
        brokerName: completeCustomerDetails?.Broker_Name || completeCustomerDetails?.Broker || order.Broker_Name || order.BrokerName || order.Broker || "",
        transporterId: completeCustomerDetails?.Transporter_Id || order.Transporter_Id || order.TransporterId || "",
        transporterName: completeCustomerDetails?.Transporter_Name || completeCustomerDetails?.Transporter || order.Transporter_Name || order.TransporterName || order.Transporter || "",
        shippingAddress: completeCustomerDetails?.Address || order.Shipp_Address || order.Shipping_Address || order.Address || "",
        deliveryAddress: completeCustomerDetails?.Address || order.Deliv_Address || order.Delivery_Address || order.Shipp_Address || order.Shipping_Address || "",
        contactNumber: completeCustomerDetails?.Mobile_No || order.Ord_Mobile_No || order.Mobile_No || "",
        description: order.Narration || order.Description || "",
        customerDetails: completeCustomerDetails ? {
          id: completeCustomerDetails.Customer_Id,
          name: (completeCustomerDetails.Short_Name || completeCustomerDetails.Billl_Name || "").replace(/\u0004/g, "").trim(),
          mobile: completeCustomerDetails.Mobile_No || "",
          address: completeCustomerDetails.Address || "",
          city: completeCustomerDetails.City || "",
          brokerId: completeCustomerDetails.Broker_Id || "",
          brokerName: completeCustomerDetails.Broker_Name || completeCustomerDetails.Broker || "",
          transporterId: completeCustomerDetails.Transporter_Id || "",
          transporterName: completeCustomerDetails.Transporter_Name || completeCustomerDetails.Transporter || "",
        } : null
      };

      // Process products list
      if (order.Products_List && Array.isArray(order.Products_List)) {
        order.Products_List.forEach(product => {
          const productId = String(product.Product_Id || product.Item_Id);
          const productName = product.Product_Name || "";
          
          let packGet = parseFloat(product.PackGet) || parseFloat(product.Pack_Get) || 1;
          if (packGet === 1 && productName) {
            packGet = getProductPackGet(productName);
          }
          
          const billQty = parseFloat(product.Bill_Qty) || 0;
          const quantity = packGet > 0 ? Math.round(billQty / packGet) : 1;
          
          editData.cartItems[productId] = quantity;
          
          editData.productsList.push({
            id: productId,
            name: productName,
            quantity: quantity,
            kgs: billQty,
            price: parseFloat(product.Item_Rate) || parseFloat(product.Price) || 0,
            packGet: packGet,
            amount: parseFloat(product.Amount) || 0,
          });
        });
      }
      
      // Save edit data to localStorage
      localStorage.setItem('editOrderData', JSON.stringify(editData));
      localStorage.setItem('isEditingOrder', 'true');
      
      // Backup current cart if exists
      const currentCart = localStorage.getItem('cartItems');
      if (currentCart) {
        localStorage.setItem('previousCartItems', currentCart);
      }
      
      // Callback to navigate or update UI
      if (onEditComplete) {
        onEditComplete(editData);
      } else {
        // Navigate to cart page with edit data
        navigate('/cart', { 
          state: { 
            editOrderData: editData,
            isEditingOrder: true,
            selectedCustomer: {
              id: editData.customerDetails?.id || editData.customerId,
              name: editData.customerDetails?.name || editData.customerName,
              mobile: editData.customerDetails?.mobile || editData.customerMobile || "",
              city: editData.customerDetails?.city || editData.customerCity || "",
              address: editData.customerDetails?.address || editData.customerAddress || "",
              brokerId: editData.customerDetails?.brokerId || editData.brokerId || "",
              brokerName: editData.customerDetails?.brokerName || editData.brokerName || "",
              transporterId: editData.customerDetails?.transporterId || editData.transporterId || "",
              transporterName: editData.customerDetails?.transporterName || editData.transporterName || "",
            }
          } 
        });
      }
      
      toast.info(`Loading order #${editData.orderNumber} for editing...`);
      return editData;
      
    } catch (error) {
      console.error("Error preparing edit data:", error);
      toast.error("Failed to load order details for editing");
      return null;
    }
  };

  const cancelEdit = (setEditOrderIdState) => {
    if (window.confirm("Are you sure you want to cancel the edit? All changes will be lost.")) {
      // Clear all edit-related localStorage
      localStorage.removeItem('editOrderId');
      localStorage.removeItem('editOrderData');
      localStorage.removeItem('isEditingOrder');
      localStorage.removeItem('cartItemsBackup');
      localStorage.removeItem('productsBackup');
      localStorage.removeItem('selectedCustomerId');
      localStorage.removeItem('selectedCustomer');
      localStorage.removeItem('selectedCustomerData');
      
      // Clear cart items
      setQuantities({});
      localStorage.removeItem('cartItems');
      
      // Clear selected customer
      setSelectedCustomer(null);
      
      // Update state if provided
      if (setEditOrderIdState) {
        setEditOrderIdState(null);
      }
      
      toast.success("Edit cancelled successfully");
      
      // Reload the page to ensure clean state (optional)
      // window.location.reload();
    }
  };

  const clearEditState = () => {
    localStorage.removeItem('editOrderId');
    localStorage.removeItem('editOrderData');
    localStorage.removeItem('isEditingOrder');
    localStorage.removeItem('cartItemsBackup');
    localStorage.removeItem('productsBackup');
    localStorage.removeItem('selectedCustomerId');
  };

  return {
    loadEditOrder,
    prepareEditFromOrder,
    cancelEdit,
    clearEditState,
    getProductPackGet,
    fetchCompleteCustomerDetails
  };
};