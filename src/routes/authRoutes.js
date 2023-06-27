const express = require("express");
const authRouter = express.Router();
const auth = require("../middlewares/auth");
const asyncHandler = require("express-async-handler");
const AuthController = require("../controllers/AuthController");

// Реєстрація - збереження користувача в базі даних
authRouter.post("/register", asyncHandler(AuthController.register));

// Автентифікація - перевірка даних, що ввів користувач з тим що є в базі даних
authRouter.post("/login", asyncHandler(AuthController.login));

// Авторизація - перевірка прав доступу-middleware(auth)

// Логаут - вихід із системи
authRouter.get("/logout", auth, asyncHandler(AuthController.logout));

module.exports = authRouter;
