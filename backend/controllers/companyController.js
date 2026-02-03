import mongoose from "mongoose";
import Company from "../models/Company.js";

export const createCompany = async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.logo = `/uploads/${req.file.filename}`;
  }
  const company = await Company.create(payload);
  res.json({ success: true, data: company });
};

export const getCompanies = async (req, res) => {
  const companies = await Company.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "companyId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        reviewCount: { $size: "$reviews" },
        averageRating: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0,
          ],
        },
      },
    },
    {
      $project: {
        reviews: 0,
      },
    },
  ]);

  res.json({ success: true, data: companies });
};

export const getCompanyById = async (req, res) => {
  const company = await Company.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "companyId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        reviewCount: { $size: "$reviews" },
        averageRating: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0,
          ],
        },
      },
    },
    {
      $project: {
        reviews: 0,
      },
    },
  ]);

  res.json({ success: true, data: company[0] || null });
};
