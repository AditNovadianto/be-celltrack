import * as customerModel from "../models/customerModel.js";

export const signInCustomer = async (req, res) => {
  const { kode_service, email } = req.body;

  try {
    const result = await customerModel.signInCustomer(kode_service, email);

    if (!result) {
      return res.status(401).json({ error: "Invalid kode_service or email" });
    }

    const { customer, serviceRequest, token } = result;

    return res.status(200).json({ customer, serviceRequest, token });
  } catch (error) {
    console.error("signInCustomer error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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

export const updateCustomerById = async (req, res) => {
  try {
    const { id_pelanggan } = req.params;
    const { nama_pelanggan, email, dob, no_telephon } = req.body;

    const updateRes = await customerModel.updateCustomerById(
      id_pelanggan,
      nama_pelanggan,
      email,
      dob,
      no_telephon
    );

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCustomerById = async (req, res) => {
  try {
    const { id_pelanggan } = req.params;

    const deleteRes = await customerModel.deleteCustomerById(id_pelanggan);

    res.status(200).json({ message: "Customer delete successfully" });
  } catch (error) {
    console.error("Error deleting customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
