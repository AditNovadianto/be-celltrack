import { db } from "../config/db.js";

// Create
export async function storeProducts(
  sku_produk,
  kategori_produk,
  nama_produk,
  harga_beli,
  harga_jual,
  stok,
  approved,
  id_user,
  id_supplier
) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO produk (sku_produk, kategori_produk, nama_produk, harga_beli, harga_jual, stok, approved, id_user, id_supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        sku_produk,
        kategori_produk,
        nama_produk,
        harga_beli,
        harga_jual,
        stok,
        approved,
        id_user,
        id_supplier,
      ]
    );

    return { insertId: insertRes.insertId };
  } catch (error) {
    console.error("Error storing products:", error);
    throw error;
  }
}

// Read
export async function getAllProducts() {
  const [rows] = await db.query("SELECT * FROM produk ORDER BY id_produk DESC");

  return rows;
}

export async function getProductById(id_produk) {
  const [rows] = await db.query("SELECT * FROM produk WHERE id_produk = ?", [
    id_produk,
  ]);

  return rows[0];
}

// Update
export async function updateProduct(
  id_produk,
  sku_produk,
  kategori_produk,
  nama_produk,
  harga_beli,
  harga_jual,
  stok,
  approved
) {
  const [result] = await db.query(
    `UPDATE produk SET
      sku_produk = ?,
      kategori_produk = ?,
      nama_produk = ?,
      harga_beli = ?,
      harga_jual = ?,
      stok = ?,
      approved = ?
     WHERE id_produk = ?`,
    [
      sku_produk,
      kategori_produk,
      nama_produk,
      harga_beli,
      harga_jual,
      stok,
      approved,
      id_produk,
    ]
  );

  return result.affectedRows;
}

// Delete
export async function deleteProduct(id_produk) {
  const [result] = await db.query("DELETE FROM produk WHERE id_produk = ?", [
    id_produk,
  ]);

  return result.affectedRows;
}
