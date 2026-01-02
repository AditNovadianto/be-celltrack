import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  id_produk: Number,
  message: String,
  stok: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  id_supplier: Number,
  readBy: [
    {
      role: String,
      id: Number,
      readAt: Date,
    },
  ],
});

export default mongoose.model("Notification", notificationSchema);
