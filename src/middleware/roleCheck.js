const checkRole = (requiredRole) => {
  return (req, res, next) => {
    console.log(" [checkRole] req.user =", req.user);
    if (!req.user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Du saknar rätt behörighet (i rolecheck)" });
    }
    next();
  };
};

export default checkRole;
