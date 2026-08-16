# English Reading Nook 📖

Aplikasi web sederhana untuk belajar membaca & menghafal kosakata bahasa
Inggris lewat cerita pendek. Tidak butuh server/backend — cukup buka
`index.html` di browser (atau upload foldernya ke hosting statis seperti
Netlify/GitHub Pages).

## Fitur

- **Klik kata → arti langsung muncul.** Setiap kata dalam cerita otomatis
  bisa diklik. Muncul kartu ("kartu kata") berisi terjemahan Bahasa
  Indonesia, definisi bahasa Inggris, dan contoh kalimat.
- **Tombol "👁 Lihat Arti Cerita"** — di setiap cerita, tekan tombol ini untuk
  menampilkan terjemahan Bahasa Indonesia di bawah setiap paragraf sekaligus
  (tidak perlu klik kata satu per satu). Tekan lagi untuk menyembunyikannya.
- **Tombol suara 🔊** — dengar pengucapan kata (atau seluruh cerita) memakai
  suara text-to-speech bawaan browser (Web Speech API).
- **Simpan ke Kosakata Saya ♡** — kata yang disimpan tersimpan otomatis di
  `localStorage` browser (tidak butuh akun/login) dan bisa dilihat lagi di
  halaman `vocab.html`.
- **🌙 Mode Nyaman Mata** — tema layar rendah-silau (warna hangat & redup,
  bukan hitam pekat maupun putih terang) untuk pengguna dengan mata sensitif,
  termasuk penderita glaukoma. Tombolnya ada di kanan atas setiap halaman,
  dan pilihannya otomatis tersimpan/diingat di semua halaman.
- **Filter level** cerita (Pemula / Menengah) di halaman utama.
- Desain "buku catatan" yang santai, supaya proses menghafal terasa lebih
  menyenangkan.

## Struktur folder

```
english-reading-app/
├── index.html              ← halaman utama (daftar cerita)
├── vocab.html               ← halaman "Kosakata Saya"
├── assets/
│   ├── css/style.css        ← semua styling
│   └── js/
│       ├── app.js           ← logika klik-kata, suara, simpan vocab
│       └── stories-data.js  ← DAFTAR CERITA (manifest)
└── stories/
    ├── _template.html       ← template kosong untuk cerita baru
    ├── the-new-neighbor.html
    ├── a-day-at-the-market.html
    ├── my-first-job-interview.html
    ├── weekend-trip.html
    └── ordering-at-a-restaurant.html
```

## Cara menambah cerita baru

Kamu **tidak perlu** mengubah `index.html` sama sekali. Cukup dua langkah:

1. **Copy file template** menjadi cerita baru:
   ```
   cp stories/_template.html stories/judul-cerita-baru.html
   ```
   Di dalam `<div id="story-text">`, tulis setiap paragraf sebagai
   pasangan (lihat contoh di file template):
   ```html
   <div class="para-pair">
     <p class="story-en">English paragraph here.</p>
     <p class="story-id">Terjemahan Indonesia paragraf ini.</p>
   </div>
   ```
   Kamu tidak perlu menandai kata satu-satu — sistem otomatis membuat
   setiap kata pada `.story-en` bisa diklik. Baris `.story-id` akan
   otomatis muncul saat pembaca menekan tombol "👁 Lihat Arti Cerita".

2. **Daftarkan cerita itu** dengan menambahkan satu object baru di array
   `STORIES` pada `assets/js/stories-data.js`:
   ```js
   {
     id: "judul-cerita-baru",
     file: "stories/judul-cerita-baru.html",
     emoji: "☕",
     title: "Story Title",
     titleId: "Judul dalam Bahasa Indonesia",
     level: "Pemula",              // atau "Menengah"
     summary: "Ringkasan singkat cerita ini.",
     words: 400,
     minutes: 4,
   },
   ```

Cerita barumu akan otomatis muncul di halaman utama sebagai kartu baru.

## Catatan teknis

- Arti kata (terjemahan) diambil dari API gratis **MyMemory Translation**.
- Definisi bahasa Inggris diambil dari API gratis **dictionaryapi.dev**.
- Suara pengucapan memakai **Web Speech API** milik browser (gratis, tanpa
  API key), jadi kualitas suara tergantung browser/perangkat pengguna.
- Karena kedua API di atas diakses langsung dari browser, aplikasi ini
  butuh koneksi internet saat kata diklik (tapi tidak butuh server sendiri).
- Data kosakata tersimpan tersimpan di `localStorage`, per-browser/perangkat.
