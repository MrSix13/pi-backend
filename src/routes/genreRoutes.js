const {Router} = require('express');
const {getAllGenres} = require('../controllers/genreController')

const router = Router();

router.get('/', getAllGenres)

module.exports = router