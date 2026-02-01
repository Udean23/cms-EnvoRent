const products = [
  {
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
    isFavorite: false
  },
  {
    id: "NIKE-AIRMAX-270",
    brand: "Nike",
    name: "Nike Air Max 270",
    category: "Shoes",
    subCategory: "Men",
    price: 2790000,
    currency: "IDR",
    image: "/public/img/Products/shoes2.png",
    rating: 4.7,
    reviews: 65,
    variants: [
      {
        color: "Black",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 40, stock: 12 },
          { size: 41, stock: 14 },
          { size: 42, stock: 11 },
          { size: 43, stock: 9 },
          { size: 44, stock: 7 }
        ]
      },
      {
        color: "White",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 40, stock: 8 },
          { size: 41, stock: 6 },
          { size: 42, stock: 10 },
          { size: 43, stock: 5 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  },
  {
    id: "ADIDAS-ULTRA-22",
    brand: "Adidas",
    name: "Adidas Ultraboost 22",
    category: "Shoes",
    subCategory: "Men",
    price: 2945000,
    currency: "IDR",
    image: "/public/img/Products/shoes3.png",
    rating: 4.6,
    reviews: 50,
    variants: [
      {
        color: "Gray",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 40, stock: 15 },
          { size: 41, stock: 12 },
          { size: 42, stock: 10 },
          { size: 43, stock: 8 },
          { size: 44, stock: 6 }
        ]
      },
      {
        color: "Blue",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 40, stock: 9 },
          { size: 41, stock: 7 },
          { size: 42, stock: 6 },
          { size: 43, stock: 4 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "PUMA-RSX-001",
    brand: "Puma",
    name: "Puma RS-X Efekt",
    category: "Shoes",
    subCategory: "Men",
    price: 2480000,
    currency: "IDR",
    image: "/public/img/Products/shoes4.png",
    rating: 4.3,
    reviews: 38,
    variants: [
      {
        color: "Red",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 40, stock: 10 },
          { size: 41, stock: 8 },
          { size: 42, stock: 6 },
          { size: 43, stock: 5 }
        ]
      },
      {
        color: "Black",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 40, stock: 7 },
          { size: 41, stock: 6 },
          { size: 42, stock: 4 },
          { size: 43, stock: 3 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "NB-574-CORE",
    brand: "New Balance",
    name: "New Balance 574 Core",
    category: "Shoes",
    subCategory: "Men",
    price: 1860000,
    currency: "IDR",
    image: "/public/img/Products/shoes5.png",
    rating: 4.2,
    reviews: 25,
    variants: [
      {
        color: "Gray",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 40, stock: 6 },
          { size: 41, stock: 9 },
          { size: 42, stock: 5 }
        ]
      },
      {
        color: "Navy",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 40, stock: 4 },
          { size: 41, stock: 3 },
          { size: 42, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "CONVERSE-CHUCK-70",
    brand: "Converse",
    name: "Converse Chuck 70",
    category: "Shoes",
    subCategory: "Men",
    price: 1550000,
    currency: "IDR",
    image: "/public/img/Products/shoes1.png",
    rating: 4.4,
    reviews: 30,
    variants: [
      {
        color: "White",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 40, stock: 10 },
          { size: 41, stock: 8 },
          { size: 42, stock: 6 }
        ]
      },
      {
        color: "Black",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 40, stock: 7 },
          { size: 41, stock: 5 },
          { size: 42, stock: 3 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "VANS-OLD-SKOOL",
    brand: "Vans",
    name: "Vans Old Skool",
    category: "Shoes",
    subCategory: "Men",
    price: 1240000,
    currency: "IDR",
    image: "/public/img/Products/shoes2.png",
    rating: 4.5,
    reviews: 40,
    variants: [
      {
        color: "Black",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 40, stock: 12 },
          { size: 41, stock: 10 },
          { size: 42, stock: 8 }
        ]
      },
      {
        color: "Blue",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 40, stock: 6 },
          { size: 41, stock: 4 },
          { size: 42, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  },
  {
    id: "SKECHERS-DLITES",
    brand: "Skechers",
    name: "Skechers D'Lites",
    category: "Shoes",
    subCategory: "Women",
    price: 1395000,
    currency: "IDR",
    image: "/public/img/Products/shoes3.png",
    rating: 4.3,
    reviews: 28,
    variants: [
      {
        color: "White",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 36, stock: 8 },
          { size: 37, stock: 6 },
          { size: 38, stock: 4 }
        ]
      },
      {
        color: "Pink",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 36, stock: 5 },
          { size: 37, stock: 3 },
          { size: 38, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "ADIDAS-GAZELLE",
    brand: "Adidas",
    name: "Adidas Gazelle",
    category: "Shoes",
    subCategory: "Women",
    price: 1705000,
    currency: "IDR",
    image: "/public/img/Products/shoes4.png",
    rating: 4.6,
    reviews: 35,
    variants: [
      {
        color: "Green",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 36, stock: 7 },
          { size: 37, stock: 5 },
          { size: 38, stock: 3 }
        ]
      },
      {
        color: "Red",
        images: ["/public/img/Products/shoes2.png"],
        sizes: [
          { size: 36, stock: 4 },
          { size: 37, stock: 2 },
          { size: 38, stock: 1 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  },
  {
    id: "NIKE-BLAZER-LOW",
    brand: "Nike",
    name: "Nike Blazer Low",
    category: "Shoes",
    subCategory: "Women",
    price: 1860000,
    currency: "IDR",
    image: "/public/img/Products/shoes5.png",
    rating: 4.4,
    reviews: 22,
    variants: [
      {
        color: "White",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 36, stock: 6 },
          { size: 37, stock: 8 },
          { size: 38, stock: 5 }
        ]
      },
      {
        color: "Black",
        images: ["/public/img/Products/shoes1.png"],
        sizes: [
          { size: 36, stock: 4 },
          { size: 37, stock: 3 },
          { size: 38, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "PUMA-CALI-STAR",
    brand: "Puma",
    name: "Puma Cali Star",
    category: "Shoes",
    subCategory: "Women",
    price: 1550000,
    currency: "IDR",
    image: "/public/img/Products/product11.png",
    rating: 4.2,
    reviews: 18,
    variants: [
      {
        color: "White",
        images: ["calistar_white_1.jpg"],
        sizes: [
          { size: 36, stock: 7 },
          { size: 37, stock: 5 },
          { size: 38, stock: 3 }
        ]
      },
      {
        color: "Pink",
        images: ["calistar_pink_1.jpg"],
        sizes: [
          { size: 36, stock: 4 },
          { size: 37, stock: 2 },
          { size: 38, stock: 1 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "NB-327-WOMEN",
    brand: "New Balance",
    name: "New Balance 327 Women",
    category: "Shoes",
    subCategory: "Women",
    price: 1705000,
    currency: "IDR",
    image: "/public/img/Products/product12.png",
    rating: 4.5,
    reviews: 20,
    variants: [
      {
        color: "Gray",
        images: ["nb327_gray_1.jpg"],
        sizes: [
          { size: 36, stock: 6 },
          { size: 37, stock: 8 },
          { size: 38, stock: 5 }
        ]
      },
      {
        color: "Blue",
        images: ["nb327_blue_1.jpg"],
        sizes: [
          { size: 36, stock: 4 },
          { size: 37, stock: 3 },
          { size: 38, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  },
  {
    id: "VANS-SK8-HI",
    brand: "Vans",
    name: "Vans SK8-Hi",
    category: "Shoes",
    subCategory: "Unisex",
    price: 1395000,
    currency: "IDR",
    image: "/public/img/Products/product13.png",
    rating: 4.6,
    reviews: 32,
    variants: [
      {
        color: "Black",
        images: ["sk8hi_black_1.jpg"],
        sizes: [
          { size: 39, stock: 10 },
          { size: 40, stock: 8 },
          { size: 41, stock: 6 }
        ]
      },
      {
        color: "Blue",
        images: ["sk8hi_blue_1.jpg"],
        sizes: [
          { size: 39, stock: 7 },
          { size: 40, stock: 5 },
          { size: 41, stock: 3 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "SKECHERS-GO-WALK",
    brand: "Skechers",
    name: "Skechers GOwalk 6",
    category: "Shoes",
    subCategory: "Unisex",
    price: 1240000,
    currency: "IDR",
    image: "/public/img/Products/product14.png",
    rating: 4.3,
    reviews: 27,
    variants: [
      {
        color: "Gray",
        images: ["gowalk_gray_1.jpg"],
        sizes: [
          { size: 39, stock: 8 },
          { size: 40, stock: 6 },
          { size: 41, stock: 4 }
        ]
      },
      {
        color: "Black",
        images: ["gowalk_black_1.jpg"],
        sizes: [
          { size: 39, stock: 5 },
          { size: 40, stock: 3 },
          { size: 41, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "ADIDAS-STAN-SMITH",
    brand: "Adidas",
    name: "Adidas Stan Smith",
    category: "Shoes",
    subCategory: "Unisex",
    price: 1550000,
    currency: "IDR",
    image: "/public/img/Products/product15.png",
    rating: 4.7,
    reviews: 45,
    variants: [
      {
        color: "White",
        images: ["stansmith_white_1.jpg"],
        sizes: [
          { size: 39, stock: 10 },
          { size: 40, stock: 8 },
          { size: 41, stock: 6 }
        ]
      },
      {
        color: "Green",
        images: ["stansmith_green_1.jpg"],
        sizes: [
          { size: 39, stock: 7 },
          { size: 40, stock: 5 },
          { size: 41, stock: 3 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  },
  {
    id: "CONVERSE-ONE-STAR",
    brand: "Converse",
    name: "Converse One Star",
    category: "Shoes",
    subCategory: "Unisex",
    price: 1395000,
    currency: "IDR",
    image: "/public/img/Products/product16.png",
    rating: 4.4,
    reviews: 29,
    variants: [
      {
        color: "Black",
        images: ["onestar_black_1.jpg"],
        sizes: [
          { size: 39, stock: 8 },
          { size: 40, stock: 6 },
          { size: 41, stock: 4 }
        ]
      },
      {
        color: "Red",
        images: ["onestar_red_1.jpg"],
        sizes: [
          { size: 39, stock: 5 },
          { size: 40, stock: 3 },
          { size: 41, stock: 2 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "OFFICE-SHIRT-BLUE",
    brand: "OfficeWear",
    name: "Office Shirt Blue",
    category: "Office",
    subCategory: "Men",
    price: 450000,
    currency: "IDR",
    image: "/public/img/Products/product17.png",
    rating: 4.1,
    reviews: 12,
    variants: [
      {
        color: "Blue",
        images: ["office_blue_1.jpg"],
        sizes: [
          { size: "M", stock: 10 },
          { size: "L", stock: 8 },
          { size: "XL", stock: 5 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "OFFICE-SHIRT-WHITE",
    brand: "OfficeWear",
    name: "Office Shirt White",
    category: "Office",
    subCategory: "Men",
    price: 430000,
    currency: "IDR",
    image: "/public/img/Products/product18.png",
    rating: 4.2,
    reviews: 15,
    variants: [
      {
        color: "White",
        images: ["office_white_1.jpg"],
        sizes: [
          { size: "M", stock: 12 },
          { size: "L", stock: 9 },
          { size: "XL", stock: 6 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  },
  {
    id: "SPORT-JERSEY-RED",
    brand: "SportPro",
    name: "Sport Jersey Red",
    category: "Sports",
    subCategory: "Unisex",
    price: 350000,
    currency: "IDR",
    image: "/public/img/Products/product19.png",
    rating: 4.3,
    reviews: 20,
    variants: [
      {
        color: "Red",
        images: ["sport_red_1.jpg"],
        sizes: [
          { size: "S", stock: 15 },
          { size: "M", stock: 10 },
          { size: "L", stock: 8 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: false
  },
  {
    id: "SPORT-JERSEY-BLUE",
    brand: "SportPro",
    name: "Sport Jersey Blue",
    category: "Sports",
    subCategory: "Unisex",
    price: 350000,
    currency: "IDR",
    image: "/public/img/Products/product20.png",
    rating: 4.4,
    reviews: 18,
    variants: [
      {
        color: "Blue",
        images: ["sport_blue_1.jpg"],
        sizes: [
          { size: "S", stock: 13 },
          { size: "M", stock: 11 },
          { size: "L", stock: 9 }
        ]
      }
    ],
    delivery: { free_over: 465000, currency: "IDR" },
    isFavorite: true
  }
];

export default products;