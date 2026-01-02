import Notification from "../models/notificationModel.js";

// Read
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update
export const markNotificationAsRead = async (req, res) => {
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
    if (!["USER", "SUPPLIER"].includes(role)) {
      return res.status(400).json({
        error: "role harus USER atau SUPPLIER",
      });
    }

    const notification = await Notification.findOneAndUpdate(
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

    if (!notification) {
      return res.status(404).json({
        error: "Notification tidak ditemukan atau sudah dibaca",
      });
    }

    res.status(200).json({ notification });
  } catch (error) {
    console.error("Error mark notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
