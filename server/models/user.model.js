const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  // username: String,
  email: String,
  // password: String,
  created_date: {type: Date, default: Date.now},
  tracks:
  [{
      name: String,
      link: String,
      created_date: {type: Date, default: Date.now}
  }]

});

UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
