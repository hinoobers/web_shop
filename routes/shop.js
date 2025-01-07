const express = require("express");
const db = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    db.execute("SELECT * FROM products")
    .then(result => {
        console.log(result[0]);
        res.render("shop.ejs", {
            products: result[0]
        })
    }).catch(err => {
        console.log(err)
    })
});

router.get("/products", (req, res) => {
    db.execute("SELECT * FROM products")
    .then(result => {
        res.render("products.ejs", {
            products: result[0]
        })
    }).catch(err => {
        console.log(err)
    })
});

router.get("/cart", (req, res) => {
    db.execute("SELECT * FROM products")
    .then(result => {
        res.render("cart.ejs", {
            products: result[0]
        })
    }).catch(err => {
        console.log(err)
    })
});

module.exports = router;