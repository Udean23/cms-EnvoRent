import React from 'react';
import ApexCharts from 'react-apexcharts';
import { Heart, Wallet, Shirt, Users, ShoppingBag } from 'lucide-react';
import { Breadcrumb } from '@/views/Components/breadcrumb';

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const weeklySalesData = {
    series: [{
        name: 'Penjualan',
        data: [1200000, 2500000, 1800000, 3200000, 2800000, 4500000, 5200000]
    }],
    options: {
        chart: {
            type: 'area',
            height: 160,
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0,
                stops: [0, 90, 100],
            }
        },
        xaxis: {
            categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            labels: { style: { colors: '#6B7280', fontSize: '12px' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: '#6B7280', fontSize: '12px' },
                formatter: (val: number) => `${val / 1000}k`
            }
        },
        grid: { show: false },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val: number) => formatRupiah(val)
            }
        },
        colors: ['#3B82F6']
    }
};

const yearlySalesData = {
    series: [{
        name: 'Penjualan',
        data: [1200000, 2500000, 1800000, 3200000, 2800000, 4500000, 5200000, 400000, 5000000, 3000000, 2000000, 7000000]
    }],
    options: {
        chart: {
            type: 'area',
            height: 160,
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0,
                stops: [0, 90, 100],
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: { style: { colors: '#6B7280', fontSize: '12px' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: '#6B7280', fontSize: '12px' },
                formatter: (val: number) => `${val / 1000}k`
            }
        },
        grid: { show: false },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val: number) => formatRupiah(val)
            }
        },
        colors: ['#3B82F6']
    }
};

const customerFlowData = {
    series: [
        {
            name: 'Pelanggan Lama',
            data: [18, 35, 40, 55, 70, 66, 60, 30, 25, 60, 45, 32, 68, 39, 40]
        },
        {
            name: 'Pelanggan Baru',
            data: [10, 25, 35, 48, 55, 50, 60, 25, 30, 40, 50, 48, 50, 40, 38]
        }
    ],
    options: {
        chart: {
            type: 'bar',
            height: 200,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: Array.from({ length: 15 }, (_, i) => (i + 1).toString()),
            labels: { style: { colors: '#6B7280', fontSize: '12px' } },
        },
        yaxis: {
            labels: { style: { colors: '#6B7280', fontSize: '12px' } },
        },
        fill: { opacity: 1 },
        tooltip: {
            y: { formatter: val => `${val} orang` }
        },
        colors: ['#F59E0B', '#3B82F6'],
        legend: { position: 'top' }
    }
};

const CircularProgress = ({ percentage, size = 70, strokeWidth = 6, color = "#FB923C" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let IconComponent = Wallet;
    if (percentage < 30) IconComponent = Wallet;
    else if (percentage < 50) IconComponent = Shirt;
    else if (percentage < 75) IconComponent = Users;
    else IconComponent = ShoppingBag;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-in-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <IconComponent className="text-orange-500" size={20} />
            </div>
        </div>
    );
};

const CardStat = ({ label, value, percentage = 75 }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-full flex justify-center items-center">
        <div className="flex items-center justify-between w-full">
            <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">{label}</div>
                <div className="text-xl font-semibold text-gray-900">{value}</div>
            </div>
            <div className="ml-3">
                <CircularProgress percentage={percentage} />
            </div>
        </div>
    </div>
);

const FavouriteItem = ({ img, name }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        <img src={img} alt={name} className="w-full h-40 object-cover" />
        <div className="p-3 text-center flex-1 flex flex-col justify-between">
            <div>
                <div className="font-medium text-gray-800">{name}</div>
                <div className="text-sm text-gray-500">(Ulasan 150) ⭐⭐⭐⭐⭐</div>
            </div>
            <button className="mt-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full flex items-center justify-center mx-auto space-x-1">
                <Heart size={14} fill="currentColor" className="text-purple-600" />
                <span>12k Suka</span>
            </button>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                title='Dashboard'
                desc='Ringkasan kinerja toko Anda secara keseluruhan'
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(154000000)}</h3>
                            <p className="text-sm text-gray-500">
                                dibanding minggu lalu <span className="text-green-500">+1.5% ↗</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">Pendapatan Harian</p>
                            <p className="text-xs text-gray-400">Ringkasan mingguan</p>
                        </div>
                    </div>
                    <div className="h-48">
                        <ApexCharts
                            options={weeklySalesData.options}
                            series={weeklySalesData.series}
                            type="area"
                            height={200}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-2xl w-[570px] p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Ringkasan Penjualan</h2>
                    <ApexCharts
                        options={yearlySalesData.options}
                        series={yearlySalesData.series}
                        type="area"
                        height={240}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-1 lg:col-span-2">
                <CardStat label="Total Penjualan" value={formatRupiah(425000000)} percentage={25} />
                <CardStat label="Total Produk" value="325" percentage={45} />
                <CardStat label="Total Pelanggan" value="985" percentage={65} />
                <CardStat label="Total Pesanan" value="415" percentage={85} />
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Produk Terlaris</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FavouriteItem name="Jersey Bola Nike" img="https://source.unsplash.com/400x300/?jersey" />
                    <FavouriteItem name="Sepatu Lari Adidas" img="https://source.unsplash.com/400x300/?sneakers" />
                    <FavouriteItem name="Topi Training Puma" img="https://source.unsplash.com/400x300/?cap" />
                    <FavouriteItem name="Jaket Olahraga" img="https://source.unsplash.com/400x300/?jacket" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;