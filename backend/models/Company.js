import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  logo: String,
  location: String,
  city: String,
  foundedOn: Date,
  description: String
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
