var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(session({
    store: new RedisStore({}),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  if (req.session.user) {
    res.redirect('/admin');
  }else {
    res.render('login.html');
  }
});

app.get('/admin', function (req, res) {
  if (req.session.user) {
    res.render('admin.html', {user : req.session.user, pid : process.pid});
  } else {
    res.render('denied.html');
  }
});
app.post('/login', function (req, res) {
  req.session.user = req.body.user;
  res.redirect('/admin');
});
app.get('/logout', function (req, res) {
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
