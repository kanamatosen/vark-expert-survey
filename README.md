PANDUAN PENGGUNAAN APLIKASI.txt
📌 SISTEM PAKAR VARK SURVEY
Halo! 👋 Terima kasih sudah melihat project ini.

=====================================
📋 FITUR UTAMA
=====================================
- Analisa gaya belajar dengan berbagai macam soal
- Sistem pakar berbasis forward chaining untuk rekomendasi
- Tampilan bersih dan responsif
- Admin panel untuk memudahkan admin mengecek hasil survei mahasiswa

=====================================
🛠️ CARA INSTALL & JALANKAN APLIKASI
=====================================

📥 OPSI 1: JALANKAN SECARA LOKAL

1. Ekstrak file 7z proyek ini.
   (Catatan: folder `node_modules` tidak disertakan)

2. Buka terminal di dalam folder proyek.

3. Jalankan perintah berikut untuk meng-install dependency:
   npm install

4. Jalankan aplikasi dengan perintah:
   npm run dev

   Aplikasi akan berjalan di:
   http://localhost:8080

📦 OPSI 2: MELALUI GITHUB

1. Clone repositori ini dari GitHub:
   git clone https://github.com/kanamatosen/vark-expert-survey

2. Masuk ke folder proyek:
   cd vark-expert-guide

3. Jalankan:
   npm install
   npm run dev

   Aplikasi akan berjalan di:
   http://localhost:8080

🌐 OPSI 3: LIHAT APLIKASI ONLINE (vercel)

Aplikasi ini juga dapat langsung diakses melalui:

> https://vark-expert-survey-guide.vercel.app/

=====================================
🔐 AKUN ADMIN (UNTUK MELIHAT RIWAYAT PENGERJAAN)
=====================================

📧 Email: vark@admin.com
🔑 Password: vark2024

=====================================
🧠 ANALISA & SISTEM PAKAR
=====================================
Untuk melihat rekomendasi dan proses forward chaining:

📄 File logika dan juga rekomendasi sistem pakar:
> src\utils\expertSystem.ts

=====================================
❓ MASALAH UMUM
=====================================
- Jika `npm install` gagal:
  - Pastikan sudah meng-install Node.js versi terbaru.
  - Coba hapus file `package-lock.json` lalu jalankan ulang `npm install`.

- Jika aplikasi tidak berjalan setelah `npm run dev`:
  - Pastikan tidak ada port yang bentrok (default: 8080).
  - Coba jalankan ulang terminal atau restart komputer.

- Tidak perlu membuat file `.env`, karena semua konfigurasi sudah termasuk dalam kode.

=====================================
📬 DIKEMBANGKAN OLEH
=====================================
💼 KELOMPOK 6 - Mata Kuliah Sistem Pakar  
Universitas Samudra - Teknik Informatika

1. Wan Anjasmara  (230504095)  
2. Tarisa Zafira  (230504134)  
3. Nuzulia Ramadhan (230504111)

GitHub: https://github.com/kanamatosen/vark-expert-survey-guide)


Terima kasih sudah mencoba aplikasi ini! 
