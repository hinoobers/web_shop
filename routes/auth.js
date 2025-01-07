const express = require("express");
const db = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("auth/login.ejs");
});


router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})

module.exports = router;