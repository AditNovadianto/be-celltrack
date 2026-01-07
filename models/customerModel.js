import { db } from "../config/db.js";
import { getServiceRequestById } from "./serviceRequestModel.js";
import jwt from "jsonwebtoken";

const signToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(
    {
      sub: user.id_pelanggan,
      nama_pelanggan: user.nama_pelanggan,
      id_pelanggan: user.id_pelanggan,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15min",
      issuer: "my-app",
      audience: "my-app-users",
      algorithm: "HS256",
    }
  );
};

const sanitizeCustomer = (s) => ({
  id_pelanggan: s.id_pelanggan,
  nama_pelanggan: s.nama_pelanggan,
  dob: s.dob,
  email: s.email,
  no_telephon: s.no_telephon,
});

export async function signInCustomer(kode_service, email) {
  try {
    // 1. Ambil customer
    const [rowsCustomer] = await db.query(
      `SELECT id_pelanggan, nama_pelanggan, dob, email, no_telephon, id_toko
       FROM pelanggan
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (rowsCustomer.length === 0) {
      return null; // customer tidak ditemukan
    }

    const customer = rowsCustomer[0];

    // 2. Ambil service request
    const serviceRequest = await getServiceRequestById(kode_service);

    if (!serviceRequest) {
      return null; // service request tidak ditemukan
    }

    // 3. Validasi kepemilikan
    if (
      Number(serviceRequest[0].id_pelanggan) !== Number(customer.id_pelanggan)
    ) {
      console.log("Email tidak sesuai dengan pemilik kode service");
      return null;
    }

    // 4. Generate token
    const token = signToken(customer);

    return {
      customer: sanitizeCustomer(customer),
      serviceRequest,
      token,
    };
  } catch (error) {
    console.error("Error signing in Customer:", error);
    throw error;
  }
}

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
