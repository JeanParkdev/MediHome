const router = require('express').Router();
const userRoutes = require('./userRoutes');
const medicationRoutes = require('./medicationRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const allergyRoutes = require('./allergyRoutes');

router.use('/users', userRoutes);
router.use('/medications', medicationRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/allergies', allergyRoutes);
module.exports = router;