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

    }
}