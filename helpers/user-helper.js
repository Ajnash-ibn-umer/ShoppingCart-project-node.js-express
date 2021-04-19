const db = require("../config/connection");
const collections = require("../config/collections");
const bcrypt = require('bcrypt')

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
            let response={}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user=user
                        response.status=true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            } else {
                console.log('login faileds');
                resolve({status:false})

            }
        })

    }
}