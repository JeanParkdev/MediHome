const router = require('express').Router();
const userRoutes = require('./userRoutes');
const medicationRoutes = require('./medicationRoutes');


router.use('/users', userRoutes);
router.use('/medications', medicationRoutes);

module.exports = router;