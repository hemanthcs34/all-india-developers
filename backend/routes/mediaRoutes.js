// routes/mediaRoutes.js
const express = require("express");
const router = express.Router();
const { registerCCTV, getAllCCTVs } = require("../controllers/mediaController");

router.post("/register", registerCCTV);
router.get("/", getAllCCTVs);

module.exports = router;
