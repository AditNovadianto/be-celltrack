import * as PaymentModel from "../models/paymentModel.js";
import crypto from "crypto";

export const createVirtualAccount = async (req, res) => {
  const { kode_service, amount, bank } = req.body;

  try {
    const result = await PaymentModel.createVirtualAccount(
      kode_service,
      amount,
      bank
    );

    return res.status(201).json({
      message: "Virtual Account Created successfully",
      VA: result,
    });
  } catch (error) {
    console.error("createVirtualAccount error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export async function midtransCallback(req, res) {
  try {
    const notification = req.body;

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      va_numbers,
    } = notification;

    // 1️⃣ VALIDASI SIGNATURE
    const signature = crypto
      .createHash("sha512")
      .update(
        order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if (signature !== signature_key) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    // 2️⃣ AMBIL DATA BANK (jika VA)
    const bank = va_numbers?.[0]?.bank ?? null;

    // 3️⃣ HANDLE STATUS
    switch (transaction_status) {
      case "settlement":
        await PaymentModel.updatePaymentStatus({
          order_id,
          transaction_status: "PAID",
          payment_type,
          gross_amount,
          bank,
        });
        break;

      case "pending":
        await PaymentModel.updatePaymentStatus({
          order_id,
          transaction_status: "PENDING",
          payment_type,
          gross_amount,
          bank,
        });
        break;

      case "expire":
        await PaymentModel.updatePaymentStatus({
          order_id,
          transaction_status: "EXPIRED",
          payment_type,
          gross_amount,
          bank,
        });
        break;

      case "cancel":
      case "deny":
        await PaymentModel.updatePaymentStatus({
          order_id,
          transaction_status: "FAILED",
          payment_type,
          gross_amount,
          bank,
        });
        break;

      default:
        console.log("Unhandled status:", transaction_status);
    }

    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("MIDTRANS CALLBACK ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
