import * as supplierModel from "../models/supplierModel.js";

export const signUpSupplier = async (req, res) => {
  const {
    nama_supplier,
    email,
    alamat_supplier,
    no_telephon,
    kategori_supplier,
    password,
  } = req.body;

  try {
    const { supplier, token } = await supplierModel.signUpSupplier({
      nama_supplier,
      email,
      alamat_supplier,
      no_telephon,
      kategori_supplier,
      password,
    });

    return res.status(201).json({ supplier, token });
  } catch (error) {
    console.error("signUpSupplier error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signInSupplier = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await supplierModel.signInSupplier(email, password);

    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { supplier, token } = result;

    return res.status(200).json({ supplier, token });
  } catch (error) {
    console.error("signInSupplier error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
