import { db } from "../config/db.js";
import ServiceRequestStatus from "../models/serviceRequestStatusModel.js";
import { decryptId, encryptId } from "../utils/crypto.js";

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
      "INSERT INTO service_request (nama_pelanggan, keterangan, tanggal_mulai, tanggal_selesai, status, harga, status_pembayaran, id_pelanggan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nama_pelanggan,
        keterangan,
        tanggal_mulai,
        tanggal_selesai,
        status,
        harga,
        "UNPAID",
        id_pelanggan,
      ]
    );

    await ServiceRequestStatus.create({
      id_service_request: insertRes.insertId,
      status: status,
      readBy: [],
    });

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

  return rows.map((row) => ({
    ...row,
    kode_service: encryptId(row.id_service_request),
  }));
}

export async function getServiceRequestById(kode_service) {
  try {
    // decrypt kode_service → id_service_request
    const id_service_request = decryptId(kode_service);

    const [rows] = await db.query(
      "SELECT * FROM service_request WHERE id_service_request = ?",
      [id_service_request]
    );

    if (!rows.length) {
      return null;
    }

    return rows.map((row) => ({
      ...row,
      kode_service: encryptId(row.id_service_request),
    }));
  } catch (error) {
    console.error("Error Get Service Request By ID:", error);
    throw error;
  }
}

// Update
export async function takeServiceRequest(id_service_request, id_teknisi) {
  try {
    const [result] = await db.query(
      "UPDATE service_request SET id_teknisi = ?, status = ? WHERE id_service_request = ?",
      [id_teknisi, "ON PROGRESS", id_service_request]
    );

    await ServiceRequestStatus.findOneAndUpdate(
      { id_service_request },
      {
        $set: {
          status: "ON PROGRESS",
          readBy: [],
        },
      },
      {
        new: true,
        upsert: false,
      }
    );

    return result.affectedRows;
  } catch (error) {
    console.error("Error Take Service Request:", error);
    throw error;
  }
}

export async function updateStatusServiceRequest(id_service_request, status) {
  try {
    const [result] = await db.query(
      "UPDATE service_request SET status = ? WHERE id_service_request = ?",
      [status, id_service_request]
    );

    await ServiceRequestStatus.findOneAndUpdate(
      { id_service_request },
      {
        $set: {
          status,
          readBy: [],
        },
      },
      {
        new: true,
        upsert: false,
      }
    );

    return result.affectedRows;
  } catch (error) {
    console.error("Error Update Status Service Request:", error);
    throw error;
  }
}

export async function cancelServiceRequest(id_service_request) {
  try {
    const [result] = await db.query(
      "UPDATE service_request SET status = ? WHERE id_service_request = ?",
      ["CANCELED", id_service_request]
    );

    await ServiceRequestStatus.findOneAndUpdate(
      { id_service_request },
      {
        $set: {
          status: "CANCELED",
          readBy: [],
        },
      },
      {
        new: true,
        upsert: false,
      }
    );

    return result.affectedRows;
  } catch (error) {
    console.error("Error Canceled Service Request:", error);
    throw error;
  }
}
