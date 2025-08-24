# 📘 Notion Clone

Aplikasi pencatatan modern dan kaya fitur yang dibangun dengan **Next.js**, terinspirasi oleh Notion. Aplikasi ini menyediakan serangkaian alat komprehensif untuk membuat, mengorganisir, dan mengelola catatan Anda dalam antarmuka yang intuitif dan elegan.

---

## 🌟 Fitur Utama

### 🔑 Fungsionalitas Inti

- **Autentikasi Aman**  
  Sistem registrasi dan login pengguna yang kuat dengan manajemen sesi.

- **Editor Teks Kaya (WYSIWYG)**  
  Didukung oleh **TipTap**, mendukung *headings*, **bold**, *italic*, daftar, *checklists*, *blockquotes*, dan lainnya.

- **Catatan Hierarkis**  
  Buat dokumen bersarang tanpa batas dengan sidebar *drag-and-drop*.

- **Penyimpanan Real-time**  
  Semua perubahan tersimpan otomatis menggunakan mekanisme debounce.

### 📂 Organisasi & Produktivitas

- **Tampilan Papan Kanban**  
  Visualisasikan dan kelola sub-halaman dalam tampilan *drag-and-drop Kanban*, diatur berdasarkan status.

- **Properti Catatan Lanjutan**  
  Tambahkan metadata seperti:
  - Status: To Do, In Progress, Done
  - Prioritas: Low, Medium, High
  - Tanggal Jatuh Tempo
  - Tag

- **Sistem Tag Fleksibel**  
  Buat, kelola, dan tetapkan tag berwarna untuk kategorisasi.

- **Filter Lanjutan**  
  Saring catatan berdasarkan status, prioritas, atau tag di sidebar.

- **Sistem Sampah (Arsip)**  
  Arsipkan catatan alih-alih menghapus permanen. Bisa dikembalikan atau dihapus selamanya.

### 💡 UI/UX

- **Antarmuka Modern Mirip Notion**  
  Desain bersih, minimalis, dan berfokus pada produktivitas.

- **Sidebar yang Dapat Diubah Ukurannya**  
  Sesuaikan lebar sidebar sesuai preferensi.

- **Desain Sepenuhnya Responsif**  
  Mendukung desktop, tablet, dan perangkat seluler.

- **Tema Terang & Gelap**  
  Menyesuaikan tema berdasarkan preferensi sistem pengguna.

- **Status Memuat & Umpan Balik**  
  Notifikasi toast dan kerangka loading yang halus.

---

## 🛠️ Tumpukan Teknologi

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS 3, shadcn/ui
- **Manajemen State UI:** Zustand
- **Manajemen Data & Caching:** TanStack Query v5 (React Query)
- **Formulir & Validasi:** React Hook Form + Zod
- **Editor:** TipTap
- **Drag & Drop:** Dnd Kit
- **HTTP Client:** Axios
- **Ikon:** Lucide React
- **Bahasa:** TypeScript

---

## 📦 Instalasi

### 1. Clone Repositori

```bash
git clone [https://github.com/Ets028/notion-clone-client.git](https://github.com/Ets028/notion-clone-client.git)
cd notion-clone-client
````

### 2. Instal Dependensi

```bash
npm install
```

### 3. Siapkan Environment Variables

Buat file `.env.local` di root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 4. Jalankan Server Development

```bash
npm run dev
```

### 5. Buka di Browser

Akses: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Integrasi API

Pastikan backend Anda berjalan dan mendukung endpoint berikut:

### 🔐 Autentikasi

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/logout`
* `GET /auth/me`

### 📄 Catatan (Notes)

* `GET /notes` – Mendapatkan semua catatan (bisa difilter)
* `POST /notes` – Membuat catatan baru
* `GET /notes/archived` – Mendapatkan catatan diarsipkan
* `GET /notes/:id` – Mendapatkan detail catatan (termasuk children & tags)
* `PUT /notes/:id` – Memperbarui catatan
* `DELETE /notes/:id` – Mengarsipkan catatan
* `POST /notes/:id/restore` – Mengembalikan catatan dari arsip
* `DELETE /notes/:id/permanent` – Menghapus permanen
* `PATCH /notes/reorder` – Mengurutkan ulang catatan

### 🏷️ Tag

* `GET /tags` – Mendapatkan semua tag
* `POST /tags` – Membuat tag baru
* `PUT /tags/:id` – Memperbarui tag
* `DELETE /tags/:id` – Menghapus tag

---

## 🤝 Berkontribusi

1. **Fork** repositori ini
2. Buat branch baru:

   ```bash
   git checkout -b feature/fitur-keren-anda
   ```
3. Commit perubahan Anda:

   ```bash
   git commit -m 'Menambahkan fitur keren'
   ```
4. Push ke branch:

   ```bash
   git push origin feature/fitur-keren-anda
   ```
5. Buka **Pull Request**

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

**Selamat membuat kode! 🚀**

```
