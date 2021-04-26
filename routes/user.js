
var express = require('express');
var router = express.Router();
var collections = require('../config/collections')
var adminHelper = require("../helpers/admin-helper");
const userHelper = require('../helpers/user-helper');
const util = require('util');
const { assert } = require('console');
/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/',async function (req, res) {
let user=req.session.user
let count=null

  let products = adminHelper.getAllProduct().then(async(products) => {
    
    if(req.session.user){
      let count=await userHelper.getCartCount(req.session.user._id)
      console.log('count:'+count);
      res.render('./user/user.hbs', { admin: false, products,user,count });
    }
    res.render('./user/user.hbs', { admin: false, products,user,count });

    
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

router.get('/cart',verifyLogin,async(req,res)=>{
  let userId=req.session.user._id
let user=req.session.user
 let products=await userHelper.getCartProduct(userId)

  res.render('user/cart',{user,products})
  
})

router.get('/add-to-cart/:proId',verifyLogin,async(req,res)=>{
  let proId=req.params.proId
  let userId=req.session.user._id
  
    

  console.log('api geted');
  userHelper.addtoCart(proId,userId).then(()=>{
    res.json({status:true})
  })
})


module.exports = router;

