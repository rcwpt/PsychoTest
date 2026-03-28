# 🧠 PsychoTest — Kenali Dirimu Lebih Dalam!

> **Aplikasi Asesmen Psikologi & Kepribadian yang Sangat Interaktif, Gamified, dan Colorful**

[![Static Site](https://img.shields.io/badge/Static-HTML%2FCSS%2FJS-blueviolet?style=flat-square)](https://github.com/rcwpt/PsychoTest)
[![No Backend](https://img.shields.io/badge/Backend-None-brightgreen?style=flat-square)](https://github.com/rcwpt/PsychoTest)
[![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)](LICENSE)

---

## 📖 Tentang Proyek

**PsychoTest** adalah aplikasi web asesmen psikologi dan kepribadian multi-halaman yang sepenuhnya berjalan di sisi klien (front-end only). Dirancang dengan tampilan modern, vibrant (cerah), penuh animasi, dan elemen gamifikasi — termasuk sebuah *mini-game intermezzo* di tengah sesi yang secara aktif berkontribusi pada analisis psikologis pengguna.

Tidak memerlukan server, database, atau akun. Semua data tersimpan secara lokal di perangkat pengguna melalui `localStorage`.

---

## 🎯 Alasan Pembuatan

Proyek ini dibuat untuk memenuhi kebutuhan akan sebuah alat asesmen kepribadian yang:

1. **Interaktif & Engaging** — Bukan sekadar kuesioner biasa. Tampilan colorful penuh ikon, animasi, dan transisi halaman membuat pengguna betah dari awal hingga akhir.
2. **Gamified** — Memasukkan *Intuitive Association Mini-Game* sebagai sesi intermezzo (jeda menyenangkan) di tengah kuesioner. Game ini bukan hanya hiburan — setiap pilihan dan kecepatan respons pengguna dicatat sebagai data psikologis.
3. **Berbasis Ilmu Psikologi** — Sistem penilaian mengukur tujuh dimensi psikologi: `Ekstrovert`, `Introvert`, `Inovatif`, `Stabil`, `Analitis`, `Intuitif`, dan `Impulsif`. Hasilnya dipetakan ke salah satu dari 5 tipe kepribadian yang didefinisikan secara ilmiah.
4. **Privasi Terjaga** — Tidak ada data yang dikirim ke server. Semua jawaban, skor, dan hasil tersimpan hanya di browser pengguna.
5. **Gratis & Aksesibel** — 100% gratis tanpa login, tanpa iklan, dan dapat dijalankan dari file HTML lokal maupun di-host di mana saja.
6. **Modern & Vibrant** — Desain menggunakan palet warna Neon/Vibrant (Electric Purple, Neon Green, Sunburst Orange) dengan efek glassmorphism, partikel animasi, dan efek hover di semua elemen interaktif.

---

## ✨ Fitur Utama

- 🎨 **Desain Vibrant & Animatif** — Latar belakang gradien animasi, sistem partikel CSS, transisi fade antar halaman, dan efek hover di semua kartu & tombol.
- ⌨️ **Typing Animation** — Judul pada landing page muncul dengan efek ketikan yang menarik.
- 📋 **8 Pertanyaan Kepribadian** — Dibagi menjadi 2 bagian (4+4), ditampilkan sebagai kartu glassmorphism interaktif dengan ikon FontAwesome.
- ⚡ **Mini-Game "Asosiasi Intuitif"** — 5 ronde, 30 detik, stimulus kata acak dengan 2 tombol pilihan ikon besar. Timer SVG ring yang berubah warna menjadi merah muda saat waktu hampir habis (≤8 detik).
- 📊 **Analisis Respons Game** — Kecepatan respons di bawah 1,2 detik menambah skor `Impulsif`; respons lambat menambah skor `Analitis`.
- 🏆 **Halaman Hasil Spektakuler** — Animasi confetti, ikon kepribadian melayang, tag sifat kepribadian, breakdown bar skor 7 dimensi, dan insight dari mini-game.
- 🔗 **Tombol Bagikan** — Mendukung Web Share API (mobile) dengan fallback salin ke clipboard.
- 📱 **Responsif** — Tampilan optimal di desktop maupun perangkat mobile.
- 💾 **Persistensi Data** — Jawaban tidak hilang jika halaman di-refresh secara tidak sengaja.

---

## 🖼️ Screenshots

### 🏠 Landing Page
*Judul animasi typing, ikon melayang, statistik, step indicator, dan tombol CTA berdenyut.*

![Landing Page](https://github.com/user-attachments/assets/bf67b199-4a53-4396-984e-7aa73d472e20)

---

### 📋 Halaman Kuesioner (Assessment)
*Kartu glassmorphism dengan ikon, progress bar langsung, dan step indicator aktif.*

![Assessment Page](https://github.com/user-attachments/assets/07eb416c-f680-4ff6-be5f-d27eb9ed5962)

---

### 🎮 Mini-Game "Asosiasi Intuitif"
*Kata stimulus acak, dua tombol pilihan ikon besar, dan SVG ring timer hitung mundur.*

![Mini-Game Page](https://github.com/user-attachments/assets/38d783d8-1380-4041-b5b9-84350fbd7d28)

---

### 🏆 Halaman Hasil
*Confetti celebration, tipe kepribadian, tag sifat, breakdown dimensi, dan insight mini-game.*

![Result Page](https://github.com/user-attachments/assets/aa022407-f268-4736-92d1-4131460192f8)

---

## 🗂️ Struktur File

```
PsychoTest/
├── index.html          # Landing page dengan animasi typing & CTA
├── assessment-1.html   # Kuesioner bagian 1 (4 pertanyaan)
├── game.html           # Mini-game "Asosiasi Intuitif"
├── assessment-2.html   # Kuesioner bagian 2 (4 pertanyaan)
├── result.html         # Halaman hasil & analisis kepribadian
├── css/
│   └── style.css       # Stylesheet terpusat (neon palette, glassmorphism, animasi)
├── js/
│   └── main.js         # Logika utama (fetch, localStorage, timer, skor, routing)
└── data/
    ├── questions.json       # Data 8 pertanyaan dengan bobot skor per opsi
    └── game-content.json    # Data stimulus & pilihan asosiasi mini-game
```

---

## 🏗️ Arsitektur

| Aspek | Detail |
|---|---|
| **Routing** | Setiap halaman dideklarasikan via atribut `data-page` pada `<body>`. `js/main.js` secara otomatis men-dispatch ke fungsi `init*()` yang sesuai saat `DOMContentLoaded`. |
| **State Management** | Semua jawaban, hasil game, dan skor tersimpan di `localStorage` menggunakan kunci bernama `psychotest_*`. |
| **Data Loading** | Konten pertanyaan dan stimulus game dimuat saat runtime via `fetch()` dari `data/*.json` — tidak ada konten yang di-hardcode di HTML/JS. |
| **Styling** | Satu file CSS terpusat dengan CSS custom properties untuk palet warna, animasi keyframe, dan sistem partikel murni CSS. |
| **Dependencies** | Hanya CDN eksternal: FontAwesome 6.5, Animate.css 4.1, dan canvas-confetti 1.9. |

---

## 🧬 Sistem Penilaian

### 7 Dimensi Psikologi

Setiap jawaban pada kuesioner dan pilihan pada mini-game memberikan bobot skor ke dimensi-dimensi berikut:

| Dimensi | Deskripsi |
|---|---|
| `ekstrovert` | Kecenderungan sosial & energi dari interaksi |
| `introvert` | Preferensi waktu sendiri & refleksi internal |
| `inovatif` | Kreativitas & keterbukaan terhadap hal baru |
| `stabil` | Ketenangan, keandalan & resistensi terhadap perubahan |
| `analitis` | Pemikiran logis, sistematis & berbasis data |
| `intuitif` | Penilaian berdasarkan perasaan & intuisi |
| `impulsif` | Kecenderungan bertindak cepat & spontan |

### Kontribusi Mini-Game
- Respons **< 1200 ms** → `+2 impulsif` (intuitif & cepat)
- Respons **≥ 1200 ms** → `+2 analitis` (hati-hati & terukur)
- Setiap pilihan asosiasi memiliki bobot skor ke dimensi tertentu (lihat `data/game-content.json`)

### 5 Tipe Kepribadian

| Tipe | Nama | Ciri Utama |
|---|---|---|
| 🧭 Explorer | **Sang Penjelajah** | Petualang, Kreatif, Spontan, Karismatik |
| 🧠 Thinker | **Sang Pemikir** | Analitis, Strategis, Teliti, Independen |
| 🤝 Connector | **Sang Penghubung** | Empati, Komunikatif, Harmonis, Hangat |
| 🛡️ Guardian | **Sang Penjaga** | Dapat Dipercaya, Setia, Stabil, Bijak |
| 🚀 Innovator | **Sang Inovator** | Inovatif, Visioner, Berani, Dinamis |

---

## 🛠️ Teknologi

- **HTML5** — Struktur multi-halaman semantik
- **CSS3** — Custom properties, keyframe animation, glassmorphism, flexbox
- **Vanilla JavaScript (ES6+)** — Fetch API, localStorage, DOM manipulation
- **[FontAwesome 6.5](https://fontawesome.com/)** — Seluruh ikon di aplikasi
- **[Animate.css 4.1](https://animate.style/)** — Animasi CSS siap pakai
- **[canvas-confetti 1.9](https://www.kirilv.com/canvas-confetti/)** — Efek confetti pada halaman hasil

---

## 🚀 Cara Menjalankan

Karena ini adalah aplikasi statis murni, kamu hanya perlu membukanya dengan web server lokal agar `fetch()` dapat memuat file JSON:

### Menggunakan Python (paling mudah)
```bash
# Python 3
python -m http.server 8080
# Buka http://localhost:8080
```

### Menggunakan Node.js
```bash
npx serve .
# atau
npx http-server .
```

### Menggunakan VS Code
Install ekstensi **Live Server**, klik kanan `index.html` → *Open with Live Server*.

> ⚠️ **Catatan:** Membuka `index.html` langsung via `file://` akan gagal karena `fetch()` diblokir oleh kebijakan CORS browser. Gunakan salah satu metode di atas.

---

## 🔒 Privasi

Aplikasi ini **tidak mengumpulkan, menyimpan, atau mengirimkan data apa pun ke server**. Semua jawaban dan hasil analisis hanya ada di `localStorage` browser kamu dan akan terhapus otomatis jika kamu membersihkan data browser atau klik tombol **"Coba Lagi"**.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
