import jwt from "jsonwebtoken";

const optionalProtect = (role) => (req, res, next) => {
  try {
    // Get the token from the cookie
    const token = req.cookies[role];

    if (token) {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ensure the role matches
      if (decoded.role === role) {
        // Add user information to the request object
        req.user = {
          userId: decoded.userId,
          role: decoded.role,
        };
      }
    }
  } catch (error) {
    // Ignore errors and proceed without authentication
    req.user = null;
  }

  next();
};

export default optionalProtect;
