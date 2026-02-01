const dummyBundlingData = [
  {
    id: "BDL-SPORT-001",
    name: "Paket Olahraga Premium",
    kode_Bundling: "BDL001",
    harga: 5800000,
    image: "/public/img/Products/shoes1.png",
    bundling_material_count: 3,
    bundling_material: [
      { product_detail_id: "NIKE-AIRMAX-270", image: "/public/img/Products/shoes2.png" },
      { product_detail_id: "SPORT-JERSEY-RED", image: "/public/img/Products/shoes4.png" },
      { product_detail_id: "SPORT-JERSEY-BLUE", image: "/public/img/Products/shoes3.png" }
    ]
  },
  {
    id: "BDL-OFFICE-002",
    name: "Paket Kerja Profesional",
    kode_Bundling: "BDL002",
    harga: 3300000,
    image: "/public/img/Products/product17.png",
    bundling_material_count: 4,
    bundling_material: [
      { product_detail_id: "OFFICE-SHIRT-BLUE", image: "/public/img/Products/product17.png" },
      { product_detail_id: "OFFICE-SHIRT-WHITE", image: "/public/img/Products/product18.png" },
      { product_detail_id: "ADIDAS-GAZELLE", image: "/public/img/Products/shoes4.png" },
      { product_detail_id: "CONVERSE-CHUCK-70", image: "/public/img/Products/shoes1.png" }
    ]
  },
  {
    id: "BDL-SNEAKER-003",
    name: "Paket Sneaker Collector",
    kode_Bundling: "BDL003",
    harga: 8900000,
    image: "/public/img/Products/shoes3.png",
    bundling_material_count: 5,
    bundling_material: [
      { product_detail_id: "REEBOK-ZIG-1325", image: "/public/img/Products/shoes1.png" },
      { product_detail_id: "NIKE-AIRMAX-270", image: "/public/img/Products/shoes2.png" },
      { product_detail_id: "ADIDAS-ULTRA-22", image: "/public/img/Products/shoes3.png" },
      { product_detail_id: "PUMA-RSX-001", image: "/public/img/Products/shoes4.png" },
      { product_detail_id: "NB-574-CORE", image: "/public/img/Products/shoes5.png" }
    ]
  },
  {
    id: "BDL-CASUAL-004",
    name: "Paket Casual Everyday",
    kode_Bundling: "BDL004",
    harga: 4200000,
    image: "/public/img/Products/shoes2.png",
    bundling_material_count: 3,
    bundling_material: [
      { product_detail_id: "VANS-OLD-SKOOL", image: "/public/img/Products/shoes2.png" },
      { product_detail_id: "CONVERSE-CHUCK-70", image: "/public/img/Products/shoes1.png" },
      { product_detail_id: "VANS-SK8-HI", image: "/public/img/Products/product13.png" }
    ]
  },
  {
    id: "BDL-WOMEN-005",
    name: "Paket Wanita Stylish",
    kode_Bundling: "BDL005",
    harga: 5500000,
    image: "/public/img/Products/shoes4.png",
    bundling_material_count: 4,
    bundling_material: [
      { product_detail_id: "SKECHERS-DLITES", image: "/public/img/Products/shoes3.png" },
      { product_detail_id: "ADIDAS-GAZELLE", image: "/public/img/Products/shoes4.png" },
      { product_detail_id: "NIKE-BLAZER-LOW", image: "/public/img/Products/shoes5.png" },
      { product_detail_id: "PUMA-CALI-STAR", image: "/public/img/Products/product11.png" }
    ]
  },
  {
    id: "BDL-STARTER-006",
    name: "Paket Pemula Hemat",
    kode_Bundling: "BDL006",
    harga: 2800000,
    image: "/public/img/Products/product13.png",
    bundling_material_count: 2,
    bundling_material: [
      { product_detail_id: "SKECHERS-GO-WALK", image: "/public/img/Products/product14.png" },
      { product_detail_id: "CONVERSE-ONE-STAR", image: "/public/img/Products/product16.png" }
    ]
  },
  {
    id: "BDL-UNISEX-007",
    name: "Paket Unisex Lengkap",
    kode_Bundling: "BDL007",
    harga: 6400000,
    image: "/public/img/Products/product15.png",
    bundling_material_count: 5,
    bundling_material: [
      { product_detail_id: "VANS-SK8-HI", image: "/public/img/Products/product13.png" },
      { product_detail_id: "SKECHERS-GO-WALK", image: "/public/img/Products/product14.png" },
      { product_detail_id: "ADIDAS-STAN-SMITH", image: "/public/img/Products/product15.png" },
      { product_detail_id: "CONVERSE-ONE-STAR", image: "/public/img/Products/product16.png" },
      { product_detail_id: "SPORT-JERSEY-RED", image: "/public/img/Products/product19.png" }
    ]
  },
  {
    id: "BDL-PREMIUM-008",
    name: "Paket Premium Ultimate",
    kode_Bundling: "BDL008",
    harga: 12500000,
    image: "/public/img/Products/shoes1.png",
    bundling_material_count: 6,
    bundling_material: [
      { product_detail_id: "REEBOK-ZIG-1325", image: "/public/img/Products/shoes1.png" },
      { product_detail_id: "NIKE-AIRMAX-270", image: "/public/img/Products/shoes2.png" },
      { product_detail_id: "ADIDAS-ULTRA-22", image: "/public/img/Products/shoes3.png" },
      { product_detail_id: "ADIDAS-GAZELLE", image: "/public/img/Products/shoes4.png" },
      { product_detail_id: "NIKE-BLAZER-LOW", image: "/public/img/Products/shoes5.png" },
      { product_detail_id: "NB-327-WOMEN", image: "/public/img/Products/product12.png" }
    ]
  },
  {
    id: "BDL-ATHLETIC-009",
    name: "Paket Athletic Performance",
    kode_Bundling: "BDL009",
    harga: 7200000,
    image: "/public/img/Products/shoes3.png",
    bundling_material_count: 4,
    bundling_material: [
      { product_detail_id: "ADIDAS-ULTRA-22", image: "/public/img/Products/shoes3.png" },
      { product_detail_id: "NIKE-AIRMAX-270", image: "/public/img/Products/shoes2.png" },
      { product_detail_id: "SPORT-JERSEY-BLUE", image: "/public/img/Products/product20.png" },
      { product_detail_id: "SPORT-JERSEY-RED", image: "/public/img/Products/product19.png" }
    ]
  },
  {
    id: "BDL-URBAN-010",
    name: "Paket Urban Lifestyle",
    kode_Bundling: "BDL010",
    harga: 5100000,
    image: "/public/img/Products/shoes4.png",
    bundling_material_count: 3,
    bundling_material: [
      { product_detail_id: "PUMA-RSX-001", image: "/public/img/Products/shoes4.png" },
      { product_detail_id: "PUMA-CALI-STAR", image: "/public/img/Products/product11.png" },
      { product_detail_id: "NB-327-WOMEN", image: "/public/img/Products/product12.png" }
    ]
  },
  {
    id: "BDL-CLASSIC-011",
    name: "Paket Classic Timeless",
    kode_Bundling: "BDL011",
    harga: 4500000,
    image: "/public/img/Products/product15.png",
    bundling_material_count: 3,
    bundling_material: [
      { product_detail_id: "ADIDAS-STAN-SMITH", image: "/public/img/Products/product15.png" },
      { product_detail_id: "CONVERSE-CHUCK-70", image: "/public/img/Products/shoes1.png" },
      { product_detail_id: "VANS-OLD-SKOOL", image: "/public/img/Products/shoes2.png" }
    ]
  },
  {
    id: "BDL-BALANCE-012",
    name: "Paket New Balance Series",
    kode_Bundling: "BDL012",
    harga: 3600000,
    image: "/public/img/Products/shoes5.png",
    bundling_material_count: 2,
    bundling_material: [
      { product_detail_id: "NB-574-CORE", image: "/public/img/Products/shoes5.png" },
      { product_detail_id: "NB-327-WOMEN", image: "/public/img/Products/product12.png" }
    ]
  }
];

export default dummyBundlingData;