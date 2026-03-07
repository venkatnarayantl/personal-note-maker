import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion)
      return res.status(401).json({ message: "Session expired, please login again" });
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};