const db = require('../config/connection')
const collections = require('../config/collections')
const bcrypt = require('bcrypt')
const objectId = require('mongodb').ObjectID
const util = require('util')
const { response } = require('express')
const { CART_COLLECTION } = require('../config/collections')
module.exports = {
  signupUser: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10)

      db.get()
        .collection(collections.USER_COLLECTION)
        .insertOne(userData)
        .then((result) => {
          resolve(result)
        })
    })
  },

  loginUser: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {}
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: userData.email })
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log('login success')
            response.user = user
            response.status = true
            resolve(response)
          } else {
            console.log('login failed')
            resolve({ status: false })
          }
        })
      } else {
        console.log('login faileds')
        resolve({ status: false })
      }
    })
  },

  addtoCart: (proId, userId) => {
    let prodObj = {
      item: objectId(proId),
      quantity: 1,
    }
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) })

      if (userCart) {
        let proCart = await userCart.products.findIndex(
          (product) => product.item == proId,
        )
        if (proCart != -1) {
          await db
            .get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { 'products.item': objectId(proId) },
              {
                $inc: {
                  'products.$.quantity': 1,
                },
              },
            )
            .then(() => {
              resolve()
            })
        } else {
          await db
            .get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { user: objectId(userId) },
              {
                $push: {
                  products: prodObj,
                },
              },
            )
            .then((response) => {
              resolve()
            })
        }
      } else {
        let cartObj = {
          user: objectId(userId),
          products: [prodObj],
        }
        await db
          .get()
          .collection(collections.CART_COLLECTION)
          .insertOne(cartObj)
          .then(() => {
            resolve()
          })
      }
    })
  },
  getCartProduct: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: { path: '$products' },
          },
          {
            $lookup: {
              from: 'products',
              localField: 'products.item',
              foreignField: '_id',
              as: 'cartItem',
            },
          },
          {
            $project: {
              _id: 1,
              user: 1,
              item: '$products.item',
              quantity: '$products.quantity',
              cartItem: { $arrayElemAt: ['$cartItem', 0] },
            },
          },
        ])
        .toArray()
      console.log(util.inspect(cartItems, false, null, true))
      //
      resolve(cartItems)
    })
  },
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) })

      if (cart) {
        let count = cart.products.length
        resolve(count)
      } else {
        resolve(0)
      }
    })
  },
  changeCartCount: (cart) => {
    let cartId = cart.cart
    let count = cart.count
    let prodId = cart.proid
    console.log(cartId)
    console.log(prodId)
    count = parseInt(count)
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .updateOne(
          { _id: objectId(cartId), 'products.item': objectId(prodId) },
          {
            $inc: {
              'products.$.quantity': count,
            },
          },
        )
        .then(() => {
          let response = {
            count: count,
          }

          resolve(response)
        })
    })
  },

  removeCartProduct: (proId, cartId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collections.CART_COLLECTION)
        .updateOne(
          { _id: objectId(cartId) },
          {
            $pull: { products: { item: objectId(proId) } },
          },
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: { path: '$products' },
          },
          {
            $lookup: {
              from: 'products',
              localField: 'products.item',
              foreignField: '_id',
              as: 'cartItem',
            },
          },
          {
            $project: {
              
              item: '$products.item',
              quantity: '$products.quantity',
              cartItem: { $arrayElemAt: ['$cartItem', 0] },
            }
          },{
            $group:{
              _id:null,
              total:{$sum:{$multiply:[{ $toInt: '$quantity' },{ $toInt: '$cartItem.price' }]}}
            }
          }
        ])
        .toArray()
      console.log(util.inspect(cartItems[0], false, null, true))
     
      resolve(cartItems[0].total)
    })
  },
}
