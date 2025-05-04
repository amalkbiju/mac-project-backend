const { v4: uuidv4 } = require("uuid");
const MongoDB = require("./mongodb.service");
const { mongoConfig } = require("../../config");
const { BadRequestError } = require("../../errors/APIError");

/**
 * Upload multiple images and save their metadata to the database
 * @param {Array} files - Array of uploaded files from multer
 * @param {string} userId - ID of the uploading user
 * @returns {Array} Array of saved image objects
 */
async function uploadMultipleImages(files) {
  if (!files || files.length === 0) {
    throw new BadRequestError("Image files are required");
  }

  // Base URL for serving images (replace with your actual domain)
  const baseUrl = process.env.BASE_URL || "http://192.168.1.6:3000";

  const savedImages = [];

  for (const file of files) {
    const id = uuidv4();
    const key = `tags/${file.filename}`;
    const url = `${baseUrl}/uploads/${key}`;

    const imageObject = {
      id: id,
      url: url,
      key: key,
      createdAt: new Date(),
    };

    const savedImage = await MongoDB.db
      .collection(mongoConfig.collections.IMAGES)
      .insertOne(imageObject);

    if (savedImage?.acknowledged && savedImage?.insertedId) {
      savedImages.push({
        ...imageObject,
        _id: savedImage.insertedId,
      });
    }
  }

  return savedImages;
}
async function createProduct(data, userId) {
  // Create product object with only required base fields
  const productObject = {
    id: uuidv4(),
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Only add fields that are present in the request data
  if (data.productType) productObject.productType = data.productType;
  if (data.moisture) productObject.moisture = data.moisture;
  if (data.sands) productObject.sands = data.sands;
  if (data.calcium) productObject.calcium = data.calcium;
  if (data.kg) productObject.kg = data.kg;
  if (data.price) productObject.price = data.price;
  if (data.images) productObject.images = data.images;
  if (data.da) productObject.da = data.da;

  const savedProduct = await MongoDB.db
    .collection(mongoConfig.collections.PRODUCTS)
    .insertOne(productObject);

  if (savedProduct?.acknowledged && savedProduct?.insertedId) {
    return savedProduct;
  }
}
async function createUserProduct(data, userId) {
  // Create product object with only required base fields
  const productObject = {
    id: uuidv4(),
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Only add fields that are present in the request data
  if (data.productType) productObject.productType = data.productType;
  if (data.moisture) productObject.moisture = data.moisture;
  if (data.sands) productObject.sands = data.sands;
  if (data.calcium) productObject.calcium = data.calcium;
  if (data.kg) productObject.kg = data.kg;
  if (data.price) productObject.price = data.price;
  if (data.images) productObject.images = data.images;
  if (data.da) productObject.da = data.da;
  if (data.vechileNo) productObject.vechileNo = data.vechileNo;
  if (data.noOfVechile) productObject.noOfVechile = data.noOfVechile;
  if (data.totalWeight) productObject.totalWeight = data.totalWeight;
  if (data.track) productObject.track = data.track;
  if (data.username) productObject.username = data.username;
  if (data.email) productObject.email = data.email;

  const savedProduct = await MongoDB.db
    .collection(mongoConfig.collections.USER_PRODUCTS)
    .insertOne(productObject);

  if (savedProduct?.acknowledged && savedProduct?.insertedId) {
    return savedProduct;
  }
}
async function getProducts(userId) {
  // Check if userId is provided
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  // Query products with the specific createdBy value
  const products = await MongoDB.db
    .collection(mongoConfig.collections.PRODUCTS)
    .find({})
    .toArray();

  return products;
}
async function getUserProducts(userId) {
  // Check if userId is provided
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  // Query products with the specific createdBy value
  const products = await MongoDB.db
    .collection(mongoConfig.collections.USER_PRODUCTS)
    .find({})
    .toArray();

  return products;
}
async function updateProductTrackStatus(productId, trackIndex, userId) {
  try {
    // Validate inputs
    if (!productId || trackIndex === undefined || !userId) {
      throw new Error("Product ID, track index, and user ID are required");
    }

    // Get the product first
    const product = await MongoDB.db
      .collection(mongoConfig.collections.USER_PRODUCTS)
      .findOne({ id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    // Validate track index
    if (!product.track || trackIndex >= product.track.length) {
      throw new Error("Invalid track index");
    }

    // Create updated track array
    const updatedTrack = [...product.track];
    updatedTrack[trackIndex].stage = true;

    // Update the product in database
    const result = await MongoDB.db
      .collection(mongoConfig.collections.USER_PRODUCTS)
      .updateOne(
        { id: productId },
        { $set: { track: updatedTrack, updatedAt: new Date() } }
      );

    if (result.modifiedCount === 1) {
      return {
        status: true,
        message: "Track status updated successfully",
        updatedTrack,
      };
    } else {
      throw new Error("Failed to update track status");
    }
  } catch (error) {
    console.error("Error updating track status:", error);
    return {
      status: false,
      message: error.message || "Failed to update track status",
    };
  }
}
module.exports = {
  uploadMultipleImages,
  createProduct,
  getProducts,
  createUserProduct,
  getUserProducts,
  updateProductTrackStatus,
};
