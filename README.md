# PWUTS_A10_25091397026 – SiMagang (Dashboard Dosen)

UTS Pemrograman Web – D4 Manajemen Informatika 2025, Universitas Negeri Surabaya.
Topik: **Sistem Monitoring Praktik Kerja Lapang Mahasiswa** (Kelompok A10). Peran yang dikerjakan: **Dosen**.

## Struktur
| File | Keterangan |
|---|---|
| `index.html` | 2.a – Layout utama (navbar atas, hero, footer), responsif, dashboard dosen |
| `pages/mahasiswa.html` | 2.b – Daftar mahasiswa bimbingan + simulasi validasi laporan mingguan |
| `pages/input-nilai.html` | 2.c – Form input nilai dosen dengan validasi jQuery |
| `assets/css/style.css`, `assets/js/app.js` | Gaya (Poppins, biru #001460) dan logika jQuery |

## Fitur
- **Responsive**: navbar atas berubah menjadi menu hamburger di layar ≤ 820 px.
- **Ajax**: menu "Daftar Mahasiswa" dan "Input Nilai" memuat halaman lewat `$.load()` ke dalam layout utama tanpa reload.
- **2.b Interaktif**: pencarian nama/NIM, filter status laporan, rincian laporan per minggu, tombol *Validasi minggu ke-N* yang hanya aktif jika semua laporan minggu itu berstatus *disetujui* (aturan SRS bagian 2.4 no. 7). Status berubah menjadi *divalidasi* di tampilan.
- **2.c Validasi**: mahasiswa wajib dipilih, nilai 0–100, catatan minimal 10 karakter, pernyataan wajib dicentang. Pesan error muncul per kolom. Nilai akhir dihitung otomatis. Form baru terkirim (HTTP POST) bila semua valid.
- Struktur field form mengikuti tabel **Nilai Dosen** pada SRS (`magang_id`, `nilai_laporan`, `nilai_keaktifan`, `nilai_akhir`, `catatan`).

## Cara menjalankan
Karena memakai Ajax, buka lewat web server lokal (bukan klik dua kali `index.html`):
```
python -m http.server 8000     # lalu buka http://localhost:8000
```
atau ekstensi Live Server di VS Code. Bisa juga lewat GitHub Pages.

## Catatan
- Data mahasiswa di `app.js` adalah data simulasi (tanpa database).
- `action` form diarahkan ke `https://httpbin.org/post` sebagai server HTTP contoh; ganti dengan endpoint backend sendiri.
- jQuery 3.7.1 dan font Poppins dimuat dari CDN.
