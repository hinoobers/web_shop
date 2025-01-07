const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const {makeid} = require("./util/utils");

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
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use(shopRoutes);

app.post("/addproduct", (req, res) => {
    const {
        title,
        price,
        description,
        imageUrl
    } = req.body;
    if(!title || !price || !description || !imageUrl) {
        return res.status(400).json({error: "Missing data!"});
    }

    db.execute("INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)", [title, price, description, imageUrl])
    .then(result => {
        res.render("products");
    }).catch(err => {

    });
})

app.post("/editproduct", (req, res) => {
    const {
        id,
        title,
        price,
        description,
        imageUrl
    } = req.body;
    if(!title || !price || !description) {
        return res.status(400).json({error: "Missing data!"});
    }

    let query = "UPDATE products SET title = ?, price = ?, description = ? WHERE id = ?";
    const parameters = [title, price, description];
    if(imageUrl && imageUrl !== "") {
        query = "UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?";
        parameters.push(imageUrl);
    }
    parameters.push(id);

    db.execute(query, parameters)
    .then(result => {
        res.json({success: true});
    }).catch(err => {
        console.log(err)
    })
})

app.post("/deleteproduct", (req, res) => {
    const id = req.body.id;
    db.execute("DELETE FROM products WHERE id = ?", [id])
    .then(result => {
        res.json({success: true});
    }).catch(err => {
        console.log(err)
    })
})

app.get("/fetchproduct/:id", (req, res) => {

    const id = req.params.id;
    db.execute("SELECT * FROM products WHERE id = ?", [id])
    .then(result => {
        res.json(result[0][0]);
    }).catch(err => {
        console.log(err)
    })
})

app.post("/signup", (req, res) => {
    const {
        email,
        password
    } = req.body;

    if(!email || !password) {
        return res.status(400).json({error: "Missing data!"});
    }

    if(password !== req.body["password-2"]) {
        res.render("auth/signup.ejs", {error: "Passwords do not match!"});
    }
    
    db.execute("SELECT * FROM accounts WHERE email = ?", [email])
    .then(result => {
        if(result[0].length > 0) {
            return res.render("auth/signup.ejs", {error: "Email already in use!"});
        }

        db.execute("INSERT INTO accounts (email, password) VALUES (?, ?)", [email, password])
        .then(result => {
            res.redirect("/auth/login");
        }).catch(err => {
            return res.render("auth/signup.ejs", {error: "Internal error!"});
        })
    }).catch(err => {
        console.log(err)
    })
});

app.post("/login", (req, res) => {
    const {
        email,
        password
    } = req.body;

    if(!email || !password) {
        return res.status(400).json({error: "Missing data!"});
    }

    db.execute("SELECT * FROM accounts WHERE email = ? AND password = ?", [email, password])
    .then(result => {
        if(result[0].length === 0) {
            return res.render("auth/login.ejs", {error: "User not found!"});
        }
        
        // flip secret

        const token = makeid(20);
        db.execute("UPDATE accounts SET secret = ? WHERE email = ?", [token, email])
        .then(result => {
            res.cookie("token", token);
            res.redirect("/")
        }).catch(err => {
            return res.render("auth/login.ejs", {error: "Internal error!"});
        })
    }).catch(err => {
        console.log(err)
    })
})

app.use((req, res, next) => {
    res.render("404.ejs");
})

app.listen(3002);