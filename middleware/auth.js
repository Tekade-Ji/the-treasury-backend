import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    // 🔹 Strip 'Bearer ' if present
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // 🔹 Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach decoded payload to req.user
    next();

  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};