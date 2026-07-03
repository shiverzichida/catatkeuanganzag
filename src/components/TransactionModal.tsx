"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Zap,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Coins,
  TrendingUp,
  Award,
  HelpCircle,
  Calendar,
  FileText
} from "lucide-react";

export interface TransactionInput {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionInput) => Promise<void>;
}

// Map kategori ke Ikon dan Warna styling
export const categoryConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  // Pengeluaran
  Cicilan: { label: "Cicilan", icon: CreditCard, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  Utilitas: { label: "Utilitas", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  Makanan: { label: "Makanan", icon: Utensils, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  Transportasi: { label: "Transportasi", icon: Car, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  Belanja: { label: "Belanja", icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  Hiburan: { label: "Hiburan", icon: Film, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  
  // Pemasukan
  Gaji: { label: "Gaji", icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Investasi: { label: "Investasi", icon: TrendingUp, color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
  Sampingan: { label: "Sampingan", icon: Award, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  
  // Bersama / Umum
  "Lain-lain": { label: "Lain-lain", icon: HelpCircle, color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20" }
};

export default function TransactionModal({ isOpen, onClose, onSubmit }: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amountStr, setAmountStr] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set tanggal default ke hari ini saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);
      
      // Reset form
      setAmountStr("");
      setNote("");
      setType("expense");
      setCategory("Makanan");
    }
  }, [isOpen]);

  // Sesuaikan kategori default jika berganti type
  useEffect(() => {
    if (type === "expense") {
      setCategory("Makanan");
    } else {
      setCategory("Gaji");
    }
  }, [type]);

  if (!isOpen) return null;

  const expenseCategories = ["Cicilan", "Utilitas", "Makanan", "Transportasi", "Belanja", "Hiburan", "Lain-lain"];
  const incomeCategories = ["Gaji", "Investasi", "Sampingan", "Lain-lain"];
  const activeCategories = type === "expense" ? expenseCategories : incomeCategories;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountStr.replace(/[^0-9]/g, ""));
    if (!numAmount || numAmount <= 0) {
      alert("Masukkan nominal transaksi yang valid");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: numAmount,
        type,
        category,
        date,
        note: note.trim()
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan transaksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format ribuan otomatis sewaktu mengetik
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    if (rawVal === "") {
      setAmountStr("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(rawVal, 10));
    setAmountStr(formatted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal / Bottom Sheet */}
      <div className="relative w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[2.5rem] p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto flex flex-col animate-slide-up">
        {/* Drag Handle Bar */}
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-5"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Tambah Transaksi</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle Type */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`py-3 rounded-xl text-sm font-semibold transition-all ${
              type === "expense"
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`py-3 rounded-xl text-sm font-semibold transition-all ${
              type === "income"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="space-y-5 flex-1">
          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-1">
              Nominal (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="0"
              required
              className={`w-full bg-transparent text-4xl font-bold tracking-tight outline-none border-b border-zinc-800 py-3 ${
                type === "expense" ? "text-rose-400 focus:border-rose-500" : "text-emerald-400 focus:border-emerald-500"
              }`}
            />
          </div>

          {/* Kategori Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-1">
              Pilih Kategori
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {activeCategories.map((catKey) => {
                const config = categoryConfig[catKey] || categoryConfig["Lain-lain"];
                const IconComp = config.icon;
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all duration-150 ${
                      isSelected
                        ? `${config.bg} border-current ${config.color} scale-102 font-semibold shadow-md`
                        : "bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                    }`}
                  >
                    <IconComp className={`w-6 h-6 stroke-[1.8]`} />
                    <span className="text-xs tracking-wide">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tanggal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-1">
              Tanggal Transaksi
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-white text-sm outline-none"
              />
            </div>
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-1">
              Catatan (Keterangan)
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="cth: Bayar kos, beli bensin, dll."
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-white text-sm placeholder-zinc-700 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-zinc-950 font-bold py-4 rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all text-sm mt-8 shadow-lg ${
              type === "expense"
                ? "bg-gradient-to-r from-rose-500 to-orange-500 shadow-rose-500/10"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/10"
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Simpan Transaksi"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
