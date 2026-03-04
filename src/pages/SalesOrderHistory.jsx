// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchLink } from '../components/fetchComponent';
// import { toast } from 'react-toastify';
// import PrintPreviewModal from '../components/PrintPreview';
// import { getSessionUser } from "../components/functions";
// const fetchRetailers = async () => {
//     try {
//         const response = await fetchLink({
//             address: 'masters/retailers'
//         });
       
        
//         if (response?.success && response.data) {
//             return [{ 
//                 id: 'ALL', 
//                 name: 'ALL' 
//             }, ...response.data.map(retailer => ({
//                 id: retailer.Retailer_Id || retailer.Customer_Id || retailer.id,
//                 name: retailer.Retailer_Name || retailer.Bill_Name || retailer.Short_Name || 'Unknown Retailer'
//             }))];
//         }
//         return [{ id: 'ALL', name: 'ALL' }];
//     } catch (error) {
//         console.error("Failed to fetch retailers:", error);
//         return [{ id: 'ALL', name: 'ALL' }];
//     }
// };

// const fetchSalesPersons = async () => {
//     try {
//         const response = await fetchLink({
//             address: 'masters/salespersons'
//         });
//         if (response?.success && response.data) {
//             return [{ id: 'ALL', name: 'ALL' }, ...response.data.map(person => ({
//                 id: person.SalesPerson_Id || person.id,
//                 name: person.SalesPerson_Name || person.name || 'Unknown Sales Person'
//             }))];
//         }
//         return [{ id: 'ALL', name: 'ALL' }];
//     } catch (error) {
//         console.error("Failed to fetch sales persons:", error);
//         return [{ id: 'ALL', name: 'ALL' }];
//     }
// };

// const fetchVoucherTypes = async () => {
//     try {
//         const response = await fetchLink({
//             address: `masters/voucher?module=POS`
//         });
        
//         if (response?.success && response.data) {
        
//             const voucherData = response.data
//                 .filter(item => item?.Vocher_Type_Id && item?.Voucher_Type) 
//                 .filter((item, index, self) => 
//                     self.findIndex(i => i.Vocher_Type_Id === item.Vocher_Type_Id) === index 
//                 );
            
//             return [
//                 { id: 'ALL', name: 'ALL', typeId: 'ALL' }, 
//                 ...voucherData.map(voucher => ({
//                     id: voucher.Voucher_Type, 
//                     name: voucher.Voucher_Type,
//                     typeId: voucher.Vocher_Type_Id 
//                 }))
//             ];
//         }
//         return [{ id: 'ALL', name: 'ALL', typeId: 'ALL' }];
//     } catch (error) {
//         console.error("Error fetching voucher types:", error);
//         return [{ id: 'ALL', name: 'ALL', typeId: 'ALL' }];
//     }
// };

// const FilterModal = ({ show, onClose, onSearch, currentFilters, onClear }) => {


       
//     const [filters, setFilters] = useState(currentFilters);
//     const [retailers, setRetailers] = useState([{ id: 'ALL', name: 'ALL' }]);
//     const [salesPersons, setSalesPersons] = useState([{ id: 'ALL', name: 'ALL' }]);
//     const [voucherTypes, setVoucherTypes] = useState([{ id: 'ALL', name: 'ALL', typeId: 'ALL' }]);
//     const [loading, setLoading] = useState(false);
    
//     useEffect(() => {
//         const loadOptions = async () => {
//             setLoading(true);
//             try {
//                 const [retailerList, salesPersonList, voucherList] = await Promise.all([
//                     fetchRetailers(),
//                     fetchSalesPersons(),
//                     fetchVoucherTypes(), 
//                 ]);
//                 setRetailers(retailerList);
//                 setSalesPersons(salesPersonList);
//                 setVoucherTypes(voucherList);
//             } catch (error) {
//                 console.error("Failed to load filter options:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (show) {
//             setFilters(currentFilters); 
//             loadOptions();
//         }
//     }, [show, currentFilters]);

//     const handleFilterChange = (name, value) => {
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSearchClick = () => {
//         onSearch(filters);
//     };

//     const handleClearClick = () => {
//         const clearedFilters = {
//             startDate: '',
//             endDate: '',
//             Retailer_Id: 'ALL',
//             salesPersonId: 'ALL',
//             createdBy: 'ALL',
//             voucherType: 'ALL',
//             voucherTypeId: 'ALL',
//             cancelledStatus: 'Hide',
//             orderStatus: 'ALL',
//         };
//         setFilters(clearedFilters);
//         onClear();
//     };

//     if (!show) return null;

//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
//             <div className="bg-white rounded-xl shadow-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
                
//                 <header className="px-6 py-4 text-2xl font-extrabold text-blue-700 border-b border-gray-100 flex justify-between items-center">
//                     Filters
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//                     </button>
//                 </header>
                
//                 <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {loading && (
//                         <div className="col-span-2 text-center py-4">
//                             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                             <span className="ml-2 text-gray-600">Loading filters...</span>
//                         </div>
//                     )}
                  
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
//                         <input
//                             type="date"
//                             value={filters.startDate}
//                             onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                             className="p-2.5 border border-gray-300 rounded-lg text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
//                         <input
//                             type="date"
//                             value={filters.endDate}
//                             onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                             className="p-2.5 border border-gray-300 rounded-lg text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">Retailer</label>
//                         <select
//                             value={filters.Retailer_Id}
//                             onChange={(e) => handleFilterChange('Retailer_Id', e.target.value)}
//                             className="p-2.5 border border-gray-300 rounded-lg text-sm w-full bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
//                         >
//                             {retailers.map(r => (
//                                 <option key={r.id} value={r.id}>{r.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">Created By</label>
//                         <select
//                             value={filters.createdBy}
//                             onChange={(e) => handleFilterChange('createdBy', e.target.value)}
//                             className="p-2.5 border border-gray-300 rounded-lg text-sm w-full bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
//                         >
//                             <option value="ALL">ALL</option>
//                             <option value="UserA">User A</option>
//                             <option value="UserB">User B</option>
//                         </select>
//                     </div> */}
                    
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">Voucher</label>
//                         <select
//                             value={filters.voucherType}
//                             onChange={(e) => {
//                                 const selectedVoucher = voucherTypes.find(v => v.id === e.target.value);
//                                 handleFilterChange('voucherType', e.target.value);
//                                 handleFilterChange('voucherTypeId', selectedVoucher?.typeId || 'ALL');
//                             }}
//                             className="p-2.5 border border-gray-300 rounded-lg text-sm w-full bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
//                         >
//                             {voucherTypes.map(voucher => (
//                                 <option key={voucher.id} value={voucher.id}>{voucher.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <footer className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end space-x-3 rounded-b-xl">
//                     <button 
//                         onClick={handleClearClick}
//                         className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg transition-colors text-sm border border-red-200"
//                     >
//                         CLEAR
//                     </button>
//                     <button 
//                         onClick={onClose}
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
//                     >
//                         CLOSE
//                     </button>
//                     <button 
//                         onClick={handleSearchClick} 
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-md flex items-center space-x-1"
//                     >
//                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                         </svg>
//                         <span>SEARCH</span>
//                     </button>
//                 </footer>
//             </div>
//         </div>
//     );
// };

// const SalesOrderHistory = () => {
//     const navigate = useNavigate(); 
//      const storage = getSessionUser().user;
//     const [orders, setOrders] = useState([]); 
//     const [isLoading, setIsLoading] = useState(true);
//     const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [orderToDelete, setOrderToDelete] = useState(null);
    
//     const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
//     const [orderToPrint, setOrderToPrint] = useState(null);
    
//     const getTodayDate = () => new Date().toISOString().split('T')[0];
//     const defaultFilters = {
//         startDate: getTodayDate(),
//         endDate: getTodayDate(),
//         Retailer_Id: 'ALL',
//         salesPersonId: 'ALL',
//         createdBy: 'ALL',
//         voucherType: 'POS SALE ORDER',
//         voucherTypeId: '174',
//     };
    
//     const [filters, setFilters] = useState(defaultFilters);

//     const fetchSalesOrders = useCallback(async (currentFilters) => {
//         setIsLoading(true);
        
//         try {
//             let url = 'sales/saleOrder';
//             const params = [];

//             if (currentFilters.startDate) {
//                 params.push(`Fromdate=${currentFilters.startDate}`);
//             }
//             if (currentFilters.endDate) {
//                 params.push(`Todate=${currentFilters.endDate}`);
//             }
            
//             if (currentFilters.Retailer_Id && currentFilters.Retailer_Id !== 'ALL') {
//                 params.push(`Retailer_Id=${currentFilters.Retailer_Id}`);
//             }

//             if (currentFilters.salesPersonId && currentFilters.salesPersonId !== 'ALL') {
//                 params.push(`Sales_Person_Id=${currentFilters.salesPersonId}`);
//             }
//             if (currentFilters.createdBy && currentFilters.createdBy !== 'ALL') {
//                 params.push(`Created_by=${currentFilters.createdBy}`);
//             }
        
//             if (currentFilters.voucherTypeId) {
//                 params.push(`VoucherType=${currentFilters.voucherTypeId}`);
//             }

//             if (params.length > 0) {
//                 url += `?${params.join('&')}`;
//             }

//             const response = await fetchLink({
//                 address: url
//             });
                
//             if (response?.success) {
//                 const rawOrders = response.data?.SaleOrder_Entry || response.data || [];
//                 const apiOrders = Array.isArray(rawOrders) ? rawOrders : [];
               
//                 const formattedOrders = apiOrders.map((item, index) => ({
//                     "#": index + 1,
//                     s_no: index + 1,
//                     date: item.So_Date || 'N/A',
//                     id: item.So_Inv_No || item.So_Id,
//                     soId: item.So_Id, 
//                     customer: item.Retailer_Name || 'Unknown Customer',
//                     retailerId: item.Retailer_Id,
//                     voucher: item.VoucherTypeGet,
//                     voucherTypeId: item.VoucherType,
//                     beforeTax: parseFloat(item.Total_Before_Tax || 0),
//                     tax: parseFloat(item.Total_Tax || 0),
//                     invoiceValue: parseFloat(item.Total_Invoice_value || 0),
//                     status: item.Approve_Status === '1' ? 'Completed' : 'Pending', 
//                     items: (item.Products_List || []).map(product =>{
              
//                              const productName = product.Product_Name || '';
//         let packGet = parseFloat(product.PackGet || 0);
        

//         if (!packGet || packGet === 0) {
//             const kgMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
//             if (kgMatch) {
//                 packGet = parseFloat(kgMatch[1]);
//             }
//         }

//                         const Qty= product?.Bill_Qty /  packGet ;
//                         const KGS= Qty * packGet;
    
//                         return {
//                         id: product.Item_Id,
//                         name: product.Product_Name || 'Item N/A',
//                         Print_Name: product.Product_Name || 'Item N/A',
//                         Product_Name: product.Product_Name || 'Item N/A',
//                         qty: parseFloat(Qty || 0),
//                         price: parseFloat(product.Item_Rate || 0),
//                         packGet: parseFloat(packGet || 0),
//                         amount: parseFloat(product.Amount || 0),
//                         kgs: parseFloat(KGS || 0),
//                         Bill_Qty: parseFloat(product.Bill_Qty || 0),
//                         Item_Rate: parseFloat(product.Item_Rate || 0),
//                         Amount: parseFloat(product.Amount || 0),
//                         }
                    
//                     }),
//                     customerData: {
//                         Customer_Id: item.Retailer_Id,
//                         Short_Name: item.Retailer_Name,
//                         Bill_Name: item.Retailer_Name,
//                         Billl_Name: item.Retailer_Name, 
//                         Address: item.Address || '',
//                         City: item.City || '',
//                         Mobile_No: item.Mobile_No || '',
//                         Land_Line: item.Land_Line || '',
//                     },
//                     brokerData: item.Broker_Data || null,
//                     transportData: item.Transport_Data || null,
                   
//                     rawData: item
//                 }));
                
//                 setOrders(formattedOrders);
//             } else {
//                 console.error("API returned unsuccessful response:", response);
//                 setOrders([]);
//             }
//         } catch (error) {
//             console.error("Failed to fetch sales orders:", error);
//             setOrders([]);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchSalesOrders(filters);
//     }, [fetchSalesOrders, filters]);

//     const handleEditOrder = async (order) => {
//         try {
//             if (order) {
//                 const editData = {
//                     orderId: order.soId,
//                     customer: order.customerData || order.customerData,
//                     cartItems: order.items || order.items,
//                     voucherType: order.VoucherType || order.voucher,
//                     voucherTypeId: order.VoucherType_Id || order.voucherTypeId,
//                     broker: order.brokerData || order.brokerData,
//                     transport: order.transportData || order.transportData,
//                 };

//                 navigate('/pos', { state: { editMode: true, orderData: editData } });
//                 toast.info(`Editing order ${order.soId}`);
//             } else {
//                 toast.error('Failed to fetch order details');
//             }
//         } catch (error) {
//             console.error('Error fetching order details:', error);
//             toast.error('Error loading order for editing');
//         }
//     };

//     const handleDeleteOrder = (order) => {
//         setOrderToDelete(order);
//         setShowDeleteConfirm(true);
//     };

//     const confirmDeleteOrder = async () => {
//         if (!orderToDelete) return;

//         try {
//             const response = await fetchLink({
//                 address: `sales/saleOrder/${orderToDelete.soId}`,
//                 method: 'DELETE'
//             });

//             if (response?.success) {
//                 toast.success(`Order ${orderToDelete.id} deleted successfully`);
//                 fetchSalesOrders(filters);
//             } else {
//                 toast.error(response?.message || 'Failed to delete order');
//             }
//         } catch (error) {
//             toast.error('Error deleting order');
//         } finally {
//             setShowDeleteConfirm(false);
//             setOrderToDelete(null);
//         }
//     };

//     const cancelDeleteOrder = () => {
//         setShowDeleteConfirm(false);
//         setOrderToDelete(null);
//     };

//     const handleSearch = (newFilters) => {
//         setFilters(newFilters);
//         setIsFilterModalOpen(false);
//     };

//     const handleClearFilters = () => {
//         setFilters(defaultFilters);
//     };
    
//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     // const handlePrintOrder = (order) => {
//     //     console.log("Printing order:", order);
//     //     setOrderToPrint(order);
//     //     setIsPrintModalOpen(true);
//     // };


// const handlePrintOrder = (order) => {

    
   
//     if (!order) {
//         console.error("Order is undefined");
//         return;
//     }
    
//     try {
   
//         const apiEndpoint = 'masters/getlolDetails';

        
//       fetchLink({ address: apiEndpoint })
//     .then(response => {
       
        
//         if (!response || !response.success || !response.data || !Array.isArray(response.data)) {
//             console.warn("No retailers data received, using original order");
//             setOrderToPrint(order);
//             setIsPrintModalOpen(true);
//             return;
//         }
        
//         const retailers = response.data;
     
//         const retailer = retailers.find(r => r.Ret_Id == order.retailerId);
      
//         if (retailer) {
//             const modifiedOrder = {
//                 ...order,
               
//                 Billl_Name: retailer.Party_Mailing_Name || retailer.Party_Mailing_Name || order.Bill_Name || '',
//                 Land_Line: retailer.Party_Mobile_1 || retailer.Party_Mobile_2 || order.Land_Line || '',
//                 location:  retailer.Party_Location || order.location || ''
//             };
            
    
//             setOrderToPrint(modifiedOrder);
//         } else {

            
       
//             const sampleIds = retailers.slice(0, 10).map(r => r.Ret_Id);
         
            
//             setOrderToPrint(order);
//         }
        
//         setIsPrintModalOpen(true);
//     })
//     .catch(error => {
//         console.error("Error in fetchLink promise:", error);
//         setOrderToPrint(order);
//         setIsPrintModalOpen(true);
//     });
//     } catch (error) {
//         console.error("Error in handlePrintOrder:", error);
//         setOrderToPrint(order);
//         setIsPrintModalOpen(true);
//     }
// };

//     const handlePrintAndSave = async () => {
//         try {
          
//             toast.success(`Printing order ${orderToPrint?.id}`);
//             return true;
//         } catch (error) {
//             console.error('Error in print operation:', error);
//             toast.error('Error printing order');
//             return false;
//         }
//     };

//     const handleClosePrintModal = () => {
//         setIsPrintModalOpen(false);
//         setOrderToPrint(null);
//     };

 

//     const getPrintData = () => {
//         if (!orderToPrint) return null;
         
 
//         const subtotal = orderToPrint.beforeTax || orderToPrint.items.reduce((sum, item) => sum + (item.amount || 0), 0);
//         const tax = orderToPrint.tax || 0;
//         const total = orderToPrint.invoiceValue || (subtotal + tax);

       
//         const staffList = orderToPrint.rawData?.Staff_Involved_List || [];
//         const brokerData = staffList.find(staff => staff.EmpType === 'Broker');
//         const transportData = staffList.find(staff => staff.EmpType === 'Transport');
     

//         return {
//             orderInfo: {
//                 soId: orderToPrint.soId,
//                 soInvNo: orderToPrint.id,
//                 soDate: orderToPrint.date,
//                 voucherType: orderToPrint.voucher,
//             },
//             customer: {
//                 Billl_Name: orderToPrint.Billl_Name || orderToPrint.Billl_Name || orderToPrint.customer,
//                 Short_Name: orderToPrint.customerData?.Short_Name || orderToPrint.customer,
//                 Address: orderToPrint.City?.Address || orderToPrint?.City,
//                 City: orderToPrint.location || '',
//                 Mobile_No: orderToPrint?.Land_Line || orderToPrint?.Party_Mobile_2,
//                 Land_Line: orderToPrint.customerData?.Land_Line || '',
//                 Transporter: transportData?.EmpName || orderToPrint.transportData?.Transporter_Name || orderToPrint.transportData?.Name || '',
//                 Broker: brokerData?.EmpName || orderToPrint.brokerData?.Broker_Name || orderToPrint.brokerData?.Name || '',
//             },
//             cartItems: orderToPrint.items.map(item => ({
//                 ...item,
//                 Print_Name: item.Print_Name || item.name || item.Product_Name,
//                 Product_Name: item.Product_Name || item.name,
//                 price: item.price || item.Item_Rate || 0,
//                 qty: item.qty || item.Bill_Qty || 0,
//                 kgs: item.kgs || item.Total_Kgs || 0,
//                 amount: item.amount || item.Amount || 0,
//                 Bill_Qty: item.Bill_Qty || item.qty || 0,
//                 Item_Rate: item.Item_Rate || item.price || 0,
//                 Amount: item.Amount || item.amount || 0,
//             })),
//             totals: {
//                 subtotal: subtotal,
//                 tax: tax,
//                 total: total,
//                 roundOff: orderToPrint.rawData?.Round_off || 0,
//             },
//             storage: {
//                 UserName: storage?.UserName || 'User'
//             }
//         };
//     };

//     const filteredOrders = useMemo(() => {
//         return orders;
//     }, [orders]);

//     const totalSalesValue = filteredOrders.reduce((sum, order) => sum + order.invoiceValue, 0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage] = useState(10);
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const currentOrders = filteredOrders.slice(startIndex, endIndex);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [filteredOrders.length]);

//     return (
//         <div className="h-full bg-gray-50 p-4 sm:p-6 font-sans overflow-hidden flex flex-col">
//             <FilterModal
//                 show={isFilterModalOpen}
//                 onClose={() => setIsFilterModalOpen(false)}
//                 onSearch={handleSearch}
//                 onClear={handleClearFilters}
//                 currentFilters={filters}
//             />

//             {isPrintModalOpen && orderToPrint && (
//                 <PrintPreviewModal
//                     open={isPrintModalOpen}
//                     onClose={handleClosePrintModal}
//                     customer={getPrintData()?.customer}
//                     cartItems={getPrintData()?.cartItems}
//                     totals={getPrintData()?.totals}
//                     onPrintAndSave={handlePrintAndSave}
//                     storage={getPrintData()?.storage}
//                     orderInfo={getPrintData()?.orderInfo}
//                     isReprint={true} 
//                 />
//             )}

//             {/* Delete Confirmation Modal */}
//             {showDeleteConfirm && (
//                 <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-xl shadow-3xl w-full max-w-md p-6">
//                         <div className="text-center">
//                             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
//                                 <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Order</h3>
//                             <p className="text-sm text-gray-500 mt-2">
//                                 Are you sure you want to delete order <strong>{orderToDelete?.id}</strong>? This action cannot be undone.
//                             </p>
//                         </div>
//                         <div className="mt-6 flex justify-center space-x-3">
//                             <button
//                                 type="button"
//                                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
//                                 onClick={cancelDeleteOrder}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
//                                 onClick={confirmDeleteOrder}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4">
//                     <div className="flex items-center space-x-3 mb-3 sm:mb-0">
//                         <button
//                             onClick={handleGoBack}
//                             className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors flex items-center shadow-md text-sm sm:text-base"
//                             title="Back to POS Screen"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                             </svg>
//                             Back to POS
//                         </button>
                        
//                         <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Sales Orders History</h1>
//                     </div>

//                     <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
//                         <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg font-bold text-base whitespace-nowrap">
//                             Total Value: Rs {totalSalesValue.toFixed(2)}
//                         </div>
                        
//                         <button 
//                             className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
//                             onClick={() => setIsFilterModalOpen(true)}
//                             title="Open Filters"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-3.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex-1 overflow-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200 shadow-sm">
//                             <tr>
//                                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[2%]">#</th>
//                                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[5%]">SNo</th>
//                                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[8%]">Date</th>
//                                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">ID</th>
//                                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[25%]">Customer</th>
//                                 {/* <th className="px-3 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[8%] hidden lg:table-cell">Before Tax</th> */}
//                                 {/* <th className="px-3 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[5%] hidden lg:table-cell">Tax</th> */}
//                                 <th className="px-3 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Value</th>
//                                 <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[8%]">Status</th>
//                                 <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[12%]">Action</th>
//                             </tr>
//                         </thead>
                   
//                         <tbody className="bg-white divide-y divide-gray-100">
//                             {isLoading ? (
//                                 <tr>
//                                     <td colSpan="11" className="px-4 py-12 text-center text-xl text-blue-500 font-semibold animate-pulse">
//                                         Loading Sales Order Data...
//                                     </td>
//                                 </tr>
//                             ) : currentOrders.length > 0 ? (
//                                 currentOrders.map((order, index) => (
//                                     <tr key={order.id || index} className="hover:bg-blue-50 transition-colors">
//                                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 w-[2%]">
//                                             <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
//                                         </td>
//                                         <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800 w-[5%]">{index + 1 + startIndex}</td>
//                                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 w-[8%]"> {order.date.split('T')[0]}</td>
//                                         <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-gray-800 w-[10%]">{order.id}</td>
//                                         <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium w-[25%]">{order.customer}</td>
//                                         {/* <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 text-right w-[8%] hidden lg:table-cell">{order.beforeTax.toFixed(1)}</td> */}
//                                         {/* <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 text-right w-[5%] hidden lg:table-cell">{order.tax.toFixed(0)}</td> */}
//                                         <td className="px-3 py-3 whitespace-nowrap text-base font-bold text-gray-900 text-right w-[10%]">{order.invoiceValue.toFixed(0)}</td>
//                                         <td className="px-3 py-3 whitespace-nowrap text-sm w-[8%]">
//                                             <span 
//                                                 className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
//                                                     ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
//                                             >
//                                                 {order.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium w-[12%]">
//                                             <div className="flex items-center justify-center space-x-2">
//                                                 {/* View/Print Invoice button */}
//                                                 <button 
//                                                     className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors" 
//                                                     title="View/Print Invoice"
//                                                     onClick={() => handlePrintOrder(order)}
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="11" className="px-4 py-12 text-center text-lg text-gray-500">
//                                         No sales orders found matching the current filters.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-4 mt-6 text-sm text-gray-700">
//                     <span className="mb-2 sm:mb-0">Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} records.</span>
                    
//                     <div className="flex space-x-1 ml-4">
//                         <button 
//                             className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage(1)}
//                             title="First Page"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//                             </svg>
//                         </button>
//                         <button 
//                             className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                             title="Previous Page"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//                             </svg>
//                         </button>
           
//                         <span className="px-3 py-2 border rounded-lg bg-blue-50 text-blue-800 font-semibold">{currentPage}</span>
                        
//                         <button 
//                             className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             disabled={endIndex >= filteredOrders.length}
//                             onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredOrders.length / rowsPerPage), prev + 1))}
//                             title="Next Page"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                             </svg>
//                         </button>
//                         <button 
//                             className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             disabled={endIndex >= filteredOrders.length}
//                             onClick={() => setCurrentPage(Math.ceil(filteredOrders.length / rowsPerPage))}
//                             title="Last Page"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesOrderHistory;















import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLink } from '../components/fetchComponent';
import { toast } from 'react-toastify';
import PrintPreviewModal from '../components/PrintPreview';
import { getSessionUser } from "../components/functions";

// Global cache for retailers data
const retailersCache = {
    data: null,
    lastFetched: null,
    isLoading: false,
    isFetched: false
};

const fetchRetailers = async () => {
    try {
        const response = await fetchLink({
            address: 'masters/retailers'
        });
       
        if (response?.success && response.data) {
            return [{ 
                id: 'ALL', 
                name: 'ALL' 
            }, ...response.data.map(retailer => ({
                id: retailer.Retailer_Id || retailer.Customer_Id || retailer.id,
                name: retailer.Retailer_Name || retailer.Bill_Name || retailer.Short_Name || 'Unknown Retailer'
            }))];
        }
        return [{ id: 'ALL', name: 'ALL' }];
    } catch (error) {
        console.error("Failed to fetch retailers:", error);
        return [{ id: 'ALL', name: 'ALL' }];
    }
};

const fetchSalesPersons = async () => {
    try {
        const response = await fetchLink({
            address: 'masters/salespersons'
        });
        if (response?.success && response.data) {
            return [{ id: 'ALL', name: 'ALL' }, ...response.data.map(person => ({
                id: person.SalesPerson_Id || person.id,
                name: person.SalesPerson_Name || person.name || 'Unknown Sales Person'
            }))];
        }
        return [{ id: 'ALL', name: 'ALL' }];
    } catch (error) {
        console.error("Failed to fetch sales persons:", error);
        return [{ id: 'ALL', name: 'ALL' }];
    }
};

const fetchVoucherTypes = async () => {
    try {
        const response = await fetchLink({
            address: `masters/voucher?module=POS`
        });
        
        if (response?.success && response.data) {
            const voucherData = response.data
                .filter(item => item?.Vocher_Type_Id && item?.Voucher_Type) 
                .filter((item, index, self) => 
                    self.findIndex(i => i.Vocher_Type_Id === item.Vocher_Type_Id) === index 
                );
            
            return [
                { id: 'ALL', name: 'ALL', typeId: 'ALL' }, 
                ...voucherData.map(voucher => ({
                    id: voucher.Voucher_Type, 
                    name: voucher.Voucher_Type,
                    typeId: voucher.Vocher_Type_Id 
                }))
            ];
        }
        return [{ id: 'ALL', name: 'ALL', typeId: 'ALL' }];
    } catch (error) {
        console.error("Error fetching voucher types:", error);
        return [{ id: 'ALL', name: 'ALL', typeId: 'ALL' }];
    }
};

const FilterModal = ({ show, onClose, onSearch, currentFilters, onClear }) => {
    const [filters, setFilters] = useState(currentFilters);
    const [retailers, setRetailers] = useState([{ id: 'ALL', name: 'ALL' }]);
    const [salesPersons, setSalesPersons] = useState([{ id: 'ALL', name: 'ALL' }]);
    const [voucherTypes, setVoucherTypes] = useState([{ id: 'ALL', name: 'ALL', typeId: 'ALL' }]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const loadOptions = async () => {
            setLoading(true);
            try {
                const [retailerList, salesPersonList, voucherList] = await Promise.all([
                    fetchRetailers(),
                    fetchSalesPersons(),
                    fetchVoucherTypes(), 
                ]);
                setRetailers(retailerList);
                setSalesPersons(salesPersonList);
                setVoucherTypes(voucherList);
            } catch (error) {
                console.error("Failed to load filter options:", error);
            } finally {
                setLoading(false);
            }
        };

        if (show) {
            setFilters(currentFilters); 
            loadOptions();
        }
    }, [show, currentFilters]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchClick = () => {
        onSearch(filters);
    };

    const handleClearClick = () => {
        const clearedFilters = {
            startDate: '',
            endDate: '',
            Retailer_Id: 'ALL',
            salesPersonId: 'ALL',
            createdBy: 'ALL',
            voucherType: 'ALL',
            voucherTypeId: 'ALL',
            cancelledStatus: 'Hide',
            orderStatus: 'ALL',
        };
        setFilters(clearedFilters);
        onClear();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
                
                <header className="px-6 py-4 text-2xl font-extrabold text-blue-700 border-b border-gray-100 flex justify-between items-center">
                    Filters
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading && (
                        <div className="col-span-2 text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading filters...</span>
                        </div>
                    )}
                  
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="p-2.5 border border-gray-300 rounded-lg text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="p-2.5 border border-gray-300 rounded-lg text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Retailer</label>
                        <select
                            value={filters.Retailer_Id}
                            onChange={(e) => handleFilterChange('Retailer_Id', e.target.value)}
                            className="p-2.5 border border-gray-300 rounded-lg text-sm w-full bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                        >
                            {retailers.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Voucher</label>
                        <select
                            value={filters.voucherType}
                            onChange={(e) => {
                                const selectedVoucher = voucherTypes.find(v => v.id === e.target.value);
                                handleFilterChange('voucherType', e.target.value);
                                handleFilterChange('voucherTypeId', selectedVoucher?.typeId || 'ALL');
                            }}
                            className="p-2.5 border border-gray-300 rounded-lg text-sm w-full bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                        >
                            {voucherTypes.map(voucher => (
                                <option key={voucher.id} value={voucher.id}>{voucher.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <footer className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end space-x-3 rounded-b-xl">
                    <button 
                        onClick={handleClearClick}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg transition-colors text-sm border border-red-200"
                    >
                        CLEAR
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        CLOSE
                    </button>
                    <button 
                        onClick={handleSearchClick} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-md flex items-center space-x-1"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <span>SEARCH</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

const SalesOrderHistory = () => {
    const navigate = useNavigate(); 
    const storage = getSessionUser().user;
    const [orders, setOrders] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [retailersData, setRetailersData] = useState(null); // Cache for retailers data
    
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [orderToPrint, setOrderToPrint] = useState(null);
    
    // Preload retailers data on component mount
    useEffect(() => {
        const preloadRetailersData = async () => {
            // Skip if already loading
            if (retailersCache.isLoading) return;
            
            // Return cached data if recent (within 5 minutes)
            if (retailersCache.data && retailersCache.lastFetched) {
                const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
                if (retailersCache.lastFetched > fiveMinutesAgo) {
                    setRetailersData(retailersCache.data);
                    return;
                }
            }
            
            try {
                retailersCache.isLoading = true;
                const response = await fetchLink({ address: 'masters/getlolDetails' });
                
                if (response?.success && Array.isArray(response.data)) {
                    retailersCache.data = response.data;
                    retailersCache.lastFetched = Date.now();
                    retailersCache.isFetched = true;
                    setRetailersData(response.data);
                }
            } catch (error) {
                console.error("Failed to preload retailers:", error);
            } finally {
                retailersCache.isLoading = false;
            }
        };
        
        preloadRetailersData();
    }, []);
    
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const defaultFilters = {
        startDate: getTodayDate(),
        endDate: getTodayDate(),
        Retailer_Id: 'ALL',
        salesPersonId: 'ALL',
        createdBy: 'ALL',
        voucherType: 'POS SALE ORDER',
        voucherTypeId: '174',
    };
    
    const [filters, setFilters] = useState(defaultFilters);

    const fetchSalesOrders = useCallback(async (currentFilters) => {
        setIsLoading(true);
        
        try {
            let url = 'sales/saleOrder';
            const params = [];

            if (currentFilters.startDate) {
                params.push(`Fromdate=${currentFilters.startDate}`);
            }
            if (currentFilters.endDate) {
                params.push(`Todate=${currentFilters.endDate}`);
            }
            
            if (currentFilters.Retailer_Id && currentFilters.Retailer_Id !== 'ALL') {
                params.push(`Retailer_Id=${currentFilters.Retailer_Id}`);
            }

            if (currentFilters.salesPersonId && currentFilters.salesPersonId !== 'ALL') {
                params.push(`Sales_Person_Id=${currentFilters.salesPersonId}`);
            }
            if (currentFilters.createdBy && currentFilters.createdBy !== 'ALL') {
                params.push(`Created_by=${currentFilters.createdBy}`);
            }
        
            if (currentFilters.voucherTypeId) {
                params.push(`VoucherType=${currentFilters.voucherTypeId}`);
            }

            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }

            const response = await fetchLink({
                address: url
            });
                
            if (response?.success) {
                const rawOrders = response.data?.SaleOrder_Entry || response.data || [];
                const apiOrders = Array.isArray(rawOrders) ? rawOrders : [];
               
                const formattedOrders = apiOrders.map((item, index) => ({
                    "#": index + 1,
                    s_no: index + 1,
                    date: item.So_Date || 'N/A',
                    id: item.So_Inv_No || item.So_Id,
                    soId: item.So_Id, 
                    customer: item.Retailer_Name || 'Unknown Customer',
                    retailerId: item.Retailer_Id,
                    voucher: item.VoucherTypeGet,
                    voucherTypeId: item.VoucherType,
                    beforeTax: parseFloat(item.Total_Before_Tax || 0),
                    tax: parseFloat(item.Total_Tax || 0),
                    invoiceValue: parseFloat(item.Total_Invoice_value || 0),
                    status: item.Approve_Status === '1' ? 'Completed' : 'Pending', 
                    items: (item.Products_List || []).map(product => {
                        const productName = product.Product_Name || '';
                        let packGet = parseFloat(product.PackGet || 0);
                        
                        if (!packGet || packGet === 0) {
                            const kgMatch = productName.match(/(\d+(?:\.\d+)?)\s*KG/i);
                            if (kgMatch) {
                                packGet = parseFloat(kgMatch[1]);
                            }
                        }

                        const Qty = product?.Bill_Qty / packGet;
                        const KGS = Qty * packGet;
    
                        return {
                            id: product.Item_Id,
                            name: product.Product_Name || 'Item N/A',
                            Print_Name: product.Product_Short_Name || 'Item N/A',
                            Product_Name: product.Product_Short_Name || 'Item N/A',
                            qty: parseFloat(Qty || 0),
                            price: parseFloat(product.Item_Rate || 0),
                            packGet: parseFloat(packGet || 0),
                            amount: parseFloat(product.Amount || 0),
                            kgs: parseFloat(KGS || 0),
                            Bill_Qty: parseFloat(product.Bill_Qty || 0),
                            Item_Rate: parseFloat(product.Item_Rate || 0),
                            Amount: parseFloat(product.Amount || 0),
                        }
                    }),
                    customerData: {
                        Customer_Id: item.Retailer_Id,
                        Short_Name: item.Retailer_Name,
                        Bill_Name: item.Retailer_Name,
                        Billl_Name: item.Retailer_Name, 
                        Address: item.Address || '',
                        City: item.City || '',
                        Mobile_No: item.Mobile_No || '',
                        Land_Line: item.Land_Line || '',
                    },
                    brokerData: item.Broker_Data || null,
                    transportData: item.Transport_Data || null,
                    rawData: item
                }));
                
                setOrders(formattedOrders);
            } else {
                console.error("API returned unsuccessful response:", response);
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch sales orders:", error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalesOrders(filters);
    }, [fetchSalesOrders, filters]);

    const handleEditOrder = async (order) => {
        try {
            if (order) {
                const editData = {
                    orderId: order.soId,
                    customer: order.customerData || order.customerData,
                    cartItems: order.items || order.items,
                    voucherType: order.VoucherType || order.voucher,
                    voucherTypeId: order.VoucherType_Id || order.voucherTypeId,
                    broker: order.brokerData || order.brokerData,
                    transport: order.transportData || order.transportData,
                };

                navigate('/pos', { state: { editMode: true, orderData: editData } });
                toast.info(`Editing order ${order.soId}`);
            } else {
                toast.error('Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Error loading order for editing');
        }
    };

    const handleDeleteOrder = (order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            const response = await fetchLink({
                address: `sales/saleOrder/${orderToDelete.soId}`,
                method: 'DELETE'
            });

            if (response?.success) {
                toast.success(`Order ${orderToDelete.id} deleted successfully`);
                fetchSalesOrders(filters);
            } else {
                toast.error(response?.message || 'Failed to delete order');
            }
        } catch (error) {
            toast.error('Error deleting order');
        } finally {
            setShowDeleteConfirm(false);
            setOrderToDelete(null);
        }
    };

    const cancelDeleteOrder = () => {
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
    };

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setIsFilterModalOpen(false);
    };

    const handleClearFilters = () => {
        setFilters(defaultFilters);
    };
    
    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePrintOrder = (order) => {
        if (!order) {
            console.error("Order is undefined");
            return;
        }

        
    
        if (retailersData) {
            const retailer = retailersData.find(r => r.Ret_Id == order.retailerId);
            
            if (retailer) {
                const modifiedOrder = {
                    ...order,
                    Billl_Name: retailer.Party_Mailing_Name || order.Billl_Name || order.Bill_Name || '',
                    Land_Line: retailer.Party_Mobile_1 || retailer.Party_Mobile_2 || order.Land_Line || '',
                    location: retailer.Party_Location || order.location || '',
                   
                };
                setOrderToPrint(modifiedOrder);
            } else {
               
                setOrderToPrint(order);
            }
        } else {
        
            setOrderToPrint(order);
            
            
            if (!retailersCache.isLoading) {
                fetchLink({ address: 'masters/getlolDetails' })
                    .then(response => {
                        if (response?.success && Array.isArray(response.data)) {
                            retailersCache.data = response.data;
                            retailersCache.lastFetched = Date.now();
                            setRetailersData(response.data);
                        }
                    })
                    .catch(error => console.error("Failed to load retailers:", error));
            }
        }
        
        setIsPrintModalOpen(true);
    };

    const handlePrintAndSave = async () => {
        try {
            toast.success(`Printing order ${orderToPrint?.id}`);
            return true;
        } catch (error) {
            console.error('Error in print operation:', error);
            toast.error('Error printing order');
            return false;
        }
    };

    const handleClosePrintModal = () => {
        setIsPrintModalOpen(false);
        setOrderToPrint(null);
    };

    const getPrintData = () => {
        if (!orderToPrint) return null;

         
        const subtotal = orderToPrint.beforeTax || orderToPrint.items.reduce((sum, item) => sum + (item.amount || 0), 0);
        const tax = orderToPrint.tax || 0;
        const total = orderToPrint.invoiceValue || (subtotal + tax);

        const staffList = orderToPrint.rawData?.Staff_Involved_List || [];
        const brokerData = staffList.find(staff => staff.EmpType === 'Broker');
        const transportData = staffList.find(staff => staff.EmpType === 'Transport');

        return {
            orderInfo: {
                soId: orderToPrint.soId,
                soInvNo: orderToPrint.id,
                soDate: orderToPrint.date,
                voucherType: orderToPrint.voucher,
            },
            customer: {
                Billl_Name: orderToPrint.Billl_Name || orderToPrint.customerData?.Billl_Name || orderToPrint.customer,
                Short_Name: orderToPrint.customerData?.Short_Name || orderToPrint.customer,
                Address: orderToPrint.customerData?.Address || '',
                City: orderToPrint.location || orderToPrint.customerData?.City || '',
                Mobile_No: orderToPrint.Land_Line || orderToPrint.customerData?.Mobile_No || '',
                Land_Line: orderToPrint.customerData?.Land_Line || '',
                Transporter: transportData?.EmpName || orderToPrint.transportData?.Transporter_Name || orderToPrint.transportData?.Name || '',
                Broker: brokerData?.EmpName || orderToPrint.brokerData?.Broker_Name || orderToPrint.brokerData?.Name || '',
            },
            cartItems: orderToPrint.items.map(item => ({
                ...item,
                Print_Name: item.Print_Name || item.name || item.Product_Name,
                Product_Name: item.Product_Name || item.name,
                price: item.price || item.Item_Rate || 0,
                qty: item.qty || item.Bill_Qty || 0,
                kgs: item.kgs || item.Total_Kgs || 0,
                amount: item.amount || item.Amount || 0,
                Bill_Qty: item.Bill_Qty || item.qty || 0,
                Item_Rate: item.Item_Rate || item.price || 0,
                Amount: item.Amount || item.amount || 0,
            })),
            totals: {
                subtotal: subtotal,
                tax: tax,
                total: total,
                roundOff: orderToPrint.rawData?.Round_off || 0,
            },
           storage: {
            UserName: storage?.UserName || 'User',
            // Add Created_BY_Name to storage
            Created_BY_Name: orderToPrint.rawData?.Created_BY_Name || storage?.UserName || '—',
            Created_on: orderToPrint.rawData?.Created_on || orderToPrint.date || new Date().toISOString()
        }
        };
    };

    const filteredOrders = useMemo(() => {
        return orders;
    }, [orders]);

    const totalSalesValue = filteredOrders.reduce((sum, order) => sum + order.invoiceValue, 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredOrders.length]);

    return (


    
        <div className="h-full bg-gray-50 p-4 sm:p-6 font-sans overflow-hidden flex flex-col">
            <FilterModal
                show={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onSearch={handleSearch}
                onClear={handleClearFilters}
                currentFilters={filters}
            />

            {isPrintModalOpen && orderToPrint && (
                <PrintPreviewModal
                    open={isPrintModalOpen}
                    onClose={handleClosePrintModal}
                    customer={getPrintData()?.customer}
                    cartItems={getPrintData()?.cartItems}
                    totals={getPrintData()?.totals}
                    onPrintAndSave={handlePrintAndSave}
                    storage={getPrintData()?.storage}
                    orderInfo={getPrintData()?.orderInfo}
                    isReprint={true}
                    orderData={{
            Created_BY_Name: orderToPrint.rawData?.Created_BY_Name || storage?.UserName || '—',
            Created_on: orderToPrint.rawData?.Created_on || orderToPrint.date || new Date().toISOString()
        }}
                />
            )}

    
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-3xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Order</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Are you sure you want to delete order <strong>{orderToDelete?.id}</strong>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center space-x-3">
                            <button
                                type="button"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                onClick={cancelDeleteOrder}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                onClick={confirmDeleteOrder}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                        <button
                            onClick={handleGoBack}
                            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors flex items-center shadow-md text-sm sm:text-base"
                            title="Back to POS Screen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to POS
                        </button>
                        
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Sales Orders History</h1>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg font-bold text-base whitespace-nowrap">
                            Total Value: Rs {totalSalesValue.toFixed(2)}
                        </div>
                        
                        <button 
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
                            onClick={() => setIsFilterModalOpen(true)}
                            title="Open Filters"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-3.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[2%]">#</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[5%]">SNo</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[8%]">Date</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">ID</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[25%]">Customer</th>
                                <th className="px-3 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Value</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[8%]">Status</th>
                                <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[12%]">Action</th>
                            </tr>
                        </thead>
                   
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="11" className="px-4 py-12 text-center text-xl text-blue-500 font-semibold animate-pulse">
                                        Loading Sales Order Data...
                                    </td>
                                </tr>
                            ) : currentOrders.length > 0 ? (
                                currentOrders.map((order, index) => (
                                    <tr key={order.id || index} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 w-[2%]">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800 w-[5%]">{index + 1 + startIndex}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 w-[8%]"> {order.date.split('T')[0]}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-gray-800 w-[10%]">{order.id}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium w-[25%]">{order.customer}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-base font-bold text-gray-900 text-right w-[10%]">{order.invoiceValue.toFixed(0)}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm w-[8%]">
                                            <span 
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                                                    ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium w-[12%]">
                                            <div className="flex items-center justify-center space-x-2">
                                                {/* View/Print Invoice button */}
                                                <button 
                                                    className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors" 
                                                    title="View/Print Invoice"
                                                    onClick={() => handlePrintOrder(order)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="px-4 py-12 text-center text-lg text-gray-500">
                                        No sales orders found matching the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-4 mt-6 text-sm text-gray-700">
                    <span className="mb-2 sm:mb-0">Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} records.</span>
                    
                    <div className="flex space-x-1 ml-4">
                        <button 
                            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            title="First Page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            title="Previous Page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
           
                        <span className="px-3 py-2 border rounded-lg bg-blue-50 text-blue-800 font-semibold">{currentPage}</span>
                        
                        <button 
                            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={endIndex >= filteredOrders.length}
                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredOrders.length / rowsPerPage), prev + 1))}
                            title="Next Page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button 
                            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={endIndex >= filteredOrders.length}
                            onClick={() => setCurrentPage(Math.ceil(filteredOrders.length / rowsPerPage))}
                            title="Last Page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderHistory;