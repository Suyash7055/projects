
const mongoose = require("mongoose");
const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");

exports.createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { review, rating, reviewedBy } = req.body;

    // Validate bookId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: false, message: "Invalid bookId" });
    }

    // Check book existence
    const book = await Book.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }

    // Create review
    const newReview = await Review.create({
      bookId,
      review,
      rating,
      reviewedBy: reviewedBy || "Guest"
    });

    // Increment review count
    book.reviews += 1;
    await book.save();

    // Fetch updated reviews
    const reviews = await Review.find({ bookId, isDeleted: false });

    return res.status(201).json({
      status: true,
      message: "Review added successfully",
      data: {
        ...book.toObject(),
        reviewsData: reviews
      }
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};




exports.updateReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const { review, rating, reviewedBy } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ status: false, message: "Invalid ID" });
    }

    // Check book
    const book = await Book.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }

    // Check review
    const reviewDoc = await Review.findOne({
      _id: reviewId,
      bookId,
      isDeleted: false
    });

    if (!reviewDoc) {
      return res.status(404).json({ status: false, message: "Review not found" });
    }

    // Update review
    reviewDoc.review = review ?? reviewDoc.review;
    reviewDoc.rating = rating ?? reviewDoc.rating;
    reviewDoc.reviewedBy = reviewedBy ?? reviewDoc.reviewedBy;

    await reviewDoc.save();

    const reviews = await Review.find({ bookId, isDeleted: false });

    return res.status(200).json({
      status: true,
      message: "Review updated successfully",
      data: {
        ...book.toObject(),
        reviewsData: reviews
      }
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};






exports.deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId) ||
      !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ status: false, message: "Invalid ID" });
    }

    // Check book
    const book = await Book.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }

    // Check review
    const reviewDoc = await Review.findOne({
      _id: reviewId,
      bookId,
      isDeleted: false
    });

    if (!reviewDoc) {
      return res.status(404).json({ status: false, message: "Review not found" });
    }

    // Soft delete review
    reviewDoc.isDeleted = true;
    await reviewDoc.save();

    // Decrease review count
    book.reviews = Math.max(0, book.reviews - 1);
    await book.save();

    return res.status(200).json({
      status: true,
      message: "Review deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};