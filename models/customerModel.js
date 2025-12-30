import { db } from "../config/db.js";

export async function createCustomer(nama_pelanggan, email, dob, no_telephon) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO pelanggan (nama_pelanggan, email, dob, no_telephon, id_toko) VALUES (?, ?, ?, ?, ?)",
      [nama_pelanggan, email, dob, no_telephon, 1]
    );

    return { insertId: insertRes.insertId };
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function getAllCustomers() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM pelanggan ORDER BY id_pelanggan DESC"
    );

    return rows;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export async function updateCustomerById(
  id_pelanggan,
  nama_pelanggan,
  email,
  dob,
  no_telephon
) {
  try {
    const [updateRes] = await db.query(
      "UPDATE pelanggan SET nama_pelanggan = ?, email = ?, dob = ?, no_telephon = ? WHERE id_pelanggan = ?",
      [nama_pelanggan, email, dob, no_telephon, id_pelanggan]
    );

    return updateRes;
  } catch (error) {
    console.error("Error updating customers:", error);
    throw error;
  }
}

export async function deleteCustomerById(id_pelanggan) {
  try {
    const [deleteRes] = await db.query(
      "DELETE FROM pelanggan WHERE id_pelanggan = ?",
      [id_pelanggan]
    );

    return deleteRes;
  } catch (error) {
    console.error("Error deleting customers:", error);
    throw error;
  }
}
