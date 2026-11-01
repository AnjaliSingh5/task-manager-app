const jwt = require("jsonwebtoken");

// Protects routes by requiring a valid JWT in the Authorization header:
// Authorization: Bearer <token>
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // attach user id for downstream routes
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
