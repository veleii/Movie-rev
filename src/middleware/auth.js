import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Ingen token angiven" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lägg till användardata i req-objektet
    req.user = {
      userId: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Ogiltig eller utgången token" });
  }
};

export default auth;
