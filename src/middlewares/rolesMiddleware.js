const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");

module.exports = (rolesArr) => {
  return async function (req, res, next) {
    try {
      const { authorization = "" } = req.headers;
      const [Bearer, token] = authorization.split(" ");

      if (!token || Bearer !== "Bearer") {
        res.status(401);
        throw new Error("Not authorized");
      }

      const { data: ID } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await usersModel.findById(ID);

      const userRoles = user.roles;

      let hasRole = false;

      userRoles.forEach((role) => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.status(403).json({ code: 403, message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(403).json({ code: 403, message: "Forbidden" });
    }
  };
};
