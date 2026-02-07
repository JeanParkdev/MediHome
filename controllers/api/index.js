const router = require('express').Router();
const userRoutes = require('./userRoutes');
const medicationRoutes = require('./medicationRoutes');
const doctorRoutes = require('./doctorRoutes');


router.use('/users', userRoutes);
router.use('/medications', medicationRoutes);
router.use('/doctors', doctorRoutes);

module.exports = router;