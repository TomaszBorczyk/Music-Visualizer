const User = require('../models/user.model');

module.exports = {

  getIndex: (req, res)=>{
              res.send('index');
            },

  getUser: function(req, res){
    res.send(req.user);
  }

}
