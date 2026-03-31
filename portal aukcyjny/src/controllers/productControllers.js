const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductsBySeller, getOrdersForSeller, getProductById, getReviewsForProduct} = require("../models/storage");

async function getAddProduct(req, res) {
  res.render("add-product");
}

async function postAddProduct(req, res) {
  const { name, description, price } = req.body;
  await createProduct(name, description, price, req.session.userId);
  res.redirect("/");
}

async function viewProducts(req, res) {
  const products = await getAllProducts();
  res.render("products", { products, role: req.session.role });
}

async function productDetails(req, res) {
  const { productId } = req.params;
  const product = await getProductById(productId);
  const reviews = await getReviewsForProduct(productId);

  const likes = reviews.filter(r => r.rating === "like").length;
  const dislikes = reviews.filter(r => r.rating === "dislike").length;

  res.render("productDetails", {
    product,
    reviews,
    likes,
    dislikes,
    role: req.session.role
  });
}
async function editProduct(req, res) {
    const { productId } = req.params;
    const { name, description, price } = req.body;
    await updateProduct(productId, { name, description, price });
    res.redirect("/myProducts");
}

async function getEditProduct(req, res) {
  const { productId } = req.params;
  const product = await getProductById(productId);
  res.render("editProduct", { product });
}

async function deleteProductController(req, res) {
    const { productId } = req.params;
    await deleteProduct(productId);
    res.redirect("/myProducts");
}

async function listSellerProducts(req, res) {
    const products = await getProductsBySeller(req.session.userId);
    res.render("myProducts", { products });
}

async function viewOrders(req, res) {
    const orders = await getOrdersForSeller(req.session.userId);
    res.render("sellerOrders", { orders });
}

module.exports = { getAddProduct, postAddProduct, viewProducts, productDetails, editProduct, getEditProduct,
  deleteProductController, listSellerProducts, viewOrders };