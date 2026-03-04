import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchLink } from './fetchComponent';

/* =========================
   🔹 SAME AS reactSelectFilterLogic
========================= */
const removeSplChar = (text = '') =>
    text.toString().toUpperCase().replace(/[^A-Z0-9]/g, '');

const ProductList = ({ activeCategoryId, addItemToCart, onAction }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [posProductData, setposProductData] = useState([]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchLink({ address: `pos/productMaster` });
            setposProductData(data.data);

            const posProductData = data?.data?.Pos_Product;

            if (Array.isArray(posProductData) && posProductData.length > 0) {
                const productEntries = posProductData[0].Product_Entry || [];

                const cleanedProducts = productEntries
                    .filter(p => p?.Is_Active == 1)
                    .map(p => ({
                        id: p.Product_Id,
                        name: p.Product_Name,
                        price: parseFloat(p.Price || 0),
                        printName: p.Print_Name,
                        isActive: p.Is_Active == 1,
                        balanceQty: parseFloat(p.Bal_Qty || 0),
                        categoryId: p.IGroup_Id,
                    }));

                setAllProducts(cleanedProducts);
            } else {
                setAllProducts([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch products. Check console for details.");
            setAllProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /* =========================
       🔹 FIXED SEARCH LOGIC
       (NO UI CHANGE)
    ========================= */
    const filteredProducts = useMemo(() => {
        let currentProducts = allProducts;

        if (searchQuery.trim()) {
            const normalizedSearch = removeSplChar(searchQuery);

            currentProducts = currentProducts.filter(product =>
                removeSplChar(product.name).includes(normalizedSearch) ||
                removeSplChar(product.printName).includes(normalizedSearch)
            );
        }

        if (activeCategoryId !== 'all' && activeCategoryId !== undefined) {
            const filterId = parseInt(activeCategoryId);
            currentProducts = currentProducts.filter(
                product => product.categoryId === filterId
            );
        }

        return currentProducts;
    }, [allProducts, searchQuery, activeCategoryId]);

    if (isLoading) {
        return (
            <div className="w-[60%] flex-1 p-4 flex items-center justify-center bg-white rounded-lg shadow-xl">
                <p className="text-xl text-teal-700 font-semibold">
                    Loading Product Master... (API Call)
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[60%] flex-1 p-4 flex items-center justify-center bg-red-100 rounded-lg shadow-xl">
                <p className="text-xl text-red-700 font-semibold">
                    Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="w-[60%] flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">

            <div className="flex p-3 border-b border-gray-200 justify-between items-center">
                <input
                    type="text"
                    placeholder="Search Product Name, Print Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => {
                        const kgMatch = product.name.match(/(\d+)KG/i);
                        const kgValue = kgMatch ? parseInt(kgMatch[1]) : 1;
                        const bagsCount = product.balanceQty / kgValue;

                        return (
                            <div
                                key={product.id}
                                onClick={() => {
                                    if (product.isActive) {
                                        addItemToCart(product);
                                    }
                                }}
                                className={`p-3 border rounded-lg shadow-md transition-all h-32 flex flex-col justify-between 
                                    ${product.isActive
                                        ? 'bg-white hover:bg-teal-50 hover:shadow-lg cursor-pointer border-teal-400'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70 border-gray-300'
                                    }`}
                            >
                                <div>
                                    <p className="font-bold text-sm text-gray-800 truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {product.printName}
                                    </p>
                                </div>

                                <div className="mt-1">
                                    <p className="text-teal-700 font-extrabold text-xl">
                                        Rs {product.price.toFixed(2)}
                                    </p>
                                    <p className={`text-xs font-semibold ${
                                        product.balanceQty > 0 ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                        {product.balanceQty > 0
                                            ? `Stock: ${bagsCount.toFixed(1)} Bags`
                                            : 'OUT OF STOCK'
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 p-8 text-lg">
                            No products found matching the criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
