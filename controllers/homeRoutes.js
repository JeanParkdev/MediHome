const router = require('express').Router();

// The main page
router.get('/', async (req, res) => {
  try {
    // Just verify it works
    res.render('homepage'); 
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;