import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  id_produk: Number,
  message: String,
  stok: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: Boolean,
});

export default mongoose.model("Notification", notificationSchema);
