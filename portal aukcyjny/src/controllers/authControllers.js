const { createUser, findUserByUsername, verifyPassword } = require("../models/storage");

function showRegister(req, res){
    res.render("register");
}

async function register(req, res){
    const { username, password, role } = req.body;
    try {
        await createUser(username, password, role);
        res.redirect("/login");
    } catch(err){
        res.render("register", { error: err.message });
    }
}

function showLogin(req, res){
    res.render('login');
}

async function login (req, res) {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user) return res.send("Nieprawidłowe dane");

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.send("Nieprawidłowe dane");

    req.session.userId = user._id;
    req.session.role = user.role;

    res.redirect("/");
};

function logout(req, res){
    req.session.destroy(()=>{
        res.clearCookie('connect.sid');
        res.redirect('/')
    });
}

function checkSeller(req, res, next) {
  if (!req.session.userId || req.session.role !== "sprzedawca") {
    return res.send("Brak dostępu - tylko sprzedawca");
  }
  next();
}

function checkClient(req, res, next) {
  if (!req.session.userId || req.session.role !== "klient") {
    return res.send("Brak dostępu - tylko klient");
  }
  next();
}

module.exports = {showRegister, register, showLogin, login, logout, checkSeller, checkClient};