const { response } = require('express');
var express = require('express');
var router = express.Router();
var collections = require('../config/collections')
var adminHelper = require("../helpers/admin-helper");
const userHelper = require('../helpers/user-helper');
/* GET home page. */


router.get('/', function (req, res, next) {
  let products = adminHelper.getAllProduct().then((products) => {
    res.render('./user/user.hbs', { admin: false, products });
  })

});

router.get('/login', (req, res) => {
  res.render('user/login');
})

router.get('/signup', (req, res) => {
  res.render('user/signup');
})

router.post('/signup',(req,res)=>{
userHelper.signupUser(req.body).then((response)=>{
  console.log(response.ops[0]);
})
})
module.exports = router;

