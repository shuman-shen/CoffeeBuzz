module.exports = function(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).send("Access denied."); // 403: forbidden

  next();
};
