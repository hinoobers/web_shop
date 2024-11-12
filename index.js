const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.set("view engine", "ejs")
app.set("views", "views")

const db = require("./database");

db.execute("SHOW DATABASES")
    .then(result => {
        console.log(result)
    }).catch(err => {
        console.log(err)
    })

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    return res.status(404).send("<h1>Page not found</h1>")
})

app.get("/", (req, res) => {
    res.json({message: "web shop app"});
});

app.listen(3002);