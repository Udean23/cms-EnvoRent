import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const dummyBundlingDetail = {
  id: "BDL-SNEAKER-003",
  name: "Paket Sneaker Collector",
  kode_Bundling: "BDL003",
  price: 8900000,
  stock: 15,
  status: "active",
  category: "Shoes",
  description: `Paket Sneaker Collector adalah koleksi eksklusif yang menggabungkan 5 sepatu premium dari brand ternama dunia. 

Paket ini dirancang khusus untuk para kolektor dan penggemar sneaker yang menginginkan koleksi lengkap dengan harga yang lebih hemat.

Keunggulan Paket:
• Hemat hingga 15% dibanding beli satuan
• Produk original dan bergaransi resmi
• Pilihan warna dan ukuran lengkap
• Free shipping untuk seluruh Indonesia
• Packaging premium eksklusif

Cocok untuk:
- Kolektor sneaker profesional
- Gift premium untuk orang tersayang
- Investment koleksi jangka panjang
- Pemakaian sehari-hari dengan gaya berbeda setiap hari`,
  image: "/public/img/Products/shoes3.png",
  bundling_material_count: 5,
  bundling_material: [
    {
      product_name: "Reebok Zig Kinetica 3",
      product_detail_id: "REEBOK-ZIG-1325",
      variant_name: "White / Size 42",
      quantity: 1,
      unit_code: "Pcs",
      sum_stock: 10,
      image: "/public/img/Products/shoes1.png"
    },
    {
      product_name: "Nike Air Max 270",
      product_detail_id: "NIKE-AIRMAX-270",
      variant_name: "Black / Size 42",
      quantity: 1,
      unit_code: "Pcs",
      sum_stock: 11,
      image: "/public/img/Products/shoes2.png"
    },
    {
      product_name: "Adidas Ultraboost 22",
      product_detail_id: "ADIDAS-ULTRA-22",
      variant_name: "Gray / Size 42",
      quantity: 1,
      unit_code: "Pcs",
      sum_stock: 10,
      image: "/public/img/Products/shoes3.png"
    },
    {
      product_name: "Puma RS-X Efekt",
      product_detail_id: "PUMA-RSX-001",
      variant_name: "Red / Size 42",
      quantity: 1,
      unit_code: "Pcs",
      sum_stock: 6,
      image: "/public/img/Products/shoes4.png"
    },
    {
      product_name: "New Balance 574 Core",
      product_detail_id: "NB-574-CORE",
      variant_name: "Gray / Size 42",
      quantity: 1,
      unit_code: "Pcs",
      sum_stock: 5,
      image: "/public/img/Products/shoes5.png"
    }
  ]
};

import { Breadcrumb } from "@/views/Components/breadcrumb";
import { useNavigate } from "react-router-dom";

export default function BundlingDetailPage() {
  const [packageData] = useState(dummyBundlingDetail);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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

  const formatPrice = (price) => {
    return price.toLocaleString("id-ID");
  };

  const handleBack = () => {
    Navigate(-1);
  };

  if (!packageData) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb title="Detail Bundling Produk" desc="Data Bundling Produk" />
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 py-12">
          Loading...
        </div>
      </div>
    );
  }

  const allVariants = packageData.bundling_material || [];

  return (
    <div className="p-6">
      <Breadcrumb title="Detail Bundling Produk" desc="Data Bundling Produk" />

      <div className="bg-white p-6 rounded-xl shadow-md mt-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-[420px]">
            <img
              src={packageData.image}
              alt={packageData.name}
              className="w-full h-[480px] object-cover rounded-xl shadow"
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 uppercase">
                {packageData.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Terdiri dari {allVariants.length} item produk berikut ini
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {allVariants.slice(0, 4).map((variant, idx) => (
                <button
                  key={variant.product_detail_id}
                  onClick={() => setSelectedOptionIndex(idx)}
                  className={`w-full flex items-start gap-3 border p-3 rounded-2xl shadow-sm hover:bg-gray-100 transition ${
                    selectedOptionIndex === idx
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <img
                    src={variant.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={variant.product_name}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-800 font-semibold">
                      {variant.product_name}{" "}
                      <span className="text-gray-400">Varian</span>{" "}
                      {variant.variant_name}
                    </span>
                    <span className="flex items-center text-gray-500 text-sm gap-2 mt-1">
                      <ShoppingCart size={16} /> Quantity {variant.quantity}{" "}
                      {variant.unit_code}
                    </span>
                  </div>
                </button>
              ))}

              {allVariants.length > 4 && (
                <button
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md w-fit mt-2 hover:bg-blue-600"
                  onClick={() => setShowModal(true)}
                >
                  Item Lainnya ▼
                </button>
              )}
            </div>

            <div className="pb-4 border-b border-gray-300">
              <p className="text-gray-500 text-sm mb-1">
                {packageData.kode_Bundling}
              </p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {formatPrice(packageData.price)}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">Stok:</span>
              <span className="text-sm font-semibold text-gray-800">
                {packageData.stock} Paket
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  packageData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {packageData.status === "active" ? "Tersedia" : "Tidak Tersedia"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6">
          <h2 className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-300 pb-8">
            Deskripsi Produk Bundling
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {packageData.description || (
              <span className="italic text-gray-400">Belum ada deskripsi</span>
            )}
          </p>
        </div>

        <div className="w-full flex justify-end">
          <button
            className="mt-8 bg-gray-400 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            onClick={handleBack}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} /> Kembali
            </span>
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg p-6"
          >
            <h3 className="font-bold text-lg mb-4">
              Bundling {packageData.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Terdiri dari {allVariants.length} item berikut
            </p>

            <div className="flex flex-col gap-2">
              {allVariants.map((variant) => (
                <div
                  key={variant.product_detail_id}
                  className="w-full flex items-start gap-3 border border-gray-200 bg-gray-50 p-3 rounded-2xl shadow-sm"
                >
                  <img
                    src={variant.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={variant.product_name}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-800 font-semibold">
                      {variant.product_name}{" "}
                      <span className="text-gray-400">Varian</span>{" "}
                      {variant.variant_name}
                    </span>
                    <span className="flex items-center text-gray-500 text-sm gap-2 mt-1">
                      <ShoppingCart size={16} /> Quantity {variant.quantity}{" "}
                      {variant.unit_code}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
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