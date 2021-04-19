
var express = require('express');
var router = express.Router();
var collections = require('../config/collections')
var adminHelper = require("../helpers/admin-helper");
const userHelper = require('../helpers/user-helper');
/* GET home page. */


router.get('/', function (req, res) {
let user=req.session.user
console.log(user);
  let products = adminHelper.getAllProduct().then((products) => {
    res.render('./user/user.hbs', { admin: false, products,user });
  })

});

router.get('/login', (req, res) => {
  res.render('user/login');
})

router.get('/signup', (req, res) => {
  res.render('user/signup');
})

router.post('/signup', (req, res) => {
  userHelper.signupUser(req.body).then((response) => {
    res.redirect('/login')
  })
})

router.post('/login', (req, res) => {
  userHelper.loginUser(req.body).then((data) => {
    if (data.status) {
      req.session.loggedIn=true
      req.session.user=data.user

      res.redirect('/')
    } else {
      res.redirect('/login')
    }


  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})
module.exports = router;

