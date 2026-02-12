const router = require('express').Router();
const { User, Medication, Doctor, Appointment, Allergy } = require('../models');
const withAuth = require('../utils/auth'); 

//GET dashboard

router.get('/', withAuth, async (req, res) => {
  try {
    // 1. Find the logged in user
    const userData = await User.findByPk(req.session.user_id, { 
      attributes: { exclude: ['password'] },
      include: [
        { model: Medication },
        { model: Doctor },   
        { model: Appointment },
        { model: Allergy}
      ],
      order: [[Appointment, 'date', 'ASC']]
    });

    const user = userData.get({ plain: true });

    // 2. Render dash and pass the user data

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;