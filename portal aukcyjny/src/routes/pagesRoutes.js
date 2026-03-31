const express = require("express");
const router = express.Router();

const productController = require("../controllers/productControllers");
const authController = require("../controllers/authControllers");
const { checkSeller, checkClient } = require("../controllers/authControllers");
const cartController = require("../controllers/cartControllers");
const reviewController = require("../controllers/reviewControllers");

router.get("/", productController.viewProducts);
router.get("/products/:productId", productController.productDetails);

router.get("/register", authController.showRegister);
router.post("/register", authController.register);

router.get("/login", authController.showLogin);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/cart", checkClient, cartController.viewCart);
router.get("/cart/add/:productId", checkClient, cartController.addToCart);
router.get("/cart/remove/:productId", checkClient, cartController.removeFromCart);
router.post("/cart/checkout", checkClient, cartController.checkout);

router.post("/products/:productId/review", checkClient, reviewController.postReview);
router.get("/products/:productId/reviews", reviewController.viewReviews);

router.get("/add-product", checkSeller, productController.getAddProduct);
router.post("/add-product", checkSeller, productController.postAddProduct);

router.get("/myProducts", checkSeller, productController.listSellerProducts);

router.get("/products/:productId/edit", checkSeller, productController.getEditProduct);
router.post("/products/:productId/edit", checkSeller, productController.editProduct);

router.post("/products/:productId/delete", checkSeller, productController.deleteProductController);

router.get("/sellerOrders", checkSeller, productController.viewOrders);


module.exports = router;