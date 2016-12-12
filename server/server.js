var express = require('express');
var app = express();
var jwt = require('jwt-simple');
var userControllers = require('./users/userControllers.js');

var path = require('path');
var bodyParser = require('body-parser');

var db = require('./schemas');

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// API - require username
app.get('/videos', function (req, res) {
  // req.query.username is passed in from the get request
  var results = [];
  db.User.findOne({where: {username: req.query.username}}).then(function (user) {
    db.Video.findAll({where: {userId: user.get('id')}}).then(function (videos) {
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        db.Comment.findAll({where: {videoId: video.get('id')}}).then(function (comments) {
          var videoObject = {
            url: video.url,
            title: video.title,
            comments: comments
          };
          results.push(videoObject);
          if (i === videos.length) {
            res.status(200).send(results);
          }
        });
      }
    });
  });
});

app.post('/comment-video', function (req, res) {
  db.User.findOrCreate({where: {username: req.body.username}})
    .then(function (user) {
      db.Video.findOrCreate({where: { url: req.body.videoUrl, title: req.body.videoTitle, UserId: user[0].get('id') }})
        .then(function (video) {
          db.Comment.findOrCreate({ where: { title: req.body.commentTitle, text: req.body.commentText, timestamp: req.body.timestamp, UserId: user[0].get('id'), VideoId: video[0].get('id') }});
        });
    });
  res.status(201).send('sent');
});


//We use token-based authentication so this application has the potential to scale

app.post('/users/signup', userControllers.signup);

//function (req, res) {
  // console.log('TESTST')
  // //find one first if null, create one
  // db.User.findOne({where: {username: req.body.username}})
  //   .then(function (user) {
  //     console.log(user, 'SIGNUP 57');
  //     // the user doesn't exists, create the user
  //     if (!user) {

  //       db.User.create()
  //     }
  //     res.send(user);
  //   })


  // db.User.create({where: {username: req.body.username, password: req.body.password}})
  //   .then(function (user){
  //     // create token to send back for auth
  //     console.log()
  //     var token = jwt.encode(user, 'secret');
  //     res.json({token: token});
      
  //     res.send(token);
  //   })
  //send them back a response token
//}


app.post('/users/login', function (req, res) {
  // this allows us to find a user and see if the user exists exists 
  db.User.findOne({where: {username: req.body.username}})
    .then(function (user) {
      var currentUser = user.get('username')
            // create token to send back for auth
      var token = jwt.encode(currentUser, 'secret');
      res.json({token: token});
      
      res.send(token);
    })
  //send them back a response token
})


app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

