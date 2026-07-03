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
  AlertTriangle
} from "lucide-react";

// Custom SVG Github Icon to avoid version mismatch
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
import { db, isFirebaseConfigured } from "../lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import LoginScreen from "../components/LoginScreen";
import TransactionModal, { TransactionInput, categoryConfig } from "../components/TransactionModal";
import DonutChart from "../components/DonutChart";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note: string;
  createdAt?: any;
}

// Data awal (Seed Data) untuk simulasi LocalStorage jika database kosong
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "seed-1",
    amount: 5000000,
    type: "income",
    category: "Gaji",
    date: new Date().toISOString().split("T")[0],
    note: "Gaji Pokok Nahel"
  },
  {
    id: "seed-2",
    amount: 1500000,
    type: "expense",
    category: "Cicilan",
    date: new Date().toISOString().split("T")[0],
    note: "Cicilan Motor Baru"
  },
  {
    id: "seed-3",
    amount: 250000,
    type: "expense",
    category: "Utilitas",
    date: new Date().toISOString().split("T")[0],
    note: "Bayar Listrik & Wifi"
  },
  {
    id: "seed-4",
    amount: 120000,
    type: "expense",
    category: "Makanan",
    date: new Date().toISOString().split("T")[0],
    note: "Makan Malam Bersama Keluarga"
  }
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Jalankan hanya setelah component ter-mount di client
  useEffect(() => {
    setIsMounted(true);
    // Cek status login di localStorage
    const savedUser = localStorage.getItem("keuangan_user");
    if (savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  // Sinkronisasi data transaksi
  useEffect(() => {
    if (!isAuthenticated) return;

    if (isFirebaseConfigured && db) {
      // Menggunakan Firebase Firestore
      const q = query(collection(db, "transactions"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loadedTransactions = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              amount: data.amount,
              type: data.type,
              category: data.category,
              date: data.date,
              note: data.note,
              createdAt: data.createdAt
            } as Transaction;
          });
          setTransactions(loadedTransactions);
        },
        (error) => {
          console.error("Firestore error, falling back to LocalStorage:", error);
          loadFromLocalStorage();
        }
      );

      return () => unsubscribe();
    } else {
      // Fallback ke LocalStorage jika Firebase belum dikonfigurasi
      loadFromLocalStorage();
    }
  }, [isAuthenticated]);

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("transactions_data");
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      localStorage.setItem("transactions_data", JSON.stringify(INITIAL_TRANSACTIONS));
      setTransactions(INITIAL_TRANSACTIONS);
    }
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
    if (isFirebaseConfigured && db) {
      // Simpan ke Firestore
      await addDoc(collection(db, "transactions"), {
        ...input,
        createdAt: Timestamp.now()
      });
    } else {
      // Simpan ke LocalStorage
      const newTx: Transaction = {
        id: "tx-" + Date.now(),
        ...input
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem("transactions_data", JSON.stringify(updated));
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (!confirmDelete) return;

    if (isFirebaseConfigured && db) {
      // Hapus dari Firestore
      await deleteDoc(doc(db, "transactions", id));
    } else {
      // Hapus dari LocalStorage
      const updated = transactions.filter((tx) => tx.id !== id);
      setTransactions(updated);
      localStorage.setItem("transactions_data", JSON.stringify(updated));
    }
  };

  // Kalkulasi Keuangan
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  // Siapkan data untuk DonutChart
  const expenseCategories = ["Cicilan", "Utilitas", "Makanan", "Transportasi", "Belanja", "Hiburan", "Lain-lain"];
  const chartData = expenseCategories.map((catName) => {
    const value = transactions
      .filter((tx) => tx.type === "expense" && tx.category === catName)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const config = categoryConfig[catName] || categoryConfig["Lain-lain"];
    // Ambil kode warna hex dari tailwind yang sesuai dengan visualisasi
    let colorHex = "#71717a"; // Default zinc
    if (catName === "Cicilan") colorHex = "#f43f5e"; // rose-500
    if (catName === "Utilitas") colorHex = "#f59e0b"; // amber-500
    if (catName === "Makanan") colorHex = "#ea580c"; // orange-600
    if (catName === "Transportasi") colorHex = "#3b82f6"; // blue-500
    if (catName === "Belanja") colorHex = "#a855f7"; // purple-500
    if (catName === "Hiburan") colorHex = "#6366f1"; // indigo-500

    return {
      name: catName,
      value,
      color: colorHex
    };
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: React.HTMLAttributes<HTMLSpanElement>["className"] = "text-xs text-zinc-500";
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

  // Mencegah error hidrasi server-side Next.js
  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex-1 w-full bg-zinc-950 flex justify-center">
      {/* Mobile Container Frame */}
      <div className="w-full max-w-md bg-zinc-950 min-h-screen border-x border-zinc-900 flex flex-col relative shadow-2xl pb-24">
        
        {/* Header */}
        <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/50 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Wallet className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Halo,</p>
              <h2 className="text-sm font-bold text-white">{user} 👋</h2>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 active:scale-95 transition-all"
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="p-5 space-y-6 flex-1">
          {/* Warning Banner if Firebase is NOT configured */}
          {!isFirebaseConfigured && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-2xl text-xs space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Demo Mode (Penyimpanan Lokal)</span>
              </div>
              <p>
                Konfigurasi Firebase belum terdeteksi. Data saat ini hanya disimpan di browser Anda (LocalStorage). Lengkapi konfigurasi Firebase Anda di file <code className="font-mono text-[10px] bg-zinc-900 px-1 py-0.5 rounded">.env.local</code> untuk menggunakan cloud database.
              </p>
            </div>
          )}

          {/* Saldo Utama Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-900 border border-emerald-500/20 rounded-[2rem] p-6 shadow-xl shadow-emerald-500/5">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Total Saldo
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1.5 break-all">
              {formatRupiah(balance)}
            </h1>

            {/* Sub Summary Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800/80">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-0.5">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
                    Pemasukan
                  </p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {formatRupiah(totalIncome)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 mt-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
                    Pengeluaran
                  </p>
                  <p className="text-sm font-bold text-rose-400 mt-0.5">
                    {formatRupiah(totalExpense)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grafik Donut Pengeluaran */}
          <DonutChart data={chartData} title="Pembagian Kategori Pengeluaran" />

          {/* Daftar Riwayat Transaksi */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Riwayat Transaksi
              </h3>
              <span className="text-[10px] text-zinc-500 font-medium">
                {transactions.length} Transaksi
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-3xl p-10 text-center text-zinc-600 text-xs">
                <Database className="w-8 h-8 mx-auto mb-2.5 stroke-[1.5]" />
                <p>Belum ada catatan transaksi</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {transactions.map((tx) => {
                  const config = categoryConfig[tx.category] || categoryConfig["Lain-lain"];
                  const IconComp = config.icon;
                  const isExpense = tx.type === "expense";

                  return (
                    <div
                      key={tx.id}
                      className="group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800/80 rounded-2.5xl hover:border-zinc-800 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Icon Kategori */}
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${config.bg} border border-current/10 flex-shrink-0`}>
                          <IconComp className={`w-5 h-5 ${config.color} stroke-[1.8]`} />
                        </div>
                        {/* Judul & Tanggal */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {tx.note || config.label}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Calendar className="w-3 h-3 text-zinc-600" />
                            <span className="text-[10px] text-zinc-500 font-medium">
                              {formatDate(tx.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Nominal & Tombol Hapus */}
                      <div className="flex items-center gap-3 pl-3">
                        <span
                          className={`text-sm font-bold tracking-tight text-right ${
                            isExpense ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {isExpense ? "-" : "+"}
                          {formatRupiah(tx.amount).replace("Rp", "")}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-2 rounded-xl bg-zinc-950/40 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all"
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
        <footer className="text-center text-[10px] text-zinc-600 py-6 border-t border-zinc-900/60 mt-auto">
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
