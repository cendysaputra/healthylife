# HealthyLife

**Your Daily Healthy Habit**

HealthyLife adalah *specialized platform* di bidang health & wellness yang menggabungkan konten edukasi pola hidup sehat dengan pencatatan aktivitas pribadi. Platform ini terdiri dari aplikasi web, aplikasi mobile, dan satu REST API yang dipakai bersama oleh keduanya.

Proyek ini dibuat untuk Soal 4 Take Home mata kuliah Specialized Platform Development, BINUS Online Learning.

## Fitur

**Konten edukasi**
- Artikel pola hidup sehat
- Video edukasi (embed YouTube dari kanal resmi)
- Panduan olahraga
- Informasi nutrisi
- Filter kategori dan pencarian konten
- Penjadwalan terbit konten: 30 konten, 20 tampil saat rilis dan 10 terbit bertahap

**Fitur personal (wajib login)**
- Registrasi dan login (JWT)
- Pencatatan aktivitas dan riwayat aktivitas
- Ringkasan dan target harian (default 30 menit)
- Simpan konten favorit
- Notifikasi konten baru (web: lonceng di navbar, mobile: layar notifikasi dan pengingat lokal)

## Tech stack

| Bagian | Teknologi |
|---|---|
| Web | React (create-react-app), React Router, Axios |
| Mobile | React Native (Expo, expo-router), Axios, expo-secure-store |
| Server | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB (lokal untuk pengembangan, MongoDB Atlas untuk produksi) |
| Deploy | Vercel (web), Railway (server), Expo Go dan APK (mobile) |

## Struktur folder

```
healthylife/
├── server/                 Node.js + Express + MongoDB
│   ├── config/db.js        koneksi MongoDB
│   ├── data/contents.json  data 30 konten
│   ├── models/             User, Content, Activity
│   ├── public/images/      thumbnail konten (<slug>.jpg)
│   └── seed.js             mengisi database dengan 30 konten
├── web/                    React (dalam pengerjaan)
└── mobile/                 Expo (dalam pengerjaan)
```

## Menjalankan server secara lokal

Butuh Node.js v22+ dan MongoDB Community Server (atau URI MongoDB Atlas).

```bash
cd server
cp .env.example .env    # isi MONGODB_URI dan JWT_SECRET
npm install
npm run seed            # isi 30 konten ke database
npm run dev             # http://localhost:5000
```

Isi `.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/healthylife
JWT_SECRET=ganti_dengan_string_acak_yang_panjang
```

## Model data

| Koleksi | Field utama |
|---|---|
| `users` | name, email, password (hash), dailyTarget, favorites, lastSeenAt |
| `contents` | no, title, slug, category, summary, body (Markdown), thumbnail, videoUrl, sources, publishedAt |
| `activities` | user, type, duration (menit), calories, note, date |

Kategori konten: `artikel`, `video`, `olahraga`, `nutrisi`.

## Catatan

- **Penjadwalan konten.** Konten tidak diterbitkan dengan cron. Setiap konten punya `publishedAt`, dan API hanya mengembalikan konten dengan `publishedAt <= sekarang`. Seed menghitung jadwal dari waktu seed dijalankan.
- **Video.** Video ditampilkan lewat embed YouTube dari kanal resmi (misalnya Kemenkes RI), bukan disimpan di server, supaya tidak membebani penyimpanan dan bandwidth hosting.
- **Hosting server.** Server di-deploy ke Railway karena verifikasi kartu di Render selalu gagal.
- **Sumber konten.** Konten ditulis ulang dengan mengacu pada WHO, Kementerian Kesehatan RI, CDC, dan lembaga resmi lain. Sumber dicantumkan di setiap konten.

## Link

| Item | URL |
|---|---|
| Desain Figma | - |
| Web | - |
| API | - |
| Expo Go (QR) | - |
| APK | - |

## Disclaimer

Konten di HealthyLife bersifat edukasi dan bukan pengganti saran tenaga medis.