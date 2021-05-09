
var express = require('express');
var router = express.Router();
var collections = require('../config/collections')
var adminHelper = require("../helpers/admin-helper");
const userHelper = require('../helpers/user-helper');
const util = require('util');
const { assert } = require('console');
const { response } = require('express');
/* GET home page. */
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/', async function (req, res) {
  let user = req.session.user
  let count = null

  let products = adminHelper.getAllProduct().then(async (products) => {

    if (req.session.user) {
      let count = await userHelper.getCartCount(req.session.user._id)
      console.log('count:' + count);
      res.render('./user/user.hbs', { admin: false, products, user, count });
    }
    res.render('./user/user.hbs', { admin: false, products, user, count });


  })

});

router.get('/login', (req, res) => {
  if (req.session.loggedIn === true) {
    res.redirect('/')
  } else {
    res.render('user/login', { loginErr: req.session.loginErr });
    req.session.loginErr = false
  }

})

router.get('/signup', (req, res) => {
  res.render('user/signup');
})

router.post('/signup', (req, res) => {
  userHelper.signupUser(req.body).then((response) => {
    let user = response.ops[0]
    req.session.loggedIn = true
    req.session.user = user
    res.redirect('/')
  })
})

router.post('/login', (req, res) => {
  userHelper.loginUser(req.body).then((data) => {
    if (data.status) {
      req.session.loggedIn = true
      req.session.user = data.user

      res.redirect('/')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }


  })
})


router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let userId = req.session.user._id
  let user = req.session.user
  let products = await userHelper.getCartProduct(userId)
  let total=0
  if (products.length) {
     total = await userHelper.getTotalAmount(userId)
    res.render('user/cart', { user, products, total })
  }else{
    res.send('cart is not available')
  }
 

})

router.get('/add-to-cart/:proId', verifyLogin, async (req, res) => {
  let proId = req.params.proId
  let userId = req.session.user._id

  console.log('api geted');
  userHelper.addtoCart(proId, userId).then(() => {
    res.json({ status: true })
  })
})

router.post('/changecount', async (req, res) => {
  //console.log(req.body);
  console.log('user' + req.session.user._id);
  await userHelper.changeCartCount(req.body).then(async (response) => {
    // console.log('response: ' + response);

    response.total = await userHelper.getTotalAmount(req.session.user._id)

    res.json(response)
  })
})

router.post('/remove-product', async (req, res) => {

  let proId = req.body.proId
  let cartId = req.body.cartId

  await userHelper.removeCartProduct(proId, cartId).then((response) => {
    console.log(response);
    res.json({
      status: true,
      response
    })
  })
})


router.get('/cart/place-order', verifyLogin, async (req, res) => {
  let userId = req.session.user._id
  let user = req.session.user
  await userHelper.getTotalAmount(userId).then((response) => {
    let total = response
    console.log('t:' + total);
    res.render('user/place-order', { user, total })
  })

})

router.post('/checkout-form', async (req, res) => {
  let userId = req.session.user._id
  let products = await userHelper.getCart(userId)
  let total = await userHelper.getTotalAmount(userId)
  console.log('total: ' + total);
  await userHelper.addOrder(userId, products, total, req.body).then(async (response) => {
    console.log(req.body);
    console.log('res:' + response);
    if (response.status === 'Placed') {
      res.json(response)
    } else if (response.status === 'pending') {
      await userHelper.razorPay(response.orderId, total).then((response) => {
        console.log('Res :' + response.status);
        res.json(response)
      })

    }


  })


})
router.get('/checkout', verifyLogin, (req, res) => {

  res.render('user/checkout', { user: req.session.user })
})

router.get('/order-list', verifyLogin, async (req, res) => {
  userId = req.session.user._id
  await userHelper.getOrderList(userId).then((orders) => {
    res.render('user/order_list', { orders, user: req.session.user })
  })

})

router.post('/verifyPayment', (req, res) => {
  console.log(req.body);
  userHelper.verifyPayment(req.body).then(() => {
    userHelper.changeStatus(req.body["order[receipt]"]).then(() => {
      res.json({ status: true })
    }).catch((err) => {
      console.log('err', err);
      res.json({ status: false })
    })
  })
})
module.exports = router;

