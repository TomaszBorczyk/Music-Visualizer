const chai = require('chai'),
      userModel = require('../../app/models/user.model'),
      userCtrl = require('../../app/controllers/user.controller'),
      mockJson = require('../fixtures/fixture'),
      sinon = require('sinon'),
      sinonChai = require('sinon-chai'),
      mongoose = require('mongoose'),
      fixture = require('../fixtures/fixture'),
      should = chai.should();

require('sinon-mongoose');
chai.use(sinonChai);

describe.only('Users', function(){
  // var UserMock = sinon.mock(userModel);
  //
  // beforeEach((done)=>{
  //   userModel.remove({}, (err)=>{
  //     console.log("user collection removed");
  //
  //     //inserting data
  //     var users = (mockJson.collections['users']);
  //     users.map( user =>{
  //       var nUser = new userModel(user);
  //       userModel.create(nUser);
  //     });
  //     done();
  //   })
  // })


  describe('getUsers', function(){

    it('should return status 200 and all users', function(){
      var mockUsers = [
        {
          name: "user1"
        },
        {
          name: "user2"
        }
      ];

      var stubFind = sinon.stub(userModel, 'find').callsArgWith(1, null, mockUsers);
      var req = { param: 123 };
      var res = { status: sinon.spy(), json: sinon.spy() };

      userCtrl.getUsers(req, res);
      stubFind.should.have.been.calledOnce;
      res.status.should.have.been.calledWith(200);
      res.json.should.have.been.calledWith(
        {
          users: mockUsers
      });
      userModel.find.restore();
    })

    it('should return status 500 and error message if error is thrown', function(){
      var mockError = {
        message: "Error"
      }

      sinon.stub(userModel, 'find').callsArgWith(1, mockError, null);

      req = { param: 123};
      res = { status: sinon.spy(), json: sinon.spy() };

      userCtrl.getUsers(req, res);
      res.status.should.have.been.calledWith(500);
      res.json.should.have.been.calledWith({ error: mockError.message})
      userModel.find.restore();

    })

  }) // end of getUsers describe

  describe('getUserById', function(){
    it('should call findById once', function(){

      var spyFind = sinon.spy(userModel, 'findById');

      var req = { params: { id: 123 } };
      var res = {};

      userCtrl.getUserById(req, res);
      spyFind.should.have.been.calledOnce;
      userModel.findById.restore();
    })

    it('should return status 500 and error message if error occured', function(){

      var error = { message: "error"};
      var stubFind = sinon.stub(userModel, 'findById').callsArgWith(1, error, null);
      var req = {params: { id: 123}};
      var res = { status: sinon.spy(), json: sinon.spy() };

      userCtrl.getUserById(req, res);
      res.status.should.have.been.calledWith(500);
      res.json.should.have.been.calledWith({ error: error.message});
      userModel.findById.restore();
    })

    it('should return status 200 and user found', function(){
      var mockUser = {
        username: "JohnSmith",
        email: "smith@email.com",
        password: "password",
        tracks:
        [{
            name: "Gaga",
            link: "youtu.be/gaga"
        }]
      };

      var stubFind = sinon.stub(userModel, 'findById').callsArgWith(1, null, mockUser);

      req = { params: { id: 123 }};
      res = { status: sinon.spy(), json: sinon.spy() };

      userCtrl.getUserById(req, res);
      res.status.should.have.been.calledWith(200);
      res.json.should.have.been.calledWith({ user: mockUser });
      userModel.findById.restore();
    })
  }) // end of getUserById describe


  describe('postUser', function(){
    it('should call create once', function(){
      var mockUser = {
        username: "JohnSmith",
        email: "smith@email.com",
        password: "password",
        tracks:
        [{
            name: "Gaga",
            link: "youtu.be/gaga"
        }]
      };

      var spyCreate = sinon.spy(userModel, 'create');
      var req = { param: { user: mockUser}};
      var res = { };

      userCtrl.postUser(req, res);
      spyCreate.should.have.been.calledOnce;
      userModel.create.restore();
    });

    it('should return error message if error is thrown ', function(){
      var error = {message: "error"};
      var req = {param: { user: ''}};
      var stubCreate = sinon.stub(userModel, 'create').callsArgWith(1, error, null);
      var res = { status: sinon.spy(), json: sinon.spy() }

      userCtrl.postUser(req, res);
      res.status.should.have.been.calledWith(500);
      res.json.should.have.been.calledWith({error: error.message});
      userModel.create.restore();
    })

    it('should return status 200 and user created if no error occurs', function(){
      var mockUser = {
        username: "JohnSmith",
        email: "smith@email.com",
        password: "password",
        tracks:
        [{
            name: "Gaga",
            link: "youtu.be/gaga"
        }]
      };

      var stubCreate = sinon.stub(userModel, 'create').callsArgWith(1, null, mockUser);
      var req = { param: {user: mockUser} };
      var res = { status: sinon.spy(), json: sinon.spy() };

      userCtrl.postUser(req, res);
      res.status.should.have.been.calledWith(200);
      res.json.should.have.been.calledWith({user: mockUser});
      userModel.create.restore();
    })

  }) // end of postUser describe


  describe('updateUser', function(){
    it('should call update once', function(){

    })
  }) // end of updateUser describe

  describe.only('postRegister', function(){
    it('should call register once', function(){
      var spyRegister = sinon.spy(userModel, 'register');

      var req = { body: {username: 'bob', password: 'password'}};
      var res = {};
      var next = function(){};

      userCtrl.postRegister(req, res, next);
      spyRegister.should.have.been.calledOnce;
      userModel.register.restore();
    })

    it('should call next(err) if error occurs', function(){
      var err = 'error occured';
      var req = { body: {username: 'bob', password: 'password'}};
      var res = { redirect: function(){}};
      var next = sinon.spy();
      var stubRegister = sinon.stub(userModel, 'register').callsArgWith(2, err);

      userCtrl.postRegister(req, res, next);
      next.should.have.been.calledOnce;
      next.should.have.been.calledWith(err);
      userModel.register.restore();
    })

    it('should redirect to /', function(){
      var req = { body: {username: 'bob', password: 'password'}};
      var res = { redirect: sinon.spy()};
      var next = {};
      var stubRegister = sinon.stub(userModel, 'register').callsArgWith(2, null);

      userCtrl.postRegister(req, res, next);
      res.redirect.should.have.been.calledOnce;
      res.redirect.should.have.been.calledWith('/');
      userModel.register.restore();
    })

  })//end of postRegister describe

}) // end of User describe
