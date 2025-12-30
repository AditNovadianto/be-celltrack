import { db } from "../config/db.js";
import Notification from "./notificationModel.js";

// Create
export async function createTransaction(
  item,
  tanggal_transaksi,
  quantity,
  subtotal,
  total,
  jenis_transaksi,
  id_pelanggan
) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO transaksi (item, tanggal_transaksi, quantity, subtotal, total, jenis_transaksi, id_pelanggan) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        JSON.stringify(item),
        tanggal_transaksi,
        quantity,
        subtotal,
        total,
        jenis_transaksi,
        id_pelanggan,
      ]
    );

    item.map(async (produk) => {
      await createDetailTransaction(
        produk.quantity,
        produk.subtotal,
        produk.total,
        insertRes.insertId,
        produk.id_produk
      );
    });

    return { insertId: insertRes.insertId };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function createDetailTransaction(
  quantity,
  subtotal,
  total,
  id_transaksi,
  id_produk
) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO detail_transaksi (quantity, subtotal, total, id_transaksi, id_produk) VALUES (?, ?, ?, ?, ?)",
      [quantity, subtotal, total, id_transaksi, id_produk]
    );

    await updateStokProduk(id_produk, quantity);

    return { insertId: insertRes.insertId };
  } catch (error) {
    console.error("Error creating detail transaction:", error);
    throw error;
  }
}

// Read
export async function getAllTransactions() {
  try {
    const [rows] = await db.query("SELECT * FROM transaksi");

    const parsedRows = rows.map((row) => ({
      ...row,
      item: JSON.parse(row.item),
    }));

    return parsedRows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getTransactionById(id_transaksi) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM transaksi WHERE id_transaksi = ?",
      [id_transaksi]
    );

    const [detailRows] = await db.query(
      "SELECT * FROM detail_transaksi WHERE id_transaksi = ?",
      [id_transaksi]
    );

    return { ...rows[0], detail: detailRows };
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    throw error;
  }
}

// Update
export async function updateStokProduk(id_produk, quantity) {
  try {
    const [result] = await db.query(
      "UPDATE produk SET stok = stok - ? WHERE id_produk = ?",
      [quantity, id_produk]
    );

    const [[product]] = await db.query(
      "SELECT nama_produk, stok FROM produk WHERE id_produk = ?",
      [id_produk]
    );

    if (product && product.stok < 5) {
      await Notification.create({
        id_produk,
        stok: product.stok,
        message: `Stok produk ${product.nama_produk} tersisa ${product.stok}`,
        read: false,
      });
    }

    return result;
  } catch (error) {
    console.error("Error updating stock product:", error);
    throw error;
  }
}
