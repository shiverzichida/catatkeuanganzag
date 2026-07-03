"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  LogOut,
  Trash2,
  Database,
  Calendar,
  AlertTriangle,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import LoginScreen from "../components/LoginScreen";
import TransactionModal, {
  TransactionInput,
  parentCategoryConfig,
  subCategoryConfig
} from "../components/TransactionModal";
import DonutChart from "../components/DonutChart";

// Custom SVG Github Icon
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note: string;
  created_at?: string;
}

// Data awal (Seed Data) disesuaikan dengan kategori baru
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "seed-1",
    amount: 7500000,
    type: "income",
    category: "Gaji",
    date: new Date().toISOString().split("T")[0],
    note: "Gaji Pokok Nahel"
  },
  {
    id: "seed-2",
    amount: 450000,
    type: "expense",
    category: "Groceries - Makan",
    date: new Date().toISOString().split("T")[0],
    note: "Belanja Bulanan"
  },
  {
    id: "seed-3",
    amount: 150000,
    type: "expense",
    category: "Servis & Bensin",
    date: new Date().toISOString().split("T")[0],
    note: "Isi Bensin & Cuci Motor"
  },
  {
    id: "seed-4",
    amount: 250000,
    type: "expense",
    category: "Makan Weekend",
    date: new Date().toISOString().split("T")[0],
    note: "Makan Malam Hari Sabtu"
  },
  {
    id: "seed-5",
    amount: 300000,
    type: "expense",
    category: "Tabungan Mama (BSI)",
    date: new Date().toISOString().split("T")[0],
    note: "Transfer Tabungan Mama"
  }
];

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // === FITUR BARU STATE ===
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mount check & Load theme/login
  useEffect(() => {
    setIsMounted(true);
    
    // Load User
    const savedUser = localStorage.getItem("keuangan_user");
    if (savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }

    // Load Theme
    const savedTheme = localStorage.getItem("theme_mode");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }

    // Set Default Month ke Bulan Ini (Format YYYY-MM)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${yyyy}-${mm}`);
  }, []);

  // Sync data
  useEffect(() => {
    if (!isAuthenticated) return;

    if (isSupabaseConfigured) {
      fetchTransactions();
    } else {
      loadFromLocalStorage();
    }
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      if (data) {
        setTransactions(data as Transaction[]);
      }
    } catch (err) {
      console.error("Supabase fetch error, falling back to LocalStorage:", err);
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("transactions_data");
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      localStorage.setItem("transactions_data", JSON.stringify(INITIAL_TRANSACTIONS));
      setTransactions(INITIAL_TRANSACTIONS);
    }
  };

  // Toggle Theme Mode
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem("theme_mode", nextMode ? "dark" : "light");
  };

  // Navigasi Bulan Kalender
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth === 0) {
      newMonth = 12;
      newYear = year - 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
    setCurrentPage(1); // Reset halaman ke 1
    setSelectedCategory(null);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth === 13) {
      newMonth = 1;
      newYear = year + 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
    setCurrentPage(1); // Reset halaman ke 1
    setSelectedCategory(null);
  };

  const getMonthLabel = (monthStr: string) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  const handleLogin = (loggedInUser: string) => {
    localStorage.setItem("keuangan_user", loggedInUser);
    setIsAuthenticated(true);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("keuangan_user");
    setIsAuthenticated(false);
    setUser("");
  };

  const handleAddTransaction = async (input: TransactionInput) => {
    const dbPayload = {
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: input.date,
      note: input.note
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("transactions").insert([dbPayload]);
        if (error) throw error;
        await fetchTransactions();
      } catch (err) {
        console.error("Gagal menyimpan ke Supabase:", err);
        alert("Gagal menyimpan transaksi ke database");
      }
    } else {
      const newTx: Transaction = {
        id: "tx-" + Date.now(),
        ...dbPayload
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem("transactions_data", JSON.stringify(updated));
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (!confirmDelete) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) throw error;
        await fetchTransactions();
      } catch (err) {
        console.error("Gagal menghapus dari Supabase:", err);
        alert("Gagal menghapus transaksi dari database");
      }
    } else {
      const updated = transactions.filter((tx) => tx.id !== id);
      setTransactions(updated);
      localStorage.setItem("transactions_data", JSON.stringify(updated));
    }
  };

  // === FITUR FILTER BULAN ===
  const filteredTransactions = transactions.filter((tx) => {
    return tx.date.startsWith(selectedMonth);
  });

  // Kalkulasi total berdasarkan bulan terpilih
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  // Mengelompokkan grafik pengeluaran bulanan
  const parentCategories = ["LIVING", "PLAYING", "SAVING", "WORKING"];
  const chartData = parentCategories.map((parentName) => {
    const value = filteredTransactions
      .filter((tx) => {
        if (tx.type !== "expense") return false;
        const subConfig = subCategoryConfig[tx.category];
        const txParent = subConfig ? subConfig.parent : "LIVING";
        return txParent === parentName;
      })
      .reduce((acc, tx) => acc + tx.amount, 0);

    const config = parentCategoryConfig[parentName];
    let colorHex = "#71717a";
    if (parentName === "LIVING") colorHex = "#10b981"; // emerald-500
    if (parentName === "PLAYING") colorHex = "#6366f1"; // indigo-500
    if (parentName === "SAVING") colorHex = "#f59e0b"; // amber-500
    if (parentName === "WORKING") colorHex = "#f43f5e"; // rose-500

    return {
      name: config.label,
      value,
      color: colorHex
    };
  });

  // Filtered transactions for list display based on selected category (parent category)
  const displayTransactions = selectedCategory
    ? filteredTransactions.filter((tx) => {
        if (tx.type !== "expense") return false;
        const subConfig = subCategoryConfig[tx.category];
        const txParent = subConfig ? subConfig.parent : "LIVING";
        return txParent === selectedCategory;
      })
    : filteredTransactions;

  // === FITUR PAGINASI ===
  const totalPages = Math.ceil(displayTransactions.length / ITEMS_PER_PAGE) || 1;
  const paginatedTransactions = displayTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <div className={`flex-1 w-full flex justify-center transition-colors duration-200 ${
      isDarkMode ? "bg-black" : "bg-zinc-100"
    }`}>
      {/* Mobile Frame Container */}
      <div className={`w-full max-w-md min-h-screen border-x flex flex-col relative shadow-2xl pb-24 transition-colors duration-200 ${
        isDarkMode ? "bg-zinc-950 text-white border-zinc-900" : "bg-zinc-50 text-zinc-900 border-zinc-200"
      }`}>
        
        {/* Header */}
        <header className={`sticky top-0 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between z-20 transition-colors duration-200 ${
          isDarkMode ? "bg-zinc-950/80 border-zinc-900/50" : "bg-zinc-50/80 border-zinc-200/50"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Wallet className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
            </div>
            <div>
              <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Halo,</p>
              <h2 className="text-sm font-bold">{user} 👋</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                isDarkMode 
                  ? "bg-zinc-900/60 border-zinc-800 text-amber-400 hover:text-amber-300" 
                  : "bg-white border-zinc-200 text-indigo-500 hover:text-indigo-600 shadow-sm"
              }`}
              title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                isDarkMode 
                  ? "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-red-400" 
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-red-500 shadow-sm"
              }`}
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="p-5 space-y-6 flex-1">
          {/* Warning Banner if Supabase is NOT configured */}
          {!isSupabaseConfigured && (
            <div className={`border p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
              isDarkMode ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-500/5 border-amber-500/30 text-amber-600"
            }`}>
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Demo Mode (Penyimpanan Lokal)</span>
              </div>
              <p>
                Konfigurasi Supabase belum terdeteksi. Data disimpan di browser Anda (LocalStorage). Lengkapi konfigurasi Supabase Anda di file <code className="font-mono text-[10px] bg-zinc-900/50 px-1 py-0.5 rounded">.env.local</code>.
              </p>
            </div>
          )}

          {/* Kalender Filter Navigator */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
            isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
          }`}>
            <button
              onClick={handlePrevMonth}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode ? "bg-zinc-950 hover:bg-zinc-800 text-zinc-400" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`} />
              <span className="text-sm font-bold">{getMonthLabel(selectedMonth)}</span>
            </div>
            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode ? "bg-zinc-950 hover:bg-zinc-800 text-zinc-400" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Saldo Card */}
          <div className={`relative overflow-hidden border rounded-[2rem] p-6 shadow-xl transition-all duration-200 ${
            isDarkMode 
              ? "bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-900 border-emerald-500/20 shadow-emerald-500/5" 
              : "bg-gradient-to-br from-emerald-500/10 via-white to-white border-emerald-500/20 shadow-zinc-200/50"
          }`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <p className={`text-xs font-semibold tracking-wider uppercase ${
              isDarkMode ? "text-emerald-400" : "text-emerald-600"
            }`}>
              Saldo Bulan Ini
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1.5 break-all">
              {formatRupiah(balance)}
            </h1>

            {/* Income & Expense summary */}
            <div className={`grid grid-cols-2 gap-4 mt-6 pt-6 border-t ${
              isDarkMode ? "border-zinc-800/80" : "border-zinc-100"
            }`}>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-0.5">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-[10px] font-semibold tracking-wider uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    Pemasukan
                  </p>
                  <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                    {formatRupiah(totalIncome)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 mt-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-[10px] font-semibold tracking-wider uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    Pengeluaran
                  </p>
                  <p className="text-sm font-bold text-rose-400 mt-0.5">
                    {formatRupiah(totalExpense)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <DonutChart 
            data={chartData} 
            title="Pembagian Kategori Pengeluaran" 
            isDarkMode={isDarkMode} 
            activeCategory={selectedCategory}
            onCategoryClick={(category) => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
          />

          {/* Daftar Riwayat Transaksi */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold tracking-wide flex items-center gap-2">
                <span>Riwayat Transaksi</span>
                {selectedCategory && (
                  <span 
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full cursor-pointer flex items-center gap-1 border transition-all ${
                      selectedCategory === "LIVING" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" :
                      selectedCategory === "PLAYING" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20" :
                      selectedCategory === "SAVING" ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20" :
                      "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                    }`}
                  >
                    <span>{selectedCategory}</span>
                    <span className="text-[10px] font-light">&times;</span>
                  </span>
                )}
              </h3>
              <span className={`text-[10px] font-medium ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                {displayTransactions.length} Transaksi
              </span>
            </div>

            {displayTransactions.length === 0 ? (
              <div className={`border border-dashed rounded-3xl p-10 text-center text-xs ${
                isDarkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-600" : "bg-white border-zinc-200 text-zinc-400 shadow-sm"
              }`}>
                <Database className="w-8 h-8 mx-auto mb-2.5 stroke-[1.5]" />
                <p>Belum ada catatan transaksi {selectedCategory ? `untuk kategori ${selectedCategory} ` : ""}di bulan ini</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {paginatedTransactions.map((tx) => {
                  const subConfig = subCategoryConfig[tx.category] || {
                    label: tx.category,
                    parent: "LIVING",
                    icon: AlertTriangle
                  };
                  const parentConfig = parentCategoryConfig[subConfig.parent] || parentCategoryConfig["LIVING"];
                  const IconComp = subConfig.icon;
                  const isExpense = tx.type === "expense";

                  return (
                    <div
                      key={tx.id}
                      className={`group flex items-center justify-between p-4 border rounded-2.5xl transition-all duration-200 ${
                        isDarkMode 
                          ? "bg-zinc-900 border-zinc-800/80 hover:border-zinc-800" 
                          : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Icon Subkategori */}
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${parentConfig.bg} border border-current/10 flex-shrink-0`}>
                          <IconComp className={`w-5 h-5 ${parentConfig.color} stroke-[1.8]`} />
                        </div>
                        {/* Detail Transaksi */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {tx.note || subConfig.label}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${parentConfig.bg} ${parentConfig.color}`}>
                              {parentConfig.label}
                            </span>
                            <div className="flex items-center gap-1">
                              <Calendar className={`w-3 h-3 ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`} />
                              <span className={`text-[10px] font-medium ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                {formatDate(tx.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nominal & Tombol Hapus */}
                      <div className="flex items-center gap-3 pl-3">
                        <span
                          className={`text-sm font-bold tracking-tight text-right ${
                            isExpense ? "text-rose-400" : "text-emerald-500"
                          }`}
                        >
                          {isExpense ? "-" : "+"}
                          {formatRupiah(tx.amount).replace("Rp", "")}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isDarkMode 
                              ? "bg-zinc-950/40 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" 
                              : "bg-zinc-100 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 shadow-sm"
                          }`}
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paginasi Controls */}
            {displayTransactions.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-3 px-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    currentPage === 1
                      ? "opacity-35 cursor-not-allowed border-transparent text-zinc-500"
                      : isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm"
                  }`}
                >
                  Sebelumnya
                </button>
                <span className={`text-[11px] font-medium ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    currentPage === totalPages
                      ? "opacity-35 cursor-not-allowed border-transparent text-zinc-500"
                      : isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm"
                  }`}
                >
                  Berikutnya
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Floating Action Button (FAB) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 md:absolute md:bottom-8 md:right-8 z-30 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 active:scale-95 hover:scale-105 hover:rotate-90 transition-all duration-300 cursor-pointer"
          title="Tambah Catatan Keuangan"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Footer info link GitHub */}
        <footer className={`text-center text-[10px] py-6 border-t mt-auto transition-colors duration-200 ${
          isDarkMode ? "text-zinc-600 border-zinc-900/60" : "text-zinc-400 border-zinc-200/60"
        }`}>
          <p className="flex items-center justify-center gap-1">
            <GithubIcon className="w-3.5 h-3.5" />
            <span>shiverzichida/catatkeuanganzag</span>
          </p>
        </footer>

        {/* Transaction Modal Bottom Sheet */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      </div>
    </div>
  );
}
