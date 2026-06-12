import { db } from "../config/db.js";
import ServiceRequestStatus from "../models/serviceRequestStatusModel.js";
import { decryptId, encryptId } from "../utils/crypto.js";
import { transporter } from "../utils/mailer.js";

// Create
export async function createServiceRequest(
  nama_pelanggan,
  keterangan,
  tanggal_mulai,
  tanggal_selesai,
  status,
  harga,
  id_pelanggan,
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
      ],
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
    "SELECT * FROM service_request ORDER BY id_service_request DESC",
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
      [id_service_request],
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
      [id_teknisi, "ON PROGRESS", id_service_request],
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
      },
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
      [status, id_service_request],
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
      },
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
      ["CANCELED", id_service_request],
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
      },
    );

    return result.affectedRows;
  } catch (error) {
    console.error("Error Canceled Service Request:", error);
    throw error;
  }
}

export async function pushEmailNotification(id_service_request) {
  try {
    const [service_request] = await db.query(
      "SELECT * FROM service_request WHERE id_service_request = ?",
      [id_service_request],
    );

    if (!service_request.length) {
      return null;
    }

    const [customer] = await db.query(
      "SELECT * FROM pelanggan WHERE id_pelanggan = ?",
      [service_request[0].id_pelanggan],
    );

    if (!customer.length) {
      return null;
    }

    await transporter.sendMail({
      from: `"CellTrack" <${process.env.EMAIL_USER}>`,
      to: customer[0].email,
      subject: "Service Request Selesai - Silakan Lakukan Pembayaran",
      html: `
        <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
          <div style="max-width:600px; margin:0 auto; padding:30px 16px;">
            <div style="background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
              
              <div style="background:linear-gradient(135deg, #16a34a, #22c55e); padding:28px 24px; text-align:center; color:white;">
                <h1 style="margin:0; font-size:26px;">Service Selesai 🎉</h1>
                <p style="margin:8px 0 0; font-size:15px;">Perangkat Anda sudah siap diambil</p>
              </div>

              <div style="padding:28px 24px; color:#333;">
                <p style="font-size:16px; margin-top:0;">
                  Halo <strong>${customer[0].nama_pelanggan}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.7;">
                  Kabar baik! Service request Anda di <strong>CellTrack</strong> telah 
                  <strong style="color:#16a34a;">selesai diproses</strong>.
                  Perangkat Anda sudah siap untuk diambil di toko.
                </p>

                <div style="background-color:#ecfdf5; border-left:5px solid #22c55e; padding:16px; border-radius:10px; margin:22px 0;">
                  <p style="margin:0; font-size:15px; line-height:1.6;">
                    Silakan melakukan pembayaran terlebih dahulu sesuai tagihan yang ada di Dashboard Pelanggan.
                    Setelah pembayaran selesai, Anda dapat langsung datang ke toko untuk mengambil perangkat.
                  </p>
                </div>

                <div style="text-align:center; margin:30px 0;">
                  <a
                    href="http://localhost:5173/signInCustomer"
                    style="
                      background: linear-gradient(135deg, #16a34a, #22c55e);
                      color: #ffffff;
                      text-decoration: none;
                      padding: 14px 28px;
                      border-radius: 8px;
                      font-size: 15px;
                      font-weight: bold;
                      display: inline-block;
                    "
                  >
                    Lihat Tagihan & Login Dashboard
                  </a>
                </div>

                <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">

                <p style="font-size:14px; color:#555; line-height:1.6;">
                  Terima kasih telah mempercayakan perbaikan perangkat Anda kepada <strong>CellTrack</strong>.
                </p>

                <p style="font-size:14px; margin-bottom:0;">
                  Salam,<br>
                  <strong>Tim CellTrack</strong>
                </p>
              </div>
            </div>

            <p style="text-align:center; color:#9ca3af; font-size:12px; margin-top:18px;">
              Email ini dikirim otomatis oleh sistem CellTrack. Mohon tidak membalas email ini.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error Push To Email:", error);
    throw error;
  }
}
