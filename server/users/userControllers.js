var db = require('../schemas');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var cipher = Promise.promisify(bcrypt.hash);



//jwt is stands for json web tokens. We used it in the angular sprint
module.exports = {
  signup: function (req, res, next) {
  console.log('FINDING');    
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOrCreate({where: {username: username, password: password}})
      .then(function (user) {
        // console.log(user, 'is user created!')
        var token = jwt.encode(user, 'secret');        
        res.json({token: token})
      })

    db.User.hook('beforeCreate', function (model, options) {
      console.log('INSIDE')
      return cipher(model.get('password'), null, null).bind(model)
        .then(function(hash) {
          model.set('password', hash);
        });
    })

    // return cipher(model.get('password'), null, null).bind(model)
    //   .then(function(hash) {
    //     this.set('password', hash);
    //   });
      
      // .then(function (hashedPassWord) {
      //   db.User.create({username: username, password: hashedPassword})
      //     .then(function (user) {
      //       console.log(user, 'is user created!')
      //       var token = jwt.encode(user, 'secret');        
      //       res.json({token: token})
      //     })
      // })
  },

  login: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOne({where: {username: req.body.username}})
      .then(function (user) {
        if (!user) {
          res.send('User does not exist!');
        } else {
        var currentUser = user.get('username')
            // create token to send back for auth
        var token = jwt.encode(currentUser, 'secret');
        res.json({token: token});
      }      
    })
    .catch(function () {
      res.send(500);
    })
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(password) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(password, null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash); //could be conflicting
      });
  }
};



  

// db.User.beforeCreate(function(user, options) {
//   return hashPassword(user.password).then(function (hashedPw) {
//     user.password = hashedPw;
//   });
// })

