const router = require('express').Router();

// The main page
router.get('/', async (req, res) => {
  try {
    res.render('homepage'); 
  } catch (err) {
    res.status(500).json(err);
  }
});
//Signup page
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});
//login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

module.exports = router;