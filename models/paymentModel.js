import core from "../config/midtrans.js";
import { db } from "../config/db.js";
import { decryptId } from "../utils/crypto.js";

export function getKodeServiceFromOrderId(orderId) {
  if (!orderId) return null;

  const parts = orderId.split("-");

  // format: SR-{kode_service}-{timestamp}
  if (parts.length < 3) return null;

  return parts[1];
}

export async function createVirtualAccount(kode_service, amount, bank) {
  try {
    const orderId = `SR-${kode_service}-${Date.now()}`;

    const parameter = {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      bank_transfer: {
        bank: bank.toLowerCase(),
      },
    };

    const transaction = await core.charge(parameter);

    const vaData = transaction.va_numbers?.[0];

    if (!vaData) {
      throw new Error("VA number not generated");
    }

    return {
      order_id: orderId,
      bank: vaData.bank,
      va_number: vaData.va_number,
      amount,
      expiry_time: transaction.expiry_time,
    };
  } catch (error) {
    console.error("Error Create Virtual Account:", error);
    throw error;
  }
}

export async function updatePaymentStatus({
  order_id,
  transaction_status,
  payment_type,
  gross_amount,
  bank,
}) {
  const kode_service = getKodeServiceFromOrderId(order_id);

  const id_service_request = decryptId(kode_service);

  console.log("ORDER ID:", order_id);
  console.log("SERVICE ID:", id_service_request);

  const [result] = await db.query(
    "UPDATE service_request SET status_pembayaran = ? WHERE id_service_request = ?",
    [transaction_status, id_service_request]
  );

  // Ganti dengan query database kamu
  console.log("UPDATE PAYMENT:", {
    order_id,
    transaction_status,
    payment_type,
    gross_amount,
    bank,
  });

  return result.affectedRows;
}
