import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  createCompany,
  getCompanies,
  getCompanyById
} from "../controllers/companyController.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("logo"), createCompany);
router.get("/", getCompanies);
router.get("/:id", getCompanyById);

export default router;
