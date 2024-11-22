const Review = require('../models/reviewModel');
const mongoose = require("mongoose");

const getReview = async (req, res) => {
    const review = await Review.find({}).sort({ createdAt: -1});
    res.status(200).json(review);
};

const getRelevantReview = async (req, res) => {
    const { companyId } = req.params; 

    try {
        // Find reviews associated with the provided companyId
        const reviews = await Review.find({ companyId }).sort({ createdAt: -1 });

        // Check if there are reviews for the specified company
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this company.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMyReviews = async (req, res) => {
    const { userId } = req.params; 

    try {
        // Find reviews associated with the provided companyId
        const reviews = await Review.find({ userId }).sort({ createdAt: -1 });

        // Check if there are reviews for the specified company
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this company.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addReview = async (req, res) => {
    const { companyId, companyName, userId, rating, comment, status, email, user } = req.body;

    try {
        const review = new Review({
            companyId,
            companyName,
            userId,
            rating,
            comment,
            status,
            email,
            user
        });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateReview = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            error: "No such review found..."
        })
    }

    const review = await Review.findByIdAndUpdate(
        {_id : id},
        {
            ...req.body,
        }
    );

    if(!review){
        return res.status(400).json({
            error: "No such review found..."
        })
    }

    res.status(200).json(review);

};



const deleteReview = async (req, res) => {
    const { id } = req.params; // Extract review ID from request parameters

    try {
        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such review found.' });
        }

        // Find and delete the review by its ID
        const review = await Review.findByIdAndDelete(id);

        // If no review was found, return a 404 error
        if (!review) {
            return res.status(404).json({ error: 'No such review found.' });
        }

        res.status(200).json({ message: 'Review successfully deleted.', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getReview,
    getRelevantReview,
    getMyReviews,
    addReview,
    deleteReview,
    updateReview
};
