var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin-helper')
/* GET users listing. */
let admin = true
router.get('/', function (req, res, next) {


  let product = [
    {
      name: 'samsung A32',
      description: 'mid range smart phone',
      price: 70000,
      image: "/images/m1.jpg"
    },
    {
      name: 'samsung A72',
      description: 'this is a smart phone',
      price: 66000,
      image: './images/m2.jpg'
    }, {
      name: 'moto g5',
      description: 'this is stock android',
      price: 36000,
      image: './images/m3.jpg'
    }, {
      name: 'samsung note 20 ultra',
      description: 'this is a flagship high range smart phone',
      price: 100000,
      image: './images/m4.jpg'
    },
    {
      name: 'samsung s20fe',
      description: 'this is budget range smartphone',
      price: 50000,
      image: './images/m5.jpg'
    }
  ]
  res.render('admin/admin-panel.hbs', { admin, product })
});
router.get('/add-product', (req, res) => {
  res.render('admin/add-product', { admin: true })
})
router.post('/add-product', (req, res) => {
  console.log(req.body);
  console.log(req.files.image);
  adminHelper.addProduct(req.body, (id) => {
    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product.hbs', { admin })
      } else {
        console.log(err);
      }
    })



  })

})
module.exports = router;
