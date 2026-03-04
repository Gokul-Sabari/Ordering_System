// // import React, { useEffect, useState } from 'react';
// // import { fetchLink } from './fetchComponent';

// // const englishKeyboardLayout = [
// //     ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
// //     ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'BACKSPACE'],
// //     ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE'],
// //     ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
// //     ['@', '.', '-', '_', 'ENTER'],
// // ];

// // const tamilKeyboardLayout = [
// //     ['ஃ', 'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ'],
// //     ['ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'BACKSPACE'],
// //     ['த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'SPACE'],
// //     ['ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', '1', '2'],
// //     ['3', '4', '5', '6', '7', '8', '9', '0', 'ENTER'],
// // ];

// // const UnifiedSearchModal = ({ 
// //     onClose, 
// //     onCustomerSelect, 
// //     onBrokerSelect, 
// //     onTransportSelect,
// //     searchType = "customer"
// // }) => {
// //     const [searchValue, setSearchValue] = useState('');
// //     const [data, setData] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [language, setLanguage] = useState('english');

// //     const handleKeyClick = (key) => {
// //         setSearchValue(prevValue => {
// //             if (key === 'BACKSPACE') return prevValue.slice(0, -1);
// //             if (key === 'SPACE') return prevValue + ' ';
// //             if (key === 'ENTER') return prevValue;
// //             return prevValue + key;
// //         });
// //     };

// //     useEffect(() => {
// //         fetchData();
// //     }, [searchType]);

// //     const fetchData = () => {
// //         setLoading(true);
// //         setData([]);

// //         let apiEndpoint = '';
// //         let dataTransformer = null;

// //         switch (searchType) {
// //             case 'customer':
// //                 apiEndpoint = 'pos/retailerMaster';
// //                 dataTransformer = (response) => {
// //                     if (response.success && response.data.Pos_Retailer) {
// //                         return response.data.Pos_Retailer.flatMap(pr => pr.Retailer_Entry).map(customer => ({
// //                             id: customer.Customer_Id,
// //                             name: customer.Billl_Name,
// //                             mobile: customer.Mobile_No,
// //                             city: customer.City,
// //                             type: 'customer',
// //                             originalData: customer
// //                         }));
// //                     }
// //                     return [];
// //                 };
// //                 break;

// //             case 'broker':
// //                 apiEndpoint = 'pos/brokers';
// //                 dataTransformer = (response) => {
// //                     if (response?.data?.Brokers) {
// //                         return response.data.Brokers.map(broker => ({
// //                             id: broker.Broker_Id,
// //                             name: broker.Broker_Name,
// //                             mobile: broker.Mobile_No || '',
// //                             city: broker.City || '',
// //                             address: broker.Address || '',
// //                             type: 'broker',
// //                             originalData: broker
// //                         }));
// //                     }
// //                     return [];
// //                 };
// //                 break;

// //             case 'transport':
// //                 apiEndpoint = 'pos/transporters';
// //                 dataTransformer = (response) => {
// //                     if (response?.data?.Transporters) {
// //                         return response.data.Transporters.map(transport => ({
// //                             id: transport.Transporter_Id,
// //                             name: transport.Transporter_Name,
// //                             mobile: transport.Mobile_No || '',
// //                             city: transport.City || '',
// //                             address: transport.Address || '',
// //                             vehicleNo: transport.Vehicle_No || '',
// //                             type: 'transport',
// //                             originalData: transport
// //                         }));
// //                     }
// //                     return [];
// //                 };
// //                 break;

// //             default:
// //                 return [];
// //         }

// //         fetchLink({ address: apiEndpoint })
// //             .then(response => {
// //                 const transformedData = dataTransformer(response);
// //                 setData(transformedData);
// //             })
// //             .catch(error => {
// //                 console.error(`Error fetching ${searchType} data:`, error);
// //                 setData([]);
// //             })
// //             .finally(() => {
// //                 setLoading(false);
// //             });
// //     };

// //     const getSearchPlaceholder = () => {
// //         switch (searchType) {
// //             case 'customer': return 'Search customer by name or mobile...';
// //             case 'broker': return 'Search broker by name, mobile, or city...';
// //             case 'transport': return 'Search transporter by name, mobile, or vehicle...';
// //             default: return 'Search...';
// //         }
// //     };

// //     const getModalTitle = () => {
// //         switch (searchType) {
// //             case 'customer': return 'SELECT CUSTOMER';
// //             case 'broker': return 'SELECT BROKER';
// //             case 'transport': return 'SELECT TRANSPORTER';
// //             default: return 'SEARCH';
// //         }
// //     };

// //     const getColumnHeaders = () => {
// //         switch (searchType) {
// //             case 'transport':
// //                 return [
// //                     { width: 'w-1/6', label: 'ID' },
// //                     { width: 'w-1/5', label: 'Name' },
// //                     { width: 'w-1/5', label: 'Mobile' },
// //                     { width: 'w-1/5', label: 'City' },
// //                     { width: 'w-1/5', label: 'Vehicle No' }
// //                 ];
// //             default:
// //                 return [
// //                     { width: 'w-1/6', label: 'ID' },
// //                     { width: 'w-1/4', label: 'Name' },
// //                     { width: 'w-1/4', label: 'Mobile' },
// //                     { width: 'w-1/4', label: 'City' }
// //                 ];
// //         }
// //     };

// //     const filteredData = data.filter(item =>
// //         item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
// //         item.mobile?.includes(searchValue) ||
// //         item.city?.toLowerCase().includes(searchValue.toLowerCase()) ||
// //         (searchType === 'transport' && item.vehicleNo?.toLowerCase().includes(searchValue.toLowerCase()))
// //     );

// //     const handleItemSelect = (item) => {
// //         switch (searchType) {
// //             case 'customer':
// //                 if (onCustomerSelect) onCustomerSelect(item.originalData);
// //                 break;
// //             case 'broker':
// //                 if (onBrokerSelect) onBrokerSelect({
// //                     value: item.id.toString(),
// //                     label: item.name,
// //                     ...item.originalData
// //                 });
// //                 break;
// //             case 'transport':
// //                 if (onTransportSelect) onTransportSelect({
// //                     value: item.id.toString(),
// //                     label: item.name,
// //                     ...item.originalData
// //                 });
// //                 break;
// //         }
// //         onClose();
// //     };

// //     const renderItemRow = (item, index) => {
// //         const headers = getColumnHeaders();
        
// //         return (
// //             <div 
// //                 key={index} 
// //                 className="flex border-b border-gray-100 px-3 py-2 cursor-pointer hover:bg-yellow-50/50 transition-colors"
// //                 onClick={() => handleItemSelect(item)}
// //             >
// //                 {headers.map((header, idx) => (
// //                     <div key={idx} className={header.width}>
// //                         {idx === 0 && <div className="text-gray-600">{item.id}</div>}
// //                         {idx === 1 && <div className="font-semibold text-gray-800">{item.name}</div>}
// //                         {idx === 2 && <div className="text-gray-600">{item.mobile}</div>}
// //                         {idx === 3 && <div className="text-gray-600">{item.city}</div>}
// //                         {idx === 4 && searchType === 'transport' && (
// //                             <div className="text-gray-600">{item.vehicleNo}</div>
// //                         )}
// //                     </div>
// //                 ))}
// //             </div>
// //         );
// //     };

// //     const toggleLanguage = () => {
// //         setLanguage(prev => prev === 'english' ? 'tamil' : 'english');
// //     };

// //     const getCurrentKeyboardLayout = () => {
// //         return language === 'english' ? englishKeyboardLayout : tamilKeyboardLayout;
// //     };

// //     const getKeyboardTitle = () => {
// //         return language === 'english' ? 'Touchscreen Keyboard' : 'தொடுதிரை விசைப்பலகை';
// //     };

// //     const renderKeyboardButton = (key) => {
// //         let className = 'bg-white text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-100 active:bg-gray-200';
// //         let content = key;
// //         const style = {};

// //         if (key === 'BACKSPACE') {
// //             className = 'col-span-2 bg-red-100 text-red-700 font-extrabold py-4 rounded-lg shadow-sm ring-1 ring-red-300 transition-colors text-2xl hover:bg-red-200 active:bg-red-300';
// //             content = '⌫';
// //             style.gridColumn = 'span 2';
// //         } else if (key === 'SPACE') {
// //             className = 'col-span-3 bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-colors text-lg hover:bg-gray-200 active:bg-gray-300';
// //             content = language === 'english' ? 'Space' : 'இடம்';
// //             style.gridColumn = 'span 3';
// //         } else if (key === 'ENTER') {
// //             className = 'col-span-6 bg-green-100 text-green-700 font-extrabold py-4 rounded-lg shadow-sm ring-1 ring-green-300 transition-colors text-2xl hover:bg-green-200 active:bg-green-300';
// //             content = language === 'english' ? 'Enter ↵' : 'உள்ளிட ↵';
// //             style.gridColumn = 'span 6';
// //         } else if (['1','2','3','4','5','6','7','8','9','0','@','.','-','_'].includes(key)) {
// //             className = 'bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-200 active:bg-gray-300';
// //         }

// //         // Special styling for Tamil characters
// //         if (language === 'tamil' && !['BACKSPACE', 'SPACE', 'ENTER', '1','2','3','4','5','6','7','8','9','0','@','.','-','_'].includes(key)) {
// //             className = 'bg-white text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-100 active:bg-gray-200';
// //         }

// //         return (
// //             <button
// //                 key={key}
// //                 className={className}
// //                 style={style}
// //                 onClick={() => handleKeyClick(key)}
// //             >
// //                 {content}
// //             </button>
// //         );
// //     };

// //     return (
// //         <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
// //             <div className="bg-white rounded-lg shadow-2xl w-[90%] h-[90%] max-w-7xl flex flex-col overflow-hidden">
                
// //                 {/* Header */}
// //                 <header className="bg-teal-600 text-white p-3 flex justify-between items-center text-lg font-semibold">
// //                     <span>{getModalTitle()}</span>
// //                     <div className="flex items-center gap-4">
                    
// //                         <button
// //                             onClick={toggleLanguage}
// //                             className="bg-white text-teal-600 px-4 py-1 rounded-full text-sm font-medium border border-teal-500 hover:bg-teal-50 transition-colors flex items-center gap-2"
// //                         >
// //                             <span>{language === 'english' ? 'தமிழ்' : 'English'}</span>
// //                             <span className="text-xs">{language === 'english' ? 'Tamil' : 'ஆங்கிலம்'}</span>
// //                         </button>
// //                         <button 
// //                             onClick={onClose} 
// //                             className="text-white hover:text-gray-300 text-3xl font-light leading-none transition-colors"
// //                         >
// //                             &times;
// //                         </button>
// //                     </div>
// //                 </header>

// //                 <div className="flex flex-1 p-4 gap-4 overflow-hidden">

                 
// //                     <div className="w-[45%] flex flex-col border border-gray-300 rounded-lg overflow-hidden">
                        
// //                         {/* Search Input */}
// //                         <div className="p-3 border-b border-gray-200 flex items-center bg-gray-50">
// //                             <span className="text-xl text-gray-500 mr-2">🔍</span>
// //                             <input
// //                                 type="text"
// //                                 placeholder={getSearchPlaceholder()}
// //                                 value={searchValue}
// //                                 onChange={(e) => setSearchValue(e.target.value)}
// //                                 className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:outline-none text-lg"
// //                             />
// //                         </div>

// //                         {/* Data List */}
// //                         <div className="flex-1 overflow-y-auto bg-white text-base">
// //                             <div className="flex font-bold text-gray-700 bg-gray-100 sticky top-0 border-b border-gray-200 px-3 py-2">
// //                                 {getColumnHeaders().map((header, index) => (
// //                                     <div key={index} className={header.width}>
// //                                         {header.label}
// //                                     </div>
// //                                 ))}
// //                             </div>
                            
// //                             {loading ? (
// //                                 <div className="text-center py-10">
// //                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
// //                                     <p className="text-gray-500 mt-2">Loading {searchType}s...</p>
// //                                 </div>
// //                             ) : (
// //                                 <>
// //                                     {filteredData.map((item, index) => renderItemRow(item, index))}
// //                                     {filteredData.length === 0 && !loading && (
// //                                         <p className="text-center text-gray-500 py-10">
// //                                             No {searchType}s match your search.
// //                                         </p>
// //                                     )}
// //                                 </>
// //                             )}
// //                         </div>
// //                     </div>

// //                     {/* Right Side - Keyboard */}
// //                     <div className="w-[55%] flex flex-col p-4 bg-white rounded-lg shadow-lg border border-gray-200">
// //                         <div className="flex justify-between items-center mb-3">
// //                             <h3 className="text-xl font-bold text-gray-700 text-center flex-1">
// //                                 {getKeyboardTitle()}
// //                             </h3>
// //                             <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
// //                                 {language === 'english' ? 'English' : 'தமிழ்'}
// //                             </div>
// //                         </div>
// //                         <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center">
// //                             <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
// //                                 {getCurrentKeyboardLayout().flat().map((key) => renderKeyboardButton(key))}
// //                             </div>
// //                         </div>
// //                     </div>

// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default UnifiedSearchModal;








// import React, { useEffect, useState } from 'react';
// import { fetchLink } from './fetchComponent';

// const englishKeyboardLayout = [
//     ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
//     ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'BACKSPACE'],
//     ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE'],
//     ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
//     ['@', '.', '-', '_', 'ENTER'],
// ];

// const tamilKeyboardLayout = [
//     ['ஃ', 'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ'],
//     ['ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'BACKSPACE'],
//     ['த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'SPACE'],
//     ['ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', '1', '2'],
//     ['3', '4', '5', '6', '7', '8', '9', '0', 'ENTER'],
// ];

// const UnifiedSearchModal = ({ 
//     onClose, 
//     onCustomerSelect, 
//     onBrokerSelect, 
//     onTransportSelect,
//     searchType = "customer"
// }) => {
//     const [searchValue, setSearchValue] = useState('');
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [language, setLanguage] = useState('english');

//     // Function to normalize text by removing special characters and spaces
//     const normalizeText = (text) => {
//         if (!text) return '';
//         return text
//             .toString()
//             .toLowerCase()
//             .replace(/[\/\.\(\)\-\s]/g, ''); // Remove /, ., (, ), -, and spaces
//     };

//     const handleKeyClick = (key) => {
//         setSearchValue(prevValue => {
//             if (key === 'BACKSPACE') return prevValue.slice(0, -1);
//             if (key === 'SPACE') return prevValue + ' ';
//             if (key === 'ENTER') return prevValue;
//             return prevValue + key;
//         });
//     };

//     useEffect(() => {
//         fetchData();
//     }, [searchType]);

//     const fetchData = () => {
//         setLoading(true);
//         setData([]);

//         let apiEndpoint = '';
//         let dataTransformer = null;

//         switch (searchType) {
//             case 'customer':
//                 apiEndpoint = 'pos/retailerMaster';
//                 dataTransformer = (response) => {
//                     if (response.success && response.data.Pos_Retailer) {
//                         return response.data.Pos_Retailer.flatMap(pr => pr.Retailer_Entry).map(customer => ({
//                             id: customer.Customer_Id,
//                             name: customer.Billl_Name,
//                             shortName: customer.Short_Name, 
//                             mobile: customer.Mobile_No,
//                             city: customer.City,
//                             type: 'customer',
//                             originalData: customer
//                         }));
//                     }
//                     return [];
//                 };
//                 break;

//             case 'broker':
//                 apiEndpoint = 'pos/brokers';
//                 dataTransformer = (response) => {
//                     if (response?.data?.Brokers) {
//                         return response.data.Brokers.map(broker => ({
//                             id: broker.Broker_Id,
//                             name: broker.Broker_Name,
//                             mobile: broker.Mobile_No || '',
//                             city: broker.City || '',
//                             address: broker.Address || '',
//                             type: 'broker',
//                             originalData: broker
//                         }));
//                     }
//                     return [];
//                 };
//                 break;

//             case 'transport':
//                 apiEndpoint = 'pos/transporters';
//                 dataTransformer = (response) => {
//                     if (response?.data?.Transporters) {
//                         return response.data.Transporters.map(transport => ({
//                             id: transport.Transporter_Id,
//                             name: transport.Transporter_Name,
//                             mobile: transport.Mobile_No || '',
//                             city: transport.City || '',
//                             address: transport.Address || '',
//                             vehicleNo: transport.Vehicle_No || '',
//                             type: 'transport',
//                             originalData: transport
//                         }));
//                     }
//                     return [];
//                 };
//                 break;

//             default:
//                 return [];
//         }

//         fetchLink({ address: apiEndpoint })
//             .then(response => {
//                 const transformedData = dataTransformer(response);
//                 setData(transformedData);
//             })
//             .catch(error => {
//                 console.error(`Error fetching ${searchType} data:`, error);
//                 setData([]);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     const getSearchPlaceholder = () => {
//         switch (searchType) {
//             case 'customer': return 'Search customer by name or mobile...';
//             case 'broker': return 'Search broker by name...';
//             case 'transport': return 'Search transporter by name or vehicle...';
//             default: return 'Search...';
//         }
//     };

//     const getModalTitle = () => {
//         switch (searchType) {
//             case 'customer': return 'SELECT CUSTOMER';
//             case 'broker': return 'SELECT BROKER';
//             case 'transport': return 'SELECT TRANSPORTER';
//             default: return 'SEARCH';
//         }
//     };

//     const getColumnHeaders = () => {
//         switch (searchType) {
//             case 'customer':
//                 return [
//                     { width: 'w-1/3', label: 'Name' },
//                     { width: 'w-1/3', label: 'Mobile' },
//                     { width: 'w-1/3', label: 'City' }
//                 ];
//             case 'broker':
//                 return [
//                     { width: 'w-1/2', label: 'ID' },
//                     { width: 'w-1/2', label: 'Name' }
//                 ];
//             case 'transport':
//                 return [
//                     { width: 'w-1/3', label: 'ID' },
//                     { width: 'w-1/3', label: 'Name' },
//                     // { width: 'w-1/3', label: 'Vehicle No' }
//                 ];
//             default:
//                 return [
//                     { width: 'w-1/6', label: 'ID' },
//                     { width: 'w-1/4', label: 'Name' },
//                     { width: 'w-1/4', label: 'Mobile' },
//                     { width: 'w-1/4', label: 'City' }
//                 ];
//         }
//     };

//     // Improved fuzzy search with normalized text matching
//     const filteredData = data.filter(item => {
//         if (!searchValue.trim()) return true;
        
//         // Normalize search query
//         const normalizedSearch = normalizeText(searchValue);
        
//         // Create searchable text from all relevant fields and normalize it
//         const searchableText = normalizeText([
//             item.name,
//             item.mobile,
//             item.city,
//             searchType === 'transport' ? item.vehicleNo : '',
//             searchType === 'customer' ? item.originalData?.Short_Name : '',
//             searchType === 'customer' ? item.originalData?.Billl_Name : ''
//         ]
//         .filter(Boolean)
//         .join(' '));
        
//         // Check if normalized search query is found in normalized searchable text
//         return searchableText.includes(normalizedSearch);
//     });

//     const handleItemSelect = (item) => {
//         switch (searchType) {
//             case 'customer':
//                 if (onCustomerSelect) onCustomerSelect(item.originalData);
//                 break;
//             case 'broker':
//                 if (onBrokerSelect) onBrokerSelect({
//                     value: item.id.toString(),
//                     label: item.name,
//                     ...item.originalData
//                 });
//                 break;
//             case 'transport':
//                 if (onTransportSelect) onTransportSelect({
//                     value: item.id.toString(),
//                     label: item.name,
//                     ...item.originalData
//                 });
//                 break;
//         }
//         onClose();
//     };

//     const renderItemRow = (item, index) => {
//         const headers = getColumnHeaders();
        
//         return (
//             <div 
//                 key={index} 
//                 className="flex border-b border-gray-100 px-3 py-2 cursor-pointer hover:bg-yellow-50/50 transition-colors"
//                 onClick={() => handleItemSelect(item)}
//             >
            
//                 {headers.map((header, idx) => (
//                     <div key={idx} className={header.width}>
        
//                         {/* For customer search, show Short_Name from originalData */}
//                         {searchType === 'customer' && idx === 0 && (
//                             <div className="font-semibold text-gray-800">
//                                 {item.originalData?.Short_Name || item.name}
//                             </div>
//                         )}
//                         {searchType === 'customer' && idx === 1 && <div className="text-gray-600">{item.mobile}</div>}
//                         {searchType === 'customer' && idx === 2 && <div className="text-gray-600">{item.city}</div>}
                        
                
//                         {searchType === 'broker' && idx === 0 && <div className="text-gray-600">{item.id}</div>}
//                         {searchType === 'broker' && idx === 1 && <div className="font-semibold text-gray-800">{item.name}</div>}
                        
            
//                         {searchType === 'transport' && idx === 0 && <div className="text-gray-600">{item.id}</div>}
//                         {searchType === 'transport' && idx === 1 && <div className="font-semibold text-gray-800">{item.name}</div>}
//                         {searchType === 'transport' && idx === 2 && <div className="text-gray-600">{item.vehicleNo}</div>}
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     const toggleLanguage = () => {
//         setLanguage(prev => prev === 'english' ? 'tamil' : 'english');
//     };

//     const getCurrentKeyboardLayout = () => {
//         return language === 'english' ? englishKeyboardLayout : tamilKeyboardLayout;
//     };

//     const getKeyboardTitle = () => {
//         return language === 'english' ? 'Touchscreen Keyboard' : 'தொடுதிரை விசைப்பலகை';
//     };

//     const renderKeyboardButton = (key) => {
//         let className = 'bg-white text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-100 active:bg-gray-200';
//         let content = key;
//         const style = {};

//         if (key === 'BACKSPACE') {
//             className = 'col-span-2 bg-red-100 text-red-700 font-extrabold py-4 rounded-lg shadow-sm ring-1 ring-red-300 transition-colors text-2xl hover:bg-red-200 active:bg-red-300';
//             content = '⌫';
//             style.gridColumn = 'span 2';
//         } else if (key === 'SPACE') {
//             className = 'col-span-3 bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-colors text-lg hover:bg-gray-200 active:bg-gray-300';
//             content = language === 'english' ? 'Space' : 'இடம்';
//             style.gridColumn = 'span 3';
//         } else if (key === 'ENTER') {
//             className = 'col-span-6 bg-green-100 text-green-700 font-extrabold py-4 rounded-lg shadow-sm ring-1 ring-green-300 transition-colors text-2xl hover:bg-green-200 active:bg-green-300';
//             content = language === 'english' ? 'Enter ↵' : 'உள்ளிட ↵';
//             style.gridColumn = 'span 6';
//         } else if (['1','2','3','4','5','6','7','8','9','0','@','.','-','_'].includes(key)) {
//             className = 'bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-200 active:bg-gray-300';
//         }

      
//         if (language === 'tamil' && !['BACKSPACE', 'SPACE', 'ENTER', '1','2','3','4','5','6','7','8','9','0','@','.','-','_'].includes(key)) {
//             className = 'bg-white text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-100 active:bg-gray-200';
//         }

//         return (
//             <button
//                 key={key}
//                 className={className}
//                 style={style}
//                 onClick={() => handleKeyClick(key)}
//             >
//                 {content}
//             </button>
//         );
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
//             <div className="bg-white rounded-lg shadow-2xl w-[90%] h-[90%] max-w-7xl flex flex-col overflow-hidden">
                
//                 <header className="bg-teal-600 text-white p-3 flex justify-between items-center text-lg font-semibold">
//                     <span>{getModalTitle()}</span>
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={toggleLanguage}
//                             className="bg-white text-teal-600 px-4 py-1 rounded-full text-sm font-medium border border-teal-500 hover:bg-teal-50 transition-colors flex items-center gap-2"
//                         >
//                             <span>{language === 'english' ? 'தமிழ்' : 'English'}</span>
//                             <span className="text-xs">{language === 'english' ? 'Tamil' : 'ஆங்கிலம்'}</span>
//                         </button>
//                         <button 
//                             onClick={onClose} 
//                             className="text-white hover:text-gray-300 text-3xl font-light leading-none transition-colors"
//                         >
//                             &times;
//                         </button>
//                     </div>
//                 </header>

//                 <div className="flex flex-1 p-4 gap-4 overflow-hidden">

//                     {/* Data List Section - Larger width */}
//                     <div className="w-[70%] flex flex-col border border-gray-300 rounded-lg overflow-hidden">
//                         <div className="p-3 border-b border-gray-200 flex items-center bg-gray-50">
//                             <span className="text-xl text-gray-500 mr-2">🔍</span>
//                             <input
//                                 type="text"
//                                 placeholder={getSearchPlaceholder()}
//                                 value={searchValue}
//                                 onChange={(e) => setSearchValue(e.target.value)}
//                                 className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:outline-none text-lg"
//                             />
//                         </div>

//                         <div className="flex-1 overflow-y-auto bg-white text-base max-h-[calc(100vh-200px)]">
//                             <div className="flex font-bold text-gray-700 bg-gray-100 sticky top-0 border-b border-gray-200 px-3 py-2">
//                                 {getColumnHeaders().map((header, index) => (
//                                     <div key={index} className={header.width}>
//                                         {header.label}
//                                     </div>
//                                 ))}
//                             </div>
                            
//                             {loading ? (
//                                 <div className="text-center py-10">
//                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
//                                     <p className="text-gray-500 mt-2">Loading {searchType}s...</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     {filteredData.map((item, index) => renderItemRow(item, index))}
//                                     {filteredData.length === 0 && !loading && (
//                                         <p className="text-center text-gray-500 py-10">
//                                             No {searchType}s match your search.
//                                         </p>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* Keyboard Section - Smaller width */}
//                     <div className="w-[50%] flex flex-col p-4 bg-white rounded-lg shadow-lg border border-gray-200">
//                         <div className="flex justify-between items-center mb-3">
//                             <h3 className="text-xl font-bold text-gray-700 text-center flex-1">
//                                 {getKeyboardTitle()}
//                             </h3>
//                             <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                                 {language === 'english' ? 'English' : 'தமிழ்'}
//                             </div>
//                         </div>
//                         <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center">
//                             <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
//                                 {getCurrentKeyboardLayout().flat().map((key) => renderKeyboardButton(key))}
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UnifiedSearchModal;



import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchLink } from './fetchComponent';

const englishKeyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'BACKSPACE'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE'],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '.', '-', '_', 'ENTER'],
];

const tamilKeyboardLayout = [
    ['ஃ', 'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ'],
    ['ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'BACKSPACE'],
    ['த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'SPACE'],
    ['ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', '1', '2'],
    ['3', '4', '5', '6', '7', '8', '9', '0', 'ENTER'],
];

const ITEMS_PER_PAGE = 12;


const removeSplChar = (text = '') =>
    text
        .toString()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');


const UnifiedSearchModal = ({ 
    onClose, 
    onCustomerSelect, 
    onBrokerSelect, 
    onTransportSelect,
    searchType = "customer"
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('english');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchDebounced, setSearchDebounced] = useState('');
    const abortControllerRef = useRef(null);
    const isInitialMountRef = useRef(true);
    const lastRequestRef = useRef({ page: null, search: null, searchType: null });
    const [allData, setAllData] = useState([]);


    

    const normalizeForSearch = useCallback((text) => {
        if (!text) return '';
        return text
            .toUpperCase()
            .replace(/[.\s\-_\/,()]/g, '')
            .trim();
    }, []);

 
  const searchInData = useCallback((searchTerm, dataArray) => {
        if (!searchTerm.trim()) return dataArray;

        const normalizedSearch = removeSplChar(searchTerm);

        return dataArray.filter(item => {
            let fields = [];

            switch (searchType) {
                case 'customer':
                    fields = [
                        item.originalData?.Billl_Name,
                        item.originalData?.Short_Name,
                        item.originalData?.Customer_Id,
                        item.originalData?.Mobile_No
                    ];
                    break;

                case 'broker':
                    fields = [
                        item.originalData?.Broker_Name,
                        item.originalData?.Broker_Id,
                        item.originalData?.Mobile_No
                    ];
                    break;

                case 'transport':
                    fields = [
                        item.originalData?.Transporter_Name,
                        item.originalData?.Transporter_Id,
                        item.originalData?.Vehicle_No
                    ];
                    break;
            }

            return fields.some(field =>
                removeSplChar(field).includes(normalizedSearch)
            );
        });
    }, [searchType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounced(searchValue);
            setCurrentPage(1); 
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue]);

     useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounced(searchValue);
            setCurrentPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchValue]);



    const transformData = useCallback((response, type) => {
        switch (type) {
            case 'customer':
                if (Array.isArray(response.data)) {
                    return response.data.map(customer => ({
                        id: customer.Customer_Id,
                        name: customer.Billl_Name,
                        shortName: customer.Short_Name, 
                        mobile: customer.Mobile_No,
                        city: customer.City,
                        type: 'customer',
                        originalData: customer,
                        normalizedName: normalizeForSearch(customer.Billl_Name),
                        normalizedShortName: normalizeForSearch(customer.Short_Name)
                    }));
                }
                return [];
            
            case 'broker':
                if (response?.data?.Brokers) {
                    return response.data.Brokers.map(broker => ({
                        id: broker.Broker_Id,
                        name: broker.Broker_Name,
                        mobile: broker.Mobile_No || '',
                        city: broker.City || '',
                        address: broker.Address || '',
                        type: 'broker',
                        originalData: broker,
                        normalizedName: normalizeForSearch(broker.Broker_Name)
                    }));
                }
                return [];
            
            case 'transport':
                if (response?.data?.Transporters) {
                    return response.data.Transporters.map(transport => ({
                        id: transport.Transporter_Id,
                        name: transport.Transporter_Name,
                        mobile: transport.Mobile_No || '',
                        city: transport.City || '',
                        address: transport.Address || '',
                        vehicleNo: transport.Vehicle_No || '',
                        type: 'transport',
                        originalData: transport,
                        normalizedName: normalizeForSearch(transport.Transporter_Name)
                    }));
                }
                return [];
            
            default:
                return [];
        }
    }, [normalizeForSearch]);


   const fetchAllData = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setLoading(true);

        const apiMap = {
            customer: 'pos/retailerMasterOpt',
            broker: 'pos/brokersOpt',
            transport: 'pos/transportersOpt'
        };

        try {
            const res = await fetchLink({
                address: apiMap[searchType],
                method: 'GET',
                params: { limit: 10000000, page: 1 },
                others: { signal: abortControllerRef.current.signal }
            });

            const transformed = transformData(res, searchType);
            setAllData(transformed);

            const filtered = searchDebounced
                ? searchInData(searchDebounced, transformed)
                : transformed;

            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

            setData(paginated);
            setTotalItems(filtered.length);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, [searchType, searchDebounced, currentPage, searchInData]);


    useEffect(() => {
        if (allData.length > 0 && allData.length <= 500) {
            let filteredData = allData;
            if (searchDebounced.trim()) {
                filteredData = searchInData(searchDebounced, allData);
            }
            
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedData = filteredData.slice(startIndex, endIndex);
            
            setData(paginatedData);
            setTotalItems(filteredData.length);
            setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
        }
    }, [searchDebounced, currentPage, allData, searchInData]);

    useEffect(() => {

        setSearchValue('');
        setSearchDebounced('');
        setCurrentPage(1);
        setData([]);
        setAllData([]);
        setTotalItems(0);
        setTotalPages(0);
        
        lastRequestRef.current = { page: null, search: null, searchType: null };

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        isInitialMountRef.current = true;
        
        const timer = setTimeout(() => {
            fetchAllData();
            isInitialMountRef.current = false;
        }, 100);
        
        return () => clearTimeout(timer);
    }, [searchType]);

    useEffect(() => {
        if (isInitialMountRef.current) {
            return;
        }
        
        if (!searchType) return;
        
 
        if (allData.length > 0 && allData.length <= 500) {
            return;
        }
        
 
        const timer = setTimeout(() => {
            fetchAllData();
        }, 200);
        
        return () => {
            clearTimeout(timer);
        };
    }, [currentPage, searchDebounced, searchType]);

    const handlePageChange = (newPage) => {
        if (newPage === currentPage || loading) return;
        setCurrentPage(newPage);
    };

    const handleKeyClick = (key) => {
        setSearchValue(prevValue => {
            if (key === 'BACKSPACE') return prevValue.slice(0, -1);
            if (key === 'SPACE') return prevValue + ' ';
            if (key === 'ENTER') return prevValue;
            return prevValue + key;
        });
    };

    const getSearchPlaceholder = () => {
        const examples = {
         
        };
        
        return examples[searchType] || 'Search...';
    };

    const getModalTitle = () => {
        switch (searchType) {
            case 'customer': return 'SELECT CUSTOMER (Smart Search)';
            case 'broker': return 'SELECT BROKER (Smart Search)';
            case 'transport': return 'SELECT TRANSPORTER (Smart Search)';
            default: return 'SEARCH';
        }
    };

    const getColumnHeaders = () => {
        switch (searchType) {
            case 'customer':
                return [
                    { width: 'w-1/6', label: 'ID' },
                    { width: 'w-2/3', label: 'Name' },
                    { width: 'w-1/6', label: 'Mobile' }
                ];
            case 'broker':
                return [
                    { width: 'w-1/2', label: 'ID' },
                    { width: 'w-1/2', label: 'Name' }
                ];
            case 'transport':
                return [
                    { width: 'w-1/3', label: 'ID' },
                    { width: 'w-1/3', label: 'Name' },
                ];
            default:
                return [
                    { width: 'w-1/6', label: 'ID' },
                    { width: 'w-1/4', label: 'Name' },
                    { width: 'w-1/4', label: 'Mobile' },
                    { width: 'w-1/4', label: 'City' }
                ];
        }
    };

    const handleItemSelect = (item) => {
        switch (searchType) {
            case 'customer':
                if (onCustomerSelect) onCustomerSelect(item.originalData);
                break;
            case 'broker':
                if (onBrokerSelect) onBrokerSelect({
                    value: item.id.toString(),
                    label: item.name,
                    ...item.originalData
                });
                break;
            case 'transport':
                if (onTransportSelect) onTransportSelect({
                    value: item.id.toString(),
                    label: item.name,
                    ...item.originalData
                });
                break;
        }
        onClose();
    };

    const renderItemRow = (item, index) => {
        const headers = getColumnHeaders();
        

        const highlightSearchTerm = (text) => {
            if (!searchValue || searchValue.length < 2) return text;
            
            const normalizedText = normalizeForSearch(text);
            const normalizedSearch = normalizeForSearch(searchValue);
            
          
            const searchIndex = normalizedText.indexOf(normalizedSearch);
            
            if (searchIndex === -1) return text;


            return (
                <span>
                    {text.split('').map((char, i) => {
                        const normalizedChar = normalizeForSearch(char);
                        if (normalizedSearch.includes(normalizedChar)) {
                            return <span key={i} className="bg-yellow-200 font-bold">{char}</span>;
                        }
                        return char;
                    })}
                </span>
            );
        };
        
        return (
            <div 
                key={`${item.id}-${index}-${currentPage}`}
                className="flex border-b border-gray-100 px-3 py-2 cursor-pointer hover:bg-yellow-50/50 transition-colors"
                onClick={() => handleItemSelect(item)}
            >
                {headers.map((header, idx) => (
                    <div key={idx} className={`${header.width} flex items-center`}>
                        {searchType === 'customer' && idx === 0 && (
                            <div className="text-gray-600 font-medium text-sm">{item.id}</div>
                        )}
                        {searchType === 'customer' && idx === 1 && (
                            <div className="font-semibold text-gray-800 truncate" title={item.name}>
                                {item.shortName}
                                {/* {item.shortName && item.shortName !== item.name && (
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        ({item.shortName})
                                    </div>
                                )} */}

                                {item.name && item.name !== item.shortName && (
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        ({item.name})
                                    </div>
                                )}
                            </div>
                        )}
                        {searchType === 'customer' && idx === 2 && (
                            <div className="text-gray-600 text-sm">{item.mobile}</div>
                        )}
                        
                        {searchType === 'broker' && idx === 0 && (
                            <div className="text-gray-600">{item.id}</div>
                        )}
                        {searchType === 'broker' && idx === 1 && (
                            <div className="font-semibold text-gray-800">{item.name}</div>
                        )}
                        
                        {searchType === 'transport' && idx === 0 && (
                            <div className="text-gray-600">{item.id}</div>
                        )}
                        {searchType === 'transport' && idx === 1 && (
                            <div className="font-semibold text-gray-800">{item.name}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'english' ? 'tamil' : 'english');
    };

    const getCurrentKeyboardLayout = () => {
        return language === 'english' ? englishKeyboardLayout : tamilKeyboardLayout;
    };

    const getKeyboardTitle = () => {
        return language === 'english' ? 'Touchscreen Keyboard' : 'தொடுதிரை விசைப்பலகை';
    };

    const renderKeyboardButton = (key) => {
        let className = 'bg-white text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-100 active:bg-gray-200';
        let content = key;
        const style = {};

        if (key === 'BACKSPACE') {
            className = 'col-span-2 bg-red-100 text-red-700 font-extrabold py-4 rounded-lg shadow-sm ring-1 ring-red-300 transition-colors text-2xl hover:bg-red-200 active:bg-red-300';
            content = '⌫';
            style.gridColumn = 'span 2';
        } else if (key === 'SPACE') {
            className = 'col-span-3 bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-colors text-lg hover:bg-gray-200 active:bg-gray-300';
            content = language === 'english' ? 'Space' : 'இடம்';
            style.gridColumn = 'span 3';
        } else if (key === 'ENTER') {
            className = 'col-span-6 bg-green-100 text-green-700 font-extrabold py-4 rounded-lg shadow-sm ring-1 ring-green-300 transition-colors text-2xl hover:bg-green-200 active:bg-green-300';
            content = language === 'english' ? 'Enter ↵' : 'உள்ளிட ↵';
            style.gridColumn = 'span 6';
        } else if (['1','2','3','4','5','6','7','8','9','0','@','.','-','_'].includes(key)) {
            className = 'bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-200 active:bg-gray-300';
        }

        if (language === 'tamil' && !['BACKSPACE', 'SPACE', 'ENTER', '1','2','3','4','5','6','7','8','9','0','@','.','-','_'].includes(key)) {
            className = 'bg-white text-gray-700 font-semibold py-4 rounded-lg shadow-sm ring-1 ring-gray-300 transition-all text-xl hover:bg-gray-100 active:bg-gray-200';
        }

        return (
            <button
                key={key}
                className={className}
                style={style}
                onClick={() => handleKeyClick(key)}
            >
                {content}
            </button>
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const startItem = ((currentPage - 1) * ITEMS_PER_PAGE) + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

        return (
            <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 bg-gray-50">
                <div className="text-sm text-gray-700">
                    Page <span className="font-bold">{currentPage}</span> of{' '}
                    <span className="font-bold">{totalPages}</span> • Showing{' '}
                    <span className="font-semibold">{startItem}</span> to{' '}
                    <span className="font-semibold">{endItem}</span> of{' '}
                    <span className="font-semibold">{totalItems}</span> results
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                            currentPage === 1 || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
         
                        {startPage > 1 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={loading}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                                        loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    1
                                </button>
                                {startPage > 2 && <span className="px-2">...</span>}
                            </>
                        )}

              
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                            const pageNum = startPage + i;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    disabled={loading}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                                        currentPage === pageNum
                                            ? 'bg-teal-600 text-white'
                                            : loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

     
                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && <span className="px-2">...</span>}
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={loading}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                                        loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                            currentPage === totalPages || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl w-[90%] h-[90%] max-w-7xl flex flex-col overflow-hidden">
                
                <header className="bg-teal-600 text-white p-3 flex justify-between items-center text-lg font-semibold">
                    <span>{getModalTitle()}</span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="bg-white text-teal-600 px-4 py-1 rounded-full text-sm font-medium border border-teal-500 hover:bg-teal-50 transition-colors flex items-center gap-2"
                        >
                            <span>{language === 'english' ? 'தமிழ்' : 'English'}</span>
                            <span className="text-xs">{language === 'english' ? 'Tamil' : 'ஆங்கிலம்'}</span>
                        </button>
                        <button 
                            onClick={onClose} 
                            className="text-white hover:text-gray-300 text-3xl font-light leading-none transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 p-4 gap-4 overflow-hidden">
                    {/* Data List Section */}
                    <div className="w-[70%] flex flex-col border border-gray-300 rounded-lg overflow-hidden">
                        <div className="p-3 border-b border-gray-200 flex items-center bg-gray-50">
                            <span className="text-xl text-gray-500 mr-2">🔍</span>
                            <input
                                type="text"
                                placeholder={getSearchPlaceholder()}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:outline-none text-lg"
                            />
                            {loading && (
                                <div className="ml-2 animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto bg-white text-base max-h-[calc(100vh-250px)]">
                            <div className="flex font-bold text-gray-700 bg-gray-100 sticky top-0 border-b border-gray-200 px-3 py-2">
                                {getColumnHeaders().map((header, index) => (
                                    <div key={index} className={header.width}>
                                        {header.label}
                                    </div>
                                ))}
                            </div>
                            
                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Searching... (Smart matching enabled)</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-xs text-gray-500 px-3 py-1 bg-blue-50 flex justify-between">
                                        {/* <span> */}
                                            {/* Search: "{searchValue || 'All'}" •  */}
                                            {/* Found {totalItems} {searchType}s •  */}
                                            {/* <span className="ml-2 text-green-600"> */}
                                                {/* Smart search: Matches with/without dots/spaces */}
                                            {/* </span> */}
                                        {/* </span> */}
                                        <span>Page {currentPage} of {totalPages}</span>
                                    </div>
                                    {data.map((item, index) => renderItemRow(item, index))}
                                    {data.length === 0 && !loading && (
                                        <div className="text-center text-gray-500 py-10">
                                            <p>No {searchType}s found for "{searchValue}".</p>
                                            <p className="text-sm mt-2">
                                                {/* Try searching without dots or spaces.<br/> */}
                                                {/* Example: Search "AAA" for "A.AATHIRAJAN" or "A ATHIRAJAN" */}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Pagination */}
                        {renderPagination()}
                    </div>

                    {/* Keyboard Section */}
                    <div className="w-[50%] flex flex-col p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-gray-700 text-center flex-1">
                                {getKeyboardTitle()}
                            </h3>
                            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {language === 'english' ? 'English' : 'தமிழ்'}
                            </div>
                        </div>
                        <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center">
                            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
                                {getCurrentKeyboardLayout().flat().map((key) => renderKeyboardButton(key))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedSearchModal;