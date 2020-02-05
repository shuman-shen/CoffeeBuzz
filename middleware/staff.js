module.exports = function(req, res, next) {
  if (req.user.role === "customer")
    return res.status(403).send("Access denied."); // 403: forbidden
  // both staff and admin can access
  next();
};
