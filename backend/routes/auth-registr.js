const Users = require("../models/user");
const { check, validationResult } = require("express-validator/check");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config.json");
const nodemailer = require("nodemailer");

module.exports = (app) => {
  app.post("/registr",
    [
      check("email").isEmail(),
      check("name").isLength({ min: 5 }),
      check("password").isLength({ min: 6 }),
    ],
    async (req, res) => {
      try {
        const { email, name, password, password2, colorName } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) return
        if (password !== password2) return;
        const findUser = await Users.findOne({ email });
        if (findUser) return;

        const hashedPassword = await bcript.hash(password, 11);
        const hash = Math.random();
        const user = new Users({
          colorName,
          email,
          name,
          password: hashedPassword,
          confirm_hash: hash,
        });

        var transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "clonetelegramtest@gmail.com",
            pass: "f,hfrflf,hf1987",
          },
        });
        await transport.sendMail({
          from: "clonetelegramtest@gmail.com",
          to: email,
          subject: "Подтверждение аккаунта на Clone-telegram",
          text:
            "Перейдите по ссылке что бы подтвердить свой аккаунт " +
            `http://localhost:3000/success/${hash}`,
        });

        await user.save();
        res.json("Юзер создан");
      } catch (e) {
        res.json(e);
      }
    }
  );

  app.post("/find_validate_email", async (req, res) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      res.json({ message: "Такой емейл не существует" });
    }
    res.json({ message: "ок" });
  });

  app.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ message: "Неправильный логин или пароль" });
    }
    const validatePass = await bcript.compare(password, user.password);
    if (!validatePass) {
      return res.json({ message: "Неправильный логин или пароль" });
    }
    if (!user.confirmed) {
      return res.json({ message: "Аккаунт не подтверждён" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      config.jwtKey,
      { expiresIn: "10004h" }
    );

    res.json({
      token: `Bearer ${token}`,
      userId: user._id,
      userInit: user,
      message: "всё ок",
    });
  });

  app.put("/confirm/:hash", async (req, res) => {
    var hash = req.params.hash;
    var user = await Users.findOne({ confirm_hash: hash });
    if (!user) {
      return res.json("Ошибка");
    }

    user.confirmed = true;
    await user.save();
    res.json("Акаунт подтверждён");
  });
};
