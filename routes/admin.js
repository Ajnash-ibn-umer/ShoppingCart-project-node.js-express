const { Router } = require("express");
var express = require("express");
const { verifyLogin } = require("../helpers/admin-helper");
var router = express.Router();
var adminHelper = require("../helpers/admin-helper");

let admin = true;
const verifSession = (req, res, next) => {
  if (req.session.adminloggedIn) {
    next()
  } else {
    res.redirect('/admin')
  }
}
router.get("/", function (req, res, next) {
  if (req.session.admin) {
    let products = adminHelper.getAllProduct().then((products) => {
      let adminData = req.session.admin
      res.render('./admin/admin-panel', { adminData, admin, products });
    })

  } else {
    res.render('./admin/login', { admin })
  }

});
router.post('/login', (req, res) => {
  adminHelper.verifyLogin(req.body).then((adminData) => {
    if (adminData.loggedIn) {
      req.session.admin = adminData.admin
      req.session.adminloggedIn = adminData.loggedIn
      res.redirect('/admin')
    } else {
      res.redirect('/admin')
    }

  })
})

router.get('/logout', (req, res) => {
  req.session.admin = null
  req.session.adminloggedIn = false
  res.redirect('/admin')
})

router.get("/add-product", verifSession, (req, res) => {
  let adminData = req.session.admin
  res.render("admin/add-product", { adminData, admin: true });
});



router.post("/add-product", (req, res) => {
  console.log(req.body);
  console.log(req.files.image);
  adminHelper.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/product-images/" + id + ".jpg", (err) => {
      if (!err) {
        res.render("admin/add-product.hbs", { admin });
      } else {
        console.log(err);
      }
    });
  });
});


router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  adminHelper.deleteProduct(proId).then(() => {
    res.redirect('/admin')
  })
})


router.get('/edit-product/:id', verifSession, (req, res) => {
  let proId = req.params.id
  adminHelper.getProductDetail(proId).then((product) => {
    console.log('get product:' + product);
    let adminData = req.session.admin
    res.render('admin/edit-product', { admin, adminData, product })
  })

})

router.post('/edit-product/:id', (req, res) => {
  let proId = req.params.id
  let productDetails = req.body
  adminHelper.updateProduct(proId, productDetails).then((updatedPro) => {
    let image = req.files.image;
    console.log('updated pro:' + updatedPro);
    image.mv("./public/product-images/" + proId + ".jpg")
    res.redirect('/admin')
  })
})

router.get('/', (req, res) => {

})
module.exports = router;
