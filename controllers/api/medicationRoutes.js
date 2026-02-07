const router = require('express').Router();
const { Medication } = require('../../models');
const withAuth = require('../../utils/auth');

// POST /api/medications - Create a new medication
router.post('/', withAuth, async (req, res) => {
  try {
    const newMedication = await Medication.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newMedication);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE /api/medications/:id - Delete a medication
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const medData = await Medication.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!medData) {
      res.status(404).json({ message: 'No medication found with this id!' });
      return;
    }

    res.status(200).json(medData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;