const express = require("express");
const router = express.Router();
const {
  uploadMultipleImages,
  createProduct,
  getProducts,
  createUserProduct,
  getUserProducts,
  updateProductTrackStatus,
} = require("../services/product.services");
const { catchAsync } = require("../../helper/route.helper");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../public/uploads/tags");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, timestamp + "-" + file.originalname);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
});

// Upload multiple images endpoint
router.post(
  "/upload-multiple",
  upload.array("images", 10),
  catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No images uploaded",
      });
    }

    const uploadedImages = await uploadMultipleImages(req.files);

    res.status(200).json({
      status: true,
      message: "Images uploaded successfully",
      data: uploadedImages,
    });
  })
);
router.post(
  "",
  catchAsync(async (req, res) => {
    let body = req.body;
    let userId = req.userId;
    let product = await createProduct(body, userId);
    res.status(200).json({
      status: "success",
      data: product,
    });
  })
);
router.get(
  "",
  catchAsync(async (req, res) => {
    let userId = req.userId;
    let products = await getProducts(userId);
    res.status(200).json({
      status: "success",
      data: products,
    });
  })
);
router.post(
  "/user-products",
  catchAsync(async (req, res) => {
    let body = req.body;
    let userId = req.userId;
    let product = await createUserProduct(body, userId);
    res.status(200).json({
      status: "success",
      data: product,
    });
  })
);
router.get(
  "/user-products",
  catchAsync(async (req, res) => {
    let userId = req.userId;
    let products = await getUserProducts(userId);
    res.status(200).json({
      status: "success",
      data: products,
    });
  })
);
router.patch(
  "/user-products/:productId/track/:trackIndex",
  catchAsync(async (req, res) => {
    const { productId, trackIndex } = req.params;
    const userId = req.userId; // From auth middleware

    const result = await updateProductTrackStatus(
      productId,
      parseInt(trackIndex),
      userId
    );

    if (result.status) {
      res.status(200).json({
        status: "success",
        message: result.message,
        data: result.updatedTrack,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
  })
);

module.exports = router;
