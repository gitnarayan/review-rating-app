import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  fullName: String,
  subject: String,
  reviewText: String,
  rating: Number
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
