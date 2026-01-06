import ServiceRequestStatus from "../models/serviceRequestStatusModel.js";

// Read
export const getAllServiceRequestStatus = async (req, res) => {
  try {
    const serviceRequestStatus = await ServiceRequestStatus.find();
    res.status(200).json({ serviceRequestStatus });
  } catch (error) {
    console.error("Error fetching serviceRequestStatus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update
export const markServiceRequestStatusAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    // basic validation
    if (!userId || !role) {
      return res.status(400).json({
        error: "userId dan role wajib diisi",
      });
    }

    // optional: validasi role
    if (!["TECHNICIAN"].includes(role)) {
      return res.status(400).json({
        error: "role harus TECHNICIAN",
      });
    }

    const serviceRequestStatus = await ServiceRequestStatus.findOneAndUpdate(
      {
        _id: id,
        // cegah duplikat: user + role yang sama
        readBy: {
          $not: {
            $elemMatch: { role, id: userId },
          },
        },
      },
      {
        $push: {
          readBy: {
            role,
            id: userId,
            readAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!serviceRequestStatus) {
      return res.status(404).json({
        error: "Service Request Status tidak ditemukan atau sudah dibaca",
      });
    }

    res.status(200).json({ serviceRequestStatus });
  } catch (error) {
    console.error("Error mark service request status as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
