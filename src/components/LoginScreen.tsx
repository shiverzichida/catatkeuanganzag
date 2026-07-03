"use client";

import React, { useState } from "react";
import { Wallet, Lock, User, AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulasi delay sedikit biar kerasa realistik & smooth
    setTimeout(() => {
      if (username === "Nahel" && password === "Nahel@26") {
        onLoginSuccess("Nahel");
      } else {
        setError("Username atau password salah!");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="w-full max-w-sm bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 transform hover:scale-105 transition-transform duration-300">
            <Wallet className="w-8 h-8 text-zinc-950 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            CatatKeuangan
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Kelola pengeluaran harian Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase ml-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 outline-none transition-colors duration-200 text-sm"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 outline-none transition-colors duration-200 text-sm"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold py-3.5 rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all duration-150 text-sm shadow-lg shadow-emerald-500/10 flex items-center justify-center mt-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Masuk ke Akun"
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 text-center text-xs text-zinc-600">
          <p>Gunakan kredensial yang disetujui:</p>
          <p className="mt-1 font-mono text-zinc-500">Nahel / Nahel@26</p>
        </div>
      </div>
    </div>
  );
}
