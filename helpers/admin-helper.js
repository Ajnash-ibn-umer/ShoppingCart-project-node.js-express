const db = require("../config/connection");
const collections = require("../config/collections");
const objectId=require('mongodb').ObjectID

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
  getAllProduct: async() => {
    let product =await db.get().collection(collections.PROUDCT_COLLECTION).find().toArray(); 
    return product;
    },
   
    deleteProduct:(proid)=>{
      return new Promise (async(resolve,rejection)=>{
       await db.get().collection(collections.PROUDCT_COLLECTION).removeOne({_id:objectId(proid)})
       resolve()
      })
     
    },
getProductDetail:(proid)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collections.PROUDCT_COLLECTION).findOne({_id:objectId(proid)}).then((product)=>{
      console.log("database prdct"+product);
      resolve(product)
    })
  })

},
    updateProduct:(proid,proDetails)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collections.PROUDCT_COLLECTION).updateOne({_id:objectId(proid)},{
          $set:{
            name:proDetails.name,
            price:proDetails.price,
            description:proDetails.description

          }
        }).then((updatedProduct)=>{
          resolve(updatedProduct)
        })
      })
    }
  
};
