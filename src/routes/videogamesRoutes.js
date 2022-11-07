const {Router} = require('express');
const { getAllVideogames, getVideogameById,createVideogame } = require('../controllers/videogamesController');


const router = Router();

router.get('/', getAllVideogames);
router.get('/:id', getVideogameById);
router.post('/create', createVideogame )





module.exports = router