const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Asignar el usuario a req.user
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
exports.adminOnly = (req, res, next) => {
  console.log("Usuario en adminOnly middleware:", req.user); // Verifica el valor de req.user
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
