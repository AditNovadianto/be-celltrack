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

// Update
export const takeServiceRequest = async (req, res) => {
  try {
    const { id_service_request, id_teknisi } = req.body;

    const affectedRows = await serviceRequestModel.takeServiceRequest(
      id_service_request,
      id_teknisi
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Service Request not found" });
    }

    return res
      .status(200)
      .json({ message: "Service Request updated successfully" });
  } catch (error) {
    console.error("takeServiceRequest error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStatusServiceRequest = async (req, res) => {
  try {
    const { id_service_request, status } = req.body;

    const affectedRows = await serviceRequestModel.updateStatusServiceRequest(
      id_service_request,
      status
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Service Request not found" });
    }

    return res
      .status(200)
      .json({ message: "Update Status Service Request updated successfully" });
  } catch (error) {
    console.error("updateStatusServiceRequest error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
