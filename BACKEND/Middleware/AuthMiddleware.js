import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || "fallback_secret").trim();

// Middleware to verify if the request has a valid JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id, email, role) to request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};

// Middleware to enforce Role-Based Access Control (RBAC)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: "Forbidden: No role found in token" });
    }
    
    const userRole = req.user.role.toUpperCase();
    const isAllowed = allowedRoles.some(role => role.toUpperCase() === userRole);

    if (!isAllowed) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted to roles: [${allowedRoles.join(", ")}]` 
      });
    }
    next();
  };
};
