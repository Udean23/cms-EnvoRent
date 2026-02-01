import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Box, CheckCircle, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import productsData from "@/core/dummy/productdummy";

const dummyProductDetail = {
    id: "REEBOK-ZIG-1325",
    brand: "Reebok",
    name: "Reebok Zig Kinetica 3",
    category: "Shoes",
    subCategory: "Men",
    price: 3084500,
    currency: "IDR",
    image: "/public/img/Products/shoes1.png",
    rating: 4.5,
    reviews: 42,
    description: `The Reebok Zig Kinetica 3 is designed to keep you moving comfortably. 
  
Featuring a zigzag sole that provides energy return and cushioning, these shoes are perfect for both running and casual wear. The breathable mesh upper ensures your feet stay cool, while the modern design adds a stylish touch to your outfit.

Features:
• Energy-returning Zig Energy Shell
• Breathable mesh upper
• Responsive Floatride Fuel cushioning
• Durable rubber outsole
• Stylish futuristic design

Suitable for:
- Daily running
- Gym sessions
- Casual streetwear
- All-day comfort seekers`,
    variants: [
        {
            color: "White",
            images: ["/public/img/Products/shoes1.png"],
            sizes: [
                { size: 40, stock: 5 },
                { size: 41, stock: 8 },
                { size: 42, stock: 10 },
                { size: 43, stock: 6 },
                { size: 44, stock: 7 },
                { size: 45, stock: 3 }
            ]
        },
        {
            color: "Black",
            images: ["/public/img/Products/shoes2.png"],
            sizes: [
                { size: 40, stock: 7 },
                { size: 41, stock: 9 },
                { size: 42, stock: 11 },
                { size: 43, stock: 6 },
                { size: 44, stock: 8 },
                { size: 45, stock: 4 }
            ]
        }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false,
    status: "active"
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState<any>(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const foundProduct = productsData.find((p) => p.id === id);

        if (foundProduct) {
            const enrichedProduct = {
                ...foundProduct,
                description: foundProduct.id === dummyProductDetail.id ? dummyProductDetail.description : `Deskripsi lengkap untuk produk ${foundProduct.name}.\n\nProduk ini dibuat dengan bahan berkualitas tinggi dan desain yang ergonomis untuk kenyamanan maksimal. Cocok untuk penggunaan sehari-hari maupun aktivitas olahraga.\n\nFitur Utama:\n- Bahan premium yang tahan lama\n- Desain modern dan stylish\n- Nyaman digunakan dalam waktu lama\n- Tersedia dalam berbagai pilihan warna dan ukuran`,
                status: "active"
            };
            setProductData(enrichedProduct);
        } else {
            if (!id) setProductData(dummyProductDetail);
        }
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    const formatPrice = (price: number) => {
        return price.toLocaleString("id-ID");
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!productData) {
        return (
            <div className="p-6 space-y-6">
                <Breadcrumb title="Detail Produk" desc="Data Produk" />
                <div className="bg-white rounded-lg p-8 text-center text-gray-500 py-12">
                    Produk tidak ditemukan.
                </div>
            </div>
        );
    }

    const variants = productData.variants || [];

    const totalStock = variants.reduce((acc: number, variant: any) => {
        return acc + variant.sizes.reduce((sAcc: number, s: any) => sAcc + s.stock, 0);
    }, 0);

    return (
        <div className="p-6">
            <Breadcrumb title="Detail Produk" desc="Data Produk" />

            <div className="bg-white p-6 rounded-xl shadow-md mt-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-[420px]">
                        <img
                            src={variants[selectedVariantIndex]?.images[0] || productData.image}
                            alt={productData.name}
                            className="w-full h-[480px] object-cover rounded-xl shadow bg-gray-100"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {productData.brand}
                                </span>
                                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {productData.category} / {productData.subCategory}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 uppercase">
                                {productData.name}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Tersedia dalam {variants.length} Varian Warna
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {variants.slice(0, 4).map((variant: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedVariantIndex(idx)}
                                    className={`w-full flex items-start gap-3 border p-3 rounded-2xl shadow-sm hover:bg-gray-100 transition ${selectedVariantIndex === idx
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 bg-gray-50"
                                        }`}
                                >
                                    <img
                                        src={variant.images[0]}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                        alt={variant.color}
                                    />
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm text-gray-800 font-semibold">
                                            Warna {variant.color}
                                        </span>
                                        <span className="flex items-center text-gray-500 text-xs gap-1 mt-1">
                                            <Box size={14} />
                                            Total Stok: {variant.sizes.reduce((a: number, b: any) => a + b.stock, 0)} |
                                            Size: {variant.sizes.map((s: any) => s.size).join(", ")}
                                        </span>
                                    </div>
                                </button>
                            ))}

                            {variants.length > 4 && (
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md w-fit mt-2 hover:bg-blue-600 cursor-pointer"
                                    onClick={() => setShowModal(true)}
                                >
                                    Varian Lainnya ▼
                                </button>
                            )}
                        </div>

                        <div className="pb-4 border-b border-gray-300 mt-2">
                            <p className="text-gray-500 text-sm mb-1">
                                #{productData.id}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                Rp {formatPrice(productData.price)}
                            </p>
                        </div>

                        <div className="flex gap-2 items-center mt-2">
                            <span className="text-sm text-gray-600">Total Stok:</span>
                            <span className="text-sm font-semibold text-gray-800">
                                {totalStock} Item
                            </span>
                        </div>

                        <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${productData.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {productData.status === "active" ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {productData.status === "active" ? "Tersedia" : "Tidak Tersedia"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6">
                    <h2 className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-300 pb-8">
                        Deskripsi Produk
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {productData.description || (
                            <span className="italic text-gray-400">Belum ada deskripsi</span>
                        )}
                    </p>
                </div>

                <div className="w-full flex justify-end mt-8">
                    <button
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={18} /> Kembali
                    </button>
                </div>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-lg">
                                    Varian {productData.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Tersedia {variants.length} pilihan warna
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {variants.map((variant: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedVariantIndex(idx);
                                        setShowModal(false);
                                    }}
                                    className={`w-full flex items-start gap-3 border p-3 rounded-2xl shadow-sm hover:bg-gray-100 transition text-left ${selectedVariantIndex === idx ? "ring-2 ring-blue-500 border-transparent" : "border-gray-200"
                                        }`}
                                >
                                    <img
                                        src={variant.images[0]}
                                        className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                                        alt={variant.color}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900 font-semibold">
                                            Warna {variant.color}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1 lines-clamp-2">
                                            Size: {variant.sizes.map((s: any) => s.size).join(", ")}
                                        </span>
                                        <span className="text-xs font-medium text-blue-600 mt-1">
                                            Stok: {variant.sizes.reduce((a: number, b: any) => a + b.stock, 0)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
