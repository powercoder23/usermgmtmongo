var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Mongoose import
var mongoose = require('mongoose');
var Q = require("q");

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost:27017/chartnaka', function(error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    pass:String,
    uid: String
});

// Mongoose Model definition
var User = mongoose.model('users', UserSchema);


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ uid: uid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

module.exports = (function() {
    'use strict';
    var router = express.Router();


    router.post('/login', passport.authenticate('local'), function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/');
    });

    router.get('/users', function(req, res) {
        User.find({}, function(err, docs) {
            res.json(docs);
        });
    });

    router.route('/user')
        .post(function(req, res) {

            var obj = req.body.user;
            getUID(obj.firstName, obj.lastName).then(function(id) {
                console.log('id');
                console.log(id);
                obj.uid = id;

                var user = new User(obj);
                user.save(function(err, user) {
                    if (err) return console.error(err);
                    res.json(user);
                });
            })

        });

    function getUID(fname, lname) {


        var deferred = Q.defer();
        var charCount = 1;

        generate();

        function generate() {
            var tempUID = String(fname.substr(0, charCount) + lname).toLowerCase();
            User.find({
                uid: tempUID
            }, function(err, docs) {

                if (err) {
                    deferred.reject(err);
                    return console.error(err);
                }
                if (docs.length < 1) {
                    deferred.resolve(tempUID);
                } else {
                    charCount++;
                    generate();
                }
            });
        }

        return deferred.promise;
    }

    router.route('/user/:id')
        .delete(function(req, res) {

            User.find({
                _id: req.params.id
            }).remove().exec();
            res.send({
                message: 'ok'
            });

        })
        .put(function(req, res) {

            User.findOneAndUpdate({_id:req.params.id}, req.body.user, function (err, user) {
                res.send(req.body.user);
            });
        })

    return router;
})();
