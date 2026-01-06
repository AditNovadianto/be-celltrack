import * as technicianModel from "../models/technicianModel.js";

export const signUpTechnician = async (req, res) => {
  const { nama_teknisi, email_teknisi, password } = req.body;

  try {
    const { teknisi, token } = await technicianModel.signUpTechnician({
      nama_teknisi,
      email_teknisi,
      password,
    });

    return res.status(201).json({ teknisi, token });
  } catch (error) {
    console.error("signUpTeknisi error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signInTechnician = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await technicianModel.signInTechnician(email, password);

    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { teknisi, token } = result;

    return res.status(200).json({ teknisi, token });
  } catch (error) {
    console.error("signInTechnician error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTechnicians = async (req, res) => {
  try {
    const technicians = await technicianModel.getAllTechnicians();

    return res.status(200).json({ technicians });
  } catch (error) {
    console.error("getAllTechnicians error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
