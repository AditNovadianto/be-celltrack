import * as customerModel from "../models/customerModel.js";

export const createCustomer = async (req, res) => {
  const { nama_pelanggan, email, dob, no_telephon } = req.body;

  try {
    const result = await customerModel.createCustomer(
      nama_pelanggan,
      email,
      dob,
      no_telephon
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.getAllCustomers();

    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
