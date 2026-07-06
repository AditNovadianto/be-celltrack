# Software Code Documentation (SCD)

## CellTrack Backend API - be-celltrack

Repository: https://github.com/AditNovadianto/be-celltrack  
Template acuan: CBC Documentation Templates - README for Software

---

## 1. Project Title

**CellTrack Backend API (be-celltrack)**

CellTrack adalah backend berbasis Node.js dan Express yang menyediakan API untuk manajemen toko, supplier, produk, pelanggan, teknisi, service request, transaksi, notifikasi, feedback, dan pembayaran virtual account melalui Midtrans.

---

## 2. Overview

Aplikasi backend ini berperan sebagai layanan utama untuk sistem inventori dan layanan servis perangkat/produk. Backend menghubungkan frontend dengan database SQL untuk data operasional utama, MongoDB untuk data berbasis dokumen seperti feedback/notifikasi/status service request, serta integrasi Midtrans untuk pembayaran.

Fitur utama:

- Manajemen user internal beserta role.
- Registrasi dan login supplier, pelanggan, teknisi, dan user.
- Manajemen produk, stok, restock, assignment produk, dan export Excel.
- Pembuatan transaksi dan detail transaksi produk.
- Pembuatan service request oleh pelanggan dan penanganan oleh teknisi.
- Update status service request dan status pembayaran.
- Penyimpanan feedback, notifikasi stok, dan status service request pada MongoDB.

Tech stack utama:

- Node.js + Express
- MySQL melalui `mysql2/promise`
- MongoDB melalui Mongoose
- JWT Authentication
- Midtrans Core API
- Nodemailer
- ExcelJS

---

## 3. Getting Started

### 3.1 Prerequisites

| Kebutuhan               | Keterangan                                                                 |
| ----------------------- | -------------------------------------------------------------------------- |
| Node.js dan npm         | Runtime JavaScript dan package manager backend.                            |
| MySQL/MariaDB           | Database relasional utama.                                                 |
| MongoDB                 | Database dokumen untuk feedback, notification, dan service request status. |
| Midtrans account        | Untuk server key dan virtual account payment.                              |
| Email SMTP/app password | Untuk fitur email notification.                                            |
| Postman/Thunder Client  | Untuk pengujian endpoint API.                                              |

### 3.2 Installing

```bash
git clone https://github.com/AditNovadianto/be-celltrack.git
cd be-celltrack
npm install
cp .env.example .env
npm run dev
```

### 3.3 Environment Variables

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
MONGO_URI=
SECRET_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=
MIDTRANS_CALLBACK_TOKEN=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
```

---

## 4. Repository Structure

```text
be-celltrack/
├── config/
│   ├── db.js
│   ├── db_mongo.js
│   └── midtrans.js
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── feedbackController.js
│   ├── notificationController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── serviceRequestController.js
│   ├── serviceRequestStatusController.js
│   ├── supplierController.js
│   ├── technicianController.js
│   └── transactionController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── customerModel.js
│   ├── feedbackModel.js
│   ├── notificationModel.js
│   ├── paymentModel.js
│   ├── productModel.js
│   ├── serviceRequestModel.js
│   ├── serviceRequestStatusModel.js
│   ├── supplierModel.js
│   ├── technicianModel.js
│   └── transactionModel.js
├── routes/
│   ├── authRoute.js
│   ├── customerRoute.js
│   ├── feedbackRoute.js
│   ├── notificationRoute.js
│   ├── paymentRoute.js
│   ├── productRoute.js
│   ├── serviceRequestRoute.js
│   ├── serviceRequestStatusRoute.js
│   ├── suppilerRoute.js
│   ├── technicianRoute.js
│   └── transactionRoute.js
├── utils/
│   ├── crypto.js
│   └── mailer.js
├── .env.example
├── index.js
├── package-lock.json
└── package.json
```

---

## 5. System Architecture

```text
Client / Frontend
   ↓ HTTP Request
Express Routes → Middleware Auth → Controllers → Models
   ↓                                 ↓
JSON/File Response              MySQL + MongoDB + Midtrans
```

Alur umum:

1. Client/frontend mengirim HTTP request ke backend Express.
2. Route menerima request lalu meneruskan ke controller.
3. Middleware `verifyToken` memvalidasi `Authorization: Bearer <token>` pada endpoint yang dilindungi.
4. Controller memanggil model untuk query MySQL atau MongoDB.
5. Payment controller/model berkomunikasi dengan Midtrans Core API.
6. Response dikirim kembali dalam format JSON, kecuali endpoint export Excel.

---

## 6. Database Documentation

Entity utama:

| Entity/Table     | Primary Key         | Deskripsi                                     |
| ---------------- | ------------------- | --------------------------------------------- |
| toko             | id_toko             | Data toko/cabang.                             |
| supplier         | id_supplier         | Data pemasok produk.                          |
| users            | id_user             | User internal.                                |
| roles            | id_role             | Referensi role user.                          |
| produk           | id_produk           | Data produk, stok, harga, supplier, dan user. |
| pelanggan        | id_pelanggan        | Data pelanggan.                               |
| teknisi          | id_teknisi          | Data teknisi.                                 |
| service_request  | id_service_request  | Permintaan layanan pelanggan.                 |
| transaksi        | id_transaksi        | Header transaksi.                             |
| detail_transaksi | id_detail_transaksi | Detail item transaksi.                        |
| log_transaksi    | id_log_transaksi    | Riwayat transaksi.                            |

---

## 7. API Documentation

Base URL local default: `http://localhost:3000`  
Endpoint dengan auth membutuhkan header: `Authorization: Bearer <token>`

| Module                 | Method | Endpoint                              | Description                  | Auth |
| ---------------------- | -----: | ------------------------------------- | ---------------------------- | ---- |
| Auth                   |   POST | `/signUpUsers`                        | Registrasi user internal     | No   |
| Auth                   |   POST | `/signInUsers`                        | Login user internal          | No   |
| Auth                   |    GET | `/getAllUsers`                        | Daftar user                  | No   |
| Supplier               |   POST | `/signUpSuppliers`                    | Registrasi supplier          | No   |
| Supplier               |   POST | `/signInSuppliers`                    | Login supplier               | No   |
| Supplier               |    GET | `/getAllSuppliers`                    | Daftar supplier              | No   |
| Technician             |   POST | `/signUpTechnicians`                  | Registrasi teknisi           | No   |
| Technician             |   POST | `/signInTechnicians`                  | Login teknisi                | No   |
| Technician             |    GET | `/getAllTechnicians`                  | Daftar teknisi               | No   |
| Customer               |   POST | `/signInCustomers`                    | Login pelanggan              | No   |
| Customer               |   POST | `/createCustomer`                     | Membuat pelanggan            | Yes  |
| Customer               |    GET | `/getAllCustomers`                    | Daftar pelanggan             | Yes  |
| Customer               |    GET | `/getCustomerById/:id_customer`       | Detail pelanggan             | Yes  |
| Customer               |    PUT | `/updateCustomerById/:id_pelanggan`   | Update pelanggan             | Yes  |
| Customer               | DELETE | `/deleteCustomerById/:id_pelanggan`   | Hapus pelanggan              | Yes  |
| Product                |   POST | `/storeProducts`                      | Simpan produk                | Yes  |
| Product                |    GET | `/getAllProducts`                     | Daftar produk                | Yes  |
| Product                |    GET | `/getProductById/:id`                 | Detail produk                | Yes  |
| Product                |    PUT | `/updateProductById/:id`              | Update produk                | Yes  |
| Product                |    PUT | `/assignProductToEmployee/:id`        | Assign produk                | Yes  |
| Product                |    PUT | `/reStockProduct`                     | Restock produk               | Yes  |
| Product                | DELETE | `/deleteProduct/:id`                  | Hapus produk                 | Yes  |
| Product                |    GET | `/exportExcel`                        | Export produk Excel          | Yes  |
| Transaction            |   POST | `/createTransaction`                  | Buat transaksi               | Yes  |
| Transaction            |    GET | `/getAllTransactions`                 | Daftar transaksi             | Yes  |
| Transaction            |    GET | `/getTransactionById/:id_transaksi`   | Detail transaksi             | Yes  |
| Service Request        |   POST | `/createServiceRequest`               | Buat service request         | Yes  |
| Service Request        |    GET | `/getAllServiceRequests`              | Daftar service request       | Yes  |
| Service Request        |   POST | `/getServiceRequestById`              | Detail service request       | Yes  |
| Service Request        |    PUT | `/takeServiceRequest`                 | Teknisi mengambil request    | Yes  |
| Service Request        |    PUT | `/updateStatusServiceRequest`         | Update status request        | Yes  |
| Service Request        |    PUT | `/cancelServiceRequest`               | Batalkan request             | Yes  |
| Feedback               |   POST | `/submitFeedback`                     | Kirim feedback               | No   |
| Feedback               |    GET | `/getFeedbackByUserId/:id_pelanggan`  | Feedback pelanggan           | No   |
| Notification           |    GET | `/getAllNotifications`                | Daftar notifikasi            | Yes  |
| Notification           |   POST | `/markNotificationAsRead/:id`         | Tandai notifikasi dibaca     | Yes  |
| Service Request Status |    GET | `/getAllServiceRequestStatus`         | Daftar status request        | Yes  |
| Service Request Status |   POST | `/markServiceRequestStatusAsRead/:id` | Tandai status dibaca         | Yes  |
| Payment                |   POST | `/payments/create-va`                 | Buat virtual account         | No   |
| Payment                |   POST | `/midtrans/callback`                  | Callback pembayaran Midtrans | No   |

---

## 8. Authentication and Authorization

Autentikasi menggunakan JWT. Token dikirim melalui header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Kemungkinan response middleware:

| Kondisi                                 | Response            |
| --------------------------------------- | ------------------- |
| Token tidak dikirim                     | `401 Token missing` |
| Token expired                           | `401 Token expired` |
| Token invalid                           | `403 Invalid token` |
| Role tidak sesuai untuk operasi non-GET | `403 Access denied` |

---

## 9. Payment and Transaction Flow

1. Client membuat service request atau transaksi yang membutuhkan pembayaran.
2. Client memanggil endpoint `/payments/create-va`.
3. Backend membuat `order_id` dengan pola `SR-{kode_service}-{timestamp}`.
4. Backend mengirim request charge ke Midtrans Core API.
5. Midtrans mengembalikan virtual account.
6. Midtrans memanggil `/midtrans/callback` saat status pembayaran berubah.
7. Backend memperbarui `status_pembayaran` pada tabel `service_request`.

---

## 10. Tests

Pada `package.json`, script test masih berupa placeholder:

```bash
npm test
```

Rekomendasi testing:

- Unit test controller/model dengan Jest atau Vitest.
- Integration test endpoint dengan Supertest.
- Mock Midtrans untuk payment flow.
- Database khusus testing atau transaction rollback.
- Postman collection untuk smoke test manual.

---

## 11. Deployment

```bash
npm install --production
npm start
```

Catatan deployment:

- Gunakan HTTPS pada production.
- Simpan secret pada environment provider.
- Jangan commit `.env`, `node_modules`, atau credential.
- Batasi CORS berdasarkan domain frontend production.
- Aktifkan logging dan monitoring error.
- Validasi callback Midtrans.

---

## 12. Contributing

Kontribusi pada project dilakukan melalui version control GitHub. Setiap perubahan sebaiknya dilakukan melalui branch terpisah, kemudian dilakukan review sebelum digabungkan ke branch utama.

Alur kontribusi yang disarankan:

1. Clone repository.
2. Buat branch baru sesuai fitur atau perbaikan.
3. Lakukan perubahan kode.
4. Jalankan testing.
5. Commit perubahan dengan pesan yang jelas.
6. Push branch ke repository.
7. Ajukan pull request atau merge request.

---

## 13. Release History

| Version | Perubahan                                                |
| ------- | -------------------------------------------------------- |
| 1.0.0   | Versi awal backend CellTrack berdasarkan `package.json`. |

---

## 14. Authors

| Nama/Role      | Keterangan                                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| AditNovadianto | Pemilik repository GitHub `be-celltrack`.                                        |
| Penyusun SCD   | Dokumentasi disusun berdasarkan repository, ERD, dan tree file yang dilampirkan. |

---

## 15. References

- CBC Documentation Templates - README for Software: https://compbiocore.github.io/cbc-documentation-templates/readme/
- Repository GitHub: https://github.com/AditNovadianto/be-celltrack
