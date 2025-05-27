const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Du saknar rätt behörighet" });
    }
    next();
  };
};

export default checkRole;
