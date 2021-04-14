var express = require('express');
var router = express.Router();
var collections=require('../config/collections')
var adminHelper = require("../helpers/admin-helper");
/* GET home page. */
router.get('/', function (req, res, next) {
let products=adminHelper.getAllProduct().then((products)=>{
  res.render('./user/user.hbs', { admin:false,products});
})
  
});

module.exports = router;
    
