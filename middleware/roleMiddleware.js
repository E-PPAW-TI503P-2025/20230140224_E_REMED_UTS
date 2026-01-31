// middleware/roleMiddleware.js
function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    next();
  };
}

module.exports = { checkRole };
