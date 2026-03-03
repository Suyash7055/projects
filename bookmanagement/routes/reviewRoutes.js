
const express = require("express");
const router = express.Router();
const reviewController = require("./controllers/reviewController");

router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);

module.exports = router;