// controllers/mediaController.js
exports.registerCCTV = (req, res) => {
  const { location, ip } = req.body;
  console.log("📍 Registering CCTV:", location, ip);
  res.status(201).json({ message: "CCTV registered", data: { location, ip } });
};

exports.getAllCCTVs = (req, res) => {
  res.json([
    { id: 1, location: "Main Gate", ip: "192.168.1.10" },
    { id: 2, location: "Parking Lot", ip: "192.168.1.11" }
  ]);
};
