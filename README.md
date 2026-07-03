# CatatKeuangan 📱💼

Aplikasi web pencatatan keuangan sederhana yang ramah perangkat seluler (mobile-first), didesain dengan estetika premium gelap (dark mode), didukung oleh **Next.js**, **Tailwind CSS**, dan **Firebase Firestore**.

## Fitur Utama

- 🔒 **Login Keamanan Sederhana**: Masuk dengan username `Nahel` dan password `Nahel@26`.
- 📊 **Dashboard Ringkasan Saldo**: Lihat total saldo, total pemasukan, dan total pengeluaran Anda dalam sebulan berjalan secara instan.
- 🥧 **Visualisasi Grafik SVG Donut**: Diagram lingkaran interaktif untuk melacak pengeluaran berdasarkan kategori.
- 💸 **Pencatatan Transaksi Cepat**:
  - **Pemasukan**: Gaji, Investasi, Sampingan, Lain-lain.
  - **Pengeluaran**: Cicilan, Utilitas, Makanan, Transportasi, Belanja, Hiburan, Lain-lain.
- 🔄 **Realtime Database (Firestore)**: Sinkronisasi data secara langsung dengan cloud.
- 📦 **Penyimpanan Fallback (LocalStorage)**: Tetap dapat dijalankan secara instan sebagai demo meskipun Firebase belum dikonfigurasi.

## Spesifikasi Stack Teknologi

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Cloud Firebase Firestore
- **Ikon**: Lucide React
- **Hosting**: Vercel

---

## Cara Menjalankan secara Lokal

1. **Klon Repositori**:
   ```bash
   git clone https://github.com/shiverzichida/catatkeuanganzag.git
   cd catatkeuanganzag
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Buat file `.env.local` di root folder dan isi dengan kredensial Firebase Anda:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
   ```

4. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
