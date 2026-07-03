"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Apple,
  ShoppingCart,
  Sparkles,
  Activity,
  Coffee,
  Shirt,
  MapPin,
  Store,
  Home,
  Wrench,
  Fuel,
  Cookie,
  CupSoda,
  Users,
  Zap,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Heart,
  Coins,
  PiggyBank,
  Monitor,
  Baby,
  Briefcase,
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
  parent_category: string;
  date: string;
  note: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionInput) => Promise<void>;
}

// Konfigurasi Kategori Utama (Parent Categories)
export const parentCategoryConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  LIVING: { label: "LIVING", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: Home },
  PLAYING: { label: "PLAYING", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", icon: Gamepad2 },
  SAVING: { label: "SAVING", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: PiggyBank },
  WORKING: { label: "WORKING", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", icon: Briefcase },
  INCOME: { label: "PEMASUKAN", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", icon: Coins }
};

// Konfigurasi Subkategori Detail
export const subCategoryConfig: Record<string, { label: string; parent: string; icon: any }> = {
  // === LIVING ===
  "Buah": { label: "Buah", parent: "LIVING", icon: Apple },
  "Groceries - Makan": { label: "Groceries", parent: "LIVING", icon: ShoppingCart },
  "Kebersihan Rumah": { label: "Kebersihan", parent: "LIVING", icon: Sparkles },
  "Kesehatan": { label: "Kesehatan", parent: "LIVING", icon: Activity },
  "Makan Lainnya": { label: "Makan Lain", parent: "LIVING", icon: Coffee },
  "Pakaian": { label: "Pakaian", parent: "LIVING", icon: Shirt },
  "Parkir": { label: "Parkir", parent: "LIVING", icon: MapPin },
  "Pasar": { label: "Pasar", parent: "LIVING", icon: Store },
  "Perabotan Rumah": { label: "Perabotan", parent: "LIVING", icon: Home },
  "Repair": { label: "Repair", parent: "LIVING", icon: Wrench },
  "Servis & Bensin": { label: "Servis & Bensin", parent: "LIVING", icon: Fuel },
  "Skin & Body Care": { label: "Skin Care", parent: "LIVING", icon: Sparkles },
  "Snack UPF": { label: "Snack UPF", parent: "LIVING", icon: Cookie },
  "Susu": { label: "Susu", parent: "LIVING", icon: CupSoda },
  "Upah/Gaji ART": { label: "Gaji ART", parent: "LIVING", icon: Users },
  "Utilitas": { label: "Utilitas", parent: "LIVING", icon: Zap },

  // === PLAYING ===
  "Edukasi": { label: "Edukasi", parent: "PLAYING", icon: BookOpen },
  "Makan Weekend": { label: "Makan Weekend", parent: "PLAYING", icon: Coffee },
  "Play & Gym - Mama Papa": { label: "Gym Mama Papa", parent: "PLAYING", icon: Dumbbell },
  "Play & Learn - Zayyan": { label: "Play Zayyan", parent: "PLAYING", icon: Gamepad2 },
  "Sosial": { label: "Sosial", parent: "PLAYING", icon: Heart },

  // === SAVING ===
  "Sinking Fund": { label: "Sinking Fund", parent: "SAVING", icon: Coins },
  "Tabungan Mama (BSI)": { label: "Tabungan Mama", parent: "SAVING", icon: PiggyBank },
  "Tabungan Papa (BCA)": { label: "Tabungan Papa", parent: "SAVING", icon: PiggyBank },

  // === WORKING ===
  "Alat Kerja": { label: "Alat Kerja", parent: "WORKING", icon: Monitor },
  "Babysitting": { label: "Babysitting", parent: "WORKING", icon: Baby },
  "Work from Cafe": { label: "Work from Cafe", parent: "WORKING", icon: Coffee },

  // === PEMASUKAN ===
  "Gaji": { label: "Gaji Utama", parent: "INCOME", icon: Coins },
  "Investasi": { label: "Investasi", parent: "INCOME", icon: TrendingUp },
  "Sampingan": { label: "Sampingan", parent: "INCOME", icon: Award },
  "Lain-lain": { label: "Lain-lain", parent: "INCOME", icon: HelpCircle }
};

export default function TransactionModal({ isOpen, onClose, onSubmit }: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [parentCat, setParentCat] = useState("LIVING");
  const [subCat, setSubCat] = useState("Groceries - Makan");
  const [amountStr, setAmountStr] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);
      
      setAmountStr("");
      setNote("");
      setType("expense");
      setParentCat("LIVING");
      setSubCat("Groceries - Makan");
    }
  }, [isOpen]);

  // Sesuaikan kategori default saat tipe transaksi berubah
  useEffect(() => {
    if (type === "expense") {
      setParentCat("LIVING");
      setSubCat("Groceries - Makan");
    } else {
      setParentCat("INCOME");
      setSubCat("Gaji");
    }
  }, [type]);

  // Sesuaikan subkategori default saat kategori utama berubah
  useEffect(() => {
    if (type === "expense") {
      if (parentCat === "LIVING") setSubCat("Groceries - Makan");
      if (parentCat === "PLAYING") setSubCat("Edukasi");
      if (parentCat === "SAVING") setSubCat("Sinking Fund");
      if (parentCat === "WORKING") setSubCat("Alat Kerja");
    }
  }, [parentCat, type]);

  if (!isOpen) return null;

  // Filter subkategori berdasarkan kategori utama aktif
  const filteredSubCategories = Object.keys(subCategoryConfig).filter(
    (key) => subCategoryConfig[key].parent === parentCat
  );

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
        category: subCat,
        parent_category: parentCat,
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
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Bottom Sheet */}
      <div className="relative w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[2.5rem] p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto flex flex-col animate-slide-up">
        {/* Drag Handle */}
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-5"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white">Tambah Transaksi</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Tipe Transaksi */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950/80 rounded-2xl mb-5">
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
        <form onSubmit={handleFormSubmit} className="space-y-4.5 flex-1">
          {/* Nominal */}
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
              className={`w-full bg-transparent text-4xl font-bold tracking-tight outline-none border-b border-zinc-800 py-2.5 ${
                type === "expense" ? "text-rose-400 focus:border-rose-500" : "text-emerald-400 focus:border-emerald-500"
              }`}
            />
          </div>

          {/* Kategori Utama (Parent Selector) - Khusus Pengeluaran */}
          {type === "expense" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-1">
                Kategori Utama
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["LIVING", "PLAYING", "SAVING", "WORKING"].map((key) => {
                  const config = parentCategoryConfig[key];
                  const IconComp = config.icon;
                  const isSelected = parentCat === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setParentCat(key)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-center ${
                        isSelected
                          ? `${config.bg} border-current ${config.color} font-bold scale-102`
                          : "bg-zinc-950/40 border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
                      }`}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                      <span className="text-[10px] tracking-wide">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subkategori Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase ml-1">
              Pilih Subkategori
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-[190px] overflow-y-auto pr-1">
              {filteredSubCategories.map((key) => {
                const config = subCategoryConfig[key] || subCategoryConfig["Lain-lain"];
                const IconComp = config.icon;
                const isSelected = subCat === key;
                const parentColor = parentCategoryConfig[parentCat]?.color || "text-zinc-400";
                const parentBg = parentCategoryConfig[parentCat]?.bg || "bg-zinc-500/10";

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSubCat(key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 ${
                      isSelected
                        ? `${parentBg} border-current ${parentColor} font-semibold scale-102 shadow-sm`
                        : "bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                    }`}
                  >
                    <IconComp className="w-5 h-5 stroke-[1.8]" />
                    <span className="text-[10px] tracking-wide text-center truncate w-full">
                      {config.label}
                    </span>
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
                placeholder="cth: Makan siang, beli kopi, dll."
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-white text-sm placeholder-zinc-700 outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-zinc-950 font-bold py-3.5 rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all text-sm mt-6 shadow-lg ${
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
