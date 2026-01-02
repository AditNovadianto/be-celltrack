import { db } from "../config/db.js";

// Create
export async function createServiceRequest(
  nama_pelanggan,
  keterangan,
  tanggal_mulai,
  tanggal_selesai,
  status,
  harga,
  id_pelanggan
) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO service_request (nama_pelanggan, keterangan, tanggal_mulai, tanggal_selesai, status, harga, id_pelanggan) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nama_pelanggan,
        keterangan,
        tanggal_mulai,
        tanggal_selesai,
        status,
        harga,
        id_pelanggan,
      ]
    );

    return { insertId: insertRes.insertId };
  } catch (error) {
    console.error("Error create Service Request:", error);
    throw error;
  }
}

// Read
export async function getALlServiceRequests() {
  const [rows] = await db.query(
    "SELECT * FROM service_request ORDER BY id_service_request DESC"
  );

  return rows;
}
