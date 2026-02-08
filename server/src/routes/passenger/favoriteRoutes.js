const express = require('express');
const router = express.Router();
const {
    addFavorite,
    getFavorites,
    removeFavorite,
    removeFavoriteByRoute,
    checkFavorite,
    getFavoriteStats
} = require('../../controllers/passenger/favoriteController');
const { validateFavorite } = require('../../middlewares/validation');

// Note: Add authentication middleware here
// const { protect } = require('../../middlewares/auth');
// router.use(protect);

// Favorite routes
router.post('/', validateFavorite, addFavorite);
router.get('/', getFavorites);
router.get('/stats', getFavoriteStats);
router.get('/check/:routeId', checkFavorite);
router.delete('/:id', removeFavorite);
router.delete('/route/:routeId', removeFavoriteByRoute);

module.exports = router;
