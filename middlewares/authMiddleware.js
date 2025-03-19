const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found or unauthorized" });
    }
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }

    res.status(401).json({ message: "Invalid token, please log in again" });
  }
};

module.exports = authMiddleware;
