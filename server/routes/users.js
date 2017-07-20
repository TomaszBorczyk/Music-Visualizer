const UserController = require('../controllers/user.controller'),
      router = require('express').Router(),
      passport = require('passport'),
      isLoggedIn = require('../helpers/session-authenticate').isLoggedIn;

router.get('/', (req, res)=>{
  res.send({status: 200, body: "users"});
});
router.post('/register', UserController.postRegister);
router.post('/login', passport.authenticate('local'), UserController.postLogin);
router.get('/logout', UserController.getLogout);
router.post('/track/add', isLoggedIn, UserController.postTrack);

module.exports = router;
