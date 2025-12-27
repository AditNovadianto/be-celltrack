import * as transactionModel from "../models/transactionModel.js";

// Create
export const createTransaction = async (req, res) => {
  const {
    item,
    tanggal_transaksi,
    quantity,
    subtotal,
    total,
    jenis_transaksi,
    id_pelanggan,
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

// Read
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.getAllTransactions();

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransactionById = async (req, res) => {
  const { id_transaksi } = req.params;

  try {
    const transaction = await transactionModel.getTransactionById(id_transaksi);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
