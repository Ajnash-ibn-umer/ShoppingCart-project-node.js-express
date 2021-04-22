
var express = require('express');
var router = express.Router();
var collections = require('../config/collections')
var adminHelper = require("../helpers/admin-helper");
const userHelper = require('../helpers/user-helper');
/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/', function (req, res) {
let user=req.session.user
//console.log(user);
  let products = adminHelper.getAllProduct().then((products) => {
    res.render('./user/user.hbs', { admin: false, products,user });
  })

});

router.get('/login', (req, res) => {
  if(req.session.loggedIn===true){
    res.redirect('/')
  }else{
    res.render('user/login',{loginErr:req.session.loginErr});
    req.session.loginErr=false
  }
  
})

router.get('/signup', (req, res) => {
  res.render('user/signup');
})

router.post('/signup', (req, res) => {
  userHelper.signupUser(req.body).then((response) => {
    let user=response.ops[0]
    req.session.loggedIn=true
    req.session.user=user
    res.redirect('/')
  })
})

router.post('/login', (req, res) => {
  userHelper.loginUser(req.body).then((data) => {
    if (data.status) {
      req.session.loggedIn=true
      req.session.user=data.user

      res.redirect('/')
    } else {
      req.session.loginErr=true
      res.redirect('/login')
    }


  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

router.get('/cart',verifyLogin,(req,res)=>{
  let user=req.session.user
  res.render('user/cart',{user})
})

router.get('/add-to-cart/:proId',verifyLogin,(req,res)=>{
  let proId=req.params.proId
  let userId=req.session.user._id
  userHelper.addtoCart(proId,userId).then(()=>{
    res.redirect('/')
  })
})
module.exports = router;

