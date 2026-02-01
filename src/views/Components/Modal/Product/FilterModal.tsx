import { X } from "lucide-react";

interface FilterModalProps {
    open: boolean;
    onClose: () => void;
    filterValues: {
        minPrice: string;
        maxPrice: string;
        minStock: string;
        maxStock: string;
    };
    setFilterValues: React.Dispatch<React.SetStateAction<{
        minPrice: string;
        maxPrice: string;
        minStock: string;
        maxStock: string;
    }>>;
    onApply: () => void;
}

const ProductFilterModal = ({ open, onClose, filterValues, setFilterValues, onApply }: FilterModalProps) => {
    if (!open) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Filter Produk</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Harga
                            </label>
                            <input
                                type="number"
                                value={filterValues.minPrice}
                                onChange={(e) =>
                                    setFilterValues((prev) => ({ ...prev, minPrice: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Min Harga"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Harga
                            </label>
                            <input
                                type="number"
                                value={filterValues.maxPrice}
                                onChange={(e) =>
                                    setFilterValues((prev) => ({ ...prev, maxPrice: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Max Harga"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Stok
                            </label>
                            <input
                                type="number"
                                value={filterValues.minStock}
                                onChange={(e) =>
                                    setFilterValues((prev) => ({ ...prev, minStock: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Min Stok"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Stok
                            </label>
                            <input
                                type="number"
                                value={filterValues.maxStock}
                                onChange={(e) =>
                                    setFilterValues((prev) => ({ ...prev, maxStock: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Max Stok"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                    <button
                        onClick={() => {
                            setFilterValues({
                                minPrice: "",
                                maxPrice: "",
                                minStock: "",
                                maxStock: ""
                            });
                            onApply();
                            onClose();
                        }}
                        className="px-4 py-2 text-gray-700 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="px-4 py-2 text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilterModal;
