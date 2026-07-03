# Panduan Kolaborasi & Pengembangan CatatKeuangan 📱💻

Dokumen ini berisi panduan setup proyek lokal dan integrasi dengan AI coding assistant (**Antigravity CLI**) untuk pengembang kolaborator.

---

## 1. Persiapan Proyek Lokal

Klon repositori ini ke komputer Anda, pasang dependensi, dan jalankan server pengembangan lokal.

```bash
# 1. Klon repositori
git clone https://github.com/shiverzichida/catatkeuanganzag.git
cd catatkeuanganzag

# 2. Instal dependensi npm
npm install

# 3. Jalankan server lokal
npm run dev
```
Setelah berjalan, buka [http://localhost:3000](http://localhost:3000) di browser. Kredensial login adalah:
* **Username**: `Nahel`
* **Password**: `Nahel@26`

---

## 2. Konfigurasi Database (Supabase)

Buat file bernama `.env.local` pada direktori root proyek ini, lalu salin dan tempelkan (copy-paste) konfigurasi berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ambxzkjrhmhufxijzakz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_0bJV0mIyrqa_qqEqVOvenA_DZ_7fOQO
```

---

## 3. Cara Mengembangkan Menggunakan Antigravity CLI

Anda dapat berkolaborasi langsung menggunakan AI Agent Antigravity di komputer Anda dengan alur kerja berikut:

1. Pastikan Anda berada di root direktori proyek `/catatkeuanganzag`.
2. Jalankan perintah inisialisasi Antigravity CLI di terminal Anda.
3. Berikan instruksi langsung ke Agent untuk melanjutkan pengembangan fitur. Contoh instruksi yang dapat Anda berikan:
   * *"Tolong buat tampilan grafik pengeluaran bulanan lebih menarik"*
   * *"Perbaiki layout modal di layar HP kecil agar tidak terpotong"*

---

## 4. Alur Kontribusi Git

Agar kode tetap rapi dan tidak terjadi konflik:

1. **Selalu buat branch baru** sebelum memulai fitur:
   ```bash
   git checkout -b feature/nama-fitur-anda
   ```
2. **Lakukan verifikasi lokal** sebelum commit:
   ```bash
   npm run build
   ```
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: deskripsi perubahan fitur Anda"
   git push origin feature/nama-fitur-anda
   ```
4. Buka repositori GitHub, lalu buat **Pull Request (PR)** ke branch `main`. Kode yang disetujui akan dideploy otomatis ke Vercel secara realtime.
