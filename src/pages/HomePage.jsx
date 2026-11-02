import React, { useState } from "react";
import { useAuthStore } from "@/store";
import Typography from "antd/es/typography/Typography";
import { Briefcase, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuthStore();
  const { Title } = Typography;
  const [selectedPeriod, setSelectedPeriod] = useState("M");

  const recentOrders = [
    {
      id: 1,
      name: "Rakesh Kohali",
      address: "main street, bandra",
      amount: "₹ 1250",
      status: "Preparing",
      badgeStyle:
        "bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",
    },
    {
      id: 2,
      name: "John Doe",
      address: "side street, bandra",
      amount: "₹ 900",
      status: "On the way",
      badgeStyle:
        "bg-sky-50 text-sky-500 border border-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50",
    },
    {
      id: 3,
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      badgeStyle:
        "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
    },
    {
      id: 4,
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      badgeStyle:
        "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
    },
    {
      id: 5,
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      badgeStyle:
        "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
    },
  ];

  return (
    <div className="w-full">
      <Title level={5} className="!mb-6 text-neutral-800 dark:text-neutral-100 font-semibold">
        Welcome {user?.firstName}
      </Title>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stat Cards + Sales Graph */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Orders Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xs border border-neutral-100 dark:border-neutral-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Briefcase className="w-5 h-5 fill-current" />
                </div>
                <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Total orders
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                28
              </div>
            </div>

            {/* Total Sale Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xs border border-neutral-100 dark:border-neutral-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-500 dark:text-sky-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Total sale
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                ₹ 50 000
              </div>
            </div>
          </div>

          {/* Sales Chart Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xs border border-neutral-100 dark:border-neutral-700/60">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-500 dark:text-sky-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Sales
                </span>
              </div>

              {/* Time Period Filter Pills */}
              <div className="flex items-center gap-2">
                {["W", "M", "Y"].map((period) => {
                  const isActive = selectedPeriod === period;
                  return (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setSelectedPeriod(period)}
                      className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center cursor-pointer transition-[transform,background-color,color] duration-150 active:scale-95 ${
                        isActive
                          ? "bg-[#F65F42] text-white shadow-xs"
                          : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                      }`}
                    >
                      {period}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sales Chart SVG */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox="0 0 520 220"
                className="w-full h-auto select-none"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F65F42" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F65F42" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid lines & Labels */}
                <g className="text-xs fill-neutral-700 dark:fill-neutral-300 font-semibold">
                  <text x="0" y="44" fontSize="11" fontWeight="600">
                    ₹ 30 000
                  </text>
                  <line
                    x1="65"
                    y1="40"
                    x2="510"
                    y2="40"
                    stroke="#D1D5DB"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="dark:stroke-neutral-700"
                  />

                  <text x="0" y="104" fontSize="11" fontWeight="600">
                    ₹ 20 000
                  </text>
                  <line
                    x1="65"
                    y1="100"
                    x2="510"
                    y2="100"
                    stroke="#D1D5DB"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="dark:stroke-neutral-700"
                  />

                  <text x="0" y="164" fontSize="11" fontWeight="600">
                    ₹ 10 000
                  </text>
                  <line
                    x1="65"
                    y1="160"
                    x2="510"
                    y2="160"
                    stroke="#D1D5DB"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="dark:stroke-neutral-700"
                  />
                </g>

                {/* Main Axis Borders */}
                <line
                  x1="65"
                  y1="40"
                  x2="65"
                  y2="185"
                  stroke="#4B5563"
                  strokeWidth="1.5"
                  className="dark:stroke-neutral-500"
                />
                <line
                  x1="65"
                  y1="185"
                  x2="510"
                  y2="185"
                  stroke="#4B5563"
                  strokeWidth="1.5"
                  className="dark:stroke-neutral-500"
                />

                {/* Area under curve */}
                <path
                  d="M 68 162
                     C 85 174, 110 178, 140 172
                     C 170 166, 195 145, 225 110
                     C 255 75, 275 80, 295 90
                     C 315 100, 335 125, 360 125
                     C 390 125, 415 105, 440 68
                     C 465 52, 490 48, 510 44
                     L 510 185
                     L 68 185
                     Z"
                  fill="url(#salesGradient)"
                />

                {/* Smooth Curve Line */}
                <path
                  d="M 68 162
                     C 85 174, 110 178, 140 172
                     C 170 166, 195 145, 225 110
                     C 255 75, 275 80, 295 90
                     C 315 100, 335 125, 360 125
                     C 390 125, 415 105, 440 68
                     C 465 52, 490 48, 510 44"
                  fill="none"
                  stroke="#F65F42"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* X Axis Date Labels */}
                <g className="text-xs fill-neutral-700 dark:fill-neutral-300 font-semibold">
                  <text x="125" y="206" fontSize="11" fontWeight="600" textAnchor="middle">
                    1 Jan
                  </text>
                  <text x="200" y="206" fontSize="11" fontWeight="600" textAnchor="middle">
                    2 Jan
                  </text>
                  <text x="270" y="206" fontSize="11" fontWeight="600" textAnchor="middle">
                    3 Jan
                  </text>
                  <text x="340" y="206" fontSize="11" fontWeight="600" textAnchor="middle">
                    4 Jan
                  </text>
                  <text x="410" y="206" fontSize="11" fontWeight="600" textAnchor="middle">
                    5 Jan
                  </text>
                  <text x="475" y="206" fontSize="11" fontWeight="600" textAnchor="middle">
                    6 Jan
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Orders Card */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xs border border-neutral-100 dark:border-neutral-700/60 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100/70 dark:bg-rose-950/50 flex items-center justify-center text-[#F65F42] dark:text-rose-400">
                <Briefcase className="w-5 h-5 fill-current" />
              </div>
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Recent orders
              </span>
            </div>

            {/* Orders List */}
            <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-700/40">
              {recentOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 m-0">
                      {order.name}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 m-0 mt-0.5">
                      {order.address}
                    </p>
                  </div>

                  {/* Price & Status */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                      {order.amount}
                    </span>
                    <span
                      className={`min-w-20 text-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.badgeStyle}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom link: See all orders */}
          <div className="mt-8 pt-2">
            <Link
              to="/orders"
              className="inline-block text-sm font-bold text-neutral-900 dark:text-neutral-100 border-b-2 border-[#F65F42] pb-0.5 hover:text-[#F65F42] transition-colors active:scale-[0.98]"
            >
              See all orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
