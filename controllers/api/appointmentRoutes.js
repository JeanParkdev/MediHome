const router = require('express').Router();
const { Appointment } = require('../../models');
const withAuth = require('../../utils/auth');

// CREATE new appointment
router.post('/', withAuth, async (req, res) => {
  try {
    const newAppointment = await Appointment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newAppointment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE an appointment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const apptData = await Appointment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!apptData) {
      res.status(404).json({ message: 'No appointment found with this id!' });
      return;
    }

    res.status(200).json(apptData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;