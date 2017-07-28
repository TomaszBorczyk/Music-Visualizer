const User = require('../models/user.model'),
      passport = require('passport');

module.exports = {

  getUsers: function(req, res){
    User.find({}, function(err, users){
      if(err){
        res.status(500);
        res.json({error: err.message});
        return;
      }
      res.status(200);
      res.json({users: users});
    })

  },

  getUserById: function(req, res){
    User.findById(req.params.id, function(err, user){
      if(err){
        res.status(500);
        res.json({ error: err.message});
        return;
      }
      res.status(200);
      res.json({ user: user });
    })
  },

  checkUser: function(req, res){
    var key = Object.keys(req.body)[0];
    var value = req.body[key];
    var object = {};
    object[key] = value;
    console.log(object);

    User.findOne(object, function(err, user){
      if(err){
        res.status(400);
        res.json({error: err.message});
        return;
      }
      res.status(200);
      if(!user){
        res.json({found: false});
      } else{
        res.json({found: true});

      }
    })
  },

  postUser: function(req, res){
    User.create(req.params.user, function(err, user){
      if(err){
        res.status(500);
        res.json({error: err.message});
        return;
      }
      res.status(200);
      res.json({user: user});
    })
  },

  updateUser: function(req, res){

  },

  deleteUser: function(req, res){

  },

  postRegister: function(req, res, next){
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err){
      if(err){
        console.log('err while registering', err);
        next(err);
      }
      console.log('user registered');

      // res.redirect('/');
      res.send({success: true});
    })
  },

  postLogin: function(req, res){
    console.log('logged in as '+req.user.username);
    // res.redirect('/');
  },

  getLogout: function(req, res){
    req.logout();
    // res.redirect('/');
  },

  postTrack: function(req, res){

    User.findByIdAndUpdate(
      req.user.id,
      { $push: { "tracks": { name: req.body.name, link: req.body.link }}},
      { new: true, upsert: true },
      function (err, user) {
        if (err) return next(err);
        res.send(user);
      }
    );

  }



};
