const { getAllProducts, createOrder, getProductById } = require("../models/storage");

function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

async function viewProducts(req, res) {
  const products = await getAllProducts();
  res.render("products", { products });
}

async function viewCart(req, res) {
  const cart = getCart(req);

  const detailedCart = [];

  for (const item of cart) {
    const product = await getProductById(item._id);
    if (product) {
      detailedCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity
      });
    }
  }

  const grandTotal = detailedCart.reduce((sum, item) => sum + item.total, 0);

  res.render("cart", { cart: detailedCart, grandTotal, role: req.session.role });
}

function addToCart(req, res) {
  const { productId } = req.params;
  const cart = getCart(req);

  const existing = cart.find((p) => p._id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ _id: productId, quantity: 1 });
  }

  res.redirect("/cart");
}

function removeFromCart(req, res) {
  const { productId } = req.params;
  let cart = getCart(req);
  cart = cart.filter((p) => p._id !== productId);
  req.session.cart = cart;
  res.redirect("/cart");
}

async function checkout(req, res) {
  const cart = getCart(req);
  if (!cart.length) return res.redirect("/cart");

  await createOrder(req.session.userId, cart);

  req.session.cart = [];

  res.render("checkout", { message: "Zamówienie złożone pomyślnie!" });
}

// module.exports = { getProductById, viewProducts, viewCart, addToCart, removeFromCart, checkout };
module.exports = { viewProducts, viewCart, addToCart, removeFromCart, checkout };