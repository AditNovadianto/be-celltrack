import mongoose from "mongoose";

const serviceRequestStatusSchema = new mongoose.Schema({
  id_service_request: Number,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readBy: [
    {
      role: String,
      id: Number,
      readAt: Date,
    },
  ],
});

export default mongoose.model(
  "ServiceRequestStatus",
  serviceRequestStatusSchema
);
