const express = require("express");
const { 
    getReview,
    getRelevantReview,
    getMyReviews,
    addReview,
    updateReview,
    deleteReview
 } = require("../controllers/reviewController");

const router = express.Router();

const requireAuth = require('../middleware/requireAuth');

router.get("/reviews", getReview);
router.get('/reviews/:companyId', getRelevantReview);
router.get('/myReviews/:userId', requireAuth, getMyReviews);
router.post('/reviews', addReview);
router.patch('/reviews/:id',updateReview)
router.delete("/reviews/:id",requireAuth, deleteReview);

module.exports = router;
