import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(
    {
      sub: user.id_supplier,
      nama_supplier: user.nama_supplier,
      id_supplier: user.id_supplier,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5min",
      issuer: "my-app",
      audience: "my-app-users",
      algorithm: "HS256",
    }
  );
};

const sanitizeSupplier = (s) => ({
  id_supplier: s.id_supplier,
  nama_supplier: s.nama_supplier,
  email: s.email,
  alamat_supplier: s.alamat_supplier,
  no_telephon: s.no_telephon,
  kategori_supplier: s.kategori_supplier,
});

export async function signUpSupplier(supplierData) {
  const {
    nama_supplier,
    email,
    alamat_supplier,
    no_telephon,
    kategori_supplier,
    password,
  } = supplierData;

  const hashed = await bcrypt.hash(password, 10);

  try {
    const [insertRes] = await db.query(
      "INSERT INTO supplier (nama_supplier, email, alamat_supplier, no_telephon, kategori_supplier, password, id_toko) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nama_supplier,
        email,
        alamat_supplier,
        no_telephon,
        kategori_supplier,
        hashed,
        1,
      ]
    );

    const token = signToken({
      id_supplier: insertRes.insertId,
      nama_supplier,
      id_toko: 1,
    });

    return {
      supplier: sanitizeSupplier({
        id_supplier: insertRes.insertId,
        nama_supplier,
        email,
        alamat_supplier,
        no_telephon,
        kategori_supplier,
        id_toko: 1,
      }),
      token,
    };
  } catch (error) {
    console.error("Error signing up supplier:", error);
    throw error;
  }
}

export async function signInSupplier(email, password) {
  try {
    const [rows] = await db.query(
      "SELECT id_supplier, nama_supplier, email, password, alamat_supplier, no_telephon, kategori_supplier, id_toko FROM supplier WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return null; // Supplier not found
    }

    const supplier = rows[0];

    const passwordMatch = await bcrypt.compare(password, supplier.password);

    if (!passwordMatch) {
      return null; // Invalid password
    }

    const token = signToken(supplier);

    return {
      supplier: sanitizeSupplier(supplier),
      token,
    };
  } catch (error) {
    console.error("Error signing in supplier:", error);
    throw error;
  }
}
