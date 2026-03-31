const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const routes = require("./routes/pagesRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: "super_tajne_haslo",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.role = req.session.role || null;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "pages"));

app.use("/", routes);

module.exports = app;