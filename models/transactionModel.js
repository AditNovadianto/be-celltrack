import { db } from "../config/db.js";

export async function createTransaction(
  item,
  tanggal_transaksi,
  quantity,
  subtotal,
  total,
  jenis_transaksi,
  id_pelanggan,
  id_produk
) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO transaksi (item, tanggal_transaksi, quantity, subtotal, total, jenis_transaksi, id_pelanggan, id_produk) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        item,
        tanggal_transaksi,
        quantity,
        subtotal,
        total,
        jenis_transaksi,
        id_pelanggan,
      ]
    );

    return { insertId: insertRes.insertId };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}
