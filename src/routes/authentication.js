var express = require("express");
var router = express.Router();
const {
  userRegister,
  userLogin,
  adminRegister,
  adminLogin,
  userDetails,
  securityLogin,
  securityRegister,
  labRegister,
  labLogin,
} = require("../services/authentication.service");

router.post("/register", async (req, res, next) => {
  try {
    let body = req.body;
    let response = await userRegister(body);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({
      message: "unautherized",
    });
  }
});
router.post("/login", async (req, res, next) => {
  let body = req.body;
  let response = await userLogin(body);
  res.json(response);
});
router.post("/admin/register", async (req, res, next) => {
  try {
    let body = req.body;
    console.log("body", body);
    let response = await adminRegister(body);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({
      message: "unautherized",
    });
  }
});
router.post("/admin/login", async (req, res, next) => {
  let body = req.body;
  console.log("body", body);
  let response = await adminLogin(body);
  res.json(response);
});
router.post("/security/register", async (req, res, next) => {
  try {
    let body = req.body;
    console.log("body", body);
    let response = await securityRegister(body);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({
      message: "unautherized",
    });
  }
});
router.post("/security/login", async (req, res, next) => {
  let body = req.body;
  console.log("body", body);
  let response = await securityLogin(body);
  res.json(response);
});
router.post("/lab/register", async (req, res, next) => {
  try {
    let body = req.body;
    console.log("body", body);
    let response = await labRegister(body);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({
      message: "unautherized",
    });
  }
});
router.post("/lab/login", async (req, res, next) => {
  let body = req.body;
  console.log("body", body);
  let response = await labLogin(body);
  res.json(response);
});
router.get("/user-details", async (req, res, next) => {
  // Typically the token would come from the Authorization header
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;
  let response = await userDetails(token);
  res.json(response);
});
module.exports = router;

// Global Exception
