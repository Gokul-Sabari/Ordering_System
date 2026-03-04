import React, { useState, useEffect } from 'react';
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';

const InfoBar = ({ 
    currentCustomerName, 
    onCustomerInputClick,
    onBrokerChange,
    onTransportChange,
    stockDetails 
}) => {
    const [brokers, setBrokers] = useState([]);
    const [transports, setTransports] = useState([]);
    const [selectedBroker, setSelectedBroker] = useState('');
    const [selectedTransport, setSelectedTransport] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
    const [showTransportDropdown, setShowTransportDropdown] = useState(false);
    const [stockGroups, setStockGroups] = useState([]);

    useEffect(() => {
        if (stockDetails && Array.isArray(stockDetails)) {
          
            const grouped = stockDetails.reduce((acc, item) => {
                const groupName = item.Stock_Group;
                if (!acc[groupName]) {
                    acc[groupName] = {
                        name: groupName,
                        items: []
                    };
                }
                acc[groupName].items.push(item);
                return acc;
            }, {});
            
           
            const groupedArray = Object.values(grouped).sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            
            setStockGroups(groupedArray);
        }
    }, [stockDetails]);

   

    const handleBrokerSelect = (broker) => {
        setSelectedBroker(broker);
        setShowBrokerDropdown(false);
        setSearchTerm('');
        if (onBrokerChange) {
            onBrokerChange(broker);
        }
    };

    const handleTransportSelect = (transport) => {
        setSelectedTransport(transport);
        setShowTransportDropdown(false);
        setSearchTerm('');
        if (onTransportChange) {
            onTransportChange(transport);
        }
    };

    const filteredBrokers = brokers.filter(broker =>
        broker.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTransports = transports.filter(transport =>
        transport.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

  
    const customerDisplayName = currentCustomerName?.Bill_Name || 
                                currentCustomerName?.Short_Name || 
                                'Select Customer';

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 mb-4">
      
            <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex-1 min-w-[300px]">
                   
                    <div 
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                        onClick={onCustomerInputClick}
                    >
                        <span className={currentCustomerName?.Bill_Name ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                            {customerDisplayName}
                        </span>
                        <span className="text-teal-600 text-lg">🔍</span>
                    </div>
                </div>

                <div className="flex-1 min-w-[400px]">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                        STOCK GROUPS
                    </label>
                    <div className="border border-gray-300 rounded-lg p-2 bg-gray-50 h-[42px] overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400">
                        {stockGroups.length > 0 ? (
                            stockGroups.map((group, index) => (
                                <React.Fragment key={group.name}>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mr-1">
                                        {group.name} ({group.items.length})
                                    </span>
                                    {index < stockGroups.length - 1 && (
                                        <span className="text-gray-400 mx-0.5">•</span>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">Loading stock groups...</span>
                        )}
                    </div>
                </div>
            </div>

        

{/*         
            {stockGroups.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        <span className="font-semibold">Stock Summary:</span>
                        {stockGroups.slice(0, 5).map(group => {
                            const totalQty = group.items.reduce((sum, item) => sum + (parseFloat(item.Stock_Qty) || 0), 0);
                            return (
                                <span key={group.name} className="bg-gray-100 px-2 py-0.5 rounded-full">
                                    {group.name}: <span className="font-medium">{totalQty.toFixed(0)}</span>
                                </span>
                            );
                        })}
                        {stockGroups.length > 5 && (
                            <span className="text-teal-600">+{stockGroups.length - 5} more</span>
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default InfoBar;