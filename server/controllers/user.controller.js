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
    User.register(new User({username: req.body.username}), req.body.password, function(err){
      if(err){
        console.log('err while registering', err);
        next(err);
      }
      console.log('user registered');

      res.redirect('/');
    })
  },

  postLogin: function(req, res){
    console.log('logged in as '+req.user.username);
    res.redirect('/');
  },

  getLogout: function(req, res){
    req.logout();
    res.redirect('/');
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
