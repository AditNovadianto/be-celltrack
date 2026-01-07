import Feedback from "../models/feedbackModel.js";

export const createFeedback = async (req, res) => {
  try {
    const { id_pelanggan, name, email, message, rating } = req.body;

    // Validasi sederhana
    if (!id_pelanggan || !name || !email || !message) {
      return res.status(400).json({
        message: "id_pelanggan, name, email, dan message wajib diisi",
      });
    }

    const feedback = await Feedback.create({
      id_pelanggan,
      name,
      email,
      message,
      rating,
    });

    res.status(201).json({
      message: "Feedback berhasil disimpan",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menyimpan feedback",
      error: error.message,
    });
  }
};

export const getFeedbackByUserId = async (req, res) => {
  const { id_pelanggan } = req.params;

  try {
    const feedbacks = await Feedback.find({ id_pelanggan });

    res.status(200).json({
      message: "Feedbacks retrieved successfully",
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve feedbacks",
      error: error.message,
    });
  }
};
