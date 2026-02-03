import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByCompany = async (req, res) => {
  try {
    const reviews = await Review.find({
      companyId: req.params.companyId
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
