var express = require('express');

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
    uid: String
});

// Mongoose Model definition
var User = mongoose.model('users', UserSchema);

module.exports = (function() {
    'use strict';
    var router = express.Router();

    router.get('/users', function(req, res) {
        User.find({}, function(err, docs) {
            res.json(docs);
        });
    });

    router.route('/user')
        .post(function(req, res) {

            var obj = req.body.user;
            getUID(obj.firstName, obj.lastName).then(function(id) {
                console.log('reso');
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
            var tempUID = fname.substr(0, charCount) + lname;
            User.find({
                uid: tempUID.toLowerCase()
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
