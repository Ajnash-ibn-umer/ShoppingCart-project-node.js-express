const db = require("../config/connection");
const collections = require("../config/collections");
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectID

module.exports = {

    signupUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)

            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((result) => {
                resolve(result)
            })
        })

    },

    loginUser: (userData) => {

        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login faileds');
                resolve({ status: false })

            }
        })

    },

    addtoCart: (proId, userId) => {
        
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user:objectId(userId)})

            if (userCart) {

            } else {
                let cartObj = {
                    user: userId,
                    products: [
                        proId
                    ]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then(() => {
                    resolve()
                })
            }
        })


    }
}