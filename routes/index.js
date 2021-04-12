var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
 let admin=true
  let product = [
  {
    name: 'iphone',
      description: 'this is a smart phone',
        image:"/images/m1.jpeg"
  },
  {
    name: 'samsung',
      description: 'this is a smart phone',
        image: './images/m2.jpeg'
  }
  ]
  res.render('index', { product ,admin});
});

module.exports = router;
