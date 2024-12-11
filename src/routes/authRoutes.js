const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: `Acceso exitoso como administrador, bienvenido ${req.user.username}`,
  });
});

module.exports = router;
