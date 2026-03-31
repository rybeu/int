const {ObjectId} = require('mongodb');
const {getDB} = require('../data/connection');
const { scryptSync, randomBytes } = require("crypto");

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hashed = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`; // zapisuje salt i hashed w jednym polu
}

async function verifyPassword(password, stored) {
    const [salt, key] = stored.split(':');
    const hashedBuffer = scryptSync(password, salt, 64).toString('hex');
    return key === hashedBuffer;
}

async function createUser(username, password, role = "klient") {
  if (!["klient", "sprzedawca"].includes(role)) {
    throw new Error("Nieprawidłowa rola użytkownika");
  }

  const hashedPassword = await hashPassword(password);

  const existing = await findUserByUsername(username);
  if (existing) throw new Error("Użytkownik już istnieje");

  return await getDB().collection("users").insertOne({
    username,
    password: hashedPassword,
    role
  });
}

async function findUserByUsername(username) {
  return await getDB().collection("users").findOne({ username });
}

async function findUserById(id) {
  return await getDB().collection("users").findOne({ _id: new ObjectId(id) });
}

async function getUserRole(id) {
  const user = await findUserById(id);
  return user ? user.role : null;
}

async function createProduct(name, description, price, sellerId) {
  return await getDB().collection("products").insertOne({ name, description, price, sellerId });
}

async function getAllProducts() {
  return await getDB().collection("products").find().toArray();
}

async function createOrder(userId, products) {
  return getDB().collection("orders").insertOne({
    userId,
    products,
    createdAt: new Date(),
  });
}

async function addReview(userId, productId, review, rating) {
    return getDB().collection("reviews").insertOne({
        userId,
        productId,
        review,
        rating,
        createdAt: new Date()
    });
}

async function getProductById(id) {
  return await getDB()
    .collection("products")
    .findOne({ _id: new ObjectId(id) });
}

async function getReviewsForProduct(productId) {
    return getDB().collection("reviews").find({ productId }).toArray();
}

async function getProductsBySeller(sellerId) {
    return getDB().collection("products").find({ sellerId }).toArray();
}

async function updateProduct(productId, data) {
    return getDB().collection("products").updateOne(
        { _id: new ObjectId(productId) },
        { $set: data }
    );
}

async function deleteProduct(productId) {
    return getDB().collection("products").deleteOne({ _id: new ObjectId(productId) });
}

async function getOrdersForSeller(sellerId) {
    const orders = await getDB().collection("orders").find().toArray();
    const sellerProducts = await getDB()
        .collection("products")
        .find({ sellerId })
        .toArray();

    const sellerProductIds = sellerProducts.map(p => p._id.toString());

    return orders.filter(order =>
        order.products.some(p =>
            sellerProductIds.includes(p._id.toString())
        )
    );
}

module.exports = {verifyPassword, createUser, findUserByUsername, findUserById, getUserRole, 
  createProduct, getAllProducts, createOrder, addReview, getProductById, getReviewsForProduct, 
  getProductsBySeller, updateProduct, deleteProduct, getOrdersForSeller};