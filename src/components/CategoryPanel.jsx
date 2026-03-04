import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchLink } from './fetchComponent';
import { toast } from 'react-toastify';

const CategoryPanel = ({ activeCategoryId, onCategoryClick, stockDetails, onAddToCart }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localStockDetails, setLocalStockDetails] = useState([]);
    const [posGroups, setPosGroups] = useState([]);
    const [isLoadingPosGroups, setIsLoadingPosGroups] = useState(false);
    const [selectedStockGroup, setSelectedStockGroup] = useState(null);
    const [selectedPOSGroup, setSelectedPOSGroup] = useState(null);
    const [posGroupItems, setPosGroupItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
        }
    };

    useEffect(() => {
        if (stockDetails && Array.isArray(stockDetails) && stockDetails.length > 0) {
            processStockGroups(stockDetails);
            setIsLoading(false);
        } else {
            fetchStockGroups();
        }
    }, [stockDetails]);

    // Fetch POS Groups when a stock group is clicked
    useEffect(() => {
        if (selectedStockGroup && selectedStockGroup !== 'all') {
            fetchPOSGroups(selectedStockGroup);
            // Reset selected POS group and items when stock group changes
            setSelectedPOSGroup(null);
            setPosGroupItems([]);
        } else if (selectedStockGroup === 'all') {
            setPosGroups([]);
            setSelectedPOSGroup(null);
            setPosGroupItems([]);
        }
    }, [selectedStockGroup]);

    const fetchStockGroups = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetchLink({
                address: `pos/StockDetails`
            });
            
            if (response?.success && response.data) {
                setLocalStockDetails(response.data);
                processStockGroups(response.data);
            } else {
                console.warn("No StockDetails found or failed to fetch");
                setCategories([{ id: 'all', name: 'All Items', items: [] }]);
                setError("No stock groups found");
            }
        } catch (error) {
            console.error("Error fetching stock details:", error);
            setError("Failed to fetch stock groups. Check console for details.");
            setCategories([{ id: 'all', name: 'All Items', items: [] }]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPOSGroups = async (stockGroup) => {
        setIsLoadingPosGroups(true);
        setPosGroups([]);
        
        try {
            const response = await fetchLink({
                address: `pos/posGroupsByStock?stockGroup=${encodeURIComponent(stockGroup)}`
            });
            
            console.log("POS Groups response:", response);
            
            if (response?.success && response.data) {
                setPosGroups(response.data);
                
                if (response.data.length === 0) {
                    toast.info(`No POS Groups found for ${stockGroup}`);
                }
            } else {
                console.warn(`No POS Groups found for: ${stockGroup}`);
                setPosGroups([]);
            }
        } catch (error) {
            console.error(`Error fetching POS Groups for ${stockGroup}:`, error);
            setPosGroups([]);
            toast.error(`Failed to load POS Groups for ${stockGroup}`);
        } finally {
            setIsLoadingPosGroups(false);
        }
    };

    const fetchItemsByPOSGroup = async (posGroup) => {
        setIsLoadingItems(true);
        setPosGroupItems([]);
        
        try {
            const response = await fetchLink({
                address: `pos/posGroupList?posGroup=${encodeURIComponent(posGroup)}`
            });
            
            console.log("Items for POS Group:", posGroup, response);
            
            if (response?.success && response.data && response.data.length > 0) {
                setPosGroupItems(response.data);
                toast.success(`Found ${response.data.length} items`);
            } else {
                setPosGroupItems([]);
                toast.warning(`No items found for this POS Group`);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setPosGroupItems([]);
            toast.error("Failed to load items");
        } finally {
            setIsLoadingItems(false);
        }
    };

    const processStockGroups = (data) => {
        if (!data || !Array.isArray(data)) {
            setCategories([{ id: 'all', name: 'All Items', items: [] }]);
            return;
        }

        const uniqueGroups = [...new Set(data.map(item => item.Stock_Group))];
        
        const sortedGroups = uniqueGroups.sort((a, b) => {
            const getNumericPrefix = (str) => {
                const match = str.match(/^(\d+)\./);
                return match ? parseInt(match[1]) : Infinity;
            };
            
            const numA = getNumericPrefix(a);
            const numB = getNumericPrefix(b);
            
            if (numA !== numB) {
                return numA - numB;
            }
            
            return a.localeCompare(b);
        });

        const groupCategories = sortedGroups.map(group => {
            const displayName = group.replace(/^\d+\./, '');
            const groupItems = data.filter(item => item.Stock_Group === group);
            
            return {
                id: group,
                name: displayName,
                originalName: group,
                items: groupItems,
                itemCount: groupItems.length
            };
        });

        setCategories([
            { 
                id: 'all', 
                name: 'All Items', 
                items: data,
                itemCount: data.length 
            },
            ...groupCategories
        ]);
    };

    const getButtonWidth = (name) => {
        const baseWidth = 100;
        const charWidth = 8;
        const totalLength = name.length;
        const calculatedWidth = baseWidth + totalLength * charWidth;
        return `${Math.min(Math.max(100, calculatedWidth), 180)}px`;
    };

    const handleGroupClick = (categoryId) => {
        onCategoryClick(categoryId);
        setSelectedStockGroup(categoryId);
        // Reset POS Group selection and items
        setSelectedPOSGroup(null);
        setPosGroupItems([]);
    };

    const handlePOSGroupClick = (posGroup) => {
        console.log("POS Group clicked:", posGroup);
        setSelectedPOSGroup(posGroup.posGroup);
        fetchItemsByPOSGroup(posGroup.posGroup);
    };

    const handleAddToCart = (item) => {
        console.log("Adding to cart:", item);
        if (onAddToCart) {
            onAddToCart(item);
        } else {
            toast.success(`Added ${item.POS_Item_Name || item.Stock_Item} to cart`);
        }
    };

    const getItemsForDisplay = () => {
        if (selectedPOSGroup && posGroupItems.length > 0) {
            return posGroupItems;
        }
        else if (activeCategoryId === 'all') {
            return stockDetails || localStockDetails;
        } else if (activeCategoryId && activeCategoryId !== 'all') {
            const category = categories.find(c => c.id === activeCategoryId);
            return category?.items || [];
        }
        return [];
    };

    const displayedItems = getItemsForDisplay();

    if (isLoading) {
        return (
            <div className="py-3 mb-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mr-2"></div>
                    <span className="text-gray-500">Loading Stock Groups...</span>
                </div>
            </div>
        );
    }

    if (error && categories.length <= 1) {
        return (
            <div className="py-3 mb-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-center items-center py-2 px-4 bg-red-50 rounded-lg">
                    <span className="text-red-600 text-sm">{error}</span>
                </div>
                <div className="flex flex-wrap justify-start gap-3 px-4 mt-2">
                    <button
                        onClick={() => onCategoryClick('all')}
                        className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-semibold bg-gray-600 text-white shadow-md"
                    >
                        All Items
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-3 mb-4 bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Stock Groups Row with Horizontal Scroll */}
            <div className="relative px-4 mb-4">
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide py-2"
                    style={{ 
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        gap: '0.5rem'
                    }}
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleGroupClick(category.id)}
                            style={{ 
                                width: getButtonWidth(category.name),
                                flexShrink: 0
                            }}
                            className={`
                                inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium 
                                transition-all duration-200 whitespace-nowrap shadow-sm
                                ${activeCategoryId === category.id
                                    ? 'bg-gray-600 text-white shadow-md scale-105 ring-2'
                                    : category.id === 'all'
                                        ? 'bg-gray-500 text-white '
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
                                }
                            `}
                            title={category.originalName || category.name}
                        >
                            {category.name}
                            {category.itemCount > 0 && (
                                <span className={`
                                    ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold
                                    ${activeCategoryId === category.id
                                        ? 'bg-white text-teal-600'
                                        : category.id === 'all'
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-gray-300 text-gray-700'
                                    }
                                `}>
                                    {category.itemCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* POS Groups Section - Shows when a stock group is selected */}
            {selectedStockGroup && selectedStockGroup !== 'all' && (
                <div className="px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-700">
                            POS Groups for {categories.find(c => c.id === selectedStockGroup)?.name}
                        </h4>
                        {isLoadingPosGroups && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                        )}
                    </div>
                    
                    {posGroups.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {posGroups.map((group, index) => (
                                <div
                                    key={index}
                                    className={`
                                        border rounded-lg px-3 py-2 transition-shadow cursor-pointer
                                        ${selectedPOSGroup === group.posGroup 
                                            ? 'bg-teal-600 border-teal-700 text-white shadow-md' 
                                            : 'bg-teal-50 border-teal-200 hover:shadow-md hover:bg-teal-100'
                                        }
                                    `}
                                    onClick={() => handlePOSGroupClick(group)}
                                >
                                    <div className={`
                                        text-sm font-medium
                                        ${selectedPOSGroup === group.posGroup ? 'text-white' : 'text-teal-800'}
                                    `}>
                                        {group.posGroup}
                                    </div>
                                    <div className={`
                                        flex justify-between items-center mt-1 text-xs
                                        ${selectedPOSGroup === group.posGroup ? 'text-teal-100' : 'text-teal-600'}
                                    `}>
                                        <span>Items: {group.itemCount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !isLoadingPosGroups && (
                        <div className="text-sm text-gray-500 italic">
                            No POS Groups available for this category
                        </div>
                    )}
                </div>
            )}

            {/* Loading indicator for items */}
            {isLoadingItems && (
                <div className="px-4 py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            )}

            {/* Items Display Section - Changes only when POS Group is clicked */}
            {!isLoadingItems && displayedItems && displayedItems.length > 0 && (
                <div className="mt-4 px-4 border-t border-gray-100 pt-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>
                            {selectedPOSGroup 
                                ? `${selectedPOSGroup} Items` 
                                : (activeCategoryId === 'all' 
                                    ? 'All Products' 
                                    : `${categories.find(c => c.id === activeCategoryId)?.name} Products`)}
                        </span>
                        <span className="text-teal-600 text-xs bg-teal-50 px-2 py-1 rounded-full">
                            {displayedItems.length} items
                        </span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {displayedItems.map((item, index) => (
                            <div 
                                key={item.Auto_Id || index}
                                className="bg-gray-50 rounded-lg p-2 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-teal-50"
                                onClick={() => handleAddToCart(item)}
                            >
                                <div className="text-xs font-medium text-gray-800 truncate" title={item.POS_Item_Name || item.Stock_Item}>
                                    {item.POS_Item_Name || item.Stock_Item}
                                </div>
                                
                                {/* Show POS Group if available */}
                                {item.POS_Group && (
                                    <div className="text-[10px] text-teal-600 mt-1 truncate">
                                        {item.POS_Group}
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center mt-1">
                                    {item.Brand && (
                                        <span className="text-[10px] text-gray-500 truncate">
                                            {item.Brand}
                                        </span>
                                    )}
                                    {item.Bag && (
                                        <span className="text-[10px] text-gray-500">
                                            {item.Bag}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Additional details in a compact format */}
                                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                    {item.Brokerage && <span>B: {item.Brokerage}</span>}
                                    {item.Coolie && <span>C: {item.Coolie}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {categories.length <= 1 && !error && (
                <div className="flex justify-center items-center py-4 px-4">
                    <span className="text-gray-400 text-sm">No categories available</span>
                </div>
            )}
        </div>
    );
};

export default CategoryPanel;