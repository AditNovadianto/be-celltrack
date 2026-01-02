import * as serviceRequestModel from "../models/serviceRequestModel.js";

// Create
export const createServiceRequest = async (req, res) => {
  const {
    nama_pelanggan,
    keterangan,
    tanggal_mulai,
    tanggal_selesai,
    status,
    harga,
    id_pelanggan,
  } = req.body;

  try {
    const result = await serviceRequestModel.createServiceRequest(
      nama_pelanggan,
      keterangan,
      tanggal_mulai,
      tanggal_selesai,
      status,
      harga,
      id_pelanggan
    );

    return res.status(201).json({
      message: "Service Request Created successfully",
      product: result,
    });
  } catch (error) {
    console.error("createServiceRequest error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Read
export const getAllServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await serviceRequestModel.getALlServiceRequests();

    return res.status(200).json(serviceRequests);
  } catch (error) {
    console.error("getAllServiceRequest error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
