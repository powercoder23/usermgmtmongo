var express = require('express');

// Mongoose import
var mongoose = require('mongoose');

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
    lastName: String
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
            console.log(req.body.user);

            var user = new User(req.body.user);
            user.save(function(err, user) {
                if (err) return console.error(err);
                res.json(user);
            });

        });

    router.route('/user/:id')
        .delete(function(req, res) {
            console.log(req.params.id);

            User.find({_id:req.params.id}).remove().exec();
            res.send({message:'ok'});

        })
        .get(function(req, res) {

        })

    return router;
})();
