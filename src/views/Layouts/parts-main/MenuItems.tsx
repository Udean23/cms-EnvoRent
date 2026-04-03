import {
    CalendarCheck,
    History,
    Package,
    Shirt,
    SquareUser,
} from "lucide-react";
import {
    FaBoxesPacking,
} from "react-icons/fa6";
import {
    FiHome,
    FiLayers,
} from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb";

export interface MenuItem {
    label: string;
    icon?: any;
    path?: string;
    isDropdown?: boolean;
    group?: string;
    roles?: string[];
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        roles: ["admin", "superadmin", "super admin"],
        children: [
            {
                label: "Beranda",
                icon: <FiHome />,
                path: "/dashboard",
                roles: ["admin", "superadmin", "super admin"],
            }
        ]
    },
    {
        group: "Transaksi",
        label: "Peminjaman",
        icon: <TbShoppingCart />,
        path: "/outlets",
        isDropdown: true,
        roles: ["admin"],
        children: [
            {
                label: "Pemesanan",
                icon: <FaBoxesPacking size={16} />,
                path: "/pemesanan",
                roles: ["admin"],
            },
            {
                label: "Riwayat Peminjaman",
                icon: <History size={16} />,
                path: "/transaction-history",
                roles: ["admin"],
            },
        ],
    },
    {
        label: "Produk",
        roles: ["superadmin", "super admin"],
        children: [
            {
                label: "Kategori",
                icon: <FiLayers />,
                path: "/categories",
                roles: ["superadmin", "super admin"],
            },
            {
                label: "Produk",
                icon: <Shirt size={16} />,
                path: "/products",
                roles: ["superadmin", "super admin"],
            },
            {
                label: "Paket Bundling",
                icon: <Package size={16} />,
                path: "/bundlings",
                roles: ["superadmin", "super admin"],
            },
        ],
    },
    {
        label: "Lainnya",
        roles: ["superadmin", "super admin"],
        children: [
            {
                label: "Log Aktifitas",
                icon: <CalendarCheck size={16} />,
                path: "/activity-logs",
                roles: ["superadmin", "super admin"],
            },
            {
                label: "Karyawan",
                icon: <SquareUser size={16} />,
                path: "/users",
                roles: ["superadmin", "super admin"],
            },
        ],
    },
];