const express = require("express");

const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
    res.send("<h1>Admin page</h1>")
});

router.get("/addproduct", (req, res) => {
    res.render("admin/addproduct");
})

router.get("/products", (req, res) => {
    db.execute("SELECT * FROM products")
        .then(result => {
            res.render("admin/products", {
                products: result[0]
            })
        }).catch(err => {
            console.log(err)
        })
})

module.exports = router;