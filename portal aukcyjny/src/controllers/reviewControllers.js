const { addReview, getReviewsForProduct } = require("../models/storage");

async function postReview(req, res) {
    const { review, rating } = req.body;
    const { productId } = req.params;
    if (req.session.role !== "klient") return res.send("Brak dostępu");
    await addReview(req.session.userId, productId, review, rating);
    res.redirect(`/products/${productId}`);
}

async function viewReviews(req, res) {
    const { productId } = req.params;
    const reviews = await getReviewsForProduct(productId);
    res.render("reviews", { reviews });
}

module.exports = { postReview, viewReviews };