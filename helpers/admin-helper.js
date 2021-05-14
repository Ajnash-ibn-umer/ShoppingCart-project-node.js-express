const db = require("../config/connection");
const collections = require("../config/collections");
const objectId = require('mongodb').ObjectID

module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("products")
      .insertOne(product)
      .then((data) => {
        console.log("database insert " + data);
        callback(data.ops[0]._id);
      });
  },
  getAllProduct: async () => {
    let product = await db.get().collection(collections.PROUDCT_COLLECTION).find().toArray();
    return product;
  },

  deleteProduct: (proid) => {
    return new Promise(async (resolve, rejection) => {
      await db.get().collection(collections.PROUDCT_COLLECTION).removeOne({ _id: objectId(proid) })
      resolve()
    })

  },
  getProductDetail: (proid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.PROUDCT_COLLECTION).findOne({ _id: objectId(proid) }).then((product) => {
        console.log("database prdct" + product);
        resolve(product)
      })
    })

  },
  updateProduct: (proid, proDetails) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.PROUDCT_COLLECTION).updateOne({ _id: objectId(proid) }, {
        $set: {
          name: proDetails.name,
          price: proDetails.price,
          description: proDetails.description

        }
      }).then((updatedProduct) => {
        resolve(updatedProduct)
      })
    })
  },

  verifyLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let user = await db.get().collection('admin').findOne({ email: adminData.email })
      if (user) {
        console.log('admin email is success');
        if (user.password === adminData.password) {
          adminData.admin = user
          adminData.loggedIn = true
          resolve(adminData)
          console.log('password success');
        } else {
          console.log('password is not match');
          adminData.loggedIn = false
          resolve(adminData)
        }

      } else {
        console.log('admin email failed');
        adminData.loggedIn = false
        resolve(adminData)
      }
    })
  }

};
