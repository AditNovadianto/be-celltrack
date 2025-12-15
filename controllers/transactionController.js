import * as transactionModel from "../models/transactionModel.js";

export const createTransaction = async (req, res) => {
  const {
    item,
    tanggal_transaksi,
    quantity,
    subtotal,
    total,
    jenis_transaksi,
    id_pelanggan,
    id_produk,
  } = req.body;

  try {
    const result = await transactionModel.createTransaction(
      item,
      tanggal_transaksi,
      quantity,
      subtotal,
      total,
      jenis_transaksi,
      id_pelanggan
    );

    res.status(201).json({
      message: "Transaction created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};
