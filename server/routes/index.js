
const IndexController = require('../controllers/index.controller');
       express = require('express'),
       router = express.Router(),
       helpers = require('../helpers/session-authenticate'),
       passport = require('passport');

router.get('/', IndexController.getIndex);
router.get('/user', helpers.isLoggedIn, IndexController.getUser);

module.exports = router;
