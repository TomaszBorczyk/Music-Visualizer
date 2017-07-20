const TrackController = require('../controllers/track.controller');
const express = require('express');
const router = express.Router();

// module.exports = (app)=>{
//   app.use('/', TrackController.getTracks);
// }s

router.get('/', TrackController.getTracks);

module.exports = router;
