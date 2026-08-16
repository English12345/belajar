/* ============================================================
   STORY MANIFEST
   Setiap cerita baru WAJIB didaftarkan di sini agar muncul
   di halaman utama (index.html). Cara menambah cerita baru:

   1. Copy file stories/_template.html -> stories/nama-cerita.html
   2. Ganti judul & isi cerita di dalamnya.
   3. Tambahkan satu object baru di array STORIES di bawah ini.

   Tidak perlu mengubah index.html sama sekali.
   ============================================================ */

const STORIES = [
  {
    id: "new-neighbor",
    file: "stories/the-new-neighbor.html",
    emoji: "🏠",
    title: "The New Neighbor",
    titleId: "Tetangga Baru",
    level: "Pemula",
    summary:
      "Mira bertemu tetangga barunya untuk pertama kali. Cerita santai berisi sapaan dan basa-basi sehari-hari.",
    words: 380,
    minutes: 4,
  },
  {
    id: "day-at-the-market",
    file: "stories/a-day-at-the-market.html",
    emoji: "🧺",
    title: "A Day at the Market",
    titleId: "Sehari di Pasar",
    level: "Pemula",
    summary:
      "Ikuti Sari berbelanja di pasar pagi — tawar-menawar, membeli sayur, dan mengobrol dengan penjual.",
    words: 420,
    minutes: 4,
  },
  {
    id: "job-interview",
    file: "stories/my-first-job-interview.html",
    emoji: "💼",
    title: "My First Job Interview",
    titleId: "Wawancara Kerja Pertamaku",
    level: "Menengah",
    summary:
      "Dimas gugup menghadapi wawancara kerja pertamanya. Penuh kalimat formal yang berguna untuk dunia kerja.",
    words: 460,
    minutes: 5,
  },
  {
    id: "weekend-trip",
    file: "stories/weekend-trip.html",
    emoji: "🚌",
    title: "A Weekend Trip to the Mountains",
    titleId: "Liburan Akhir Pekan ke Gunung",
    level: "Pemula",
    summary:
      "Keluarga Rina berlibur ke pegunungan. Banyak kosakata perjalanan, cuaca, dan alam.",
    words: 400,
    minutes: 4,
  },
  {
    id: "restaurant-order",
    file: "stories/ordering-at-a-restaurant.html",
    emoji: "🍜",
    title: "Ordering at a Restaurant",
    titleId: "Memesan Makanan di Restoran",
    level: "Pemula",
    summary:
      "Andi dan Lisa makan malam di restoran baru. Dialog lengkap seputar memesan makanan dan minuman.",
    words: 370,
    minutes: 4,
  },
  {
    id: "difficult-decision",
    file: "stories/the-difficult-decision.html",
    emoji: "🧭",
    title: "The Difficult Decision",
    titleId: "Keputusan yang Sulit",
    level: "Sulit",
    summary:
      "Farah mempertimbangkan meninggalkan pekerjaan mapan untuk membangun bisnisnya sendiri. Kosakata kaya, kalimat kompleks, cocok untuk level lanjutan.",
    words: 630,
    minutes: 7,
  },
];

// expose globally for index.html / vocab.html
window.STORIES = STORIES;
