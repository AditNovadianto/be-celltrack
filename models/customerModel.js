import { db } from "../config/db.js";

export async function createCustomer(nama_pelanggan, email, dob, no_telephon) {
  try {
    const [insertRes] = await db.query(
      "INSERT INTO pelanggan (nama_pelanggan, email, dob, no_telephon) VALUES (?, ?, ?, ?)",
      [nama_pelanggan, email, dob, no_telephon]
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
