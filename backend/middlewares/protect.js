import jwt from "jsonwebtoken";

const protect = (role) => (req, res, next) => {
  try {
    // Get the token from the cookie
    const token = req.cookies[role];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the role matches
    if (decoded.role !== role) {
      return res.status(403).json({ message: "Not authorized, invalid role" });
    }

    // Add user information to the request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
