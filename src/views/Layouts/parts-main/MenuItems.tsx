import {
    CalendarCheck,
    ChefHat,
    CookingPot,
    DiamondPercent,
    HandPlatter,
    History,
    Package,
    Shirt,
    SquareUser,
} from "lucide-react";
import { BiColor } from "react-icons/bi";
import {
    FaBoxesPacking,
    FaUserTag,
} from "react-icons/fa6";
import {
    FiHome,
    FiLayers,
} from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb";

export const menuItems = [
    {
        label: "Dashboard",
        children: [
            {
                label: "Beranda",
                icon: <FiHome />,
                path: "/dashboard",
            }
        ]
    },
    {
        group: "Transaksi",
        label: "Penjualan",
        icon: <TbShoppingCart />,
        path: "/outlets",
        isDropdown: true,
        children: [
            {
                label: "Kasir",
                icon: <TbShoppingCart />,
                path: "/kasir",
            },
            {
                label: "Riwayat Transaksi",
                icon: <History size={16} />,
                path: "/transaction-history",
            },
        ],
    },
    {
        label: "Produk",
        children: [
            {
                label: "Kategori",
                icon: <FiLayers />,
                path: "/categories",
            },
            {
                label: "Produk",
                icon: <Shirt size={16} />,
                path: "/products",
            },
            // {
            //     label: "Paket Bundling",
            //     icon: <Package size={16} />,
            //     path: "/bundlings",
            // },
            // {
            //     label: "Diskon",
            //     icon: <DiamondPercent size={16} />,
            //     path: "/discounts",
            // },
            {
                label: "Warna",
                icon: <BiColor />,
                path: "/colors",
            },
            {
                label: "Ukuran",
                icon: <FaBoxesPacking />,
                path: "/sizes",
            },
        ],
    },
    // {
    //     label: "Lainnya",
    //     children: [
    //         {
    //             label: "Shift",
    //             icon: <CalendarCheck size={16} />,
    //             path: "/shift",
    //         },
    //         {
    //             label: "Sections",
    //             icon: <FaUserTag />,
    //             path: "/roles",
    //         },
    //         {
    //             label: "Karyawan",
    //             icon: <SquareUser size={16} />,
    //             path: "/users",
    //         },
    //     ],
    // },
];