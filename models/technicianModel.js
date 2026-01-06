import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign(
    {
      sub: user.id_teknisi,
      nama_teknisi: user.nama_teknisi,
      id_teknisi: user.id_teknisi,
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

const sanitizeTechnician = (s) => ({
  id_teknisi: s.id_teknisi,
  nama_teknisi: s.nama_teknisi,
  status: s.status,
  email_teknisi: s.email_teknisi,
});

export async function signUpTechnician(technicianData) {
  const { nama_teknisi, email_teknisi, password } = technicianData;

  const hashed = await bcrypt.hash(password, 10);

  try {
    const [insertRes] = await db.query(
      "INSERT INTO teknisi (nama_teknisi, status, email_teknisi, password, id_toko) VALUES (?, ?, ?, ?, ?)",
      [nama_teknisi, "ACTIVE", email_teknisi, hashed, 1]
    );

    const token = signToken({
      id_teknisi: insertRes.insertId,
      nama_teknisi,
      id_toko: 1,
    });

    return {
      teknisi: sanitizeTechnician({
        id_teknisi: insertRes.insertId,
        nama_teknisi,
        status: "ACTIVE",
        email_teknisi,
        id_toko: 1,
      }),
      token,
    };
  } catch (error) {
    console.error("Error signing up teknisi:", error);
    throw error;
  }
}

export async function signInTechnician(email, password) {
  try {
    const [rows] = await db.query(
      "SELECT id_teknisi, nama_teknisi, status, email_teknisi, password, id_toko FROM teknisi WHERE email_teknisi = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return null; // Technician not found
    }

    const technician = rows[0];

    const passwordMatch = await bcrypt.compare(password, technician.password);

    if (!passwordMatch) {
      return null; // Invalid password
    }

    const token = signToken(technician);

    return {
      teknisi: sanitizeTechnician(technician),
      token,
    };
  } catch (error) {
    console.error("Error signing in teknisi:", error);
    throw error;
  }
}

export async function getAllTechnicians() {
  try {
    const [rows] = await db.query(
      "SELECT id_teknisi, nama_teknisi, status, email_teknisi, id_toko FROM teknisi"
    );

    return rows;
  } catch (error) {
    console.error("Error retrieving teknisi:", error);
    throw error;
  }
}
