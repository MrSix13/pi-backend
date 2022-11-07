const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogamesRoutes = require('./videogamesRoutes')
const genreRoutes = require('./genreRoutes');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/genress', genreRoutes)
router.use('/videogames', videogamesRoutes)



module.exports = router;
