const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");

module.exports = async (req, res, next) => {
  try {
    // читаємо заголовки Authorization
    const { authorization = "" } = req.headers;

    // перевіряємо чи переданий токен і що він є токеном авторизації
    // якщо нема токена, або не токен авторизації - помилка авторизації 401
    const [Bearer, token] = authorization.split(" ");

    if (!token || Bearer !== "Bearer") {
      res.status(401);
      throw new Error("Not authorized");
    }

    //  розшифровуємо токен
    const { data: ID } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await usersModel.findById(ID).select("-password -name -token");

    // передажмо інфо з токеном далі
    req.user = user;
    next();
  } catch (error) {
    res.status = 401;
    throw new Error(error);
  }
};
